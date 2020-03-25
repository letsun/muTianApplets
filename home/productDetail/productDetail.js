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
    //types 1是直接进来的 2扫码进来的
    // console.log(options)
    let that = this;
    if (options.types == 1) {
      that.setData({
        batchNo: options.batchNo,
        corporationId: options.corporationId,
        types:options.types
      })
      that.homePageQuery();
      that.banner();
    }else {    
      that.setData({
        code: options.code,
        types: options.types
      })
      that.produceBatch();
    }

  },

  onShow() {
    let that = this;
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

  //直接查询企业产品信息
  homePageQuery() {
    let that = this;
    let batchNo = that.data.batchNo;
    let corporationId = that.data.corporationId;
    common.requestGet(api.homePageQuery, {
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


  //二维码进来查询企业产品信息
  produceBatch() {
    let that = this;
    let batchNo = that.data.batchNo;
    let corporationId = that.data.corporationId;
    common.requestGet(api.produceBatch + that.data.code, {

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
        introduction: introduction,
        corporationId: res.data.data.systemCorporation.id
      })

      that.banner();
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