const log4js = require('log4js');

log4js.configure({
    appenders: {Wit: {type: 'file', filename: 'Wit.log'}},
    categories: {default: {appenders: ['Wit'], level: 'debug'}}
});

const logger = log4js.getLogger('Wit');

module.exports = logger;