from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
import uuid
import random
import string
from datetime import datetime, timedelta

tic_tac_toe_bp = Blueprint('tic_tac_toe', __name__, template_folder='templates')

class Game:
    def __init__(self):
        self.board = [None] * 9  # Das Spielfeld
        self.players = [None, None]
        self.current_player = 0  # Index des aktuellen Spielers
        self.stones = {'X': [], 'O': []}  # Positionen der Steine für jeden Spieler
        self.phase = 'place'  # 'place' oder 'move'
        self.selected_stone = None  # Position des ausgewählten Steins zum Verschieben
        self.last_activity = datetime.now()  # Neuer Zeitstempel
        self.scores = {'X': 0, 'O': 0}  # Punktestand für Best of 5
        self.games_played = 0  # Anzahl gespielter Runden
        self.player_names = {'X': None, 'O': None}  # Spielernamen
        self.move_deadline = None  # Noch keine Deadline setzen
        self.move_timeout = 7  # Zeitlimit in Sekunden
        self.game_started = False  # Neuer Flag für Spielstart

    def update_activity(self):
        self.last_activity = datetime.now()

    def is_inactive(self, timeout_minutes=2):
        return datetime.now() - self.last_activity > timedelta(minutes=timeout_minutes)

    def add_player(self, player_id):
        if None in self.players:
            index = self.players.index(None)
            self.players[index] = player_id
            # Wenn zweiter Spieler beitritt, Spiel starten und Timer setzen
            if None not in self.players:
                self.game_started = True
                self.move_deadline = datetime.now() + timedelta(seconds=self.move_timeout)
            return index
        return None

    def reset_board(self):
        self.board = [None] * 9
        self.current_player = 0
        self.stones = {'X': [], 'O': []}
        self.phase = 'place'
        self.selected_stone = None
        if self.game_started:  # Nur Timer setzen wenn Spiel gestartet
            self.move_deadline = datetime.now() + timedelta(seconds=self.move_timeout)

    def make_move(self, player_id, position):
        self.update_activity()
        if player_id not in self.players:
            return False, "Ungültiger Spieler"
        
        if not self.game_started:
            return False, "Warte auf zweiten Spieler"
        
        player_index = self.players.index(player_id)
        symbol = 'X' if player_index == 0 else 'O'
        success = False
        message = ""
        
        # Platzierungsphase (erste 3 Steine)
        if len(self.stones[symbol]) < 3:
            if self.board[position] is not None:
                return False, "Feld bereits besetzt"
            self.board[position] = symbol
            self.stones[symbol].append(position)
            success = True
            message = "Stein platziert"
            
        # Bewegungsphase (Stein verschieben)
        elif self.phase == 'place':
            if position not in self.stones[symbol]:
                return False, "Wähle einen deiner Steine"
            self.selected_stone = position
            self.phase = 'move'
            success = True
            message = "Stein ausgewählt"
            
        # Stein an neue Position setzen
        elif self.phase == 'move':
            if self.board[position] is not None:
                return False, "Feld bereits besetzt"
            self.board[self.selected_stone] = None
            self.board[position] = symbol
            self.stones[symbol].remove(self.selected_stone)
            self.stones[symbol].append(position)
            self.selected_stone = None
            self.phase = 'place'
            success = True
            message = "Stein verschoben"

        if success:
            # Nur Spielerwechsel und Timer-Reset wenn kein Gewinner
            if not self.check_winner():
                self.current_player = 1 - self.current_player
                self.move_deadline = datetime.now() + timedelta(seconds=self.move_timeout)
            
        return success, message

    def check_winner(self):
        # Gewinnkombinationen
        winning_combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Horizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Vertikal
            [0, 4, 8], [2, 4, 6]  # Diagonal
        ]
        
        for combo in winning_combinations:
            if (self.board[combo[0]] == self.board[combo[1]] == self.board[combo[2]] 
                and self.board[combo[0]] is not None):
                return self.board[combo[0]]
        return None

    def check_match_winner(self):
        if self.scores['X'] >= 3 or self.scores['O'] >= 3:
            return 'X' if self.scores['X'] > self.scores['O'] else 'O'
        return None

    def check_move_timeout(self):
        if not self.game_started or self.move_deadline is None:
            return False
        if datetime.now() > self.move_deadline:
            winner = 'O' if self.current_player == 0 else 'X'
            self.scores[winner] += 1
            self.games_played += 1
            return True
        return False

game_states = {}

def generate_room_code():
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))

@tic_tac_toe_bp.route('/')
def index():
    return render_template('tic_tac_toe/index.html')

@tic_tac_toe_bp.route('/create_room', methods=['POST'])
def create_room():
    room_code = generate_room_code()
    game = Game()
    player_id = str(uuid.uuid4())
    player_name = request.form.get('player_name', 'Spieler 1')
    game.add_player(player_id)
    game.player_names = {'X': player_name, 'O': None}  # Initialisierung der Spielernamen
    game_states[room_code] = game
    session['player_id'] = player_id
    session['room_code'] = room_code
    session['player_name'] = player_name
    return redirect(url_for('tic_tac_toe.play', room_code=room_code))

