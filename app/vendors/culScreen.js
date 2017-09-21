/*
 rem2.0
 2017.3.24
 一、可加参数
 1、fu-psd：设计稿宽度（默认值640）
 2、fu-min：html根元素最小字体大小（默认值50）
 3、fu-max：html根元素最大字体大小（默认值100）
 4、fu-full：是否强制充满屏幕（默认undefined）
 二、设计稿与CSS尺寸平滑转换
 设计稿中的10px换算成CSS的0.1rem。
 三、横竖屏字体大小不变，采取最佳字体大小
 使横屏页面看起来不会感觉太大，无法使用。（但给与fu-full属性时，该条则失效）
 四、解决变态强迫症
 在chrome手机模拟器中切换手机或PC都能字体大小平滑转换
 五、若设计稿不是640PX咋办？
 1、将设计稿强制修改图像大小为640px，高度等比例缩放
 2、修改源代码（或者传参）在闭包内传入psd_w参数，即为设计稿参数。
 六、例子
 <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0">
 fu-psd="640" fu-min="50" fu-max="100"
 */
!function(win, option) {
  var count = 0,
    designWidth = option.designWidth,
    designHeight = option.designHeight || 0,
    designFontSize = option.designFontSize || 20,
    callback = option.callback || null,
    root = document.documentElement,
    body = document.body,
    rootWidth, newSize, t, self;
  //返回root元素字体计算结果
  function _getNewFontSize() {
    var scale = designHeight !== 0 ? Math.min(win.innerWidth / designWidth, win.innerHeight / designHeight) : win.innerWidth / designWidth;
    return parseInt( scale * 10000 * designFontSize ) / 10000;
  }
  !function () {
    rootWidth = root.getBoundingClientRect().width;
    self = self ? self : arguments.callee;
    if( rootWidth !== win.innerWidth &&  count < 20 ) {
      win.setTimeout(function () {
        count++;
        self();
      }, 0);
    } else {
      newSize = _getNewFontSize();
      if( newSize + 'px' !== getComputedStyle(root)['font-size'] ) {
        root.style.fontSize = newSize + "px";
        return callback && callback(newSize);
      }
    }
  }();
  //横竖屏切换的时候改变fontSize，根据需要选择使用
  win.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
    clearTimeout(t);
    t = setTimeout(function () {
      self();
    }, 300);
  }, false);
}(window, {
  designWidth: 640,
  designHeight: 1136,
  designFontSize: 20,
  callback: function (argument) {
  }
});