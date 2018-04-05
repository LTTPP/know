'use strict';

const https = require('https');
const auth = require('../auth/entication');

const recognize = function (b64str) {
    return new Promise((resolve, reject) => {
        let image = encodeURIComponent(b64str);

        let options = {
            hostname: 'aip.baidubce.com',
            port: 443,
            path: '/rest/2.0/image-classify/v1/plant?access_token=' + auth.baidu.access_token,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        let reqt = https.request(options, (resp) => {
            resp.on('data', (chunk) => {
                let result = JSON.parse(chunk).result[0];
                resolve(result);
            });
        });
        reqt.write('image=' + image);

        reqt.on('error', (e) => {
            console.error(e);
            reject(e);
        });
        reqt.end();
    });
};

module.exports = {
    recognize: recognize
};