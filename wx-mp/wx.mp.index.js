'use strict';

const ali = require('../alicloud/ali.services.tobase64.client');
const baidu = require('../baidu-aip/baidu.services.imgrecog.client');
const co = require('co');

const objectKey = 'sample.jpg';

// Upload picture to Ali OSS
//ali.put(objectKey, '../assets/' + objectKey);

// Convert file to base64 string and recognize
ali.tobase64(objectKey).then(function (b64str) {
    return baidu.recognize(b64str);
}).then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.error(err);
});