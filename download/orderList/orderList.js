// download/orderList/orderList.js
const app = getApp()
const api = require("../../utils/api.js")
const common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: '10',
    orderList: ''
  },

  onShow() {
    let that = this;
    that.dowlist()
  },
  //已下载糖企列表
  dowlist() {
    let that = this;
    common.requestGet(api.dowlist, {
      customerId: app.globalData.customerId,
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
    }, res => {
      if (that.data.orderList == '') {
        that.setData({
          orderList: res.data.data.orderList
        })
      } else {
        console.log(that.data.pageNo)
        console.log(res.data.totalPage)
        if (that.data.pageNo <= res.data.totalPage) {
          let orderList = that.data.orderList;
          that.setData({
            orderList: orderList.concat(res.data.data.orderList)
          })
        } else {
          common.showToast('没有更多数据了', 'none', res => {})
        }
        wx.hideLoading()
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    that.setData({
      pageNo: that.data.pageNo + 1
    })
    common.showLoading()
    that.dowlist()
  },

  btn(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let orderList = that.data.orderList;
    if (orderList[index].payStatus==1) {
      wx.navigateTo({
        url: '../../home/downloadDetail/downloadDetail?orderId=' + orderList[index].orderId + '&type=' + 1,
      })
    } else if (orderList[index].payStatus == 0){
      that.ispay()
    }
  },
  ispay() {

    //拉起微信支付
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: 'MD5',
      paySign: '',
      success(res) { },
      fail(res) { }
    })
  }


})