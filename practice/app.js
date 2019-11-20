//app.js
require("sdk/libs/strophe");
let WebIM = require("utils/WebIM")["default"];
let msgStorage = require("comps/chat/msgstorage");
let msgType = require("comps/chat/msgtype");
let ToastPannel = require("./comps/toast/toast");
let disp = require("utils/broadcast");
let logout = false;

function ack(receiveMsg) {
  // 处理未读消息回执
  var bodyId = receiveMsg.id; // 需要发送已读回执的消息id
  var ackMsg = new WebIM.message("read", WebIM.conn.getUniqueId());
  ackMsg.set({
    id: bodyId,
    to: receiveMsg.from
  });
  WebIM.conn.send(ackMsg.body);
}

function onMessageError(err) {
  if (err.type === "error") {
    wx.showToast({
      title: err.errorText
    });
    return false;
  }
  return true;
}

function getCurrentRoute() {
  let pages = getCurrentPages();
  let currentPage = pages[pages.length - 1];
  return currentPage.route;
}

function calcUnReadSpot(message) {
  let myName = wx.getStorageSync("myUsername");
  let members = wx.getStorageSync("member") || []; //好友
  var listGroups = wx.getStorageSync('listGroup') || []; //群组
  let allMembers = members.concat(listGroups)
  let count = allMembers.reduce(function(result, curMember, idx) {
    let chatMsgs;
    if (curMember.roomId) {
      chatMsgs = wx.getStorageSync(curMember.roomId + myName.toLowerCase()) || [];
    } else {
      chatMsgs = wx.getStorageSync(curMember.name.toLowerCase() + myName.toLowerCase()) || [];
    }
    return result + chatMsgs.length;
  }, 0);
  getApp().globalData.unReadMessageNum = count;
  disp.fire("em.xmpp.unreadspot", message);
}
import {
  hexMD5
} from "./utils/md5.js"


if (wx.getStorageSync('user').mobile) {
  var password = hexMD5("#meibo#acefk" + hexMD5(wx.getStorageSync('user').mobile))
  let options = {
    apiUrl: WebIM.config.apiURL,
    user: wx.getStorageSync('user').mobile + '',
    pwd: password + '',
    appKey: WebIM.config.appkey
  };
  wx.setStorage({
    key: "myUsername",
    data: wx.getStorageSync('user').mobile
  });
  WebIM.conn.open(options);
}

