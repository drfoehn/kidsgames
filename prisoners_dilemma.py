import os
import uuid
from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
import random
import string

# Create Blueprint for the game
prisoners_dilemma_bp = Blueprint('prisoners_dilemma', __name__,
                               template_folder='templates')

class Game:
    def __init__(self):
        self.rounds = random.randint(10, 16)
        self.max_years = int(self.rounds * 1.7)  # Obergrenze
        self.current_round = 0
        self.scores = [0, 0]  # Gesamtpunkte
        self.round_scores = [0, 0]  # Punkte dieser Runde
        self.choices = [None, None]
        self.roles = ['Pimpleback Jim', 'Babyface Kate']
        random.shuffle(self.roles)
        self.players = [None, None]
        self.round_evaluated = False
        self.game_over = False  # Status für vorzeitiges Spielende

    def add_player(self, player_id):
        if None in self.players:
            index = self.players.index(None)
            self.players[index] = player_id
            return index
        return None

    def make_choice(self, player_id, choice):
        if player_id in self.players:
            index = self.players.index(player_id)
            self.choices[index] = choice
            return True
        return False

    def evaluate_round(self):
        if not self.round_evaluated and all(choice is not None for choice in self.choices):
            print("Evaluating round...")
            self.round_scores = [0, 0]
            
            if self.choices[0] == self.choices[1] == "stay_silent":
                self.scores[0] += 1
                self.scores[1] += 1
                self.round_scores = [1, 1]
            elif self.choices[0] == self.choices[1] == "betray":
                self.scores[0] += 23
                self.scores[1] += 2
                self.round_scores = [2, 2]
            elif self.choices[0] == "betray" and self.choices[1] == "stay_silent":
                self.scores[1] += 3
                self.round_scores[1] = 3
            elif self.choices[0] == "stay_silent" and self.choices[1] == "betray":
                self.scores[0] += 3
                self.round_scores[0] = 3
                
            print(f"Round scores: {self.round_scores}")
            print(f"Total scores: {self.scores}")
            
            # Prüfe, ob jemand die Obergrenze überschritten hat
            if self.scores[0] >= self.max_years or self.scores[1] >= self.max_years:
                self.game_over = True
            
            self.round_evaluated = True
            self.current_round += 1

    def is_round_complete(self):
        return all(choice is not None for choice in self.choices) and self.round_evaluated

    def reset_round(self):
        self.choices = [None, None]
        self.round_evaluated = False
        self.round_scores = [0, 0]

    def get_player_role(self, player_id):
        if player_id in self.players:
            index = self.players.index(player_id)
            return self.roles[index]
        return None
    
    def is_game_over(self):
        return self.current_round >= self.rounds or self.game_over

# Global storage for game states
game_states = {}

def generate_room_code():
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))

@prisoners_dilemma_bp.route('/')
def index():
    return render_template('prisoners_dilemma/index.html')

@prisoners_dilemma_bp.route('/create_room', methods=['POST'])
def create_room():
    room_code = generate_room_code()
    game = Game()
    player_id = str(uuid.uuid4())
    player_name = request.form.get('player_name', 'Player 1')
    game.add_player(player_id)
    game_states[room_code] = game
    session['player_id'] = player_id
    session['room_code'] = room_code
    session['player_name'] = player_name
    return redirect(url_for('prisoners_dilemma.play', room_code=room_code))

@prisoners_dilemma_bp.route('/join_room', methods=['POST'])
def join_room():
    room_code = request.form['room_code']
    if room_code not in game_states:
        return "Room not found", 404
    game = game_states[room_code]
    player_id = str(uuid.uuid4())
    player_name = request.form.get('player_name', 'Player 2')
    if game.add_player(player_id) is None:
        return "Room is full", 400
    session['player_id'] = player_id
    session['room_code'] = room_code
    session['player_name'] = player_name
    return redirect(url_for('prisoners_dilemma.play', room_code=room_code))

@prisoners_dilemma_bp.route('/play/<room_code>')
def play(room_code):
    if room_code not in game_states:
        return redirect(url_for('prisoners_dilemma.index'))
    game = game_states[room_code]
    player_id = session.get('player_id')
    player_role = game.get_player_role(player_id)
    
    if game.is_game_over():
        return redirect(url_for('prisoners_dilemma.results', room_code=room_code))
        
    return render_template('prisoners_dilemma/play.html', game=game, room_code=room_code, player_id=player_id, player_role=player_role)

