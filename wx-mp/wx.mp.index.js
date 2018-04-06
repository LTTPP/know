'use strict';

const ali = require('../alicloud/ali.services.tobase64.client');
const baidu = require('../baidu-aip/baidu.services.imgrecog.client');

const objectKey = 'sample.jpg';
const pathToFile = '../assets/' + objectKey;

(async function () {
    await ali.put(objectKey, pathToFile);
    let b64str = await ali.tobase64(objectKey);
    let result = await baidu.recognize(b64str);
    console.log(result);
})().catch(err => console.error(err));