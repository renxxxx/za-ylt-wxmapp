                                                                                            // pages/HospatientDetails/HospatientDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toPageNo: '',
    schemeList:[],
    userToken:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.nextPage(0)
  },
  nextPage: function (toPageNo) {
    var that = this;
    var userToken =wx.getStorageSync("userToken")
    that.setData({
      userToken: userToken,
    })
    console.log(userToken)
    var pageSize = 15;
    var toPageNo = parseInt(toPageNo) + 1
    wx.request({
      url: 'https://www.njshangka.com/zaylt/c/h/e/patientinfo/patients',
      method: 'post',
      data: {
        page_no: toPageNo,
        page_size: pageSize,
        token: userToken,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
       
      },
      success: function (res) {
        if (res.data.code == 0) {


          var schemeListArr = that.data.schemeList;
          var newSchemeListArr = schemeListArr.concat(res.data.data.patients.items)



          if (res.data.data.patients.items.length == 0) {
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
        var addTime, realname, tel
        for (var i = 0; i < that.data.schemeList.length; i++) {
          addTime = that.data.schemeList[i].addTime
          realname = that.data.schemeList[i].realname
          tel = that.data.schemeList[i].tel
          that.data.schemeList[i].tel = tel.slice(0, 11)
          that.data.schemeList[i].realname = realname.slice(0, 4)
          that.data.schemeList[i].addTime = that.dateChange(addTime)
        }
        // console.log(that.data.schemeList)
        that.setData({
          schemeList: that.data.schemeList,
        })
      }
    })
  },

  remarkUrl: function (e) {
    var patientId = e.currentTarget.dataset.patientid;
    wx.navigateTo({
      url: "../remarkHos/remarkHos?patientId=" + patientId,
    })

  },
  makesure:function(e){
    var that=this
    var patientId = e.currentTarget.dataset.id;
    console.log(patientId)
    wx.request({
      url: 'https://www.njshangka.com/zaylt/c/h/e/patientinfo/confirm',
      method: 'post',
      data: {
        token: that.data.userToken,
        patient_id: patientId,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",

      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '接收成功',
          })

        } else if (res.data.code == 20 || res.data.code == 26) {
          wx.hideToast()
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })

  },
  // 到底加载
  onReachBottom: function () {
    var that = this
    var toPageNo = that.data.toPageNo
    that.nextPage(toPageNo)
  },
  //下拉刷新
  onPullDownRefresh: function () {

    this.setData({ flag: false })
    wx.stopPullDownRefresh()
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
 
 


  /**
* 用户点击右上角分享
*/
  onShareAppMessage: function () {
    var that = this
    return {
      title: '忠安医联体小程序',
      path: 'pages/logs/logs',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  dateChange: function (data) {
    var date = new Date(data)
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },
})