// miniprogram/pages/calendar/calendar.js
import { recordList } from './../../api/record'
import { login, setBudget } from './../../api/user'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    now: {
      year: 2021,
      month: 5,
      week: 1
    },
    daysCount: 0,
    calendar: [],
    userInfo: {},
    dialogShow: false,
    budget: '',
    budgetButtons: [{text: '取消'}, {text: '确定'}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取用户信息
    await this.getUserInfo()
    this.getInfo()
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

  // 获取用户信息
  async getUserInfo () {
    let user = await login()
    if ( user.data.code == 200 ) {
      this.setData({
        userInfo: user.data.data
      })
    }
  },

  // 获取预算信息
  async getInfo (e) {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    if ( e && e.target.dataset.type == 'increase' ) {
      if ( this.data.now.month == 12 ) {
        year += 1
        month = 1
      } else {
        month = this.data.now.month + 1
      }
    } else if ( e && e.target.dataset.type == 'decrease' ) {
      if ( this.data.now.month == 1 ) {
        year -= 1
        month = 12
      } else {
        month = this.data.now.month - 1
      }
    }

    // 这个月第一天星期几
    let weekDate = new Date(`${ year }-${ month }-01`)
    let week = weekDate.getDay()
    
    // 闰年多一天
    let monthDays = [31, year % 4 == 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    let calendar = []

    // 这个月有几天
    let daysCount = monthDays[month - 1]
    for ( let day = 1; day <= monthDays[month - 1]; day++ ) {
      calendar.push({
        money: 0,
        day
      })
    }

    // 获取本月记录
    let result = await recordList( year, month.toString().length == 1 ? '0' + month : month )
    if ( result.data.code == 200 ) {
      // 循环结果
      for ( let prop in result.data.data ) {
        // 循环日历
        calendar.forEach(item => {
          // 对应日期
          if ( prop == item.day ) {
            // 循环当天所有记录
            let money = 0
            result.data.data[prop].forEach(items => {
              if ( items.status == 0 ) {
                money += parseInt(items.money)
              }
            })
            item.money = money
          }
        })
      }
    }
    this.setData({
      now: {
        year,
        month,
        week
      },
      calendar,
      daysCount
    })
  },

  // 点击预算按钮
  openBudget ( type ) {
    this.setData({
      dialogShow : type != undefined ? type : true
    })
  },

  // 点击弹窗内按钮
  async setBudgetButton (e) {
    if ( e.detail.item.text == '取消' ) {
      this.openBudget(false)
    } else {
      let result = await setBudget(parseFloat(this.data.budget))
      if ( result.data.code == 200 ) {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000
        })
        this.openBudget(false)
        this.getUserInfo()
      }
    }
  },

  // 输入预算
  setBudgetValue (e) {
    this.setData({
      budget: e.detail.value
    })
  },
})