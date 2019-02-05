//logs.js

const app = getApp()

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: app.logs || []
    })
  }
})
