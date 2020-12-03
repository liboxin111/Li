// pages/goos_detail/goos_detail.js\
//请求数据

import request from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

      /**
       * 页面的初始数据
       */
      data: {
        goodsObj: {}
      },
      //商品对象
      GoodsInfo: {},

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
        const {
          goods_id
        } = options
        console.log(goods_id);
        this.getGoodsDetail(goods_id)

      },
      async getGoodsDetail(goods_id) {
        const goodsObj = await request({
          url: "https://api-hmugo-web.itheima.net/api/public/v1/goods/detail",
          data: {
            goods_id
          }
        })
        this.GoodsInfo = goodsObj
        this.setData({
          goodsObj: {
            goods_name: goodsObj.goods_name,
            goods_price: goodsObj.goods_price,
            //iphone 不识别webp图片格式    临时解决方式 .replace(/\.webp/g,".jpg")
            goods_introduce: goodsObj.goods_introduce,
            pics: goodsObj.pics,
          }
        })
      },
      //点击轮播图 预览大图   绑定点击事件   调用API  previewImage
      handlePreviewImage(e) {
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
        //接受点击图片的url
        const current = e.currentTarget.dataset.url
        wx.previewImage({
          urls: urls,
          current: current
        })
      },
      //加入购物车
      //绑定点击事件             弹出提示
      handkeCartdd() {
        // console.log("加入购物车");
        //获取缓存中的数据(数组)
        let cart = wx.getStorageSync('cart') || []
        //判断是否存在购物车内
        let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
        if(index===-1){
          //不存在
          this.GoodsInfo.num=1
          this.GoodsInfo.checked=true
          cart.push(this.GoodsInfo)
         }else{
           //存在
           cart[index].num++
         }
         // 重新添加到缓存中
         wx.setStorageSync('cart', cart)
         wx.showToast({
           title: '成功加入购物车',
           icon:'success',
           mask:true
         })
  }
})