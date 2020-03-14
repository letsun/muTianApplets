// home/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    texts: ['集团', '品牌'],
    indexa: 0,
    autoplay:true
  },

  onShow(){
    let that = this;
    that.setData({
      autoplay: true
    })
  },

  doc(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      indexa: index
    })
  },

  //首页
  home() {
    wx.reLaunch({
      url: '../../home/home/home',
    })
  },

  //下载首页
  download() {
    wx.reLaunch({
      url: '../../download/download/download',
    })
  },

  //企业产品信息
  productDetail() {
    wx.navigateTo({
      url: '../../home/productDetail/productDetail',
    })
  },

  //更多
  more() {
    wx.navigateTo({
      url: '../../home/more/more',
    })
  },

  //扫码
  scanCode() {
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
        }
      }
    })
  },

  onHide() {
    let that = this;
    that.setData({
      autoplay: false
    })
  }


})