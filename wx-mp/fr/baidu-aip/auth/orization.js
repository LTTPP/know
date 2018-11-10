'use strict';

const aliAuthServClient = require('../../alicloud/ali.services.auth.client.js');
const util = require('../../utils/util.js');
const logger = require('../../utils/logger.js');

const accessToken = function () {
    let token = wx.getStorageSync('baidu-access_token');
    logger.log('get baidu access token from local storage', token);
    if (isValidToken(token)) {
        return new Promise((resolve, reject) => {
            resolve(token);
        });
    }
    return aliAuthServClient.get('baidu-access_token', isValidToken, setStorage);
};

function setStorage(token) {
    wx.setStorage({
        key: 'baidu-access_token',
        data: token,
        fail: function (err) {
            logger.err('failed to cache baidu access token to local storage', err);
        }
    });
    logger.log('set baidu access token to local storage', token);
}

function isValidToken(token) {
    if(!token) {
        return false;
    }
    var t = util.parse(token);
    if(Date.now() > t.expires_in) {
        return false;
    }
    logger.log('access token is valid');
    return true;
}

module.exports = {
    accessToken: accessToken
};