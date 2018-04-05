'use strict';

const ali = require('../alicloud/ali.services.tobase64.client');
const baidu = require('../baidu-aip/baidu.services.imgrecog.client');
const co = require('co');
const thunkify = require('thunkify');

const objectKey = 'sample.jpg';

// Upload picture to Ali OSS
ali.put(objectKey, '../assets/' + objectKey);

// Convert file to base64 string and recognize
thunkify(ali.tobase64)(objectKey)(function (b64str) {
    thunkify(baidu.recognize)(b64str)(function (result) {
        console.log(result);
    });
});