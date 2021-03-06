// download/member/member.js
const app = getApp()
const api = require("../../utils/api.js")
const common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexa:'2',
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
      let indexa = that.data.indexa;


      if (customerDetail.endTime!=null) {
        let endTime = customerDetail.endTime.split(' ');
        that.setData({
          endTime:endTime[0]
        })
      }
      


      if (res.data.data.levelUp!='') {
        var nowLevelConfigId = res.data.data.levelUp[indexa].id
      }else {
        var nowLevelConfigId = ''
      }
      that.setData({
        customerDetail: customerDetail,
        nowLevelConfigId: nowLevelConfigId,
        
      })
    })
  },


  //微信支付
  unifiedorder() {
    let that = this;
    let levelConfigId = that.data.nowLevelConfigId

    common.showLoading()
    common.requestPost(api.unifiedorder, {
      customerId: app.globalData.customerId,
      levelConfigId: levelConfigId,
      openid: app.globalData.openid,
      type: 1
    }, res => {
      that.setData({
        unifiedorder: res.data.data
      },res=>{
        that.isPlay()
        
      })
   
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
          that.completPayment(1)
        })
        wx.hideLoading({})
      },
      fail(reg) {
        that.completPayment(0)
        wx.hideLoading({})
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

      // setTimeout()
      that.customerDetail()
    })
  },




  //返回下载首页
  download() {
    wx.reLaunch({
      url:'../../download/download/download'
    })
  }
})