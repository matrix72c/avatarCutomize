// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {},
  onShareAppMessage() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: '南邮红色校史换头像小程序',
          path: '/pages/index/index',
          imageUrl: 'https://6e6a-njupt-red-avatar-5fxugur2ac8fee7-1312231559.tcb.qcloud.la/avatar.jpg?sign=265cfeebbe66aa50b373d8dd98e64689&t=1653925239',
        })
      }, 2000)
    })
    return {
      title: '南邮红色校史换头像小程序',
      path: '/pages/index/index',
      imageUrl: 'https://6e6a-njupt-red-avatar-5fxugur2ac8fee7-1312231559.tcb.qcloud.la/avatar.jpg?sign=265cfeebbe66aa50b373d8dd98e64689&t=1653925239',
      promise
    }
  },
  onShareTimeline() {
    return {
      title: '南邮红色校史换头像小程序',
      path: '/page/index',
      imageUrl: 'https://6e6a-njupt-red-avatar-5fxugur2ac8fee7-1312231559.tcb.qcloud.la/avatar.jpg?sign=265cfeebbe66aa50b373d8dd98e64689&t=1653925239',
      promise
    }
  },
  // 事件处理函数
  jump() {
    wx.navigateTo({
      url: '/pages/gen/gen',
    })
  }
})