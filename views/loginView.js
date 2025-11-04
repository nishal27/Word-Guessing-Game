"use strict";

function renderLoginPage(errorMessage = '') {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Word Guessing Game - Login</title>
        <link rel="stylesheet" href="/base.css">
        <link rel="stylesheet" href="/layout.css">
        <link rel="stylesheet" href="/components.css">
        <link rel="stylesheet" href="/login.css">
    </head>
    <body>
        <div class="container">
            <header class="header">
                <h1>Word Guessing Game</h1>
            </header>
            <main class="main-content">
                <div class="login-container">
                    <h2>Login to Play</h2>
                    ${errorMessage ? `<div class="error-message">${errorMessage}</div>` : ''}
                    <form action="/login" method="POST" class="login-form">
                        <div class="form-group">
                            <label for="username">Username:</label>
                            <input type="text" id="username" name="username" 
                                   placeholder="Enter username (letters and numbers only)">
                        </div>
                        <button type="submit" class="btn btn-primary">Login</button>
                    </form>
                    <div class="login-info">
                        <p>No password required - just enter a username to start playing!</p>
                    </div>
                </div>
            </main>
        </div>
    </body>
    </html>
    `;
}

module.exports = { renderLoginPage };