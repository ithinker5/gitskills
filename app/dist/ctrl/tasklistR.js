"use strict";

$(function () {
  $('.goBack').click(function () {
    window.parent.closeWebPop();
  });
  var service = new SERVICE();
  $('.nav li').off('click').on('click', function () {
    var index = $(this).index();
    $(this).addClass('active').siblings().removeClass('active');
    $('.tab-content .tab-pane').eq(index).addClass('active in').siblings('.tab-pane').removeClass('active in');
    $('.tab-content .tab-pane').eq(index).show().siblings('.tab-pane').hide();
    getList(index);
  });
  function getList(type) {
    service.getList(type, function (res) {
      for (var i = 0, len = res.length; i < len; i++) {
        res[i].btn = '<input class="btndetail" value="详情" type="button" />';
        res[i].checkAccept = '无';
        if (res[i].level === 1) {
          res[i].level = "<img src='../i/magatama.png' />";
        } else if (res[i].level === 2) {
          res[i].level = "<img src='../i/magatama.png' /> <img src='../i/magatama.png' />";
        } else if (res[i].level === 3) {
          res[i].level = "<img src='../i/magatama.png' /> <img src='../i/magatama.png' /> <img src='../i/magatama.png' />";
        } else if (res[i].level === 4) {
          res[i].level = "<img src='../i/magatama.png' /> <img src='../i/magatama.png' /> <img src='../i/magatama.png' /> <img src='../i/magatama.png' />";
        } else if (res[i].level === 5) {
          res[i].level = "<img src='../i/magatama.png' /> <img src='../i/magatama.png' /> <img src='../i/magatama.png' /> <img src='../i/magatama.png' /> <img src='../i/magatama.png' />";
        }
      }
      $('#accountTable' + (type + 1)).dataTable({
        retrieve: true,
        scrollY: 640,
        scrollCollapse: true,
        paging: false, //分页
        ordering: true, //是否启用排序
        searching: false, //搜索
        language: {
          lengthMenu: '',
          info: "",
          infoEmpty: "",
          infoFiltered: "",
          sEmptyTable: "暂无数据"
        },
        data: res,
        columns: [{ data: '_id', title: '序号', orderable: true }, { data: 'title', title: '标题', orderable: true }, { data: 'leader_grade', title: '最低岗位级别', orderable: true }, { data: 'base_vc', title: '悬赏VC', orderable: true }, { data: 'gold', title: '金币', orderable: true }, { data: 'exp', title: '经验值', orderable: true }, { data: 'level', title: '任务等级', orderable: true }, { data: 'checkAccept', title: '验收人', orderable: true }, { data: 'btn', title: '', orderable: true }]
      });
    });
  }
  getList(0);
});