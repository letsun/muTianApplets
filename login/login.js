// login/login.js
const app = getApp()
const api = require("../utils/api.js")
const common = require("../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onShow() {
    console.log(app.globalData.openid)
  },

  vcode() {
    console.log(111)
  },

  login(e) {

    let that = this;
    let mobile = e.detail.value.mobile;
    let securityCode = e.detail.value.securityCode;

    common.requestPost(api.addOrLogin, {
      mobile: mobile,
      openId: app.globalData.openid,
      securityCode: ''
    }, res => {
      app.globalData.customerId = res.data.data.customerId;
      wx.redirectTo({
        url: '../home/home/home',
      })
    })

  }
})