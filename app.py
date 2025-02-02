from flask import Flask, render_template, request, send_from_directory, redirect, url_for
from config import Config
from prisoners_dilemma import prisoners_dilemma_bp
from tic_tac_toe import tic_tac_toe_bp
import os
from datetime import timedelta

app = Flask(__name__)
app.config.from_object(Config)

# Add debug logging
@app.before_request
def log_request_info():
    app.logger.debug('Headers: %s', request.headers)
    app.logger.debug('Body: %s', request.get_data())
    app.logger.debug('Path: %s', request.path)
    # Add template folder debugging
    app.logger.debug('Template Folders: %s', app.jinja_loader.searchpath)

# Use environment variable for secret key if available, otherwise use a fixed one
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'your-fixed-secret-key-for-development')

# Configure Flask to redirect URLs without trailing slashes
app.url_map.strict_slashes = False

# Register Blueprint with url_prefix
app.register_blueprint(prisoners_dilemma_bp, url_prefix='/prisoners_dilemma')
app.register_blueprint(tic_tac_toe_bp, url_prefix='/tic_tac_toe')

# Add these session configurations
app.config['SESSION_TYPE'] = 'filesystem'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/jcapps/games/picdamuro')
def picdamuro():
    return render_template('picdamuro.html')

@app.route('/jcapps/games/cadanames')
def cadanames():
    return render_template('cadanames.html')

@app.route('/downloads/<path:filename>')
def download_file(filename):
    return send_from_directory('static/downloads', filename)

@app.errorhandler(500)
def internal_error(error):
    app.logger.error('Server Error: %s', (error))
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=False)
