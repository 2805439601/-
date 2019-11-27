// pages/shop_list/shop_list.js
var url = getApp().globalData.url;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentIndex: 0,
        height: 0,
        hiddenLoading: false,

        wxSearchData: '',

        shopList: [],
        list: [],
        page: 1,
        flag: true, //记录是否请求数据的状态
        windowHeight: "", //适配设备的高度
        filtertab: true,
        filterup: false,
        hidden: true,
        category_id: '',
        keyword: '',
        srot: '',
        statusBarHeight: getApp().globalData.statusBarHeight,
        scrolltop: null, //滚动位置
        input_left: 314,
        img_left: 297
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(options.keyword)
        // console.log(options.keyword)
        this.setData({
            category_id: options.id,
            keyword: options.keyword,
            // input框里面的vuale值跟着keyword一起改变
            wxSearchData: options.keyword
        })

        // console.log(this.keyword) undefined
        // console.log(this.wxSearchData)
        // console.log(this);
        if (options.keyword !== undefined) {

            this.setData({
                input_left: 70,
                img_left: 60
            })
        } else {
            this.setData({
                input_left: 314,
                img_left: 297
            })
        }


        this.getData()

        var that = this;
        //获取设备信息，获取屏幕的Height属性
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    windowHeight: res.windowHeight
                })
            }
        })
    },
    // 获取焦点
    inputFocus: function() {
        this.setData({
            input_left: 70,
            img_left: 60
        })
    },
    // 失去焦点
    inputBlur: function(e) {
        // console.log(e)
        var that = this
            // console.log(e.detail.value)
            // console.log(that.data.wxSearchData)
        if (e.detail.value == '') {
            this.setData({
                input_left: 314,
                img_left: 297
            })
        } else if (that.data.wxSearchData !== '') {
            this.setData({
                input_left: 70,
                img_left: 60
            })
        } else {
            this.setData({
                input_left: 70,
                img_left: 60
            })
        }

    },
    // 返回
    back: function() {
        wx.navigateBack({
            delta: 1
        })
    },
    // 点击商品跳转
    goDetail(e) {
        wx.navigateTo({
            url: '/pages/shop_detail/shop_detail?id=' + e.currentTarget.dataset.id,
        })
    },
    /**
     * 监听软键盘确认键
     */
    wxSearchConfirm: function(e) {
        // console.log(e.detail.value)
        this.setData({
            keyword: e.detail.value,
            page: 1,
            list: [],
            sort: '',
            category_id: ''
        })
        if (e.detail.value == '') {
            wx.showToast({
                title: '请输入关键字',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        this.getData();

    },
    //用户点击tab时调用
    titleClick: function(e) {
        const i = e.currentTarget.dataset.idx;
        // console.log(i)
        if (i == 1) {
            this.setData({
                srot: 'sales',
                list: []
            })
        } else if (i == 2) {
            if (this.data.filtertab == false) {
                this.setData({
                    filterup: false,
                    filtertab: true,
                    srot: 'price_desc',
                    list: []
                })
            } else {
                this.setData({
                    filtertab: false,
                    filterup: true,
                    srot: 'price_asc',
                    list: []
                })
            }
        } else {
            this.setData({
                srot: '',
                list: []
            })
        }

        this.setData({
            //拿到当前索引并动态改变
            currentIndex: e.currentTarget.dataset.idx,
            page: 1
        })
        this.getData();

    },
    scrollLoading: function(e) { //滚动加载
        // var that = this;
        // that.getData();
        //根据请求状态flag请求数据
        if (this.data.flag) {
            this.getData();
        }

    },
    topLoad: function(event) {
        //   console.log(event)
        if (event.target.offsetTop > 140) {
            wx.showLoading({
                title: '666',
            })
        }
    },
    scrollHandle: function(e) { //滚动事件
        // this.setData({
        //   scrolltop: e.detail.scrollTop
        // })
    },
    // 获取数据
    getData: function() {
        // console.log(this)
        //打开记录请求的状态flag
        this.setData({
            flag: false
        })
        wx.showLoading({
            title: '数据加载中...',
        });

        var that = this

        wx.request({
            url: url + 'product/list', //仅为示例，并非真实的接口地址
            method: 'post',
            data: {
                keyword: that.data.keyword,
                category_id: that.data.category_id,
                page: that.data.page,
                srot: that.data.srot
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                wx.hideLoading();

                //数据少于20条时，即请求到了最后一页
                if (res.data.data.list.length < 20) {
                    //记录请求状态，把reqState传值给flag
                    var reqState = false;
                } else {
                    var reqState = true;
                }
                //接收数据，保证每次都拼接上
                var list = that.data.list.concat(res.data.data.list);
                // console.log(list)
                //为下一页的请求参数做准备
                var nextPage = ++that.data.page;
                that.setData({
                    list: list,
                    page: nextPage,
                    flag: reqState,
                    hiddenLoading: true
                })
            }

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
    onPullDownRefresh: function(e) {
        console.log(e)
        var that = this;
        that.setData({
            page: 1,
            list: []
        })
        wx.showLoading({
            title: '数据加载中...',
        });
        wx.showNavigationBarLoading() //在标题栏中显示加载
        setTimeout(function() {
            that.getData();
            // 隐藏导航栏loading
            wx.hideNavigationBarLoading()
            wx.hideLoading();
            //停止下拉刷新
            wx.stopPullDownRefresh()

        }, 1500);

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function(e) {
        // console.log(e)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})