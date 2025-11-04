"use strict";

function renderGamePage(username, game, allWords) {
    const availableWords = game.getAvailableWords();
    const statistics = game.getStatistics();
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Word Guessing Game</title>
        <link rel="stylesheet" href="/base.css">
        <link rel="stylesheet" href="/layout.css">
        <link rel="stylesheet" href="/components.css">
        <link rel="stylesheet" href="/game.css">
        <link rel="stylesheet" href="/statistics.css">
        <link rel="stylesheet" href="/animations.css">
    </head>
    <body>
        <div class="container">
            <header class="header">
                <h1>Word Guessing Game</h1>
                <div class="user-info">
                    <span class="username">Player: ${username}</span>
                    <form action="/logout" method="POST" class="logout-form">
                        <button type="submit" class="btn btn-secondary">Logout</button>
                    </form>
                </div>
            </header>
            
            <main class="main-content">
                ${renderStatistics(statistics)}
                
                <div class="game-container">
                    ${renderGameStatus(game)}
                    ${renderColorGuide()}
                    
                    <div class="game-sections">
                        <div class="left-section">
                            ${renderGuessHistory(game)}
                            ${renderGameControls(game)}
                        </div>
                        
                        <div class="right-section">
                            ${renderWordList(availableWords, game.guesses)}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </body>
    </html>
    `;
}

function renderStatistics(stats) {
    return `
    <div class="statistics-panel">
        <h2>Game Statistics</h2>
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">${stats.totalGamesPlayed}</div>
                <div class="stat-label">Games Played</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.gamesWon}</div>
                <div class="stat-label">Games Won</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.bestScore || '-'}</div>
                <div class="stat-label">Best Score</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.currentGuessCount}</div>
                <div class="stat-label">Current Guesses</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.bestStreak}</div>
                <div class="stat-label">Best Streak</div>
            </div>
        </div>
    </div>
    `;
}

function renderColorGuide() {
    return `
    <div class="color-guide">
        <h3>Color Guide</h3>
        <div class="guide-items">
            <div class="guide-item">
                <span class="letter-box correct-position">A</span>
                <span class="guide-text">Correct letter in correct position</span>
            </div>
            <div class="guide-item">
                <span class="letter-box wrong-position">B</span>
                <span class="guide-text">Correct letter but wrong position</span>
            </div>
            <div class="guide-item">
                <span class="letter-box not-in-word">C</span>
                <span class="guide-text">Letter not in word</span>
            </div>
        </div>
    </div>
    `;
}

function renderGameStatus(game) {
    let statusHtml = '<div class="game-status">';
    
    if (!game.won && game.guesses.length === 0 && !game.lastGuess) {
        statusHtml += `
            <div class="game-instructions">
                <h3>How to Play</h3>
                <p><strong>Important:</strong> You can only select words from the available word list shown on the right. Any word not in the list will be marked as invalid.</p>
                <p>Try to guess the secret word with as few attempts as possible!</p>
            </div>
        `;
    }
    
    if (game.won) {
        statusHtml += `
            <div class="win-message">
                <h2> &#127881; Congratulations! You Won! &#127881; </h2>
                <p>You guessed the word in ${game.guessCount} ${game.guessCount === 1 ? 'guess' : 'guesses'}!</p>
            </div>
        `;
    } else if (game.lastGuess !== null && game.lastGuess !== undefined) {
        if (!game.lastGuessValid) {
            const errorMessage = !game.lastGuess || game.lastGuess.trim() === '' 
                ? 'Please enter a word to make a guess.'
                : `Invalid guess: <strong>${game.lastGuess}</strong>. This word is either not in the word list or has already been guessed.`;
            statusHtml += `
                <div class="invalid-guess">
                    <p>${errorMessage}</p>
                </div>
            `;
        } else if (game.guesses.length > 0) {
            const lastGuessData = game.guesses[game.guesses.length - 1];
            statusHtml += `
                <div class="last-guess">
                    <p>Last guess: ${renderLetterBoxes(lastGuessData.letterAnalysis)}</p>
                    <p class="matches-text">${lastGuessData.matches} ${lastGuessData.matches === 1 ? 'letter' : 'letters'} matched</p>
                </div>
            `;
        }
    }
    
    statusHtml += '</div>';
    return statusHtml;
}

function renderLetterBoxes(letterAnalysis) {
    if (!letterAnalysis) return '';
    
    let boxesHtml = '<span class="letter-boxes">';
    for (const item of letterAnalysis) {
        boxesHtml += `<span class="letter-box ${item.status}">${item.letter}</span>`;
    }
    boxesHtml += '</span>';
    return boxesHtml;
}

function renderGuessHistory(game) {
    let historyHtml = '<div class="guess-history">';
    historyHtml += '<h2>Guess History</h2>';
    
    if (game.guesses.length > 0) {
        historyHtml += '<div class="guess-count">Total guesses: ' + game.guessCount + '</div>';
        historyHtml += '<div class="guess-grid">';
        
        for (const guess of game.guesses) {
            historyHtml += `
                <div class="guess-row">
                    ${renderLetterBoxes(guess.letterAnalysis)}
                    <span class="guess-info">${guess.matches} match${guess.matches !== 1 ? 'es' : ''}</span>
                </div>
            `;
        }
        
        historyHtml += '</div>';
    } else {
        historyHtml += '<p class="no-guesses">No guesses yet. Make your first guess!</p>';
    }
    
    historyHtml += '</div>';
    return historyHtml;
}

function renderGameControls(game) {
    let controlsHtml = '<div class="game-controls">';
    
    if (!game.won) {
        controlsHtml += `
            <div class="guess-form-container">
                <h3>Make a Guess</h3>
                <form action="/guess" method="POST" class="guess-form">
                    <input type="text" name="guess" placeholder="Enter your guess" 
                           autocomplete="off" class="guess-input">
                    <button type="submit" class="btn btn-primary">Guess</button>
                </form>
            </div>
        `;
    }
    
    controlsHtml += `
        <form action="/new-game" method="POST" class="new-game-form">
            <button type="submit" class="btn btn-success">Start New Game</button>
        </form>
    `;
    
    controlsHtml += '</div>';
    return controlsHtml;
}

function renderWordList(availableWords, guesses) {
    const guessedWords = guesses.map(g => g.word);
    
    let listHtml = '<div class="word-list-container">';
    listHtml += '<h2>Valid Word List</h2>';
    listHtml += '<div class="word-count">Words remaining: ' + availableWords.length + '</div>';
    listHtml += '<div class="word-list">';
    
    for (const word of availableWords) {
        const upperWord = word.toUpperCase();
        const isGuessed = guessedWords.includes(upperWord);
        const className = isGuessed ? 'word guessed' : 'word';
        listHtml += `<span class="${className}">${word}</span>`;
    }
    
    listHtml += '</div>';
    listHtml += '</div>';
    return listHtml;
}

module.exports = { renderGamePage };