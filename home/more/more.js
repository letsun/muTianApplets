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


    //点击合作糖厂查询企业信息
    productDetaila(e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      let joinCorporation = that.data.joinCorporation;
      let corporationId = joinCorporation[index].corporationId;
      wx.navigateTo({
        url: '../../home/productDetail/productDetail?batchNo=' + '' + '&corporationId=' + corporationId + '&types=' + 1,
      })
    },
 
})