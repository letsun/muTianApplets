// home/downloadList/downloadList.js
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
    that.query()
  },

  //查询购物车
  query() {
    let that = this;
    common.requestGet(api.query, {
      customerId: app.globalData.customerId,
    }, res => {
      that.setData({
        cartList: res.data.data.cartList,
        totalPrice: res.data.data.totalPrice,
      })
    })
  },


  //删除购物车
  deletes(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let cartId = e.currentTarget.dataset.cartid;
    let cartList = that.data.cartList;
    common.requestPosts(api.deletes, {
      customerId: app.globalData.customerId,
      cartId: cartId,
    }, res => {
      cartList.splice(index,1)
      that.setData({
        cartCount: res.data.data.cartCount,
        totalPrice: res.data.data.totalPrice,
        cartList: cartList
      })
    })
  },


  //提交订单
  addOrder(){
    let that = this;
    let cartList = that.data.cartList;
    let cartIdList= []
    for (let i in cartList) {
      cartIdList.push(cartList[i].cartId)
    }
    cartIdList.join(',')

    wx.request({
      method: 'POST',
      url: api.addOrder,
      data: {
        customerId: app.globalData.customerId,
        cartIdList: cartIdList,
      },
      header: {
        'Accept': 'application/json',
        "content-type": "application/json"
      },
      success: function(res) {
        if(res.data.status == 1) {
          if (res.data.data.payStatus == 0) {
            that.unifiedorder(res.data.data.orderNo)
          } else if (res.data.data.payStatus == 1) {
            wx.reLaunch({
              url: '../../home/downloadDetail/downloadDetail?orderId=' + res.data.data.orderId + '&type='+1,
            })
          }
        }else {
          common.showToast(res.data.msg, 'none', res => { })
        } 
      },

    })
  },

  //微信支付
  unifiedorder(orderNo) {
    common.requestPost(api.unifiedorder, {
      customerId: app.globalData.customerId,
      openid: app.globalData.openid,
      orderNo: orderNo,
      type: 2
    }, res => {
      that.setData({
        unifiedorder: res.data.data
      })
      that.isPlay()
    })
  },

  //拉起微信支付
  isPlay() {
    let that = this;
    let unifiedorder = that.data.unifiedorder;
    wx.requestPayment({
      timeStamp: unifiedorder.timeStamp,
      nonceStr: unifiedorder.nonceStr,
      package: unifiedorder.prepayId,
      signType: unifiedorder.signType,
      paySign: unifiedorder.paySign,
      success(reg) {
        common.showToast('支付成功', 'success', red => {
          that.completPayment(1)
        })
      },
      fail(reg) {
        that.completPayment(0)
      }
    })
  },

  //完成支付
  completPayment(status) {
    let that = this;
    let unifiedorder = that.data.unifiedorder;
    common.requestPost(api.unifiedorder, {
      paymentId: unifiedorder.paymentId,
      status: status
    }, res => {
      wx.reLaunch({
        url: '../../home/downloadDetail/downloadDetail?orderId=' + res.data.data.orderId + '&type=' + 1,
      })
    })
  },

})