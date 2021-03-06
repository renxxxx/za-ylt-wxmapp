// pages/twoKfMoreDoc/twoKfMoreDoc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navtitle: '医生团队',
    statusBarHeight: '',
    titleBarHeight: '',
    toPageNo:'',
    hospital_id:'',
    schemeList:[],
    schemeListArr:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var hospital_id = options.hospital_id
    that.setData({
      hospital_id: hospital_id,
    })
    that.nextPage(0)
  },
  nextPage: function (toPageNo) {
    var that = this;
    var userToken = wx.getStorageSync("userToken")
    var pageSize = 15;
    var toPageNo = parseInt(toPageNo) + 1
    wx.request({
      url: 'https://www.njshangka.com/zaylt/c/d/e/hospital/doctorlist',
      method: 'post',
      data: {
        page_no: toPageNo,
        page_size: pageSize,
        hospital_id: that.data.hospital_id,
        token: userToken,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",

      },
      success: function (res) {
        if (res.data.code == 0) {


          var schemeListArr = that.data.schemeList;
          var newSchemeListArr = schemeListArr.concat(res.data.data.items)



          if (res.data.data.items.length == 0) {
            that.setData({
              schemeList: newSchemeListArr,
              // toPageNo: String(toPageNo)
            });
            wx.showToast({
              title: '数据已全部加载',
              // icon: 'loading',
              // duration: 1500
            })
          } else {
            // console.log(res.data.data.doctors.items.length)
            that.setData({
              schemeList: newSchemeListArr,
              toPageNo: String(toPageNo)
            });
          }


        } else if (res.data.code == 20 || res.data.code == 26) {
          wx.hideToast()
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const vm = this
    vm.setData({
      statusBarHeight: getApp().globalData.statusBarHeight,
      titleBarHeight: getApp().globalData.titleBarHeight
    })
  },
  backHistory: function (e) {
    wx.navigateBack({

    })
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
    var that = this
    that.setData({
      schemeList: [],
    })
    that.nextPage(0)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var toPageNo = that.data.toPageNo
    that.nextPage(toPageNo)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})