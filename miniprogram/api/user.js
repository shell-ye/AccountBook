const app = getApp()

// 注册
export const register = (username, head_img) => {
  return app.request('POST', '/user/register',{
    username,
    head_img,
    openid: app.globalData.userInfo.openid
  })
}

// 登录
export const login = () => {
  return app.request('GET', '/user/login', {
    openid: app.globalData.userInfo.openid
  })
}

// 设置每月预算
export const setBudget = budget => {
  return app.request('POST', '/user/set-budget', {
    openid: app.globalData.userInfo.openid,
    budget
  })
}