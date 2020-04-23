// home/downloadDetail/downloadDetail.js
const app = getApp()
const api = require("../../utils/api.js")
const common = require("../../utils/common.js")

let showloading = title => {
  wx.showLoading({
    title: title,
    mask: true
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask: false,
    orderId: '',
    corpId: '',
    batchNo: '',
    // type: '1',
    // orderId: '90',
    downloadList: []
  },

  onLoad(options) {
    console.log(options, '20')
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

  //获取批次号
  batchNochang(e) {
    let that = this;
    console.log(e)
    that.setData({
      batchNo: e.detail.value
    })
    that.orderDetail();
  },


  //单选 0 为企业三证 1为批次
  radio(e) {
    // debugger
    let that = this;
    let index = e.currentTarget.dataset.index;
    let orderDetail = that.data.orderDetail;
    let type = e.currentTarget.dataset.type;
    let downloadList = that.data.downloadList;
    let downloadLista = [];
    let obj = {};

    if (type == 0) {
      if (!orderDetail.corpList[index].checked) {
        orderDetail.corpList[index].checked = true;
        obj.corpId = orderDetail.corpList[index].corpId;
        obj.batchId = '';
        obj.type = '1';
        downloadLista.push(obj)
        let concatlist = downloadList.concat(downloadLista);
        that.setData({
          downloadList: concatlist
        })
      } else {
        orderDetail.corpList[index].checked = false;

        for (let i in downloadList) {
          if (orderDetail.corpList[index].corpId == downloadList[i].corpId) {
            downloadList.splice(i, 1)
          }
        }

        that.setData({
          downloadList: downloadList
        })

      }
    } else {
      if (!orderDetail.checkList[index].checked) {

        orderDetail.checkList[index].checked = true;
        obj.corpId = '';
        obj.batchId = orderDetail.checkList[index].batchId;
        obj.type = '2';
        downloadLista.push(obj)
        let concatlist = downloadList.concat(downloadLista);

        that.setData({
          downloadList: concatlist
        })

      } else {
        orderDetail.checkList[index].checked = false;
        for (let i in downloadList) {
          if (orderDetail.checkList[index].batchId == downloadList[i].batchId) {
            downloadList.splice(i, 1)
          }
        }
        that.setData({
          downloadList: downloadList
        })

      }
    }

    that.setData({
      orderDetail: orderDetail,
    })

  },

  //全选
  selectall() {
    let that = this;
    let orderDetail = that.data.orderDetail;
    let downloadLista = [];
    let downloadListb = [];

    for (var i in orderDetail.corpList) {
      var obja = {};
      orderDetail.corpList[i].checked = true;
      obja.corpId =orderDetail.corpList[i].corpId ;
      obja.batchId = '';
      obja.type = '1';
      downloadLista.push(obja)
    }

    for (var i in orderDetail.checkList) {
      var objb = {};
      orderDetail.checkList[i].checked = true;
      objb.batchId = orderDetail.checkList[i].batchId;
      objb.corpId = '';
      objb.type = '2';
      downloadListb.push(objb)
    }

    let downloadList = downloadLista.concat(downloadListb)

    that.setData({
      orderDetail: orderDetail,
      downloadList: downloadList
    })
  },

  //反选
  counter() {
    let that = this;
    let orderDetail = that.data.orderDetail;
    let downloadList = [];
    let downloadLista =[];
    let downloadListb =[];

    // debugger
    for (let i in orderDetail.corpList) {
      if (!orderDetail.corpList[i].checked) {
        orderDetail.corpList[i].checked = true;
      } else {
        orderDetail.corpList[i].checked = false;
      }
    }

    for (let i in orderDetail.checkList) {
      if (!orderDetail.checkList[i].checked) {
        orderDetail.checkList[i].checked = true;
      } else {
        orderDetail.checkList[i].checked = false;
      }
    }

    
 
    for (let i in orderDetail.corpList) {
      if (orderDetail.corpList[i].checked) {
        let obj = {};
        obj.corpId =orderDetail.corpList[i].corpId ;
        obj.batchId = '';
        obj.type = '1';
        downloadLista.push(obj)
      }
    }


    for (let i in orderDetail.checkList) {
      if (orderDetail.checkList[i].checked) {
        let obj = {};
        obj.corpId ='' ;
        obj.batchId = orderDetail.checkList[i].batchId;
        obj.type = '2';
        downloadListb.push(obj)
      }
    }

    downloadList = downloadLista.concat(downloadListb)
    that.setData({
      orderDetail: orderDetail,
      downloadList:downloadList
    })
  },

  //订单下载详情(单/汇总)
  orderDetail() {
    let that = this;
    common.requestPost(api.orderDetail, {
      batchNo: that.data.batchNo,
      customerId: app.globalData.customerId,
      corpId: that.data.corpId,
      orderId: that.data.orderId,
      type: that.data.type
    }, res => {
      var orderDetail = res.data.data;

      for (var i in orderDetail.checkList) {
        orderDetail.checkList[i].checked = false;
      }

      for (var i in orderDetail.corpList) {
        orderDetail.corpList[i].checked = false;
      }

      that.setData({
        orderDetail: orderDetail
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


  //下载企业三证
  savephonea(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let corpList = that.data.orderDetail.corpList;
    let imgurl = corpList[index].uploadImage;
    that.downloadImgs(imgurl)

  },

  //下载图片
  downloadImgs(imgurl) {
    let that = this;
    showloading('下载中')
    that
      .queue(imgurl)
      .then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '下载完成'
        })
      })
      .catch(err => {

        wx.hideLoading()
      })
  },

  // 队列
  queue(urls) {
    let promise = Promise.resolve()
    urls.forEach((url, index) => {
      promise = promise.then(() => {
        return this.saveimg(url)
      })
    })
    return promise
  },

  //下载保存
  saveimg(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: url,
        success: function (res) {
          var temp = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: temp,
            success: function (res) {
              resolve(res)
            },
            fail: function (err) {
              reject(res)
            }
          })
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  },

  //下载质检报告
  savephone(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let orderDetail = that.data.orderDetail
    let url = orderDetail.checkList[index].url;
    // debugger
    showloading('下载中')
    wx.downloadFile({
      url: url,
      success: res => {
        console.log(res.tempFilePath)

        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: res => {
            wx.hideLoading({})
            common.showToast('下载成功', 'success', reg => { })
          },

          fail: res => {

            common.showToast('下载失败', 'success', reg => { })
          }
        })
      }
    })

  },

  //下载弹窗
  downbtn(e) {
    let that = this;
    let downloadList = that.data.downloadList;

    if (downloadList!='') {
      that.getDownloadCode()
    }else {
      common.showToast('请勾选企业三证或批次信息下载','none',res=>{})
    }
    
  },


  //打包下载到电脑
  getDownloadCode() {
    let that = this;
    let downloadList = that.data.downloadList;
    wx.request({
      url: api.getDownloadCode,
      data: {
        customerId: app.globalData.customerId,
        downloadList : downloadList
      },
      header: {
        'Accept': 'application/json',
        'content-type': 'application/json'
      },
      method: 'POST',
   
      success: (res) => {
        if (res.data.status== 1 ) {
          that.setData({
            mask:true,
            code: res.data.data.code,
            url: api.ip + res.data.data.url,
          })
        }else {
          common.showToast(res.data.msg,'none',res=>{})
        }


      },
    })

    // common.requestPost(api.getDownloadCode, {
    //   customerId: app.globalData.customerId,
    //   downloadList : downloadList
    // }, res => {
    //   that.setData({
    //     url: api.ip + res.data.data.url,
    //     code: res.data.data.code,
    //     mask: true,
    //   })
    // })
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
    console.log(url)
    if (url != '') {
      wx.previewImage({
        urls: Array.of(url), // 需要预览的图片http链接列表
        current: Array.of(url)
      })
    } else {
      common.showToast('您查看的质检报告为空', 'none', res => { })
    }

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