// miniprogram/pages/bill/bill.js
import { summaryList } from '../../api/record.js'
import { dateFormat } from '../../utils/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: 2021,
    income: 0,
    outcome: 0,
    list: [{
      month: 3,
      income: 100,
      outcome: 80
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
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

  selectDate (e) {
    this.getData(e.detail.value)
    this.setData({
      year: e.detail.value
    })
  },

  // 获取数据
  async getData ( year ) {
    let result = await summaryList( year || this.data.year )
    if ( result.data.code == 200 ) {
      // 初始处理数据
      let income = 0
      let outcome = 0
      let month = new Date().getMonth()
      let nowYear = new Date().getFullYear()
      if ( (year || this.data.year) != new Date().getFullYear() ) {
        month = 11
      }
      let list = []
      for ( let i = 1; i <= month + 1; i++ ) {
        list.push({
          month: i,
          income: 0,
          outcome: 0
        })
      }

      // 遍历
      result.data.data.forEach(item => {
        if ( item.status == 0 ) {
          outcome += parseFloat(item.money)
          list[parseInt(dateFormat(new Date(item.time), 'MM').replace('0', '')) - 1].outcome += parseFloat(item.money)
        } else {
          income += parseFloat(item.money)
          list[parseInt(dateFormat(new Date(item.time), 'MM').replace('0', '')) - 1].income += parseFloat(item.money)
        }
      })
      list.reverse()

      // 写入
      this.setData({
        income,
        outcome,
        list
      })
    }
  }
})