'use strict';

const ali = require('../alicloud/ali.services.tobase64.client');
const baidu = require('../baidu-aip/baidu.services.imgrecog.client');
const co = require('co');

const objectKey = 'sample.jpg';

// Upload picture to Ali OSS
//ali.put(objectKey, '../assets/' + objectKey);

// Convert file to base64 string and recognize
co(function* recognize() {
    var b64str = yield ali.tobase64(objectKey);
    var result = yield baidu.recognize(b64str);
    console.log(result);
});