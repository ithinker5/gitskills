"use strict";

$(function () {
  $('#manager').on('click', function () {
    window.location.href = 'manager.html';
  });

  var service = new SERVICE();
  var department_id = window.sessionStorage.getItem('department_id');
  function getTasks() {
    service.getTasks({ department_id: department_id, type: 0 }, function (res) {
      for (var i = 0, len = res.length; i < len; i++) {
        res[i].btn = '<input class="btndetail" value="详情" type="button" />';
        res[i].num = '<span data-id=' + res[i]._id + ' id="id" data-subtype=' + res[i].subtype + ' data-status=' + res[i].status + '>' + (i + 1) + '</span>';
        switch (res[i].subtype) {
          case 0:
            res[i].subtype2 = '联盟战略任务';
            break;
          case 1:
            res[i].subtype2 = '联盟临时任务';
            break;
          case 2:
            res[i].subtype2 = '帮会挑战任务';
            break;
          case 3:
            res[i].subtype2 = '帮会基础任务';
            break;
          case 4:
            res[i].subtype2 = '帮会临时任务';
            break;
        }
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
            if (window.sessionStorage.getItem('role_id') == 5 || window.sessionStorage.getItem('role_id') == 4) {
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
        bSortable: true,
        ordering: true, //是否启用排序
        searching: true, //搜索
        language: {
          lengthMenu: '',
          info: "",
          sSearch: "", //<span>搜索</span>
          sZeroRecords: "未搜索到相关内容",
          infoEmpty: "",
          infoFiltered: "",
          sEmptyTable: "暂无数据"
        },
        data: res,
        columns: [{ data: 'num', title: '序号', orderable: true, bSortable: true }, { data: 'title', title: '任务名称', orderable: true, bSortable: true }, { data: 'leader_grade', title: '最低岗位级别', orderable: true, bSortable: true }, { data: 'base_vc', title: 'VC', orderable: true, bSortable: true }, { data: 'gold', title: '金币', orderable: true, bSortable: true }, { data: 'exp', title: '经验值', orderable: true, bSortable: true }, { data: 'subtype2', title: '任务类型', orderable: true, bSortable: true }, { data: 'level', title: '任务等级', orderable: true, bSortable: true }, { data: 'status2', title: '任务状态', orderable: true, bSortable: true }, { data: 'created.name', title: '发布人', orderable: true }, { data: 'leader2', title: '领&nbsp;&nbsp;&nbsp;队', orderable: true }, { data: 'updated_at', title: '发布日期', orderable: true }, { data: 'deadline', title: '要求完成日期', orderable: true }]
      });
      $("#accountTable1_filter").addClass('dis_n');
      // Sort by columns 1 and 2 and redraw
      // $('#accountTable1').DataTable().order( [[ 1, '  asc' ], [ 2, 'asc' ]] ).draw();
      $(window).resize(function () {
        //当浏览器大小变化时
        $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) + 'px');
      });
      $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) + 'px');
      $(".input-sm").attr('placeholder', '请输入关键词');
      $('#accountTable1 tr').click(function () {
        window.parent.playClickEffect();
        var checkId = $(this).find('#id').data('id');
        var checkSubtype = $(this).find('#id').data('subtype');
        var status = $(this).find('#id').data('status');
        /*所带参数skipCocos为调用cocos弹窗，下一级页面获取关闭当前页面使用*/
        if (checkSubtype == 0) {
          window.parent.reloadWeb('app/h/strategyTaskDetail.html?taskId=' + checkId + '&skipCocos=true', false, false, 1465, 820);
          //window.location.href = 'strategyTaskDetail.html?taskId=' + checkId;
        } else if (checkSubtype == 1 && status == 4) {
          window.parent.reloadWeb('app/h/tempTaskDetail.html?taskId=' + checkId + '&skipCocos=true', false, false, 1465, 820);
          //window.location.href = 'tempTaskDetail.html?taskId=' + checkId;
        } else if (checkSubtype == 1 && (status == 5 || status == 10)) {
          window.parent.reloadWeb('app/h/tempContinueTask.html?taskId=' + checkId + '&skipCocos=true', false, false, 1465, 820);
          //window.location.href = 'tempContinueTask.html?taskId=' + checkId;
        } else if (checkSubtype == 1 && status == 11) {
          window.parent.reloadWeb('app/h/tempAwardTask.html?taskId=' + checkId + '&skipCocos=true', false, false, 1465, 820);
          //window.location.href = 'tempAwardTask.html?taskId=' + checkId;
        } else if (checkSubtype == 1 && status == 12) {
          window.parent.reloadWeb('app/h/tempCompleteTask.html?taskId=' + checkId + '&skipCocos=true', false, false, 1465, 820);
          //window.location.href = 'tempCompleteTask.html?taskId=' + checkId;
        } else if (checkSubtype == 1 && (status == 6 || status == 7 || status == 8 || status == 9)) {
          window.parent.reloadWeb('app/h/willReceipt.html?taskId=' + checkId + '&skipCocos=true', false, false, 1465, 820);
          //window.location.href = 'willReceipt.html?taskId=' + checkId;
        } else if (checkSubtype == 1 && status == 14) {
          window.parent.reloadWeb('app/h/tempFailTask.html?taskId=' + checkId + '&skipCocos=true', false, false, 1465, 820);
          //window.location.href = 'tempFailTask.html?taskId=' + checkId;
        } else if (checkSubtype == 1 && status == 13) {
          window.parent.reloadWeb('app/h/tempCloseTask.html?taskId=' + checkId + '&skipCocos=true', false, false, 1465, 820);
          //window.location.href = 'tempCloseTask.html?taskId=' + checkId;
        }
        window.sessionStorage.setItem('fromPage', 'department');
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
    //-webkit-search-cancel-button
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

  getTasks();
  $(document).on('keyup', '#accountTable1_filter label input', function () {
    var value = $(this).val();
    var arr = [];
    $('.pitch.his_active').each(function (index, item) {
      arr.push(parseInt($(item).data('colums')));
    });
    $('#accountTable1').DataTable().columns(arr).search(value, true, true).draw();
  });
  var ROLE_ID = parseInt(window.sessionStorage.getItem('role_id'));
  if (!(ROLE_ID === 5 || ROLE_ID === 4)) {
    $('.fbtask').css('display', 'none');
  }
  $(".fbtask").click(function () {
    window.parent.playClickEffect();
    window.parent.reloadWeb('app/h/tempTaskAdd.html?skipCocos=true', false, false, 1465, 820);
    //window.location.href = 'tempTaskAdd.html';
    window.sessionStorage.setItem('fromPage', 'department');
  });
  function dateChange(date) {
    var newDate = date ? new Date(date) : new Date();
    return newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
  }
});