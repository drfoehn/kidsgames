from extensions import db

class Player(db.Model):
    __tablename__ = 'codenames_player'  # Prefix für eindeutige Tabellennamen
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    room_id = db.Column(db.String(6), db.ForeignKey('codenames_room.id'), nullable=False)
    role = db.Column(db.String(20))  # 'spymaster' or 'operative'
    team = db.Column(db.String(10))  # 'red' or 'blue'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'team': self.team
        } 