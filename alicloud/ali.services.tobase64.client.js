'use strict';

const FCClient = require('@alicloud/fc2');
const OSS = require('ali-oss');
const co = require('co');
const auth = require('../auth/entication');

const serviceName = 'Wit';
const funcName = 'tobase64';
const bucket = 'wit-bkt';

const put = function (objectKey, pathToFile) {
    let ossclient = new OSS({
        region: 'oss-cn-beijing',
        accessKeyId: auth.ali.accessKeyId,
        accessKeySecret: auth.ali.accessKeySecret,
        bucket: bucket
    });

    co(function* () {
        ossclient.useBucket(bucket);
        const result = yield ossclient.put(objectKey, pathToFile);
        console.log(result);
    }).catch(function (err) {
        console.log(err);
    });
};

const tobase64 = function (objectKey, callback) {
    let client = new FCClient(auth.ali.accountID, {
        accessKeyID: auth.ali.accessKeyId,
        accessKeySecret: auth.ali.accessKeySecret,
        region: 'cn-beijing',
        timeout: 10 * 1000 // 10s
    });
    let res = {key: objectKey};
    return client.invokeFunction(serviceName, funcName, JSON.stringify(res)).then(function (resp) {
        callback(resp.data);
    }).catch(function (err) {
        console.log(err);
    });
};

module.exports = {
    put: put,
    tobase64: tobase64
};