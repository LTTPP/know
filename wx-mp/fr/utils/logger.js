const util = require('./util.js')

const app = getApp()

const log = str => {
  if (!app.logs) { app.logs = [] }
  app.logs.push('[' + util.formatTime(new Date()) + ']' + str)
  console.log('[' + util.formatTime(new Date()) + ']' + str)
}

module.exports = {
  log: log
}
