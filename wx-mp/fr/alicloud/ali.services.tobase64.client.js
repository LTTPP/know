'use strict';

const logger = require('../utils/logger.js');

//更好的做法是把这些信息放到服务器进行签名，防止信息泄露
const auth = require('./auth/orization.js');

const region = 'cn-beijing';
const bucket = 'wit-bkt';

const aliHost = `${auth.accountID}.${region}.fc.aliyuncs.com`;
const ossUrl = `https://${bucket}.oss-${region}.aliyuncs.com`;
const fcUrl = `https://${auth.accountID}.${region}.fc.aliyuncs.com/2016-08-15/services/Wit/functions/tobase64/invocations`;
const fcPath = '/2016-08-15/services/Wit/functions/tobase64/invocations';

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
        logger.log('alicloud ObjectKey', alicloudObjectKey);
        wx.uploadFile({
            url: ossUrl,
            filePath: pathToFile,
            name: 'file',
            formData: {
                'key': alicloudObjectKey,
                'policy': auth.oss.policy,
                'OSSAccessKeyId': auth.accessKeyId,
                'signature': auth.oss.signature,
                'success_action_status': '200',
            },
            success: function (resp) {
                if (resp.statusCode !== 200) {
                    logger.err('file upload fail', resp);
                    return reject(resp);
                }
                logger.log('file upload success');
                resolve(alicloudObjectKey);
            },
            fail: function (err) {
                logger.err('file upload fail', err);
                reject(err);
            }
        });
    });
};

const tobase64 = function (objectKey) {
    let reqData = JSON.stringify({key: objectKey});
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
                    logger.err('base64 encoding fail', resp);
                    return reject(resp);
                }
                logger.log('base64 encoding success');
                resolve(resp.data);
            },
            fail: function (err) {
                logger.err('base64 encoding fail', err);
                reject(err);
            }
        });
    });
};

module.exports = {
    uploadFile: uploadFile,
    tobase64: tobase64
};