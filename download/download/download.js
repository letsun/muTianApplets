// download/download/download.js

const app = getApp()
const api = require("../../utils/api.js")
const common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: '0',
    pageSize: '10'
  },

  onShow() {
    let that = this;
    that.dowlist()
  },



  //下载页信息
  dowlist() {
    let that = this;
    common.requestGet(api.dowlist, {
      customerId: app.globalData.customerId,
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
    }, res => {
      that.setData({
        dowlist: res.data.data
      })
    })
  },

  home() {
    wx.reLaunch({
      url: '../../home/home/home',
    })
  },

  download() {
    wx.reLaunch({
      url: '../../download/download/download',
    })
  },

  //退出登录
  loginOut() {
    common.showModal('提示', '是否退出登录？', confirm => {
      common.requestPost(api.loginOut, {
        openId: app.globalData.openid
      }, res => {
        app.globalData.customerId = ''
        wx.reLaunch({
          url: '../../login/login?types=' + 0,
        })
      })
    }, cancel => { })

  },

  // 订单列表
  orderList() {
    wx.navigateTo({
      url: '../../download/orderList/orderList',
    })
  },

  // 会员升级
  member() {
    wx.navigateTo({
      url: '../../download/member/member',
    })
  },

  downloadList() {
    wx.navigateTo({
      url: '../../download/downloadList/downloadList',
    })
  },


  //扫码
  scanCode() {
    var that = this;
    wx.scanCode({
      // onlyFromCamera: true,
      success(res) {
        if (res.result != 'undefined') {
          var urlList = res.result.split('/');
          var code = urlList[urlList.length - 1];
          wx.reLaunch({
            url: '../../home/productDetail/productDetail?types=' + 2 + '&code=' + code,
          })
        }
      }
    })
  },

  btn(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let orderList = that.data.dowlist.orderList;

    if (orderList[index].payStatus == 1) {
      wx.navigateTo({
        url: '../../home/downloadDetail/downloadDetail?orderId=' + orderList[index].orderId + '&type=' + 1,
      })
    } else if (orderList[index].payStatus == 0) {

      let orderNo = orderList[index].orderNo;
      that.unifiedorder(orderNo)

    }
  },


  //取消订单
  cancel(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let orderList = that.data.dowlist.orderList;

    common.showModal('提示','是否取消订单',confirm=>{
      wx.request({
        method: "POST",
        url: api.cancel,
  
        data: {
          orderId:orderList[index].orderId,
          customerId:app.globalData.customerId
        },
  
        success: res => {
          if (res.data.status  ==1) {
            let dowlist = that.data.dowlist
            dowlist.orderList[index].payStatus= 2;
            dowlist.orderList[index].payStatusLabel = '已取消';
            that.setData({
              dowlist:dowlist
            })
          }
        },
      })
    },cancel=>{})

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

  isPlay() {
    let that = this;
    let unifiedorder = that.data.unifiedorder;
    //拉起微信支付
    wx.requestPayment({
      timeStamp: unifiedorder.timeStamp,
      nonceStr: unifiedorder.nonceStr,
      package: 'prepay_id=' + unifiedorder.prepayId,
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



  //跳转到下载详情
  btnNav(e) {
    let that = this;
    let corpId = e.currentTarget.dataset.corpid
    wx.navigateTo({
      url: '../../home/downloadDetail/downloadDetail?corpId=' + corpId + '&type=' + 2,
    })
  },
})