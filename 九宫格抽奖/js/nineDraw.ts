//验证是否正在执行
let isAction:boolean = false;
//记录最后的下标
let drawLastIndex:number = 0;
/**
 * 九宫格抽奖
 */
class moduleDraw
{
    //配置参数
    private config:any = {
        el:'', /* 父元素 */
        childNode:'', /* 子元素（类名）*/
        order:[0,1,2,5,8,7,6,3], /* 执行的顺序 */
        activeClass:'', /* 选中的类名 */
        prizeIndex:'', /* 中奖下标 */
        circle:10, /* 旋转圈数 */
        isRand:false, /* 是否随机抽奖 */
        time:5, /* 随机抽奖时间参数 */
        speed:50, /* 速度 */
    }
    //抽奖元素
    public childNodes:any = [];
    /* 构造函数 */
    constructor(param:any)
    {
        //参数验证
        if(this.check(param))
        {
            //初始化
            this.init()
        }
    }
     /* 初始化 */
     public init():void
     {
         //保存抽奖元素
         let childs:any;
         //获取元素
         if(this.config.childNode)
         {
             childs = document.querySelectorAll(this.config.childNode);
         }else
         {
             if(this.config.el) childs = document.querySelector(this.config.el).children;
         }
 
         if(!childs || !childs.length)
         {   
             console.error('Error：抽奖元素获取失败');
             return
         }
        //保存抽奖子元素
        this.childNodes = childs
     }
    /**
     * 抽奖函数
     * @param draw_index 抽中的下标
     * @param drawEnd 抽奖结束回调
     */
    protected action(draw_index:any, drawEnd:any):void
    {
        if(this.childNodes.length <= 0)
        {
            console.error('Error：抽奖元素获取失败');
            return
        }   
        if(draw_index + '' == '' || draw_index > this.config.order.length)
        {
            console.error('Error：缺少中奖下标或者参数有误');
            return
        }
        draw_index--;
        //判断是否正在抽奖
        if(isAction)
        {
            return
        }
        //禁止抽奖
        isAction = true
        //判断是否随机抽奖
        if(this.config.isRand)
        {
            //结束时间
            let endTime = <any> new Date().getTime() + parseInt((isNaN(this.config.time) ? 5 : this.config.time)  + '000');
            //执行抽奖
            let timer = setInterval(() => {
                //随机下标
                let rand = <any> parseInt(Math.random() * this.config.order.length)
                //当前时间
                let time = <any> new Date().getTime();
                //抽奖
                this._draw(rand)
                //抽奖结束
                if(parseInt(time) >= parseInt(endTime))
                {
                    this._draw(draw_index)
                    //允许抽奖
                    isAction = false
                    //清除定时器
                    clearInterval(timer)
                    //执行回调
                    setTimeout(() => {
                        if(drawEnd && typeof drawEnd == 'function') drawEnd(draw_index + 1)
                    },100)
                    return
                }
            },this.config.speed)

        }else
        {
            //保存圈数
            let circle = <number> 0;
            //执行的下标
            let index:number = drawLastIndex == 0 ? 1 : drawLastIndex;
            //执行抽奖
            let timer = setInterval(() => {
                //抽奖结束
                if(circle > this.config.circle && index > draw_index + 1)
                {
                    //保存最后结果的下标
                    drawLastIndex = index;
                    //允许抽奖
                    isAction = false
                    //清除定时器
                    clearInterval(timer)
                    //执行回调
                    setTimeout(() => {
                        if(drawEnd && typeof drawEnd == 'function') drawEnd(draw_index + 1)
                    },100)
                    return
                }
                //判断是否跑完一圈
                if(index > this.config.order.length)
                {
                    //圈数 + 1
                    circle++;
                    //重置下标
                    index = 1;
                }
                //抽奖
                this._draw(index)
                //下标+1
                index++;
            },this.config.speed)
        }
    }
    
    /* 抽奖结果延迟选中 */
    private endDelay()
    {
        
    }

    /* 参数验证 */
    private check(config:any):Boolean
    {
        if(!config)
        {
            console.error('Error：缺少参数');
        }
        //赋值
        for(let name in this.config)
        {   
            this.config[name] = config[name] || this.config[name]
        }
        //保存错误信息
        let errorMsg = [];
        //选中样式
        if(!this.config.activeClass) errorMsg.push('缺少选中样式参数');
        //输出错误
        if(errorMsg.length)
        {
            console.error(`Error：${errorMsg.join(',')}`);
            return false;
        }
        return true
    }

    /**
     * 执行抽奖
     * @param index 下标
     */
    private _draw(index:number):void
    {
         //排他
         for(let item of this.childNodes)
         {
             if(item.getAttribute('class'))
             {
                 //正则
                 let reg = <object> new RegExp(this.config.activeClass, "g");
                 //替换选中的类名
                 let childClass = item.getAttribute('class').replace(reg,' ')
                 //添加类名
                 item.setAttribute('class',childClass)
             }
         }
         //添加选中类
         this.childNodes[this.config.order[index - (this.config.isRand ? 0 : 1)]].setAttribute('class', `${this.childNodes[this.config.order[index - (this.config.isRand ? 0 : 1)]].getAttribute('class') || ''} ${this.config.activeClass}`)
    }
}