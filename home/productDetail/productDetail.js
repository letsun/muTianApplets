// home/productDetail/productDetail.js

const app = getApp()
const api = require("../../utils/api.js")
const common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    corporationId:'',
    types:'',
    batchNo:'',
    // corporationId: '59',
    // types: '1',
    // batchNo: '20180205-0427'
  },

  onLoad(options) {
    //types 1是直接进来的
    let that = this;
    if (types == 1) {
      that.setData({
        batchNo: options.batchNo,
        corporationId: options.corporationId,
      })
    }else {
      
    }

  },

  onShow() {
    let that = this;
    that.homePageQuery();
    that.banner();
    that.setData({
      autoplay: true
    })
  },

  //Banner轮播图
  banner() {
    let that = this;
    common.requestGet(api.banner, {
      corpId: that.data.corporationId
    }, res => {
      that.setData({
        banner: res.data.data.list
      })
    })
  },

  //查询企业产品信息
  homePageQuery() {
    let that = this;
    let batchNo = that.data.batchNo;
    let corporationId = that.data.corporationId;
    common.requestPost(api.homePageQuery, {
      batchNo: batchNo,
      corporationId: corporationId
    }, res => {
      let introduction = res.data.data.systemCorporation.introduction
      var detail = '';
      if (introduction) {
        that.setData({
          recipesDesc: detail.replace(/\<img/gi, '<img style="display:block;max-width:690rpx;margin:0 auto;height:auto;"> '),
        })
      }
      that.setData({
        homePageQuery: res.data.data,
        introduction: introduction
      }) 
    })
  },
  //下载中心
  downloadCenter() {
    let that = this;
    wx.navigateTo({
      url: '../../home/downloadCenter/downloadCenter?corporationId=' + that.data.corporationId,
    })
  },

  onHide(){
    let that = this;
    that.setData({
      autoplay:false
    })
  }
})