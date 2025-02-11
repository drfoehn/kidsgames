// Funktion zum Anzeigen von Benachrichtigungen
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Funktion zum Aktualisieren des Spielzustands
function updateGameState(data) {
    console.log("Received game state:", data);  // Debug-Ausgabe
    
    // Aktualisiere Team-Anzeige
    document.querySelector('.current-team').innerHTML = `
        <span class="badge ${data.current_team === 'red' ? 'bg-danger' : 'bg-primary'}">
            ${data.current_team === 'red' ? 'Roter' : 'Blauer'} Orden ist dran
        </span>`;

    // Aktualisiere Punktestände
    const redCount = document.querySelector('.red-count');
    const blueCount = document.querySelector('.blue-count');
    
    if (data.remaining_red !== undefined) {
        redCount.textContent = `Rote Artefakte: ${data.remaining_red}`;
    }
    if (data.remaining_blue !== undefined) {
        blueCount.textContent = `Blaue Artefakte: ${data.remaining_blue}`;
    }

    // Aktualisiere aufgedeckte Karten
    if (data.revealed) {
        data.revealed.forEach(reveal => {
            const card = document.querySelector(`[data-index="${reveal.index}"]`);
            if (card && !card.classList.contains('revealed')) {
                card.classList.add('revealed');
                card.setAttribute('data-card', reveal.card);
            }
        });
    }

    // Prüfe auf Spielende
    if (data.game_over) {
        const modal = new bootstrap.Modal(document.getElementById('gameOverModal'));
        const message = document.getElementById('winnerMessage');
        message.textContent = `Der ${data.winner === 'red' ? 'Rote' : 'Blaue'} Orden hat die Mission gewonnen!`;
        modal.show();
    }

    // Spielerliste aktualisieren
    const playerList = document.querySelector('.player-list .d-flex');
    if (playerList && data.players) {
        playerList.innerHTML = data.players.map(p => `
            <div class="player-badge p-2 rounded" style="
                border: 2px solid ${p.team === 'red' ? '#dc3545' : '#0d6efd'};
                background-color: ${p.team === 'red' ? '#f8d7da' : '#cfe2ff'};
            ">
                <span class="fw-bold">${p.name}</span>
                <span class="badge ${p.role === 'jedi' ? 'bg-dark' : 'bg-secondary'}">
                    ${p.role === 'jedi' ? 'Jedi-Meister' : 'Padawan'}
                </span>
            </div>
        `).join('');
    }
    
    // Player-Info nicht überschreiben
    const playerInfo = document.querySelector('.player-info');
    if (playerInfo) {
        playerInfo.style.display = 'block';  // Sicherstellen, dass die Info sichtbar bleibt
    }
}

// Funktion zum Anzeigen des Spielendes
function showGameOver(winner) {
    const modal = new bootstrap.Modal(document.getElementById('gameOverModal'));
    document.getElementById('winnerMessage').textContent = 
        `Orden ${winner === 'red' ? 'Rot' : 'Blau'} hat die Macht der Artefakte gemeistert!`;
    modal.show();
}

// Funktion zum Aktualisieren des Spielzustands
function updateGame() {
    console.log("Fetching game state for room ID:", roomId);
    fetch(`/codenames/game-state/${roomId}`)
        .then(response => response.json())
        .then(data => {
            updateGameState(data);
            if (data.winner) {
                showGameOver(data.winner);
            }
        });
}

// Regelmäßiges Update alle 2 Sekunden
setInterval(updateGame, 2000);

// Event Handler für Kartenklicks
function handleCardClick(cardIndex) {
    fetch(`/codenames/reveal-card/${roomId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            card_index: cardIndex,
            player: currentPlayer
        })
    })
    .then(response => response.json())
    .then(data => {
        updateGameState(data);
        if (data.winner) {
            showGameOver(data.winner);
        }
    });
}

// Event Handler für Hinweise
function submitHint() {
    fetch(`/codenames/submit-hint/${roomId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            hint: document.getElementById('hint-word').value,
            count: document.getElementById('hint-count').value,
            player: currentPlayer
        })
    })
    .then(response => response.json())
    .then(data => {
        updateGameState(data);
    });
}

