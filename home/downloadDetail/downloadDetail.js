// home/downloadDetail/downloadDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask:false
  },


  //下载弹窗
  downbtn() {
    let that = this;
    that.setData({
      mask:true
    })
  },

  //关闭弹窗
  closemask(){
    let that = this;
    that.setData({
      mask:false
    })
  },  

  //电脑下载链接
  downloadPc() {
    wx.navigateTo({
      url: '../../home/downloadPc/downloadPc',
    })
  },
  
  onHide() {
    let that = this;
    that.setData({
      mask: false
    })
  } 
})