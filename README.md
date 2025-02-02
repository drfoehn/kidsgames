# Kids Games Collection

## Overview

This repository contains a collection of web-based games built with Flask, including:

- **Prisoners Dilemma**: A classic game theory scenario where two players must choose between cooperating or betraying each other.
- **Moving Tic Tac Toe**: A dynamic version of the traditional Tic Tac Toe game where players can move their pieces after each turn.
- **Picdamuro**: A fun and engaging game that challenges players' skills in a unique way.

## Features

### Prisoners Dilemma
- **Multiplayer Support**: Two players can join a game room and play against each other.
- **Dynamic Scoring**: Scores are calculated based on the players' choices in each round.
- **Game Rounds**: The game consists of a random number of rounds (between 10 and 50).
- **Player Roles**: Players are assigned unique roles for added flavor.
- **Real-time Updates**: Players can see the results of their choices and the current scores after each round.

### Moving Tic Tac Toe
- **Dynamic Gameplay**: Players can move their pieces to different positions after each turn, adding a strategic layer to the classic game.
- **Multiplayer Support**: Play against another player in real-time.
- **Interactive Interface**: A user-friendly interface that makes it easy to play and enjoy.

### Picdamuro
- **Engaging Gameplay**: A unique game that tests players' skills and reflexes.
- **Multiplayer Support**: Compete against friends or other players.
- **Fun Graphics**: Colorful and engaging visuals to enhance the gaming experience.

## Requirements

- Python 3.x
- Flask
- Other dependencies listed in `requirements.txt`

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/drfoehn/kidsgames.git
   cd kidsgames
   ```

2. **Set up a virtual environment** (optional but recommended):
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   ```

3. **Install the required packages**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```

5. **Access the games**:
   - **Prisoners Dilemma**: Go to `http://127.0.0.1:5000/prisoners_dilemma`
   - **Moving Tic Tac Toe**: Go to `http://127.0.0.1:5000/jcapps/games/moving_tic_tac_toe`
   - **Picdamuro**: Go to `http://127.0.0.1:5000/jcapps/games/picdamuro`

## Usage

- **Create a Room**: Enter your player name and create a new game room for the Prisoners Dilemma.
- **Join a Room**: If a room already exists, you can join it using the room code.
- **Make Choices**: During each round of the Prisoners Dilemma, choose to either "stay silent" or "betray" your opponent.
- **Play Tic Tac Toe**: In the Moving Tic Tac Toe game, take turns placing your pieces and moving them strategically.
- **Engage in Picdamuro**: Compete against friends in the Picdamuro game and test your skills.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## Contact

For any inquiries or feedback, please contact [your_email@example.com].

---

Thank you for exploring the Kids Games Collection! We hope you enjoy playing and challenging yourself with these fun games.
