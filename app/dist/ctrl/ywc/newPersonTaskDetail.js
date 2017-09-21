'use strict';

$(function () {
  $(".btnBack").click(function () {
    window.parent.playClickEffect();
    window.parent.reloadWeb('app/h/ywc/newPersonTasklist.html', false, false, 1465, 820);
  });
  var service = new SERVICE();
  var department_id = window.sessionStorage.getItem('department_id');
  var checkId = parseInt(getUrlParam('checkId'));
  var status = parseInt(getUrlParam('status'));
  $(".taskName").text(decodeURIComponent(getUrlParam('title')));
  $(".taskTarget").text(decodeURIComponent(getUrlParam('content')));
  $(".taskExp").text(getUrlParam('exp'));
  $(".taskStatus").text('未完成');
  $(".taskAward").text('未领取');
  $(".btnStyle").addClass('dis_n');
  /*if(status==0){
    $(".taskStatus").text('未完成');
    $(".taskAward").text('未领取');
    $(".btnStyle").addClass('dis_n');
  }else if(status==1){
    $(".taskStatus").text('已完成');
    $(".taskAward").text('未领取');
  }else if(status==2){
    $(".taskStatus").text('已完成');
    $(".taskAward").text('已领取');
    $(".btnStyle").addClass('dis_n');
  }*/
  function getNewTaskComplete(id) {
    service.getNewTaskComplete(id, function (res) {
      for (var i = 0, len = res.length; i < len; i++) {
        if (checkId === parseInt(res[i]._id)) {
          if (res[i].status == 0) {
            $(".taskStatus").text('未完成');
            $(".taskAward").text('未领取');
          } else if (res[i].status == 1) {
            $(".taskStatus").text('已完成');
            $(".taskAward").text('未领取');
            $(".btnStyle").removeClass('dis_n');
          } else if (res[i].status == 2) {
            $(".taskStatus").text('已完成');
            $(".taskAward").text('已领取');
          }
        }
      }
    });
  }
  getNewTaskComplete(window.sessionStorage.getItem('user_id'));
  $(".btnStyle").click(function () {
    service.getAward(checkId, function (res) {
      location.reload();
    });
  });
});