@prisoners_dilemma_bp.route('/make_choice', methods=['POST'])
def make_choice():
    player_id = session.get('player_id')
    room_code = session.get('room_code')
    choice = request.form['choice']
    
    print(f"make_choice - player_id: {player_id}, room_code: {room_code}, choice: {choice}")  # Debug log
    
    if room_code not in game_states:
        return "Game not found", 404
    
    game = game_states[room_code]
    print(f"Game state before choice - choices: {game.choices}, scores: {game.scores}")  # Debug log
    
    if game.make_choice(player_id, choice):
        game.evaluate_round()
        print(f"Game state after choice - choices: {game.choices}, scores: {game.scores}")  # Debug log
        return redirect(url_for('prisoners_dilemma.waiting', room_code=room_code))
    else:
        return "Invalid player", 400

@prisoners_dilemma_bp.route('/waiting/<room_code>')
def waiting(room_code):
    if room_code not in game_states:
        return redirect(url_for('prisoners_dilemma.index'))
    
    game = game_states[room_code]
    player_id = session.get('player_id')
    player_role = game.get_player_role(player_id)
    player_name = session.get('player_name', 'Unknown Player')

    return render_template('prisoners_dilemma/waiting.html', game=game, room_code=room_code, player_id=player_id, player_role=player_role, player_name=player_name)

@prisoners_dilemma_bp.route('/check_round_complete/<room_code>')
def check_round_complete(room_code):
    if room_code not in game_states:
        return jsonify({"complete": False})
    
    game = game_states[room_code]
    return jsonify({"complete": game.is_round_complete()})

@prisoners_dilemma_bp.route('/evaluate_round/<room_code>')
def evaluate_round(room_code):
    if room_code not in game_states:
        return jsonify({"error": "Game not found"}), 404
    
    game = game_states[room_code]
    if game.is_round_complete():
        game.evaluate_round()
        return jsonify({"complete": True})
    return jsonify({"complete": False})

@prisoners_dilemma_bp.route('/round_result/<room_code>')
def round_result(room_code):
    if room_code not in game_states:
        print(f"Game not found for room {room_code}")
        return jsonify({"error": "Game not found"}), 404
    
    game = game_states[room_code]
    player_id = session.get('player_id')
    print(f"Session player_id: {player_id}")
    print(f"Game players: {game.players}")
    print(f"Game choices: {game.choices}")
    print(f"Game scores: {game.scores}")
    print(f"Round evaluated: {game.round_evaluated}")
    
    if not player_id:
        print("No player_id in session")
        return jsonify({"error": "No player session"}), 400
    
    if player_id not in game.players:
        print(f"Player {player_id} not in game players: {game.players}")
        return jsonify({"error": "Player not in game"}), 400
        
    player_index = game.players.index(player_id)
    other_index = 1 - player_index
    
    result = {
        'your_choice': game.choices[player_index],
        'other_choice': game.choices[other_index],
        'your_round_score': game.round_scores[player_index],  # Rundenpunkte
        'other_round_score': game.round_scores[other_index],  # Rundenpunkte
        'your_total_score': game.scores[player_index],        # Gesamtpunkte
        'other_total_score': game.scores[other_index],        # Gesamtpunkte
        'your_role': game.roles[player_index],
        'other_role': game.roles[other_index],
        'round_complete': game.is_round_complete(),
        'current_round': game.current_round,
        'total_rounds': game.rounds
    }
    
    print(f"Sending result: {result}")
    return jsonify(result)

@prisoners_dilemma_bp.route('/results/<room_code>')
def results(room_code):
    if room_code not in game_states:
        return redirect(url_for('prisoners_dilemma.index'))
    
    game = game_states[room_code]
    player_id = session.get('player_id')
    player_role = game.get_player_role(player_id)
    player_name = session.get('player_name', 'Unknown Player')
    
    # Bestimme den Gewinner nur wenn niemand die Obergrenze überschritten hat
    if game.scores[0] >= game.max_years or game.scores[1] >= game.max_years:
        winner = "Niemand"
    elif game.scores[0] < game.scores[1]:
        winner = f"Verdächtiger #1 ({game.roles[0]})"
    elif game.scores[1] < game.scores[0]:
        winner = f"Verdächtiger #2 ({game.roles[1]})"
    else:
        winner = "Unentschieden"

    return render_template('prisoners_dilemma/results.html', 
                         game=game, 
                         winner=winner, 
                         player_name=player_name, 
                         player_role=player_role)

@prisoners_dilemma_bp.route('/check_next_round/<room_code>')
def check_next_round(room_code):
    if room_code not in game_states:
        return jsonify({"ready": False})
    
    game = game_states[room_code]
    return jsonify({"ready": game.choices == [None, None]})

@prisoners_dilemma_bp.route('/reset_round/<room_code>', methods=['POST'])
def reset_round(room_code):
    if room_code not in game_states:
        return jsonify({"error": "Game not found"}), 404
    
    game = game_states[room_code]
    game.reset_round()
    
    return jsonify({"success": True})