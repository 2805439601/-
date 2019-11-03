"use strict";
//验证是否正在执行
var isAction = false;
//记录最后的下标
var drawLastIndex = 0;
/**
 * 九宫格抽奖
 */
var moduleDraw = /** @class */ (function () {
    /* 构造函数 */
    function moduleDraw(param) {
        //配置参数
        this.config = {
            el: '',
            childNode: '',
            order: [0, 1, 2, 5, 8, 7, 6, 3],
            activeClass: '',
            prizeIndex: '',
            circle: 10,
            isRand: false,
            time: 5,
            speed: 50,
        };
        //抽奖元素
        this.childNodes = [];
        //参数验证
        if (this.check(param)) {
            //初始化
            this.init();
        }
    }
    /* 初始化 */
    moduleDraw.prototype.init = function () {
        //保存抽奖元素
        var childs;
        //获取元素
        if (this.config.childNode) {
            childs = document.querySelectorAll(this.config.childNode);
        }
        else {
            if (this.config.el)
                childs = document.querySelector(this.config.el).children;
        }
        if (!childs || !childs.length) {
            console.error('Error：抽奖元素获取失败');
            return;
        }
        //保存抽奖子元素
        this.childNodes = childs;
    };
    /**
     * 抽奖函数
     * @param draw_index 抽中的下标
     * @param drawEnd 抽奖结束回调
     */
    moduleDraw.prototype.action = function (draw_index, drawEnd) {
        var _this = this;
        if (this.childNodes.length <= 0) {
            console.error('Error：抽奖元素获取失败');
            return;
        }
        if (draw_index + '' == '' || draw_index > this.config.order.length) {
            console.error('Error：缺少中奖下标或者参数有误');
            return;
        }
        draw_index--;
        //判断是否正在抽奖
        if (isAction) {
            return;
        }
        //禁止抽奖
        isAction = true;
        //判断是否随机抽奖
        if (this.config.isRand) {
            //结束时间
            var endTime_1 = new Date().getTime() + parseInt((isNaN(this.config.time) ? 5 : this.config.time) + '000');
            //执行抽奖
            var timer_1 = setInterval(function () {
                //随机下标
                var rand = parseInt(Math.random() * _this.config.order.length);
                //当前时间
                var time = new Date().getTime();
                //抽奖
                _this._draw(rand);
                //抽奖结束
                if (parseInt(time) >= parseInt(endTime_1)) {
                    _this._draw(draw_index);
                    //允许抽奖
                    isAction = false;
                    //清除定时器
                    clearInterval(timer_1);
                    //执行回调
                    setTimeout(function () {
                        if (drawEnd && typeof drawEnd == 'function')
                            drawEnd(draw_index + 1);
                    }, 100);
                    return;
                }
            }, this.config.speed);
        }
        else {
            //保存圈数
            var circle_1 = 0;
            //执行的下标
            var index_1 = drawLastIndex == 0 ? 1 : drawLastIndex;
            //执行抽奖
            var timer_2 = setInterval(function () {
                //抽奖结束
                if (circle_1 > _this.config.circle && index_1 > draw_index + 1) {
                    //保存最后结果的下标
                    drawLastIndex = index_1;
                    //允许抽奖
                    isAction = false;
                    //清除定时器
                    clearInterval(timer_2);
                    //执行回调
                    setTimeout(function () {
                        if (drawEnd && typeof drawEnd == 'function')
                            drawEnd(draw_index + 1);
                    }, 100);
                    return;
                }
                //判断是否跑完一圈
                if (index_1 > _this.config.order.length) {
                    //圈数 + 1
                    circle_1++;
                    //重置下标
                    index_1 = 1;
                }
                //抽奖
                _this._draw(index_1);
                //下标+1
                index_1++;
            }, this.config.speed);
        }
    };
    /* 抽奖结果延迟选中 */
    moduleDraw.prototype.endDelay = function () {
    };
    /* 参数验证 */
    moduleDraw.prototype.check = function (config) {
        if (!config) {
            console.error('Error：缺少参数');
        }
        //赋值
        for (var name_1 in this.config) {
            this.config[name_1] = config[name_1] || this.config[name_1];
        }
        //保存错误信息
        var errorMsg = [];
        //选中样式
        if (!this.config.activeClass)
            errorMsg.push('缺少选中样式参数');
        //输出错误
        if (errorMsg.length) {
            console.error("Error\uFF1A" + errorMsg.join(','));
            return false;
        }
        return true;
    };
    /**
     * 执行抽奖
     * @param index 下标
     */
    moduleDraw.prototype._draw = function (index) {
        //排他
        for (var _i = 0, _a = this.childNodes; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.getAttribute('class')) {
                //正则
                var reg = new RegExp(this.config.activeClass, "g");
                //替换选中的类名
                var childClass = item.getAttribute('class').replace(reg, ' ');
                //添加类名
                item.setAttribute('class', childClass);
            }
        }
        //添加选中类
        this.childNodes[this.config.order[index - (this.config.isRand ? 0 : 1)]].setAttribute('class', (this.childNodes[this.config.order[index - (this.config.isRand ? 0 : 1)]].getAttribute('class') || '') + " " + this.config.activeClass);
    };
    return moduleDraw;
}());
