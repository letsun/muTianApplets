const app = getApp()
const api = require("../utils/api.js")
const common = require("../utils/common.js")
Page({
  data: {

  },


  onShow() {
    common.showLoading()
    common.getopenid(res => {
      app.globalData.openid = res.data.data.openid
      if (res.data.status == 1) {
        common.requestGet(api.login, {
          openId: res.data.data.openid
        }, reg => {
          wx.hideLoading()
          if (reg.data.data.checkResult == "0") {
            
            wx.reLaunch({
              url: '../home/home/home',
            })

          } else {
            app.globalData.customerId = reg.data.data.customerId;
            wx.reLaunch({
              url: '../home/home/home',
            })
          }

        })
      } else {
        wx.hideLoading()
      }

    })
  }

})
