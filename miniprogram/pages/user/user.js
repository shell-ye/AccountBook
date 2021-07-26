// miniprogram/pages/users/users.js

const app = getApp()
import { login, register, setBudget } from '../../api/user'
import { changeMoney } from '../../utils/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    login_bool: false,
    userInfo: {},
    count_info: [{
      text: '记账总笔数',
      data: 0
    }, {
      text: '累计收入',
      data: 0
    }, {
      text: '累计支出',
      data: 0
    }],
    bar: [{
        text: '消息',
        src: '/images/icon/bell.jpg'
      }, {
        text: '我的徽章',
        src: '/images/icon/medal.jpg'
      }, {
        text: '我的积分',
        src: '/images/icon/gift.jpg'
      }, {
        text: '邀请好友',
        src: '/images/icon/letter.jpg'
      }, {
        text: '设置',
        src: '/images/icon/setting.jpg'
      }],
      // 弹窗
      dialogShow: false,
      budgetButtons: [{text: '取消'}, {text: '确定'}],
      budgetValue: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {
    this.initHandler()
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
    this.initHandler()
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

  // 初始化页面
  async initHandler () {
    wx.showLoading({title: '加载中'})
    
    // 判断是否注册用户: 是则登录
    let user = await login()
    if ( user.data.code == 200 && user.data.login ) {
      await this.setData({
        login_bool: true
      })

      app.globalData.userInfo.avatarUrl = user.data.userInfo.head_img
      app.globalData.userInfo.nickName = user.data.userInfo.username

      // 写入用户数据 
      await this.setData({
        userInfo: {
          ...app.globalData.userInfo,
          ...user.data.data
        },
        count_info: [{
          text: '记账总笔数',
          data: user.data.data.record_num
        }, {
          text: '累计收入',
          data: changeMoney( user.data.data.income_count )
        }, {
          text: '累计支出',
          data: changeMoney( user.data.data.expenditure_count )
        }]
      })
    }

    wx.hideLoading()
  },

  // 微信授权登录（注册）
  async login (e) {
    if ( e.detail.userInfo ) {
      console.log(e)
      let result = await register( e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl )
      if ( result.data.code == 200 ) {
        this.setData({
          login_bool: true
        })
      }
      this.initHandler()
    }
  },

  // 打卡
  daka () {
  
  },

  // 预算弹窗
  setBudgetDialog ( type ) {
    this.setData({
      dialogShow : type != undefined ? type : true
    })
  },

  setBudgetValue (e) {
    this.setData({
      budgetValue: e.detail.value
    })
  },

  async setBudgetButton (e) {
    if ( e.detail.item.text == '取消' ) {
      this.setBudgetDialog(false)
    } else {
      let result = await setBudget(parseFloat(this.data.budgetValue))
      if ( result.data.code == 200 ) {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000
        })
        this.setBudgetDialog(false)
        this.initHandler()
      }
    }
  }
})