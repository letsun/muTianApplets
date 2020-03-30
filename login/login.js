// login/login.js
const app = getApp()
const api = require("../utils/api.js")
const common = require("../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:'获取验证码',
    disabled:false,
  },

  onShow() {

  },

  mobile(e) {
    let that = this;
    let mobile = e.detail.value;
    that.setData({
      mobile: mobile
    })
  },

  //获取验证码
  vcode() {
    let that = this;
    let mobile = that.data.mobile;
    let time = 59; //验证码时间

    if (mobile==''||mobile==null) {
      common.showToast('请输入手机号码','none',res=>{})
      return false;
    }

    if (mobile.length<11) {
      common.showToast('请输入正确的手机号码','none',res=>{})
      return false;
    }

    if (!that.data.disabled) {
      common.requestPost(api.getValidCode, {
        mobile: mobile,
      }, res => {


        if (!that.data.disabled) {

          that.setData({
            text:'59秒后重试',
            disabled: true
          })
          let interval = setInterval(res => {
            time--;
            if (time > 0) {
              that.setData({
                text: time + '秒后重试',
                
              })
            } else {
              clearInterval(interval);
              that.setData({
                text: '获取验证码',
                disabled: false
              })
            }
          }, 1000)
        }
      })
    }

  },

  login(e) {
    let that = this;
    let mobile = e.detail.value.mobile;
    let securityCode = e.detail.value.securityCode;

    if (mobile<11) {
      common.showToast('请输入正确的手机号码', 'none', res => { })
      return false
    }
    if (securityCode =='') {
      common.showToast('请输入验证码', 'none', res => { })
      return false
    }

    common.requestPost(api.addOrLogin, {
      mobile: mobile,
      openId: app.globalData.openid,
      securityCode: securityCode
    }, res => {
      app.globalData.customerId = res.data.data.customerId;
      wx.redirectTo({
        url: '../home/home/home',
      })
    })

  }
})