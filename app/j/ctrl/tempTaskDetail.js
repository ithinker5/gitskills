
/*盟主：是否有队伍接取该任务，有则为待批准，无则为悬赏中*/
/*其他人：自己是否有申请，有则为待批准，无则为悬赏中*/
$(function () {
  let service = new SERVICE();
  const id = getUrlParam('taskId');
  $("#isTeam").val( getUrlParam('taskId'));
  const faction_id = getUrlParam('faction_id');
  let personalTask = getUrlParam('personalTask');
  let myTask = getUrlParam('myTask');
  let teamId = getUrlParam('teamId');
  const role_id = parseInt(window.sessionStorage.getItem('role_id'));
  let userId = parseInt(window.sessionStorage.getItem('user_id'));
  let selectLeaderId = window.sessionStorage.getItem('selectId');
  let selectId = '';
  let selectLeaderName = '';
  let exclude = [];
  let members2 = [];
  let applyObj = {mortgage: "", members: []};
  let total = 0;
  let isleader = '';
  let mortgageValue = '';
  let isEdit;

  $(document).on('change', '.goldInput', function () {
    $(this).removeClass('error');
    $('.errorText').css('display', 'none');
  });
  //返回
  $('.btnBack').click(function () {
    back();
  });
  $(document).on('click', '#edit', function () {
    window.parent.playClickEffect();
    if (!faction_id) {
      if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
        window.location.href = `tempTaskEdit.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
      } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
        window.location.href = `tempTaskEdit.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
      } else {
        if(myTask && myTask == 'true'){
          if(personalTask && personalTask == 'true'){
            window.location.href = `tempTaskEdit.html?taskId=${id}&personalTask=true&myTask=true`;
          }else{
            window.location.href = `tempTaskEdit.html?taskId=${id}&myTask=true`;
          }
        }else{
          if(personalTask && personalTask == 'true'){
            window.location.href = `tempTaskEdit.html?taskId=${id}&personalTask=true`;
          }else{
            window.location.href = `tempTaskEdit.html?taskId=${id}`;
          }
        }
      }
    } else {
      if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
        window.location.href = `tempTaskEdit.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
      } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
        window.location.href = `tempTaskEdit.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
      } else {
        if(myTask && myTask == 'true'){
          window.location.href = `tempTaskEdit.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
        }else{
          window.location.href = `tempTaskEdit.html?taskId=${id}&faction_id=${faction_id}`;
        }
      }
    }
  });
  //获取任务信息
  getTask(id);
  //获取任务文档信息
  getAsserts(id);
  function back() {
    window.parent.playClickEffect();
    if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
      window.location.href = `createTearm.html?teamId=${getUrlParam('teamId')}`;
    } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
      window.location.href = `createTearmDetail.html?teamId=${getUrlParam('teamId')}&roleId=1`;
    }else if(myTask && myTask == 'true'){
      window.parent.reloadWeb('app/h/myTaskList.html?personalTask=true', false, false, 1465, 820);
    } else {
      if (!faction_id) {
        if(personalTask && personalTask=='true'){
          window.parent.reloadWeb('app/h/tasklistPersonal.html?personalTask=true', false, false, 1465, 820);
        }else{
          window.parent.reloadWeb('app/h/taskList.html', false, false, 1465, 820);
        }
      } else {
        window.parent.reloadWeb('app/h/taskList2.html?faction_id=' + faction_id, false, false, 1465, 820);
      }
    }
  }

  //任务详情
  function getTask(id) {
    service.getById(id, (res) => {
      $('#title').text(res.title);
      $('#desc').text(res.remark);
      let type = `${res.level}级`;
      if(res.type == '2'){
        type = `个人任务`;
      }else if(res.type == '3'){
        type = `试炼任务`;
      }else{
        switch (res.subtype) {
          case 0:
            type = `${type}联盟战略任务`;
            break;
          case 1:
            type = `${type}联盟临时任务`;
            break;
          case 2:
            type = `${type}帮会挑战任务`;
            break;
          case 3:
            type = `${type}帮会基础任务`;
            break;
          case 4:
            type = `${type}帮会临时任务`;
            break;
        }
      }
      $('#type').text(type);
      $('#publishDate').text(dateChange(res.published_at));
      $('#exp').text(res.exp > 0 ? res.exp : '无');
      $('#finishDate').text(dateChange(res.deadline));
      $('#publishPerson').text(res.created.name);
      $("#checkPerson").text(res.created.name);
      $("#isEdit").val(res.created._id);
      /*if(window.sessionStorage.getItem('user_id')==res.created._id){
       $("#changeBoxTask").html('<div class="footer" id="footer"><input id="close" class="btn subBtn2" type="button" value="关闭任务" /></div>');
       }*/
      $('#vc').text(res.base_vc > 0 ? res.base_vc : '无');
      $('#gold').text(res.gold > 0 ? res.gold : '无');
      $('#mortgage').text(res.mortgage > 0 ? res.mortgage : '无');
      mortgageValue = res.mortgage > 0 ? res.mortgage : '无';
      let gradeText = '无';
      if (res.leader_grade&&res.leader_grade!==null&&res.leader_grade!=='') {
        gradeText=res.leader_grade;
      }
      $('#leader_grade').text(gradeText);
      if (!faction_id) {
        if(personalTask && personalTask == 'true'){
          if (role_id === 5 || role_id === 4 ||  (userId === res.created._id)) {
            /*获取申请人信息*/
            getApplication(id);
          }
        }else{
          if (role_id === 5 || role_id === 4) {
            /*获取申请人信息*/
            getApplication(id);
          }
        }
      } else {
        if (role_id === 5 || role_id === 4 || role_id === 3 || (role_id === 2 && (userId === res.created._id))) {
          /*获取申请人信息*/
          getApplication(id);
        } /*else {
          //用户参加的申请团队列表
          getUserJoin(id, userId);
        }*/
      }
      if(userId !== parseInt(res.created._id)){
        getUserJoin(id, userId);
      }else{
        getUserJoin2(id, userId);
      }
      $('#leader_level').text(res.leader_level > 0 ? res.leader_level : '无');
      if (selectLeaderId || parseInt(selectLeaderId) === 0) {
        $('#applicant_id')
          .val(`${window.sessionStorage.getItem('selectId')}`)
          .attr({'data-name':`${window.sessionStorage.getItem('selectLeaderName')}`,'data-gold':`${window.sessionStorage.getItem('selectLeaderGold')}`});
        $('#applicant').css('display', 'inline-block')
          .after(`<span style="vertical-align: middle">${window.sessionStorage.getItem('selectLeaderName')}</span>`);
        $('input[name="applicant_id"]').eq(1).attr('checked', 'checked');
        $('.activeImg2').removeClass('activeImg2').addClass('pitch2');
        window.sessionStorage.removeItem('selectId');
        window.sessionStorage.removeItem('selectLeaderName');
      } else {
        $('input[name="applicant_id"]').eq(0).attr('checked', 'checked')
      }
    })
  }

  $('input[name="applicant_id"]').change(() => {
    let selectedvalue = $("input[name='applicant_id']:checked").val();
    if (selectedvalue !== '') {
      $('.activeImg2').removeClass('activeImg2').addClass('pitch2');
    }
  });
  //获取任务文档
  function getAsserts(id) {
    service.getAssetByTaskId(id, res => {
      if (res && res.length > 0) {
        $('#noFile').css('display', 'none');
        for (let i = 0; i < res.length; i++) {
          let pos = res[i].url.lastIndexOf("\/");
          let name = res[i].url.substring(pos + 1);
          $('#fileList').append(`
          <div class="fileItem">
                            <label>${name}</label>
                             <a href=${res[i].url} class="download" download=${name}></a>
                            <span>${res[i].user.name}</span>
                            <span>${dateChange(res[i].created_at)}</span>
                            <span>${dateFormat(res[i].created_at)}</span>
                        </div>
          `)
        }
      } else {
        $('#fileList').css('display', 'none')
      }
    })
  }

  //获取申请人信息-----用于判断盟主与护法判断是否有人申请分为悬赏中和待批准两种状态
  function getApplication(id) {
    service.getApplication(id, (res) => {
      /*盟主和护法*/
      if (res.length != 0 || res.length != '0') {
        $("#historyList").removeClass('dis_n');
        /*获取历史变更记录*/
        getHistory(id);
        /*待批准*/
        $(".ratify").removeClass('dis_n');
        $("#memberInfo").removeClass('dis_n');
        $('#status').html('待批准');
        $("#footer").prepend('<div class="footerError" id="footerError"></div><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="ratify" class="btn btnStyle subBtn2" type="button" value="批准任务"/>');
        /*表格列表展示*/
        for (let i = 0, len = res.length; i < len; i++) {
          res[i].name = '<span class="pitch2 pitchTeams" data-id=' + res[i].created._id + ' data-team=' + res[i]._id + ' data-name=' + res[i].created.name + '  alt="" ></span><span class="teamWidth">' + res[i].name + '</span>';
          res[i].lName = res[i].created.name || '无';
          res[i].lScore = res[i].created.task_score.toFixed(1);
          res[i].lgrade = 'Lv' + res[i].created.level || '无';
          res[i].lTitle = res[i].created.title || '无';
          res[i].lRole_id = res[i].created.grade || '无';
        }
        $('#accountTableOne').dataTable({
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
            sEmptyTable: "暂无数据",
          },
          data: res,
          columns: [
            {data: 'name', title: '队伍名称', orderable: false},
            {data: 'member_count', title: '任务人数', orderable: false},
            {data: 'lName', title: '领队', orderable: false},
            {data: 'lScore', title: '领队评分', orderable: false},
            {data: 'lgrade', title: '等级', orderable: false},
            {data: 'lTitle', title: '岗位名称', orderable: false},
            {data: 'lRole_id', title: '岗位级别', orderable: false},
          ]
        });
        $("#accountTableOne_wrapper").css("margin-bottom", "0");
        /*单选选取队伍*/
        $("#accountTableOne tr").click(function () {
          window.parent.playClickEffect();
          selectId = $(this).find(".pitch2").data('id');
          selectLeaderName = $(this).find(".pitch2").data('name');
          $(this).find(".pitch2").addClass("activeImg2").parent().parent().siblings().children().children(".activeImg2").addClass("pitch2");
          $(this).find(".pitch2").removeClass("pitch2").parent().parent().siblings().children().children(".activeImg").addClass("pitch2");
          $('input[name="applicant_id"]').eq(0).attr('checked', 'checked')
        });
      } else if (res.length === 0 || res.length === '0') {
        /*悬赏中*/
        $('#status').html('悬赏中');
        $("#historyList").removeClass('dis_n');
        $(".taskItem2").css("border", "0");
        /*获取历史变更记录*/
        getHistory(id);
        $(".ratify").removeClass('dis_n');
        if (getUrlParam('faction_id') || getUrlParam('faction_id') == 0) {
          if (window.sessionStorage.getItem('user_id') == $("#isEdit").val()) {
            $("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="edit" class="btn btnStyle subBtn2" type="button" value="编辑任务"/>');
          } else {
            $("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
          }
        } else {
          if (window.sessionStorage.getItem('user_id') == $("#isEdit").val()) {
            $("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="edit" class="btn btnStyle subBtn2" type="button" value="编辑任务"/>');
          } else {
            $("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
          }
          //$("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="edit" class="btn btnStyle subBtn2" type="button" value="编辑任务"/>');
        }
      }
    })
  }

  //用户参加的申请团队列表-----用于判断其他人中自己或者所在团队是否参与申请分为悬赏中和待批准两种状态
  //-------apply为true，自己作为队长已申请，teams不为空自己的队伍展示，也可能作为别的队伍成员展示一张列表；按钮为放弃任务和编辑队伍
  //-------apply为false，自己作为队长未申请，teams为空，也无参与的队伍进行接取任务。自己可以申请，按钮为接取
  //-------apply为false，自己作为队长未申请，teams不为空，自己作为队员已参加，同时以队长的身份进行接取任务。按钮为接取

  function getUserJoin(id, userId) {
    service.getUserJoin(id, userId, (res) => {
      //alert($('#mortgage').text());
      /*其他人*/
      if (res.isApply === true || res.isApply === 'true') {
        /*队长已申请，待批准状态中*/
        $('#status').html('待批准');
        $("#taskMember").removeClass('dis_n');
        $("#historyList").removeClass('dis_n');
        /*获取历史变更记录*/
        getHistory(id);
        $("#footer").append('<input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
        for (let i = 0; i < res.teams.length; i++) {
          let html = '<p><h3 style="margin-left: 4%;">任务成员</h3><label>队伍名称：</label><span id="teamName">' + res.teams[i].name + '</span><label>'
            + '领队：</label><span id="teamLeader">' + res.teams[i].created.name + '</span>';
          html += '</p>'
            + '<div class="tableAccount" style="position:relative"><table id="accountTable' + i + '" class="table table-striped"></table>';
          if (window.sessionStorage.getItem('user_id') == res.teams[i].created._id) {
            if(getUrlParam('receiveTask') === 1||getUrlParam('receiveTask') === '1'){
              html += '<button class="EditTeam dis_n">编辑队伍</button>';
              html+= '<div class="editTeamBox" style="position: relative;">';
            }else{
              html += '<button class="EditTeam">编辑队伍</button>';
              html+='<div class="editTeamBox dis_n" style="position: relative;">';
            }
            html += '<p>领队：<span>' + res.teams[i].created.name + '</span><i>押金：</i><input class="goldInput input-text" id="LeaderGold" data-gold='+res.teams[i].created.task_vc+' /></p><p id="test">队员：</p>';
            html += '<div class="errorText" id="errorText" style="position: absolute;bottom: 0.5rem;left: 0.3rem;"></div><div class="recruit"></div>'
              + '</div>'
            if(getUrlParam('receiveTask') === 1||getUrlParam('receiveTask') === '1'){
              html += '<div class="EditBtn"><span class="cancel">取消</span><span class="confirm">确定</span></div>';
            }else{
              html += '<div class="EditBtn dis_n"><span class="cancel">取消</span><span class="confirm">确定</span></div>';
            }
          }
          html += '</div>';
          $(".tableBox").append(html);
          let $leaderGold=0;
          for (let j = 0; j < res.teams[i].members.length; j++) {
            res.teams[i].members[j].user.level = 'Lv' + res.teams[i].members[j].user.level;
            res.teams[i].members[j].user.title = res.teams[i].members[j].user.title || '无';
            res.teams[i].members[j]._id = (j + 1);
            res.teams[i].members[j].user.name = '<span class="userName">'+res.teams[i].members[j].user.name+'</span>';
            if (res.teams[i].members[j].role_id == 0) {
              res.teams[i].members[j].role_id = '领队';
              $leaderGold=res.teams[i].members[j].mortgage
            } else if (res.teams[i].members[j].mortgage != 0) {
              res.teams[i].members[j].role_id = '合伙人';
            } else if (res.teams[i].members[j].mortgage == 0) {
              res.teams[i].members[j].role_id = '队员';
            }
          }
          $("#LeaderGold").val($leaderGold).attr('data-origin',$leaderGold);
          if(window.sessionStorage.getItem('user_id') == res.teams[i].created._id){
            let $joinMembers=res.teams[i].members;
            service.getTeamsList(res.teams[i]._id, (res) => {
              for(let k=0;k<res.length;k++){
                if(res[k].role_id == 0){
                  exclude.push(res[k].user._id);
                }else{
                  exclude.push(res[k].user._id);
                  if($("#mortgage").text() == '无'||$("#mortgage").text() ==0){
                    $("#test").after('<b><img class="pitch activeImg" data-id="'+res[k].user._id+'" src="../i/pitch.png" />'+res[k].user.name+'</b>');
                  }else{
                    // $("#test").after('<b><img class="pitch activeImg" data-id="'+res[k].user._id+'" src="../i/pitch.png" />'+res[k].user.name+'<em class="dis_n"><span>押金：</span><input class="goldInput" data-gold='+res[k].user.task_vc+' /></em></b>');
                    let temp=-1;
                    for(let index=0;index<$joinMembers.length;index++){
                      if(parseInt($joinMembers[index].user._id)===parseInt(res[k].user._id)){
                        temp=index;
                        break;
                      }
                    }
                    if(temp!==-1){
                      $("#test").after('<b><img class="pitch his_active" data-id="'+res[k].user._id+'" src="../i/pitch2.png" /><i>'+res[k].user.name+'</i><em><i>押金：</i><input value='+$joinMembers[temp].mortgage+' class="goldInput input-text" data-name='+res[k].user.name+' data-gold='+res[k].user.task_vc+' data-origin='+$joinMembers[temp].mortgage+'/></em></b>');
                    }else{
                      $("#test").after('<b><img class="pitch activeImg" data-id="'+res[k].user._id+'" src="../i/pitch.png" /><i>'+res[k].user.name+'</i><em class="dis_n"><i>押金：</i><input class="goldInput input-text" data-name='+res[k].user.name+' data-gold='+res[k].user.task_vc+' /></em></b>');
                    }
                    $('.input-text').change(function() {
                      $(this).removeClass('error');
                    });
                  }
                }
              }
            });
          }
          $(`.tableBox #accountTable${i}`).dataTable({
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
              sEmptyTable: "暂无数据",
            },
            data: res.teams[i].members,
            columns: [
              {data: '_id', title: '序号', orderable: false},
              {data: 'role_id', title: '职务', orderable: false},
              {data: 'user.name', title: '姓名', orderable: false},
              {data: 'user.level', title: '等级', orderable: false},
              {data: 'mortgage', title: '押金', orderable: false},
              {data: 'user.title', title: '岗位名称', orderable: false},
              {data: 'user.grade', title: '岗位级别', orderable: false},
            ]
          });
          $("#accountTable0_wrapper").css("margin-bottom","5.5%");
          $(".editTeamBox").css("margin-top","-5.5%");
         // $("#taskMember").empty().after('<h3 style="margin-left: 4%;">任务成员</h3>');

        }
      } else {
        /*本人作为队长未申请任务，状态为悬赏中*/
        $('#status').html('悬赏中');
        $("#historyList").removeClass('dis_n');
        //$(".taskItem2").css("border", "0");
        /*获取历史变更记录*/
        getHistory(id);
        if (res.teams.length > 0) {
          service.getMyTeams(res => {
            if(faction_id||faction_id=='0'){
              if (role_id==5||role_id==4||role_id==3) {
                if($("#status").text()=='待批准'){
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="ratify" class="btn btnStyle subBtn2" type="button" value="批准任务"/>');
                }else{
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
                }
              } else {
                $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/>');
              }
            }else if(personalTask && personalTask == 'true'){
              if (role_id==5||role_id==4) {
                if($("#status").text()=='待批准'){
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="ratify" class="btn btnStyle subBtn2" type="button" value="批准任务"/>');
                }else{
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
                }
              } else {
                $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/>');
              }
            }else{
              $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/>');
            }
            //$("#footer").html('<input id="receive1" class="btn subBtn2" type="button" value="接取"/>');
            isleader = false;
            for (let i = 0, len = res.length; i < len; i++) {
              if (res[i].role_id == 0) {
                /*有队长则为已创建过队伍*/
                isleader = true;
                break;
              }
            }
            if (isleader) {
              $(document).on("click", '#receive1', function () {
                window.parent.playClickEffect();
               // $("#taskMember").removeClass('dis_n');
                $(".editTeamBox2").removeClass('dis_n');
                $("#footer").html('<input id="cancel1" class="btn btnStyle subBtn2" type="button" value="取消"/><input id="receiveTask" class="btn btnStyle subBtn2" type="button" value="接取"/>');
              });
              let html='';
              if(getUrlParam('receiveTask') == 1){
                html = '<div class="editTeamBox editTeamBox2">'
              }else{
                html = '<div class="editTeamBox editTeamBox2 dis_n">'
              }
              html+= '<p><label>队伍名称：</label><span id="teamName">' + res[0].name + '</span><label>';
              if($("#mortgage").text() == '无'||$("#mortgage").text() == '0'){
                html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;领队：<span id="teamLeader">' + res[0].created.name + '</span></p><p id="test2">队员：'
              }else{
                html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;领队：<span id="teamLeader">' + res[0].created.name + '</span><i>押金：</i><input class="goldInput input-text" id="LeaderGold" data-gold='+res[0].created.task_vc+' /></p><p id="test2">队员：'
              }
              html += '<div class="recruit2" style="bottom:3%;"></div>'
                + '<div class="errorText" id="errorText" style="position: absolute;bottom: -1rem;left: 0.3rem;"></div></div>';
                + '</div>';
              html += '</div>';
              $(".tableBox").append(html);
              if (getUrlParam('receiveTask') == 1) {
                //$("#taskMember").removeClass('dis_n');
                //$(".editTeamBox2").removeClass('dis_n');
                $("#footer").html('<input id="cancel1" class="btn btnStyle subBtn2" type="button" value="取消"/><input id="receiveTask" class="btn btnStyle subBtn2" type="button" value="接取"/>');
              }
              for (let j = 0; j < res[0].members.length; j++) {
                if (res[0].members[j].role_id == 0) {
                  exclude.push(res[0].members[j].user._id);
                } else {
                  exclude.push(res[0].members[j].user._id);
                  if ($("#mortgage").text() == '无' || $("#mortgage").text() == 0) {
                    $("#test2").after('<b><img class="pitch activeImg" data-id="' + res[0].members[j].user._id + '" src="../i/pitch.png" /><i>' + res[0].members[j].user.name + '</i></b>');
                  } else {
                    $("#test2").after('<b><img class="pitch activeImg" data-id="' + res[0].members[j].user._id + '" src="../i/pitch.png" /><i>' + res[0].members[j].user.name + '</i><em class="dis_n"><i>押金：</i><input class="goldInput input-text" data-gold='+res[0].members[j].user.task_vc+' data-name='+res[0].members[j].user.name+' /></em></b>');
                  }

                }
              }
            } else {
              $(document).on("click", '#receive1', function () {
                window.parent.playClickEffect();
                const title = '创建队伍';
                const con = '您还未创建队伍，无法接取任务！</br>是否前往组队';
                const type = '1';
                const clickBtn = 'formTeam';
                zPopup(title, type, con, clickBtn);
              });
            }
          });
          /*以队员身份进入到队伍中*/
          // $(".memberInfo").removeClass('dis_n');
          for (let i = 0; i < res.teams.length; i++) {
            let html = '<p><h3 style="margin-left: 4%;">任务成员</h3><label>队伍名称：</label><span id="teamName">' + res.teams[i].name + '</span><label>'
              + '领队：</label><span id="teamLeader">' + res.teams[i].created.name + '</span>';
            html += '</p>'
              + '<div class="tableAccount" style="position:relative"><table id="accountTable' + i + '" class="table table-striped"></table></div>';
            $(".tableBox").append(html);
            for (let j = 0; j < res.teams[i].members.length; j++) {
              if (res.teams[i].members[j].role_id == 0) {
                res.teams[i].members[j].role_id = '领队';
              } else if (res.teams[i].members[j].mortgage != 0) {
                res.teams[i].members[j].role_id = '合伙人';
              } else if (res.teams[i].members[j].mortgage == 0) {
                res.teams[i].members[j].role_id = '队员';
              }
              res.teams[i].members[j].user.level = 'Lv' + res.teams[i].members[j].user.level;
              res.teams[i].members[j].user.title = res.teams[i].members[j].user.title || '无';
              res.teams[i].members[j]._id = (j + 1);
            }
            $(`.tableBox #accountTable${i}`).dataTable({
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
                sEmptyTable: "暂无数据",
              },
              data: res.teams[i].members,
              columns: [
                {data: '_id', title: '序号', orderable: false},
                {data: 'role_id', title: '职务', orderable: false},
                {data: 'user.name', title: '姓名', orderable: false},
                {data: 'user.level', title: '等级', orderable: false},
                {data: 'mortgage', title: '押金', orderable: false},
                {data: 'user.title', title: '岗位名称', orderable: false},
                {data: 'user.grade', title: '岗位级别', orderable: false},
              ]
            });
            $(`#accountTable${i}_wrapper`).css("margin-bottom","2%");
          }
          $(document).on('click', '#cancel1', function () {
            window.parent.playClickEffect();
            $(".editTeamBox2").addClass('dis_n');
            if(faction_id||faction_id=='0'){
              if (role_id==5||role_id==4||role_id==3) {
                if($("#status").text()=='待批准'){
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="ratify" class="btn btnStyle subBtn2" type="button" value="批准任务"/>');
                }else{
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
                }
              } else {
                $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/>');
              }
            }else if(personalTask && personalTask == 'true'){
              if (role_id==5||role_id==4) {
                if($("#status").text()=='待批准'){
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="ratify" class="btn btnStyle subBtn2" type="button" value="批准任务"/>');
                }else{
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
                }
              } else {
                $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/>');
              }
            }else{
              $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/>');
            }
          });
        } else {
          /*未以队员身份参与到队伍中*/
          service.getMyTeams(res => {
            if(faction_id||faction_id=='0'){
              if (role_id==5||role_id==4||role_id==3) {
                if($("#status").text()=='待批准'){
                  $("#footer").html('<input id="receive1" class="btnbtnStyle subBtn2" type="button" value="接取"/><input id="close" class="btnbtnStyle subBtn2" type="button" value="关闭任务"/><input id="ratify" class="btn btnStyle subBtn2" type="button" value="批准任务"/>');
                }else{
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
                }
              } else {
                $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/>');
              }
            }else if(personalTask && personalTask == 'true'){
              if (role_id==5||role_id==4) {
                if($("#status").text()=='待批准'){
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="ratify" class="btn btnStyle subBtn2" type="button" value="批准任务"/>');
                }else{
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
                }
              } else {
                $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/>');
              }
            }else{
              $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/>');
            }
            isleader = false;
            for (let i = 0, len = res.length; i < len; i++) {
              if (res[i].role_id == 0) {
                /*有队长则为已创建过队伍*/
                isleader = true;
                break;
              }
            }
            if (isleader) {
              if (getUrlParam('receiveTask') == 1) {
                //$("#taskMember").removeClass('dis_n');
                $(".editTeamBox2").removeClass('dis_n');
                $("#footer").html('<input id="cancel1" class="btn btnStyle subBtn2" type="button" value="取消"/><input id="receiveTask" class="btn btnStyle subBtn2" type="button" value="接取"/>');
              }
              $(document).on("click", '#receive1', function () {
                window.parent.playClickEffect();
                $(".editTeamBox2").removeClass('dis_n');
                $('.pitch').each(function () {
                  $(this).removeClass('his_active').addClass('activeImg').attr('src','../i/pitch.png')
                });
                $('.goldInput').each(function () {
                  $(this).val('').removeClass('error');
                });
                if($('#errorText')){
                  $('#errorText').css('display','none');
                }
                $("#footer").html('<input id="cancel1" class="btn btnStyle subBtn2" type="button" value="取消"/><input id="receiveTask" class="btn btnStyle subBtn2" type="button" value="接取"/>');
              });
              let html='';
              if(getUrlParam('receiveTask') == 1){
                html = '<div class="editTeamBox editTeamBox2" style="position: relative">';
              }else{
                html = '<div class="editTeamBox editTeamBox2 dis_n" style="position: relative">';
              }
              html+= '<p><label>队伍名称：</label><span id="teamName">' + res[0].name + '</span><label>';
              if($("#mortgage").text() == '无'||$("#mortgage").text() == '0'){
                html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;领队：<span id="teamLeader">' + res[0].created.name + '</span></p><p id="test2">队员：'
              }else{
                html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;领队：<span id="teamLeader">' + res[0].created.name + '</span><i>押金：</i><input class="goldInput input-text" id="LeaderGold" data-gold='+res[0].created.task_vc+' /></p><p id="test2">队员：'
              }
              html += '<div class="recruit2" style="bottom: 3%;"></div>'
                + '<div class="errorText" id="errorText" style="position: absolute;bottom: -1rem;left: 0.3rem;"></div></div>';
              html += '</div>';
              $(".tableBox").append(html);
              for (let j = 0; j < res[0].members.length; j++) {
                if (res[0].members[j].role_id == 0) {
                  continue;
                } else {
                  exclude.push(res[0].members[j].user._id);
                  if ($("#mortgage").text() == '无' || $("#mortgage").text() == 0) {
                    $("#test2").after('<b><img class="pitch activeImg" data-id="' + res[0].members[j].user._id + '" src="../i/pitch.png" /><i>' + res[0].members[j].user.name + '</i></b>');
                  } else {
                    $("#test2").after('<b><img class="pitch activeImg" data-id="' + res[0].members[j].user._id + '" src="../i/pitch.png" /><i>' + res[0].members[j].user.name + '</i><em class="dis_n"><i>押金：</i><input class="goldInput input-text teamMember" data-gold='+res[0].members[j].user.task_vc+' data-name='+res[0].members[j].user.name+' /></em></b>');
                  }

                }
              }
            } else {
              $(document).on("click", '#receive1', function () {
                window.parent.playClickEffect();
                const title = '创建队伍';
                const con = '您还未创建队伍，无法接取任务！</br>是否前往组队';
                const type = '1';
                const clickBtn = 'formTeam';
                zPopup(title, type, con, clickBtn);
              });
            }
          })
          $(document).on('click', '#cancel1', function () {
            window.parent.playClickEffect();
            $(".editTeamBox2").addClass('dis_n');
            if(faction_id||faction_id=='0'){
              if (role_id==5||role_id==4||role_id==3) {
                if($("#status").text()=='待批准'){
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="ratify" class="btn btnStyle subBtn2" type="button" value="批准任务"/>');
                }else{
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
                }
              } else {
                $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/>');
              }
            }else if(personalTask && personalTask == 'true'){
              if (role_id==5||role_id==4) {
                if($("#status").text()=='待批准'){
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="ratify" class="btn btnStyle subBtn2" type="button" value="批准任务"/>');
                }else{
                  $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/><input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
                }
              } else {
                $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/>');
              }
            }else{
              $("#footer").html('<input id="receive1" class="btn btnStyle subBtn2" type="button" value="接取"/>');
            }
          });
        }
      }
    })
  }
  function getUserJoin2(id, userId) {
    service.getUserJoin(id, userId, (res) => {
      if(res.isApply == false){
        if(res.teams.length>0){
          for (let i = 0; i < res.teams.length; i++) {
            let html = '<p><h3 style="margin-left: 4%;">任务成员</h3><label>队伍名称：</label><span id="teamName">' + res.teams[i].name + '</span><label>'
              + '领队：</label><span id="teamLeader">' + res.teams[i].created.name + '</span>';
            html += '</p>'
              + '<div class="tableAccount" style="position:relative"><table id="accountTable' + i + '" class="table table-striped"></table></div>';
            $(".tableBox").append(html);
            for (let j = 0; j < res.teams[i].members.length; j++) {
              if (res.teams[i].members[j].role_id == 0) {
                res.teams[i].members[j].role_id = '领队';
              } else if (res.teams[i].members[j].mortgage != 0) {
                res.teams[i].members[j].role_id = '合伙人';
              } else if (res.teams[i].members[j].mortgage == 0) {
                res.teams[i].members[j].role_id = '队员';
              }
              res.teams[i].members[j].user.level = 'Lv' + res.teams[i].members[j].user.level;
              res.teams[i].members[j].user.title = res.teams[i].members[j].user.title || '无';
              res.teams[i].members[j]._id = (j + 1);
            }
            $(`.tableBox #accountTable${i}`).dataTable({
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
                sEmptyTable: "暂无数据",
              },
              data: res.teams[i].members,
              columns: [
                {data: '_id', title: '序号', orderable: false},
                {data: 'role_id', title: '职务', orderable: false},
                {data: 'user.name', title: '姓名', orderable: false},
                {data: 'user.level', title: '等级', orderable: false},
                {data: 'mortgage', title: '押金', orderable: false},
                {data: 'user.title', title: '岗位名称', orderable: false},
                {data: 'user.grade', title: '岗位级别', orderable: false},
              ]
            });
            $("#accountTable0_wrapper").css("margin-bottom","2%");
          }
        }
      }
    });
  }
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

  /*队员进行接取任务*/
  $(document).on("click", '#receiveTask', function () {
    window.parent.playClickEffect();
    let applyObj = {mortgage: 0, members: []};
    if ($("#mortgage").text() !== '无') {
      applyObj.mortgage = $("#LeaderGold").val();
    }
    let checkOk = true;
    $(".pitch.his_active").each(function () {
      applyObj.members .push({user_id: $(this).data('id'), mortgage: $(this).siblings('em').find('.goldInput').val()});
      $(".goldInput").each(function () {
        if ($(this).val() && !isInt($(this).val())) {
          checkOk = false;
          $(this).addClass('error');
        }
      });
    });
    if (!checkOk) {
      $('.errorText').text('押金必须是大于等于0的整数！');
      $('.errorText').fadeIn(1000);
      setTimeout( () =>{
        $('.errorText').fadeOut(1000);
      },3000);
      // $('.errorText').css('display', 'block');
      return false;
    }
    let sum = 0;
    if(applyObj.mortgage){
     sum = parseInt(applyObj.mortgage);
    }
    if (applyObj.members.length > 0) {
      for (let i = 0; i < applyObj.members.length; i++) {
        if(applyObj.members[i].mortgage){
          sum = sum + (applyObj.members[i].mortgage==""?0:parseFloat(applyObj.members[i].mortgage));
          //sum = sum + parseInt(applyObj.members[i].mortgage);
        }
      }
    }
    let sumTemp;
    if ($("#mortgage").text() == '无') {
      sumTemp = 0;
      sum=0;
    } else {
      sumTemp = $("#mortgage").text();
    }
    if (sumTemp != sum) {
      console.log(sumTemp,sum);
      checkOk = false;
      $('.errorText').text('队伍总抵押值不等于押金！');
    }
    if(!checkOk){
      $('.errorText').fadeIn(1000);
      setTimeout( () =>{
        $('.errorText').fadeOut(1000);
      },3000);
      return false;
    }
    if(parseInt($('#LeaderGold').data('gold'))<parseInt($('#LeaderGold').val())){
      checkOk=false;
      $('#LeaderGold').addClass('error');
      $('.errorText').text(`您的押金剩余${$('#LeaderGold').data('gold')}，不足以支付押金！`);
      $('.errorText').fadeIn(1000);
      setTimeout( () =>{
        $('.errorText').fadeOut(1000);
      },3000);
      return false;
    }
    $('.his_active').each(function () {
      let $gold=parseInt($(this).siblings('em').children('input').data('gold'));
      let val=parseInt($(this).siblings('em').children('input').val());
      if($gold<val){
        checkOk=false;
        $(this).siblings('em').children('input').addClass('error');
        $('.errorText').text(`${$(this).siblings('em').children('input').data('name')}的押金剩余${$gold}，不足以支付押金！`);
        $('.errorText').fadeIn(1000);
        setTimeout( ()=> {
          $('.errorText').fadeOut(1000);
        },3000);
        return false;
      }
    });
    if (checkOk) {
      const title = '接取任务';
      const type = 1;
      const con = '您确认要接取此任务吗？';
      const clickBtn = 'confirm2';
      zPopup(title, type, con, clickBtn);
    }
  });
  $(document).on("click", '.confirm2', function () {
    $(".pitch.his_active").each(function () {
      let membersPledge = {user_id: $(this).data('id'), mortgage: $(this).siblings('em').find('.goldInput').val()};
      members2.push(membersPledge);
      $(".goldInput").each(function () {
        total += (parseFloat($(this).val()) ? parseFloat($(this).val()) : 0);
      });
      $(this).removeClass('his_active');
    });

    if ($("#mortgage").text() == '无') {
      applyObj.mortgage = '0';
      applyObj.members = members2;
    } else {
      applyObj.mortgage = $("#LeaderGold").val();
      applyObj.members = members2;

    }
    service.getCompleteTask(5,res => {});
    service.getPledgeGold(id, applyObj, res => {
      if (res.code == 400) {
        const title = "提示";
        const type = "2";
        const con = res.msg;
        zPopup(title, type, con)
      } else {
        //location.reload();
        if (!faction_id) {
          if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
            window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&fromPage=teaRoom&teamId=${teamId}`;
          } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
            window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
          } else {
            if(myTask && myTask == 'true'){
              if(personalTask && personalTask == 'true'){
                window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val()+'&personalTask=true&myTask=true';
              }else{
                window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val()+'&myTask=true';
              }
            }else{
              if(personalTask && personalTask == 'true'){
                window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val()+'&personalTask=true';
              }else{
                window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val();
              }
            }
          }
        } else {
          if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
            window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
          } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
            window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
          } else {
            if(myTask && myTask == 'true'){
              window.location.href = 'tempTaskDetail.html?faction_id=' + faction_id + '&taskId=' + $("#isTeam").val()+'&myTask=true';
            }else{
              window.location.href = 'tempTaskDetail.html?faction_id=' + faction_id + '&taskId=' + $("#isTeam").val();
            }
          }
        }
      }
    });
  });
  /*点击多选及添加押金*/
  $(document).on("click", '.pitch', function () {
    window.parent.playClickEffect();
    if ($(this).hasClass("activeImg")) {
      $(this).attr("src", "../i/pitch2.png");
      $(this).siblings('em').removeClass('dis_n');
      $(this).removeClass("activeImg");
      $(this).addClass("his_active");
      $(this).siblings('em').children('input').attr('value','').removeClass('error')
    } else {
      $(this).attr("src", "../i/pitch.png");
      $(this).siblings('em').addClass('dis_n');
      $(this).addClass("activeImg");
      $(this).removeClass("his_active");
    }
  });

  /*招募队员*/
  $(document).on("click", '.EditTeam', function () {
    window.parent.playClickEffect();
    if ($('#mortgage').text() == '无') {
      $('.goldInput').each(function () {
        $(this).siblings('i').remove();
        $(this).remove();
      })
    }
    $(".EditTeam").hide();
    $(".editTeamBox").removeClass('dis_n');
    $(".EditBtn").removeClass('dis_n');
  });
  $(document).on("click", '.cancel', function () {
    window.parent.playClickEffect();
    $(".editTeamBox").addClass('dis_n');
    $(".EditBtn").addClass('dis_n');
    $(".EditTeam").show();
  });
  $(document).on("click", '.confirm', function () {
    window.parent.playClickEffect();
    let applyObj = {mortgage: 0, members: []};
    if ($("#mortgage").text() !== '无') {
      applyObj.mortgage = $("#LeaderGold").val();
    }
    let checkOk = true;
    $(".pitch.his_active").each(function () {
      applyObj.members .push({user_id: $(this).data('id'), mortgage: $(this).siblings('em').find('.goldInput').val()});
      $(".goldInput").each(function () {
        if ($(this).val() && !isInt($(this).val())) {
          checkOk = false;
          $(this).addClass('error');
        }
      });
    });
    if (!checkOk) {
      $('.errorText').text('押金必须是大于等于0的整数！');
      $('.errorText').fadeIn(1000);
      setTimeout( ()=> {
        $('.errorText').fadeOut(1000);
      },3000);
      // $('.errorText').css('display', 'block');
      return false;
    }
    let sum = 0;
    if(applyObj.mortgage){
      sum =  applyObj.mortgage==""?0:parseFloat(applyObj.mortgage);
    }
    if (applyObj.members.length > 0) {
      for (let i = 0; i < applyObj.members.length; i++) {
        sum = sum + (applyObj.members[i].mortgage==""?0:parseFloat(applyObj.members[i].mortgage));
      }
    }
    let sumTemp;
    if ($("#mortgage").text() == '无') {
      sumTemp = 0;
      sum=0;
    } else {
      sumTemp = $("#mortgage").text();
    }
    if (sumTemp != sum) {
      console.log(sumTemp,sum);
      checkOk = false;
      $('.errorText').text('队伍总抵押值不等于押金！');
    }
    if(!checkOk){
      $('.errorText').fadeIn(1000);
      setTimeout( () =>{
        $('.errorText').fadeOut(1000);
      },3000);
      return false;
    }
    if(parseInt($('#LeaderGold').data('origin'))>0){
      if((parseInt($('#LeaderGold').data('gold'))+parseInt($('#LeaderGold').data('origin')))<parseInt($('#LeaderGold').val())){
        checkOk=false;
        $('#LeaderGold').addClass('error');
        $('.errorText').text(`您的押金剩余${$('#LeaderGold').data('gold')}，不足以支付押金！`);
        $('.errorText').fadeIn(1000);
        setTimeout( () =>{
          $('.errorText').fadeOut(1000);
        },3000);
        return false;
      }
    }else{
      if(parseInt($('#LeaderGold').data('gold'))<parseInt($('#LeaderGold').val())){
        checkOk=false;
        $('#LeaderGold').addClass('error');
        $('.errorText').text(`您的押金剩余${$('#LeaderGold').data('gold')}，不足以支付押金！`);
        $('.errorText').fadeIn(1000);
        setTimeout(function () {
          $('.errorText').fadeOut(1000);
        },3000);
        return false;
      }
    }
    $(".goldInput").each( function(){
      if(parseInt($(this).data('origin'))>0){
        if((parseInt($(this).data('gold')+parseInt($(this).data('origin'))))<parseInt($(this).val())){
          checkOk=false;
          $(this).addClass('error');
          $('.errorText').text(`${$(this).data('name')}的押金剩余${$(this).data('gold')}，不足以支付押金！`);
          $('.errorText').fadeIn(1000);
          setTimeout( ()=> {
            $('.errorText').fadeOut(1000);
          },3000);
          return false;
        }
      }else{
        if(parseInt($(this).data('gold'))<parseInt($(this).val())){
          checkOk=false;
          $(this).addClass('error');
          $('.errorText').text(`${$(this).data('name')}的押金剩余${$(this).data('gold')}，不足以支付押金！`);
          $('.errorText').fadeIn(1000);
          setTimeout( () =>{
            $('.errorText').fadeOut(1000);
          },3000);
          return false;
        }
      }
    });
    /*$('.teamMember').each(function () {
      if($(this).val()>0){
        if((parseInt($(this).data('gold')+parseInt($(this).val())))<parseInt($(this).val())){
          checkOk=false;
          $(this).addClass('error');
          $('.errorText').text(`${$(this).data('name')}的押金剩余${$(this).data('gold')}，不足以支付押金！`);
          $('.errorText').fadeIn(1000);
          setTimeout(function () {
            $('.errorText').fadeOut(1000);
          },3000);
          return false;
        }
      }else{
        if(parseInt($(this).data('gold'))<parseInt($(this).val())){
          checkOk=false;
          $(this).addClass('error');
          $('.errorText').text(`${$(this).data('name')}的押金剩余${$(this).data('gold')}，不足以支付押金！`);
          $('.errorText').fadeIn(1000);
          setTimeout(function () {
            $('.errorText').fadeOut(1000);
          },3000);
          return false;
        }
      }
    });*/
    if (checkOk) {
      service.getPledgeGold(id, applyObj, res => {
        if (res.code == 400) {
          const title = "提示";
          const type = "2";
          const con = res.msg;
          zPopup(title, type, con)
        } else {
          if (!faction_id) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&fromPage=teaRoom&teamId=${teamId}`;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            } else {
              if(myTask && myTask =='true'){
                if(personalTask && personalTask == 'true'){
                  window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val()+'&personalTask=true&myTask';
                }else{
                  window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val()+'&myTask=true';
                }
              }else{
                if(personalTask && personalTask == 'true'){
                  window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val()+'&personalTask=true';
                }else{
                  window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val();
                }
              }
            }
          } else {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            } else {
              if(myTask && myTask =='true'){
                window.location.href = 'tempTaskDetail.html?faction_id=' + faction_id + '&taskId=' + $("#isTeam").val()+'&myTask=true';
              }else{
                window.location.href = 'tempTaskDetail.html?faction_id=' + faction_id + '&taskId=' + $("#isTeam").val();
              }
            }
          }
        }
      })
    }
    // $(".editTeamBox").addClass('dis_n');
    // $(".EditBtn").addClass('dis_n');
    // $(".EditTeam").show();
    // $(".pitch.his_active").each(function () {
    //   let membersPledge = {user_id: $(this).data('id'), mortgage: $(this).siblings('em').find('.goldInput').val()};
    //   members2.push(membersPledge);
    //   $(".goldInput").each(function () {
    //     total += (parseFloat($(this).val()) ? parseFloat($(this).val()) : 0);
    //   });
    //   $(this).removeClass('his_active');
    // });
    // if ($("#mortgage").text() == '无') {
    //   applyObj.mortgage = '0';
    //   applyObj.members = members2;
    // } else {
    //   applyObj.mortgage = $("#LeaderGold").val();
    //   applyObj.members = members2;
    // }
    // service.getPledgeGold(id, applyObj, res => {
    //   if (res.code == 400) {
    //     const title = "提示";
    //     const type = "2";
    //     const con = res.msg;
    //     zPopup(title, type, con)
    //   } else {
    //     location.reload();
    //   }
    // })
  });
  $(document).on('click', '.recruit', function () {
    window.parent.playClickEffect();
    if (!faction_id) {
      if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
        window.location.href = `recruitMember.html?receiveTask=1&taskId=${id}&exclude=${exclude}&fromPage=teaRoom&teamId=${teamId}`;
      } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
        window.location.href = `recruitMember.html?receiveTask=1&taskId=${id}&exclude=${exclude}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
      } else {
        if (myTask && myTask =='true'){
          if(personalTask && personalTask == 'true'){
            window.location.href = `recruitMember.html?receiveTask=1&taskId=${id}&exclude=${exclude}&personalTask=true&myTask=true`;
          }else{
            window.location.href = `recruitMember.html?receiveTask=1&taskId=${id}&exclude=${exclude}&myTask=true`;
          }
        }else{
          if(personalTask && personalTask == 'true'){
            window.location.href = `recruitMember.html?receiveTask=1&taskId=${id}&exclude=${exclude}&personalTask=true`;
          }else{
            window.location.href = `recruitMember.html?receiveTask=1&taskId=${id}&exclude=${exclude}`;
          }
        }
      }
    } else {
      if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
        window.location.href = `recruitMember.html?receiveTask=1&taskId=${id}&exclude=${exclude}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
      } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
        window.location.href = `recruitMember.html?receiveTask=1&taskId=${id}&exclude=${exclude}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
      } else {
        if (myTask && myTask =='true'){
          window.location.href = `recruitMember.html?receiveTask=1&taskId=${id}&exclude=${exclude}&faction_id=${faction_id}&myTask=true`;
        }else{
          window.location.href = `recruitMember.html?receiveTask=1&taskId=${id}&exclude=${exclude}&faction_id=${faction_id}`;
        }
      }
    }
  });
  $(document).on('click', '.recruit2', function () {
    window.parent.playClickEffect();
    if (!faction_id) {
      if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
        window.location.href = `recruitMember.html?taskId=${id}&exclude=${exclude}&receiveTask=1&fromPage=teaRoom&teamId=${teamId}`;
      } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
        window.location.href = `recruitMember.html?taskId=${id}&exclude=${exclude}&receiveTask=1&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
      } else {
        if (myTask && myTask =='true'){
          if(personalTask && personalTask == 'true'){
            window.location.href = `recruitMember.html?taskId=${id}&exclude=${exclude}&receiveTask=1&personalTask=true&myTask=true`;
          }else{
            window.location.href = `recruitMember.html?taskId=${id}&exclude=${exclude}&receiveTask=1&myTask=true`;
          }
        }else{
          if(personalTask && personalTask == 'true'){
            window.location.href = `recruitMember.html?taskId=${id}&exclude=${exclude}&receiveTask=1&personalTask=true`;
          }else{
            window.location.href = `recruitMember.html?taskId=${id}&exclude=${exclude}&receiveTask=1`;
          }
        }
      }
    } else {
      if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
        window.location.href = `recruitMember.html?taskId=${id}&exclude=${exclude}&faction_id=${faction_id}&receiveTask=1&fromPage=teaRoom&teamId=${teamId}`;
      } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
        window.location.href = `recruitMember.html?taskId=${id}&exclude=${exclude}&faction_id=${faction_id}&receiveTask=1&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
      } else {
        if (myTask && myTask =='true'){
          window.location.href = `recruitMember.html?taskId=${id}&exclude=${exclude}&receiveTask=1&faction_id=${faction_id}&myTask=true`;
        }else{
          window.location.href = `recruitMember.html?taskId=${id}&exclude=${exclude}&receiveTask=1&faction_id=${faction_id}`;
        }
      }
    }
  });


  /*关闭任务二次弹窗*/
  $(document).on('click', '#close', function () {
    window.parent.playClickEffect();
    const title = "关闭任务";
    const type = "1";
    const con = "您确认要关闭此任务吗？";
    const clickBtn = 'gotoDelete';
    zPopup(title, type, con, clickBtn, id);
  });
  /*批准任务二次弹窗*/
  $(document).on('click', '#ratify', function () {
    window.parent.playClickEffect();
    let user_id = '';
    let name = '';
    $('.activeImg2').each(function () {
      if(!($(this).hasClass('pitch2'))){
        user_id = $(this).data('id');
        name = $(this).data('name');
      }
    });
    if (user_id || parseInt(user_id) === 0) {
      const title = "批准任务";
      const type = "1";
      const con = "您确认批准" + name + "接取此任务吗？";
      const clickBtn = 'retifyBtn';
      zPopup(title, type, con, clickBtn, id, user_id);
    } else {
      let leaderId = $('input[name="applicant_id"]:checked').val();
      let name = $('input[name="applicant_id"]:checked').data('name');
      if (name) {
        let error=false;
        if(parseInt($('#applicant_id').val())||parseInt($('#applicant_id').val()===0)){
          let $mortgage=0;
          if($('#mortgage').text()!='无'){
            $mortgage=parseInt($('#mortgage').text())
          }
          if($mortgage&&($mortgage>parseInt($('#applicant_id').data('gold')))){
            $('#footerError').text(`${$('#applicant_id').data('name')}任务VC剩余${$('#applicant_id').data('gold')}，不足以支付押金！`);
            $('#footerError').fadeIn(1000);
            setTimeout(()=> {
              $('#footerError').fadeOut(1000);
            },3000);
            error=true;
          }
        }
        if(error){
          return false;
        }
        user_id = leaderId;
        const title = "批准任务";
        const type = "1";
        const con = "您确认批准" + name + "接取此任务吗？";
        const clickBtn = 'retifyBtn';
        zPopup(title, type, con, clickBtn, id, user_id);
      }
    }
  });
  /*放弃任务二次弹窗*/
  $(document).on('click', '#abandon', function () {
    window.parent.playClickEffect();
    const title = "放弃任务";
    const type = "1";
    let con='';
    if($("#mortgage").text()=='无'||$("#mortgage").text()==0){
      con = "您确认要放弃此任务吗？";
    }else{
      con = "您确认要放弃此任务吗？</br>（盟主暂未审批，押金如数返还！）";
    }
    const clickBtn = 'abandonOk';
    zPopup(title, type, con, clickBtn, id);
  });
  /*二次确认弹窗*/
  /*确定前往组队*/
  $(document).on("click", ".formTeam", function () {
    const title = "创建队伍";
    const type = "1";
    const con = "队伍名称：<input type='text' placeholder='请输入队伍名称' class='nameBtn' maxlength='15' />";
    const clickBtn = 'createTeam';
    zPopup(title, type, con, clickBtn);
  });
  function zPopup(title, type, con, clickBtn, id, user_id) {
    var h = "";
    if (type == 1) {
      //两个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con"><span>' + con + '</span></div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn ' + clickBtn + '">确定</a>' + '</div>' + '</div>'
    } else if (type == 2) {
      //一个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class="u-Popup-close2  btnStyle" style="margin-right: 0;" href="javascript:void(0)">确定</a>' + '</div>' + '</div>'
    }
    $(".feehideBox").html(h);
    //取消按钮
    $(".u-Popup-close").click(function () {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide()
    });

    $(".u-Popup-close2").click(function () {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
      //location.reload();
      if (!faction_id) {
        if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
          window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&fromPage=teaRoom&teamId=${teamId}`;
        } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
          window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
        } else {
          if (myTask && myTask =='true'){
            if(personalTask && personalTask =='true'){
              window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val()+'&personalTask=true&myTask=true';
            }else{
              window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val()+'&myTask=true';
            }
          }else{
            if(personalTask && personalTask =='true'){
              window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val()+'&personalTask=true';
            }else{
              window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val();
            }
          }
        }
      } else {
        if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
          window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
        } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
          window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
        } else {
          if (myTask && myTask =='true'){
            window.location.href = 'tempTaskDetail.html?faction_id=' + faction_id + '&taskId=' + $("#isTeam").val()+'&myTask=true';
          }else{
            window.location.href = 'tempTaskDetail.html?faction_id=' + faction_id + '&taskId=' + $("#isTeam").val();
          }
        }
      }
    });
    //确定关闭按钮
    $(".gotoDelete").off("click").on("click", function () {
      window.parent.playClickEffect();
      service.edit(id, {status: 13}, (res) => {
        if (res.code == 400) {
          const title = "提示";
          const type = "2";
          const con = res.msg;
          zPopup(title, type, con)
        } else {
          if (!faction_id) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = `tempCloseTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = `tempCloseTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            } else {
              if (myTask && myTask =='true'){
                if(personalTask && personalTask == 'true'){
                  window.location.href = 'tempCloseTask.html?taskId=' + id+'&personalTask=true&myTask=true';
                }else{
                  window.location.href = 'tempCloseTask.html?taskId=' + id+'&myTask=true';
                }
              }else{
                if(personalTask && personalTask == 'true'){
                  window.location.href = 'tempCloseTask.html?taskId=' + id+'&personalTask=true';
                }else{
                  window.location.href = 'tempCloseTask.html?taskId=' + id;
                }
              }
            }
          } else {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = `tempCloseTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = `tempCloseTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            } else {
              if (myTask && myTask =='true'){
                window.location.href = 'tempCloseTask.html?faction_id=' + faction_id + '&taskId=' + id+'&myTask=true';
              }else{
                window.location.href = 'tempCloseTask.html?faction_id=' + faction_id + '&taskId=' + id;
              }
            }
          }
        }
      });
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
    //确定批准任务
    $(".retifyBtn").off("click").on("click", function () {
      window.parent.playClickEffect();
      service.getTaskPerson(id, {user_id: user_id}, (res) => {
        if (res.code == 400) {
          const title = "提示";
          const type = "2";
          const con = res.msg;
          zPopup(title, type, con)
        } else {
          if (!faction_id) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = `tempContinueTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = `tempContinueTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            } else {
              if (myTask && myTask =='true'){
                if(personalTask && personalTask == 'true'){
                  window.location.href = 'tempContinueTask.html?taskId=' + id+'&personalTask=true&myTask=true';
                }else{
                  window.location.href = 'tempContinueTask.html?taskId=' + id+'&myTask=true';
                }
              }else{
                if(personalTask && personalTask == 'true'){
                  window.location.href = 'tempContinueTask.html?taskId=' + id+'&personalTask=true';
                }else{
                  window.location.href = 'tempContinueTask.html?taskId=' + id;
                }
              }
            }
          } else {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = `tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = `tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            } else {
              if (myTask && myTask =='true'){
                window.location.href = 'tempContinueTask.html?faction_id=' + faction_id + '&taskId=' + id+'&myTask=true';
              }else{
                window.location.href = 'tempContinueTask.html?faction_id=' + faction_id + '&taskId=' + id;
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
      let obj = {};
      service.getRevoke(id, obj, (res) => {
        if (res.code == 400) {
          const title = "提示";
          const type = "2";
          const con = res.msg;
          zPopup(title, type, con)
        } else {
          //location.reload();
          if (!faction_id) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&fromPage=teaRoom&teamId=${teamId}`;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            } else {
              if (myTask && myTask =='true'){
                if(personalTask && personalTask == 'true'){
                  window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val()+'&personalTask=true&myTask=true';
                }else{
                  window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val()+'&myTask=true';
                }
              }else{
                if(personalTask && personalTask == 'true'){
                  window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val()+'&personalTask=true';
                }else{
                  window.location.href = 'tempTaskDetail.html?taskId=' + $("#isTeam").val();
                }
              }
            }
          } else {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            } else {
              if (myTask && myTask =='true'){
                window.location.href = 'tempTaskDetail.html?faction_id=' + faction_id + '&taskId=' + $("#isTeam").val()+'&myTask=true';
              }else{
                window.location.href = 'tempTaskDetail.html?faction_id=' + faction_id + '&taskId=' + $("#isTeam").val();
              }
            }
          }
        }
      });
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });

    $(".createTeam").off("click").on("click", function () {
      if (!$(".nameBtn").val() || $(".nameBtn").val() === '') {
        $(".nameBtn").focus();
      } else {
        getCreateTeams();
      }
    });
    function getCreateTeams() {
      let name = {
        name: $('.nameBtn').val(),
      };
      service.getCompleteTask(8,res => {});
      service.getCreateTeams(name, function (res) {
        if (res.code == 400) {
          const title = "提示";
          const type = "2";
          const con = res.msg;
          zPopup(title, type, con)
        } else {
          if (!faction_id) {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = `tempTaskDetail.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = `tempTaskDetail.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            } else {
              if (myTask && myTask =='true'){
                if(personalTask && personalTask == 'true'){
                  window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&personalTask=true&myTask=true`;
                }else{
                  window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&myTask=true`;
                }
              }else{
                if(personalTask && personalTask == 'true'){
                  window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}&personalTask=true`;
                }else{
                  window.location.href = `tempTaskDetail.html?taskId=${$("#isTeam").val()}`;
                }
              }
            }
          } else {
            if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
              window.location.href = `tempTaskDetail.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
            } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
              window.location.href = `tempTaskDetail.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            } else {
              if (myTask && myTask =='true'){
                window.location.href = `tempTaskDetail.html?faction_id=${faction_id}&taskId=${$("#isTeam").val()}&myTask=true`;
              }else{
                window.location.href = `tempTaskDetail.html?faction_id=${faction_id}&taskId=${$("#isTeam").val()}`;
              }
            }
          }
        }
      })
    }

  }

  //指定领队
  $('#addLeader').click(() => {
    window.parent.playClickEffect();
    let arr = [];
    $('.pitchTeams').each(function () {
      arr.push($(this).data('team'))
    });
    if (!faction_id) {
      if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
        window.location.href = `assignLeader.html?fromPage=detail&taskId=${id}&fromPage=teaRoom&teamId=${teamId}&pitchTeams=${arr}`;
      } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
        window.location.href = `assignLeader.html?fromPage=detail&taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&pitchTeams=${arr}`;
      } else {
        if (myTask && myTask =='true'){
          if(personalTask && personalTask == 'true'){
            window.location.href = `assignLeader.html?fromPage=detail&taskId=${id}&pitchTeams=${arr}&personalTask=true&myTask=true`;
          }else{
            window.location.href = `assignLeader.html?fromPage=detail&taskId=${id}&pitchTeams=${arr}&myTask=true`
          }
        }else{
          if(personalTask && personalTask == 'true'){
            window.location.href = `assignLeader.html?fromPage=detail&taskId=${id}&pitchTeams=${arr}&personalTask=true`;
          }else{
            window.location.href = `assignLeader.html?fromPage=detail&taskId=${id}&pitchTeams=${arr}`
          }
        }
      }
    } else {
      if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoom") {
        window.location.href = `assignLeader.html?fromPage=detail&taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}&pitchTeams=${arr}`;
      } else if (getUrlParam('fromPage') && getUrlParam('fromPage') == "teaRoomEdit") {
        window.location.href = `assignLeader.html?fromPage=detail&taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&pitchTeams=${arr}`;
      } else {
        if (myTask && myTask =='true'){
          window.location.href = `assignLeader.html?fromPage=detail&taskId=${id}&pitchTeams=${arr}&faction_id=${getUrlParam('faction_id')}&myTask=true`
        }else{
          window.location.href = `assignLeader.html?fromPage=detail&taskId=${id}&pitchTeams=${arr}&faction_id=${getUrlParam('faction_id')}`
        }
      }
    }
  });
  //时间格式转换 xx-xx-xx
  function dateChange(date) {
    let newDate = date ? (new Date(date)) : new Date();
    return `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
  }

  //时间格式转换 xx:xx
  function dateFormat(date) {
    let newDate = date ? (new Date(date)) : new Date();
    let minutes = newDate.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    return `${newDate.getHours()}:${minutes}`;
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
