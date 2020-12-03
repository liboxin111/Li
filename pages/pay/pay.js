Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  setCart(cart) {
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
      }
    })
    allChecked = cart.length != 0 ? allChecked : false
    this.setData({
      cart,
      totalPrice,
      totalNum,
    })
  },
  async handleItemNumEdit(e) {
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    let {
      cart
    } = this.data;
    const index = cart.findIndex(v => v.goods_id === id);
    if (cart[index].num === 1 && operation === -1) {
      return
    } else {
      cart[index].num += operation;
      this.setCart(cart);
    }
  },
  onLoad: function (options) {},  
  onShow: function () {
    const address = wx.getStorageSync('address')
    let cart = wx.getStorageSync('cart') || []
    cart = cart.filter(v => v.checked)
    this.setCart(cart)
    this.setData({
      address
    })
  }
})