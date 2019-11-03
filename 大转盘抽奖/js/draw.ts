//判断是否进行旋转
let d_isRotate:Boolean = false;
/**
 * 大转盘抽奖类
 */
class Draw
{
    //配置参数
    private config:any = 
    {
        el:'', /* 旋转元素 */
        isOuter:false, /* 外层旋转 */ 
        transition:'1', /* 过渡时间 */
        w_index:'', /* 旋转中奖的商品下标 */
        count:'', /* 商品数量 */
        avgAngle:360, /* 旋转的角度 */  
        circle:10, /* 默认需要旋转的圈数 */
        deviation: '', /* 偏移值（角度） */
    }  
    //保存元素
    public element:any;
    //保存参数
    public param:any;
    //回调参数
    public callParam:any;
    //构造函数
    constructor(param:any)
    {
        //保存参数
        this.param = <Object>param
        //验证参数
        let check = <Boolean>this._draw_check()
        //初始化
        if(check)
        {
            this.draw_init()
        }
    }
    //初始化
    public draw_init():void
    {
        //判断是否正在进行旋转  
        if(d_isRotate) return
        //进行旋转
        d_isRotate = true;
    }
    //抽奖旋转
    public draw_romate(index:number,callback:any)
    {
        //保存旋转元素
        this.element = <any> document.querySelector(this.config.el);
        //设置元素过渡
        this.element.style = `transition: all ${this.config.transition}s;`;
        //中奖下标
        this.config.w_index = index - 1
        //保存回调参数下标
        this.callParam = this.config.w_index + 1
        //保存对象
        let _this = this;
        //偏移值
        let deviation = <Number> this.config.deviation ? parseInt(this.config.deviation) : 0
        //旋转角度
        let avg = <any> (this.config.avgAngle / parseInt(this.config.count));
        //外层旋转（商品数 - 中奖下标）
        if(this.config.isOuter) this.config.w_index = <number> parseInt(this.config.count) - parseInt(this.config.w_index) - 1;
        //默认圈数 + 旋转角度
        let rotate = <Number> (avg * ( parseInt(this.config.w_index)) + (360 * this.config.circle) + deviation) ;
        //旋转元素
        setTimeout(() => {
            this.element.style = `${this.element.style.cssText};transform:rotate(${rotate}deg)`
        },100)
        //绑定过渡事件
        this.element.addEventListener('transitionend',function(event:any){
            _this.draw_callBack(avg,deviation,callback)
        },false)
    }
    /**
     * 回调函数
     * @param avg 角度
     * @param deviation 偏移值
     */
    private draw_callBack(avg:any,deviation:any,callback:any)
    {
        //旋转完成
        d_isRotate = <Boolean> false;
        //克隆元素
        let clone = <any> document.querySelector(this.config.el).cloneNode();
        //父元素
        let parentEl = <any> this.element.parentElement;
        //计算元素角度
        let resetAvg = <number> avg * ( parseInt(this.config.w_index)) + (360 + deviation);
        //重置元素角度（可多次抽奖）
        clone.style = <String> `transition: '';transform:rotate(${resetAvg}deg)`
        //替换节点（相当于更新节点，防止重复绑定事件）
        parentEl.replaceChild(clone,this.element)
        //执行回调
        if(callback && typeof callback == 'function') callback(this.callParam) as void
    }
    //参数验证
    private _draw_check():Boolean
    {
        if(!this.param)
        {
            console.error('Error：缺少参数') ;
            return false;
        } 
        //保存错误信息
        let errorMsg:Array<String> = [];
        //参数赋值
        for(let name in this.config)
        {   
            this.config[name] = this.param[name] || this.config[name]
        }
        //旋转元素验证
        if(!this.config.el)
        {
            errorMsg.push('缺少旋转元素');
        } 
        //商品数量
        if(!this.config.count)
        {
            errorMsg.push('缺少商品数量');
        }
        //输出错误
        if(errorMsg.length)
        {
            console.error(`Error：${errorMsg.join('，')}`)
            return false
        }
        return true
    }
}