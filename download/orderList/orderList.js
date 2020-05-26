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

  onLoad() {
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
      wx.showModal({

        title: '提示',
        confirmText: '支付购买',
        cancelText: '取消订单',
        content: '是否取消订单',
        showCancel: true,
        confirmColor: '#ffa33b',
        success(res) {
          if (res.confirm) {
            let orderNo = orderList[index].orderNo;
            that.unifiedorder(orderNo);
          } else if (res.cancel) {
            wx.request({
              method: "POST",
              url: api.cancel,
   
              data: {
                orderId:orderList[index].orderId,
                customerId:app.globalData.customerId
              },

              success: res => {
                if (res.data.status  ==1) {
                  orderList[index].payStatus= 2;
                  orderList[index].payStatusLabel = '已取消';
                  that.setData({
                    orderList:orderList
                  })
                }
              },
            })

          }
        }

      })

      // let orderNo = orderList[index].orderNo;
      // that.unifiedorder(orderNo);
    }
  },

  //微信支付
  unifiedorder(orderNo) {
    let that = this;
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
      package:'prepay_id='+ unifiedorder.prepayId,
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
    common.requestPost(api.completPayment, {
      paymentId: unifiedorder.paymentId,
      status: status
    }, res => {

    })
  },

})