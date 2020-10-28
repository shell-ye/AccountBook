// miniprogram/pages/index/index.js

const app = getApp()
import { recordList } from './../../api/record'
import { dateFormat, getIconClass } from './../../utils/index'
import data from './../../data/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar: [{
      text: '账单',
      src: '/images/icon/account.jpg'
    }, {
      text: '预算',
      src: '/images/icon/budget.jpg'
    }, {
      text: '资产管家',
      src: '/images/icon/housekeeper.jpg'
    }, {
      text: '理财知识',
      src: '/images/icon/konwledge.jpg'
    }, {
      text: '购物返现',
      src: '/images/icon/shopping.jpg'
    }],
    time: {
      year: dateFormat(new Date(), 'yyyy'),
      month: dateFormat(new Date(), 'MM')
    },
    list: {}
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
  onShow: async function () {
    if ( JSON.stringify(app.globalData.userInfo) != '{}' ) {
      this.getRecordList()
    } else {
      await app.getUserInfo()
      this.getRecordList()
    }
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

  // 得到记录
  async getRecordList () {
    let result = await recordList( this.data.time.year, this.data.time.month )
    if ( result.data.code == 200 ) {
      for ( let prop in result.data.data ) {
        if ( typeof result.data.data[prop] == 'object' ) {
          result.data.data[prop].forEach(item => {
            item.icon = getIconClass( item )
          })
        }
      }
      this.setData({
        list: result.data.data
      })
    }
  },

  // 选择时间
  selectDate (e) {
    this.setData({
      time: {
        month: e.detail.value.split('-')[1],
        year: e.detail.value.split('-')[0]
      }
    }, () => {
      this.getRecordList()
    })
  } 
})