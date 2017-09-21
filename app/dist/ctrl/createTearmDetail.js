'use strict';

$(function () {
  var user_Id = [];
  var teamId = getUrlParam('teamId');
  if (getUrlParam('roleId') == 1) {
    /*队员详情*/
    $(".footer").append('<input id="quit" class="btnStyle subBtn2" type="button" value="退出队伍" />');
    $(".recruit").hide();
    $("#accountTable1_wrapper").css("margin-bottom", "2%");
    $(".nameBtn").attr('readonly', 'readonly');
    $(".taskTitle").html('队员队伍详情');
    $(".nameBtn").addClass('inputNoBorder');
  } else {
    /*队长详情*/
    $(".footer").append('<input id="cancel" class="btnStyle subBtn2" type="button" value="取消" /><input id="submit" class="btnStyle subBtn2" type="button" value="确定" />');
    $(".taskTitle").html('领队队伍详情');
  }
  $(".btnBack").click(function () {
    window.parent.playClickEffect();
    if (getUrlParam('roleId') == 1) {
      window.parent.reloadWeb('app/h/myTearm.html?teamId=' + getUrlParam('teamId') + '&roleId=1&skipCocos=true', false, false, 1465, 820);
    } else {
      window.location.href = 'createTearm.html?roleId=0&teamId=' + getUrlParam('teamId');
    }
  });
  $("#cancel").click(function () {
    window.parent.playClickEffect();
    if (getUrlParam('roleId') == 1) {
      window.parent.reloadWeb('app/h/myTearm.html?teamId=' + getUrlParam('teamId') + '&roleId=1&skipCocos=true', false, false, 1465, 820);
    } else {
      window.location.href = 'createTearm.html?roleId=0&teamId=' + getUrlParam('teamId');
    }
  });
  /*$("#submit").click(function(){
    getChangeTeams(getUrlParam('teamId'));
  });*/
  var service = new SERVICE();
  /*获取团队信息*/
  function getTeamsInfo(id) {
    service.getTeamsInfo(id, function (res) {
      $(".nameBtn").val(res.name);
      $(".teamLeader").text(res.created.name);
      $(".teamNum").html(res.member_count);
      $(".gradeNum").text(res.rating.toFixed(1));
    });
  }
  /*获取积分信息*/
  function getIntegral(id) {
    service.getIntegral(id, function (res) {
      if (res.vc === null || res.vc === 'null') {
        $(".getVC").html(0);
      } else {
        $(".getVC").html(res.vc);
      }
      if (res.extra_vc === null || res.extra_vc === 'null') {
        $(".awardVC").html(0);
      } else {
        $(".awardVC").html(res.extra_vc);
      }
      if (res.off_vc === null || res.off_vc === 'null') {
        $(".punishVC").html(0);
      } else {
        $(".punishVC").html(res.off_vc);
      }
      if (res.gold === null || res.gold === 'null') {
        $(".getGold").html(0);
      } else {
        $(".getGold").html(res.gold);
      }
      if (res.extra_gold === null || res.extra_gold === 'null') {
        $(".awardGold").html(0);
      } else {
        $(".awardGold").html(res.extra_gold);
      }
      if (res.off_gold === null || res.off_gold === 'null') {
        $(".punishGold").html(0);
      } else {
        $(".punishGold").html(res.off_gold);
      }
    });
  }
  //获取招募后队员信息
  function getTeamsList(id) {
    service.getTeamsList(id, function (res) {
      if (getUrlParam('roleId') == 1) {
        for (var i = 0, len = res.length; i < len; i++) {
          if (window.sessionStorage.getItem('user_id') == res[i].user._id) {
            res[i].num = '<span class="quitId" data-id="' + res[i]._tmid + '">' + (i + 1) + '</span>';
          } else {
            res[i].num = '<span data-id="' + res[i]._tmid + '">' + (i + 1) + '</span>';
          }
          res[i].user.level = 'Lv' + res[i].user.level;
          res[i].user.title = res[i].user.title || '无';
          if (res[i].role_id == 1) {
            /*$(".teamLeader").html(res[i].user.name);
            $(".gradeNum").html(res[i].user.task_score.toFixed(1));*/
            res[i].role_id = '队员';
          } else {
            res[i].role_id = '领队';
          }
          res[i].user.grade = res[i].user.grade || '无';
        }
        /*队员详情*/
        $('#accountTable1').dataTable({
          retrieve: true,
          bScrollCollapse: true,
          paging: false, //分页
          ordering: false, //是否启用排序
          searching: false, //搜索
          language: {
            lengthMenu: '',
            info: "",
            infoEmpty: " ",
            infoFiltered: "",
            sEmptyTable: "暂无数据"
          },
          data: res,
          columns: [{ data: 'num', title: '序号', orderable: false }, { data: 'role_id', title: '职务', orderable: false }, { data: 'user.name', title: '姓名', orderable: false }, { data: 'user.level', title: '等级', orderable: false }, { data: 'user.title', title: '岗位名称', orderable: false }, { data: 'user.grade', title: '岗位级别', orderable: false }]
        });
      } else {
        /*队长详情*/
        for (var _i = 0, _len = res.length; _i < _len; _i++) {
          user_Id.push(res[_i].user._id);
          res[_i].num = _i + 1;
          res[_i].user.level = 'Lv' + res[_i].user.level;
          res[_i].user.title = res[_i].user.title || '无';
          if (window.sessionStorage.getItem('user_id') == res[_i].user._id) {
            res[_i].deleteBtn = '<input class="deleteBtn dis_n" data-id="' + res[_i]._tmid + '" value="删除" type="button"/>';
          } else {
            res[_i].deleteBtn = '<input class="deleteBtn" data-id="' + res[_i]._tmid + '" value="删除" type="button"/>';
          }
          if (res[_i].role_id == 0) {
            res[_i].role_id = '领队';
          } else {
            res[_i].role_id = '队员';
          }
        }
        $('#accountTable1').dataTable({
          retrieve: true,
          bScrollCollapse: true,
          paging: false, //分页
          ordering: false, //是否启用排序
          searching: false, //搜索
          language: {
            lengthMenu: '',
            info: "",
            infoEmpty: " ",
            infoFiltered: "",
            sEmptyTable: "暂无数据"
          },
          data: res,
          columns: [{ data: 'num', title: '序号', orderable: false }, { data: 'role_id', title: '职务', orderable: false }, { data: 'user.name', title: '姓名', orderable: false }, { data: 'user.level', title: '等级', orderable: false }, { data: 'user.title', title: '岗位名称', orderable: false }, { data: 'user.grade', title: '岗位级别', orderable: false }, { data: 'deleteBtn', title: '', orderable: false }]
        });
        $(".recruit").click(function () {
          window.parent.playClickEffect();
          if (getUrlParam('roleId') == 1) {
            window.location.href = 'recruitMember.html?roleId=1&teamId=' + teamId;
          } else {
            window.location.href = 'recruitMember.html?roleId=0&teamId=' + teamId + '&exclude=' + user_Id;
          }
        });
      }
      /*function czdd(){
        const title = "删除";
        const type= "1";
        const con = "您确认要删除该队员吗？";
        zPopup(title,type,con)
      }*/
      /*删除按钮事件*/
      $("#quit").click(function () {
        window.parent.playClickEffect();
        var title = "退出队伍";
        var type = "1";
        var con = "您确认要退出此队伍吗？</br>您将失去所有押金！";
        zPopup(title, type, con, $('.quitId').data('id'));
      });
      $(".deleteBtn").click(function () {
        window.parent.playClickEffect();
        var title = "删除";
        var type = "1";
        var con = "您确认将此队员踢出队伍吗？</br>该队员将失去所有押金！";
        zPopup(title, type, con, $(this).data('id'));
        $(this).addClass("hisActive");
      });
      $("#submit").click(function () {
        window.parent.playClickEffect();
        var title = "编辑队伍";
        var type = "3";
        var con = "您确定修改队伍信息吗？";
        zPopup(title, type, con, $(".nameBtn").val());
      });
    });
  }
  getTeamsList(teamId);
  getTeamsInfo(teamId);
  getIntegral(teamId);
  /*获取团队任务列表*/
  function getTeamsTasks(id) {
    service.getTeamsTasks(id, function (res) {
      for (var i = 0, len = res.length; i < len; i++) {
        res[i].num = '<span data-id=' + res[i]._id + ' class="id" data-type=' + res[i].type + ' data-subtype=' + res[i].subtype + ' data-status=' + res[i].status + ' data-factionid=' + res[i].faction_id + '>' + (i + 1) + '</span>';
        res[i].name = res[i].title || '无';
        //res[i].type = res[i].type||'无';
        if (res[i].type == '2') {
          res[i].subtype2 = '\u4E2A\u4EBA\u4EFB\u52A1';
        } else if (res[i].type == '3') {
          res[i].subtype2 = '\u8BD5\u70BC\u4EFB\u52A1';
        } else {
          if (res[i].subtype === 0 || res[i].subtype === '0') {
            res[i].subtype2 = '联盟战略任务';
          } else if (res[i].subtype === 1 || res[i].subtype === '1') {
            res[i].subtype2 = '联盟临时任务';
          } else if (res[i].subtype === 2 || res[i].subtype === '2') {
            res[i].subtype2 = '帮会挑战任务';
          } else if (res[i].subtype === 3 || res[i].subtype === '3') {
            res[i].subtype2 = '帮会基础任务';
          } else if (res[i].subtype === 4 || res[i].subtype === '4') {
            res[i].subtype2 = '帮会临时任务';
          }
        }
        res[i].taskNum = res[i].level || '无';
        //res[i].status = res[i].status||'无';
        if (res[i].status === 0 || res[i].status === '0') {
          res[i].status2 = '待审';
        } else if (res[i].status === 1 || res[i].status === '1') {
          res[i].status2 = '待审';
        } else if (res[i].status === 2 || res[i].status === '2') {
          res[i].status2 = '待审';
        } else if (res[i].status === 3 || res[i].status === '3') {
          res[i].status2 = '驳回';
        } else if (res[i].status === 4 || res[i].status === '4') {
          res[i].status2 = '悬赏中';
        } else if (res[i].status === 5 || res[i].status === '5') {
          res[i].status2 = '进行中';
        } else if (res[i].status === 6 || res[i].status === '6') {
          res[i].status2 = '待验收';
        } else if (res[i].status === 7 || res[i].status === '7') {
          res[i].status2 = '待验收';
        } else if (res[i].status === 8 || res[i].status === '8') {
          res[i].status2 = '待验收';
        } else if (res[i].status === 9 || res[i].status === '9') {
          res[i].status2 = '待验收';
        } else if (res[i].status === 10 || res[i].status === '10') {
          res[i].status2 = '返工';
        } else if (res[i].status === 11 || res[i].status === '11') {
          res[i].status2 = '待分配';
        } else if (res[i].status === 12 || res[i].status === '12') {
          res[i].status2 = '已完成';
        } else if (res[i].status === 13 || res[i].status === '13') {
          res[i].status2 = '已关闭';
        } else if (res[i].status === 14 || res[i].status === '14') {
          res[i].status2 = '失败';
        } else if (res[i].status === -1 || res[i].status === '-1') {
          res[i].status2 = '删除';
        }
        res[i].teamMember = res[i].created.name || '无';
        //res[i].teamMember = res[i].created.role_id||'无';
        if (res[i].created.role_id === 5 || res[i].created.role_id === '5') {
          res[i].role_id2 = '盟主';
        } else if (res[i].created.role_id === 4 || res[i].created.role_id === '4') {
          res[i].role_id2 = '护法';
        } else if (res[i].created.role_id === 3 || res[i].created.role_id === '3') {
          res[i].role_id2 = '帮主';
        } else if (res[i].created.role_id === 2 || res[i].created.role_id === '2') {
          res[i].role_id2 = '长老';
        } else {
          res[i].role_id2 = '帮众';
        }
        res[i].updated_at = res[i].updated_at ? dateChange(res[i].updated_at) : dateChange();
      }
      $('#accountTable2').dataTable({
        retrieve: true,
        bScrollCollapse: true,
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
        columns: [{ data: 'num', title: '序号', orderable: false }, { data: 'name', title: '任务名称', orderable: false }, { data: 'subtype2', title: '任务类型', orderable: false }, { data: 'taskNum', title: '任务级别', orderable: false }, { data: 'status2', title: '任务状态', orderable: false }, { data: 'teamMember', title: '发布人', orderable: false },
        /*{data: 'role_id2',title: '担任角色',orderable: false},*/
        { data: 'updated_at', title: '要求完成日期', orderable: false }]
      });
      if (getUrlParam('roleId') == 1) {
        $('#accountTable2 tr').click(function () {
          window.parent.playClickEffect();
          var checkId = $(this).find('.id').data('id');
          var checkSubtype = parseInt($(this).find('.id').data('subtype'));
          var status = parseInt($(this).find('.id').data('status'));
          var type = parseInt($(this).find('.id').data('type'));
          var faction_id = parseInt($(this).find('.id').data('factionid'));
          if (checkSubtype === 0) {
            window.location.href = 'strategyTaskDetail.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
          } else if (type === 0 && (status === 2 || status === 1 || status === 3)) {
            window.location.href = 'waitCheckTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&faction_id=' + faction_id + '&roleId=1';
          } else if (type === 0 && status === 4) {
            window.location.href = 'tempTaskDetail.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
          } else if (type === 0 && (status === 5 || status === 10)) {
            window.location.href = 'tempContinueTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
          } else if (type === 0 && status === 11) {
            window.location.href = 'tempAwardTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
          } else if (type === 0 && status === 12) {
            window.location.href = 'tempCompleteTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
          } else if (type === 0 && (status === 6 || status === 8 || status === 9)) {
            window.location.href = 'willReceipt.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
          } else if (type === 0 && status === 14) {
            window.location.href = 'tempFailTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
          } else if (type === 0 && status === 13) {
            window.location.href = 'tempCloseTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
          } else if (type === 1 && (status === 2 || status === 1 || status === 3)) {
            window.location.href = 'waitCheckTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1&faction_id=' + faction_id;
          } else if (type === 1 && status === 4) {
            window.location.href = 'tempTaskDetail.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1&faction_id=' + faction_id;
          } else if (type === 1 && (status === 5 || status === 10)) {
            window.location.href = 'tempContinueTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1&faction_id=' + faction_id;
          } else if (type === 1 && status === 11) {
            window.location.href = 'tempAwardTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1&faction_id=' + faction_id;
          } else if (type === 1 && status === 12) {
            window.location.href = 'tempCompleteTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1&faction_id=' + faction_id;
          } else if (type === 1 && (status === 6 || status === 8 || status === 9)) {
            window.location.href = 'willReceipt.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1&faction_id=' + faction_id;
          } else if (type === 1 && status === 14) {
            window.location.href = 'tempFailTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1&faction_id=' + faction_id;
          } else if (type === 1 && status === 13) {
            window.location.href = 'tempCloseTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1&faction_id=' + faction_id;
          } else if (type === 2 && (status === 2 || status === 1 || status === 3)) {
            window.location.href = 'waitCheckTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&personalTask=true';
          } else if (type === 2 && status === 4) {
            window.location.href = 'tempTaskDetail.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&personalTask=true';
          } else if (type === 2 && (status === 5 || status === 10)) {
            window.location.href = 'tempContinueTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&personalTask=true';
          } else if (type === 2 && status === 11) {
            window.location.href = 'tempAwardTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&personalTask=true';
          } else if (type === 2 && status === 12) {
            window.location.href = 'tempCompleteTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&personalTask=true';
          } else if (type === 2 && (status === 6 || status === 7 || status === 8 || status === 9)) {
            window.location.href = 'willReceipt.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&personalTask=true';
          } else if (type === 2 && status === 14) {
            window.location.href = 'tempFailTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&personalTask=true';
          } else if (type === 2 && status === 13) {
            window.location.href = 'tempCloseTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&personalTask=true';
          } else if (type === 3 && (status === 2 || status === 1 || status === 3)) {
            window.location.href = 'waitCheckTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&trialTask=true';
          } else if (type === 3 && status === 4) {
            window.location.href = 'tempTaskDetail.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&trialTask=true';
          } else if (type === 3 && (status === 5 || status === 10)) {
            window.location.href = 'tempContinueTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&trialTask=true';
          } else if (type === 3 && status === 11) {
            window.location.href = 'tempAwardTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&trialTask=true';
          } else if (type === 3 && status === 12) {
            window.location.href = 'tempCompleteTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&trialTask=true';
          } else if (type === 3 && (status === 6 || status === 7 || status === 8 || status === 9)) {
            window.location.href = 'willReceipt.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&trialTask=true';
          } else if (type === 3 && status === 14) {
            window.location.href = 'tempFailTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&trialTask=true';
          } else if (type === 3 && status === 13) {
            window.location.href = 'tempCloseTask.html?taskId=' + checkId + '&fromPage=teaRoomEdit&roleId=1&teamId=' + teamId + '&trialTask=true';
          }
          //window.sessionStorage.setItem('fromPage', 'department')
        });
      }
    });
  }
  getTeamsTasks(teamId);
  //getTeamsTasks(teamId);
  function dateChange(date) {
    var newDate = date ? new Date(date) : new Date();
    // let result = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();
    return newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
  }
  function zPopup(title, type, con, userId) {
    var h = "";
    if (type == 1) {
      //两个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con" style="line-height: 4.4rem"><span>' + con + '</span></div>' + '<div class="m-Popup-footer">' + '<a class="btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class="btnStyle u-Popup-btn gotoDelete">确定</a>' + '</div>' + '</div>';
    } else if (type == 2) {
      //一个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '<div class="m-Popup-con"><span>' + con + '</span></div>' + '<div class="m-Popup-footer">' + '<a class="btnStyle u-Popup-close u-Popup-ok-btn">知道啦</a>' + '</div>' + '</div>';
    } else if (type == 3) {
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con"><span>' + con + '</span></div>' + '<div class="m-Popup-footer">' + '<a class="btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class="btnStyle u-Popup-btn gotoAdd">确定</a>' + '</div>' + '</div>';
    }

    $(".feehideBox").html(h);
    //取消按钮
    $(".u-Popup-close").click(function () {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
    //确定删除按钮
    if (getUrlParam('roleId') == 1) {
      $(".gotoDelete").off("click").on("click", function () {
        window.parent.playClickEffect();
        $(".hisActive").each(function () {
          $(this).parent().parent().remove();
        });
        service.getDeleteTeams(userId, function (res) {
          window.parent.reloadWeb('app/h/myTearm.html', false, false, 1465, 820);
          //window.location.href='myTearm.html';
        });
        $(".g-Popup").hide();
        $(".g-Popup-div").hide();
      });
    } else {
      $(".gotoDelete").off("click").on("click", function () {
        window.parent.playClickEffect();
        $(".hisActive").each(function () {
          $(this).parent().parent().remove();
        });
        service.getDeleteTeams(userId, function (res) {
          //getTeamsList(getUrlParam('teamId'));
        });
        $(".g-Popup").hide();
        $(".g-Popup-div").hide();
      });
      $(".gotoAdd").off("click").on("click", function () {
        window.parent.playClickEffect();
        var service = new SERVICE();
        var name = {
          name: userId
        };
        service.getChangeTeams(getUrlParam('teamId'), name, function (res) {
          /*if(getUrlParam('roleId')==1){
            window.parent.closeWebPop();
            window.location.href = 'myTearm.html?roleId=1&teamId='+getUrlParam('teamId');
          }else{*/
          window.parent.reloadWeb('app/h/createTearm.html?teamId=' + getUrlParam('teamId') + '&roleId=0', false, false, 1465, 820);
          //window.location.href = 'createTearm.html?roleId=0&teamId='+getUrlParam('teamId');
          //}
        });
        $(".g-Popup").hide();
        $(".g-Popup-div").hide();
      });
    }
  }
  //获取url参数
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    } else {
      return null;
    }
  }
});