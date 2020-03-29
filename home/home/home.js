// home/home/home.js
const app = getApp()
const api = require("../../utils/api.js")
const common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    texts: ['集团', '品牌'],
    indexa: 0, //切换集团品牌下标
    autoplay: true,
    index: 0, //选择集团默认下标
    indexx: 0 //选择糖企默认下标
  },
  onLoad(options) {
    let that = this;


    if (that.data.indexa == 0) {
      that.queryGroupOrBrand(1)
    } else {
      that.queryGroupOrBrand(2)
    }

    
  },
  onShow() {
    let that = this;
    that.setData({
      autoplay: true
    })

    that.banner();
    that.joinCorporation()
  },

  //Banner轮播图
  banner() {
    let that = this;
    common.requestGet(api.banner, {
      corpId: "0"
    }, res => {
      that.setData({
        banner: res.data.data.list
      })
    })
  },
  //合作糖厂
  joinCorporation() {
    let that = this;
    common.requestGet(api.joinCorporation, {}, res => {
      let joinCorporation = res.data.data.batchList
      that.setData({
        joinCorporation: joinCorporation
      })
    })
  },
  /***
   * 查询所有集团/品牌
   *queryType 1:集团 2:品牌 查询品牌时返回糖企信息
   */

  queryGroupOrBrand(queryType) {
    let that = this;
    common.requestGet(api.queryGroupOrBrand, {
      queryType: queryType
    }, res => {
      if (queryType == 1) {
        let groupList = res.data.data.resultList;
        that.setData({
          groupList: groupList,
          queryType: 1
        })
        that.queryGroupCorporation(groupList[0].groupCompanyId)
      } else {
        let groupList = res.data.data.resultList;
        that.setData({
          groupList: groupList,
          queryType: 2
        })
        that.queryBrandCorporation(groupList[0].brandName)
      }
    })
  },

  /***
   * 根据集团查询糖企
   * groupCompanyId
   */
  queryGroupCorporation(groupCompanyId) {
    let that = this;

    common.requestGet(api.queryGroupCorporation, {
      groupCompanyId: groupCompanyId
    }, res => {
      // debugger
      let brandList = res.data.data.corporationList;

      let corporationId = brandList[0].corporationId;

      that.setData({
        indexx: 0,
        brandList: brandList,
        corporationId: corporationId,
      })
    })
  },
  /*
   * 根据品牌查询糖企信息
   * groupCompanyId
   */
  queryBrandCorporation(brandName) {
    let that = this;
    let indexx = that.data.indexx;

    common.requestGet(api.queryBrandCorporation, {
      brandName: brandName
    }, res => {
      let brandList = res.data.data.list;
      if (brandList != '') {
        let corporationId = brandList[indexx].corporationId;
        that.setData({
          corporationId: corporationId
        })
      } else {
        that.setData({
          corporationId: ''
        })
      }

      that.setData({
        brandList: brandList,
      })
    })
  },

  //选择集团
  bindgroupList(e) {
    let that = this;
    let index = e.detail.value;
    let groupList = that.data.groupList;

    that.setData({
      index: index
    })
    if (that.data.indexa == 0) {

      let groupCompanyId = groupList[index].groupCompanyId
      that.queryGroupCorporation(groupCompanyId)
    } else {

      let brandName = groupList[index].brandName;
      that.queryBrandCorporation(brandName)
    }

  },

  //选择塘企
  bindbrand(e) {
    let that = this;
    let index = e.detail.value;
    let brandList = that.data.brandList;
    that.setData({
      indexx: index,
      corporationId: brandList[index].corporationId
    })
  },

  //切换集团品牌
  doc(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      indexa: index,
      index: 0,
      indexx: 0,
    })

    if (that.data.indexa == 0) {
      that.queryGroupOrBrand(1)
    } else {
      that.queryGroupOrBrand(2)
    }
  },

  //获取批次号
  batchNo(e) {
    let that = this;
    that.setData({
      batchNo: e.detail.value
    })
  },

  //首页
  home() {
    wx.reLaunch({
      url: '../../home/home/home',
    })
  },

  //下载首页
  download() {
    wx.reLaunch({
      url: '../../download/download/download',
    })
  },

  //查询企业产品信息
  productDetail() {
    let that = this;
    let batchNo = that.data.batchNo;
    let corporationId = that.data.corporationId;
    if (batchNo == undefined) {
      batchNo = ''
    }

    wx.navigateTo({
      url: '../../home/productDetail/productDetail?batchNo=' + batchNo + '&corporationId=' + corporationId + '&types=' + 1,
    })
  },

  //点击合作糖厂查询企业信息
  productDetaila(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let joinCorporation = that.data.joinCorporation;
    let corporationId = joinCorporation[index].corporationId;
    wx.navigateTo({
      url: '../../home/productDetail/productDetail?batchNo=' + '' + '&corporationId=' + corporationId + '&types=' + 1,
    })
  },

  //更多
  more() {
    wx.navigateTo({
      url: '../../home/more/more',
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

  onHide() {
    let that = this;
    that.setData({
      autoplay: false
    })
  }


})