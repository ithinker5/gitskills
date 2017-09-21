"use strict";

$(function () {
  var teamId = getUrlParam('teamId');
  /*$(".recruit").click(function(){
    window.location.href= 'recruitMember.html?fromPage=2';
  });*/
  $(".btnBack").click(function () {
    window.parent.playClickEffect();
    //if (getUrlParam('skipCocos')&&getUrlParam('skipCocos')=='true'){
    window.parent.reloadWeb("app/h/myTearm.html", false, false, 1465, 820);
    /*}else{
      window.location.href= 'myTearm.html';
    }*/
  });
  $("#accountTable1_wrapper").css("margin-bottom", "2%");
  var service = new SERVICE();
  /*获取团队信息*/
  function getTeamsInfo(id) {
    service.getTeamsInfo(id, function (res) {
      $(".nameBtn").val(res.name);
      $(".teamNum").html(res.member_count);
      $(".teamLeader").text(res.created.name);
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
  function getTeamsList(id) {
    service.getTeamsList(id, function (res) {
      for (var i = 0, len = res.length; i < len; i++) {
        //res[i].deleteBtn ='<input class="deleteBtn" data-id="'+res[i]._tmid+'" value="删除" type="button"/>';
        res[i].num = i + 1;
        res[i].user.level = 'Lv' + res[i].user.level;
        res[i].user.title = res[i].user.title || '无';
        res[i].user.grade = res[i].user.grade || '无';
        if (res[i].role_id == 0) {
          res[i].role_id = '领队';
          $('#accountTable1 tr').css({ "border-bottom": "1px solid rgba(255,248,164,1)", "color": "rgba(255,248,164,1)" });
        } else {
          res[i].role_id = '队员';
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
        columns: [{ data: 'num', title: '序号', orderable: false }, { data: 'role_id', title: '职务', orderable: false }, { data: 'user.name', title: '姓名', orderable: false }, { data: 'user.level', title: '等级', orderable: false }, { data: 'user.title', title: '岗位名称', orderable: false }, { data: 'user.grade', title: '岗位级别', orderable: false }]
      });
      $(".deleteBtn").click(function () {
        window.parent.playClickEffect();
        czdd();
        $(this).addClass("hisActive");
      });
    });
  }

  /*跳转详情编辑页面*/
  $("#submit").click(function () {
    window.parent.playClickEffect();
    if (getUrlParam('roleId') == 1) {
      window.location.href = 'createTearmDetail.html?roleId=1&teamId=' + teamId;
    } else if (getUrlParam('roleId') == 0) {
      window.location.href = 'createTearmDetail.html?roleId=0&teamId=' + teamId;
    }
  });

  //获取用户信息
  //getListInfo(window.sessionStorage.getItem('user_id'));
  getTeamsInfo(teamId);
  getTeamsList(teamId);
  getIntegral(teamId);
  function getTeamsTasks(id) {
    service.getTeamsTasks(id, function (res) {
      for (var i = 0, len = res.length; i < len; i++) {
        res[i].num = "<span data-id=" + res[i]._id + " class=\"id\" data-type=" + res[i].type + " data-subtype=" + res[i].subtype + " data-status=" + res[i].status + " data-factionid=" + res[i].faction_id + ">" + (i + 1) + "</span>";
        res[i].name = res[i].title || '无';
        //res[i].type = res[i].type||'无';
        if (res[i].type == '2') {
          res[i].subtype2 = "\u4E2A\u4EBA\u4EFB\u52A1";
        } else if (res[i].type == '3') {
          res[i].subtype2 = "\u8BD5\u70BC\u4EFB\u52A1";
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
      $('#accountTable2 tr').click(function () {
        window.parent.playClickEffect();
        var checkId = $(this).find('.id').data('id');
        var checkSubtype = parseInt($(this).find('.id').data('subtype'));
        var status = parseInt($(this).find('.id').data('status'));
        var type = parseInt($(this).find('.id').data('type'));
        var faction_id = parseInt($(this).find('.id').data('factionid'));
        /*type
        * 0---联盟  1---帮派  2---个人  3---试炼 */
        if (checkSubtype === 0) {
          window.location.href = "strategyTaskDetail.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId;
        } else if (type === 0 && (status === 2 || status === 1 || status === 3)) {
          window.location.href = "waitCheckTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId;
        } else if (type === 0 && status === 4) {
          window.location.href = "tempTaskDetail.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId;
        } else if (type === 0 && (status === 5 || status === 10)) {
          window.location.href = "tempContinueTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId;
        } else if (type === 0 && status === 11) {
          window.location.href = "tempAwardTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId;
        } else if (type === 0 && status === 12) {
          window.location.href = "tempCompleteTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId;
        } else if (type === 0 && (status === 6 || status === 8 || status === 9)) {
          window.location.href = "willReceipt.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId;
        } else if (type === 0 && status === 14) {
          window.location.href = "tempFailTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId;
        } else if (type === 0 && status === 13) {
          window.location.href = "tempCloseTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId;
        } else if (type === 1 && (status === 2 || status === 1 || status === 3)) {
          window.location.href = "waitCheckTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&faction_id=" + faction_id;
        } else if (type === 1 && status === 4) {
          window.location.href = "tempTaskDetail.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&faction_id=" + faction_id;
        } else if (type === 1 && (status === 5 || status === 10)) {
          window.location.href = "tempContinueTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&faction_id=" + faction_id;
        } else if (type === 1 && status === 11) {
          window.location.href = "tempAwardTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&faction_id=" + faction_id;
        } else if (type === 1 && status === 12) {
          window.location.href = "tempCompleteTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&faction_id=" + faction_id;
        } else if (type === 1 && (status === 6 || status === 7 || status === 8 || status === 9)) {
          window.location.href = "willReceipt.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&faction_id=" + faction_id;
        } else if (type === 1 && status === 14) {
          window.location.href = "tempFailTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&faction_id=" + faction_id;
        } else if (type === 1 && status === 13) {
          window.location.href = "tempCloseTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&faction_id=" + faction_id;
        } else if (type === 2 && (status === 2 || status === 1 || status === 3)) {
          window.location.href = "waitCheckTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&personalTask=true";
        } else if (type === 2 && status === 4) {
          window.location.href = "tempTaskDetail.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&personalTask=true";
        } else if (type === 2 && (status === 5 || status === 10)) {
          window.location.href = "tempContinueTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&personalTask=true";
        } else if (type === 2 && status === 11) {
          window.location.href = "tempAwardTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&personalTask=true";
        } else if (type === 2 && status === 12) {
          window.location.href = "tempCompleteTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&personalTask=true";
        } else if (type === 2 && (status === 6 || status === 7 || status === 8 || status === 9)) {
          window.location.href = "willReceipt.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&personalTask=true";
        } else if (type === 2 && status === 14) {
          window.location.href = "tempFailTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&personalTask=true";
        } else if (type === 2 && status === 13) {
          window.location.href = "tempCloseTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&personalTask=true";
        } else if (type === 3 && (status === 2 || status === 1 || status === 3)) {
          window.location.href = "waitCheckTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&trialTask=true";
        } else if (type === 3 && status === 4) {
          window.location.href = "tempTaskDetail.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&trialTask=true";
        } else if (type === 3 && (status === 5 || status === 10)) {
          window.location.href = "tempContinueTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&trialTask=true";
        } else if (type === 3 && status === 11) {
          window.location.href = "tempAwardTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&trialTask=true";
        } else if (type === 3 && status === 12) {
          window.location.href = "tempCompleteTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&trialTask=true";
        } else if (type === 3 && (status === 6 || status === 7 || status === 8 || status === 9)) {
          window.location.href = "willReceipt.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&trialTask=true";
        } else if (type === 3 && status === 14) {
          window.location.href = "tempFailTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&trialTask=true";
        } else if (type === 3 && status === 13) {
          window.location.href = "tempCloseTask.html?taskId=" + checkId + "&fromPage=teaRoom&teamId=" + teamId + "&trialTask=true";
        }
        //window.sessionStorage.setItem('fromPage', 'department')
      });
    });
  }
  getTeamsTasks(teamId);
  function dateChange(date) {
    var newDate = date ? new Date(date) : new Date();
    // let result = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();
    var result = newDate.getFullYear() + "<span style=\"position: relative;top: -3.9px;\">-</span>" + (newDate.getMonth() + 1) + "<span style=\"position: relative;top: -3.9px;\">-</span>" + newDate.getDate();
    return result;
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