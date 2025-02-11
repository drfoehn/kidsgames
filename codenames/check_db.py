import sqlite3
import json
import os

# Get the absolute path to the database
DB_PATH = os.path.join(os.getcwd(), 'instance', 'codenames.db')  # Adjust this path based on the debug output
print("Looking for database at:", DB_PATH)
print("File exists:", os.path.exists(DB_PATH))

# Verbindung zur Datenbank herstellen
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Tabellen anzeigen
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
print("\nTables in database:")
print(cursor.fetchall())

# Room-Daten anzeigen
print("\nRoom data:")
cursor.execute("SELECT * FROM room;")
columns = [description[0] for description in cursor.description]
print("Columns:", columns)
for row in cursor.fetchall():
    print("\nRoom ID:", row[0])
    print("Created at:", row[1])
    try:
        game_state = json.loads(row[2]) if row[2] else {}
        print("Game state:", json.dumps(game_state, indent=2))
    except:
        print("Raw game_state:", row[2])

conn.close() 