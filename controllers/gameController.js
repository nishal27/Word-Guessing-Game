"use strict";

const sessionManager = require('../models/sessions');
const { gameManager, words } = require('../models/games');
const { renderLoginPage } = require('../views/loginView');
const { renderGamePage } = require('../views/gameView');

const gameController = {
    renderHomePage: function(req, res) {
        const sid = req.cookies.sid;
        const username = sessionManager.getUsernameFromSession(sid);
        
        if (!username) {
            const html = renderLoginPage();
            res.send(html);
            return;
        }
        
        const game = gameManager.getGame(username);
        const html = renderGamePage(username, game, words);
        res.send(html);
    },

    makeGuess: function(req, res) {
        const sid = req.cookies.sid;
        const username = sessionManager.getUsernameFromSession(sid);
        
        if (!username) {
            const html = renderLoginPage('Session expired. Please login again.');
            res.status(401).send(html);
            return;
        }
        
        const guess = req.body.guess || '';
        const game = gameManager.getGame(username);
        
        if (!game.won) {
            game.makeGuess(guess);
        }
        
        res.redirect('/');
    },

    startNewGame: function(req, res) {
        const sid = req.cookies.sid;
        const username = sessionManager.getUsernameFromSession(sid);
        
        if (!username) {
            const html = renderLoginPage('Session expired. Please login again.');
            res.status(401).send(html);
            return;
        }
        
        gameManager.createNewGame(username);
        res.redirect('/');
    }
};

module.exports = gameController;