// home/downloadList/downloadList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  ispay() {
    wx.navigateTo({
      url: '../../home/downloadDetail/downloadDetail',
    })


    //拉起微信支付
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: 'MD5',
      paySign: '',
      success (res) { },
      fail (res) { }
    })
  }

})