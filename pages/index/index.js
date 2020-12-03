// pages/index/index.js
//引入发送请求的方法 路径要写全
const request = require("../../request/index")
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    //轮播图数组
    swiperList: [],
    cateList: [],
    floorList: []
  },
  getSwiperList() {
    request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    }).then(result => {
      this.setData({
        swiperList: result
      })
    })
  },
  getCateList() {
    request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/catitems',
    }).then(result => {
      this.setData({
        cateList: result
      })
    })
  },
  getFloorList() {
    request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/floordata',
    }).then(result => {
      this.setData({
        floorList: result
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //发送异步请求  获取数据   promise优化 解决回调地狱
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})