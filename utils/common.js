const api = require("./api.js")

/***
 * 
 *模态框
 * content: 提示文字
 * confirm:点击确认的回调函数
 * cancel:点击取消的回调函数
 */

function showModal(title, content, confirm, cancel) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: true,
    confirmColor: '#ffa33b',
    success(res) {
      if (res.confirm) {
        confirm(confirm)
      } else if (res.cancel) {
        cancel(cancel)
      }
    },
  })
}



/***
 * 
 * 提示框
 * title: 提示文字
 * icon:提示图标
 * success:返回成功的回调函数
 */

function showToast(title, icon, success) {
  wx.showToast({
    title: title,
    icon: icon,
    duration: 2000,
    mask: true,
    success: function(res) {
      success(res)
    },
    fail: function(res) {},
  })
}

/***
 * 
 * 加载框
 * title: 提示文字
 * icon:提示图标
 * success:返回成功的回调函数
 */
function showLoading() {
  wx.showLoading({
    title: '加载中',
    mask: true,
    success: res => {

    },
    fail: res => {
      wx.hideLoading()
    }
  })
}




/***
 * 
 * post请求
 *url:请求地址 
 * data:请求数据
 * res:回调
 */

function requestPost(url, data, success) {
  wx.request({
    url: url,
    method: "POST",
    header: {
      'Accept': 'application/json',
      "content-type": "application/x-www-form-urlencoded",
    },

    data: data,
    success: res => {
      if (res.data.status == 1) {
        success(res)
      } else {
        showToast(res.data.msg, 'none',res=>{})
      }
    },

    fail: res => {
      showToast('网络异常，请重新刷新页面', 'none', res => { })
    },

    complete: res => {
      // wx.hideLoading();
    }

  })

}



/***
 * 带加载
 * post请求
 *url:请求地址 
 * data:请求数据
 * res:回调
 */

function requestPosts(url, data, success) {
  showLoading();
  wx.request({
    url: url,
    method: "POST",
    header: {
      // 'Content-Type': 'application/json',
      'Accept': 'application/json',
      'content-type': "application/x-www-form-urlencoded",
    },

    data: data,
    success: res => {

      if (res.data.status == 1) {
        success(res)
        wx.hideLoading()
      } else {
        wx.hideLoading()
        showToast(res.data.msg, 'none', res => { })
      }
    },

    fail: res => {
      wx.hideLoading();
      showToast('网络异常，请重新刷新页面', 'none', res => { })
    },

    complete: res => {
      // wx.hideLoading();
    }

  })

}


/***
 * 带加载
 * post请求
 *url:请求地址 
 * data:请求数据
 * res:回调
 * fali:失败回调
 */

function requestPostf(url, data, success,fail) {

  wx.request({
    url: url,
    method: "POST",
    header: {
      // 'Content-Type': 'application/json',
      'Accept': 'application/json',
      'content-type': "application/x-www-form-urlencoded",
    },

    data: data,
    success: res => {

      if (res.data.status == 1) {
        success(res)
        wx.hideLoading()
      } else {
        fail(res)
        wx.hideLoading()
       
      }
    },

    fail: res => {
      wx.hideLoading();
      showToast('网络异常，请重新刷新页面', 'none', res => { })
    },

    complete: res => {
      // wx.hideLoading();
    }

  })

}





/***
 * 
 * GET请求
 * url:请求地址
 * data:请求数据
 * res:回调
 */


function requestGet(url, data, success) {
  wx.request({
    url: url,
    method: "GET",
    header: {
      'Accept': 'application/json',
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },

    data: data,
    success: res => {
      if (res.data.status == 1) {
        success(res)
      } else {
        showToast(res.data.msg, 'none', res => { })
      }
    },

    fail: res => {
      showToast('网络异常，请重新刷新页面', 'none', res => { })
    },

    complete: res => { }
  })

}


/***
 * 带加载
 * GET请求
 * url:请求地址
 * data:请求数据
 * res:回调
 */


function requestGets(url, data, success) {
  showLoading();
  wx.request({
    url: url,
    method: "GET",
    header: {
      'Accept': 'application/json',
      "content-type": "application/x-www-form-urlencoded",
    },

    data: data,
    success: res => {
      if (res.data.status == 1) {
        success(res)
        wx.hideLoading()
      } else {
        wx.hideLoading()
        showToast(res.data.msg, 'none',res=>{})
      }
    },

    fail: res => {
      wx.hideLoading()
      showToast('网络异常，请重新刷新页面', 'none', res => { })
    },
    complete: res => {}
  })
}

/***
 * 
 * 获取openid
 * 
 */

function getopenid(callback) {
  wx.login({
    success: res => {
      requestPost(api.getCheckOpenidByCode,{
        code: res.code
      },res=>{
        callback(res)
      })
    }
  })
}





module.exports = {
  showModal: showModal,
  showToast: showToast,
  showLoading: showLoading,
  requestPost: requestPost,
  requestPosts: requestPosts,
  requestPostf:requestPostf,
  requestGet: requestGet,
  requestGets: requestGets,
  getopenid: getopenid,
}