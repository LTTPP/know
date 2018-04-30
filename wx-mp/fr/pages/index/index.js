//index.js

const logger = require('../../utils/logger.js');
const ali = require('../../alicloud/ali.services.tobase64.client.js');
const baidu = require('../../baidu-aip/baidu.services.imgrecog.client.js');

//获取应用实例
const app = getApp();

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
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
        })().catch(err => logger.err('ERROR', err));
    },

    showLogs: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                logger.log('user info' + res.userInfo);
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                });
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo;
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                }
            })
        }
    },

    getUserInfo: function (e) {
        console.log(e);
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
    }
});
