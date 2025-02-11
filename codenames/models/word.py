from extensions import db

class Word(db.Model):
    __tablename__ = 'codenames_word'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(50), nullable=False, unique=True)
    
    def __repr__(self):
        return f'<Word {self.text}>' 