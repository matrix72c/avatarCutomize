// pages/gen/gen.js
const ctx = wx.createCanvasContext('shareImg');
const app = getApp();
const device = wx.getSystemInfoSync();
const width = device.windowWidth;//设备屏幕宽度
const w = width / 375;
Page({
  data: {
    isStart: false,
    list: [1,2,3,1,2,3,1,2,3],
    prurl: '',
    defaultImg: 1,
    userInfo: {},
    hasUserInfo: false,
  },
  selectImg: function(e){
    var current = e.target.dataset.id;
    console.log(current);
    this.setData({
      defaultImg: current,
      prurl: ''
    });
    console.log("this:",this.data.userInfo);
    if(this.data.userInfo.avatarUrl){
      this.drawImg(this.data.userInfo.avatarUrl);
    } else {
      this.initCanvas(this.data.defaultImg);
    }
  },
  initCanvas(index){
    let that = this;
    //主要就是计算好各个图文的位置
    let num = 580*w;
    console.log(num)
    // ctx.drawImage(res[0].path, 0, 0, num, num)
    ctx.drawImage(`/asset/头像框${index}.png`, 0, 0, num, num)
    ctx.stroke()
    ctx.draw(false, () => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: num,
        height: num,
        destWidth: 960,
        destHeight: 960,
        canvasId: 'shareImg',
        success: function(res) {
          that.setData({
            prurl: res.tempFilePath
          })
        },
        fail: function(res) {
          wx.hideLoading()
        }
      })
    })
  },
  getAvatar(e) {
    let that = this;
    this.setData({isStart:true})
    if(!that.data.userInfo.avatarUrl){
      console.log('-- 1 --');
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
            hasUserInfo: true
          })
          that.drawImg(res.userInfo.avatarUrl);
          app.globalData.userInfo = res.userInfo;
        }
      });
    }else if(that.data.userInfo.avatarUrl){
      console.log('-- 2 --');
      that.drawImg(that.data.userInfo.avatarUrl);
    }
  },
  drawImg(avatarUrl){
    let that = this;
    console.log("-- drawImg --");
    // `${that.data.userInfo.avatarUrl}`
    let promise1 = new Promise(function(resolve, reject) {
      wx.getImageInfo({
        src: avatarUrl,
        complete: function(res) {
          console.log("promise1", res)
          resolve(res);
        }
      })
    });
    var index = that.data.defaultImg;
    let promise2 = new Promise(function(resolve, reject) {
      wx.getImageInfo({
        src: `/asset/头像框${index}.png`,
        complete: function(res) {
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
      let num = 290*w;
      ctx.drawImage(res[0].path, 0, 0, num, num)
      ctx.drawImage('../../' + res[1].path, 0, 0, num, num)
      ctx.stroke()
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: num,
          height: num,
          destWidth: 960,
          destHeight: 960,
          canvasId: 'shareImg',
          success: function(res) {
            that.setData({
              prurl: res.tempFilePath
            })
          },
          fail: function(res) {
            wx.hideLoading()
          }
        })
      })
    })
  },
  save: function() {
    var that = this;
    if(!that.data.prurl){
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
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定');
            }
          }
        })
      }
    })
  },
  onLoad: function () {
    this.initCanvas(this.data.defaultImg);
  },
})