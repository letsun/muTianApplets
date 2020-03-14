// download/member/member.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexa:'0',
    datas: [{
      member: '包月会员',
      money: '80.00'
    }, {
      member: '包季会员',
      money: '400.00'
    }, {
      member: '包年会员',
      money: '700.00'
    }]
  },

  memberBtn (e) {
    let that= this;
    let index = e.currentTarget.dataset.index;
    
    that.setData({
      indexa:index
    })
  }


})