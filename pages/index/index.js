// pages/Third/index/index.js
var app=getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navtitle: '— 医院端 —',
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    movies: [],
    swiperCurrent: 0,
    kw: '',
    schemeList: [],
    cover:[],
  },
  qdmz:function(e){
      wx.navigateTo({
        url: '../clinicSearch/clinicSearch?type=1',
      })
  },
  bygl: function (e) {
    wx.navigateTo({
      url: '../sourceManagement/sourceManagement',
    })
  },
  qxjc:function(){
    wx.navigateTo({
      url: '../ZJCQxshop/ZJCQxshop',
    })
  },
  yyzx: function () {
    wx.navigateTo({
      url: '../operationsCenter/operationsCenter?type=1',
    })
  },
  jyjc:function(){
    wx.redirectTo({
      url: '../gene/gene',
    })
  },
  yyhd: function () {
    wx.navigateTo({
      url: '../putInPrecisionActivities/putInPrecisionActivities',
    })
  },
  ylzy(e){
    wx.showToast({
      title: '暂未开通',
      icon:'loading'
    })
  },
  qtxm(e) {
    wx.showToast({
      title: '暂未开通',
      icon: 'loading'
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  mine(e){
    wx.redirectTo({
      url: '../mine/mine',
    })
  },
  clinic(e) {
    wx.redirectTo({
      url: '../clinic/clinic',
    })
  },
  gene(e) {
    wx.redirectTo({
      url: '../gene/gene',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      statusBarHeight: getApp().globalData.statusBarHeight,
      titleBarHeight: getApp().globalData.titleBarHeight
    })
    var id = options.id
    
    if (options.isShare&&options.isShare==1){
      wx.navigateTo({
        url: '../out/articleDetail/articleDetail?id=' + options.shareId ,
      })
    } else if (options.isShare&&options.isShare == 2) {
      wx.navigateTo({
        url: '../out/highQualityCaseDetail/highQualityCaseDetail?id=' + options.shareId,
      })
    } else if (options.isShare&&options.isShare == 3) {
      wx.navigateTo({
        url: '../newActivity/newActivity?type=' + options.shareId,
      })
    }
    wx.request({
      url: app.globalData.url + '/hospital/login-refresh',
      header: {
        'Content-type': 'application/x-www-form-urlencoded',
        'cookie': app.globalData.cookie
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 20 || res.data.code == 26){
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })
    wx.request({
      url: app.globalData.url + '/hospital/hospital-ads',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': app.globalData.cookie
      },
      method: 'get',
      data: {
        place:0
      },
      success: function (res) {
        var cover = res.data.data.rows
        if (res.data.data.rows == '' || res.data.data.rows == null || res.data.data.rows == undefined) {
          cover = ''
        } else {
          cover = res.data.data.rows
        }
        for (var i = 0; i < cover.length; i++) {
          if (cover[i].cover&&cover[i].cover.slice(0, 1) != 'h') {
            cover[i].cover = app.globalData.url + cover[i].cover
          }
        }

        that.setData({
          cover: cover
        })
      }
    })
    // wx.request({
    //   url: app.globalData.url + '/c2/hospital/item',
    //   header: {
    //     'Content-type': 'application/json'
    //   },
    //   data: {
    //     token: app.globalData.token,
    //     itemId: id
    //   },
    //   success: function (res) {

    //     app.globalData.phone = res.data.data.phone;
    //     app.globalData.userId = res.data.data.userId;
    //     // var cover = res.data.data.cover.split(',')
    //     // if (res.data.data.cover == '' || res.data.data.cover == null || res.data.data.cover==undefined){
    //     //   cover=''
    //     // }else{
    //     //   cover = res.data.data.cover.split(',')
    //     // }
    //     // for (var i = 0; i < cover.length;i++){
    //     //   if(cover[i].slice(0,1)!='h'){
    //     //     cover[i] = app.globalData.url + cover[i]
    //     //   }
    //     // }

    //     // that.setData({
    //     //   cover: cover
    //     // })
    //   }
    // })
    that.lastPage(0,'')
  },
  lastPage: function (toPageNo, kw) {
    var that = this
    toPageNo++

    wx.request({
      url: app.globalData.url + '/c2/article/items',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': app.globalData.cookie
      },
      data: {
        hospitalId: app.globalData.hospitalId,
        pn: toPageNo,
        ps: 10,
        kw: kw,
        sorts: 'addTime',
        orders: 'desc'
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          var addTime
          for (var i = 0; i < res.data.data.items.length; i++) {
            addTime = res.data.data.items[i].addTime
            res.data.data.items[i].addTime = utils.formatTime(addTime / 1000, 'Y-M-D h:m');
            if (res.data.data.items[i].cover&&res.data.data.items[i].cover.slice(0, 1) != 'h') {
              res.data.data.items[i].cover = app.globalData.url + res.data.data.items[i].cover
            }
          }
          var schemeListArr = that.data.schemeList;
          var newSchemeListArr = schemeListArr.concat(res.data.data.items)
          if (res.data.data.items.length == 0) {
            that.setData({
              schemeList: newSchemeListArr,
            });
            if (toPageNo == 1) {
              wx.showToast({
                title: '尚无运营精选',
                icon: 'loading',
                // duration: 1500
              })
            } else {
              wx.showToast({
                title: '数据已全部加载',
                // icon: 'loading',
                // duration: 1500
              })
            }

          } else {
            that.setData({
              schemeList: newSchemeListArr,
              toPageNo: String(toPageNo)
            });
          }
        } else {
          wx.showModal({
            showCancel: false,
            title: res.data.codeMsg
          })
        }
      }
    });
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
    
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
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
    var that = this
    that.setData({
      schemeList: [],
    })
    that.lastPage(0,'')
    wx.stopPullDownRefresh()
  },
  backHistory: function (e) {
    wx.navigateBack({

    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var toPageNo = that.data.toPageNo
    that.lastPage(toPageNo,'')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if (app.globalData.lastClient == 1) {
      var path = '/pages/index/index'
    } else {
      var path = '/pages/out/index/index'
    }
    return {
      title: '欢迎使用共享医联体小程序', //分享内容
      path: path, //分享地址
      imageUrl: 'https://zaylt.njshangka.com/favicon.ico', //分享图片
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  }
})