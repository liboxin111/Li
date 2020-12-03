// pages/goods_list/goods_list.js
import request  from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格 ",
        isActive: false
      }
    ],
    goodsList:[]
  },
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  toolPages:1,
  handletabsItemChange(e){
    // console.log(e);
    const {index}=e.detail
    // console.log(index);
    let {tabs}=this.data;
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.QueryParams.cid=options.cid;
    // this.QueryParams.query=options.query;
    this.getGoodsList()
  },
  //下拉刷新   需要在JSON文件中配置
  onPullDownRefresh(){
    console.log(2);
    //重置数组 
    this.setData({
      goodsList:[]
    })
    //重置页码
    this.QueryParams.pagenum=1
    //重新发送请求
    this.getGoodsList()
    //数据请求回来关闭请求效果
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },
  //上拉加载
  onReachBottom(){
    /判断有没有下一页/
    if(this.QueryParams.pagenum>this.toolPages){
      //没有下一页数据  显示一会就消失
      wx.showToast({
        title: '没有下一页数据',
      })
    }else{
      //还有数据
      console.log("有下一页数据");
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },
  async getGoodsList(){
    const res=await request({url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/search",data:this.QueryParams});
    // 获取 总条数
    const total=res.total;
    // 计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      // 拼接了数组
      goodsList:  
      //数组拼接    
         [...this.data.goodsList,...res.goods]
  })}
})