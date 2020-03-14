// home/downloadPc/downloadPc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'https://www.baidu.com'
  },
  copy() {
    let that= this;
    let value = that.data.value;
    wx.setClipboardData({
      data: value,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }

})