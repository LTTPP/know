'use strict';

const aliAuthServClient = require('../../alicloud/ali.services.auth.client.js');
const util = require('../../utils/util.js');
const logger = require('../../utils/logger.js');

const accessToken = function () {
    let token = wx.getStorageSync('baidu-access_token');
    logger.log('Baidu get access token from local storage', 'access_token=' + token.access_token + ' expires_in=' + token.expires_in);
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
            logger.err('Baidu caching access token to local storage fail', err);
        }
    });
    logger.log('Baidu set access token to local storage', 'access_token=' + token.access_token + ' expires_in=' + token.expires_in);
}

function isValidToken(token) {
    if(!token) {
        return false;
    }
    var t = util.parse(token);
    if(Date.now() > t.expires_in) {
        return false;
    }
    logger.log('Baidu access token is valid');
    return true;
}

module.exports = {
    accessToken: accessToken
};