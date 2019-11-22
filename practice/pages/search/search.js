// pages/search/search.js

var url = getApp().globalData.url;
var searchArray = [];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchTxt: '',
        history: [],
        isHide: false

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(this.data.inputShowed)
        var that = this
        if (wx.getStorageSync("history")) {
            that.setData({
                history: wx.getStorageSync("history").reverse(),
                isHide: true
            })
        } else {
            that.setData({
                history: [],
                isHide: false
            })
        }
    },

    //输入框输入事件
    input_txt: function(e) {
        var that = this;
        // 是用于异步,比如网络请求  this.data 同步
        that.setData({
            searchTxt: e.detail.value.trim()
        })
    },
    //搜索确认事件
    btn_search: function() {
        var that = this;
        if (that.data.searchTxt == "") {
            wx.showToast({
                title: '商品名不为空',
                icon: 'none',
                duration: 1000
            })
            return;
        }

        wx.navigateTo({
            url: '../shop_list/shop_list?keyword=' + that.data.searchTxt
        })

        //调用历史记录事件
        that.buildHistory(that.data.searchTxt)

        // console.log(that.data.searchTxt);

        // 搜索时同时把数据记录到记录框
        this.onLoad()


    },


    //建立搜索记录
    buildHistory: function(e) {
        if (wx.getStorageSync("history").length > 0 && wx.getStorageSync("history").length < 8) { //小于指定数量之内
            // 返回历史数据在数据中首次出现的位置。
            let index = wx.getStorageSync("history").indexOf(e)
            if (index < 0) { //数据不存在时直接追加
                searchArray = wx.getStorageSync("history").concat(e)
                wx.setStorageSync("history", searchArray)
            } else { //数据已存在时调到头部
                searchArray = wx.getStorageSync("history")
                searchArray.splice(index, 1)
                searchArray = searchArray.concat(e);
                wx.setStorageSync("history", searchArray)
            }
        } else if (wx.getStorageSync("history").length >= 8) { //大于指定数量
            let index1 = wx.getStorageSync("history").indexOf(e)
            if (index1 > -1) { //数据已存在时掉到头部
                searchArray = wx.getStorageSync("history")
                searchArray.splice(index1, 1)
                searchArray = searchArray.concat(e);
                wx.setStorageSync("history", searchArray)
                return;
            }
            //数据不存在时删除第一个后追加
            searchArray = wx.getStorageSync("history")
            searchArray.splice(0, 1)
            searchArray = searchArray.concat(e);
            wx.setStorageSync("history", searchArray)
        } else { //无数据时候直接追加
            searchArray = searchArray.concat(e)
            wx.setStorageSync("history", searchArray)
        }
        // console.log(e);
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})