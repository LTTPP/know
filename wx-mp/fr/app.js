//app.js

const logger = require('./utils/logger.js')

App({
  onLaunch: function () {

    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        logger.log('seesion valid')
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        logger.log('seesion expired')
        // (重新)登录
        logger.log('login...')
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {
              //发起网络请求
              /*wx.request({
                url: 'https://server.com/onLogin',
                data: {
                  code: res.code
                }
              })*/
              logger.log('code ' + res.code)
            } else {
              logger.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          logger.log('res.authSetting ' + JSON.stringify(res.authSetting))
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              logger.log('user info ' + JSON.stringify(res.userInfo))

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    logs: []
  }
})