// pages/category/category.js

const request= require("../../request/index")
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [],
    rightContent: [],
    //左侧点击菜单
    currentIndex: 0,
    scrollTop: 0
  },
  Cates: [],

  async getCatse() {
    const res = await request({ url: 'https://api-hmugo-web.itheima.net/api/public/v1/categories' })
    this.Cates = res
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
    let leftMenuList = this.Cates.map(v => v.cat_name)
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
    // request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/categories'
    // }).then(result => {
    //   this.Cates = result.data.message
    //   //把数据存到本地
    //   //web 和小程序的区别 
    //   // 1web:localStorage.setItem("key","value") localStorage.getItem("key)
    //   //小程序 wx.setStorageSync('key', Object/String) wx.getStorageSync('key')
    //   // 2存的时候有没有做类型转换  WEB  先把数据变成字符串再存  小程序不存在类型转换 存进去啥样拿出来啥样
    //   wx.setStorageSync('cates',{time:Date.now(),data:this.Cates})
    //   let leftMenuList = this.Cates.map(v => v.cat_name)
    //   let rightContent = this.Cates[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })
  },
  handleItemTap(e) {
    console.log(e);
    //点击后 获取点击标题的下标  显示激活样式   根据下标右边显示对应内容
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }
  ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判读本地存储是否有旧指 
    //  没有就发送新的请求  
    // 有也没过期 就是用本地数据
    //获取本地存储的数据
    const Cates = wx.getStorageSync('cates')
    if (!Cates) {
      //不存在  获取数据
      this.getCatse()
    } else {
      //有旧的数据 判断是否过期
      if (Date.now() - Cates.time > 1000 * 60 * 60 * 24) {
        //重新发送请求
        this.getCatse()
      } else {
        //可以使用
        this.Cates = Cates.data
        let leftMenuList = this.Cates.map(v => v.cat_name)
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
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