// miniprogram/pages/add/add.js

import data from './../../data/index'
const app = getApp()
import { easeCalculate } from './../../utils/index'
import { submitRecord } from './../../api/record'
import { dateFormat } from './../../utils/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: 'expenditure',
    showIcons: [],
    selectIcon: '',
    keyboardShow: false,
    money: '0',
    remark: '',
    dot: false,
    calculation: '',
    today: dateFormat(new Date(), 'yyyy-MM-dd'),
    time: dateFormat(new Date(), 'yyyy-MM-dd'),

    // 编辑模式
    eidt: false,
    id: 0
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
    if ( app.globalData.routerData && app.globalData.routerData.record ) {
      let selected = app.globalData.routerData.record.status == 0 ? 'expenditure' : 'income'
      let showIcons = selected == 'income' ? data.icons.income : data.icons.expenditure
      let selectIcon = {}
      showIcons.map(item => {
        if ( item.iconClass ==  app.globalData.routerData.record.icon ) {
          selectIcon = item
        }
      })
      let dot = app.globalData.routerData.record.money.indexOf('.') != -1

      this.setData({
        eidt: true,
        id: app.globalData.routerData.record.id,
        money: app.globalData.routerData.record.money,
        time: dateFormat(new Date(app.globalData.routerData.record.time.toString()), 'yyyy-MM-dd'),
        selected,
        showIcons,
        remark: app.globalData.routerData.record.remark,
        selectIcon,
        keyboardShow: true,
        dot
      }, () => {
        app.globalData.routerData = {}
      })
    } else {
      this.setData({
        selected: 'expenditure',
        showIcons: data.icons.expenditure
      })
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

  // 改变记录模式
  changeSelect ( e ) {
    let showIcons = e.target.dataset.type == 'income' ? data.icons.income : data.icons.expenditure
    this.setData({
      selected: e.target.dataset.type,
      keyboardShow: false,
      selectIcon: '',
      showIcons
    })
  },

  // 选择图标
  select (e) {
    this.setData({
      selectIcon: e.currentTarget.dataset.icon,
      keyboardShow: true
    })
  },

  // 写备注
  eidtRemark (e) {
    this.setData({
      remark: e.detail.value
    })
  },

  // 修改时间
  selectDate (e) {
    this.setData({
      time: e.detail.value
    })
  },

  // 修改金额
  async changeMoney ( e ) {
    if ( this.data.calculation == '' ) {
      // 非计算模式
      let integer = this.data.money.toString().indexOf('.') == -1 ? this.data.money :  this.data.money.split('.')[0]
      let decimal = this.data.money.toString().indexOf('.') == -1 ? 0 :  this.data.money.split('.')[1]
      
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
      } else if ( e.target.dataset.number == '+' || e.target.dataset.number == '-' ) {
        await this.setData({
          money: this.data.money + e.target.dataset.number,
          calculation: e.target.dataset.number
        })
        return
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
    } else {
      if ( e.target.dataset.number != 'x' ) {
        await this.setData({
          money: this.data.money + e.target.dataset.number
        })
      } else {
        this.setData({
          money: this.data.money.substr(0, this.data.money.length - 1)
        })
        if ( this.data.money.indexOf(/\+\-\*\//g) == -1 ) {
          this.setData({
            calculation: ''
          })
        }
      }
    }
  },

  // 计算
  calculate () {
    this.setData({
      money: easeCalculate(this.data.money).toString(),
      calculation: ''
    })
  },

  // 添加记录
  async submit () {
    // 收入与支出 0-支出  1-收入
    let status = this.data.selected == 'income' ? 1 : 0
    let type = this.data.eidt ? 2 : 1
    let result = await submitRecord( type, status, this.data.selectIcon.text, this.data.money, this.data.remark, this.data.time, this.data.id )
    if ( result.data.code == 200 ) {
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000
      })
    }
    this.setData({
      selectIcon: '',
      keyboardShow: false,
      money: 0,
      remark: '',
      eidt: false
    })
  }
})