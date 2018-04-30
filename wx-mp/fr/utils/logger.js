const util = require('./util.js')

const app = getApp()

const log = (title, details) => {
    if (app) {
        if (!app.logs) {
            app.logs = []
        }
        app.logs.push('[' + util.formatTime(new Date()) + '] ' + title || '' + ' ' + details || '')
    }
    console.log('[' + util.formatTime(new Date()) + ']', title || '', details || '')
}

const err = (title, details) => {
    if (app) {
        if (!app.logs) {
            app.logs = []
        }
        app.logs.push('[' + util.formatTime(new Date()) + '] ' + title || '' + ' ' + details || '')
    }
    console.error('[' + util.formatTime(new Date()) + ']', title || '', details || '')
}

module.exports = {
    log: log,
    err: err
}
