const util = require('./util.js')

const log = (title, details) => {
    if (app) {
        if (!app.logs) {
            app.logs = []
        }
        app.logs.push('[' + util.formatTime(new Date()) + '] ' + (title || '') + ' ' + JSON.stringify(details))
    }
    console.log('[' + util.formatTime(new Date()) + ']', title || '', details || '')
}

const err = (title, details) => {
    if (app) {
        if (!app.logs) {
            app.logs = []
        }
        app.logs.push('[' + util.formatTime(new Date()) + '] ' + (title || '') + ' ' + JSON.stringify(details))
    }
    console.error('[' + util.formatTime(new Date()) + ']', title || '', details || '')
}

module.exports = {
    log: log,
    err: err
}
