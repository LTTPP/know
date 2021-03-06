//index.js

const logger = require('../../utils/logger.js');
const ali = require('../../alicloud/ali.services.tobase64.client.js');
const baidu = require('../../baidu-aip/baidu.services.imgrecog.client.js');

//获取应用实例
app = getApp(); // This is a special case.

Page({
    data: {
        pathToIconCamera: '../../res/camera-sketch.png',
        pathToPhoto: '',
        result: ''
    },

    //事件处理函数
    takePhoto: function () {
        let that = this;
        wx.chooseImage({
            count: 1, success: this.work
        });
    },

    work: function (res) {
        logger.log('selected image', res);
        let pathToFile = res.tempFilePaths[0];

        const that = this;

        /*
        // Ali upload file
        wx.showLoading({ title: '正在上传...', mask: true });
        ali.uploadFile(pathToFile).then(objectKey => {
            wx.hideLoading();
            // Ali base64 encoded
            wx.showLoading({ title: '正在转码...', mask: true });
            return ali.tobase64(objectKey);
        }).then(b64str => {
            wx.hideLoading();
            // Baidu recognize
            wx.showLoading({ title: '正在识别...', mask: true });
            return baidu.recognize(b64str);
        }).then(result => {
            wx.hideLoading();
            that.setData({
                result: result,
                pathToPhoto: pathToFile
            });
            logger.log('page index data', that.data);
        });
        */

        (async function () {
            // Ali upload file
            wx.showLoading({ title: '正在上传...', mask: true });
            let objectKey = await ali.uploadFile(pathToFile);
            wx.hideLoading();

            // Ali base64 encoded
            wx.showLoading({ title: '正在转码...', mask: true });
            let b64str = await ali.tobase64(objectKey);
            wx.hideLoading();

            // Baidu recognize
            wx.showLoading({ title: '正在识别...', mask: true });
            let result = await baidu.recognize(b64str);
            wx.hideLoading();

            that.setData({
                result: result,
                pathToPhoto: pathToFile
            });
            logger.log('page index data', that.data);
        })().catch(err => {
            wx.hideLoading();
            logger.err('ERROR', err);
            that.setData({
                result: '发生错误，请重试',
                pathToPhoto: pathToFile
            });
        });
    },

    showLogs: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    onLoad: function () {

    }
});
