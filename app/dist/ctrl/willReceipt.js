'use strict';

/*盟主：是否有队伍接取该任务，有则为待批准，无则为悬赏中*/
/*其他人：自己是否有申请，有则为待批准，无则为悬赏中*/
$(function () {
  var service = new SERVICE();
  var id = getUrlParam('taskId');
  var teamId = getUrlParam('teamId');
  var personalTask = getUrlParam('personalTask');
  var trialTask = getUrlParam('trialTask');
  var userId = parseInt(window.sessionStorage.getItem('user_id'));
  var faction_id = getUrlParam('faction_id');
  var myTask = getUrlParam('myTask');
  var role_id = parseInt(window.sessionStorage.getItem('role_id'));
  var fileNames = []; //存放文件名称
  var fileArr = []; //存放文件链接
  var departGold = 0;
  var factionGold = 0;
  var personalGold = 0;
  var factionVC = 0;
  var departVC = 0;
  var personalVC = 0;
  //返回
  $('.btnBack').click(function () {
    window.parent.playClickEffect();
    if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
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
  });
  /*模拟下拉框效果*/
  $(".select_box input").click(function () {
    var thisinput = $(this);
    var thisul = $(this).parent().find("ul");
    if (thisul.css("display") == "none") {
      thisul.fadeIn("100");
      thisul.hover(function () {}, function () {
        thisul.fadeOut("100");
      });
      thisul.find("li").click(function () {
        thisinput.attr('data-value', $(this).val());
        thisinput.val($(this).text());
        thisul.fadeOut("100");
      }).hover(function () {
        $(this).addClass("hover");
      }, function () {
        $(this).removeClass("hover");
      });
    } else {
      thisul.fadeOut("fast");
    }
  });
  //获取任务信息
  getTask(id);
  //获取历史记录
  getHistory(id);
  //任务详情
  function getTask(id) {
    service.getById(id, function (res) {
      $('#title').text(res.title).attr('data-type', res.type);
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
      $('#finishDesc').text(res.complete_desc ? res.complete_desc : '无');
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
      $status.attr('data-status', res.status);
      $('#publishPerson').text(res.created.name).attr('data-id', res.created._id);
      if (res.acceptance) {
        $("#checkPerson").text(res.acceptance + '\u3001' + res.assigned_to.name);
      } else {
        $("#checkPerson").text(res.assigned_to.name);
      }
      // if(res.created.role_id==5){
      //   $("#lafficheBoss").text('盟主');
      // }else if(res.created.role_id==4){
      //   $("#lafficheBoss").text('护法');
      // }else if(res.created.role_id==3){
      //   $("#lafficheBoss").text('帮主');
      // }else if(res.created.role_id==2){
      //   $("#lafficheBoss").text('长老');
      // }
      $('#vc').text(res.base_vc > 0 ? res.base_vc : '无');
      $('#gold').text(res.gold > 0 ? res.gold : '无');
      $('#mortgage').text(res.mortgage > 0 ? res.mortgage : '无');
      if (parseInt(res.status) !== 6) {
        $('.taskReview').removeClass('dis_n');
        $("#completeDate").html(res.completed_at ? dateChange(res.completed_at) : dateChange());
        $("#completeDesc").html(res.complete_desc ? res.complete_desc : '无');
        var html2 = '<div><p><label>验收人：</label><span>' + res.created.name + '</span></p></div>' + '<div><p><label>验收结果：</label><span>验收通过</span></p></div>' + '<div><p><label>领队评分：</label><span>' + res.applicant.rating + '</span></p></div>';
        if (res.applicant.comments == '' || res.applicant.comments == null) {
          html2 += '<div class="oneItem"><p><label>领队评价：</label><span>无</span></p></div>';
        } else {
          html2 += '<div class="oneItem"><p><label>领队评价：</label><span>' + res.applicant.comments + '</span></p></div>';
        }
        html2 += '<div>' + '<p><label>悬赏V&nbsp;C：</label><span class="base_vc">' + res.base_vc + '</span></p>' + '<p><label>扣除V&nbsp;C：</label><span class="off_vc">' + res.off_vc + '</span></p>' + '<p><label>奖励V&nbsp;C：</label><span class="extra_vc">' + res.extra_vc + '</span></p>' + '</div>' + '<div>' + '<p><label>悬赏金币：</label><span class="base_gold">' + res.gold + '</span></p>' + '<p><label>扣除金币：</label><span class="off_gold">' + res.off_gold + '</span></p>' + '<p><label>奖励金币：</label><span class="extra_gold">' + res.extra_gold + '</span></p>' + '</div>' + '<div class="oneItem"><p><label>验收说明：</label><span>' + (res.check_desc ? res.check_desc : '无') + '</span></p></div>';
        $(".taskReview").html(html2);
      }
      var html = '<p>\n        <label>\u961F\u4F0D\u540D\u79F0\uFF1A</label><span id="teamName">' + res.applicant.team.name + '</span>\n        <label>\u9886\u961F\uFF1A</label><span id="teamLeader">' + res.applicant.user.name + '</span>\n        </p>\n         <div style="position:relative"><table id="accountTable" class="table table-striped"></table></div>';
      for (var i = 0; i < res.taskApplicants.length; i++) {
        res.taskApplicants[i]._id2 = i + 1;
        res.taskApplicants[i].user.title = res.taskApplicants[i].user.title || '无';
        res.taskApplicants[i].user.grade = res.taskApplicants[i].user.grade || '无';
        if (parseInt(res.taskApplicants[i].role_id) === 0) {
          res.taskApplicants[i].role_id2 = '领队';
        } else {
          res.taskApplicants[i].role_id2 = res.taskApplicants[i].mortgage > 0 ? '合伙人' : '队员';
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
      if (faction_id || faction_id == 0) {
        if ((role_id == 4 || role_id == 5) && (res.status == 8 || res.status == 9) || role_id === 3 && parseInt(faction_id) === parseInt(window.sessionStorage.getItem('faction_id')) && res.status == 8) {
          $("#footer").append('<input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
        } else if (userId == res.created._id && res.status == 6) {
          if (userId == res.applicant.user._id) {
            $("#footer").append('<input id="reSubmit" class="btn btnStyle subBtn2" type="button" value="重新提交"/><input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          } else {
            $("#footer").append('<input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          }
        } else if (userId == res.applicant.user._id) {
          $("#footer").append('<input id="reSubmit" class="btn btnStyle subBtn2" type="button" value="重新提交"/>');
        }
      } else if (personalTask && personalTask == 'true') {
        if ((role_id == 4 || role_id == 5) && res.status == 9 || role_id === 3 && res.faction_id === parseInt(window.sessionStorage.getItem('faction_id')) && res.status == 8 || role_id === 2 && window.sessionStorage.getItem('section_id') == res.created.section_id && res.status == 7 || res.status == 6 && userId == res.created._id) {
          if (role_id === 3 && res.created.faction_id === parseInt(window.sessionStorage.getItem('faction_id')) && res.status == 8) {
            $("#footer").append('<input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          } else if (role_id === 2 && window.sessionStorage.getItem('section_id') == res.created.section_id && res.status == 7) {
            $("#footer").append('<input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          } else if (res.status == 9 && (role_id == 4 || role_id == 5)) {
            $("#footer").append('<input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          } else if (userId == res.created._id && res.status == 6) {
            if (userId == res.applicant.user._id) {
              $("#footer").append('<input id="reSubmit" class="btn btnStyle subBtn2" type="button" value="重新提交"/><input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
            } else {
              $("#footer").append('<input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
            }
          }
        } else if (userId == res.created._id && res.status == 6) {
          if (userId == res.applicant.user._id) {
            $("#footer").append('<input id="reSubmit" class="btn btnStyle subBtn2" type="button" value="重新提交"/><input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          } else {
            $("#footer").append('<input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          }
        } else if (userId == res.applicant.user._id && (role_id == 4 || role_id == 5) && (res.status == 8 || res.status == 7 || res.status == 9)) {
          if (userId == res.applicant.user._id && (role_id == 4 || role_id == 5) && (res.status == 8 || res.status == 7)) {
            $("#footer").append('<input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          } else if (userId == res.applicant.user._id && (role_id == 4 || role_id == 5) && res.status == 9) {
            $("#footer").append('<input id="reSubmit" class="btn btnStyle subBtn2" type="button" value="重新提交"/><input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          }
        } else if (userId == res.applicant.user._id) {
          $("#footer").append('<input id="reSubmit" class="btn btnStyle subBtn2" type="button" value="重新提交"/>');
        } else if ((role_id == 4 || role_id == 5) && (res.status == 7 && res.created.role_id == 1 || res.created.role_id == 3 && res.status == 9 || res.created.role_id == 2 && res.status == 8 || res.created.role_id == 1 && res.status == 8)) {
          /*if(userId==res.applicant.user._id){
            $("#footer").append('<input id="reSubmit" class="btn btnStyle subBtn2" type="button" value="重新提交"/><input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          }else{*/
          $("#footer").append('<input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          //}
        }
      } else if (trialTask && trialTask == 'true') {
        if (userId == res.created._id && res.status == 6) {
          if (userId == res.applicant.user._id) {
            $("#footer").append('<input id="reSubmit" class="btn btnStyle subBtn2" type="button" value="重新提交"/><input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          } else {
            $("#footer").append('<input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          }
        } else if (userId == res.applicant.user._id) {
          $("#footer").append('<input id="reSubmit" class="btn btnStyle subBtn2" type="button" value="重新提交"/>');
        }
      } else {
        if (role_id === 4 || role_id === 5) {
          if (userId == res.applicant.user._id) {
            $("#footer").append('<input id="reSubmit" class="btn btnStyle subBtn2" type="button" value="重新提交"/><input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          } else {
            $("#footer").append('<input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
          }
        } else if (userId == res.applicant.user._id) {
          $("#footer").append('<input id="reSubmit" class="btn btnStyle subBtn2" type="button" value="重新提交"/>');
        }
      }
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
  //获取任务文档信息
  getAsserts(id);
  //获取任务文档
  function getAsserts(id) {
    service.getAssetByTaskId(id, function (res) {
      if (res && res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          var pos = res[i].url.lastIndexOf("\/");
          var name = res[i].url.substring(pos + 1);
          if (parseInt(res[i].type) === 0) {
            $('#noFile').css('display', 'none');
            $('#fileList').append('\n          <div class="fileItem">\n                            <label>' + name + '</label>\n                             <a href=' + res[i].url + ' class="download" download=' + name + '></a>\n                            <span>' + res[i].user.name + '</span>\n                            <span>' + dateChange(res[i].created_at) + '</span>\n                            <span>' + dateFormat(res[i].created_at) + '</span>\n                        </div>\n          ');
          } else {
            fileNames.push(name); //存放文件名称
            fileArr.push({ _id: res[i]._id, url: res[i].url }); //存放文件链接
            $('#finishNoFile').css('display', 'none');
            $('#finishFileList').append('\n          <div class="fileItem">\n                            <label>' + name + '</label>\n                             <a href=' + res[i].url + ' class="download" download=' + name + '></a>\n                            <span>' + res[i].user.name + '</span>\n                            <span>' + dateChange(res[i].created_at) + '</span>\n                            <span>' + dateFormat(res[i].created_at) + '</span>\n                        </div>\n          ');
          }
        }
      }
    });
  }
  //点击批准任务按钮
  $(document).on('click', '#receiptTask', function () {
    window.parent.playClickEffect();
    $('#willReceipt').removeClass('dis_n');
    $('.input-text').each(function () {
      $(this).removeClass('error');
    });
    $('input[name="result"]').change(function () {
      $('#receiptLevel').attr({ 'data-value': 10, 'value': 10 });
      $('#leaderEvaluate').val('');
      if ($('#vc').text() === '无') {
        $('#subtractVC').attr({ 'value': 0, 'disabled': true });
      } else {
        $('#subtractVC').val('');
      }
      if ($('#gold').text() === '无') {
        $('#subtractGold').attr({ 'value': 0, 'disabled': true });
      } else {
        $('#subtractGold').val('');
      }
      $('#addVC').val('');
      $('#addGold').val('');
      $('#receiptInfo').val('');
      $('#leaderEvaluate').removeClass('error');
      $('#receiptInfo').removeClass('error');
      if (parseInt($(this).val()) == 10 || parseInt($(this).val()) == 11 && $('#publishPerson').data('id') != userId && (parseInt($('#title').data('type')) === 1 || parseInt($('#title').data('type')) === 2 || parseInt($('#title').data('type')) === 3)) {
        $('.receipt-item').css('display', 'none');
        if (trialTask && trialTask == 'true') {
          $(".hideTaskDetail").addClass('dis_n');
        }
      } else {
        $('.receipt-item').css('display', 'block');
        if (trialTask && trialTask == 'true') {
          $(".hideTaskDetail").css('display', 'none');
        }
      }
      if (parseInt($(this).val()) == 14) {
        $('.taskDetailItem.receipt-item').css('display', 'none');
      }
    });
    if ($('#publishPerson').data('id') != userId && (parseInt($('#title').data('type')) === 1 || parseInt($('#title').data('type')) === 2)) {
      $('.receipt-item').css('display', 'none');
      $('.receipt-fail').css('display', 'none');
    }
    /*if(role_id===4){
      $('#receiptPerson').text('护法');
    }else if(role_id===5){
      $('#receiptPerson').text('盟主');
    }else if(role_id===3){
      $('#receiptPerson').text('帮主');
    }else if(role_id===2){
      $('#receiptPerson').text('长老');
    }*/
    service.getUserLeaderGrade(window.sessionStorage.getItem('user_id'), function (res) {
      $('#receiptPerson').text(res.name);
      personalGold = res.gold;
      personalVC = res.task_vc;
    });
    service.getDepartmentInfo(window.sessionStorage.getItem('department_id'), function (res) {
      departGold = res.gold;
      departVC = res.vc;
    });
    service.getFactionInfo(window.sessionStorage.getItem('faction_id'), function (res) {
      factionGold = res.gold;
      factionVC = res.vc;
    });
    $('#receiptVC').text($('#vc').text());
    $('#receiptGold').text($('#gold').text());
    if ($('#vc').text() === '无') {
      $('#subtractVC').attr({ 'value': 0, 'disabled': true });
    }
    if ($('#gold').text() === '无') {
      $('#subtractGold').attr({ 'value': 0, 'disabled': true });
    }
    $("#footer").empty().append('<div class="footerError">错误啦</div><input id="cancelReceiptTask" class="btn btnStyle subBtn2" type="button" value="取消"/><input id="submitReceiptTask" class="btn btnStyle subBtn2" type="button" value="提交"/>');
  });
  //点击取消批准任务按钮
  $(document).on('click', '#cancelReceiptTask', function () {
    window.parent.playClickEffect();
    $('#willReceipt').addClass('dis_n');
    $('#receiptVC').empty();
    $('#receiptGold').empty();
    $('#receiptLevel').attr('data-value', 0).val(0);
    $('#leaderEvaluate').val('');
    $('#subtractVC').val('');
    $('#addVC').val('');
    $('#subtractGold').val('');
    $('#addGold').val('');
    $('#receiptInfo').val('');
    $('input[name="result"]').eq(0).attr('checked', 'checked');
    $("#footer").empty().append('<input id="receiptTask" class="btn btnStyle subBtn2" type="button" value="验收任务"/>');
  });
  if (trialTask && trialTask == 'true') {
    $(".hideTaskDetail").addClass('dis_n');
  }
  //点击确定提交批准
  $(document).on('click', '#submitReceiptTask', function () {
    window.parent.playClickEffect();
    var obj = {};
    var $status = parseInt($('input[name="result"]:checked').val());
    var originStatus = parseInt($('#status').data('status'));
    var receiptInfo = $('#receiptInfo');
    var leaderEvaluate = $('#leaderEvaluate');
    if ($status === 11) {
      if (originStatus === 6) {
        if (getUrlParam('faction_id')) {
          obj.status = 8;
        } else if (personalTask && personalTask == 'true') {
          obj.status = 7;
        } else if (trialTask && trialTask == 'true') {
          obj.status = 12;
        } else {
          obj.status = 11;
        }
      } else if (originStatus === 7) {
        obj.status = 8;
      } else if (originStatus === 8) {
        //obj.status=9;
        if (getUrlParam('faction_id')) {
          obj.status = 9;
        } else if (personalTask && personalTask == 'true') {
          obj.status = 9;
        } else {
          obj.status = 11;
        }
      } else if (originStatus === 9) {
        obj.status = 11;
      }
    } else {
      obj.status = $status;
    }
    if (parseInt($('#publishPerson').data('id')) === userId || parseInt($('#title').data('type')) === 0) {
      if ($status === 11 || $status === 14) {
        errorTip(receiptInfo, leaderEvaluate);
        if (receiptInfo.val() && leaderEvaluate.val()) {
          if ($('#subtractVC').val() && !isInt($('#subtractVC').val())) {
            $('.footerError').text('扣除VC必须是大于等于0的整数');
            $('#subtractVC').addClass('error');
            $('.footerError').fadeIn(1000);
            setTimeout(function () {
              $('.footerError').fadeOut(1000);
            }, 3000);
          } else if ($('#subtractGold').val() && !isInt($('#subtractGold').val())) {
            $('.footerError').text('扣除金币必须是大于等于0的整数');
            $('#subtractGold').addClass('error');
            $('.footerError').fadeIn(1000);
            setTimeout(function () {
              $('.footerError').fadeOut(1000);
            }, 3000);
          } else if ($('#addVC').val() && !isInt($('#addVC').val())) {
            $('.footerError').text('奖励VC必须是大于等于0的整数');
            $('#addVC').addClass('error');
            $('.footerError').fadeIn(1000);
            setTimeout(function () {
              $('.footerError').fadeOut(1000);
            }, 3000);
          } else if ($('#addGold').val() && !isInt($('#addGold').val())) {
            $('.footerError').text('奖励金币必须是大于等于0的整数');
            $('#addVC').addClass('error');
            $('.footerError').fadeIn(1000);
            setTimeout(function () {
              $('.footerError').fadeOut(1000);
            }, 3000);
          } else if ($('#subtractVC').val() && isInt($('#subtractVC').val()) && parseInt($('#subtractVC').val()) > parseInt($('#receiptVC').text())) {
            $('.footerError').text('扣除VC不能大于悬赏值！');
            $('#subtractVC').addClass('error');
            $('.footerError').fadeIn(1000);
            setTimeout(function () {
              $('.footerError').fadeOut(1000);
            }, 3000);
          } else if ($('#subtractGold').val() && isInt($('#subtractGold').val()) && parseInt($('#subtractGold').val()) > parseInt($('#receiptGold').text())) {
            $('.footerError').text('扣除金币不能大于悬赏值！');
            $('#subtractGold').addClass('error');
            $('.footerError').fadeIn(1000);
            setTimeout(function () {
              $('.footerError').fadeOut(1000);
            }, 3000);
          } else {
            if (!faction_id) {
              if (personalTask && personalTask == 'true') {
                if (parseInt($('#addVC').val()) > parseInt(personalVC)) {
                  $('.footerError').text('\u4E2A\u4EBA\u4EFB\u52A1VC\u5269\u4F59' + personalVC);
                  $('#addVC').addClass('error');
                  $('.footerError').fadeIn(1000);
                  setTimeout(function () {
                    $('.footerError').fadeOut(1000);
                  }, 3000);
                } else if (parseInt($('#addGold').val()) > parseInt(personalGold)) {
                  $('.footerError').text('\u4E2A\u4EBA\u4EFB\u52A1VC\u5269\u4F59' + personalGold);
                  $('#addGold').addClass('error');
                  $('.footerError').fadeIn(1000);
                  setTimeout(function () {
                    $('.footerError').fadeOut(1000);
                  }, 3000);
                } else {
                  obj.extra_vc = parseInt($('#addVC').val());
                  obj.off_vc = parseInt($('#subtractVC').val());
                  obj.extra_gold = parseInt($('#addGold').val());
                  obj.off_gold = parseInt($('#subtractGold').val());
                  obj.check_desc = $('#receiptInfo').val();
                  obj.rating = $('#receiptLevel').val();
                  obj.comments = $('#leaderEvaluate').val();
                  var title = "验收任务";
                  var type = "1";
                  var con = "您确认要验收此任务吗？";
                  var clickBtn = 'submitReceiptTask';
                  zPopup(title, type, con, clickBtn, id, obj);
                }
              } else {
                if (parseInt($('#addVC').val()) > parseInt(departVC)) {
                  $('.footerError').text('\u8054\u76DFVC\u5269\u4F59' + departVC);
                  $('#addVC').addClass('error');
                  $('.footerError').fadeIn(1000);
                  setTimeout(function () {
                    $('.footerError').fadeOut(1000);
                  }, 3000);
                } else if (parseInt($('#addGold').val()) > parseInt(departGold)) {
                  $('.footerError').text('\u8054\u76DF\u91D1\u5E01\u5269\u4F59' + departGold);
                  $('#addGold').addClass('error');
                  $('.footerError').fadeIn(1000);
                  setTimeout(function () {
                    $('.footerError').fadeOut(1000);
                  }, 3000);
                } else {
                  obj.extra_vc = parseInt($('#addVC').val());
                  obj.off_vc = parseInt($('#subtractVC').val());
                  obj.extra_gold = parseInt($('#addGold').val());
                  obj.off_gold = parseInt($('#subtractGold').val());
                  obj.check_desc = $('#receiptInfo').val();
                  obj.rating = $('#receiptLevel').val();
                  obj.comments = $('#leaderEvaluate').val();
                  var _title = "验收任务";
                  var _type = "1";
                  var _con = "您确认要验收此任务吗？";
                  var _clickBtn = 'submitReceiptTask';
                  zPopup(_title, _type, _con, _clickBtn, id, obj);
                }
              }
            } else {
              if (parseInt($('#addVC').val()) > parseInt(factionVC)) {
                $('.footerError').text('\u5E2E\u4F1AVC\u5269\u4F59' + factionVC);
                $('#addVC').addClass('error');
                $('.footerError').fadeIn(1000);
                setTimeout(function () {
                  $('.footerError').fadeOut(1000);
                }, 3000);
              } else if (parseInt($('#addGold').val()) > parseInt(factionGold)) {
                $('.footerError').text('\u5E2E\u4F1A\u91D1\u5E01\u5269\u4F59' + factionGold);
                $('#addGold').addClass('error');
                $('.footerError').fadeIn(1000);
                setTimeout(function () {
                  $('.footerError').fadeOut(1000);
                }, 3000);
              } else {
                obj.extra_vc = parseInt($('#addVC').val());
                obj.off_vc = parseInt($('#subtractVC').val());
                obj.extra_gold = parseInt($('#addGold').val());
                obj.off_gold = parseInt($('#subtractGold').val());
                obj.check_desc = $('#receiptInfo').val();
                obj.rating = $('#receiptLevel').val();
                obj.comments = $('#leaderEvaluate').val();
                var _title2 = "验收任务";
                var _type2 = "1";
                var _con2 = "您确认要验收此任务吗？";
                var _clickBtn2 = 'submitReceiptTask';
                zPopup(_title2, _type2, _con2, _clickBtn2, id, obj);
              }
            }
          }
        }
      } else {
        errorTip(receiptInfo);
        if (receiptInfo.val()) {
          obj.check_desc = $('#receiptInfo').val();
          var _title3 = "验收任务";
          var _type3 = "1";
          var _con3 = "您确认要验收此任务吗？";
          var _clickBtn3 = 'submitReceiptTask';
          zPopup(_title3, _type3, _con3, _clickBtn3, id, obj);
        }
      }
    } else {
      if ($status === 10) {
        errorTip(receiptInfo);
      }
      if ($status !== 10 || $status === 10 && receiptInfo.val()) {
        obj.check_desc = $('#receiptInfo').val();
        var _title4 = "验收任务";
        var _type4 = "1";
        var _con4 = "您确认要验收此任务吗？";
        var _clickBtn4 = 'submitReceiptTask';
        zPopup(_title4, _type4, _con4, _clickBtn4, id, obj);
      }
    }
  });
  $(document).on('click', '#reSubmit', function () {
    window.parent.playClickEffect();
    $('#taskReceipt').addClass('dis_n');
    $('#taskReceiptWrite').removeClass('dis_n');
    $('#finishDescWrite').val($('#finishDesc').text());
    $('#finishFileContainerWrite>.item>.item').remove();
    if (fileNames.length > 0) {
      for (var i = 0; i < fileNames.length; i++) {
        addFile(fileNames[i]);
      }
    }
    $("#footer").empty().append('<input id="cancelReSubmit" class="btn btnStyle subBtn2" type="button" value="取消"/><input id="confirmReSubmit" class="btn btnStyle subBtn2" type="button" value="提交"/>');
  });
  $(document).on('click', '#cancelReSubmit', function () {
    window.parent.playClickEffect();
    $('#taskReceipt').removeClass('dis_n');
    $('#taskReceiptWrite').addClass('dis_n');
    $("#footer").empty().append('<input id="reSubmit" class="btn btnStyle subBtn2" type="button" value="重新提交"/>');
  });
  $(document).on('click', '#confirmReSubmit', function () {
    window.parent.playClickEffect();
    var finishDesc = $('#finishDescWrite');
    errorTip(finishDesc);
    if (finishDesc.val()) {
      var title = "提交任务";
      var type = "1";
      var con = "您确认要重新提交此任务吗？";
      var clickBtn = 'confirmReSubmit';
      zPopup(title, type, con, clickBtn, id);
    }
  });
  function addFile(name) {
    $('.fileText').before('\n    <div class="item">\n          <span class="filename">' + name + '</span>\n          <span class="delete"></span>\n        </div>\n    ');
  }
  //上传文件
  $('#file').change(fileChange);
  //删除文件
  $(document).on('click', '.delete', deleteFile);
  function fileChange() {
    var _this = this;

    service.addAssert('file', function (res) {
      var file = $(_this).val();
      var fileName = getFileName(file);
      addFile(fileName);
      fileNames.push(fileName);
      fileArr.push({ url: res.url });
      $('#file').change(fileChange);
    });
  }
  function getFileName(o) {
    var pos = o.lastIndexOf("\\");
    return o.substring(pos + 1);
  }
  function deleteFile() {
    var index = $('#finishFileContainerWrite .delete').index($(this));
    fileNames.splice(index, 1);
    fileArr.splice(index, 1);
    $(this).parent().remove();
  }
  function zPopup(title, type, con, clickBtn, id, obj) {
    var h = "";
    if (type == 1) {
      //两个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con"><span>' + con + '</span></div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn ' + clickBtn + '">确定</a>' + '</div>' + '</div>';
    } else if (type == 2) {
      //一个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class="u-Popup-close  btnStyle" style="margin-right: 0;" href="javascript:void(0)">确定</a>' + '</div>' + '</div>';
    }
    $(".feehideBox").html(h);
    //取消按钮
    $(".u-Popup-close").click(function () {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });

    //确定任务验收单提交
    $(".confirmReSubmit").off("click").on("click", function () {
      window.parent.playClickEffect();
      var obj = { status: 6, complete_desc: $('#finishDescWrite').val() };
      obj.assets = fileArr;
      service.edit(id, obj, function (res) {
        if (!faction_id) {
          if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
            if (personalTask && personalTask == 'true') {
              window.location.href = 'willReceipt.html?taskId=' + id + '&fromPage=teaRoom&teamId=' + teamId + '&personalTask=true';
            } else {
              window.location.href = 'willReceipt.html?taskId=' + id + '&fromPage=teaRoom&teamId=' + teamId;
            }
          } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
            if (personalTask && personalTask == 'true') {
              window.location.href = 'willReceipt.html?taskId=' + id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&personalTask=true';
            } else {
              window.location.href = 'willReceipt.html?taskId=' + id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
            }
          } else {
            if (myTask && myTask == 'true') {
              if (personalTask && personalTask == 'true') {
                window.location.href = 'willReceipt.html?taskId=' + id + '&personalTask=true&myTask=true';
              } else {
                window.location.href = 'willReceipt.html?taskId=' + id + '&myTask=true';
              }
            } else {
              if (personalTask && personalTask == 'true') {
                window.location.href = 'willReceipt.html?taskId=' + id + '&personalTask=true';
              } else {
                window.location.href = 'willReceipt.html?taskId=' + id;
              }
            }
          }
        } else {
          if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
            window.location.href = 'willReceipt.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoom&teamId=' + teamId;
          } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
            window.location.href = 'willReceipt.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
          } else {
            if (myTask && myTask == 'true') {
              window.location.href = 'willReceipt.html?taskId=' + id + '&faction_id=' + faction_id + '&myTask=true';
            } else {
              window.location.href = 'willReceipt.html?taskId=' + id + '&faction_id=' + faction_id;
            }
          }
        }
      });
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
    //确定验收任务
    $(".submitReceiptTask").off("click").on("click", function () {
      window.parent.playClickEffect();
      service.edit(id, obj, function (res) {
        if (parseInt(res.status) === 11) {
          if (!faction_id) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = 'tempAwardTask.html?taskId=' + id + '&fromPage=teaRoom&teamId=' + teamId;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'tempAwardTask.html?taskId=' + id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
            } else {
              if (myTask && myTask == 'true') {
                if (personalTask && personalTask == 'true') {
                  window.location.href = 'tempAwardTask.html?taskId=' + id + '&personalTask=true&myTask=true';
                } else {
                  window.location.href = 'tempAwardTask.html?taskId=' + id + '&myTask=true';
                }
              } else {
                if (personalTask && personalTask == 'true') {
                  window.location.href = 'tempAwardTask.html?taskId=' + id + '&personalTask=true';
                } else {
                  window.location.href = 'tempAwardTask.html?taskId=' + id;
                }
              }
            }
          } else {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = 'tempAwardTask.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoom&teamId=' + teamId;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'tempAwardTask.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
            } else {
              if (myTask && myTask == 'true') {
                window.location.href = 'tempAwardTask.html?taskId=' + id + '&faction_id=' + faction_id + '&myTask=true';
              } else {
                window.location.href = 'tempAwardTask.html?taskId=' + id + '&faction_id=' + faction_id;
              }
            }
          }
        } else if (parseInt(res.status) === 10) {
          if (!faction_id) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              if (personalTask && personalTask == 'true') {
                window.location.href = 'tempContinueTask.html?taskId=' + id + '&fromPage=teaRoom&teamId=' + teamId + '&personalTask=true';
              } else if (trialTask && trialTask == 'true') {
                window.location.href = 'tempContinueTask.html?taskId=' + id + '&fromPage=teaRoom&teamId=' + teamId + '&trialTask=true';
              } else {
                window.location.href = 'tempContinueTask.html?taskId=' + id + '&fromPage=teaRoom&teamId=' + teamId;
              }
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'tempContinueTask.html?taskId=' + id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
            } else {
              if (myTask && myTask == 'true') {
                if (personalTask && personalTask == 'true') {
                  window.location.href = 'tempContinueTask.html?taskId=' + id + '&personalTask=true&myTask=true';
                } else if (trialTask && trialTask == 'true') {
                  window.location.href = 'tempContinueTask.html?taskId=' + id + '&trialTask=true&myTask=true';
                } else {
                  window.location.href = 'tempContinueTask.html?taskId=' + id + '&myTask=true';
                }
              } else {
                if (personalTask && personalTask == 'true') {
                  window.location.href = 'tempContinueTask.html?taskId=' + id + '&personalTask=true';
                } else if (trialTask && trialTask == 'true') {
                  window.location.href = 'tempContinueTask.html?taskId=' + id + '&trialTask=true';
                } else {
                  window.location.href = 'tempContinueTask.html?taskId=' + id;
                }
              }
            }
          } else {
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
        } else if (parseInt(res.status) === 14) {
          if (!faction_id) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = 'tempFailTask.html?taskId=' + id + '&fromPage=teaRoom&teamId=' + teamId;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'tempFailTask.html?taskId=' + id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
            } else {
              if (myTask && myTask == 'true') {
                if (personalTask && personalTask == 'true') {
                  window.location.href = 'tempFailTask.html?taskId=' + id + '&personalTask=true&myTask=true';
                } else if (trialTask && trialTask == 'true') {
                  window.location.href = 'tempFailTask.html?taskId=' + id + '&trialTask=true&myTask=true';
                } else {
                  window.location.href = 'tempFailTask.html?taskId=' + id + '&myTask=true';
                }
              } else {
                if (personalTask && personalTask == 'true') {
                  window.location.href = 'tempFailTask.html?taskId=' + id + '&personalTask=true';
                } else if (trialTask && trialTask == 'true') {
                  window.location.href = 'tempFailTask.html?taskId=' + id + '&trialTask=true';
                } else {
                  window.location.href = 'tempFailTask.html?taskId=' + id;
                }
              }
            }
          } else {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = 'tempFailTask.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoom&teamId=' + teamId;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'tempFailTask.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
            } else {
              if (myTask && myTask == 'true') {
                window.location.href = 'tempFailTask.html?taskId=' + id + '&faction_id=' + faction_id + '&myTask=true';
              } else {
                window.location.href = 'tempFailTask.html?taskId=' + id + '&faction_id=' + faction_id;
              }
            }
          }
        } else if (parseInt(res.status) === 12) {
          if (!faction_id) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = 'tempCompleteTask.html?taskId=' + id + '&fromPage=teaRoom&teamId=' + teamId;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'tempCompleteTask.html?taskId=' + id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
            } else {
              if (myTask && myTask == 'true') {
                if (personalTask && personalTask == 'true') {
                  window.location.href = 'tempCompleteTask.html?taskId=' + id + '&personalTask=true&myTask=true';
                } else if (trialTask && trialTask == 'true') {
                  window.location.href = 'tempCompleteTask.html?taskId=' + id + '&trialTask=true&myTask=true';
                } else {
                  window.location.href = 'tempCompleteTask.html?taskId=' + id + '&myTask=true';
                }
              } else {
                if (personalTask && personalTask == 'true') {
                  window.location.href = 'tempCompleteTask.html?taskId=' + id + '&personalTask=true';
                } else if (trialTask && trialTask == 'true') {
                  window.location.href = 'tempCompleteTask.html?taskId=' + id + '&trialTask=true';
                } else {
                  window.location.href = 'tempCompleteTask.html?taskId=' + id;
                }
              }
            }
          } else {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = 'tempFailTask.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoom&teamId=' + teamId;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'tempFailTask.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
            } else {
              if (myTask && myTask == 'true') {
                window.location.href = 'tempFailTask.html?taskId=' + id + '&faction_id=' + faction_id + '&myTask=true';
              } else {
                window.location.href = 'tempFailTask.html?taskId=' + id + '&faction_id=' + faction_id;
              }
            }
          }
        } else if (parseInt(res.status) === 6 || parseInt(res.status) === 7 || parseInt(res.status) === 8 || parseInt(res.status) === 9) {
          if (!faction_id) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              if (personalTask && personalTask == 'true') {
                window.location.href = 'willReceipt.html?taskId=' + id + '&fromPage=teaRoom&teamId=' + teamId + '&personalTask=true';
              } else {
                window.location.href = 'willReceipt.html?taskId=' + id + '&fromPage=teaRoom&teamId=' + teamId;
              }
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              if (personalTask && personalTask == 'true') {
                window.location.href = 'willReceipt.html?taskId=' + id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
              } else {
                window.location.href = 'willReceipt.html?taskId=' + id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1&personalTask=true';
              }
            } else {
              if (myTask && myTask == 'true') {
                if (personalTask && personalTask == 'true') {
                  window.location.href = 'willReceipt.html?taskId=' + id + '&personalTask=true&myTask=true';
                } else {
                  window.location.href = 'willReceipt.html?taskId=' + id + '&myTask=true';
                }
              } else {
                if (personalTask && personalTask == 'true') {
                  window.location.href = 'willReceipt.html?taskId=' + id + '&personalTask=true';
                } else {
                  window.location.href = 'willReceipt.html?taskId=' + id;
                }
              }
            }
          } else {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              if (personalTask && personalTask == 'true') {
                window.location.href = 'willReceipt.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoom&teamId=' + teamId + '&personalTask=true';
              } else {
                window.location.href = 'willReceipt.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoom&teamId=' + teamId;
              }
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              if (personalTask && personalTask == 'true') {
                window.location.href = 'willReceipt.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1&personalTask=true';
              } else {
                window.location.href = 'willReceipt.html?taskId=' + id + '&faction_id=' + faction_id + '&fromPage=teaRoomEdit&teamId=' + teamId + '&roleId=1';
              }
            } else {
              if (myTask && myTask == 'true') {
                window.location.href = 'willReceipt.html?taskId=' + id + '&faction_id=' + faction_id + '&myTask=true';
              } else {
                window.location.href = 'willReceipt.html?taskId=' + id + '&faction_id=' + faction_id;
              }
            }
          }
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