from flask import Blueprint, render_template, request, redirect, url_for, jsonify, session, current_app as app
from extensions import db
from codenames.models.room import Room
from codenames.models.player import Player
import random
import string

codenames_bp = Blueprint('codenames', __name__, template_folder='templates')

def generate_room_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@codenames_bp.route('/')
def index():
    return render_template('codenames/index.html')

@codenames_bp.route('/create-room', methods=['POST'])
def create_room():
    try:
        app.logger.info('Starting create_room')
        player_name = request.form.get('player_name', 'Unbekannter Jedi')
        team = request.form.get('team', 'red')
        room_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        
        app.logger.info(f'Creating room with ID: {room_id}')
        room = Room(id=room_id)
        room.initialize_game()
        
        game_state = room.game_state
        game_state['current_team'] = team
        room.game_state = game_state
        
        app.logger.info(f'Creating player: {player_name}, team: {team}')
        player = Player(
            name=player_name,
            room_id=room_id,
            role='jedi',
            team=team
        )
        
        app.logger.info('Adding to database')
        db.session.add(room)
        db.session.add(player)
        db.session.commit()
        
        app.logger.info('Setting session')
        session['player_id'] = player.id
        
        app.logger.info('Redirecting')
        return redirect(url_for('codenames.room', room_id=room_id, player_id=player.id))
    except Exception as e:
        app.logger.error(f'Error in create_room: {str(e)}')
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@codenames_bp.route('/join-room', methods=['POST'])
def join_room():
    session.pop('player_id', None)
    
    room_id = request.form.get('room_id')
    player_name = request.form.get('player_name')
    team = request.form.get('team')
    role = request.form.get('role')
    
    room = Room.query.get_or_404(room_id)
    player = Player(name=player_name, room_id=room_id, team=team, role=role)
    db.session.add(player)
    db.session.commit()
    
    session['player_id'] = player.id
    return redirect(url_for('codenames.room', room_id=room_id))

@codenames_bp.route('/room/<room_id>')
def room(room_id):
    room = Room.query.get_or_404(room_id)
    player_id = request.args.get('player_id') or session.get('player_id')
    player = Player.query.get(player_id) if player_id else None
    
    print("\n=== Loading room ===")
    print(f"Room ID: {room_id}")
    print(f"Game state: {room.game_state}")
    print(f"Revealed cards: {room.game_state.get('revealed', [])}")
    
    print(f"Room found: {room}")
    print(f"Player: {player}")
    
    return render_template('codenames/room.html', room=room, player=player)

@codenames_bp.route('/game-state/<room_id>')
def game_state(room_id):
    room = Room.query.get_or_404(room_id)
    game_state = room.game_state
    
    revealed_red = len([r for r in game_state.get('revealed', []) if r['card'] == 'red'])
    revealed_blue = len([r for r in game_state.get('revealed', []) if r['card'] == 'blue'])
    
    players = [{
        'name': p.name,
        'team': p.team,
        'role': p.role
    } for p in room.players]
    
    response_data = {
        **game_state,
        'remaining_red': game_state['card_counts']['red'] - revealed_red,
        'remaining_blue': game_state['card_counts']['blue'] - revealed_blue,
        'players': players
    }
    
    return jsonify(response_data)

@codenames_bp.route('/make_guess', methods=['POST'])
def make_guess():
    try:
        app.logger.debug('=== make_guess called ===')
        app.logger.debug(f'Request Method: {request.method}')
        app.logger.debug(f'Request URL: {request.url}')
        app.logger.debug(f'Request Headers: {dict(request.headers)}')
        app.logger.debug(f'Request Form Data: {request.form}')

        room_id = request.form.get('room_id')
        word_index = request.form.get('word_index')
        team = request.form.get('team')
        
        if not all([room_id, word_index, team]):
            return jsonify({'error': 'Missing required parameters'}), 400

        print(f"\n=== make_guess called ===")
        print(f"room_id: {room_id}")
        print(f"word_index: {word_index}")
        print(f"team: {team}")
        
        room = Room.query.get_or_404(room_id)
        game_state = room.game_state
        
        print(f"Initial game state: {game_state}")
        print(f"Current revealed cards: {game_state.get('revealed', [])}")
        
        try:
            word_index_int = int(word_index)
            card_type = game_state['cards'][word_index_int]
            print(f"Card type at index {word_index_int}: {card_type}")
        except (IndexError, ValueError) as e:
            print(f"Error getting card type: {e}")
            return jsonify({'error': 'Invalid word index'}), 400
        
        if 'revealed' not in game_state:
            game_state['revealed'] = []
            print("Initialized revealed list")
        
        reveal_data = {
            'index': word_index_int,
            'card': card_type,
            'team': team
        }
        
        if not any(r['index'] == word_index_int for r in game_state['revealed']):
            game_state['revealed'].append(reveal_data)
            print(f"Added reveal data: {reveal_data}")
        game_over = False
        winner = None
        
        if card_type == 'assassin':
            game_over = True
            winner = 'blue' if team == 'red' else 'red'
        elif card_type != team:
            game_state['current_team'] = 'blue' if team == 'red' else 'red'
        
        revealed_red = len([r for r in game_state['revealed'] if r['card'] == 'red'])
        revealed_blue = len([r for r in game_state['revealed'] if r['card'] == 'blue'])
        
        if revealed_red == game_state['card_counts']['red']:
            game_over = True
            winner = 'red'
        elif revealed_blue == game_state['card_counts']['blue']:
            game_over = True
            winner = 'blue'
        
        game_state['winner'] = winner
        game_state['game_over'] = game_over
        
        room.game_state = game_state
        print(f"Final game state before commit: {room.game_state}")
        print(f"Raw _game_state before commit: {room._game_state}")
        
        db.session.commit()
        print("Database commit successful")

        return jsonify({
            'card_type': card_type,
            'current_team': game_state['current_team'],
            'game_over': game_over,
            'winner': winner,
            'remaining_red': game_state['card_counts']['red'] - revealed_red,
            'remaining_blue': game_state['card_counts']['blue'] - revealed_blue
        })

    except Exception as e:
        print(f"Error in make_guess: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@codenames_bp.route('/end_turn', methods=['POST'])
def end_turn():
    room_id = request.form.get('room_id')
    room = Room.query.get_or_404(room_id)
    game_state = room.game_state
    
    game_state['current_team'] = 'blue' if game_state['current_team'] == 'red' else 'red'
    
    revealed_red = len([r for r in game_state['revealed'] if r['card'] == 'red'])
    revealed_blue = len([r for r in game_state['revealed'] if r['card'] == 'blue'])
    
    game_state['remaining_cards'] = {
        'red': game_state['card_counts']['red'] - revealed_red,
        'blue': game_state['card_counts']['blue'] - revealed_blue
    }
    
    room.game_state = game_state
    db.session.commit()
    
    return jsonify({
        'current_team': game_state['current_team'],
        'remaining_red': game_state['card_counts']['red'] - revealed_red,
        'remaining_blue': game_state['card_counts']['blue'] - revealed_blue
    })

@codenames_bp.route('/reveal-card/<room_id>', methods=['POST'])
def reveal_card(room_id):
    data = request.get_json()
    room = Room.query.get_or_404(room_id)
    # ... Kartenlogik ...
    db.session.commit()
    return jsonify(room.game_state)

@codenames_bp.route('/submit-hint/<room_id>', methods=['POST'])
def submit_hint(room_id):
    data = request.get_json()
    room = Room.query.get_or_404(room_id)
    # ... Hinweislogik ...
    db.session.commit()
    return jsonify(room.game_state)
