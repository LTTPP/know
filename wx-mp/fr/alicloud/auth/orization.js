'use strict';

const logger = require('../../utils/logger.js');
const Buffer = require('../../lib/buffer/index.js').Buffer;

// reference https://github.com/peterhuang007/weixinFileToaliyun.git
const base64_oss = require('../../lib/base64-oss/base64.js');

const crypto_oss = require('../../lib/crypto-oss/crypto.js');
require('../../lib/crypto-oss/hmac.js');
require('../../lib/crypto-oss/sha1.js');

const crypto = require('../../lib/crypto/crypto.js');

const accountID = "1996421133443888";
const accessKeyId = "LTAIF7t1uxGkw7Oy";
const accessKeySecret = "VW5Od2goxM3D3azeIACLUnrycnqv9Q";

const timeout = 87600;

const signature4Oss = function () {
    const bytes = crypto_oss.HMAC(crypto_oss.SHA1, policy(), accessKeySecret, {
        asBytes: true
    });
    return crypto_oss.util.bytesToBase64(bytes);
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
    return base64_oss.encode(JSON.stringify(policy));
};

const signature4Fc = function (method, path, headers) {
    const contentMD5 = headers['Content-MD5'] || '';
    const contentType = headers['Content-Type'] || '';
    const date = headers['Date'];
    const theCanonicalizedHeaders = canonicalizedHeaders(headers, 'x-fc');
    let source = `${method}\n${contentMD5}\n${contentType}\n${date}\n${theCanonicalizedHeaders}${path}`;
    let buff = crypto.createHmac('sha256', accessKeySecret).update(source, 'utf8').digest();
    return new Buffer(buff, 'binary').toString('base64');
};

const canonicalizedHeaders = function (headers, prefix) {
    var list = [];
    var keys = Object.keys(headers);

    var theHeaders = {};
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];

        var lowerKey = key.toLowerCase().trim();
        if (lowerKey.startsWith(prefix)) {
            list.push(lowerKey);
            theHeaders[lowerKey] = headers[key];
        }
    }
    list.sort();

    var theCanonicalizedHeaders = '';
    for (let i = 0; i < list.length; i++) {
        const key = list[i];
        theCanonicalizedHeaders += `${key}:${theHeaders[key]}\n`;
    }

    return theCanonicalizedHeaders;
};

const auth4Fc = function (method, path, headers) {
    return 'FC ' + accessKeyId + ':' + signature4Fc(method, path, headers)
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
        authorization: auth4Fc
    }
};