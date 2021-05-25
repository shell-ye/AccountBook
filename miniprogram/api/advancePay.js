const app = getApp()

// 添加预算
export const addAdvancePay = ( name, money ) => {
  return app.request('POST', '/tobuy/add',{
    name,
    money,
    openid: app.globalData.userInfo.openid
  })
}

// 获取预购列表
export const addList = () => {
  return app.request('GET', '/tobuy/list', {
    openid: app.globalData.userInfo.openid
  })
}

// 修改预购
export const advanceEdit = ( type, id, name, status, money ) => {
  return app.request('POST', '/tobuy/edit', {
    openid: app.globalData.userInfo.openid,
    type,
    id,
    name,
    status,
    money
  })
}