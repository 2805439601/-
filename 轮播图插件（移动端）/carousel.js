/*TODO:  
        配置项           参数              说明                            默认
        slides          wrapper          轮播元素                        .sl-wrapper
                        slides           轮播子元素                      .sl-slides



        autoplay        delay           轮播间隔时间                       3000
                        autoplay        自动轮播                           true
                        disable         滑动轮播图后是否自动轮播            true
 
 
        pagination        el             索引器元素                        false
                        backgroundColor  索引背景颜色                      rgba(0,0,0,0.3)
                        selectorBgColor  选中的索引背景颜色                 #fff
                        click            是否允许点击                      false

        autoChange     [true|false]      响应式轮播图（移动端不需要开启）    false

        direction      [X 水平|Y 垂直]    滑动的方向                         X


    语法：

    new Carousel('.slides',{
        slides:{
            wrapper:'.sl-wrapper',
            slides:'.sl-slides'
        },
        autoplay:{
            delay:3000
        },
        pagination :
        {
            el:'.indexer',
            backgroundColor:'blue',
        },
        autoChange:true,
        direction:'X',
    });

*/

/**
  * @method 轮播图
  * @param  [string] selector [轮播对象的父元素]
  * @param  [object] param [配置参数]
  *       
  */
function Carousel(selector,param)
{
   //轮播元素的父元素
   this.selector = selector;
   //配置参数对象
   this.param = param || {};
   //配置初始化
   this.config();
   //页面初始化
   this.init();
   //轮播图尺寸动态改变(移动端不需要开启)
   this.autoSize();
   //索引器
   this.pagination();
   //自动轮播
   this.autoplay();
   //轮播滑动
   this.slidesMove();   
   //点击轮播
   this.slidesClick();
}

/* 配置参数 */
Carousel.prototype.config = function ()
{  

    /* 配置参数对象 */
    this.param.slides = this.param.slides || {};//轮播对象参数
    this.param.autoplay = this.param.autoplay || false; //自动轮播对象
    this.param.pagination = this.param.pagination || false; //分页器对象


    /***************** 配置参数 *****************/

    //轮播对象参数
    this.slidesConfig = {
        'wrapper':this.param.slides.wrapper || '.sl-wrapper',//轮播元素
        'slides':this.param.slides.slides || '.sl-slides',//轮播子元素
    };

    //轮播参数
    this.autoplayConfig = {
        'delay' : this.param.autoplay.delay || 5000,//轮播的间隔时间
        'autoplay':this.param.autoplay ? true : false,//自动轮播
        'disable':this.param.autoplay.disable || true,// 滑动轮播图后是否自动轮播
    };

    //索引器参数
    this.paginationConfig = {
        'el':this.param.pagination.el || false, //分页的元素
        'backgroundColor':this.param.pagination.backgroundColor || 'rgba(0,0,0,0.3)',//背景颜色透明0.3
        'selectorBgColor':this.param.pagination.selectorBgColor || '#fff',//被选中的索引器背景颜色
        'click':this.param.pagination.click || false//是否允许点击
    };

    //响应轮播图参数
    this.autoChangeConfig = this.param.autoChange || false; 

    //滑动的方向
    this.directionConfig = 'translate' + (this.param.direction || 'X');//默认水平方向   可选参[Y]垂直方向
}

