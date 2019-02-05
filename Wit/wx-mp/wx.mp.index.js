'use strict';

const ali = require('../alicloud/ali.services.tobase64.client');
const baidu = require('../baidu-aip/baidu.services.imgrecog.client');

const objectKey = 'sample.jpg';
const pathToFile = '../assets/' + objectKey;

(async function () {
    // Ali upload file
    await ali.put(objectKey, pathToFile);
    // Ali base64 encoded
    let b64str = await ali.tobase64(objectKey);
    // Baidu recognize
    let result = await baidu.recognize(b64str);
    console.log(result);
})().catch(err => console.error(err));