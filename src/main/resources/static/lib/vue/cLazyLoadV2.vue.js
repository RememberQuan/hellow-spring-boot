/**
 * jquery和vue结合的懒加载方式
 * @author chencai
 *
 * 原理：定时监听，事件触发vue执行懒加载数据方法
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
        if($(_this).is(":visible") && x-30<=h && x+30>=0){
            return true;
        }
        return false;
    }
    function lazyFinish(_this){
        $(_this).removeClass("c-lazy-load");
        //触发vue绑定的事件
        _this.dispatchEvent(new Event("c-lazy-load"));
    }
    var defaultOption = {
        judgeLoad: defaultJudgeLoad,

    }

    var h = $(window).height();
    $(document).resize(function(){
        h = $(window).height();
    });

    function load(option){
        $(".c-lazy-load",option.el).each(function(){
            var x = $(this).offset().top;
            var _r = option.judgeLoad(this, h, x, defaultJudgeLoad, lazyFinish);
            if(_r==null){
                _r = defaultJudgeLoad(this, h, x);
            }
            if(_r){
                lazyFinish(this);
            }
        });

    }
    var timerRunning = false;

    function check(){
        for(var key in options){
            load(options[key]);
        }
        setTimeout(check,250);
    }
    var options = {};
    $.cLazyLoadInitV2 = function(option){
        if(!$.isPlainObject(option)){
            option = {};
        }
        var _cloneOption = $.extend({},defaultOption);
        option = $.extend(_cloneOption,option);
        options[option.el] = option;
        if(!timerRunning){
            check();
        }
    };
})($);