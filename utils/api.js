//var dev = 'http://192.168.1.68:8080/mtkj-mobile';
var dev = 'http://192.168.1.11:8899/mtkj-mobile';//本地
var test = 'https://mut.lxcyhd.com';//测试
var ip = test;

var api = {
  ip:ip, //下载地址
  getCheckOpenidByCode: ip + '/wechat/getCheckOpenidByCode', //获取openId
  login: ip + '/api/customer/login', //登陆
  loginOut: ip + '/api/customer/loginOut',//注销登陆
  getValidCode: ip + '/api/customer/getValidCode', //获取验证码
  addOrLogin: ip + '/api/customer/addOrLogin', //手机号&验证码注册登陆
  banner: ip + '/api/banner/list',//Banner轮播图
  joinCorporation: ip + '/api/base/joinCorporation',//合作糖厂
  queryGroupOrBrand: ip + '/api/base/queryGroupOrBrand',//查询所有集团/品牌
  queryGroupCorporation: ip + '/api/base/queryGroupCorporation', //根据集团查询糖企
  queryBrandCorporation: ip + '/api/base/queryBrandCorporation',//根据品牌查询糖企信息
  homePageQuery: ip + '/api/base/homePageQuery', //首页查询按键查询产检信息
  produceBatch: ip + '/api/check/produceBatch/', //产检二维码查询产检信息
  downloadCenterList: ip + '/api/base/downloadCenterList', //下载中心列表
  addOrDelete: ip + '/api/cart/addOrDelete',   //添加购物车
  query: ip + '/api/cart/query',   //查询购物车清单
  deletes: ip + '/api/cart/delete',   //删除购物车
  deleteAll: ip + '/api/cart/deleteAll',   //清空购物车
  addOrder: ip + '/api/order/add', //新增订单接口
  orderDetail: ip + '/api/order/detail', //订单下载详情(单/汇总)
  packDownload: ip + '/api/order/packDownload', //打包下载全部
  customerDetail: ip + '/api/customer/customerDetail',//客户信息查询
  dowlist: ip + '/api/order/list', //历史下载(订单)记录列表
  sortHistoryCorp: ip + '/api/order/sortHistoryCorp',//已下载糖企列表
  levelUp: ip + '/api/customer/levelUp',//购买会员
  unifiedorder: ip + '/api/wechat/payment/unifiedorder',//支付
  completPayment: ip + '/api/wechat/payment/completPayment',//完成支付回调
  getDownloadCode: ip + '/api/order/getDownloadCode',//获取下载链接验证码
}


module.exports = api;
// module.exports = ip;