@tic_tac_toe_bp.route('/join_room', methods=['POST'])
def join_room():
    room_code = request.form['room_code']
    if room_code not in game_states:
        return "Raum nicht gefunden", 404
    game = game_states[room_code]
    player_id = str(uuid.uuid4())
    player_name = request.form.get('player_name', 'Spieler 2')
    if game.add_player(player_id) is None:
        return "Raum ist voll", 400
    
    # Namen der Spieler im Game-Objekt speichern
    if game.players.index(player_id) == 1:  # Zweiter Spieler
        game.player_names['O'] = player_name
        session['opponent_name'] = game.player_names['X']  # Name des X-Spielers speichern
    else:
        game.player_names['X'] = player_name
        session['opponent_name'] = game.player_names['O']  # Name des O-Spielers speichern
    
    session['player_id'] = player_id
    session['room_code'] = room_code
    session['player_name'] = player_name
    return redirect(url_for('tic_tac_toe.play', room_code=room_code))

@tic_tac_toe_bp.route('/play/<room_code>')
def play(room_code):
    if room_code not in game_states:
        return redirect(url_for('tic_tac_toe.index'))
    game = game_states[room_code]
    player_id = session.get('player_id')
    if player_id not in game.players:
        return redirect(url_for('tic_tac_toe.index'))
    
    player_index = game.players.index(player_id)
    # Aktualisiere den Namen des Gegners
    opponent_symbol = 'O' if player_index == 0 else 'X'
    session['opponent_name'] = game.player_names[opponent_symbol]
    
    return render_template('tic_tac_toe/play.html', 
                         game=game, 
                         room_code=room_code, 
                         player_index=player_index)

@tic_tac_toe_bp.route('/make_move', methods=['POST'])
def make_move():
    data = request.get_json()
    room_code = data.get('room_code')
    position = data.get('position')
    
    if room_code not in game_states:
        return jsonify({"success": False, "message": "Ungültiger Raum"})
    
    game = game_states[room_code]
    player_id = session.get('player_id')
    
    success, message = game.make_move(player_id, position)
    
    if success:
        winner = game.check_winner()
        if winner:
            match_complete = game.check_match_winner() is not None
            game.scores[winner] += 1
            game.games_played += 1
            return jsonify({
                "success": True,
                "winner": winner,
                "match_complete": match_complete,
                "scores": game.scores,
                "games_played": game.games_played
            })
    
    return jsonify({"success": success, "message": message})

@tic_tac_toe_bp.route('/check_state/<room_code>')
def check_state(room_code):
    if room_code not in game_states:
        return jsonify({"should_update": False})
    
    game = game_states[room_code]
    player_id = session.get('player_id')
    player_index = game.players.index(player_id)
    
    # Prüfe ob der andere Spieler am Zug ist und ob sich das Spiel geändert hat
    should_update = (game.current_player != player_index)
    
    return jsonify({
        "should_update": should_update,
        "current_player": game.current_player,
        "winner": game.check_winner()
    })

@tic_tac_toe_bp.route('/get_state/<room_code>')
def get_state(room_code):
    if room_code not in game_states:
        return jsonify({"error": "Game not found"}), 404
    
    game = game_states[room_code]
    
    # Prüfe auf Inaktivität
    if game.is_inactive():
        del game_states[room_code]
        return jsonify({
            "error": "game_timeout",
            "message": "Das Spiel wurde wegen Inaktivität beendet"
        })
    
    # Prüfe auf Zugzeitlimit
    if game.check_move_timeout():
        winner = 'O' if game.current_player == 0 else 'X'
        match_complete = game.check_match_winner() is not None
        return jsonify({
            "timeout": True,
            "winner": winner,
            "match_complete": match_complete,
            "scores": game.scores,
            "games_played": game.games_played
        })
    
    return jsonify({
        "board": game.board,
        "current_player": game.current_player,
        "phase": game.phase,
        "selected_stone": game.selected_stone,
        "stones": game.stones,
        "winner": game.check_winner(),
        "remaining_time": (game.move_deadline - datetime.now()).total_seconds()
    })

@tic_tac_toe_bp.route('/next_round/<room_code>')
def next_round(room_code):
    if room_code not in game_states:
        return redirect(url_for('tic_tac_toe.index'))
    
    game = game_states[room_code]
    game.reset_board()
    
    return redirect(url_for('tic_tac_toe.play', room_code=room_code))

@tic_tac_toe_bp.route('/results/<room_code>')
def results(room_code):
    if room_code not in game_states:
        return redirect(url_for('tic_tac_toe.index'))
    
    game = game_states[room_code]
    player_id = session.get('player_id')
    if player_id not in game.players:
        return redirect(url_for('tic_tac_toe.index'))
    
    player_index = game.players.index(player_id)
    match_winner = game.check_match_winner()
    
    return render_template('tic_tac_toe/results.html', 
                         game=game,
                         match_winner=match_winner,
                         room_code=room_code,
                         player_symbol='X' if player_index == 0 else 'O') 