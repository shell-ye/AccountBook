// miniprogram/pages/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: 'expenditure',
    money: '0',
    remark: '',
    increase: '',
    decrease: '',
    dot: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  // 改变记录模式
  changeSelect ( e ) {
    this.setData({
      selected: e.target.dataset.type
    })
  },

  // 修改金额
  async changeMoney ( e ) {
    let integer = this.data.money.indexOf('.') == -1 ? this.data.money :  this.data.money.split('.')[0]
    let decimal = this.data.money.indexOf('.') == -1 ? 0 :  this.data.money.split('.')[1]
    
    // 判断点击
    if ( e.target.dataset.number == '.' ) {
      if ( this.data.dot ) {
        return
      }
      await this.setData({
        dot: true
      })
    } else if ( e.target.dataset.number == 'x' && this.data.money != '0' ) {
      if ( this.data.dot ) {
        if ( decimal == '' ) {
          await this.setData({
            dot: false,
            money: this.data.money.replace('.', '')
          })
          return
        } else {
          decimal = decimal.substr(0, decimal.length - 1)
        }
      } else {
        integer = integer.substr(0, integer.length - 1)
      }
    }
    
    if ( e.target.dataset.number != 'x' ) {
      if ( this.data.dot ) {
        if ( e.target.dataset.number != '.' ) {
          decimal = decimal == '0' ? e.target.dataset.number : decimal + e.target.dataset.number
        }
      } else {
        integer = integer == '0' ? e.target.dataset.number : integer + e.target.dataset.number
      }
    }
    let money = decimal != '0' && decimal != '' ? integer + '.' + decimal : this.data.dot ? integer + '.' : integer
    money = money[0] == '.' ? '0' + money : money
    this.setData({
      money
    })
  }
})