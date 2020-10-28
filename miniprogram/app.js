//app.js

App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {
      userInfo: {}
    }
 
    // 获取用户信息 openid
    wx.getSetting({
      success: res => {
        if ( !res.authSetting["scope.userInfo"] ) {
          wx.showModal({
            title: '用户未授权',
            content: '如需正常需授权获取用户信息。是否在授权管理中选中“用户信息?如果打开失败请在右上角点击"...",在设置中开始获取用户信息权限',
            showCancel: true,
            cancelColor: '#296fd0',
            confirmColor: '#296fd0',
            confirmText: '设置权限',
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success: res => {
                    wx.authorize({
                      scope: 'scope.userInfo',
                      success () {
                        wx.startRecord()
                      }
                    })
                    var scopeUserInfo = res.authSetting["scope.userInfo"];
                    if (!scopeUserInfo) {
                      wx.showToast({
                        title: '权限打开失败',
                        icon: 'none',
                        duration: 2000
                      })
                    } else {
                      this.getUserInfo()
                    }
                  }
                });
              }
            }
          })
        } else {
          this.getUserInfo()
        }
      }
    })
  },

  // 封装微信请求
  request (method, url, data ) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://127.0.0.1:3003${url}`,
        method,
        data,
        dataType: 'json',
        success: res => {
          if ( res.data.code != 200 ) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            resolve( res )
          }
        },
        fail: err => {
          wx.showToast({
            title: '系统繁忙',
            icon: 'none',
            duration: 2000
          })
          console.log('failRequest', err)
          reject( err )
        }
      })
    }) 
  },

  // 获取用户信息
  getUserInfo () {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: async res => {
          // 获取登录 openid
          let userInfo = res.userInfo
          let appInfo = await this.request('POST', '/weixin/id_secret')
          wx.login({
            success: res => {
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session',
                method: 'POST',
                data: {
                  js_code: res.code,
                  appid: appInfo.data.data.appid,
                  secret: appInfo.data.data.secret,
                  grant_type: 'authorization_code'
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: res => {
                  userInfo.openid = res.data.openid
                  userInfo.session_key = res.data.session_key
                  this.globalData.userInfo = userInfo
                  wx.setStorageSync('app_openid', res.data.openid)
                  wx.setStorageSync('sessionKey', res.data.session_key)
                  resolve(res.userInfo)
                }
              })
            }
          })
        }
      })
    })
  }

})
