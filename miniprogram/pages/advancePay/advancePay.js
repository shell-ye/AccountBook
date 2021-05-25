// miniprogram/pages/advancePay/advancePay.js
import { addAdvancePay, addList, advanceEdit } from '../../api/advancePay'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addDialogShow: false,
    addButtons: [{text: '取消'}, {text: '确定'}],
    production: '',
    price: '',
    advancePayList: [],
    advancePayPrice: 0,
    editDialogShow: false,
    editButtons: [{text: '取消'}, {text: '确认'}, {text: '删除'}],
    index: 0,
    productionStatus: 0,
    money: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
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

  // 获取列表数据
  async getData () {
    let result = await addList()
    if ( result.data.code == 200 ) {
      let moneyCount = 0
      result.data.data.forEach(item => {
        if ( item.status == 0 ) {
          moneyCount += item.money
        }
      })
      this.setData({
        advancePayPrice: moneyCount,
        advancePayList: result.data.data
      })
    }
  },

  // 打开弹窗
  async setAddDialog ( type ) {
    this.setData({
      addDialogShow : type != undefined ? type : true
    })
  },

  // 记录数据
  setProduction (e) {
    if ( e.target.dataset.type == 'production' ) {
      this.setData({
        production: e.detail.value
      })
    } else {
      this.setData({
        price: e.detail.value
      })
    }
  },

  // 添加一行数据
  async add (e) {
    if (e.detail.item.text == '取消') {
      this.setData({
        addDialogShow : false
      })
    } else {
      if ( !this.data.production || !this.data.price ) {
        wx.showToast({
          title: '请正确输入对应信息',
          icon: 'none',
          duration: 2000
        })
      } else {
        let result = await addAdvancePay( this.data.production, parseFloat(this.data.price) )
        if ( result.data.code == 200 ) {
          this.setData({
            addDialogShow: false
          })
          this.getData()
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    }
  },

  // 打开修改弹窗
  openEidt (e) {
    this.setData({
      editDialogShow: true,
      index: e.target.dataset.index,
      production: this.data.advancePayList[e.target.dataset.index].name,
      productionStatus: this.data.advancePayList[e.target.dataset.index].status,
      money: this.data.advancePayList[e.target.dataset.index].money
    })
  },

  // 修改
  async edit (e) {
    let result = {}
    if (e.detail.item.text == '取消') {
      this.setData({
        editDialogShow : false
      })
    } else if ( e.detail.item.text == '删除' ) {
      result = await advanceEdit( 2, this.data.advancePayList[this.data.index].id )
    } else {
      if ( !this.data.production || !this.data.money ) {
        wx.showToast({
          title: '请正确输入对应信息',
          icon: 'none',
          duration: 2000
        })
      } else {
        result = await advanceEdit( 1, this.data.advancePayList[this.data.index].id, this.data.production, this.data.productionStatus, this.data.money )
      }
    }
    if ( result.data && result.data.code == 200 ) {
      this.setData({
        editDialogShow: false
      })
      this.getData()
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000
      })
    }
  },

  // 修改输入框输入
  eidtProduction (e) {
    this.setData({
      [e.target.dataset.type]: e.detail.value
    })
  },

  // 改变状态
  changeStatus (e) {
    this.setData({
      productionStatus: e.target.dataset.value
    })
  }
})