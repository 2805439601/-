"use strict";
//判断是否进行旋转
var d_isRotate = false;
/**
 * 大转盘抽奖类
 */
var Draw = /** @class */ (function () {
    //构造函数
    function Draw(param) {
        //配置参数
        this.config = {
            el: '',
            isOuter: false,
            transition: '1',
            w_index: '',
            count: '',
            avgAngle: 360,
            circle: 10,
            deviation: '',
        };
        //保存参数
        this.param = param;
        //验证参数
        var check = this._draw_check();
        //初始化
        if (check) {
            this.draw_init();
        }
    }
    //初始化
    Draw.prototype.draw_init = function () {
        //判断是否正在进行旋转  
        if (d_isRotate)
            return;
        //进行旋转
        d_isRotate = true;
    };
    //抽奖旋转
    Draw.prototype.draw_romate = function (index, callback) {
        var _this_1 = this;
        //保存旋转元素
        this.element = document.querySelector(this.config.el);
        //设置元素过渡
        this.element.style = "transition: all " + this.config.transition + "s;";
        //中奖下标
        this.config.w_index = index - 1;
        //保存回调参数下标
        this.callParam = this.config.w_index + 1;
        //保存对象
        var _this = this;
        //偏移值
        var deviation = this.config.deviation ? parseInt(this.config.deviation) : 0;
        //旋转角度
        var avg = (this.config.avgAngle / parseInt(this.config.count));
        //外层旋转（商品数 - 中奖下标）
        if (this.config.isOuter)
            this.config.w_index = parseInt(this.config.count) - parseInt(this.config.w_index) - 1;
        //默认圈数 + 旋转角度
        var rotate = (avg * (parseInt(this.config.w_index)) + (360 * this.config.circle) + deviation);
        //旋转元素
        setTimeout(function () {
            _this_1.element.style = _this_1.element.style.cssText + ";transform:rotate(" + rotate + "deg)";
        }, 100);
        //绑定过渡事件
        this.element.addEventListener('transitionend', function (event) {
            _this.draw_callBack(avg, deviation, callback);
        }, false);
    };
    /**
     * 回调函数
     * @param avg 角度
     * @param deviation 偏移值
     */
    Draw.prototype.draw_callBack = function (avg, deviation, callback) {
        //旋转完成
        d_isRotate = false;
        //克隆元素
        var clone = document.querySelector(this.config.el).cloneNode();
        //父元素
        var parentEl = this.element.parentElement;
        //计算元素角度
        var resetAvg = avg * (parseInt(this.config.w_index)) + (360 + deviation);
        //重置元素角度（可多次抽奖）
        clone.style = "transition: '';transform:rotate(" + resetAvg + "deg)";
        //替换节点（相当于更新节点，防止重复绑定事件）
        parentEl.replaceChild(clone, this.element);
        //执行回调
        if (callback && typeof callback == 'function')
            callback(this.callParam);
    };
    //参数验证
    Draw.prototype._draw_check = function () {
        if (!this.param) {
            console.error('Error：缺少参数');
            return false;
        }
        //保存错误信息
        var errorMsg = [];
        //参数赋值
        for (var name_1 in this.config) {
            this.config[name_1] = this.param[name_1] || this.config[name_1];
        }
        //旋转元素验证
        if (!this.config.el) {
            errorMsg.push('缺少旋转元素');
        }
        //商品数量
        if (!this.config.count) {
            errorMsg.push('缺少商品数量');
        }
        //输出错误
        if (errorMsg.length) {
            console.error("Error\uFF1A" + errorMsg.join('，'));
            return false;
        }
        return true;
    };
    return Draw;
}());
