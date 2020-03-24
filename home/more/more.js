// home/more/more.js
const app = getApp()
const api = require("../../utils/api.js")
const common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onShow() {
    let that = this;
    that.joinCorporation()
  },
  joinCorporation() {
    let that = this;
    common.requestGet(api.joinCorporation, {
    }, res => {
      let joinCorporation = res.data.data.batchList
      that.setData({
        joinCorporation: joinCorporation
      })
    })
  },
 
})