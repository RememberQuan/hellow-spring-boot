/**
 * jquery和vue结合的懒加载方式
 * @author chencai
 *
 * 原理：滚动监听，事件触发vue执行懒加载数据方法
 *
 * div上需要添加属性c-lazy-load-body
 * 该div一般有overflow:hidden 等，使子标签产生滚动条
 *
 * 懒加载的标签需要加属性c-lazy-load 和 绑定事件触发@c-lazy-load
 *      事件触发里的方法，写自己需要触发的懒加载获取数据的方式
 *
 * 如：<div c-lazy-load-body>
 *       <ul>
 *          <li c-lazy-load @c-lazy-load="method(xxx)">{{aa[xxx]}}</li>
 *       </ul>
 *     </div>
 *  new Vue({
 *      el: "#app",
 *      data:{
 *          aa: [],
 *      },
 *      mounted:function(){
 *          $.cLazyStartLoad()
 *      },
 *      methods: {
 *          method : function(xxx){
 *              this.$set(aa,xxx,12);   //对象数组直接赋值不生效，可以采用$set赋值方式
 *          }
 *      }
 *  })
 * vue或在需要使用的地方初始化完成后，调用$.cLazyStartLoad，进行加载当前界面的数据
 *
 */

(function ($) {
    function defaultJudgeLoad(_this, h, x){
        if(x-30<=h && x+30>=0){
            return true;
        }
        return false;
    }
    var defaultOption = {
        el: ".c-lazy-load-body",
        judgeLoad: defaultJudgeLoad,

    }

    var h = $(window).height();
    $(document).resize(function(){
        h = $(window).height();
    });

    function load(body, option, _flag){
        //isRunning减轻scroll触发次数，相当于加了锁，解决scroll过程中的卡顿
        if(option.isRunning) return;
        console.log("scroll")
        option.isRunning = true;
        //setTimeout(function(){
            body.find(".c-lazy-load")
                .each(function(){
                    if($(this).hasClass("c-lazy-load")){
                        var x = $(this).offset().top;
                        var _r = option.judgeLoad(this,h,x);
                        if(_r==null){
                            _r = defaultJudgeLoad(this, h, x);
                        }
                        if(_r){
                            $(this).removeClass("c-lazy-load");
                            //触发vue绑定的事件
                            this.dispatchEvent(new Event("c-lazy-load"));
                        }
                    }
            });
        //},5);
        if(!_flag){
            setTimeout(function(){
                option.isRunning = false;
                setTimeout(function(){
                    if(option.isRunning == false){
                        load(body, option, true);
                    }
                },50);
            },300);
        }else{
            option.isRunning = false;
        }

    }
    $.cLazyLoadInit = function(option){
        if(!$.isPlainObject(option)){
            option = {};
        }
        var _cloneOption = $.extend({},defaultOption);
        option = $.extend(_cloneOption,option);
        $(option.el).each(function(){
            $(this).data("cLazyLoadOption", option);
            load($(this),option);
            $(this).on("scroll",function(){
                load($(this),option);
            });
        });
    };
    $.cLazyLoadReload = function(option){
        if(!$.isPlainObject(option)){
            option = {};
        }
        if(!option.el){
            option.el = defaultOption.el;
        }
        $(option.el).each(function(){
            var defaultOption = $(this).data("cLazyLoadOption");
            if(!$.isPlainObject(defaultOption)){
                return;
            }
            var defaultOption = $.extend(defaultOption,option);
            load($(this),defaultOption);
        });
    };

    //blob文件获取
    $.getBlob = function (uri, success, error) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", uri);
        xmlHttp.responseType = "blob";
        xmlHttp.onload = function () {
            if(this.status == 200 && this.response.size>0){
                if (success && typeof success == 'function') {
                    success(this.response);
                }
            }else{
                if (error && typeof error == 'function') {
                    error(this.response);
                }
            }
        }
        xmlHttp.send();
    }

    //blob方式进行图片加载
    $.cImgLoad = function(imgDom){
        var src = $(imgDom).attr("lazy-src");
        $.getBlob(src,function(blob){
            $(imgDom)
                .attr("src", window.URL.createObjectURL(blob))
                .removeAttr("lazy-src")
                .one("load",function(){
                    window.URL.revokeObjectURL(src);
                });
        });
    }
})($);