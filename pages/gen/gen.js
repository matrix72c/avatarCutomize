// pages/gen/gen.js
const stx = wx.createCanvasContext('shareImg');
const ctx = wx.createCanvasContext('genImg');
const app = getApp();
const device = wx.getSystemInfoSync();
const screenWidth = device.windowWidth;
const screenHeight = device.windowHeight;
const w = screenWidth / 375;
Page({
  data: {
    screenWidth: device.windowWidth,
    screenHeight: device.windowHeight,
    isStart: false,
    hasPhoto: false,
    photoUrl: '',
    list: [
      'https://6e6a-njupt-red-avatar-5fxugur2ac8fee7-1312231559.tcb.qcloud.la/%E5%A4%B4%E5%83%8F%E6%A1%861.png?sign=00661807f5a943a84b5b02166f2ae13f&t=1653897063',
      'https://6e6a-njupt-red-avatar-5fxugur2ac8fee7-1312231559.tcb.qcloud.la/%E5%A4%B4%E5%83%8F%E6%A1%862.png?sign=e9fc015e399b0829533bd8882e954241&t=1653897081',
      'https://6e6a-njupt-red-avatar-5fxugur2ac8fee7-1312231559.tcb.qcloud.la/%E5%A4%B4%E5%83%8F%E6%A1%863.png?sign=60ecca4621a01305bffa7b04823637ea&t=1653897091',
      'https://6e6a-njupt-red-avatar-5fxugur2ac8fee7-1312231559.tcb.qcloud.la/%E5%A4%B4%E5%83%8F%E6%A1%861.png?sign=00661807f5a943a84b5b02166f2ae13f&t=1653897063',
      'https://6e6a-njupt-red-avatar-5fxugur2ac8fee7-1312231559.tcb.qcloud.la/%E5%A4%B4%E5%83%8F%E6%A1%862.png?sign=e9fc015e399b0829533bd8882e954241&t=1653897081',
      'https://6e6a-njupt-red-avatar-5fxugur2ac8fee7-1312231559.tcb.qcloud.la/%E5%A4%B4%E5%83%8F%E6%A1%863.png?sign=60ecca4621a01305bffa7b04823637ea&t=1653897091'
    ],
    prurl: '',
    defaultImg: 0,
    userInfo: {},
    hasUserInfo: false,
    posterUrl: '',
    introUrl: app.globalData.introPics[0],
    hideModal: true,
    hideCanvas: true
  },
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
      path: '/page/index/index',
      imageUrl: 'https://6e6a-njupt-red-avatar-5fxugur2ac8fee7-1312231559.tcb.qcloud.la/avatar.jpg?sign=265cfeebbe66aa50b373d8dd98e64689&t=1653925239',
      promise
    }
  },
  hideModal() {
    this.setData({
      hideModal: true,
      hideCanvas: false
    });
  },
  selectImg(e) {
    var current = e.target.dataset.id;
    console.log(e);
    this.setData({
      defaultImg: current % 3,
      prurl: '',
      introUrl: app.globalData.introPics[current % 3]
    });
    console.log("this:", this.data.userInfo);
    if (this.data.hasPhoto) {
      this.drawImg(this.data.photoUrl);
    }
  },
  initCanvas(photoUrl) {
    let that = this;
    let promise1 = new Promise(() => {
      wx.getImageInfo({
        src: photoUrl,
        complete: function (res) {
          let num = 290 * w;
          ctx.drawImage(res.path, 0, 0, num, num)
          ctx.stroke()
          ctx.draw(false, () => {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: num,
              height: num,
              destWidth: 960,
              destHeight: 960,
              canvasId: 'genImg',
              success: function (res) {
                that.setData({
                  prurl: res.tempFilePath
                })
              },
              fail: function (res) {
                wx.hideLoading()
              }
            })
          }, that)
        }
      })
    });
  },
  getAvatar(e) {
    let that = this;
    if (!that.data.userInfo.avatarUrl) {
      wx.getUserProfile({
        desc: '仅用于生成头像使用', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          //获取高清用户头像
          var url = res.userInfo.avatarUrl;
          while (!isNaN(parseInt(url.substring(url.length - 1, url.length)))) {
            url = url.substring(0, url.length - 1)
          }
          url = url.substring(0, url.length - 1) + "/0";
          res.userInfo.avatarUrl = url;
          console.log(JSON.stringify(res.userInfo));
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            hasPhoto: true,
            hideCanvas: false,
            photoUrl: res.userInfo.avatarUrl
          })
          that.initCanvas(res.userInfo.avatarUrl);
          app.globalData.userInfo = res.userInfo;
        }
      });
    } else if (that.data.userInfo.avatarUrl) {
      that.initCanvas(that.data.userInfo.avatarUrl);
    }
  },
  getPhoto() {
    let that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        console.log(res.tempFiles[0].tempFilePath)
        that.setData({
          photoUrl: res.tempFiles[0].tempFilePath,
          hasPhoto: true,
          hideCanvas: false
        })
        that.initCanvas(res.tempFiles[0].tempFilePath)
      }
    })
  },
  drawImg(avatarUrl) {
    let that = this;
    console.log("-- drawImg --");
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: avatarUrl,
        complete: function (res) {
          console.log("promise1", res)
          resolve(res);
        }
      })
    });
    var index = that.data.defaultImg;
    let promise2 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.list[index],
        complete: function (res) {
          console.log(res)
          resolve(res);
        }
      })
    });
    Promise.all([
      promise1, promise2
    ]).then(res => {
      console.log("Promise.all", res)
      //主要就是计算好各个图文的位置
      let num = 290 * w;
      ctx.drawImage(res[0].path, 0, 0, num, num)
      ctx.drawImage(res[1].path, 0, 0, num, num)
      ctx.stroke()
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: num,
          height: num,
          destWidth: 960,
          destHeight: 960,
          canvasId: 'genImg',
          success: function (res) {
            console.log('draw', res)
            that.setData({
              prurl: res.tempFilePath
            })
          },
          fail: function (res) {
            console.log('draw', res)
            wx.hideLoading()
          }
        })
      })
    })
  },
  startGen() {
    var that = this;
    if (!that.data.hasPhoto) {
      wx.showToast({
        title: '请先上传一张图片',
      })
      return;
    }
    that.setData({
      isStart: true
    })
  },
  save() {
    var that = this;
    if (!that.data.prurl) {
      wx.showToast({
        title: '请先生成专属头像',
      })
      return;
    }
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册!',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
            }
          }
        })
      }
    })
  },
  share() {
    var that = this;
    if (!that.data.prurl) {
      wx.showToast({
        title: '请先生成专属头像',
      })
      return;
    }
    let promise3 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: 'https://6e6a-njupt-red-avatar-5fxugur2ac8fee7-1312231559.tcb.qcloud.la/%E5%88%86%E4%BA%AB%E5%A4%B4%E5%83%8F%E7%95%8C%E9%9D%A2.jpg?sign=9dfce855053eac7760a055b3e35e430c&t=1653900021',
        success(res) {
          resolve(res);
        }
      })
    });
    let promise4 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.prurl,
        success(res) {
          resolve(res);
        }
      })
    });
    Promise.all([
      promise3, promise4
    ]).then(res => {
      let canvasWidth = screenWidth
      let canvasHeight = res[0].height * screenWidth / res[0].width
      stx.drawImage(res[0].path, 0, 0, canvasWidth, canvasHeight)
      stx.drawImage(res[1].path, 63 * w, 58 * w, 250 * w, 245 * w)
      stx.stroke()
      stx.draw(true, () => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: canvasWidth,
          height: canvasHeight,
          destWidth: canvasWidth,
          destHeight: canvasHeight,
          canvasId: 'shareImg',
          complete(res) {
            console.log('share', res)
          },
          success(res) {
            that.setData({
              posterUrl: res.tempFilePath,
              hideModal: false,
              hideCanvas: true
            })
          },
          fail() {
            wx.hideLoading()
          }
        })
      })
    })
  }
})