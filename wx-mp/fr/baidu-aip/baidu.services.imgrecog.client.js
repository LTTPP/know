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
        if (!util.isArray(results)) {
            return normalize(results.name);
        }
        let result1 = results[0];
        if (result1.score >= 0.5) {
            if (result1.score >= 0.5 && result1.score < 0.7) {
                return `应该是${normalize(result1.name)}`;
            } else if (result1.score >= 0.7 && result1.score < 9) {
                return `肯定是${normalize(result1.name)}`;
            } else if (result1.score >= 0.9) {
                return `无疑是${normalize(result1.name)}`;
            }
        } else if (result1.score >= 0.4) {
            let result2 = results[1];
            if (result1.score - result2.score < 0.15) {
                if (util.isSimilar(result1.name, result2.name)) {
                    return `应该是${normalize(result1.name)}`;
                }
                return `可能是${normalize(result1.name)}，也有可能是${normalize(result2.name)}；要不换个角度再试试`;
            } else {
                if (implies(results, result2.name, 1)) {
                    if (util.isSimilar(result1.name, result2.name)) {
                        return `应该是${normalize(result1.name)}`;
                    }
                    return `可能是${normalize(result1.name)}，也有可能是${normalize(result2.name)}；要不换个角度再试试`;
                }
                return `应该是${normalize(result1.name)}`;
            }
        } else {
            let result2 = results[1];
            if (implies(results, result1.name, 0) && util.isSimilar(result1.name, result2.name)) {
                return `应该是${normalize(result1.name)}`;
            }
            return `可能是${normalize(result1.name)}，也有可能是${normalize(result2.name)}；要不换个角度再试试`;
        }
    } else {
        return '没有结果返回，要不再试试';
    }
};

const normalize = function (name) {
    return name.replace('洛阳牡丹', '牡丹').replace('红鸡蛋花', '鸡蛋花').trim();
};

const implies = function (results, name, self) {
    let values = [];
    for (let i = 0; i < results.length; i++) {
        if (i === self) {
            continue;
        }
        values.push(results[i].name);
    }
    if (util.implies(values, name)) {
        return true;
    }
    return false;
};

module.exports = {
    recognize: recognize
};