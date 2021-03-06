'use strict';

$(function () {
  var service = new SERVICE();
  var fromPage = getUrlParam('fromPage');
  if (fromPage === 'judge') {
    $('#borderTitle').text('上诉');
  } else {
    $('#borderTitle').text('投诉');
  }
  chartLimit($('#content'), 250);
  $(".btnBack").click(function () {
    window.parent.playClickEffect();
    window.location.href = 'list.html?fromPage=' + fromPage;
  });
  //添加
  $('#submit').click(function () {
    window.parent.playClickEffect();
    var name = $("#name");
    var content = $("#content");
    errorTip(name, content);
    if (name.val() && content.val()) {
      confirmAgain({
        title: fromPage === 'judge' ? '提交诉讼' : '提交投诉',
        content: {
          text: fromPage === 'judge' ? '您确认提交此诉讼吗？' : '您确认提交此投诉吗？'
        },
        btns: [{ domId: 'cancel', text: '取消' }, { domId: 'confirm', text: '确定', event: add }]
      });
    }
  });
  function add() {
    var obj = {
      title: $('#name').val(),
      content: $('#content').val()
    };
    if (fromPage === 'judge') {
      service.addJudge(obj, function (res) {
        window.location.href = 'detail.html?id=' + res._id + '&fromPage=judge';
      });
    } else {
      service.addComplain(obj, function (res) {
        window.location.href = 'detail.html?id=' + res._id + '&fromPage=complain';
      });
    }
  }
});