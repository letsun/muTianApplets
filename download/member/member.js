// download/member/member.js
const app = getApp()
const api = require("../../utils/api.js")
const common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexa:'0',
  },

  memberBtn (e) {
    let that= this;
    let index = e.currentTarget.dataset.index;
    let nowLevelConfigId = e.currentTarget.dataset.id
    that.setData({
      indexa:index,
      nowLevelConfigId: nowLevelConfigId
    })
  },

  onShow() {
    let that = this
    that.customerDetail()
  },

  //客户信息查询
  customerDetail() {
    let that = this;
    common.requestGet(api.customerDetail, {
      customerId: app.globalData.customerId,
      openid: app.globalData.openid
    }, res => {
      let customerDetail = res.data.data;
      
      if (res.data.data.levelUp!='') {
        var nowLevelConfigId = res.data.data.levelUp[0].id
      }else {
        var nowLevelConfigId = ''
      }
      that.setData({
        customerDetail: customerDetail,
        nowLevelConfigId: nowLevelConfigId
      })
    })
  },

  // levelUp() {
  //   let that = this;
  //   common.requestGet(api.levelUp, {
  //     customerId: app.globalData.customerId,
  //     nowLevelConfigId: that.data.nowLevelConfigId
  //   }, res => {

  //     that.customerDetail()
  //   })
  // },



  //微信支付
  unifiedorder() {
    let that = this;
    let levelConfigId = that.data.nowLevelConfigId
    common.requestPost(api.unifiedorder, {
      customerId: app.globalData.customerId,
      levelConfigId: levelConfigId,
      openid: app.globalData.openid,
      type: 1
    }, res => {
      that.setData({
        unifiedorder: res.data.data
      })
      that.isPlay()
    })
  },

  //拉起微信支付
  isPlay() {
    let that = this;
    let unifiedorder = that.data.unifiedorder;
    wx.requestPayment({
      timeStamp: unifiedorder.timeStamp,
      nonceStr: unifiedorder.nonceStr,
      package:'prepay_id='+ unifiedorder.prepayId,
      signType: unifiedorder.signType,
      paySign: unifiedorder.paySign,
      success(reg) {
        common.showToast('支付成功', 'success', red => {
          that.customerDetail()
          that.completPayment(1)
        })
      },
      fail(reg) {
        that.completPayment(0)
      }
    })
  },

  //完成支付
  completPayment(status) {
    
    let that = this;
    let unifiedorder = that.data.unifiedorder;
    common.requestPost(api.completPayment, {
      paymentId: unifiedorder.paymentId,
      status: status
    }, res => {

    })
  },




  //返回下载首页
  download() {
    wx.reLaunch({
      url:'../../download/download/download'
    })
  }
})