'use strict';

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
}

const imply = function (values, value) {
    for (let i = 0; i < values.length; i++) {
        if (values[i].includes(value)) {
            return true;
        }
    }
    return false;
}

module.exports = {
    formatTime: formatTime,
    isSimilar: isSimilar,
    imply: imply
}
