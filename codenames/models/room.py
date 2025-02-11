from extensions import db
from datetime import datetime
import json
import random

class Room(db.Model):
    __tablename__ = 'codenames_room'  # Prefix für eindeutige Tabellennamen
    id = db.Column(db.String(6), primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    _game_state = db.Column('game_state', db.Text)
    players = db.relationship('Player', backref='room', lazy=True)
    
    @property
    def game_state(self):
        """Deserialize the game state from JSON"""
        if self._game_state is None:
            return {}
        try:
            return json.loads(self._game_state)
        except:
            print(f"Error deserializing game state: {self._game_state}")
            return {}
    
    @game_state.setter
    def game_state(self, value):
        """Serialize the game state to JSON"""
        try:
            self._game_state = json.dumps(value)
        except:
            print(f"Error serializing game state: {value}")
            self._game_state = '{}'
    
    def initialize_game(self):
        # Lade die Wortliste
        with open('static/codenames_wordlist.txt', 'r', encoding='utf-8') as f:
            all_words = [line.strip() for line in f]
        
        # Wähle zufällig 25 Wörter
        words = random.sample(all_words, 25)
        
        # Erstelle die Kartenliste (8 rot, 8 blau, 1 schwarz, 8 neutral)
        cards = ['red'] * 8 + ['blue'] * 8 + ['assassin'] + ['neutral'] * 8
        random.shuffle(cards)
        
        # Bestimme das Startteam
        starting_team = random.choice(['red', 'blue'])
        
        # Initialisiere den Spielzustand
        self.game_state = {
            'words': words,
            'cards': cards,
            'current_team': starting_team,
            'revealed': [],
            'hints': [],
            'game_over': False,
            'winner': None,
            'card_counts': {
                'red': 8,
                'blue': 8,
                'neutral': 8,
                'assassin': 1
            }
        }
    
    def to_dict(self):
        return {
            'id': self.id,
            'game_state': self.game_state,
            'players': [player.to_dict() for player in self.players]
        } 