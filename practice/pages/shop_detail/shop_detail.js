var url = getApp().globalData.url;
// 先定义为空，以方便 商品列表页面传参
var _options = '';
var WxParse = require('../wxParse/wxParse.js');
var str = '<img src="';
var p = "p>"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        soldout: true,
        tankuang: false,
        shop: [],
        detail: [],
        homeList: [],
        Data: {},
        data_id: "",
        shop_id: '',
        data_uid: "",
        bis_data: {},
        token: '',
        stu: "0",
        addressInfo: {},
        nodes: "",
        indicatorDots: true,
        autoplay: true,
        interval: 4000,
        duration: 500,
        isCollect: false,
        flag: 0,
        num: 1,
        showfilter: false,
        currentIndex: -1,
        navIndex: 0,
        navTop: false,
        navlist: [{
                'type': '1',
                'type_name': '现货'
            },
            // {
            //   'type': '2',
            //   'type_name': '订货'
            // },
            // {
            //   'type': '3',
            //   'type_name': '定制'
            // },
            // {
            //   'type': '4',
            //   'type_name': '成品加工'
            // }
        ],
        logistics: [{
                'type': '1',
                'type_name': '门店自取'
            },
            {
                'type': '2',
                'type_name': '快递配送'
            }
        ],
        shopping_type: '1',
        checkstore: [],
        stock: '',
        product_attr_key: '',
        logType: '',
        addrShow: false,
        storecheck: false,
        logistics: '',
        sku: {},
        skuList: {},
        selectArr: [], //存放被选中的值
        shopItemInfo: {}, //存放要和选中的值进行匹配的数据
        subIndex: [], //是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
        // shopCheckInfo: {}, //存放选好规格的数据
        selectItem: [],
        gwcnum: 0,
        textWidth: null

    },
    // 切换导航栏
    getNav(e) {
        var that = this;
        that.setData({
            navIndex: e.currentTarget.dataset.idx,
            shopping_type: e.currentTarget.dataset.type
        })
        that.onLoad(_options)

    },
    // 到店自取
    storeCheck: function(e) {
        var obj = e.currentTarget.dataset;
        wx.navigateTo({
            url: "/pages/store_check/store_check?id=" + obj.id
        });
    },
    // 返回首页
    fhsy() {
        wx.switchTab({
            url: "/pages/home/home"
        });
    },
    // 获取购物车数量
    getcartnum() {
        var that = this
        wx.request({
            url: url + 'cart/cart-num', //仅为示例，并非真实的接口地址
            method: 'get',
            header: {
                'content-type': 'application/json', // 默认值
                'Authorization': 'Bearer ' + wx.getStorageSync('user').access_token
            },
            success: function(res) {
                // console.log(res)
                if (res.data.code == 10000) {
                    that.setData({
                        gwcnum: res.data.data.num
                    })
                }
                if (res.data.code == 40000) {
                    that.setData({
                        tankuang: false
                    })
                }

            }
        });
    },
    // 输入框输入数量
    bindKeyInput: function(e) {
        // console.log(e)
        var that = this;
        var text_length = e.detail.value.length; //获取当前文本框的长度
        var current_width = parseInt(text_length) * 16; //该16是改变前的宽度除以当前字符串的长度,算出每个字符的长度

        if (76 > current_width) {
            current_width = 100
        }
        if (76 < current_width) {
            current_width = 144
        }
        // console.log(current_width)
        that.setData({
            num: e.detail.value,
            textWidth: current_width
        })
        that.checkItem();
    },
    /* 点击减号 */
    bindMinus: function() {
        var that = this;
        that.checkItem();
        var num = this.data.num;
        // 如果大于1时，才可以减
        if (num > 1) {
            num--;
        }
        // 将数值与状态写回
        that.setData({
            num: num,
        });

    },
    bindPlus: function() {
        var that = this;
        that.checkItem();
        var num = this.data.num;
        // 不作过多考虑自增1
        num++;
        // 将数值与状态写回
        that.setData({
            num: num,
        });
    },
    specificationBtn(e) {
        var obj = e.currentTarget.dataset
        var self = this;


        if (self.data.selectArr[obj.idx] != obj.item.id) {
            self.data.selectArr[obj.idx] = obj.item.id;
            self.data.subIndex[obj.idx] = obj.index;
            self.data.selectItem[obj.idx] = obj.item;
        } else {
            self.data.selectArr[obj.idx] = "";
            self.data.subIndex[obj.idx] = -1; //去掉选中的颜色 
            self.data.selectItem[obj.idx] = "";
        }
        // console.log(self.data.selectItem)


        self.setData({
            subIndex: self.data.subIndex,
            selectArr: self.data.selectArr,
            selectItem: self.data.selectItem
        })
        self.checkItem();
    },
    checkItem: function() {
        var self = this;
        var option = self.data.skuList.attrs;
        var result = []; //定义数组存储被选中的值
        // console.log(JSON.parse(JSON.stringify(self.selectArr)))
        for (var i in option) {
            result[i] = self.data.selectArr[i] ? self.data.selectArr[i] : '';
        }
        for (var i in option) {
            var last = result[i]; //把选中的值存放到字符串last去
            for (var k in option[i].attr_value) {
                result[i] = option[i].attr_value[k].id; //赋值，存在直接覆盖，不存在往里面添加name值
                option[i].attr_value[k].isShow = self.isMay(result); //在数据里面添加字段isShow来判断是否可以选择
            }

            result[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时避免被覆盖
        }

        // console.log(option)
        // console.log(self.data.shopItemInfo[JSON.parse(JSON.stringify(self.data.selectArr))])
        if (self.data.shopItemInfo[JSON.parse(JSON.stringify(self.data.selectArr))] == undefined) {

        } else {
            self.data.shopCheckInfo = self.data.shopItemInfo[JSON.parse(JSON.stringify(self.data.selectArr))]
            self.data.detail.stock = self.data.shopCheckInfo.stock
            self.data.product_attr_key = self.data.shopCheckInfo.id
        }
        // console.log(self.data.shopCheckInfo)
        self.setData({
                shopCheckInfo: self.data.shopCheckInfo,
                product_attr_key: self.data.product_attr_key,
                sku: option
            })
            // self.onLoad(); //重绘
    },
    isMay: function(result) {
        // console.log(result)
        var that = this;
        for (var i in result) {
            if (result[i] === '') {
                return true; //如果数组里有为空的值，那直接返回true
            }
        }
        // console.log(that.shopItemInfo[result].stock)
        return this.data.shopItemInfo[result] && Number(this.data.shopItemInfo[result].stock) !== 0 // 匹配选中的数据的库存，若不为空返回true反之返回false
            // return self.shopItemInfo[result].stock == 0 ? false : true; //匹配选中的数据的库存，若不为空返回true反之返回false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _options = options
            // console.log(options);
        var that = this
        that.getStatus(options.id)
        that.setData({
            shop_id: options.id
        })

        // 获取猜我喜欢
        // 首页推荐(猜我喜欢)
        wx.request({
            url: url + 'recommended/home',
            header: {
                'content-type': 'application/json' // 默认值
            },
            data: {
                type: 'product',
                method: "miniapp"
            },
            success: function(res) {
                that.setData({
                    homeList: res.data.data
                })
            }
        })

        // 获取商品详情
        wx.request({
            url: url + 'product/details',
            data: {
                product_id: options.id,
                // 用户id
                user_id: wx.getStorageSync('user').user_id
            },
            method: 'post',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (res.data.code == 40004) {
                    that.setData({
                        soldout: false
                    })
                    return
                }

                // console.log(res.data.data.spec.attr_list)
                that.setData({
                    detail: res.data.data,
                    skuList: res.data.data.spec.attr_list,
                    num: res.data.data.show_price.start_num,
                    minnum: res.data.data.show_price.start_num
                })
                for (var i in that.data.skuList.list) {
                    that.data.shopItemInfo[that.data.skuList.list[i].id.replace(/_/g, ',')] = that.data.skuList.list[i]; //修改数据结构格式，改成键值对的方式，以方便和选中之后的值进行匹配
                }

                // console.log(that.data.shopItemInfo)
                that.setData({
                    shopItemInfo: that.data.shopItemInfo
                })
                that.checkItem()
            }
        })
        this.getcartnum()
    },
    // 加入购物车
    titleClick(e) {
        var flag = e.currentTarget.dataset.flag;
        this.setData({
            flag: flag,
            showfilter: true,
        });
    },
    hideFilter: function() { //关闭筛选面板
        this.setData({
            showfilter: false,
        })
    },
    // 加入购物车与立即购买
    addcart(e) {
        // console.log(this.data.flag)
        var that = this;
        if (that.data.logistics == '') {
            wx.showToast({
                title: '请选择收货方式',
                icon: 'none'
            })
            return
        }
        if (this.data.flag == 1) {
            wx.request({
                url: url + 'cart/add',
                data: {
                    product_id: e.currentTarget.dataset.id,
                    shopping_type: that.data.shopping_type,
                    logistics: that.data.logistics,
                    product_num: that.data.num,
                    product_attr_key: that.data.product_attr_key,
                    store_id: that.data.checkstore.id,
                    product_price: '',
                    logistics_price: ''
                },
                method: 'post',
                header: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + wx.getStorageSync('user').access_token
                },
                success: function(res) {
                    // console.log(res)
                    // wx.showToast({
                    //   title: res.data.message,
                    //   icon:'none'
                    // })
                    if (res.data.code == 40000) {
                        that.setData({
                            tankuang: true
                        })
                    }
                    if (res.data.code == 20001 || res.data.code == 40001) {
                        return
                    }
                    if (res.data.code == 10000) {
                        that.getcartnum()
                        that.setData({
                            showfilter: false
                        })
                    } else {

                    }
                }
            })
        } else {
            wx.request({
                url: url + 'cart/buy-now',
                data: {
                    product_id: e.currentTarget.dataset.id,
                    shopping_type: that.data.shopping_type,
                    logistics: that.data.logistics,
                    product_num: that.data.num,
                    attr_key: that.data.product_attr_key,
                    store_id: that.data.checkstore.id,
                    product_price: '',
                    logistics_price: ''
                },
                method: 'post',
                header: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + wx.getStorageSync('user').access_token
                },
                success: function(res) {
                    // console.log(res)
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none'
                    })
                    if (res.data.code == 40000) {
                        that.setData({
                            tankuang: true
                        })
                    }
                    if (res.data.code == 20001 || res.data.code == 40001 || res.data.code == 40000) {
                        return
                    }
                    if (res.data.code == 10000) {
                        that.setData({
                            tankuang: false
                        })
                    }
                    var order = res.data.data
                    wx.navigateTo({
                        url: '/pages/order_confirmNow/order_confirmNow',
                        events: {
                            // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                            acceptDataFromOpenedPage: function(data) {
                                // console.log(data)
                            },
                            someEvent: function(data) {
                                // console.log(data)
                            }
                        },
                        success: function(res) {
                            // 通过eventChannel向被打开页面传送数据
                            res.eventChannel.emit('acceptDataFromOpenerPage', {
                                data: order,
                                product_id: e.currentTarget.dataset.id
                            })
                        }
                    })

                }
            })
        }
    },
    // 选择门店
    getLog(e) {
        var that = this;
        var obj = e.currentTarget.dataset;
        // console.log(obj)
        if (obj.type == 1) {
            wx.navigateTo({
                url: "/pages/store_check/store_check?id=" + obj.id
            });
            that.setData({
                storecheck: true,
            })
        } else {
            wx.removeStorageSync('storeCheck')
            that.setData({
                storecheck: false
            })
        }
        that.setData({
            currentIndex: e.currentTarget.dataset.index,
            logistics: obj.type
        })

    },
    // 获取门店列表
    getStorelist() {
        wx.request({
            url: url + 'product/store-list',
            data: {
                product_id: options.id
            },
            method: 'post',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                // console.log(res.data.data)
                that.setData({
                    list: res.data.data
                })

            }
        })
    },
    // 聊天
    service() {
        var that = this;
        wx.request({
            url: url + 'add-im-friends',
            data: {
                friend_mobile: this.data.detail.store.mobile
            },
            method: 'post',
            header: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + wx.getStorageSync('user').access_token
            },
            success: function(res) {
                // console.log(res)
                if (res.data.code == 40000) {
                    wx.showModal({
                        title: '提示',
                        content: '您尚未登录，请先登录！',
                        success(res) {
                            if (res.confirm) {
                                getApp().goLogin()
                                that.onLoad(_options)
                            } else if (res.cancel) {}
                        }
                    })
                } else if (res.data.code == 10000) {
                    var nameList = {
                        myName: wx.getStorageSync('user').mobile + '',
                        your: that.data.detail.store.mobile
                    };
                    wx.navigateTo({
                        url: "../chatroom/chatroom?username=" + JSON.stringify(nameList),
                        events: {
                            // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                            acceptDataFromOpenedPage: function(data) {
                                // console.log(data)
                            },
                            someEvent: function(data) {
                                // console.log(data)
                            }
                        },
                        success: function(res) {
                            // 通过eventChannel向被打开页面传送数据
                            res.eventChannel.emit('acceptDataFromOpenerPage', {
                                data: that.data.detail
                            })
                        }
                    });
                } else if (res.data.code == 400) {
                    wx.showToast({
                        title: '自己不能和自己聊天',
                        icon: 'none'
                    })
                }
            }
        })


    },
    // 进入店铺
    shop_msg: function() {
        wx.navigateTo({
            url: '/pages/shop_msg/shop_msg?id=' + this.data.data_id + '&&uid=' + this.data.data_uid,
        })
    },
    // 登录
    onLogin() {
        var that = this;
        getApp().goLogin()
        that.onLoad(_options)
    },
    // 取消登录
    cancelLogin() {
        var that = this;
        that.setData({
            tankuang: false
        })
    },
    goPay: function() {
        // console.log(this.data.Data)
        var that = this
        var data = []
        var d = {}
        d.product_id = this.data.Data.id
        d.count = 1
        data.push(d)
            // console.log(data)
            // console.log(this.data.token)

        wx.getStorage({
            key: 'editAddress',
            success: function(res) {
                that.setData({
                    addressInfo: res.data
                })
                wx.request({
                    url: url + 'order',
                    method: 'post',
                    header: {
                        'content-type': 'application/json',
                        "token": that.data.token
                    },
                    data: {
                        products: data,
                        address: that.data.addressInfo
                    },
                    success: function(res) {
                        if (res.statusCode == 200) {
                            // console.log(res)
                            wx.setStorage({
                                key: 'odd',
                                data: res.data,
                            })
                            wx.navigateTo({
                                url: '/pages/pay/pay',
                            })
                        }
                    }
                })
            },
            fail: function() {
                wx.showModal({
                    title: '提示',
                    content: '您还没有填写收货地址',
                    success: function(res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '/pages/add/add',
                            })
                        }
                    }
                })

            }
        })
    },
    gwc_: function() {
        wx.switchTab({
            url: '/pages/cart/cart',
        })
    },
    sc: function() {
        var that = this
        wx.request({
            url: url + 'Productmessage/userLoveThisProduct',
            method: 'post',
            data: {
                product: this.data.data_id
            },
            header: {
                'content-type': 'application/json',
                "token": this.data.token
            },
            success: function(res) {
                // 收藏信息
                wx.request({
                    url: url + 'Productmessage/getUserLoveThis',
                    method: 'post',
                    data: {
                        id: that.data.data_id
                    },
                    header: {
                        'content-type': 'application/json',
                        "token": that.data.token
                    },
                    success: function(res) {
                        that.setData({
                            stu: res.data
                        })
                    }
                })
            }
        })
    },
    gwc: function() {
        var that = this
            // 获取购物车对象shopList，如果没有即购物车为空
        wx.getStorage({
            key: 'shop',
            success: function(res) {
                for (var i = 0; i < res.data.length; i++) {
                    if (that.data.Data.id == res.data[i].id) {
                        res.data[i].num++
                            wx.setStorage({
                                key: "shop",
                                data: res.data
                            })
                        break;
                    }
                    if (i == res.data.length - 1) {
                        that.data.Data.num = 1
                        res.data.push(that.data.Data)
                        console.log(that.data.Data)
                        wx.setStorage({
                            key: "shop",
                            data: res.data
                        })
                        break;
                    }
                }
                if (res.data.length == 0) {
                    var gwc_data = []
                    that.data.Data.num = 1
                    gwc_data.push(that.data.Data)
                        // console.log(gwc_data)
                    wx.setStorage({
                        key: "shop",
                        data: gwc_data
                    })
                }
            },
            fail: function(res) {
                // 购物车为空时走这里
                var gwc_data = []
                that.data.Data.num = 1
                gwc_data.push(that.data.Data)
                    // console.log(gwc_data)
                wx.setStorage({
                    key: "shop",
                    data: gwc_data
                })
            }
        })



        wx.showToast({
            title: '成功添加购物车',
            icon: 'succes',
            duration: 1000,
            mask: true
        })
    },
    distribution: function() {
        wx.switchTab({
            url: '/pages/enter/enter',
        })
    },

    // 添加收藏
    collectAdd(e) {
        var that = this;
        var id = e.currentTarget.dataset.id
        wx.request({
            url: url + 'add-product-collect',
            data: { //参数传递
                product_id: id
            },
            method: 'post',
            header: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + wx.getStorageSync('user').access_token
            },
            success: function(res) {
                // console.log(res)
                if (res.data.code == 10000) {
                    wx.showToast({
                        title: '收藏成功',
                        icon: 'none'
                    })
                    that.setData({
                        isCollect: true
                    })
                } else if (res.data.code == 40000) {
                    wx.showModal({
                        title: '提示',
                        content: '您尚未登录，请先登录！',
                        success(res) {
                            if (res.confirm) {
                                getApp().goLogin()
                                that.onLoad(_options)
                            } else if (res.cancel) {}
                        }
                    })
                }
            }
        })
    },

    // 取消收藏
    collectDel(e) {
        var that = this;
        var id = e.currentTarget.dataset.id
        wx.request({
            url: url + 'del-product-collect',
            data: { //参数传递
                product_ids: id
            },
            method: 'post',
            header: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + wx.getStorageSync('user').access_token
            },
            success: function(res) {
                // console.log(res)
                if (res.data.code == 10000) {
                    wx.showToast({
                        title: '取消成功',
                        icon: 'none'
                    })
                    that.setData({
                        isCollect: false
                    })
                }
            }
        })
    },
    // 获取收藏状态
    getStatus(id) {
        var that = this;
        wx.request({
            url: url + 'get-product-collect-status',
            data: { //参数传递
                product_id: id
            },
            method: 'get',
            header: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + wx.getStorageSync('user').access_token
            },
            success: function(res) {
                // console.log(res.data.data.status)
                that.setData({
                    isCollect: res.data.data.status
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
        const self = this;
        // console.log(this.data.checkstore)
        this.getcartnum()
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
    // 监听页面滚动
    onPageScroll(e) {
        if (e.scrollTop >= 393) {
            this.setData({
                navTop: true
            })
        } else {
            this.setData({
                navTop: false
            })
        }
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
        var that = this;
        return {
            title: that.data.detail.title,
            path: '/pages/shop_detail/shop_detail?id=' + that.data.shop_id,
            imageUrl: that.data.detail.image[0],
            success: function(res) {

            }
        }
    }
})