'use strict';

const logger = require('../utils/logger.js');

//更好的做法是把这些信息放到服务器进行签名，防止信息泄露
const auth = require('./auth/orization.js');

const region = 'oss-cn-beijing';
const bucket = 'wit-bkt';

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
                'policy': auth.oss.policy,
                'OSSAccessKeyId': auth.accessKeyId,
                'signature': auth.oss.signature,
                'success_action_status': '200',
            },
            success: function (res) {
                if (res.statusCode !== 200) {
                    reject(new Error('file upload fail ' + JSON.stringify(res)));
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
    let reqData = JSON.stringify({ key: '15243098117600.9993882890277408' });
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://1996421133443888.cn-beijing.fc.aliyuncs.com/2016-08-15/services/Wit/functions/tobase64/invocations',
            method: 'POST',
            header: {
                'Host': '1996421133443888.cn-beijing.fc.aliyuncs.com',
                'Date': new Date().toGMTString(),
                'Content-Type': 'application/json',
                'Content-Length': reqData.length,
                'Authorization': 'FC ' + auth.accessKeyId + ':' + auth.fc.signature
            },
            data: reqData,
            success: resp => {
                if (resp.statusCode !== 200) {
                    logger.log('base64 encoding fail ' + JSON.stringify(resp));
                    reject(new Error('base64 encoding fail ' + JSON.stringify(resp)));
                    return;
                }
                logger.log('base64 encoding success ' + JSON.stringify(resp));
                resolve(resp.data);
            },
            fail: function (err) {
                logger.log('base64 encoding fail ' + JSON.stringify(err));
                reject(err);
            }
        });
    });
};

module.exports = {
    uploadFile: uploadFile,
    tobase64: tobase64
};