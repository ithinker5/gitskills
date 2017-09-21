"use strict";

$(function () {
  var service = new SERVICE();
  var department_id = window.sessionStorage.getItem('department_id');
  function getRedList() {
    service.getRedList(function (res) {
      for (var i = 0, len = res.length; i < len; i++) {
        if (res[i].avatar == 'null' || res[i].avatar == null) {
          res[i].avatar = '../../i/head1.png';
        } else if (parseInt(res[i].avatar) < 8) {
          res[i].avatar = '../i/head' + res[i].avatar + '.png';
        } else {
          res[i].avatar = res[i].avatar;
        }
        res[i].name = '<div class="memberNameImg"><img src="' + res[i].avatar + '" /></div>&nbsp;&nbsp;' + res[i].name + '&nbsp;&nbsp;<span data-id="' + res[i]._id + '">' + res[i].worker_number || '无' + '</span>';
        res[i].num = '<span class="newTaskNum" >' + (i + 1) + '</span>';
        res[i].factionName = res[i].faction && res[i].faction.name ? res[i].faction.name : '无';
        res[i].vc = parseInt(res[i].task_vc);
      }
      $('#accountTable1').dataTable({
        retrieve: true,
        scrollY: 900,
        scrollCollapse: true,
        paging: false, //分页
        ordering: false, //是否启用排序
        searching: false, //搜索
        language: {
          lengthMenu: '',
          info: "",
          infoEmpty: "",
          infoFiltered: "",
          sEmptyTable: "暂无数据"
        },
        data: res,
        columns: [{ data: 'num', title: '排名', orderable: false }, { data: 'name', title: '姓名', orderable: false }, { data: 'factionName', title: '所在帮会', orderable: false }, { data: 'vc', title: '总VC', orderable: false }]
      });
      $(window).resize(function () {
        //当浏览器大小变化时
        $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) + 'px');
      });
      $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) + 'px');
      /*$('#accountTable1 tr').click(function () {
        window.parent.playClickEffect();
        let checkId = $(this).find('.newTaskNum').data('num');
        let title = $(this).find('.newTaskNum').data('title');
        let content = $(this).find('.newTaskNum').data('content');
        let exp = $(this).find('.newTaskNum').data('exp');
        let status = $(this).find('.newTaskNum').data('status');
        window.parent.reloadWeb(`app/h/ywc/newPersonTaskDetail.html?checkId=${checkId}&exp=${exp}&title=${title}&content=${content}&status=${status}`, false, false, 1465, 820);
      });*/
    });
  }
  getRedList();
});