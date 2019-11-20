// pages/cart/cart.js

let disp = require("../../utils/broadcast");

var url = getApp().globalData.url;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        upHide: false,
        isBg: false,
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 2000,
        duration: 500,
        categorysList: [], //分类列表
        bannersList: [], //轮播列表
        layoutList: [], //布局列表
        mell: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        // 初始化首页数据
        this.getHomeData()
    },
    // 搜索框跳转
    getfocus: function() {
        wx.navigateTo({
            url: '/pages/search/search',
        })
    },
    // 获取首页数据
    getHomeData: function() {
        var that = this
        wx.request({
            url: url + 'home/index', //仅为示例，并非真实的接口地址
            header: {
                'content-type': 'application/json' // 默认值
            },
            data: {
                method: "miniapp"
            },
            success: function(res) {
                var categorysList = res.data.data.categorys
                var bannersList = res.data.data.banners
                var mell = res.data.data.mell
                var layoutList = res.data.data.layout
                console.log(res)
                    // setData 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）。
                that.setData({
                    categorysList: categorysList,
                    bannersList: bannersList,
                    layoutList: layoutList,
                    mell: mell,
                    // hiddenLoading: true
                })
            }
        })
    },
    // 跳到对应的详情页
    goDetail(e) {
        wx.navigateTo({
            // url: '../shop_detail/shop_detail?id=' + e.currentTarget.dataset.id
        })
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

    },
    // 监听页面滚动事件
    onPageScroll: function(e) {
        // if (e.scrollTop > 600) {
        //     this.setData({
        //         upHide: true
        //     })
        // } else {
        //     this.setData({
        //         upHide: false
        //     })
        // }
        if (e.scrollTop > 70) {
            this.setData({
                isBg: true
            })
        } else {
            this.setData({
                isBg: false
            })
        }
        console.log(1);


    },
})