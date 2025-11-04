"use strict";

const words = require('../words');

const games = {};
const userStatistics = {};

class GameStatistics {
    constructor() {
        this.totalGamesPlayed = 0;
        this.gamesWon = 0;
        this.bestScore = null;
        this.currentStreak = 0;
        this.bestStreak = 0;
    }

    startNewGame() {
        this.totalGamesPlayed++;
    }

    recordWin(guessCount) {
        this.gamesWon++;
        this.currentStreak++;
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }
        if (this.bestScore === null || guessCount < this.bestScore) {
            this.bestScore = guessCount;
        }
    }

    recordLoss() {
        this.currentStreak = 0;
    }
}

class Game {
    constructor(username) {
        this.username = username;
        this.secretWord = this.pickSecretWord();
        this.guesses = [];
        this.won = false;
        this.lastGuess = null;
        this.lastGuessValid = true;
        this.guessCount = 0;
        
        if (!userStatistics[username]) {
            userStatistics[username] = new GameStatistics();
        }
        this.statistics = userStatistics[username];
        this.statistics.startNewGame();
        
        console.log(`${username}: ${this.secretWord}`);
    }

    pickSecretWord() {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex].toUpperCase();
    }

    isValidWord(word) {
        return words.some(w => w.toUpperCase() === word.toUpperCase());
    }

    hasBeenGuessed(word) {
        return this.guesses.some(g => g.word === word.toUpperCase());
    }

    analyzeGuess(word) {
        const upperWord = word.toUpperCase();
        const secretArray = this.secretWord.split('');
        const guessArray = upperWord.split('');
        const result = [];
        const usedSecretIndices = [];
        const usedGuessIndices = [];
        
        for (let guessIndex = 0; guessIndex < guessArray.length; guessIndex++) {
            if (guessIndex < secretArray.length && guessArray[guessIndex] === secretArray[guessIndex]) {
                result[guessIndex] = {
                    letter: guessArray[guessIndex],
                    status: 'correct-position'
                };
                usedSecretIndices[guessIndex] = true;
                usedGuessIndices[guessIndex] = true;
            }
        }
        
        for (let guessIndex = 0; guessIndex < guessArray.length; guessIndex++) {
            if (!usedGuessIndices[guessIndex]) {
                let foundWrongPosition = false;
                for (let secretIndex = 0; secretIndex < secretArray.length; secretIndex++) {
                    if (!usedSecretIndices[secretIndex] && guessArray[guessIndex] === secretArray[secretIndex]) {
                        result[guessIndex] = {
                            letter: guessArray[guessIndex],
                            status: 'wrong-position'
                        };
                        usedSecretIndices[secretIndex] = true;
                        foundWrongPosition = true;
                        break;
                    }
                }
                if (!foundWrongPosition) {
                    result[guessIndex] = {
                        letter: guessArray[guessIndex],
                        status: 'not-in-word'
                    };
                }
            }
        }
        
        const matches = result.filter(r => r.status !== 'not-in-word').length;
        
        return { letterAnalysis: result, matches };
    }

    countMatchingLetters(word) {
        const secretLetters = {};
        const guessLetters = {};
        
        for (const letter of this.secretWord.toUpperCase()) {
            secretLetters[letter] = (secretLetters[letter] || 0) + 1;
        }
        
        for (const letter of word.toUpperCase()) {
            guessLetters[letter] = (guessLetters[letter] || 0) + 1;
        }
        
        let matches = 0;
        for (const letter in guessLetters) {
            if (secretLetters[letter]) {
                matches += Math.min(guessLetters[letter], secretLetters[letter]);
            }
        }
        
        return matches;
    }

    makeGuess(word) {
        this.lastGuess = word;
        
        if (!word || word.trim() === '') {
            this.lastGuessValid = false;
            return { valid: false, message: 'Please enter a word to guess' };
        }
        
        const upperWord = word.toUpperCase();
        
        if (!this.isValidWord(word)) {
            this.lastGuessValid = false;
            return { valid: false, message: 'Not a valid word' };
        }
        
        if (this.hasBeenGuessed(upperWord)) {
            this.lastGuessValid = false;
            return { valid: false, message: 'Already guessed' };
        }
        
        this.lastGuessValid = true;
        const analysis = this.analyzeGuess(upperWord);
        const matches = this.countMatchingLetters(upperWord);
        
        this.guesses.push({ 
            word: upperWord, 
            matches,
            letterAnalysis: analysis.letterAnalysis 
        });
        this.guessCount++;
        
        if (upperWord === this.secretWord) {
            this.won = true;
            this.statistics.recordWin(this.guessCount);
            return { valid: true, correct: true, matches };
        }
        
        return { valid: true, correct: false, matches };
    }

    startNewGame() {
        if (!this.won && this.guessCount > 0) {
            this.statistics.recordLoss();
        }
        
        this.secretWord = this.pickSecretWord();
        this.guesses = [];
        this.won = false;
        this.lastGuess = null;
        this.lastGuessValid = true;
        this.guessCount = 0;
        this.statistics.startNewGame();
        console.log(`${this.username}: ${this.secretWord}`);
    }

    getAvailableWords() {
        const guessedWords = this.guesses.map(g => g.word);
        return words.filter(word => !guessedWords.includes(word.toUpperCase()));
    }

    getStatistics() {
        return {
            totalGamesPlayed: this.statistics.totalGamesPlayed,
            gamesWon: this.statistics.gamesWon,
            bestScore: this.statistics.bestScore,
            currentGuessCount: this.guessCount,
            currentStreak: this.statistics.currentStreak,
            bestStreak: this.statistics.bestStreak
        };
    }
}

const gameManager = {
    getGame: function(username) {
        if (!games[username]) {
            games[username] = new Game(username);
        }
        return games[username];
    },

    createNewGame: function(username) {
        const game = this.getGame(username);
        game.startNewGame();
        return game;
    }
};

module.exports = { gameManager, words };