/* 页面初始化 */
Carousel.prototype.init = function ()
{
     //初始下标
     this.index = 1;
     //获取轮播对象的父元素的宽度
     this.parentWidth = document.querySelector(this.selector).clientWidth;
     //轮播元素
     this.sl_wrapper = document.querySelector(this.slidesConfig.wrapper);
     /* 克隆最后一张放到轮播图子元素的首位，克隆第一张放到轮播图子元素的最后面 （用于无缝切换）*/
     var last =  this.sl_wrapper.children[this.sl_wrapper.children.length - 1].cloneNode(true);
     var first = this.sl_wrapper.children[0].cloneNode(true);
     this.sl_wrapper.insertBefore(last,this.sl_wrapper.children[0]);
     this.sl_wrapper.appendChild(first);
     //轮播元素的子元素
     this.sl_slide = document.querySelectorAll(this.slidesConfig.slide);
     //轮播图的数量
     this.count =  this.sl_wrapper.children.length;
     //用类名获取不到轮播元素的子元素则获取他的子元素
     if(this.sl_slide.length <= 0)
     {
        this.sl_slide = this.sl_wrapper.children;
     } 
     //设置轮播元素的宽度
     this.sl_wrapper.style.width = this.parentWidth * this.sl_slide.length + 'px';
     this.sl_wrapper.style.transform = this.directionConfig+ '(-'+this.parentWidth * this.index+'px)';
     //设置子元素的宽度
     for(var i = 0; i < this.count; i++ )
     {
         this.sl_slide[i].style.width = this.parentWidth + 'px';
     } 

}

/* 轮播图响应式（用于PC） */
Carousel.prototype.autoSize = function ()
{
   if(this.autoChangeConfig === true)
   {
        //浏览器尺寸改变时则重新给轮播对象设置宽度
        window.addEventListener('resize',function(){
            //改变父元素的宽度
           this.parentWidth =this.sl_wrapper.parentNode.clientWidth;

            if(this.sl_slide.length <= 0)
            {
               this.sl_slide =this.sl_wrapper.children;
            }
            //设置轮播元素的宽度
           this.sl_wrapper.style.width =this.parentWidth *this.sl_slide.length + 'px';
            //设置子元素的宽度
            for(var i = 0; i <this.count; i++ )
            {
               this.sl_slide[i].style.width =this.parentWidth + 'px';
            } 
           this.sl_wrapper.style.transform =this.directionConfig+'(-'+ this.index * this.parentWidth+'px)';
        }.bind(this));
   }
 
}

/* 公共代码(轮播图移动) */
Carousel.prototype.common = function ()
{   
    this.sl_wrapper.style.transform = this.directionConfig +'(-'+ this.index * this.parentWidth +'px)';
    this.sl_wrapper.style.transition = '.3s';
    
    //只有开启索引器才执行下面
    if(this.paginationConfig.el)
    {
        //排它
        for(var i = 0; i < this.pageSons.length; i++ )
        {
            this.pageSons[i].style.backgroundColor = this.paginationConfig.backgroundColor;
        }

        if(this.index >= this.count - 1)
        {
            this.pageSons[0].style.backgroundColor = this.paginationConfig.selectorBgColor;

        }else if(this.index == 0)
        {
            this.pageSons[this.count - 3].style.backgroundColor = this.paginationConfig.selectorBgColor;
           
        }else
        {
            this.pageSons[this.index - 1].style.backgroundColor = this.paginationConfig.selectorBgColor;
        }
       
       
    }
}

/* 自动轮播 */
Carousel.prototype.autoplay = function ()
{   
    var self = this;
    if(this.autoplayConfig.autoplay)
    {
        this.timeId = setInterval(function ()
        {
            this.index++;
            this.common();
        }.bind(this),this.autoplayConfig.delay);   
    }
     //过渡事件
     this.sl_wrapper.addEventListener('transitionend',function(){

        if(self.index >= self.count - 1)
        {
            self.index = 1;
            this.style.transform = self.directionConfig +'(-'+ self.index * self.parentWidth +'px)';
            this.style.transition = 'none';
        }
        if(self.index == 0)
        {
           self.index = self.count - 2;
           this.style.transform = self.directionConfig +'(-'+ self.index * self.parentWidth +'px)';
           this.style.transition = 'none';
        }
    });
    
}

