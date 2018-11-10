'use strict';

const stringSimilarity = require('../lib/string-similarity/compare-strings.js');

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const isSimilar = (str1, str2) => {
    if (str1 && str1.includes(str2)) {
        return true;
    }
    if (str2 && str2.includes(str1)) {
        return true;
    }
    return stringSimilarity.compareTwoStrings(str1, str2) >= 0.5;
}

const implies = function (values, value) {
    for (let i = 0; i < values.length; i++) {
        if (this.isSimilar(values[i], value)) {
            return true;
        }
    }
    return false;
}

const isArray = function (bechecked) {
    return Array.isArray(bechecked);
}

const stringify = function (bestringified) {
    if(bestringified && !isString(bestringified)) {
        return JSON.stringify(bestringified)
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

module.exports = {
    formatTime: formatTime,
    isSimilar: isSimilar,
    implies: implies,
    isArray: isArray,
    stringify: stringify,
    parse: parse
}
