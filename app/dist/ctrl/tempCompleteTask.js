'use strict';

$(function () {
  var service = new SERVICE();
  var id = getUrlParam('taskId');
  var userId = parseInt(window.sessionStorage.getItem('user_id'));
  var faction_id = getUrlParam('faction_id');
  var personalTask = getUrlParam('personalTask');
  var trialTask = getUrlParam('trialTask');
  var myTask = getUrlParam('myTask');
  var role_id = parseInt(window.sessionStorage.getItem('role_id'));
  //返回
  $('.btnBack').click(function () {
    back();
  });
  $(document).on('click', '#edit', function () {
    window.parent.playClickEffect();
    window.location.href = 'tempTaskEdit.html?taskId=' + id;
  });
  //获取任务信息
  getTask(id);
  //获取任务文档信息
  getAsserts(id);
  //获取历史记录
  getHistory(id);
  function back() {
    window.parent.playClickEffect();
    //window.sessionStorage.removeItem('selectId');
    //window.sessionStorage.removeItem('selectLeaderName');
    if (getUrlParam('backUserInfo') && getUrlParam('backUserInfo') == 'true') {
      window.parent.closeWebPop();
    } else {
      if (getUrlParam('fromPage') || getUrlParam('fromPage') == "teaRoom") {
        window.location.href = 'createTearm.html?teamId=' + getUrlParam('teamId');
      } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
        window.location.href = 'createTearmDetail.html?teamId=' + getUrlParam('teamId') + '&roleId=1';
      } else if (myTask && myTask == 'true') {
        window.parent.reloadWeb('app/h/myTaskList.html?personalTask=true', false, false, 1465, 820);
      } else {
        if (!faction_id) {
          if (personalTask && personalTask == 'true') {
            window.parent.reloadWeb('app/h/tasklistPersonal.html?personalTask=true', false, false, 1465, 820);
          } else if (trialTask && trialTask == 'true') {
            window.parent.reloadWeb('app/h/ywc/tryTasklist.html?trialTask=true', false, false, 1465, 820);
          } else {
            window.parent.reloadWeb('app/h/taskList.html', false, false, 1465, 820);
          }
        } else {
          window.parent.reloadWeb('app/h/taskList2.html?faction_id=' + faction_id, false, false, 1465, 820);
        }
      }
    }
  }

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
      $('#type').text(type);
      $('#publishDate').text(dateChange(res.published_at));
      $('#exp').text(res.exp > 0 ? res.exp : '无');
      $('#finishDate').text(dateChange(res.deadline));
      var $status = $('#status');
      switch (res.status) {
        case -1:
          $status.text('删除');
          break;
        case 0:
          $status.text('待审核');
          break;
        case 1:
          $status.text('待审核');
          break;
        case 2:
          $status.text('待审核');
          break;
        case 3:
          $status.text('驳回');
          break;
        case 4:
          $status.text('悬赏中');
          break;
        case 5:
          $status.text('进行中');
          break;
        case 6:
          $status.text('待验收');
          break;
        case 7:
          $status.text('待验收');
          break;
        case 8:
          $status.text('待验收');
          break;
        case 9:
          $status.text('待验收');
          break;
        case 10:
          $status.text('返工');
          break;
        case 11:
          $status.text('待分配');
          break;
        case 12:
          $status.text('已完成');
          break;
        case 13:
          $status.text('已关闭');
          break;
      }
      $('#publishPerson').text(res.created.name);
      $("#checkPerson").text(res.acceptance ? res.acceptance : res.created.name);
      $('#vc').text(res.base_vc > 0 ? res.base_vc : '无');
      $('#gold').text(res.gold > 0 ? res.gold : '无');
      $('#mortgage').text(res.mortgage > 0 ? res.mortgage : '无');
      //if (parseInt(res.applicant.user._id) !== userId) {
      var html = '';
      if (res.applicant) {
        html = '<p><label>\u961F\u4F0D\u540D\u79F0\uFF1A</label><span id="teamName">' + res.applicant.team.name + '</span>\n       <label>\u9886\u961F\uFF1A</label><span id="teamLeader">' + res.applicant.user.name + '</span>\n       </p>\n       <div style="position:relative"><table id="accountTable" class="table table-striped"></table></div>';
      } else {
        $(".taskItem2").css("border-top", '0');
        $(".memberInfo").addClass('dis_n');
      }
      for (var i = 0; i < res.taskApplicants.length; i++) {
        res.taskApplicants[i]._id2 = i + 1;
        res.taskApplicants[i].user.title = res.taskApplicants[i].user.title || '无';
        res.taskApplicants[i].user.grade = res.taskApplicants[i].user.grade || '无';
        if (parseInt(res.taskApplicants[i].role_id) === 0) {
          res.taskApplicants[i].role_id2 = '领队';
        } else {
          res.taskApplicants[i].role_id2 = res.taskApplicants[i].mortgage > 0 ? '合伙人' : '队员';
        }
        /*第二张表格input框样式*/
        res.taskApplicants[i].evaluate = '<input type="text" class="awardInput awardInput2" id="evaluate" readonly="readonly"/>';
        res.taskApplicants[i].comments = res.taskApplicants[i].comments ? res.taskApplicants[i].comments : '无';
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
      /*任务验收单内容*/
      $("#completeDate").html(res.completed_at ? dateChange(res.completed_at) : dateChange());
      $("#completeDesc").html(res.complete_desc ? res.complete_desc : '无');
      var html2 = '<div><p><label>验收人：</label><span>' + (res.acceptance ? res.acceptance : res.created.name) + '</span></p></div>' + '<div><p><label>验收结果：</label><span>验收通过</span></p></div>';
      /* +'<div><p><label>领队评分：</label><span>'+res.applicant.rating+'</span></p></div>';
      if(res.applicant.comments == ''||res.applicant.comments==null){
       html2+='<div class="oneItem"><p><label>领队评价：</label><span>无</span></p></div>'
      }else{
       html2+='<div class="oneItem"><p><label>领队评价：</label><span>'+res.applicant.comments+'</span></p></div>'
      }*/
      if (trialTask && trialTask == 'true') {
        html2 += '<div><p><label>领队评分：</label><span>' + res.applicant.rating + '</span></p></div>' + '<div class="oneItem"><p><label>领队评价：</label><span>' + (res.applicant.comments ? res.applicant.comments : '无') + '</span></p></div>' + '<div class="oneItem"><p><label>验收说明：</label><span>' + (res.check_desc ? res.check_desc : '无') + '</span></p></div>';
      } else {
        html2 += '<div>' + '<p><label>悬赏V&nbsp;C：</label><span class="base_vc">' + res.base_vc + '</span></p>' + '<p><label>扣除V&nbsp;C：</label><span class="off_vc">' + res.off_vc + '</span></p>' + '<p><label>奖励V&nbsp;C：</label><span class="extra_vc">' + res.extra_vc + '</span></p>' + '</div>' + '<div>' + '<p><label>悬赏金币：</label><span class="base_gold">' + res.gold + '</span></p>' + '<p><label>扣除金币：</label><span class="off_gold">' + res.off_gold + '</span></p>' + '<p><label>奖励金币：</label><span class="extra_gold">' + res.extra_gold + '</span></p>' + '</div>' + '<div class="oneItem"><p><label>验收说明：</label><span>' + (res.check_desc ? res.check_desc : '无') + '</span></p></div>';
      }
      $(".taskReview").html(html2);
      var allVc = parseInt($(".base_vc").text()) - parseInt($(".off_vc").text()) + parseInt($(".extra_vc").text());
      var allGold = parseInt($(".base_gold").text()) - parseInt($(".off_gold").text()) + parseInt($(".extra_gold").text());
      $(".allVC").text(allVc);
      $(".allGold").text(allGold);
      $(".awardBox #accountTable2").dataTable({
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
        columns: [{ data: 'role_id2', title: '职务', orderable: false }, { data: 'user.name', title: '姓名', orderable: false }, { data: 'vc', title: '奖励VC', orderable: false }, { data: 'gold', title: '奖励金币', orderable: false }, { data: 'exp', title: '经验', orderable: false }, { data: 'rating', title: '评分', orderable: false }, { data: 'comments', title: '评价', orderable: false }]
      });
      if (trialTask && trialTask == 'true') {
        $(".awardBox").hide();
      }
    });
  }

  //获取任务文档
  function getAsserts(id) {
    service.getAssetByTaskId(id, function (res) {
      for (var i = 0; i < res.length; i++) {
        if (parseInt(res[i].type) === 0) {
          if (res && res.length > 0) {
            $('#noFile').css('display', 'none');
            var pos = res[i].url.lastIndexOf("\/");
            var name = res[i].url.substring(pos + 1);
            $('#fileList').append('\n                                <div class="fileItem">\n                                                  <label>' + name + '</label>\n                                                   <a href=' + res[i].url + ' class="download" download=' + name + '></a>\n                                                  <span>' + res[i].user.name + '</span>\n                                                  <span>' + dateChange(res[i].created_at) + '</span>\n                                                  <span>' + dateFormat(res[i].created_at) + '</span>\n                                              </div>\n                                ');
          } else {
            $('#fileList').css('display', 'none');
          }
        } else {
          if (res && res.length > 0) {
            $('#noFileComplete').css('display', 'none');
            var _pos = res[i].url.lastIndexOf("\/");
            var _name = res[i].url.substring(_pos + 1);
            $('#fileComplete').append('\n                                  <div class="fileItem">\n                                                    <label>' + _name + '</label>\n                                                     <a href=' + res[i].url + ' class="download" download=' + _name + '></a>\n                                                    <span>' + res[i].user.name + '</span>\n                                                    <span>' + dateChange(res[i].created_at) + '</span>\n                                                    <span>' + dateFormat(res[i].created_at) + '</span>\n                                                </div>\n                                  ');
          } else {
            $('#fileComplete').css('display', 'none');
          }
        }
      }
    });
  }

  function zPopup(title, type, con, clickBtn) {
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
  }

  //获取历史记录
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
});