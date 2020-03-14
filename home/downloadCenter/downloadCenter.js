// home/downloadCenter/downloadCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkend:false,
    mask:false,

    items:[{
      'number':'20191216-01-0101',
      'dengji':'一级',
      'checkend':true
    },{
        'number':'20191216-01-0102',
      'dengji':'二级',
      'checkend':false
    }]
  },


  checkenda() {
    let that = this;
    let checkend = that.data.checkend
    if (checkend == false) {
      checkend = true
    } else {
      checkend = false
    }

    that.setData({
      checkend: checkend
    })
  },

  checkend(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let items = that.data.items;

    // debugger
    if (items[index].checkend == false) {
      items[index].checkend = true
    }else {
      items[index].checkend = false
    }

    that.setData({
      items:items
    })
  },


  //打开遮罩层
  maskbtn() {
    let that = this;
    let mask = that.data.mask;

    if (mask) {
      that.setData({
        mask:false
      })
    }else {
      that.setData({
        mask:true
      })
    }
  },

  //关闭遮罩层
  colsemask() {
    let that = this;
    that.setData({
      mask:false
    })
  },

  //下载列表
  downloadList() {
    wx.navigateTo({
      url: '../../home/downloadList/downloadList',
    })
  }

})