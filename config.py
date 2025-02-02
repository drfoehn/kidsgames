import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dein_standard_geheimer_schlüssel'
    DEBUG = os.environ.get('DEBUG') or False
