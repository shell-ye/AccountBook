// miniprogram/pages/edit/edit.js

import { searchRecord, delRecord } from './../../api/record'
import { getIconClass, dateFormat } from './../../utils/index'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    record: '',
    deleteDialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if ( options.id ) {
      let result = await searchRecord( 1, options.id  )
      result.data.data.timeShow = dateFormat(new Date(result.data.data.time), 'yyyy年MM月dd日')
      if ( result.data.code == 200 ) {
        this.setData({
          record: {
            ...result.data.data,
            icon: getIconClass(result.data.data)
          }
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

  },

  // 编辑页面
  edit () {
    app.globalData.routerData = {
      record: this.data.record
    }
    wx.switchTab({url: '/pages/add/add'})
  },

  // 点击删除
  openDelDialog () {
    this.setData({
      deleteDialog: true
    })
  },

  // 确认删除
  async delete (e) {
    if ( e.detail == 'confirm' ) {
      let result = await delRecord(this.data.record.id)
      if ( result.data.code == 200 ) {
        this.setData({
          deleteDialog: false
        }, () => {
          wx.navigateBack()
        })
      }
    } else {
      this.setData({
        deleteDialog: false
      })
    }
  }
})