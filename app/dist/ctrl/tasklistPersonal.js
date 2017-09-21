"use strict";

$(function () {
  var service = new SERVICE();
  var user_id = window.sessionStorage.getItem('user_id');
  function getPersonalTask() {
    service.getPersonalTask({ type: 2 }, function (res) {
      for (var i = 0, len = res.length; i < len; i++) {
        res[i].num = '<span data-id=' + res[i]._id + ' id="id" data-type=' + res[i].type + ' data-status=' + res[i].status + '>' + (i + 1) + '</span>';
        res[i].type = '个人任务';
        switch (res[i].status) {
          case -1:
            res[i].status2 = '删除';
            break;
          case 0:
            res[i].status2 = '待审核';
            break;
          case 1:
            res[i].status2 = '待审核';
            break;
          case 2:
            res[i].status2 = '待审核';
            break;
          case 3:
            res[i].status2 = '驳回';
            break;
          case 4:
            if (window.sessionStorage.getItem('role_id') == 5 || window.sessionStorage.getItem('role_id') == 4 || window.sessionStorage.getItem('user_id') == res[i].created._id) {
              if (res[i].leader) {
                res[i].status2 = '待批准';
              } else {
                res[i].status2 = '悬赏中';
              }
            } else {
              if (res[i].leader) {
                if (window.sessionStorage.getItem('user_id') == res[i].leader._id) {
                  res[i].status2 = '待批准';
                } else {
                  res[i].status2 = '悬赏中';
                }
              } else {
                res[i].status2 = '悬赏中';
              }
            }
            break;
          case 5:
            res[i].status2 = '进行中';
            break;
          case 6:
            res[i].status2 = '待验收';
            break;
          case 7:
            res[i].status2 = '待验收';
            break;
          case 8:
            res[i].status2 = '待验收';
            break;
          case 9:
            res[i].status2 = '待验收';
            break;
          case 10:
            res[i].status2 = '返工';
            break;
          case 11:
            res[i].status2 = '待分配';
            break;
          case 12:
            res[i].status2 = '已完成';
            break;
          case 13:
            res[i].status2 = '已关闭';
            break;
          case 14:
            res[i].status2 = '失败';
            break;
        }
        if (res[i].status < 4 || res[i].status == 4) {
          res[i].leader2 = '无';
        } else {
          if (res[i].leader && res[i].leader.name) {
            res[i].leader2 = res[i].leader.name;
          } else {
            res[i].leader2 = '无';
          }
        }

        // res[i].publish_name = '无';
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
        res[i].deadline = res[i].deadline ? dateChange(res[i].deadline) : dateChange();
        res[i].updated_at = res[i].updated_at ? dateChange(res[i].updated_at) : dateChange();
        res[i].leader_grade = res[i].leader_grade || '无';
      }
      $('#accountTable1').dataTable({
        retrieve: true,
        scrollY: 800,
        scrollCollapse: true,
        paging: false, //分页
        ordering: true, //是否启用排序
        searching: true, //搜索
        language: {
          lengthMenu: '',
          info: "",
          sSearch: "", //<span>搜索</span>
          sZeroRecords: "未搜索到相关内容",
          infoEmpty: "0条记录",
          infoFiltered: "",
          sEmptyTable: "暂无数据"
        },
        data: res,
        columns: [{ data: 'num', title: '序号', orderable: true }, { data: 'title', title: '任务名称', orderable: true }, { data: 'leader_grade', title: '最低岗位级别', orderable: true }, { data: 'base_vc', title: 'VC', orderable: true }, { data: 'gold', title: '金币', orderable: true }, { data: 'exp', title: '经验值', orderable: true }, { data: 'type', title: '任务类型', orderable: true }, { data: 'status2', title: '任务状态', orderable: true }, { data: 'created.name', title: '发布人', orderable: true }, { data: 'leader2', title: '领&nbsp;&nbsp;队', orderable: true }, { data: 'updated_at', title: '发布日期', orderable: true }, { data: 'deadline', title: '要求完成日期', orderable: true }]
      });
      $("#accountTable1_filter").addClass('dis_n');
      $(window).resize(function () {
        //当浏览器大小变化时
        $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) + 'px');
      });
      $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) + 'px');
      $('#accountTable1 tr').click(function () {
        window.parent.playClickEffect();
        var checkId = $(this).find('#id').data('id');
        var checkType = $(this).find('#id').data('type');
        var status = $(this).find('#id').data('status');
        /*所带参数skipCocos为调用cocos弹窗，下一级页面获取关闭当前页面使用*/
        if (checkType === 2 && (status === 0 || status === 2 || status === 1 || status === 3)) {
          window.parent.reloadWeb('app/h/waitCheckTask.html?taskId=' + checkId + '&personalTask=true', false, false, 1465, 820);
        } else if (checkType === 2 && status === 4) {
          window.parent.reloadWeb('app/h/tempTaskDetail.html?taskId=' + checkId + '&personalTask=true', false, false, 1465, 820);
        } else if (checkType === 2 && (status === 5 || status === 10)) {
          window.parent.reloadWeb('app/h/tempContinueTask.html?taskId=' + checkId + '&personalTask=true', false, false, 1465, 820);
        } else if (checkType === 2 && (status === 6 || status === 7 || status === 8 || status === 9)) {
          window.parent.reloadWeb('app/h/willReceipt.html?taskId=' + checkId + '&personalTask=true', false, false, 1465, 820);
        } else if (checkType === 2 && status === 11) {
          window.parent.reloadWeb('app/h/tempAwardTask.html?taskId=' + checkId + '&personalTask=true', false, false, 1465, 820);
        } else if (checkType === 2 && status === 12) {
          window.parent.reloadWeb('app/h/tempCompleteTask.html?taskId=' + checkId + '&personalTask=true', false, false, 1465, 820);
        } else if (checkType === 2 && status === 13) {
          window.parent.reloadWeb('app/h/tempCloseTask.html?taskId=' + checkId + '&personalTask=true', false, false, 1465, 820);
        } else if (checkType === 2 && status === 14) {
          window.parent.reloadWeb('app/h/tempFailTask.html?taskId=' + checkId + '&personalTask=true', false, false, 1465, 820);
        }
      });
    });
  }
  /*点击单选选择过滤器*/
  $(document).on("click", '.pitch', function () {
    window.parent.playClickEffect();
    if ($(this).hasClass("activeImg")) {
      $(this).attr("src", "../i/pitch2.png").removeClass("activeImg").addClass('his_active');
      $(this).parent().siblings('b').find('.pitch').attr("src", "../i/pitch.png").addClass("activeImg").removeClass('his_active');
    } else {
      var value = $(this).val();
      var arr = [];
      $('.pitch.his_active').each(function (index, item) {
        arr.push(parseInt($(item).data('colums')));
      });
      $('#accountTable1').DataTable().columns(arr).search(value, true, true).draw();
      $(this).attr("src", "../i/pitch.png").addClass("activeImg").removeClass('his_active');
      if ($(this).attr("src", "../i/pitch2.png")) {
        $(this).attr("src", "../i/pitch.png").addClass("activeImg").removeClass('his_active');
      } else {
        $(this).parent().siblings('b').find('.pitch').attr("src", "../i/pitch2.png").removeClass("activeImg").addClass('his_active');
      }
    }
    $(document).on('keyup', '#accountTable1_filter label input', function () {
      var value = $(this).val();
      var arr = [];
      $('.pitch.his_active').each(function (index, item) {
        arr.push(parseInt($(item).data('colums')));
      });
      $('#accountTable1').DataTable().columns(arr).search(value, true, true).draw();
    });
  });
  $(document).on('click', 'input[type=search]', function () {
    window.parent.playClickEffect();
  });
  $(document).on('click', 'table.table2 th', function () {
    window.parent.playClickEffect();
  });
  $(document).on('click', '.filterIcon', function () {
    window.parent.playClickEffect();
    if ($(".filterIcon").hasClass('filterIconDown')) {
      $(this).addClass('filterIconUp').removeClass('filterIconDown');
      $(".foldLeft").removeClass('dis_n');
      $(".filterFold").css('height', '7.7%');
      $("#accountTable1_filter").removeClass('dis_n');
    } else {
      $(this).removeClass('filterIconUp').addClass('filterIconDown');
      $(".foldLeft").addClass('dis_n');
      $(".filterFold").css('height', '2%');
      $("#accountTable1_filter").addClass('dis_n');
    }
  });
  getPersonalTask();
  $(document).on('keyup', '#accountTable1_filter label input', function () {
    var value = $(this).val();
    var arr = [];
    $('.pitch.his_active').each(function (index, item) {
      arr.push(parseInt($(item).data('colums')));
    });
    $('#accountTable1').DataTable().columns(arr).search(value, true, true).draw();
  });
  $(".fbtask").click(function () {
    window.parent.playClickEffect();
    window.parent.reloadWeb('app/h/tempTaskAdd.html?personalTask=true', false, false, 1465, 820);
  });
  function dateChange(date) {
    var newDate = date ? new Date(date) : new Date();
    return newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
  }
});