// Diese Variablen werden bereits im Template definiert
// const roomId = "{{ room.id }}";
// const playerRole = currentPlayer.role;
// const playerTeam = currentPlayer.team;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, attaching card listeners');
    const cards = document.querySelectorAll('.word-card');
    console.log('Found cards:', cards.length);

    document.querySelectorAll('.word-card').forEach(card => {
        console.log('Attaching listener to card:', card.textContent);
        card.addEventListener('click', async function(event) {
            console.log('Click event fired');
            // Prevent any default behavior
            event.preventDefault();
            event.stopPropagation();

            console.log('1. Card clicked:', {
                cardElement: this,
                cardIndex: this.dataset.index,
                isRevealed: this.classList.contains('revealed'),
                currentTeam: document.querySelector('.current-team .badge').textContent,
                playerRole: playerRole,
                playerTeam: playerTeam
            });

            if (this.classList.contains('revealed')) {
                console.log('2. Card already revealed, stopping');
                return;
            }
            
            // Get current team from the display
            const currentTeam = document.querySelector('.current-team .badge')
                .textContent.includes('Roter') ? 'red' : 'blue';
            
            // Validations
            if (playerRole !== 'padawan') {
                showNotification('Nur Padawane dürfen Karten aufdecken!', 'warning');
                return;
            }
            
            if (playerTeam !== currentTeam) {
                showNotification('Du bist nicht am Zug!', 'warning');
                return;
            }
            
            try {
                console.log('3. Starting fetch to:', {
                    url: apiUrls.makeGuess,
                    method: 'POST',
                    roomId: roomId,
                    wordIndex: this.dataset.index,
                    team: playerTeam
                });

                const response = await fetch(apiUrls.makeGuess, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'room_id': roomId,
                        'word_index': this.dataset.index,
                        'team': playerTeam
                    })
                });

                console.log('4. Response received:', {
                    status: response.status,
                    ok: response.ok,
                    statusText: response.statusText
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Server response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }
                
                const data = await response.json();
                
                // Reveal card
                this.classList.add('revealed');
                this.dataset.card = data.card_type;
                
                // Update game status
                updateGameStatus(data);
                
                // Show feedback
                if (data.card_type === playerTeam) {
                    showNotification('Richtig! Du kannst weitermachen.', 'info');
                } else if (data.card_type === 'assassin') {
                    showNotification('Oh nein! Der Attentäter wurde aufgedeckt!', 'error');
                } else {
                    showNotification('Leider falsch! Der Zug geht an das andere Team.', 'warning');
                }
                
            } catch (error) {
                console.error('Error:', error);
                showNotification('Ein Fehler ist aufgetreten: ' + error.message, 'error');
            }
        });
    });

    // Debug: Check if variables are defined
    console.log('Variables check:', {
        roomId,
        playerRole,
        playerTeam,
        apiUrls
    });
});

function updateGameStatus(data) {
    // Aktualisiere Teamanzeige
    const currentTeamBadge = document.querySelector('.current-team .badge');
    currentTeamBadge.textContent = `${data.current_team === 'red' ? 'Roter' : 'Blauer'} Orden ist dran`;
    currentTeamBadge.className = `badge ${data.current_team === 'red' ? 'bg-danger' : 'bg-primary'}`;
    
    // Aktualisiere Punktestand
    if (data.remaining_red !== undefined) {
        document.querySelector('.red-count').textContent = `Rote Artefakte: ${data.remaining_red}`;
    }
    if (data.remaining_blue !== undefined) {
        document.querySelector('.blue-count').textContent = `Blaue Artefakte: ${data.remaining_blue}`;
    }
    
    // Prüfe auf Spielende
    if (data.game_over) {
        const modal = new bootstrap.Modal(document.getElementById('gameOverModal'));
        const message = document.getElementById('winnerMessage');
        message.textContent = `Der ${data.winner === 'red' ? 'Rote' : 'Blaue'} Orden hat die Mission gewonnen!`;
        modal.show();
    }
}

// Funktion zum Beenden des Zuges
function endTurn(roomId) {
    fetch(apiUrls.endTurn, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'room_id': roomId
        })
    })
    .then(response => response.json())
    .then(data => {
        // Aktualisiere den Spielzustand
        updateGameState(data);
        // Zeige Benachrichtigung
        showNotification('Zug beendet', 'info');
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Fehler beim Beenden des Zuges', 'error');
    });
} 