/**
 * @file        基于jQuery的图片懒加载插件
 * @author      龙泉 <yangtuan2009@126.com>
 * @version     1.1.0
 */

(function (factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD module
        define(['jquery'], factory);
    }
    else if(typeof module !== "undefined" && module.exports) {
        // Node/CommonJS
        // Seajs build
        factory(require('jquery'));
    }
    else {
        // 浏览器全局模式
        factory(jQuery);
    }

})(function ($) {

    /**
     * 图片懒加载的实现函数
     * @param {Object} options 配置对象
     * @param {string} options.selector 懒加载图片的选择器查询字符串。
     * @param {string} options.src 懒加载图片的真实url的保存属性。
     * @param {string} params.effect 用来指定加载图片时的效果，默认为"none"——即无效果，另外"fadeIn"——表示淡入效果。
     * @param {number} params.threshold 设置一个阀值，用来指定可以提前加载多少范围之外的图片。默认为0——不提前加载。当viewport为true时，表示前后两个方向都会做提前加载。
     * @param {number} params.thresholdBefore 设置一个阀值，当viewport为true时，用来单独指定可以向前加载多少范围之外的图片。默认为0——不提前加载。
     * @param {number} params.timeout 懒加载行为响应的延迟时间，默认为0——表示不做延迟处理。
     * @param {boolean} params.viewport 是否仅加载可视窗口之内的图片，默认为false——表示将加载可视窗口内以及位于之前的所有图片。
     */

    function LazyLoad(options) {

        // 参数匹配
        var $win = $(window),
            opt = $.extend({
                selector: "img[data-src]",
                src: "data-src",
                effect: "none",
                threshold: 0,
                thresholdBefore: 0,
                timeout: 0,
                viewport: false
            }, options),
            src = opt.src,
            threshold = opt.threshold,
            eventName = "scroll resize",
            timerID, goLoadImg;

        // 初始化处理
        this.init = function() {
            removeEvent();
            bindEvent();
            goLoadImg();
        };

        // 执行单次图片加载
        goLoadImg = opt.timeout === 0 ? loadImg : function(){
            clearTimeout(timerID);
            timerID = setTimeout(loadImg, opt.timeout);
        };

        // 图片加载的处理函数
        function loadImg() {

            // console.info("loadImg start!");
            var elements = $(opt.selector),
                i = 0,
                len = elements.length,
                scrollTop = $win.scrollTop(),
                viewHeight = $win.height(),
                counter = 0;

            // 循环图片列表，当图片位于显示窗口时则将其加载
            for(; i < len; i++){
                checkImg(elements.eq(i));
            }

            //解除事件绑定
            len === 0 && removeEvent();

            // 检测图片的加载
            function checkImg($ele) {

                var offsetTop = $ele.offset().top,
                    imgSrc = $ele.attr(src),
                    cando = offsetTop <= scrollTop + viewHeight + threshold,
                    oImage;

                cando = cando && (!opt.viewport || offsetTop + $ele.height() + (opt.thresholdBefore || threshold) >= scrollTop);

                if(cando && $ele.data('loading') === undefined){

                    // 一张图片仅加载一次
                    $ele.data('loading', 1);

                    // 标识执行了图片加载的次数
                    counter += 1;

                    // 仅当图片加载完成，才执行src属性的替换
                    oImage = new Image();

                    oImage.onload = function() {
                        var isImg = $ele[0].nodeName.toLowerCase() === "img";
                        isImg ? $ele.attr("src", imgSrc) : $ele.css("backgroundImage", "url(" + imgSrc + ")");
                        isImg && opt.effect === "fadeIn" && $ele.css("opacity", 0).animate({opacity: 1});
                        $ele.removeAttr(src);
                        doLazyAgain();
                    };

                    oImage.onerror = function() {
                        $ele.removeAttr(src);
                    };

                    oImage.src = imgSrc;
                }
            }

            // 图片加载完成后，还需要再一次执行验证
            // 避免图片自适应宽高时，实际展示尺寸小于占位图片的尺寸，从而将后面没有加载的图片显示出来
            function doLazyAgain() {
                counter--;
                if(counter <= 0) {
                    setTimeout(loadImg, 400);
                }
            }
        }

        // 绑定事件处理
        function bindEvent() {
            $win.on(eventName, goLoadImg);
        }

        // 解除事件处理
        function removeEvent() {
            $win.off(eventName, goLoadImg);
        }
    }

    // 对外提供接口调用
    $.imgLazy = function(options) {
        var obj = new LazyLoad(options);
        $.imgLazy = obj.init;
        obj.init();
    };
});