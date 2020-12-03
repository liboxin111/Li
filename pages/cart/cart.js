// pages/cart/cart.js
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
// import regeneratorRuntime from '../../lib/runtime/runtime';  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  //   2 页面加载完毕
  //   0 onLoad  onShow 
  //   1 获取本地存储中的地址数据
  //   2 把数据 设置给data中的一个变量
  // 3 onShow 
  //   0 回到了商品详情页面 第一次添加商品的时候 手动添加了属性
  //     1 num=1;
  //     2 checked=true;
  //   1 获取缓存中的购物车数组
  //   2 把购物车数据 填充到data中
  // 4 全选的实现 数据的展示
  //   1 onShow 获取缓存中的购物车数组
  //   2 根据购物车中的商品数据 所有的商品都被选中 checked=true  全选就被选中
  // 5 总价格和总数量
  //   1 都需要商品被选中 我们才拿它来计算
  //   2 获取购物车数组
  //   3 遍历
  //   4 判断商品是否被选中
  //   5 总价格 += 商品的单价 * 商品的数量
  //   5 总数量 +=商品的数量
  //   6 把计算后的价格和数量 设置回data中即可
  // 6 商品的选中
  //   1 绑定change事件
  //   2 获取到被修改的商品对象
  //   3 商品对象的选中状态 取反
  //   4 重新填充回data中和缓存中
  //   5 重新计算全选。总价格 总数量。。。
  // 7 全选和反选
  //   1 全选复选框绑定事件 change
  //   2 获取 data中的全选变量 allChecked
  //   3 直接取反 allChecked=!allChecked
  //   4 遍历购物车数组 让里面 商品 选中状态跟随  allChecked 改变而改变
  //   5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中 
  // 8 商品数量的编辑
  //   1 "+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性 
  //     1 “+” "+1"
  //     2 "-" "-1"
  //   2 传递被点击的商品id goods_id
  //   3 获取data中的购物车数组 来获取需要被修改的商品对象
  //   4 直接修改商品对象的数量 num
  //   5 把cart数组 重新设置回 缓存中 和data中 this.setCart
  // 9 点击结算
  //   1 判断有没有收货地址信息
  //   2 判断用户有没有选购商品
  //   3 经过以上的验证 跳转到 支付页面！ 
  //------------------------------------
  //  获取用户的收货地址
  // 1 绑定点击事件
  // 2 调用小程序内置 api  获取用户的收货地址  wx.chooseAddress

  // 2 获取 用户 对小程序 所授予 获取地址的  权限 状态 scope
  //   1 假设 用户 点击获取收货地址的提示框 确定  authSetting scope.address 
  //     scope 值 true 直接调用 获取收货地址
  //   2 假设 用户 从来没有调用过 收货地址的api 
  //     scope undefined 直接调用 获取收货地址
  //   3 假设 用户 点击获取收货地址的提示框 取消   
  //     scope 值 false 
  //     1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候 
  //     2 获取收货地址
  //   4 把获取到的收货地址 存入到 本地存储中 
  async handleChooseAddress() {
    try {
      // 1 获取 权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2 判断 权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      // 4 调用获取收货地址的 api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;

      // 5 存入到缓存中
      wx.setStorageSync("address", address);

    } catch (error) {
      console.log(error);
    }
  },
  handleItemChange(e){
    //获取被修改商品的id
    const goods_id=e.currentTarget.dataset.id
    // console.log(goods_id);
    //获取购物车数据
    let {cart}=this.data
    //找到被修改的对象
    let index=cart.findIndex(v=>v.goods_id===goods_id)
    //选中状态取反
    cart[index].checked=!cart[index].checked
    //把购物车数据重新加载到data和缓存中
   this.setCart(cart)
  },
  setCart(cart){
    //重新计算 全选 总价 总数量
    let allChecked=true
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
      }else{
        allChecked=false
      }
    })
    allChecked=cart.length!=0?allChecked:false
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked,
      
    })
    wx.setStorageSync('cart', cart)
  },
  //实现全选反选
  handleItemAllChecked(){
    let {cart,allChecked}=this.data
    allChecked=!allChecked
    cart.forEach(v=>v.checked=allChecked)
    this.setCart(cart)
  },
  //商品数量的编辑  + - 用一个点击事件 通过绑定的自定义属性值 来区分 传商品id   获取data中的购物车数组 根据id来获取商品对象   直接修改商品对象的数量  再返回缓存和data中 this.setCart
 async handleItemNumEdit(e){
  // 1 获取传递过来的参数 
  const { operation, id } = e.currentTarget.dataset;
  // 2 获取购物车数组
  let { cart } = this.data;
  // 3 找到需要修改的商品的索引
  const index = cart.findIndex(v => v.goods_id === id);
  // 4 判断是否要执行删除
  if (cart[index].num === 1 && operation === -1) {
   return
  } else {
    // 4  进行修改数量
    cart[index].num += operation;
    // 5 设置回缓存和data中
    this.setCart(cart);
  }
  },
  async delete(e){
    const {id } = e.currentTarget.dataset;
    let { cart } = this.data;
    const index = cart.findIndex(v => v.goods_id === id);
    const res = await showModal({ content: "您是否要删除？" });
    if (res.confirm) {
      cart.splice(index, 1);
      this.setCart(cart);
    }
  },
  async handlePay(){
    // 1 判断收货地址
    const {address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    // 2 判断用户有没有选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return ;
    }
    // 3 跳转到 支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    });
      
  },
/**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  onShow: function () {
    const address = wx.getStorageSync('address')
    //获取缓存中的商品信息  添加到购物车内
    const cart = wx.getStorageSync('cart') || []
    //实现全选   计算全选
    //every  遍历数组  接收回调函数  必须确保每一个回调函数都返回true  every的返回值才为true 遇见false停止循环返回false
    //空数组调用every返回值为true
    //总价格  被选中商品的数量×单价  总熟练=被选中商品的数量总和
    // const allChecked = cart.length ? cart.every(v => v.checked) : false
    this.setCart(cart)
    this.setData({
      address
    })
  }
  // handleChooseAdderss() {

  //   // console.log('adderss');
  //   //  获取用户权限
  //   wx.getSetting({
  //     success: (result) => {
  //       const scopeAddress = result.authSetting["scope.address"]
  //       console.log(scopeAddress);
  //       if (scopeAddress === true || scopeAddress === undefined) {
  //         //获取用户地址
  //         wx.chooseAddress({
  //           success: (result1) => {
  //             console.log(result1)
  //           },
  //         })
  //       } else {
  //         console.log(2);
  //         // 用户重新授予权限   
  //         wx.openSetting({
  //           success: (rusult2) => {
  //             wx.chooseAddress({
  //               success: (result3) => {
  //                 console.log(result3)
  //               },
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },

  

})