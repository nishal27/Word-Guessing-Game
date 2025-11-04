"use strict";

const sessionManager = require('../models/sessions');
const { gameManager } = require('../models/games');
const { renderLoginPage } = require('../views/loginView');

const authController = {
    login: function(req, res) {
        const username = req.body.username || '';
        
        if (!username || username.trim() === '') {
            const html = renderLoginPage('Username cannot be empty. Please enter a username.');
            res.status(400).send(html);
            return;
        }
        
        if (!isValidUsername(username)) {
            const html = renderLoginPage('Invalid username. Please use only letters and numbers.');
            res.status(400).send(html);
            return;
        }
        
        if (username.toLowerCase() === 'dog') {
            const html = renderLoginPage('dog is not granted access');
            res.status(403).send(html);
            return;
        }
        
        const sid = sessionManager.createSession(username);
        
        gameManager.getGame(username);
        
        res.cookie('sid', sid);
        res.redirect('/');
    },

    logout: function(req, res) {
        const sid = req.cookies.sid;
        
        if (sid) {
            sessionManager.deleteSession(sid);
            res.clearCookie('sid');
        }
        
        res.redirect('/');
    }
};

function isValidUsername(username) {
    const validPattern = /^[a-zA-Z0-9]+$/;
    return username && validPattern.test(username);
}

module.exports = authController;