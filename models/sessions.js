"use strict";

const crypto = require('crypto');

const sessions = {};

const sessionManager = {
    createSession: function(username) {
        const sid = crypto.randomUUID();
        sessions[sid] = { username };
        return sid;
    },

    getSession: function(sid) {
        return sessions[sid];
    },

    deleteSession: function(sid) {
        delete sessions[sid];
    },

    getUsernameFromSession: function(sid) {
        const session = sessions[sid];
        return session ? session.username : null;
    }
};

module.exports = sessionManager;