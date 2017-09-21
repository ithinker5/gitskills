$(function () {
  let service = new SERVICE();
  const id = getUrlParam('taskId');
  let userId = parseInt(window.sessionStorage.getItem('user_id'));
  const faction_id = getUrlParam('faction_id');
  let personalTask = getUrlParam('personalTask');
  let trialTask = getUrlParam('trialTask');
  let myTask = getUrlParam('myTask');
  const teamId = getUrlParam('teamId');
  let role_id = parseInt(window.sessionStorage.getItem('role_id'));
  let selectId = '';
  let selectLeaderName = '';
  //返回
  $('.btnBack').click(function () {
    back();
  });
  /*$(document).on('click', '#edit', function () {
    window.parent.playClickEffect();
    window.location.href = `tempTaskEdit.html?taskId=${id}`;
  });*/
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
      if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
        window.location.href = `createTearm.html?teamId=${teamId}`;
      }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
        window.location.href = `createTearmDetail.html?teamId=${teamId}&roleId=1`;
      }else if(myTask && myTask == 'true'){
        window.parent.reloadWeb('app/h/myTaskList.html', false, false, 1465, 820);
      }else{
        if (!faction_id) {
          if(personalTask && personalTask=='true'){
            window.parent.reloadWeb('app/h/tasklistPersonal.html', false, false, 1465, 820);
          }else if(trialTask && trialTask =='true'){
            window.parent.reloadWeb('app/h/ywc/tryTasklist.html?trialTask=true', false, false, 1465, 820);
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
      let $status = $('#status');
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
        case 14:
          $status.text('失败');
          break;
      }
      $('#publishPerson').text(res.created.name);
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
      //if (parseInt(res.applicant.user._id) !== userId) {
      let html='';
      if(res.applicant){
        html = `<p><label>队伍名称：</label><span id="teamName">${res.applicant.team.name}</span>
       <label>领队：</label><span id="teamLeader">${res.applicant.user.name}</span>
       </p>
       <div style="position:relative"><table id="accountTable" class="table table-striped"></table></div>`;
      }else{
        $(".taskItem2").css("border-top",'0');
        $(".memberInfo").addClass('dis_n');
      }
      for (let i = 0; i < res.taskApplicants.length; i++) {
        res.taskApplicants[i]._id2 = i + 1;
        res.taskApplicants[i].user.title=res.taskApplicants[i].user.title||'无';
        res.taskApplicants[i].user.grade=res.taskApplicants[i].user.grade||'无';
        if (parseInt(res.taskApplicants[i].role_id) === 0) {
          res.taskApplicants[i].role_id2 = '领队'
        } else {
          res.taskApplicants[i].role_id2 = res.taskApplicants[i].mortgage>0?'合伙人':'队员'
        }
      }
      $(".tableBox").append(html);
      $(`.tableBox #accountTable`).dataTable({
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
        data: res.taskApplicants,
        columns: [
          {data: '_id2', title: '序号', orderable: false},
          {data: 'role_id2', title: '职务', orderable: false},
          {data: 'user.name', title: '姓名', orderable: false},
          {data: 'user.level', title: '等级', orderable: false},
          {data: 'mortgage', title: '押金', orderable: false},
          {data: 'user.title', title: '岗位名称', orderable: false},
          {data: 'user.grade', title: '岗位级别', orderable: false},
        ]
      });
      $('.changeBoxTask .memberInfo .dataTables_wrapper').css('margin-bottom', '0');
    })
  }


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


  function zPopup(title, type, con, clickBtn) {
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
