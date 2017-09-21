'use strict';

$(function () {
  var service = new SERVICE();
  var id = getUrlParam('taskId');
  var faction_id = getUrlParam('faction_id');
  var teamId = getUrlParam('teamId');
  var personalTask = getUrlParam('personalTask');
  var myTask = getUrlParam('myTask');
  var ROLEID = parseInt(window.sessionStorage.getItem('role_id'));
  //返回
  $('.btnBack').click(function () {
    window.parent.playClickEffect();
    if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
      window.location.href = 'createTearmDetail.html?teamId=' + getUrlParam('teamId') + '&roleId=1';
    } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
      window.location.href = 'createTearm.html?teamId=' + getUrlParam('teamId');
    } else if (myTask && myTask == 'true') {
      window.parent.reloadWeb('app/h/myTaskList.html?personalTask=true', false, false, 1465, 820);
    } else {
      if (personalTask && personalTask == 'true') {
        window.parent.reloadWeb('app/h/tasklistPersonal.html?personalTask=true', false, false, 1465, 820);
      } else {
        window.parent.reloadWeb('app/h/taskList2.html?faction_id=' + faction_id, false, false, 1465, 820);
      }
    }
  });
  //获取任务信息
  getTask(id);
  //获取任务文档信息
  getAsserts(id);
  //任务详情
  function getTask(id) {
    service.getById(id, function (res) {
      $('#title').text(res.title);
      $('#desc').text(res.remark);
      var type = res.level + '\u7EA7';
      if (res.type == '2') {
        type = '\u4E2A\u4EBA\u4EFB\u52A1';
      } else if (res.type == '3') {
        type = '\u8BD5\u70BC\u4EFB\u52A1';
      } else {
        switch (res.subtype) {
          case 0:
            type = type + '\u8054\u76DF\u6218\u7565\u4EFB\u52A1';
            break;
          case 1:
            type = type + '\u8054\u76DF\u4E34\u65F6\u4EFB\u52A1';
            break;
          case 2:
            type = type + '\u5E2E\u4F1A\u6311\u6218\u4EFB\u52A1';
            break;
          case 3:
            type = type + '\u5E2E\u4F1A\u57FA\u7840\u4EFB\u52A1';
            break;
          case 4:
            type = type + '\u5E2E\u4F1A\u4E34\u65F6\u4EFB\u52A1';
            break;
        }
      }
      var $status = $('#status');
      if (personalTask && personalTask == 'true') {
        switch (res.status) {
          case -1:
            $status.text('删除').attr('data-status', res.status);break;
          case 0:
            $status.text('待审核').attr('data-status', res.status);
            if (ROLEID === 2 || ROLEID === 4 || ROLEID === 5) {
              if (ROLEID === 4 || ROLEID === 5) {
                $("#footer").append('<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="\u9A73\u56DE"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="\u5BA1\u6838\u901A\u8FC7"/><input id="closeTask" class="btn btnStyle subBtn2" type="button" value="\u5173\u95ED\u4EFB\u52A1"/>');
              } else if (ROLEID === 2 && window.sessionStorage.getItem('section_id') == res.created.section_id) {
                $("#footer").append('<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="\u9A73\u56DE"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="\u5BA1\u6838\u901A\u8FC7"/>');
              }
            }
            break;
          case 1:
            $status.text('待审核').attr('data-status', res.status);
            if (ROLEID === 3 || ROLEID === 4 || ROLEID === 5) {
              if (ROLEID === 4 || ROLEID === 5) {
                $("#footer").append('<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="\u9A73\u56DE"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="\u5BA1\u6838\u901A\u8FC7"/><input id="closeTask" class="btn btnStyle subBtn2" type="button" value="\u5173\u95ED\u4EFB\u52A1"/>');
              } else if (ROLEID === 3 && window.sessionStorage.getItem('faction_id') == res.created.faction_id) {
                $("#footer").append('<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="\u9A73\u56DE"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="\u5BA1\u6838\u901A\u8FC7"/>');
              }
            }
            break;
          case 2:
            $status.text('待审核').attr('data-status', res.status);
            if (ROLEID === 4 || ROLEID === 5) {
              $("#footer").append('<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="\u9A73\u56DE"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="\u5BA1\u6838\u901A\u8FC7"/><input id="closeTask" class="btn btnStyle subBtn2" type="button" value="\u5173\u95ED\u4EFB\u52A1"/>');
            }
            break;
          case 3:
            $status.text('驳回').attr('data-status', res.status);
            if (window.sessionStorage.getItem('user_id') == res.created._id) {
              $("#footer").append('<input id="closeTask" class="btn btnStyle subBtn2" type="button" value="\u5173\u95ED\u4EFB\u52A1"/><input id="newEdit" class="btn btnStyle subBtn2" type="button" value="\u91CD\u65B0\u7F16\u8F91"/>');
            }break;
          case 4:
            $status.text('悬赏中').attr('data-status', res.status);break;
          case 5:
            $status.text('进行中').attr('data-status', res.status);break;
          case 6:
            $status.text('待验收').attr('data-status', res.status);break;
          case 7:
            $status.text('待验收').attr('data-status', res.status);break;
          case 8:
            $status.text('待验收').attr('data-status', res.status);break;
          case 9:
            $status.text('待验收').attr('data-status', res.status);break;
          case 10:
            $status.text('返工').attr('data-status', res.status);break;
          case 11:
            $status.text('待分配').attr('data-status', res.status);break;
          case 12:
            $status.text('已完成').attr('data-status', res.status);break;
          case 13:
            $status.text('已关闭').attr('data-status', res.status);break;
        }
      } else {
        switch (res.status) {
          case -1:
            $status.text('删除').attr('data-status', res.status);break;
          case 0:
            $status.text('待审核').attr('data-status', res.status);
            if (ROLEID === 2 || ROLEID === 3 || ROLEID === 4 || ROLEID === 5) {
              $("#footer").append('<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="\u9A73\u56DE"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="\u5BA1\u6838\u901A\u8FC7"/><input id="closeTask" class="btn btnStyle subBtn2" type="button" value="\u5173\u95ED\u4EFB\u52A1"/>');
            }break;
          case 1:
            $status.text('待审核').attr('data-status', res.status);
            if (ROLEID === 3 || ROLEID === 4 || ROLEID === 5) {
              $("#footer").append('<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="\u9A73\u56DE"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="\u5BA1\u6838\u901A\u8FC7"/><input id="closeTask" class="btn btnStyle subBtn2" type="button" value="\u5173\u95ED\u4EFB\u52A1"/>');
            }break;
          case 2:
            $status.text('待审核').attr('data-status', res.status);
            if (ROLEID === 4 || ROLEID === 5) {
              $("#footer").append('<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="\u9A73\u56DE"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="\u5BA1\u6838\u901A\u8FC7"/><input id="closeTask" class="btn btnStyle subBtn2" type="button" value="\u5173\u95ED\u4EFB\u52A1"/>');
            }break;
          case 3:
            $status.text('驳回').attr('data-status', res.status);
            if (window.sessionStorage.getItem('user_id') == res.created._id) {
              $("#footer").append('<input id="closeTask" class="btn btnStyle subBtn2" type="button" value="\u5173\u95ED\u4EFB\u52A1"/><input id="newEdit" class="btn btnStyle subBtn2" type="button" value="\u91CD\u65B0\u7F16\u8F91"/>');
            }break;
          case 4:
            $status.text('悬赏中').attr('data-status', res.status);break;
          case 5:
            $status.text('进行中').attr('data-status', res.status);break;
          case 6:
            $status.text('待验收').attr('data-status', res.status);break;
          case 7:
            $status.text('待验收').attr('data-status', res.status);break;
          case 8:
            $status.text('待验收').attr('data-status', res.status);break;
          case 9:
            $status.text('待验收').attr('data-status', res.status);break;
          case 10:
            $status.text('返工').attr('data-status', res.status);break;
          case 11:
            $status.text('待分配').attr('data-status', res.status);break;
          case 12:
            $status.text('已完成').attr('data-status', res.status);break;
          case 13:
            $status.text('已关闭').attr('data-status', res.status);break;
        }
      }
      $('#type').text(type);
      $('#publishDate').text(dateChange(res.created_at));
      $('#exp').text(res.exp > 0 ? res.exp : '无');
      $('#finishDate').text(dateChange(res.deadline));
      $('#publishPerson').text(res.created.name);
      if (res.verified) {
        if (parseInt(res.status) === 3) {
          $("#checkPerson").text('' + res.verified);
        } else {
          $("#checkPerson").text(res.verified + '\u3001' + res.assigned_to.name);
        }
      } else {
        $("#checkPerson").text(res.assigned_to.name);
      }
      $('#vc').text(res.base_vc > 0 ? res.base_vc : '无');
      $('#gold').text(res.gold > 0 ? res.gold : '无');
      $('#mortgage').text(res.mortgage > 0 ? res.mortgage : '无');
      var gradeText = '无';
      if (res.leader_grade && res.leader_grade !== null && res.leader_grade !== '') {
        gradeText = res.leader_grade;
      }
      $('#leader_grade').text(gradeText);
      $('#leader_level').text(res.leader_level > 0 ? res.leader_level : '无');
      if (res.applicant && res.applicant.user && (parseInt(res.applicant.user._id) || parseInt(res.applicant.user._id) === 0)) {
        $('#taskMember').removeClass('dis_n');
        var html = '<p>\n        <label>\u961F\u4F0D\u540D\u79F0\uFF1A</label><span id="teamName">' + res.applicant.team.name + '</span>\n        <label>\u9886\u961F\uFF1A</label><span id="teamLeader">' + res.applicant.user.name + '</span>\n        </p>\n         <div style="position:relative"><table id="accountTable" class="table table-striped"></table></div>';
        for (var i = 0; i < res.taskApplicants.length; i++) {
          res.taskApplicants[i]._id2 = i + 1;
          res.taskApplicants[i].user.title = res.taskApplicants[i].user.title || '无';
          if (parseInt(res.taskApplicants[i].role_id) === 0) {
            res.taskApplicants[i].role_id2 = '领队';
          } else if (parseInt(res.taskApplicants[i].mortgage) !== 0) {
            res.taskApplicants[i].role_id2 = '合伙人';
          } else if (parseInt(res.taskApplicants[i].mortgage) === 0) {
            res.taskApplicants[i].role_id2 = '队员';
          }
        }

        $(".tableBox").append(html);
        $('.tableBox #accountTable').dataTable({
          retrieve: true,
          scrollY: 640,
          scrollCollapse: true,
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
          data: res.taskApplicants,
          columns: [{ data: '_id2', title: '序号', orderable: false }, { data: 'role_id2', title: '职务', orderable: false }, { data: 'user.name', title: '姓名', orderable: false }, { data: 'user.level', title: '等级', orderable: false }, { data: 'mortgage', title: '押金', orderable: false }, { data: 'user.title', title: '岗位名称', orderable: false }, { data: 'user.grade', title: '岗位级别', orderable: false }]
        });
        $('.changeBoxTask .memberInfo .dataTables_wrapper').css('margin-bottom', '0');
      } else {
        $('#leaderRelease').removeClass('dis_n');
      }
    });
  }
  //获取任务文档
  function getAsserts(id) {
    service.getAssetByTaskId(id, function (res) {
      if (res && res.length > 0) {
        $('#noFile').css('display', 'none');
        for (var i = 0; i < res.length; i++) {
          var pos = res[i].url.lastIndexOf("\/");
          var name = res[i].url.substring(pos + 1);
          $('#fileList').append('\n          <div class="fileItem">\n                            <label>' + name + '</label>\n                             <a href=' + res[i].url + ' class="download" download=' + name + '></a>\n                            <span>' + res[i].user.name + '</span>\n                            <span>' + dateChange(res[i].created_at) + '</span>\n                            <span>' + dateFormat(res[i].created_at) + '</span>\n                        </div>\n          ');
        }
      } else {
        $('#fileList').css('display', 'none');
      }
    });
  }
  /*获取历史记录*/
  function getHistory(id) {
    service.getHistory(id, function (res) {
      if (res.length == 0 || res.length == '0') {
        $(".historyItem").html('<span>暂无历史记录更新！</span>');
      }
      var html = '';
      for (var i = 0, len = res.length; i < len; i++) {
        html += '<p style="margin-top: 1rem;">' + res[i].user.name + '&nbsp;&nbsp;于&nbsp;&nbsp;' + dateChange(res[i].created_at) + '&nbsp;&nbsp;' + dateFormat(res[i].created_at) + '&nbsp;&nbsp;更新&nbsp;&nbsp;</p>';
        for (var j = 0, actionLen = JSON.parse(res[i].action); j < actionLen.length; j++) {
          if (actionLen[j].newvalue || actionLen[j].newvalue == 0) {
            if (actionLen[j].oldvalue === null || actionLen[j].oldvalue === 'null' || actionLen[j].oldvalue === '') {
              if (actionLen[j].newvalue === '' || actionLen[j].newvalue === 'null' || actionLen[j].newvalue === null) {
                html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">\"' + actionLen[j].name + '\"&nbsp;从无变更为无</p>';
              } else {
                html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">' + actionLen[j].name + '从无变更为&nbsp;\"<b>' + actionLen[j].newvalue + '</b>\"&nbsp;</p>';
              }
              //html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;margin-bottom:1rem;">' + actionLen[j].name +'&nbsp;&nbsp;从&nbsp;&nbsp;无&nbsp;&nbsp;变更为&nbsp;&nbsp;'+actionLen[j].newvalue+ '</p></p>';
            } else {
              if ((actionLen[j].newvalue || actionLen[j].newvalue == 0) && (actionLen[j].desc || actionLen[j].desc == 0)) {
                html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">\"' + actionLen[j].newvalue + '\"&nbsp;' + actionLen[j].desc + '</p>';
              } else if ((actionLen[j].oldvalue || actionLen[j].oldvalue == 0) && (actionLen[j].desc || actionLen[j].desc == 0)) {
                html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">\"' + actionLen[j].oldvalue + '\"&nbsp;' + actionLen[j].desc + '</p>';
              } else {
                if (actionLen[j].newvalue === '' || actionLen[j].newvalue === 'null' || actionLen[j].newvalue === null) {
                  if (actionLen[j].oldvalue === '无') {
                    html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">' + actionLen[j].name + '从' + actionLen[j].oldvalue + '变更为无</p>';
                  } else {
                    html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">' + actionLen[j].name + '从&nbsp;\"<b>' + actionLen[j].oldvalue + '</b>\"&nbsp;变更为无</p>';
                  }
                } else {
                  if (actionLen[j].oldvalue === '无') {
                    html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">' + actionLen[j].name + '从' + actionLen[j].oldvalue + '变更为&nbsp;\"<b>' + actionLen[j].newvalue + '</b>\"&nbsp;</p>';
                  } else {
                    html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">' + actionLen[j].name + '从&nbsp;\"<b>' + actionLen[j].oldvalue + '</b>\"&nbsp;变更为&nbsp;\"<b>' + actionLen[j].newvalue + '</b>\"&nbsp;</p>';
                  }
                }
              }
            }
          } else {
            html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">' + actionLen[j].name + '&nbsp;\"<b>' + actionLen[j].desc + '</b>\"</p>';
          }
        }
        $(".historyItem").html(html);
      }
    });
  }
  getHistory(id);

  //驳回任务二次弹窗
  $(document).on('click', '#returnTask', function () {
    window.parent.playClickEffect();
    $('#returnTask').removeClass('dis_n');
    $("#footer").empty().append('<input id="cancel" class="btn btnStyle subBtn2" type="button" value="取消"/><input id="submitReason" class="btn btnStyle subBtn2" type="button" value="提交"/>');
  });
  /*$(document).on('click','#returnTask',function(){
    window.parent.playClickEffect();
    $('#returnTask').removeClass('dis_n');
    $("#footer").empty().append('<input id="cancel" class="btn btnStyle subBtn2" type="button" value="取消"/><input id="submitReason" class="btn btnStyle subBtn2" type="button" value="提交"/>');
  });*/
  $(document).on('click', '#cancel', function () {
    window.parent.playClickEffect();
    $('#returnTask').addClass('dis_n');
    $('#returnReason').val('');
    if (personalTask && personalTask == 'true') {
      if (ROLEID === 4 || ROLEID === 5) {
        $("#footer").empty().append('\n            <input id="returnTask" class="btn btnStyle subBtn2" type="button" value="\u9A73\u56DE"/>\n            <input id="checkTask" class="btn btnStyle subBtn2" type="button" value="\u5BA1\u6838\u901A\u8FC7"/>\n            <input id="closeTask" class="btn btnStyle subBtn2" type="button" value="\u5173\u95ED\u4EFB\u52A1"/>\n            ');
      } else {
        $("#footer").empty().append('<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="\u9A73\u56DE"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="\u5BA1\u6838\u901A\u8FC7"/>');
      }
    } else {
      $("#footer").empty().append('\n            <input id="returnTask" class="btn btnStyle subBtn2" type="button" value="\u9A73\u56DE"/>\n            <input id="checkTask" class="btn btnStyle subBtn2" type="button" value="\u5BA1\u6838\u901A\u8FC7"/>\n            <input id="closeTask" class="btn btnStyle subBtn2" type="button" value="\u5173\u95ED\u4EFB\u52A1"/>\n            ');
    }
  });
  //  确认驳回任务
  $(document).on('click', '#submitReason', function () {
    window.parent.playClickEffect();
    var returnReason = $('#returnReason');
    errorTip(returnReason);
    if (returnReason.val()) {
      var title = "驳回任务";
      var type = "1";
      var con = '\u60A8\u786E\u8BA4\u8981\u9A73\u56DE' + $('#publishPerson').text() + '\u53D1\u5E03\u7684\u4EFB\u52A1\u5417\uFF1F';
      var clickBtn = 'submitReason';
      zPopup(title, type, con, clickBtn, id);
    }
  });
  //审核任务二次弹窗
  $(document).on('click', '#checkTask', function () {
    window.parent.playClickEffect();
    var title = "审核通过";
    var type = "1";
    var con = '\u60A8\u786E\u8BA4\u8981\u6279\u51C6' + $('#publishPerson').text() + '\u53D1\u5E03\u7684\u4EFB\u52A1\u5417\uFF1F';
    var clickBtn = 'checkTask';
    zPopup(title, type, con, clickBtn, id);
  });

  /*关闭任务二次弹窗*/
  $(document).on('click', '#closeTask', function () {
    window.parent.playClickEffect();
    var title = "关闭任务";
    var type = "1";
    var con = "您确认要关闭此任务吗？";
    var clickBtn = 'closeTask';
    zPopup(title, type, con, clickBtn, id);
  });
  /*驳回页面重新编辑*/
  $(document).on('click', '#newEdit', function () {
    if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
      if (faction_id || parseInt(faction_id) === 0) {
        window.location.href = 'tempTaskEdit.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoom&teamId=' + teamId + '&fromPage=reject';
      } else {
        window.location.href = 'tempTaskEdit.html?taskId=' + id + '&fromPage=teaRoom&teamId=' + teamId + '&fromPage=reject';
      }
    } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
      if (faction_id || parseInt(faction_id) === 0) {
        window.location.href = 'tempTaskEdit.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1&fromPage=reject';
      } else {
        window.location.href = 'tempTaskEdit.html?taskId=' + id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1&fromPage=reject';
      }
    } else if (personalTask && personalTask == 'true') {
      if (myTask && myTask == 'true') {
        window.location.href = 'tempTaskEdit.html?taskId=' + id + '&fromPage=reject&personalTask=true&myTask=true';
      } else {
        window.location.href = 'tempTaskEdit.html?taskId=' + id + '&fromPage=reject&personalTask=true';
      }
    } else {
      if (myTask && myTask == 'true') {
        if (faction_id || parseInt(faction_id) === 0) {
          window.location.href = 'tempTaskEdit.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=reject&myTask=true';
        } else {
          window.location.href = 'tempTaskEdit.html?taskId=' + id + '&fromPage=reject&myTask=true';
        }
      } else {
        if (faction_id || parseInt(faction_id) === 0) {
          window.location.href = 'tempTaskEdit.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=reject';
        } else {
          window.location.href = 'tempTaskEdit.html?taskId=' + id + '&fromPage=reject';
        }
      }
    }
  });

  function zPopup(title, type, con, clickBtn, id, user_id) {
    var h = "";
    if (type == 1) {
      //两个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con"><span>' + con + '</span></div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn ' + clickBtn + '">确定</a>' + '</div>' + '</div>';
    } else if (type == 2) {
      //一个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class="u-Popup-close2  btnStyle" style="margin-right: 0;" href="javascript:void(0)">确定</a>' + '</div>' + '</div>';
    }
    $(".feehideBox").html(h);
    //取消按钮
    $(".u-Popup-close").click(function () {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });

    $(".u-Popup-close2").click(function () {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
      location.reload();
    });
    //确定关闭按钮
    $(".closeTask").off("click").on("click", function () {
      window.parent.playClickEffect();
      service.edit(id, { status: 13 }, function (res) {
        if (!faction_id) {
          if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
            window.location.href = 'tempCloseTask.html?taskId=' + id + '&fromPage=teaRoom&teamId=' + teamId;
          } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
            window.location.href = 'tempCloseTask.html?taskId=' + id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
          } else {
            if (myTask && myTask == 'true') {
              if (personalTask && personalTask == 'true') {
                window.location.href = 'tempCloseTask.html?taskId=' + id + '&personalTask=true&myTask=true';
              } else {
                window.location.href = 'tempCloseTask.html?taskId=' + id + '&myTask=true';
              }
            } else {
              if (personalTask && personalTask == 'true') {
                window.location.href = 'tempCloseTask.html?taskId=' + id + '&personalTask=true';
              } else {
                window.location.href = 'tempCloseTask.html?taskId=' + id;
              }
            }
          }
        } else {
          if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
            window.location.href = 'tempCloseTask.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoom&teamId=' + teamId;
          } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
            window.location.href = 'tempCloseTask.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
          } else {
            if (myTask && myTask == 'true') {
              window.location.href = 'tempCloseTask.html?taskId=' + id + '&faction_id=' + faction_id + '&myTask=true';
            } else {
              window.location.href = 'tempCloseTask.html?taskId=' + id + '&faction_id=' + faction_id;
            }
          }
        }
      });
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
    //确定驳回
    $(".submitReason").off("click").on("click", function () {
      window.parent.playClickEffect();
      service.edit(id, { status: 3, reject_desc: $('#returnReason').val() }, function (res) {
        location.reload();
        //window.location.href = `taskList2.html?faction_id=${faction_id}`;
      });
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
    //确定批准任务
    $(".checkTask").off("click").on("click", function () {
      window.parent.playClickEffect();
      var status = void 0;
      if (personalTask && personalTask == 'true') {
        if (parseInt($('#status').data('status')) === 0) {
          if (ROLEID === 4 || ROLEID === 5) {
            status = 4;
          } else {
            status = 1;
          }
        } else if (parseInt($('#status').data('status')) === 1) {
          if (ROLEID === 4 || ROLEID === 5) {
            status = 4;
          } else {
            status = 2;
          }
        } else {
          status = 4;
        }
      } else {
        if (parseInt($('#status').data('status')) === 1) {
          status = 2;
        } else {
          status = 4;
        }
      }
      service.edit(id, { status: status }, function (res) {
        if (parseInt(res.status) === 1 || parseInt(res.status) === 2) {
          window.location.reload();
        } else {
          if (!faction_id) {
            if (parseInt(res.status) === 4) {
              if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
                window.location.href = 'tempTaskDetail.html?taskId=' + id + '&fromPage=teaRoom&teamId=' + teamId;
              } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
                window.location.href = 'tempTaskDetail.html?taskId=' + id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
              } else {
                if (myTask && myTask == 'true') {
                  if (personalTask && personalTask == 'true') {
                    window.location.href = 'tempTaskDetail.html?taskId=' + id + '&personalTask=true&myTask=true';
                  } else {
                    window.location.href = 'tempTaskDetail.html?taskId=' + id + '&myTask=true';
                  }
                } else {
                  if (personalTask && personalTask == 'true') {
                    window.location.href = 'tempTaskDetail.html?taskId=' + id + '&personalTask=true';
                  } else {
                    window.location.href = 'tempTaskDetail.html?taskId=' + id;
                  }
                }
              }
            } else if (parseInt(res.status) === 5) {
              if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
                window.location.href = 'tempContinueTask.html?taskId=' + id + '&fromPage=teaRoom&teamId=' + teamId;
              } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
                window.location.href = 'tempContinueTask.html?taskId=' + id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
              } else {
                if (myTask && myTask == 'true') {
                  if (personalTask && personalTask == 'true') {
                    window.location.href = 'tempContinueTask.html?taskId=' + id + '&personalTask=true&myTask=true';
                  } else {
                    window.location.href = 'tempContinueTask.html?taskId=' + id + '&myTask=true';
                  }
                } else {
                  if (personalTask && personalTask == 'true') {
                    window.location.href = 'tempContinueTask.html?taskId=' + id + '&personalTask=true';
                  } else {
                    window.location.href = 'tempContinueTask.html?taskId=' + id;
                  }
                }
              }
            }
          } else {
            if (parseInt(res.status) === 4) {
              if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
                window.location.href = 'tempTaskDetail.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoom&teamId=' + teamId;
              } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
                window.location.href = 'tempTaskDetail.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
              } else {
                if (myTask && myTask == 'true') {
                  window.location.href = 'tempTaskDetail.html?taskId=' + id + '&faction_id=' + faction_id + '&myTask=true';
                } else {
                  window.location.href = 'tempTaskDetail.html?taskId=' + id + '&faction_id=' + faction_id;
                }
              }
            } else if (parseInt(res.status) === 5) {
              if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
                window.location.href = 'tempContinueTask.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoom&teamId=' + teamId;
              } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
                window.location.href = 'tempContinueTask.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
              } else {
                if (myTask && myTask == 'true') {
                  window.location.href = 'tempContinueTask.html?taskId=' + id + '&faction_id=' + faction_id + '&myTask=true';
                } else {
                  window.location.href = 'tempContinueTask.html?taskId=' + id + '&faction_id=' + faction_id;
                }
              }
            }
          }
        }
      });
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
    //确定放弃任务
    $(".abandonOk").off("click").on("click", function () {
      window.parent.playClickEffect();
      var obj = {};
      service.getRevoke(id, obj, function (res) {
        if (res.code == 400) {
          var _title = "提示";
          var _type = "2";
          var _con = res.msg;
          zPopup(_title, _type, _con);
        } else {
          location.reload();
          //window.location.href = 'taskList.html';
        }
      });
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
  }

  //时间格式转换 xx-xx-xx
  function dateChange(date) {
    var newDate = date ? new Date(date) : new Date();
    return newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
  }
  //时间格式转换 xx:xx
  function dateFormat(date) {
    var newDate = date ? new Date(date) : new Date();
    var minutes = newDate.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    return newDate.getHours() + ':' + minutes;
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