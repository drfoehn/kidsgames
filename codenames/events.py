from flask_socketio import emit, join_room, leave_room, rooms
from flask import request
from extensions import db, socketio
from codenames.models.room import Room
from codenames.models.player import Player
from datetime import datetime

@socketio.on('connect')
def handle_connect():
    print(f"Client connected with sid: {request.sid}")

@socketio.on('join')
def on_join(data):
    try:
        print(f"\n=== join event received ===")
        print(f"Debug - Join data: {data}")
        print(f"Debug - Session ID: {request.sid}")
        
        room_id = data['room_id']
        player_name = data['player_name']
        
        join_room(room_id)
        print(f"Debug - Joined room: {room_id}")
        print(f"Debug - Active rooms: {rooms()}")
        
        player = Player(name=player_name, room_id=room_id)
        db.session.add(player)
        db.session.commit()
        
        emit('player_joined', player.to_dict(), to=room_id)
        print(f"Debug - Emitted player_joined event to room: {room_id}")
        
    except Exception as e:
        print(f"Error in join: {str(e)}")
        import traceback
        print(traceback.format_exc())

@socketio.on('select_role')
def on_select_role(data):
    player_id = data['player_id']
    role = data['role']
    team = data['team']
    
    player = Player.query.get(player_id)
    player.role = role
    player.team = team
    db.session.commit()
    
    room_id = player.room_id
    emit('role_updated', player.to_dict(), room=room_id)

@socketio.on('make_guess')
def on_make_guess(data):
    try:
        print("\n=== make_guess event received ===")
        print(f"Debug - Received guess: {data}")
        print(f"Debug - Session ID: {request.sid}")
        print(f"Debug - Active rooms: {rooms()}")
        
        room_id = data.get('room_id')
        word_index = data.get('word_index')
        team = data.get('team')
        
        if not all([room_id, word_index is not None, team]):
            print("Debug - Missing required data:", {
                'room_id': room_id,
                'word_index': word_index,
                'team': team
            })
            return
        
        room = Room.query.get(room_id)
        if not room:
            print(f"Debug - Room not found: {room_id}")
            return
        
        game_state = room.game_state
        print(f"Debug - Current game state: {game_state}")
        
        try:
            word_index_int = int(word_index)
            card_type = game_state['cards'][word_index_int]
            print(f"Debug - Found card type: {card_type}")
        except (IndexError, ValueError) as e:
            print(f"Debug - Error getting card type: {str(e)}")
            return
        
        reveal_data = {
            'index': word_index_int,
            'card': card_type,
            'team': team
        }
        
        if 'revealed' not in game_state:
            game_state['revealed'] = []
        
        game_state['revealed'].append(reveal_data)
        room.game_state = game_state
        db.session.commit()
        
        response_data = {
            'word_index': word_index,
            'card_type': card_type,
            'current_team': game_state['current_team'],
            'winner': game_state.get('winner'),
            'game_over': game_state.get('game_over', False),
            'remaining_red': game_state['card_counts']['red'] - len([r for r in game_state['revealed'] if r['card'] == 'red']),
            'remaining_blue': game_state['card_counts']['blue'] - len([r for r in game_state['revealed'] if r['card'] == 'blue'])
        }
        
        print(f"Debug - About to emit response: {response_data}")
        print(f"Debug - Current session rooms: {rooms()}")
        print(f"Debug - Emitting to room: {room_id}")
        
        # Try different emission methods
        socketio.emit('guess_made', response_data, namespace='/', room=room_id)
        print("Debug - Response emitted successfully")
        
    except Exception as e:
        print(f"Error in make_guess: {str(e)}")
        import traceback
        print(traceback.format_exc())

@socketio.on('submit_hint')
def on_submit_hint(data):
    room_id = data['room_id']
    hint_word = data['hint_word']
    hint_count = data['hint_count']
    team = data['team']
    
    room = Room.query.get(room_id)
    game_state = room.game_state
    
    # Add the hint to the game state
    hint = {
        'word': hint_word,
        'count': hint_count,
        'team': team,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    if 'hints' not in game_state:
        game_state['hints'] = []
    
    game_state['hints'].append(hint)
    room.game_state = game_state
    db.session.commit()
    
    # Broadcast the hint to all players in the room
    emit('hint_received', {
        'hint_word': hint_word,
        'hint_count': hint_count,
        'team': team
    }, room=room_id) 