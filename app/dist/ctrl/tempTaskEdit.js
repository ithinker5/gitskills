'use strict';

$(function () {
  var service = new SERVICE();
  //从哪个页面跳转过来的，判断时联盟任务还是帮会任务
  // let fromPage = getUrlParam('fromPage');
  var department_id = window.sessionStorage.getItem('department_id');
  var faction_id = parseInt(getUrlParam('faction_id'));
  var personalTask = getUrlParam('personalTask');
  var myTask = getUrlParam('myTask');
  var teamId = getUrlParam('teamId');
  var id = parseInt(getUrlParam('taskId'));
  var section_id = window.sessionStorage.getItem('section_id');
  var role_id = parseInt(window.sessionStorage.getItem('role_id'));
  var fileNames = []; //存放文件名称
  var fileArr = []; //存放文件链接
  var taskObj = {}; //提交时的task对象
  var expRole = [];
  var properties = [];
  var departInfo = {};
  var factionInfo = {};
  var sectionInfo = {};
  var personalInfo = {};
  var departGold = 0;
  var factionGold = 0;
  var personalGold = 0;
  var factionVC = 0;
  var departVC = 0;
  var personalVC = 0;
  if (faction_id || faction_id == 0) {
    getFactionInfo(faction_id);
    getProperties();
    getDepartmentInfo(department_id);
    getUserLeaderGrade(window.sessionStorage.getItem('user_id'));
  } else if (personalTask && personalTask == 'true') {
    getProperties();
    if (section_id != '0') {
      getSectionsInfo(section_id);
    }
    if (faction_id != '0') {
      getFactionInfo(window.sessionStorage.getItem('faction_id'));
    }
    getDepartmentInfo(department_id);
    getUserLeaderGrade(window.sessionStorage.getItem('user_id'));
  } else {
    getProperties();
    getDepartmentInfo(department_id);
    getUserLeaderGrade(window.sessionStorage.getItem('user_id'));
  }

  /*模拟下拉框效果*/
  $(".select_box input").click(function () {
    var thisinput = $(this);
    var thisul = $(this).parent().find("ul");
    if (thisul.css("display") == "none") {
      thisul.fadeIn("100");
      thisul.unbind('hover').hover(function () {}, function () {
        thisul.fadeOut("100");
      });
      thisul.find("li").unbind('click').click(function () {
        if (thisinput.attr('id') == 'taskLevel') {
          var type = 0,
              subtype = 1,
              level = parseInt($(this).val());
          if (faction_id || faction_id === 0) {
            type = parseInt($('#taskTypeText').data('type'));
            subtype = parseInt($('#taskTypeText').data('subtype'));
            level = parseInt($(this).val());
          }
          for (var i = 0; i < expRole.length; i++) {
            if (parseInt(expRole[i].type) === type && parseInt(expRole[i].subtype) === subtype && parseInt(expRole[i].level) === level) {
              $('#exp').text(expRole[i].exp);
              $("#base_vc").val(expRole[i].default_vc);
              $("#gold").val(expRole[i].default_gold);
              break;
            }
          }
        }
        thisinput.attr('data-value', $(this).val());
        thisinput.attr('data-num', $(this).val());
        thisinput.attr('value', $(this).text());
        thisul.fadeOut("100");
      }).unbind('hover').hover(function () {
        $(this).addClass("hover");
      }, function () {
        $(this).removeClass("hover");
      });
    } else {
      thisul.fadeOut("fast");
    }
  });
  $('.btnBack').click(function () {
    back();
  });
  if (window.sessionStorage.getItem('tempTaskObj')) {
    init(JSON.parse(window.sessionStorage.getItem('tempTaskObj')));
  } else {
    //获取任务信息
    getTask(id);
    getAsserts(id);
  }
  getExpRole();
  //任务详情
  function getTask(id) {
    service.getById(id, function (res) {
      $('#title').val(res.title);
      $('#desc').val(res.remark);
      var $taskTypeText = $('#taskTypeText');
      if (res.type == '2') {
        $taskTypeText.text('个人任务').attr({ 'data-type': res.type, 'data-subtype': res.subtype });
        $taskTypeText.css('width', 'inherit');
      } else if (res.type == '3') {
        $taskTypeText.text('试炼任务').attr({ 'data-type': res.type, 'data-subtype': res.subtype });
        $taskTypeText.css('width', 'inherit');
      } else {
        switch (res.subtype) {
          case 1:
            $taskTypeText.text('联盟临时任务').attr({ 'data-type': res.type, 'data-subtype': res.subtype });
            break;
          case 2:
            $taskTypeText.text('帮会挑战任务').attr({ 'data-type': res.type, 'data-subtype': res.subtype });
            break;
          case 3:
            $taskTypeText.text('帮会基础任务').attr({ 'data-type': res.type, 'data-subtype': res.subtype });
            break;
          case 4:
            $taskTypeText.text('帮会临时任务').attr({ 'data-type': res.type, 'data-subtype': res.subtype });
            break;
        }
      }
      $taskTypeText.attr('data-status', res.status);
      if (personalTask && personalTask == 'true') {
        $(".taskGrade").addClass("dis_n");
      } else {
        if (res.level || res.level == 0) {
          $('#taskLevel').attr('data-value', res.level).attr('data-num', res.level).attr('value', res.level + '级');
        }
      }
      if (res.deadline) {
        document.getElementById('deadline').valueAsDate = new Date(res.deadline);
      }
      // $('#publishDate').val(dateChange(res.created_at));
      $('#exp').text(res.exp > 0 ? res.exp : 0);
      // $('#finishDate').val(dateChange(res.deadline));
      var $status = $('#status');
      switch (res.status) {
        case -1:
          $status.text('删除');break;
        case 0:
          $status.text('待审核');break;
        case 1:
          $status.text('待审核');break;
        case 2:
          $status.text('待审核');break;
        case 3:
          $status.text('驳回');break;
        case 4:
          $status.text('悬赏中');break;
        case 5:
          $status.text('进行中');break;
        case 6:
          $status.text('待验收');break;
        case 7:
          $status.text('待验收');break;
        case 8:
          $status.text('待验收');break;
        case 9:
          $status.text('待验收');break;
        case 10:
          $status.text('返工');break;
        case 11:
          $status.text('待分配');break;
        case 12:
          $status.text('已完成');break;
        case 13:
          $status.text('已关闭');break;
      }
      $('#publishPerson').val(res.created.name);
      $('#base_vc').val(res.base_vc > 0 ? res.base_vc : 0).attr('data-vcorigin', res.base_vc);
      $('#gold').val(res.gold > 0 ? res.gold : 0).attr('data-goldorigin', res.gold);
      $('#mortgage').val(res.mortgage > 0 ? res.mortgage : 0);
      if (res.assets && res.assets.length > 0) {
        fileArr = res.assets;
        for (var i = 0; i < res.assets.length; i++) {
          var pos = res.assets[i].url.lastIndexOf("\/");
          var name = res.assets[i].url.substring(pos + 1);
          fileNames.push(name);
          addFile(name);
        }
      }
      if (res.leader_level || res.leader_level != 0) {
        $('#leader_level').attr('value', res.leader_level);
      }
      if (res.leader_grade) {
        $('#leader_grade').attr('value', res.leader_grade).val(res.leader_grade);
      }
    });
  }
  //获取任务文档
  function getAsserts(id) {
    service.getAssetByTaskId(id, function (res) {
      if (res && res.length > 0) {
        fileArr = [];
        for (var i = 0; i < res.length; i++) {
          fileArr.push({ _id: res[i]._id, url: res[i].url });
          var pos = res[i].url.lastIndexOf("\/");
          var name = res[i].url.substring(pos + 1);
          fileNames.push(name);
          addFile(name);
        }
      }
    });
  }
  //返回到临时任务页面
  function back() {
    window.parent.playClickEffect();
    /*if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
      window.location.href = `createTearm.html?teamId=${getUrlParam('teamId')}`;
    }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
      window.location.href = `createTearmDetail.html?teamId=${getUrlParam('teamId')}&roleId=1`;
    }else{*/
    /*if (getUrlParam('skipCocos')&&getUrlParam('skipCocos')=='true'){
      window.parent.closeWebPop();
    }else{*/
    if (!faction_id) {
      if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
        window.location.href = 'tempTaskDetail.html?teamId=' + teamId + '&taskId=' + id;
      } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
        window.location.href = 'tempTaskDetail.html?teamId=' + teamId + '&taskId=' + id + '&roleId=1';
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
    } else {
      if (getUrlParam('fromPage') && getUrlParam('fromPage') == 'reject') {
        if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
          window.location.href = 'waitCheckTask.html?teamId=' + teamId + '&faction_id=' + faction_id + '&taskId=' + id;
        } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
          window.location.href = 'waitCheckTask.html?teamId=' + teamId + '&faction_id=' + faction_id + '&taskId=' + id + '&roleId=1';
        } else {
          if (myTask && myTask == 'true') {
            window.location.href = 'waitCheckTask.html?taskId=' + id + '&faction_id=' + faction_id + '&myTask=true';
          } else {
            window.location.href = 'waitCheckTask.html?taskId=' + id + '&faction_id=' + faction_id;
          }
        }
      } else {
        if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
          window.location.href = 'tempTaskDetail.html?teamId=' + teamId + '&faction_id=' + faction_id + '&taskId=' + id;
        } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
          window.location.href = 'tempTaskDetail.html?teamId=' + teamId + '&faction_id=' + faction_id + '&taskId=' + id + '&roleId=1';
        } else {
          if (myTask && myTask == 'true') {
            window.location.href = 'tempTaskDetail.html?taskId=' + id + '&faction_id=' + faction_id + '&myTask=true';
          } else {
            window.location.href = 'tempTaskDetail.html?taskId=' + id + '&faction_id=' + faction_id;
          }
        }
      }
    }
    window.sessionStorage.removeItem('tempTaskObj');
  }
  $('#addLeader').click(function () {
    var temp = getObj();
    window.sessionStorage.setItem('tempTaskObj', JSON.stringify(temp));
    if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
      window.location.href = 'assignLeader.html?fromPage=edit&fromPage=teaRoom&taskId=' + id + '&teamId=' + getUrlParam('teamId');
    } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
      window.location.href = 'assignLeader.html?fromPage=edit&fromPage=teaRoomEdit&taskId=' + id + '&teamId=' + getUrlParam('teamId') + '&roleId=1';
    } else {
      if (!faction_id) {
        if (myTask && myTask == 'true') {
          if (personalTask && personalTask == 'true') {
            window.location.href = 'assignLeader.html?fromPage=edit&taskId=' + id + '&personalTask=true&myTask=true';
          } else {
            window.location.href = 'assignLeader.html?fromPage=edit&taskId=' + id + '&myTask=true';
          }
        } else {
          if (personalTask && personalTask == 'true') {
            window.location.href = 'assignLeader.html?fromPage=edit&taskId=' + id + '&personalTask=true';
          } else {
            window.location.href = 'assignLeader.html?fromPage=edit&taskId=' + id;
          }
        }
      } else {
        if (myTask && myTask == 'true') {
          window.location.href = 'assignLeader.html?fromPage=edit&taskId=' + id + '&faction_id=' + faction_id + '&myTask=true';
        } else {
          window.location.href = 'assignLeader.html?fromPage=edit&taskId=' + id + '&faction_id=' + faction_id;
        }
      }
    }
  });
  //在页面展示添加的文档
  function addFile(name) {
    $('#fileContainer .item label').before('\n    <div class="item2">\n          <span class="filename">' + name + '</span>\n          <span class="delete"></span>\n        </div>\n    ');
  }
  $(document).on('click', '.delete', deleteFile);
  //删除文档
  function deleteFile() {
    var index = $('#fileContainer .delete').index($(this));
    fileNames.splice(index, 1);
    fileArr.splice(index, 1);
    $(this).parent().remove();
  }
  $('#submit').click(function () {
    window.parent.playClickEffect();
    editTask(id, getObj());
  });
  //获取用户填写的信息
  function getObj() {
    if (faction_id || faction_id === 0) {
      taskObj.type = parseInt($('#taskTypeText').data('type'));
      taskObj.subtype = parseInt($('#taskTypeText').data('subtype'));
    } else if (personalTask && personalTask == 'true') {
      taskObj.type = 2;
      taskObj.subtype = 5;
    } else {
      taskObj.type = 0;
      taskObj.subtype = 1;
    }
    taskObj.title = $('#title').val();
    taskObj.remark = $('#desc').val();
    taskObj.level = parseInt($('#taskLevel').data('num'));
    taskObj.deadline = parseInt(new Date($('#deadline').val()).getTime());
    taskObj.exp = parseInt($('#exp').text());
    taskObj.base_vc = parseInt($('#base_vc').val());
    taskObj.origin_vc = parseInt($('#base_vc').data('vcorigin'));
    taskObj.origin_gold = parseInt($('#gold').data('goldorigin'));
    taskObj.gold = parseInt($('#gold').val());
    taskObj.status = parseInt($('#taskTypeText').data('status'));
    taskObj.mortgage = $('#mortgage').val();
    taskObj.applicant_id = $('input[name="applicant_id"]:checked').val();
    taskObj.assets = fileArr;
    if (taskObj.applicant_id || taskObj.applicant_id == 0) {
      taskObj.leader_level = $('#leader_level').val();
      taskObj.leader_grade = $('#leader_grade').val().toUpperCase();
    } else {
      taskObj.leader_level = '';
      taskObj.leader_grade = '';
    }
    return taskObj;
  }
  function init(obj) {
    if (obj) {
      var $taskTypeText = $('#taskTypeText');
      if (obj.type == '2') {
        $taskTypeText.text('个人任务').attr({ 'data-type': obj.type, 'data-subtype': obj.subtype });
        $taskTypeText.css('width', 'inherit');
      } else {
        switch (parseInt(obj.subtype)) {
          case 1:
            $taskTypeText.text('联盟临时任务').attr({ 'data-type': obj.type, 'data-subtype': obj.subtype, 'data-status': obj.status });
            break;
          case 2:
            $taskTypeText.text('帮会挑战任务').attr({ 'data-type': obj.type, 'data-subtype': obj.subtype, 'data-status': obj.status });
            break;
          case 3:
            $taskTypeText.text('帮会基础任务').attr({ 'data-type': obj.type, 'data-subtype': obj.subtype, 'data-status': obj.status });
            break;
          case 4:
            $taskTypeText.text('帮会临时任务').attr({ 'data-type': obj.type, 'data-subtype': obj.subtype, 'data-status': obj.status });
            break;
        }
      }
      $taskTypeText.attr('data-status', obj.status);
      // $('#taskType').attr('data-value', obj.subtype || 1);
      $('#title').attr('value', obj.title || '');
      $('#desc').attr('value', obj.remark || '');
      if (obj.level || obj.level == 0) {
        $('#taskLevel').attr('data-value', obj.level).attr('data-num', obj.level).attr('value', obj.level + '级');
      }
      if (obj.deadline) {
        document.getElementById('deadline').valueAsDate = new Date(obj.deadline);
      }
      $('#exp').text(obj.exp);
      $('#base_vc').attr({ 'value': obj.base_vc || '', 'data-vcorigin': obj.origin_vc });
      $('#mortgage').attr('value', obj.mortgage || '');
      $('#gold').attr({ 'value': obj.gold || '', 'data-goldorigin': obj.origin_gold });
      if (obj.leader_level || obj.leader_level != 0) {
        $('#leader_level').attr('value', obj.leader_level);
      }
      if (obj.leader_grade) {
        $('#leader_grade').attr('value', obj.leader_grade).val(obj.leader_grade);
        // let $lis=$('#leader_grade').parent().find("ul").find('li');
        // for(let i=0;i<$lis.length;i++){
        //   let li=$lis[i];
        //   if($(li).val()==obj.leader_grade){
        //     $('#leader_grade')
        //       .attr('data-value', $(li).text())
        //       .attr('value', $(li).text());
        //     break;
        //   }
        // }
      }
      if (obj.assets && obj.assets.length > 0) {
        fileArr = obj.assets;
        for (var i = 0; i < obj.assets.length; i++) {
          var pos = obj.assets[i].url.lastIndexOf("\/");
          var name = obj.assets[i].url.substring(pos + 1);
          fileNames.push(name);
          addFile(name);
        }
      }
      window.sessionStorage.removeItem('tempTaskObj');
    } else {
      // $('#taskType').attr('data-value', 1);
      $('input[name="applicant_id"]').eq(0).attr('checked', 'checked');
    }
  }
  if (window.sessionStorage.getItem('selectId') || window.sessionStorage.getItem('selectId') == 0) {
    $('#leaderRequire').css('display', 'none');
    $('#applicant_id').val('' + window.sessionStorage.getItem('selectId')).attr({ 'data-name': '' + window.sessionStorage.getItem('selectLeaderName'), 'data-gold': '' + window.sessionStorage.getItem('selectLeaderGold') });
    $('#applicant').css('display', 'inline-block').after('<span style="vertical-align: middle">' + window.sessionStorage.getItem('selectLeaderName') + '</span>');
    $('input[name="applicant_id"]').eq(1).attr('checked', 'checked');
    window.sessionStorage.removeItem('selectId');
    window.sessionStorage.removeItem('selectLeaderName');
    window.sessionStorage.removeItem('selectLeaderGold');
  } else {
    $('input[name="applicant_id"]').eq(0).attr('checked', 'checked');
  }
  $('input[name="applicant_id"]').change(function () {
    var selectedvalue = parseInt($("input[name='applicant_id']:checked").val());
    if (selectedvalue || selectedvalue === 0) {
      $('input[name="applicant_id"]').eq(1).attr('checked', 'checked');
      $('#leaderRequire').css('display', 'none');
    } else {
      $('input[name="applicant_id"]').eq(0).attr('checked', 'checked');
      $('#leaderRequire').css('display', 'block');
      $('#leader_level').val('');
      $('#leader_grade').val('I');
      $('#leader_grade').data('value', 1);
    }
  });

  //上传文件
  $('#file').change(fileChange);
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
  //修改任务
  function editTask(id, task) {
    var title = $('#title');
    var desc = $('#desc');
    var deadline = $('#deadline');
    errorTip(title, desc, deadline);
    if ($('#leader_grade').val()) {
      if (allGrade.indexOf($('#leader_grade').val().toUpperCase()) < 0) {
        errorTip($('#leader_grade'));
        $('#footerError').text('请输入正确的岗位级别！');
        $('#footerError').fadeIn(1000);
        setTimeout(function () {
          $('#footerError').fadeOut(1000);
        }, 3000);
        return;
      } else {
        if (allGrade.indexOf($('#leader_grade').val().toUpperCase()) > $('#leader_grade').data('gradeindex')) {
          errorTip($('#leader_grade'));
          $('#footerError').text('最低岗位级别不能高于您的级别！');
          $('#footerError').fadeIn(1000);
          setTimeout(function () {
            $('#footerError').fadeOut(1000);
          }, 3000);
          return;
        }
      }
    }
    if (title.val() && desc.val() && deadline.val()) {
      var temp = function temp() {
        if (!faction_id) {
          if (personalTask && personalTask == 'true') {
            var personal_vc = 0;
            var section_vc = 0;
            var faction_vc = 0;
            var con = "";
            var type = "1";
            for (var i = 0; i < properties.length; i++) {
              if (properties[i].name === 'personal_vc') {
                personal_vc = parseInt(properties[i].value); //20
              } else if (properties[i].name === 'section_vc') {
                section_vc = parseInt(properties[i].value); //40
              } else if (properties[i].name === 'faction_vc') {
                faction_vc = parseInt(properties[i].value); //60
              }
            }
            var userInputVc = parseInt($('#base_vc').val());
            if (role_id === 2) {
              if (userInputVc > section_vc) {
                var name = factionInfo.chief.name;
                if (factionInfo.chief.name != departInfo.master.name) {
                  name += '\u3001' + departInfo.master.name;
                }
                con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + section_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + name + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                type = "3";
              } else {
                type = "1";
                con = "您确认要发布此任务吗？";
              }
            } else if (role_id === 1) {
              /*若帮派不存在直接盟主审核，若堂不存在，则直接由帮主和盟主审核*/
              if (userInputVc > personal_vc && userInputVc < section_vc) {
                if (window.sessionStorage.getItem('section_id') == '' || window.sessionStorage.getItem('section_id') == '0') {
                  var _name = departInfo.master.name;
                  con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + personal_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                  type = "3";
                } else {
                  var _name2 = sectionInfo.master.name;
                  con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + personal_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name2 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                  type = "3";
                }
              } else if (userInputVc > section_vc && userInputVc < faction_vc) {
                if (window.sessionStorage.getItem('section_id') == '' || window.sessionStorage.getItem('section_id') == '0') {
                  if (window.sessionStorage.getItem('faction_id') == '' || window.sessionStorage.getItem('faction_id') == '0') {
                    var _name3 = departInfo.master.name;
                    con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + section_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name3 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                    type = "3";
                  } else {
                    var _name4 = sectionInfo.master.name;
                    if (factionInfo.chief.name != departInfo.master.name) {
                      _name4 += '\u3001' + section_vc.master.name;
                    };
                    con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + section_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name4 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                    type = "3";
                  }
                } else {
                  if (window.sessionStorage.getItem('faction_id') == '' || window.sessionStorage.getItem('faction_id') == '0') {
                    var _name5 = sectionInfo.master.name;
                    _name5 += '\u3001' + departInfo.master.name;
                    con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + section_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name5 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                    type = "3";
                  } else {
                    var _name6 = sectionInfo.master.name;
                    if (factionInfo.chief.name != departInfo.master.name) {
                      _name6 += '\u3001' + factionInfo.chief.name;
                    };
                    con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + section_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name6 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                    type = "3";
                  }
                }
              } else if (userInputVc > faction_vc) {
                if (window.sessionStorage.getItem('section_id') == '' || window.sessionStorage.getItem('section_id') == '0') {
                  if (window.sessionStorage.getItem('faction_id') == '' || window.sessionStorage.getItem('faction_id') == '0') {
                    var _name7 = departInfo.master.name;
                    con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + faction_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name7 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                    type = "3";
                  } else {
                    var _name8 = factionInfo.chief.name;
                    if (factionInfo.chief.name != departInfo.master.name) {
                      _name8 += '\u3001' + departInfo.master.name;
                    };
                    con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + faction_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name8 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                    type = "3";
                  }
                } else {
                  var _name9 = sectionInfo.master.name;
                  if (factionInfo.chief.name != departInfo.master.name) {
                    _name9 += '\u3001' + factionInfo.chief.name;
                    _name9 += '\u3001' + departInfo.master.name;
                  }
                  con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + faction_vc + '\uFF0C\u4EFB\u52A1\u5C06<br/>\u63D0\u4EA4' + _name9 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                  type = "3";
                }
              } else {
                type = "1";
                con = "您确认要发布此任务吗？";
              }
            } else if (role_id === 3) {
              if (userInputVc > faction_vc) {
                con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + faction_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + departInfo.master.name + '\u5BA1\u6838\uFF0C<br>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                type = "3";
              } else {
                con = "您确认要发布此任务吗？";
                type = "1";
              }
            } else {
              type = "1";
              con = "您确认要发布此任务吗？";
            }
            var _title = "发布任务";
            zPopup(_title, type, con, id, task);
          } else {
            var _title2 = "重新发布";
            var _type = "1";
            var _con = "您确认要重新发布此任务吗？";
            zPopup(_title2, _type, _con, id, task);
          }
        } else {
          var _role_id = parseInt(window.sessionStorage.getItem('role_id'));
          var _personal_vc = 0;
          var _section_vc = 0;
          var _faction_vc = 0;
          var _con2 = "";
          var _type2 = "1";
          for (var _i = 0; _i < properties.length; _i++) {
            if (properties[_i].name === 'personal_vc') {
              _personal_vc = parseInt(properties[_i].value);
            } else if (properties[_i].name === 'section_vc') {
              _section_vc = parseInt(properties[_i].value);
            } else if (properties[_i].name === 'faction_vc') {
              _faction_vc = parseInt(properties[_i].value);
            }
          }
          var _userInputVc = parseInt($('#base_vc').val());
          if (_role_id === 2) {
            if (_userInputVc > _section_vc) {
              var _name10 = factionInfo.chief.name;
              if (factionInfo.chief.name != departInfo.master.name) {
                _name10 += '\u3001' + departInfo.master.name;
              }
              _con2 = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + _section_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name10 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
              _type2 = "3";
            } else {
              _type2 = "1";
              _con2 = "您确认要发布此任务吗？";
            }
          } else if (_role_id === 3) {
            if (_userInputVc > _faction_vc) {
              _con2 = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + _faction_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + departInfo.master.name + '\u5BA1\u6838\uFF0C<br>\u60A8\u786E\u8BA4\u8981\u53D1\u5E03\u6B64\u4EFB\u52A1\u5417\uFF1F';
              _type2 = "3";
            } else {
              _con2 = "您确认要发布此任务吗？";
              _type2 = "1";
            }
          } else {
            _type2 = "1";
            _con2 = "您确认要发布此任务吗？";
          }
          var _title3 = "重新发布";
          zPopup(_title3, _type2, _con2, id, task);
        }
      };

      var $baseVC = $('#base_vc').val();
      var $gold = $('#gold').val();
      var $mortgage = $('#mortgage').val();
      var $leader_level = $('#leader_level').val();
      if (!$baseVC && !$gold && !$mortgage && !$leader_level) {
        var error = false;
        service.getTime(function (res) {
          if (new Date(deadline.val()).getTime() < res.now) {
            error = true;
            $('#footerError').text('要求完成日期必须大于当前日期');
            $('#footerError').fadeIn(1000);
            setTimeout(function () {
              $('#footerError').fadeOut(1000);
            }, 3000);
          }
          if (error) {
            return false;
          }
          temp();
        });
      } else {
        var _error = false;
        $('.isErrorGroup').each(function () {
          var _this2 = this;

          var $this = $(this).val();
          if ($this && !isInt($this)) {
            $(this).addClass('error');
            $(this).siblings('span').fadeIn(1000);
            setTimeout(function () {
              $(_this2).siblings('span').fadeOut(1000);
            }, 3000);
            _error = true;
          } else {
            $(this).removeClass('error');
            // $(this).siblings('span').css('display','none');
          }
        });
        if (_error) {
          return false;
        }
        service.getTime(function (res) {
          if (new Date(deadline.val()).getTime() < parseInt(res.now)) {
            _error = true;
            $('#footerError').text('要求完成日期必须大于当前日期');
            $('#footerError').fadeIn(1000);
            setTimeout(function () {
              $('#footerError').fadeOut(1000);
            }, 3000);
            if (_error) {
              return false;
            }
          }
          if ($leader_level && !isInt($leader_level)) {
            _error = true;
            $('#footerError').fadeIn(1000);
            setTimeout(function () {
              $('#footerError').fadeOut(1000);
            }, 3000);
          }
          if ($('#base_vc').val()) {
            if (!faction_id) {
              if (personalTask && personalTask == 'true') {
                var personalVCEdit = parseInt(personalVC) + parseInt($('#base_vc').val());
                if (parseInt($('#base_vc').val()) > parseInt(personalVCEdit)) {
                  $('#base_vc').addClass('error');
                  $('#base_vc').siblings('span').text('\u4E2A\u4EBA\u4EFB\u52A1VC\u5269\u4F59' + personalVC);
                  $('#base_vc').siblings('span').fadeIn(1000);
                  setTimeout(function () {
                    $('#base_vc').siblings('span').fadeOut(1000);
                  }, 3000);
                  _error = true;
                }
              } else {
                if (parseInt($('#base_vc').val()) > parseInt(departVC) + parseInt($('#base_vc').data('vcorigin'))) {
                  $('#base_vc').addClass('error');
                  $('#base_vc').siblings('span').text('\u8054\u76DFVC\u5269\u4F59' + departVC);
                  $('#base_vc').siblings('span').fadeIn(1000);
                  setTimeout(function () {
                    $('#base_vc').siblings('span').fadeOut(1000);
                  }, 3000);
                  _error = true;
                }
              }
            } else {
              if (parseInt($('#base_vc').val()) > parseInt(factionVC) + parseInt($('#base_vc').data('vcorigin'))) {
                $('#base_vc').addClass('error');
                $('#base_vc').siblings('span').text('\u5E2E\u4F1AVC\u5269\u4F59' + factionVC);
                $('#base_vc').siblings('span').fadeIn(1000);
                setTimeout(function () {
                  $('#base_vc').siblings('span').fadeOut(1000);
                }, 3000);
                _error = true;
              }
            }
          }
          if (_error) {
            return false;
          }
          if ($('#gold').val()) {
            if (!faction_id) {
              if (personalTask && personalTask == 'true') {
                var personalGoldEdit = parseInt(personalGold) + parseInt($('#gold').val());
                if (parseInt($('#gold').val()) > parseInt(personalGoldEdit)) {
                  $('#gold').addClass('error');
                  $('#gold').siblings('span').text('\u4E2A\u4EBA\u91D1\u5E01\u5269\u4F59' + personalGoldEdit);
                  $('#gold').siblings('span').fadeIn(1000);
                  setTimeout(function () {
                    $('#gold').siblings('span').fadeOut(1000);
                  }, 3000);
                  _error = true;
                }
              } else {
                if (parseInt($('#gold').val()) > parseInt(departGold) + parseInt($('#gold').data('goldorigin'))) {
                  $('#gold').addClass('error');
                  $('#gold').siblings('span').text('\u8054\u76DF\u91D1\u5E01\u5269\u4F59' + departGold);
                  $('#gold').siblings('span').fadeIn(1000);
                  setTimeout(function () {
                    $('#gold').siblings('span').fadeOut(1000);
                  }, 3000);
                  _error = true;
                }
              }
            } else {
              if (parseInt($('#gold').val()) > parseInt(factionGold) + parseInt($('#gold').data('goldorigin'))) {
                $('#gold').addClass('error');
                $('#gold').siblings('span').text('\u5E2E\u4F1A\u91D1\u5E01\u5269\u4F59' + factionGold);
                $('#gold').siblings('span').fadeIn(1000);
                setTimeout(function () {
                  $('#gold').siblings('span').fadeOut(1000);
                }, 3000);
                _error = true;
              }
            }
          }
          if (_error) {
            return false;
          }
          if (parseInt($('#applicant_id').val()) || parseInt($('#applicant_id').val() === 0)) {
            if ($('#mortgage').val() && parseInt($('#mortgage').val()) > parseInt($('#applicant_id').data('gold'))) {
              $('#mortgage').addClass('error');
              $('#mortgage').siblings('span').text('\u6307\u5B9A\u9886\u961FVC\u5269\u4F59' + $('#applicant_id').data('gold') + '\uFF0C\u4E0D\u8DB3\u4EE5\u652F\u4ED8\u62BC\u91D1\uFF01');
              $('#mortgage').siblings('span').fadeIn(1000);
              setTimeout(function () {
                $('#mortgage').siblings('span').fadeOut(1000);
              }, 3000);
              _error = true;
            }
          }
          if (_error) {
            return false;
          }
          if (!_error) {
            temp();
          }
        });
      }
    }
  }
  /*二次确认弹窗*/
  function zPopup(title, type, con, id, task) {
    var h = "";
    if (type == 1) {
      //两个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn gotoDelete">确定</a>' + '</div>' + '</div>';
    } else if (type == 2) {
      //一个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class="u-Popup-close u-Popup-ok-btn">知道啦</a>' + '</div>' + '</div>';
    }if (type == 3) {
      //三行
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con" style="line-height: 3rem">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn gotoDelete">确定</a>' + '</div>' + '</div>';
    }

    $(".feehideBox").html(h);
    //取消按钮
    $(".u-Popup-close").click(function () {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
    //确定按钮
    $(".gotoDelete").off("click").on("click", function () {
      window.parent.playClickEffect();
      service.edit(id, task, function (res) {
        window.sessionStorage.removeItem('tempTaskObj');
        if (faction_id || parseInt(faction_id) === 0) {
          if (parseInt(res.status) < 2 || parseInt(res.status) === 2) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = 'waitCheckTask.html?fromPage=teaRoom&taskId=' + id + '&teamId=' + teamId + '&faction_id=' + faction_id;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'waitCheckTask.html?fromPage=teaRoomEdit&taskId=' + id + '&teamId=' + teamId + '&roleId=1&faction_id=' + faction_id;
            } else {
              if (myTask && myTask == 'true') {
                window.location.href = 'waitCheckTask.html?taskId=' + id + '&faction_id=' + faction_id + '&myTask=true';
              } else {
                window.location.href = 'waitCheckTask.html?taskId=' + id + '&faction_id=' + faction_id;
              }
            }
          } else if (parseInt(res.status) === 4) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = 'tempTaskDetail.html?fromPage=teaRoom&faction_id=' + faction_id + '&taskId=' + id + '&teamId=' + teamId;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'tempTaskDetail.html?fromPage=teaRoomEdit&faction_id=' + faction_id + '&taskId=' + id + '&teamId=' + teamId + '&roleId=1';
            } else {
              if (myTask && myTask == 'true') {
                window.location.href = 'tempTaskDetail.html?taskId=' + id + '&faction_id=' + faction_id + '&myTask=true';
              } else {
                window.location.href = 'tempTaskDetail.html?taskId=' + id + '&faction_id=' + faction_id;
              }
            }
          } else if (parseInt(res.status) === 5) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = 'tempContinueTask.html?fromPage=teaRoom&faction_id=' + faction_id + '&taskId=' + id + '&teamId=' + teamId;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'tempContinueTask.html?fromPage=teaRoomEdit&faction_id=' + faction_id + '&taskId=' + id + '&teamId=' + teamId + '&roleId=1';
            } else {
              if (myTask && myTask == 'true') {
                window.location.href = 'tempContinueTask.html?taskId=' + id + '&faction_id=' + faction_id + '&myTask=true';
              } else {
                window.location.href = 'tempContinueTask.html?taskId=' + id + '&faction_id=' + faction_id;
              }
            }
          }
        } else if (personalTask && personalTask == 'true') {
          if (parseInt(res.status) < 2 || parseInt(res.status) === 2) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = 'waitCheckTask.html?fromPage=teaRoom&taskId=' + id + '&teamId=' + teamId;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'waitCheckTask.html?fromPage=teaRoomEdit&taskId=' + id + '&teamId=' + teamId + '&roleId=1';
            } else {
              if (myTask && myTask == 'true') {
                window.location.href = 'waitCheckTask.html?taskId=' + id + '&personalTask=true&myTask=true';
              } else {
                window.location.href = 'waitCheckTask.html?taskId=' + id + '&personalTask=true';
              }
            }
          } else if (parseInt(res.status) === 4) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = 'tempTaskDetail.html?fromPage=teaRoom&taskId=' + id + '&teamId=' + teamId;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'tempTaskDetail.html?fromPage=teaRoomEdit&taskId=' + id + '&teamId=' + teamId + '&roleId=1';
            } else {
              if (myTask && myTask == 'true') {
                window.location.href = 'tempTaskDetail.html?taskId=' + id + '&personalTask=true&myTask=true';
              } else {
                window.location.href = 'tempTaskDetail.html?taskId=' + id + '&personalTask=true';
              }
            }
          } else if (parseInt(res.status) === 5) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = 'tempContinueTask.html?fromPage=teaRoom&taskId=' + id + '&teamId=' + teamId;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'tempContinueTask.html?fromPage=teaRoomEdit&taskId=' + id + '&teamId=' + teamId + '&roleId=1';
            } else {
              if (myTask && myTask == 'true') {
                window.location.href = 'tempContinueTask.html?taskId=' + id + '&personalTask=true&myTask=true';
              } else {
                window.location.href = 'tempContinueTask.html?taskId=' + id + '&personalTask=true';
              }
            }
          }
        } else {
          if (parseInt(res.status) === 4) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = 'tempTaskDetail.html?fromPage=teaRoom&taskId=' + id + '&teamId=' + teamId;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'tempTaskDetail.html?fromPage=teaRoomEdit&taskId=' + id + '&teamId=' + teamId + '&roleId=1';
            } else {
              if (myTask && myTask == 'true') {
                if (parseInt(res.status) === 5) {
                  window.location.href = 'tempContinueTask.html?taskId=' + id + '&myTask=true';
                } else {
                  window.location.href = 'tempTaskDetail.html?taskId=' + id + '&myTask=true';
                }
              } else {
                if (parseInt(res.status) === 5) {
                  window.location.href = 'tempContinueTask.html?taskId=' + id;
                } else {
                  window.location.href = 'tempTaskDetail.html?taskId=' + id;
                }
              }
            }
          } else if (parseInt(res.status) === 5) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = 'tempContinueTask.html?fromPage=teaRoom&taskId=' + id + '&teamId=' + teamId;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = 'tempContinueTask.html?fromPage=teaRoomEdit&taskId=' + id + '&teamId=' + teamId + '&roleId=1';
            } else {
              if (myTask && myTask == 'true') {
                window.location.href = 'tempContinueTask.html?taskId=' + id + '&myTask=true';
              } else {
                window.location.href = 'tempContinueTask.html?taskId=' + id;
              }
            }
          }
        }
      });
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
  }
  function getFileName(o) {
    var pos = o.lastIndexOf("\\");
    return o.substring(pos + 1);
  }
  function getExpRole() {
    service.getExpRole(function (res) {
      expRole = res;
    });
  }
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    } else {
      return null;
    }
  }
  function getProperties() {
    service.getProperties(function (res) {
      properties = res;
    });
  }
  function getDepartmentInfo(departmentId) {
    service.getDepartmentInfo(departmentId, function (res) {
      departInfo = res;
      departGold = res.gold;
      departVC = res.vc;
    });
  }
  function getFactionInfo(factionId) {
    service.getFactionInfo(factionId, function (res) {
      factionInfo = res;
      factionGold = res.gold;
      factionVC = res.vc;
    });
  }
  function getSectionsInfo(sectionId) {
    service.getSectionsInfo(sectionId, function (res) {
      sectionInfo = res;
    });
  }
  function getUserLeaderGrade(userid) {
    service.getUserLeaderGrade(userid, function (res) {
      personalInfo = res;
      personalGold = res.gold;
      personalVC = res.task_vc;
      var index = allGrade.indexOf(res.grade);
      $('#leader_grade').attr('data-gradeindex', index);
    });
  }
});