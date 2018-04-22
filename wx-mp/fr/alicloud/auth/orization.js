'use strict';

// reference https://github.com/peterhuang007/weixinFileToaliyun.git
const base64 = require('../../lib/base64.js');
require('../../lib/hmac.js');
require('../../lib/sha1.js');
const crypto = require('../../lib/crypto.js');

const accountID = "accountID";
const accessKeyId = "accessKeyId";
const accessKeySecret = "accessKeySecret";

const timeout = 87600;

const signature4Oss = function () {
    const bytes = crypto.HMAC(crypto.SHA1, policy(), accessKeySecret, {
        asBytes: true
    });
    return crypto.util.bytesToBase64(bytes);
};

const policy = function () {
    let expiration = new Date();
    expiration.setHours(expiration.getHours() + timeout);
    const policy = {
        "expiration": expiration.toISOString(), //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
        "conditions": [
            ["content-length-range", 0, 5 * 1024 * 1024] // 设置上传文件的大小限制5MB
        ]
    };
    return base64.encode(JSON.stringify(policy));
};

const signature4Fc = function () {
    const bytes = crypto.HMAC(crypto.SHA1, policy(), accessKeySecret, {
        asBytes: true
    });
    return crypto.util.bytesToBase64(bytes);
};

module.exports = {
    accountID: accountID,
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    oss: {
        policy: policy(),
        signature: signature4Oss()
    },
    fc: {
        signature: signature4Fc(),
        authorization: 'FC ' + accessKeyId + ':' + signature4Fc()
    }
};