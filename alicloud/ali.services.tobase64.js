'use strict';

const OSS = require('ali-oss').Wrapper;

const accessKeyId = 'accessKeyId';
const accessKeySecret = 'accessKeySecret';
const bucket = 'wit-bkt';

function fromOssObject(key, callback) {
    const ossclient = new OSS({
        region: 'oss-cn-beijing',
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        bucket: bucket
    });

    ossclient.get(key).then(function (res) {
        const buf = res.content;
        const b64str = buf.toString('base64');
        callback(null, b64str);
    }).catch(function (err) {
        callback(err);
    });
}

const handler = function (event, context, callback) {
    console.log('function', 'tobase64');
    fromOssObject(JSON.parse(event).key, callback);
};

module.exports.handler = handler;