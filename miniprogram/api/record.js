const app = getApp()

// 添加 / 修改 记录
export const submitRecord = ( requestType, status, type, money, remark, time, id ) => {
  // requestType 1-添加  2-修改
  let url = requestType == 1 ? '/record/add' : '/record/change'
  return app.request('POST', url, {
    openid: app.globalData.userInfo.openid,
    status, 
    type, 
    money, 
    remark,
    time,
    id
  })
}

// 删除记录
export const delRecord = id => {
  return app.request('POST', '/record/del', {
    openid: app.globalData.userInfo.openid,
    id
  })
}

// 查找记录
export const searchRecord = ( type, param ) => {
  let obj = type == 1 ? {
    openid: app.globalData.userInfo.openid,
    type,
    id: param
  } : {}
  return app.request('GET', '/record/search', obj)
}

// 获取记录
export const recordList = ( year, month ) => {
  return app.request('GET', '/record/list', {
    openid: app.globalData.userInfo.openid,
    year,
    month
  })
}

// 获取结余信息
export const summaryList = year => {
  return app.request('GET', '/record/summary', {
    openid: app.globalData.userInfo.openid,
    year
  })
}