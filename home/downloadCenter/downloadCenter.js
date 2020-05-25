// home/downloadCenter/downloadCenter.js
const app = getApp()
const api = require("../../utils/api.js")
const common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkend: false,
    mask: false,
    corporationId: "",
    //corporationId: "60",
    batchNo: '', //批次号
    pageNo: 1,
    pageSize: 15,
    downloadCenterList: '',

  },

  onLoad(options) {
    let that = this;
    that.setData({
      corporationId: options.corporationId
    })
  },

  onShow() {
    let that = this;
    that.downloadCenterList(0); //质检列表
    that.query(); //查询购物车
    that.banner();

    that.setData({
      autoplay: true
    })
  },

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


  //输入批次号
  batchNo(e) {
    let that = this;
    let batchNo = e.detail.value;
    console.log(batchNo)
    that.setData({
      batchNo: batchNo,
      pageNo:1
    })

    that.downloadCenterList(1);

  },

  onReachBottom() {
    let that = this;
    let downloadCenterList = that.data.downloadCenterList;

    that.setData({
      pageNo: that.data.pageNo + 1
    })

    common.showLoading()
    that.downloadCenterList(0)
  },

  //下载中心列表
  downloadCenterList(types) {
    let that = this;
    let corporationId = that.data.corporationId;
    let batchNo = that.data.batchNo;
    //2018082004
    common.requestGet(api.downloadCenterList, {
      customerId: app.globalData.customerId,
      corporationId: corporationId,
      batchNo: batchNo,
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize
    }, res => {
      if (types==1) {
        let downloadCenterList = res.data.data;
        that.setData({
          downloadCenterList: downloadCenterList,
          totalPage: res.data.totalPage
        })
      }else {
        if (that.data.downloadCenterList == '') {
          let downloadCenterList = res.data.data;
          that.setData({
            downloadCenterList: downloadCenterList,
            totalPage: res.data.totalPage
          })
        } else {

          if (that.data.pageNo <= that.data.totalPage) {
            let downloadCenterList = that.data.downloadCenterList
            downloadCenterList.batchList = downloadCenterList.batchList.concat(res.data.data.batchList);
            that.setData({
              downloadCenterList: downloadCenterList,
              totalPage: res.data.totalPage
            })

          } else {
            common.showToast('没有更多数据了', 'none', res => { })
          }
          wx.hideLoading()
        }
      }



    })
  },


  //企业三证信息点击
  checkenda() {
    let that = this;
    let downloadCenterList = that.data.downloadCenterList
    if (downloadCenterList.buyStatus == 0) {
      downloadCenterList.buyStatus = 2;
      that.setData({
        downloadCenterList: downloadCenterList
      })
      that.addOrDelete(1, '')
    } else if (downloadCenterList.buyStatus == 2) {
      downloadCenterList.buyStatus = 0;
      that.setData({
        downloadCenterList: downloadCenterList
      })
      that.addOrDelete(1, '')
    }

  },


  //质检下载点击
  checkend(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let downloadCenterList = that.data.downloadCenterList;
    let produceBatchId = downloadCenterList.batchList[index].produceBatchId;

    if (downloadCenterList.batchList[index].buyStatus == 0) {
      downloadCenterList.batchList[index].buyStatus = 2;
      that.setData({
        downloadCenterList: downloadCenterList
      })
  
      that.addOrDelete(2, produceBatchId)
    } else if (downloadCenterList.batchList[index].buyStatus == 2) {
      downloadCenterList.batchList[index].buyStatus = 0;
      that.setData({
        downloadCenterList: downloadCenterList
      })
  
      that.addOrDelete(2, produceBatchId)
    }

  },

  //添加购物车
  addOrDelete(type, produceBatchId) {
    let that = this;
    common.requestPost(api.addOrDelete, {
      corporationId: that.data.corporationId,
      customerId: app.globalData.customerId,
      produceBatchId: produceBatchId,
      type: type,
    }, res => {
      that.setData({
        cartCount: res.data.data.cartCount,
        totalPrice: res.data.data.totalPrice,
      })
    })
  },

  //查询购物车
  query() {
    let that = this;
    common.requestGet(api.query, {
      customerId: app.globalData.customerId,
    }, res => {
      that.setData({
        cartList: res.data.data.cartList,
        cartCount: res.data.data.cartCount,
        totalPrice: res.data.data.totalPrice,
      })
    })
  },


  //删除购物车
  deletes(e) {
    let that = this;
    let index = e.currentTarget.dataset.index
    let cartId = e.currentTarget.dataset.cartid;
    let cartList = that.data.cartList;
    common.requestPosts(api.deletes, {
      customerId: app.globalData.customerId,
      cartId: cartId,
    }, res => {

      //动态刷新页面
      let downloadCenterList = that.data.downloadCenterList;
      for (let i in downloadCenterList.batchList) {
        //刷新质检
        if (downloadCenterList.batchList[i].produceBatchId == cartList[index].produceBatchId) {
          downloadCenterList.batchList[i].buyStatus = 0
        }

        //刷新三证
        if (downloadCenterList.corpId == cartList[index].corporationId) {
          downloadCenterList.buyStatus = 0
        }

      }

      //动态刷新购物车
      cartList.splice(index, 1)
      if (cartList == '') {
        that.setData({
          mask: false
        })
      }
      that.setData({
        cartCount: res.data.data.cartCount,
        totalPrice: res.data.data.totalPrice,
        cartList: cartList,
        downloadCenterList: downloadCenterList,
      })

    })
  },

  //清空购物车
  deleteAll(e) {
    let that = this;
    common.requestPost(api.deleteAll, {
      customerId: app.globalData.customerId,
    }, res => {
      let cartList = that.data.cartList;
      let downloadCenterList = that.data.downloadCenterList;
      for (let i in downloadCenterList.batchList) {
        //动态刷新页面
        if (downloadCenterList.batchList[i].buyStatus != 1) {
          downloadCenterList.batchList[i].buyStatus = 0
        }
      }

      for (let i in cartList) {
        //刷新三证
        if (downloadCenterList.corpId == cartList[i].corporationId) {
          downloadCenterList.buyStatus = 0
        }
      }


      that.setData({
        totalPrice: 0,
        cartCount: 0,
        mask: false,
        downloadCenterList: downloadCenterList
      })
    })
  },


  //打开遮罩层
  maskbtn() {
    let that = this;
    let mask = that.data.mask;
    let cartCount = that.data.cartCount;
    if (cartCount != 0) {
      if (mask) {
        that.setData({
          mask: false
        })
      } else {
        that.setData({
          mask: true
        })
        that.query()
      }
    }

  },

  //关闭遮罩层
  colsemask() {
    let that = this;
    that.setData({
      mask: false
    })
  },


  //去下载
  downloadList() {
    let that = this;

    let cartCount = that.data.cartCount;
    if (cartCount > 0) {
      wx.navigateTo({
        url: '../../home/downloadList/downloadList',
      })
    }
  },

  onHide() {
    let that = this;
    let downloadCenterList = that.data.downloadCenterList

    that.setData({
      autoplay: false,
      pageNo:1,
      downloadCenterList:''
    })
  }

})