/*
if you open the initializer feature, please implement the initializer function, as below:
module.exports.initializer = function(context, callback) {
  console.log('initializing');
  callback(null, '');
};
*/

'use strict';

const OSS = require('ali-oss').Wrapper;
const https = require('https');

const accessKeyId = '{accessKeyId}';
const accessKeySecret = '{accessKeySecret}';
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
        if (isValidToken(value.toString())) {
            callback(null, value);
        } else {
            renew((newValue) => { // plain text
                // process expires_in value
                const v = normalize(newValue); // JSON object
                // refresh the OOS
                ossclient.put(key, Buffer.from(stringify(v))); // buffer type
                // return to client
                callback(null, stringify(v)); // Accept buffer and string
            }, (err) => {
                callback(err);
            })
        }
    }).catch(function (err) {
        callback(err);
    });
}

const renew = function (resolve, reject) {
    const req = https.request({
        hostname: 'aip.baidubce.com',
        path: '/oauth/2.0/token?grant_type=client_credentials&client_id={client_id}&client_secret={client_secret}'
    }, (rep) => {
        console.log('kauth', 'status code', rep.statusCode);
        rep.on('data', (d) => {
            resolve(d.toString());
        })
    })

    req.on('error', (e) => {
        console.error('kauth', e);
        reject(e);
    })
    req.end()
}

const isValidToken = function (token) {
    if (!token) {
        console.log('kauth', 'access token is null');
        return false;
    }
    var t = parse(token)
    if (t.expires_in && (Date.now() > t.expires_in)) {
        console.log('kauth', 'access token is expired');
        return false;
    }
    if (!t.access_token) {
        console.log('kauth', 'access token is missing');
        return false;
    }
    console.log('kauth', 'access token is valid');
    return true;
}

const normalize = function (token) {
    if (!token) {
        console.log('kauth', 'access token is null');
        throw 'kauth access token is null';
    }
    var t = parse(token);
    t.expires_in = Date.now() + t.expires_in/* 30 days in sec */ * 1000 - 1/* hour */ * 60 * 60 * 1000;
    return t;
}

const stringify = function (bestringified) {
    if (bestringified) {
        if (isString(bestringified)) {
            return bestringified;
        }
        return JSON.stringify(bestringified);
    } else {
        return '';
    }
}

function isString(bechecked) {
    return typeof bechecked === 'string' && bechecked.constructor === String || Object.prototype.toString.apply(bechecked) === '[object String]' || bechecked instanceof String;
}

function parse(value) {
    return isString(value) ? JSON.parse(value) : value;
}

const handler = function (event, context, callback) {
    console.log('kauth', 'k', event.toString()); // event is Buffer type
    kv(event.toString(), callback);
};

module.exports.handler = handler;