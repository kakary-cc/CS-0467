// implement and export the following functions in this file:
// 1. parseCookies
// 2. manageSession

import { v4 } from 'uuid';

function parseCookies(req, res, next) {
    req.hwCookies = {};
    if (req.get('Cookie')) {
        req.get('Cookie').split(';').forEach((entry) => {
            const [key, value] = entry.split('=');
            req.hwCookies[key.trim()] = value.trim();
        });
    }
    // console.log(req.hwCookies);
    next();
}

const sessions = {};
function manageSession(req, res, next) {
    req.hwSession = {};
    if (req.hwCookies.sessionId in sessions) {
        console.log('session already exists: ', req.hwCookies.sessionId);
        req.hwSession = sessions[req.hwCookies.sessionId];
    }
    else {
        req.hwSession.sessionId = v4();
        console.log('session generated: ', req.hwSession.sessionId);
        res.append('Set-Cookie', `sessionId=${req.hwSession.sessionId}; HttpOnly`);
    }
    sessions[req.hwSession.sessionId] = req.hwSession;
    // console.log(req.hwSession);
    next();
}

export { parseCookies, manageSession };