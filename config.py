import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # SQLite Datenbank-URL
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///codenames.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True  # SQL-Logging aktivieren
    
    # Andere Konfigurationen...
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev'
    DEBUG = os.environ.get('DEBUG') or False
