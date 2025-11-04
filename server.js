"use strict";

const express = require('express');
const cookieParser = require('cookie-parser');

const gameController = require('./controllers/gameController');
const authController = require('./controllers/authController');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', gameController.renderHomePage);
app.post('/login', authController.login);
app.post('/logout', authController.logout);
app.post('/guess', gameController.makeGuess);
app.post('/new-game', gameController.startNewGame);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});