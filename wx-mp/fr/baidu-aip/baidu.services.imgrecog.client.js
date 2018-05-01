'use strict';

const logger = require('../utils/logger.js');
const util = require('../utils/util.js');
const auth = require('./auth/orization');

const recognize = function (b64str) {
    return new Promise((resolve, reject) => {
        let image = encodeURIComponent(b64str);
        wx.request({
            url: `https://aip.baidubce.com/rest/2.0/image-classify/v1/plant?access_token=${auth.access_token}`,
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: `image=${image}`,
            success: resp => {
                if (resp.statusCode !== 200) {
                    logger.err('image recognition fail', resp);
                    return reject(resp);
                }
                if (resp.data && resp.data.error_code) {
                    logger.err('image recognition fail', resp);
                    return reject(resp);
                }
                logger.log('image recognition success', resp);
                resolve(onResult(resp.data && resp.data.result));
            },
            fail: function (err) {
                logger.err('image recognition fail', err);
                reject(err);
            }
        });
    });
};

const onResult = function (results) {
    if (results) {
        let result1 = results[0];
        if (result1.score >= 0.5) {
            if (result1.score >= 0.5 && result1.score < 0.6) {
                return `应该是${normalize(result1.name)}`;
            } else if (result1.score >= 0.6 && result1.score < 9) {
                return `应该是${normalize(result1.name)}没错`;
            } else if (result1.score >= 0.9 && result1.score < 1) {
                return `肯定是${normalize(result1.name)}`;
            } else {
                return `无疑是${normalize(result1.name)}`;
            }
        } else if (result1.score >= 0.4) {
            let result2 = results[1];
            if (result1.score - result2.score < 0.15) {
                if (util.isSimilar(result1.name, result2.name)) {
                    return `应该是${normalize(result1.name)}`;
                }
                return `可能是${normalize(result1.name)}，也有可能是${normalize(result2.name)}`;
            } else {
                let values = [];
                for (let i = 0; i < results.length; i++) {
                    if (i === 1) {
                        continue;
                    }
                    values.push(results[i].name);
                }
                if (util.imply(values, result2.name)) {
                    if (util.isSimilar(result1.name, result2.name)) {
                        return `应该是${normalize(result1.name)}`;
                    }
                    return `可能是${normalize(result1.name)}，也有可能是${normalize(result2.name)}`;
                }
                return `应该是${normalize(result1.name)}`;
            }
        } else {
            let result2 = results[1];
            return `可能是${normalize(result1.name)}，也有可能是${normalize(result2.name)}`;
        }
    } else {
        return '没有结果返回，要不再试试';
    }
};

const normalize = function (name) {
    return name.replace('洛阳', '').replace('红鸡蛋花', '鸡蛋花');
};

module.exports = {
    recognize: recognize
};