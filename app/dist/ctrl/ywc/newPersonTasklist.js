"use strict";

$(function () {
  var service = new SERVICE();
  var department_id = window.sessionStorage.getItem('department_id');
  var exp = [];
  var TaskId = [];
  function getNewTaskList() {
    service.getNewTaskComplete(window.sessionStorage.getItem('user_id'), function (res) {
      for (var i = 0, len = res.length; i < len; i++) {
        res[i].num = '<span class="newTaskNum" data-num=' + res[i]._id + ' data-title=' + res[i].title + ' data-content=' + res[i].content + ' data-exp=' + res[i].exp + ' data-status=' + res[i].status + '>' + (i + 1) + '</span>';
        if (res[i].status == 0) {
          res[i].status = '未完成';
          res[i].getAward = '未领取';
        } else if (res[i].status == 1) {
          res[i].status = '已完成';
          res[i].getAward = '未领取';
        } else if (res[i].status == 2) {
          res[i].status = '已完成';
          res[i].getAward = '已领取';
        }
      }
      $('#accountTable1').dataTable({
        retrieve: true,
        scrollY: 900,
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
        columns: [{ data: 'num', title: '序号', orderable: true }, { data: 'title', title: '任务名称', orderable: true }, { data: 'exp', title: '经验值', orderable: true }, { data: 'status', title: '任务状态', orderable: true }, { data: 'getAward', title: '任务奖励', orderable: true }]
      });
      $(window).resize(function () {
        //当浏览器大小变化时
        $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) + 'px');
      });
      $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) + 'px');
      $('#accountTable1 tr').click(function () {
        window.parent.playClickEffect();
        var checkId = $(this).find('.newTaskNum').data('num');
        var title = $(this).find('.newTaskNum').data('title');
        var content = $(this).find('.newTaskNum').data('content');
        var exp = $(this).find('.newTaskNum').data('exp');
        var status = $(this).find('.newTaskNum').data('status');
        window.location.href = 'newPersonTaskDetail.html?checkId=' + checkId + '&exp=' + exp + '&title=' + title + '&content=' + content + '&status=' + status;
      });
    });
  }
  getNewTaskList();
});