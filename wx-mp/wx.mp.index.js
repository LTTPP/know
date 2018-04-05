'use strict';

const ali = require('../alicloud/ali.services.tobase64.client');
const baidu = require('../baidu-aip/baidu.services.imgrecog.client');
const co = require('co');

const objectKey = 'sample.jpg';

// Upload picture to Ali OSS
//ali.put(objectKey, '../assets/' + objectKey);

// Convert file to base64 string and recognize
function* recognize(objectKey) {
    let b64str = yield ali.tobase64(objectKey);
    let result = yield baidu.recognize(b64str);
    console.log(result);
}

var r = recognize(objectKey);
r.next().value.then(function (b64str) {
    return r.next(b64str).value;
}).then(function (result) {
    r.next(result);
});