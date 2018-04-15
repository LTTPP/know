'use strict';

const logger = require('../utils/logger.js');

//更好的做法是把这些信息放到服务器进行签名，防止信息泄露
const auth = require('../auth/entication.js');

// reference https://github.com/peterhuang007/weixinFileToaliyun.git
const base64 = require('../lib/base64.js');
require('../lib/hmac.js');
require('../lib/sha1.js');
const crypto = require('../lib/crypto.js');

const region = 'oss-cn-beijing';
const bucket = 'wit-bkt';
const timeout = 87600;

const uploadFile = function (pathToFile) {
    return new Promise((resolve, reject) => {
        if (!pathToFile) {
            wx.showModal({
                title: '文件错误',
                content: '请重试',
                showCancel: false,
            });
            return;
        }

        const alicloudObjectKey = new Date().getTime() + '' + Math.random();
        logger.log('alicloud ObjectKey ' + alicloudObjectKey);
        wx.uploadFile({
            url: 'https://wit-bkt.oss-cn-beijing.aliyuncs.com',
            filePath: pathToFile,
            name: 'file',
            formData: {
                'key': alicloudObjectKey,
                'policy': policy(),
                'OSSAccessKeyId': auth.ali.accessKeyId,
                'signature': signature(),
                'success_action_status': '200',
            },
            success: function (res) {
                if (res.statusCode !== 200) {
                    reject(new Error('file upload failed ' + JSON.stringify(res)));
                    return;
                }
                logger.log('file upload success ' + JSON.stringify(res));
                resolve(alicloudObjectKey);
            },
            fail: function (err) {
                logger.log('file upload fail ' + JSON.stringify(err));
                reject(err);
            }
        });
    });
};

const tobase64 = function (objectKey) {
    return new Promise((resolve, reject) => {
        resolve('resp.data');
    });
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

const signature = function () {
    const bytes = crypto.HMAC(crypto.SHA1, policy(), auth.ali.accessKeySecret, {
        asBytes: true
    });
    return crypto.util.bytesToBase64(bytes);
};

module.exports = {
    uploadFile: uploadFile,
    tobase64: tobase64
};