App({
  ToastPannel,
  data: {
    img_listData: [],
  },
  conn: {
    closed: false,
    curOpenOpt: {},
    open(opt) {
      wx.showLoading({
        title: '正在初始化客户端...',
        mask: true
      })
      this.curOpenOpt = opt;
      WebIM.conn.open(opt);
      this.closed = false;
    },
    reopen() {
      if (this.closed) {
        //this.open(this.curOpenOpt);
        WebIM.conn.open(this.curOpenOpt);
        this.closed = false;
      }
    }
  },
  onLaunch: function(ops) {
  
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 
    disp.on("em.main.ready", function() {
      calcUnReadSpot();
    });
    disp.on("em.chatroom.leave", function() {
      calcUnReadSpot();
    });
    disp.on("em.chat.session.remove", function() {
      calcUnReadSpot();
    });
    disp.on('em.chat.audio.fileLoaded', function() {
      calcUnReadSpot()
    });

    disp.on('em.main.deleteFriend', function() {
      calcUnReadSpot()
    });
    disp.on('em.chat.audio.fileLoaded', function() {
      calcUnReadSpot()
    });
    //监听未读消息数
    disp.on("em.xmpp.unreadspot", function(message) {


    });
    WebIM.conn.listen({
      onOpened(message) {
        WebIM.conn.setPresence();
        if (getCurrentRoute() == "pages/login/login" || getCurrentRoute() == "pages/login_token/login_token") {
          me.onLoginSuccess(wx.getStorageSync("myUsername").toLowerCase());
        }
      },
      onRoster(message) {
        let pages = getCurrentPages();
        if (pages[0]) {
          pages[0].onShow();
        }
      },
      onVideoMessage(message) {
        console.log("onVideoMessage: ", message);
        if (message) {
          msgStorage.saveReceiveMsg(message, msgType.VIDEO);
        }
        calcUnReadSpot(message);
        ack(message);
      },
      onPresence(message) {
        // console.log("onPresence", message);
        switch (message.type) {
          // 好友列表
          case "subscribed":
            let newFriendList = [];
            for (let i = 0; i < me.globalData.saveFriendList.length; i++) {
              if (me.globalData.saveFriendList[i].from != message.from) {
                newFriendList.push(me.globalData.saveFriendList[i]);
              }
            }
            me.globalData.saveFriendList = newFriendList;
            break;
          default:
            break;
        }
      },
      onTextMessage(message) {
        console.log("onTextMessage", message);
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.TEXT);
          }
          calcUnReadSpot(message);
          ack(message);
        }
      },
      onEmojiMessage(message) {
        console.log("onEmojiMessage", message);
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.EMOJI);
          }
          calcUnReadSpot(message);
          ack(message);
        }
      },

      onPictureMessage(message) {
        console.log("onPictureMessage", message);
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.IMAGE);
          }
          calcUnReadSpot(message);
          ack(message);
        }
      },

      onFileMessage(message) {
        console.log('onFileMessage', message);
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.FILE);
          }
          calcUnReadSpot(message);
          ack(message);
        }
      },

    })

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     wx.request({
    //       // 自行补上自己的 APPID 和 SECRET
    //       url: this.globalData.url + 'get-mini-info',
    //       data: {
    //         code: res.code
    //       },
    //       success: res => {
    //         wx.setStorage({
    //           key: "openid",
    //           data: res.data.data
    //         })
    //         // 微信登录
    //         wx.request({
    //           url: this.globalData.url + 'login',
    //           method: 'post',
    //           data: {
    //             openid: res.data.data.unionid,
    //             type: 3
    //           },
    //           success: result => {
    //             if (result.data.code == 10000) {
    //               this.globalData.isMobile = false
    //               wx.setStorage({
    //                 key: "user",
    //                 data: result.data.data
    //               })
    //             }
    //             if (result.data.code == 40002) {
    //               this.globalData.isMobile = true
    //             }
    //           }
    //         })
    //       }
    //     })
    //   }
    // })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.globalData.isHide = false
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          this.globalData.isHide = true
        }
      }
    })

  },
  // 登录
  goLogin() {
    // 登录
    wx.showLoading({
      title: '正在登录',
    })
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          // 自行补上自己的 APPID 和 SECRET
          url: this.globalData.url + 'get-mini-info',
          data: {
            code: res.code
          },
          success: res => {
            wx.setStorage({
              key: "openid",
              data: res.data.data
            })
            // 微信登录
            wx.request({
              url: this.globalData.url + 'login',
              method: 'post',
              data: {
                openid: res.data.data.unionid,
                type: 3
              },
              success: result => {
                wx.hideLoading()
                if (result.data.code == 10000) {
                  
                  wx.showToast({
                    title: result.data.message,
                    icon:'none'
                  })
                  this.globalData.isTankuang = false
                  this.globalData.isMobile = false
                  wx.setStorage({
                    key: "user",
                    data: result.data.data
                  })
                  
                }
                if (result.data.code == 40002) {
                  // wx.showToast({
                  //   title: '手机号未绑定',
                  //   icon: 'none',
                  //   success(){
                  //     setTimeout(function () {
                  //       wx.navigateTo({
                  //         url: '/pages/mobileBind/mobileBind',
                  //       })
                  //     }, 1500)
                  //   }
                  // })
                  wx.showModal({
                    content: '为了您的账号安全，请先绑定手机号码',
                    success(res){
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '/pages/mobileBind/mobileBind',
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                  
                }
              }
            })
          }
        })
      }
    })
  },
  // 获取购物车数量
  getcartnum() {
    wx.request({
      url: this.globalData.url + 'cart/cart-num', //仅为示例，并非真实的接口地址
      method: 'get',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Bearer ' + wx.getStorageSync('user').access_token
      },
      success: function(res) {
        if (res.data.code == 40000) {}
        if (res.data.code == 10000) {
          if (res.data.data.num !== 0) {
            // 设置购物车小红点
            wx.setTabBarBadge({
              index: 2,
              text: res.data.data.num + ''
            });
          }else{
            wx.removeTabBarBadge({
              index: 2
            })
          }
        }



      }
    });
  },
  onShow: function() {
    var that = this;
    this.getcartnum()
    wx.checkSession({
      success(res) {
        
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail(res) {
     
        // session_key 已经失效，需要重新执行登录流程
        // that.goLogin() //重新登录
      }
    })
  },
  globalData: {
    userInfo: null,
    unReadMessageNum: 0,
    saveFriendList: [],
    saveGroupInvitedList: [],
    url: "https://api.meibohate.com/api/",
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    isHide: false,
    isMobile: false,
    isTankuang:false
  }
})