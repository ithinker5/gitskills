"use strict";

//当浏览器大小变化时,table的高度变化
$(window).resize(function () {
  $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) + 'px');
});
$(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) - 10 + 'px');

//当用户输入的时候判断是否值进行了改变，如果改变了就把error去掉,  表示是用户重新输入了
$(document).on('change', '.input-text', function () {
  $(this).removeClass('error');
  $(this).siblings('span').css('display', 'none');
});
//需要优化
function getBodyHeight() {
  setTimeout(function () {
    $(window).resize(function () {
      $("tbody").css("height", parseInt($(".tab-pane").height()) - parseInt($("thead").height()) - parseInt($(".space-line").height()) - 10 + 'px');
    });
    $("tbody").css("height", parseInt($(".tab-pane").height()) - parseInt($("thead").height()) - parseInt($(".space-line").height()) - 10 + 'px');
  }, 100);
}
function getManagerBodyHeight() {
  setTimeout(function () {
    $(window).resize(function () {
      $("tbody").css("height", parseInt($("#contentContainer").height()) - parseInt($("thead").height()) + 'px');
    });
    $("tbody").css("height", parseInt($("#contentContainer").height()) - parseInt($("thead").height()) + 'px');
  }, 10);
}
function animate(dom) {
  dom.fadeIn(1000);
  setTimeout(function () {
    dom.fadeOut(1000);
  }, 3000);
}
/*字数限制*/
function chartLimit(dom, limit) {
  dom.on("input propertychange", function () {
    var $this = $(this),
        $val = $this.val();
    if ($val.length > limit) {
      $this.val($val.substring(0, limit));
    }
  });
}
//判断是否是大于等于0的整数
function isInt(num) {
  if (/^\d+$/.test(num)) {
    return true;
  } else {
    return false;
  }
}
//检验是否输入，如果没有输入加上红色框体提示
function errorTip() {
  for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (!item.val()) {
        item.addClass('error');
      } else {
        item.removeClass('error');
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}
//获取url query值
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  } else {
    return null;
  }
}
//时间格式转换 xx-xx-xx
function dateChange(date) {
  var newDate = date ? new Date(date) : new Date();
  var month = newDate.getMonth() + 1;
  var day = newDate.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return newDate.getFullYear() + "-" + month + "-" + day;
}
//时间格式转换 xx:xx
function dateFormat(date) {
  var newDate = date ? new Date(date) : new Date();
  var minutes = newDate.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return newDate.getHours() + ":" + minutes;
}
//二次弹窗
function confirmAgain(obj) {
  var textHeight = "line-height:" + (obj.content.height ? obj.content.height : '8.9rem');
  var container = "<div class=\"g-Popup-div\"></div>\n              <div class=\"g-Popup\">\n              <div class=\"m-Popup-title\">" + obj.title + "</div>\n              <div class=\"m-Popup-con\" style=" + textHeight + ">" + obj.content.text + "</div>\n              <div class=\"m-Popup-footer\"></div>\n              </div>";
  $(".feehideBox").html(container);

  var _loop = function _loop(i) {
    var btn = "<a class=\"btnStyle\" id=" + obj.btns[i].domId + ">" + obj.btns[i].text + "</a>";
    $('.m-Popup-footer').append(btn);
    $("#" + obj.btns[i].domId).unbind('click').click(function () {
      if (obj.btns[i].event) {
        obj.btns[i].event();
      }
      $(".feehideBox").empty();
    });
  };

  for (var i = 0; i < obj.btns.length; i++) {
    _loop(i);
  }
}
//role转换
function roleToName(role) {
  var role_id = parseInt(role);
  if (role_id === 5) {
    return '盟主';
  } else if (role_id === 4) {
    return '护法';
  } else if (role_id === 3) {
    return '帮主';
  } else if (role_id === 2) {
    return '长老';
  } else {
    return '帮众';
  }
}

//下拉框
function select(_this, cb) {
  var thisInput = $(_this);
  var thisUl = $(_this).parent().find("ul");
  if (thisUl.css("display") === "none") {
    thisUl.fadeIn("100");
    thisUl.unbind('hover').hover(function () {}, function () {
      thisUl.fadeOut("100");
    });
    thisUl.find("li").unbind('click').click(function () {
      cb(this);
      thisInput.attr('data-value', $(this).val());
      thisInput.attr('value', $(this).text());
      thisUl.fadeOut("100");
    }).unbind('hover').hover(function () {
      $(this).addClass("hover");
    }, function () {
      $(this).removeClass("hover");
    });
  } else {
    thisUl.fadeOut("fast");
  }
}
var changeChart = function changeChart(str) {
  return encodeURI(str);
};
var allGrade = ['1D', '1C', '1B', '1A', '2C', '2B', '2A', '3C', '3B', '3A', '4C', '4B', '4A', '5C', '5B', '5A', '6C', '6B', '6A', '7C', '7B', '7A', '8C', '8B', '8A', '9C', '9B', '9A', 'A5', 'A4', 'A3', 'A2', 'A1'];