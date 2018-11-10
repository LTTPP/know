/*
if you open the initializer feature, please implement the initializer function, as below:
module.exports.initializer = function(context, callback) {
  console.log('initializing');
  callback(null, '');
};
*/

'use strict';

const OSS = require('ali-oss').Wrapper;

const accessKeyId = 'LTAIF7t1uxGkw7Oy';
const accessKeySecret = 'VW5Od2goxM3D3azeIACLUnrycnqv9Q';
const bucket = 'wit-bkt';

function kv(key, callback) {
    const ossclient = new OSS({
        region: 'oss-cn-beijing',
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        bucket: bucket
    });

    ossclient.get(key).then(function (res) {
        const value = res.content; // plain text
        callback(null, value);
    }).catch(function (err) {
        callback(err);
    });
}

const handler = function (event, context, callback) {
    console.log('function', 'kv', event.toString()); // event is Buffer type
    kv(event.toString(), callback);
};

module.exports.handler = handler;