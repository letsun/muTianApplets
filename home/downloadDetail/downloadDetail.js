// home/downloadDetail/downloadDetail.js
const app = getApp()
const api = require("../../utils/api.js")
const common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask: false,
    orderId: '',
    corpId: '',
    // type: '1',
    // orderId: '18',

  },

  onLoad(options) {
    //console.log(options)
    let that = this;
    if (options.type == 1) {
      that.setData({
        orderId: options.orderId,
        type: options.type,
      })
      wx.setNavigationBarTitle({
        title: '订单下载详情'
      })
    } else {
      that.setData({
        type: options.type,
        corpId: options.corpId,
      })
      wx.setNavigationBarTitle({
        title: '企业下载详情'
      })
    }
  },
  onShow() {
    let that = this;
    that.orderDetail();
  },

  //订单下载详情(单/汇总)
  orderDetail() {
    let that = this;
    common.requestPost(api.orderDetail, {
      customerId: app.globalData.customerId,
      corpId: that.data.corpId,
      orderId: that.data.orderId,
      type: that.data.type
    }, res => {
      that.setData({
        orderDetail: res.data.data
      })
    })
  },


  /**
   * 本地下载
   * packType 1:全部 2:企业三证 3:质检报告
   * type 1:订单明细下载 2:糖企汇总明细下载
   * 
   */
  packDownload() {

  },

  //下载弹窗
  downbtn(e) {
    let that = this;
    let packType = e.currentTarget.dataset.packtype;

    // let url = e.currentTarget.dataset.url; 
    let url = app.globalData.https + '&customerId=' + app.globalData.customerId + '&corpId=' + that.data.corpId + '&orderId=' + that.data.orderId + '&type=' + that.data.type + '&packType=' + packType
    that.setData({
      url: url,
      mask: true,

    })
  },

  //关闭弹窗
  closemask() {
    let that = this;
    that.setData({
      mask: false
    })
  },

  //复制到粘贴板
  copy() {
    let that = this;
    let url = that.data.url;
    wx.setClipboardData({
      data: url,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  //预览图片
  previewImage(e) {
    let url = e.currentTarget.dataset.url;

    wx.previewImage({
      urls: Array.of(url) // 需要预览的图片http链接列表
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
  },



})