// miniprogram/pages/users/users.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    login_bool: false
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

  // 登录
  async login (e) {
    console.log(e.detail)
    // let result = await app.request('POST', '/user/register', {
    //   username: e.detail.userInfo.nickName,
    //   sex: e.detail.userInfo.gender,
    //   head_img: e.detail.userInfo.avatarUrl
    // })


    await wx.login({
      timeout: 1000,
      success: res => {
        console.log(res)
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',//微信服务器获取appid的网址 不用变
          method:'post',//必须是post方法
          data:{
            js_code:res.code,
            appid:'wxfbee583280011292',//仅为实例appid
            secret:'c06a5cac5fe29ca2a1ebf25ba78315eb',//仅为实例secret
            grant_type:'authorization_code'
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success:function(response){
            console.log(response.data)
            wx.setStorageSync('app_openid', response.data.openid); //将openid存入本地缓存
            wx.setStorageSync('sessionKey', response.data.session_key)//将session_key 存入本地缓存命名为SessionKey
          }
        })
      }
    })
    // console.log(res)

    // let res = await wx.cloud.callFunction({
    //   name: 'logins'
    // })
    // console.log(res)
  }
})