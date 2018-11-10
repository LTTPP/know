'use strict';

const logger = require('../utils/logger.js');

//更好的做法是把这些信息放到服务器进行签名，防止信息泄露
const auth = require('./auth/orization.js');

const region = 'cn-beijing';

const aliHost = `${auth.accountID}.${region}.fc.aliyuncs.com`;
const fcUrl = `https://${auth.accountID}.${region}.fc.aliyuncs.com/2016-08-15/services/Wit/functions/auth/invocations`;
const fcPath = '/2016-08-15/services/Wit/functions/auth/invocations';

const get = function (objectKey, validator, join) {
    if(!objectKey) {
        return;
    }
    let reqData = objectKey;
    let headers = {
        'Host': aliHost,
        'Date': new Date().toGMTString(),
        'Content-Type': 'application/json',
        'Content-Length': reqData.length
    };
    headers['Authorization'] = auth.fc.authorization('POST', fcPath, headers);

    return new Promise((resolve, reject) => {
        wx.request({
            url: fcUrl,
            method: 'POST',
            header: headers,
            data: reqData,
            success: resp => {
                if (resp.statusCode !== 200) {
                    logger.err('Ali services auth fail', resp);
                    return reject(resp);
                }
                logger.log('Ali services auth success', resp.data);
                if(validator(resp.data)) {
                    join(resp.data);
                    resolve(resp.data);
                } else {
                    logger.err('Ali services auth fail', 'token validation fail');
                    reject('Ali services auth fail: token validation fail');
                }
            },
            fail: function (err) {
                logger.err('Ali services auth fail', err);
                reject(err);
            }
        });
    });
};

module.exports = {
    get: get
};