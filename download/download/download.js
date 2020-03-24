// download/download/download.js

const app = getApp()
const api = require("../../utils/api.js")
const common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo:'0',
    pageSize:'10'
  },

  onShow(){
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
          dowlist:res.data.data
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
    common.showModal('提示','是否退出登录',confirm=>{
      common.requestPost(api.loginOut, {
        openId: app.globalData.openid
      }, res => {
        wx.reLaunch({
          url: '../../login/login',
        })
      })
    },cancel=>{})

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
  scanCode(){
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if (res.result != 'undefined') {
          var urlList = res.result.split('/');
          var code = urlList[urlList.length - 1];
          that.setData({
            code: code,
          });

          console.log(code);
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