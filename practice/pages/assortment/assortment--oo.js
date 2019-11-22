// pages/assortment/assortment.js

var url = getApp().globalData.url;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isBg: false,
        assortmentList: {},
        rightData: [],
        // 初始化
        ind: 0,
        id: 0,
        items: [],
        data: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getAssortmentData()
            // this.getIndex()
    },
    //获取分类数据
    getAssortmentData: function() {
        let that = this
        wx.request({
            url: url + 'product/product-category', //仅为示例，并非真实的接口地址
            header: {
                'content-type': 'application/json' // 默认值
            },
            data: {
                method: "miniapp",
            },
            method: "POST",

            success: function(res) {
                console.log(res.data.data);
                // console.log(that.assortmentList[that.ind].items)
                // console.log(res.data.data.parent_id[items]);
                that.setData({
                    assortmentList: res.data.data,
                    // 初始化右边的数据
                    // rightData: res.data.data[that.data.ind].items
                    // rightData: res.data.data[that.ind].items
                    // rightData: res.data.data.parent_id[items]
                })

            }
        })

    },
    // 左边传参给右边数据
    getIndex: function(e) {
        let that = this
            // console.log(e.currentTarget.dataset.id)

        console.log(e.currentTarget.dataset.items)

        // console.log(that.assortmentList[index].items);
        // console.log(this.data[e.currentTarget.dataset.id].items);

        this.setData({
            ind: e.currentTarget.dataset.index,
            id: e.currentTarget.dataset.id,
            // rightData: e.currentTarget.dataset.items
            // rightData: res.data.data[that.data.ind].items

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
    },
})