/* 索引器 */
Carousel.prototype.pagination = function ()
{
    //开启索引器
    if(this.paginationConfig.el)
    {
        //获取索引器
        var page = document.querySelector(this.paginationConfig.el);
        //索引器的子元素
        this.pageSons = page.children;
        //保存索引器元素
        var pageHtml = '';
        //保存索引器元素类型
        var targe;
        //判断索引器元素类型
        switch(page.tagName)
        {
            case 'UL':
                    targe = 'li';
            break;
            case 'DL':
                    targe = 'ol';
            break;
            case 'SPAN':
                    targe = 'span';
            break;
            default://默认div元素
                    targe = 'div';
            break;
        }
        for(var i = 1; i <= this.count - 2; i++ )
        {
            if(i == 1)
            {
                pageHtml += '<'+targe+' style="background-color: '+this.paginationConfig.selectorBgColor+'"></'+targe+'>';
                continue;
            }
            pageHtml += '<'+targe+' style="background-color: '+this.paginationConfig.backgroundColor+'"></'+targe+'>';
        }
        page.innerHTML = pageHtml;
    }

}

/* 滑动轮播 */
Carousel.prototype.slidesMove = function ()
{
    var touchTime;//触摸时间
    //绑定触摸事件
    this.sl_wrapper.addEventListener('touchstart',function(e){
         //清除定时器
        clearInterval(this.timeId);
        //阻止浏览器默认事件
        e.preventDefault();
        //触摸的手指不能超过1个
        if(e.touches.length > 1)
        {
            return;
        }
        //触摸时间
        touchTime = Date.now();
        //触摸的水平坐标
        this.touchX = e.touches[0].clientX;
        //触摸的垂直坐标
        this.touchY = e.touches[0].clientY;
    }.bind(this));

    //绑定触摸离开事件
    this.sl_wrapper.addEventListener('touchend',function(e){

         //是否开启自动轮播
         if(this.autoplayConfig.disable === true)
         {
            this.autoplay();
         }    
        //触摸的手指不能超过1个
        if(e.changedTouches.length > 1)
        {
            return;
        }

        //当前时间
        var endTime = Date.now();
        //触摸时间不能超过1秒或者不能低于1毫秒
        if(endTime - touchTime > 2000 || endTime - touchTime < 100 )
        {
            return;
        }
        //离开屏幕的坐标
         this.endX  = e.changedTouches[0].clientX;
         this.endY = e.changedTouches[0].clientY;
        //水平方向滑动
        if(this.directionConfig == 'translateX' && Math.abs(this.endX - this.touchX) > 30)
        {
            // 判断是左滑还是右滑
            this.index = this.endX > this.touchX ? this.index - 1 : this.index + 1;
            //移动图片
            this.common();
        //垂直方向滑动
        }else if(this.directionConfig == 'translateY' && Math.abs(this.endY - this.touchY) > 30)
        {
            // 判断是上滑还是下滑
            this.index = this.endY > this.touchY ? this.index - 1 : this.index + 1;
            //移动图片
            this.common();
        }
       
    }.bind(this));
}

/* 点击轮播 */
Carousel.prototype.slidesClick = function ()
{
    if(this.paginationConfig.click === true)
    {
        var self = this;
        var touchTime;//触摸时间
        for(var i = 0; i < this.pageSons.length; i++ )
        {
            //保存点击的下标
           this.pageSons[i].index = i + 1;
           //绑定触摸事件
           this.pageSons[i].addEventListener('touchstart',function(e){
               //清除定时器
               clearInterval(self.timeId);
               //阻止浏览器默认事件
               e.preventDefault();
               //触摸的手指不能超过1个
               if(e.touches.length > 1)
               {
                   return;
               }
               //触摸时间
               touchTime = Date.now();
           });
   
           //绑定触摸离开事件
           this.pageSons[i].addEventListener('touchend',function(e){
   
               //是否开启自动轮播
               if(self.autoplayConfig.disable === true)
               {
                  self.autoplay();
               }    
               //触摸的手指不能超过1个
               if(e.changedTouches.length > 1)
               {
                   return;
               }
               //当前时间
               var endTime = Date.now();
               //触摸时间不能超过1秒
               if(endTime - touchTime > 1000)
               {
                   return;
               }

               if(self.directionConfig == 'translateX' || self.directionConfig == 'translateY')
               {
                     // 当前下标
                    self.index = this.index;
                    //移动图片
                    self.common();
               }
               
           });
   
        }
       
    }
    
}



    
