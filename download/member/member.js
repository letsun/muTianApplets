// download/member/member.js
const app = getApp()
const api = require("../../utils/api.js")
const common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexa:'0',
    datas: [{
      member: '',
      money: ''
    }, {
      member: '',
      money: '400.00'
    }, {
      member: '',
      money: ''
    }]
  },

  memberBtn (e) {
    let that= this;
    let index = e.currentTarget.dataset.index;
    
    that.setData({
      indexa:index
    })
  },


  onShow() {
    let that = this
    that.customerDetail()
  },

  //客户信息查询
  customerDetail() {
    let that = this;
    common.requestGet(api.customerDetail, {
      customerId: app.globalData.customerId,
      openid: app.globalData.openid
    }, res => {
      let customerDetail = res.data.data;
      let datas = that.data.datas;


      if (customerDetail.levelType==1) {
       
        datas[0].money = res.data.data.monthPrice;
        datas[0].member = '包月会员'
        datas[1].money = res.data.data.quarterPrice;
        datas[1].member = '包季会员'
        datas[2].money = res.data.data.yearPrice;
        datas[2].member = '包年会员' 
      } else if (customerDetail.levelType == 2) {
        datas.splice(0, 1)
        datas[0].money = res.data.data.quarterPrice;
        datas[0].member = '包季会员'
        datas[1].money = res.data.data.yearPrice; 
        datas[1].member = '包年会员' 
      } else if (customerDetail.levelType == 3){
        datas.splice(0, 2)
        datas[0].money = res.data.data.yearPrice; 
        datas[0].member = '包年会员' 
      }else {
        datas = '';
      }

      that.setData({
        customerDetail: customerDetail,
        datas:datas,
      })
    })
  },

  //返回下载首页
  download() {
    wx.reLaunch({
      url:'../download/download/download'
    })
  }
})