// download/downloadList/downloadList.js
const app = getApp()
const api = require("../../utils/api.js")
const common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lista: [{
      name: 'a',
      tq: [{
        name: 'a糖厂'
      }, {
        name: 'b糖厂'
      }]
    }, {
      name: 'b',

      tq: [{
        name: 'a糖厂'
      }, {
        name: 'b糖厂'
      }]
    }],
  },

  onShow() {
    let that = this;
    that.sortHistoryCorp()
  },
  //已下载糖企列表
  sortHistoryCorp() {
    let that = this;
    common.requestGet(api.sortHistoryCorp, {
      customerId: app.globalData.customerId,
    }, res => {
      let list = res.data.data;
      let indexa = [];
      for (var i in list) {
        var index = i
        indexa.push(index)
      }

      that.setData({
        list: list,
        index: indexa[0]
      })
    })
  },

  colorbtn(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      index: index
    })
  },

  //跳转到下载详情
  btnNav(e) {
    let that = this;
    let corpId = e.currentTarget.dataset.corpid
    wx.navigateTo({
      url: '../../home/downloadDetail/downloadDetail?corpId=' + corpId + '&type=' + 2,
    })
  },

})