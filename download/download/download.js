// download/download/download.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  home() {
    wx.reLaunch({
      url: '../../home/home/home',
    })
  },

  download() {
    wx.reLaunch({
      url: '../../download/download/download',
    })
  },

  // 订单列表
  orderList() {
    wx.navigateTo({
      url: '../../download/orderList/orderList',
    })
  },

  // 会员升级
  member() {
    wx.navigateTo({
      url: '../../download/member/member',
    })
  },

  downloadList() {
    wx.navigateTo({
      url: '../../download/downloadList/downloadList',
    })
  },


  //扫码
  scanCode(){
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if (res.result != 'undefined') {
          var urlList = res.result.split('/');
          var code = urlList[urlList.length - 1];
          that.setData({
            code: code,
          });

          console.log(code);
        }
      }
    })
  }

})