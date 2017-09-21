'use strict';

$(function () {
  var service = new SERVICE();
  var $active = getUrlParam('fromPage') ? getUrlParam('fromPage') : 'judge';
  var role = parseInt(window.sessionStorage.getItem('role_id'));

  $(document).on('click', '.nav-tabs li', function () {
    $(this).addClass('active').siblings().removeClass('active');
    $active = $(this).attr('id');
    judgePage();
    getList();
  });
  judgePage();
  getList();
  $(document).on('click', '.btn-detail', function () {
    window.parent.playClickEffect();
    window.location.href = 'detail.html?id=' + $(this).data('id') + '&fromPage=' + $active;
  });
  $(document).on('click', '#addJudge', function () {
    window.parent.playClickEffect();
    window.location.href = "add.html?fromPage=judge";
  });
  $(document).on('click', '#addComplain', function () {
    window.parent.playClickEffect();
    window.location.href = "add.html?fromPage=complain";
  });
  function getList() {
    var data = {
      hasData: false,
      active: '',
      list: []
    };
    if ($active === 'judge') {
      service.getJudgeList(function (res) {
        if (res.length > 0) {
          data.hasData = true;
        }
        data.active = 'judge';
        data.list = res;
        $('#tableContainer').html(template('dataContainer', data));
        getBodyHeight();
      });
    } else {
      service.getComplainList(function (res) {
        if (res.length > 0) {
          data.active = 'complain';
          data.hasData = true;
        }
        data.list = res;
        $('#tableContainer').html(template('dataContainer', data));
        getBodyHeight();
      });
    }
  }
  function judgePage() {
    if ($active === 'judge') {
      $('#judge').addClass('active');
      if (!(role === 4 || role === 5)) {
        $('#addJudge').removeClass('dis_n');
        $('#addComplain').addClass('dis_n');
      }
      if (role === 4 || role === 5) {
        $('#addJudge').addClass('dis_n');
        $('#addComplain').addClass('dis_n');
      }
    } else {
      $('#complain').addClass('active');
      if (!(role === 4 || role === 5)) {
        $('#addJudge').addClass('dis_n');
        $('#addComplain').removeClass('dis_n');
      }
      if (role === 4 || role === 5) {
        $('#addJudge').addClass('dis_n');
        $('#addComplain').addClass('dis_n');
      }
    }
  }
});