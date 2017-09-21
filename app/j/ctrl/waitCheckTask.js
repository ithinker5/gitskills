$(function () {
  let service = new SERVICE();
  const id = getUrlParam('taskId');
  const faction_id = getUrlParam('faction_id');
  let teamId=getUrlParam('teamId');
  let personalTask = getUrlParam('personalTask');
  let myTask = getUrlParam('myTask');
  const ROLEID=parseInt(window.sessionStorage.getItem('role_id'));
  //返回
  $('.btnBack').click(function () {
    window.parent.playClickEffect();
    if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
      window.location.href = `createTearmDetail.html?teamId=${getUrlParam('teamId')}&roleId=1`;
    }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
      window.location.href = `createTearm.html?teamId=${getUrlParam('teamId')}`;
    }else if(myTask && myTask == 'true'){
      window.parent.reloadWeb('app/h/myTaskList.html?personalTask=true', false, false, 1465, 820);
    }else{
      if(personalTask && personalTask=='true'){
        window.parent.reloadWeb('app/h/tasklistPersonal.html?personalTask=true', false, false, 1465, 820);
      }else{
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
    service.getById(id, (res) => {
      $('#title').text(res.title);
      $('#desc').text(res.remark);
      let type=`${res.level}级`;
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
      let $status = $('#status');
      if(personalTask && personalTask == 'true'){
        switch (res.status) {
          case -1:$status.text('删除').attr('data-status',res.status);break;
          case 0:
            $status.text('待审核').attr('data-status',res.status);
            if(ROLEID===2||ROLEID===4||ROLEID===5){
              if(ROLEID===4||ROLEID===5){
                $("#footer").append(`<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="驳回"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="审核通过"/><input id="closeTask" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>`);
              }else if(ROLEID===2&&(window.sessionStorage.getItem('section_id')==res.created.section_id)){
                $("#footer").append(`<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="驳回"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="审核通过"/>`);
              }
            }
            break;
          case 1:
            $status.text('待审核').attr('data-status',res.status);
            if(ROLEID===3||ROLEID===4||ROLEID===5){
              if(ROLEID===4||ROLEID===5){
                $("#footer").append(`<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="驳回"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="审核通过"/><input id="closeTask" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>`);
              }else if(ROLEID===3&&(window.sessionStorage.getItem('faction_id')==res.created.faction_id)){
                $("#footer").append(`<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="驳回"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="审核通过"/>`);
              }
            }
            break;
          case 2:
            $status.text('待审核').attr('data-status',res.status);
            if(ROLEID===4||ROLEID===5){
              $("#footer").append(`<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="驳回"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="审核通过"/><input id="closeTask" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>`);
            }
            break;
          case 3:
            $status.text('驳回').attr('data-status',res.status);
            if(window.sessionStorage.getItem('user_id')==res.created._id){
              $("#footer").append(`<input id="closeTask" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="newEdit" class="btn btnStyle subBtn2" type="button" value="重新编辑"/>`);
            }break;
          case 4:$status.text('悬赏中').attr('data-status',res.status);break;
          case 5:$status.text('进行中').attr('data-status',res.status);break;
          case 6:$status.text('待验收').attr('data-status',res.status);break;
          case 7:$status.text('待验收').attr('data-status',res.status);break;
          case 8:$status.text('待验收').attr('data-status',res.status);break;
          case 9:$status.text('待验收').attr('data-status',res.status);break;
          case 10:$status.text('返工').attr('data-status',res.status);break;
          case 11:$status.text('待分配').attr('data-status',res.status);break;
          case 12:$status.text('已完成').attr('data-status',res.status);break;
          case 13:$status.text('已关闭').attr('data-status',res.status);break;
        }
      }else{
        switch (res.status) {
          case -1:$status.text('删除').attr('data-status',res.status);break;
          case 0:
            $status.text('待审核').attr('data-status',res.status);
            if(ROLEID===2||ROLEID===3||ROLEID===4||ROLEID===5){
              $("#footer").append(`<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="驳回"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="审核通过"/><input id="closeTask" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>`);
            }break;
          case 1:
            $status.text('待审核').attr('data-status',res.status);
            if(ROLEID===3||ROLEID===4||ROLEID===5){
              $("#footer").append(`<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="驳回"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="审核通过"/><input id="closeTask" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>`);
            }break;
          case 2:
            $status.text('待审核').attr('data-status',res.status);
            if(ROLEID===4||ROLEID===5){
              $("#footer").append(`<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="驳回"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="审核通过"/><input id="closeTask" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>`);
            }break;
          case 3:
            $status.text('驳回').attr('data-status',res.status);
            if(window.sessionStorage.getItem('user_id')==res.created._id){
              $("#footer").append(`<input id="closeTask" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="newEdit" class="btn btnStyle subBtn2" type="button" value="重新编辑"/>`);
            }break;
          case 4:$status.text('悬赏中').attr('data-status',res.status);break;
          case 5:$status.text('进行中').attr('data-status',res.status);break;
          case 6:$status.text('待验收').attr('data-status',res.status);break;
          case 7:$status.text('待验收').attr('data-status',res.status);break;
          case 8:$status.text('待验收').attr('data-status',res.status);break;
          case 9:$status.text('待验收').attr('data-status',res.status);break;
          case 10:$status.text('返工').attr('data-status',res.status);break;
          case 11:$status.text('待分配').attr('data-status',res.status);break;
          case 12:$status.text('已完成').attr('data-status',res.status);break;
          case 13:$status.text('已关闭').attr('data-status',res.status);break;
        }
      }
      $('#type').text(type);
      $('#publishDate').text(dateChange(res.created_at));
      $('#exp').text(res.exp>0?res.exp:'无');
      $('#finishDate').text(dateChange(res.deadline));
      $('#publishPerson').text(res.created.name);
      if(res.verified){
        if(parseInt(res.status)===3){
          $("#checkPerson").text(`${res.verified}`);
        }else{
          $("#checkPerson").text(`${res.verified}、${res.assigned_to.name}`);
        }
      }else{
        $("#checkPerson").text(res.assigned_to.name);
      }
      $('#vc').text(res.base_vc>0?res.base_vc:'无');
      $('#gold').text(res.gold>0?res.gold:'无');
      $('#mortgage').text(res.mortgage>0?res.mortgage:'无');
      let gradeText='无';
      if(res.leader_grade&&res.leader_grade!==null&&res.leader_grade!==''){
        gradeText=res.leader_grade;
      }
      $('#leader_grade').text(gradeText);
      $('#leader_level').text(res.leader_level>0?res.leader_level:'无');
      if (res.applicant&&res.applicant.user&&(parseInt(res.applicant.user._id)||parseInt(res.applicant.user._id)===0)){
        $('#taskMember').removeClass('dis_n');
        let html = `<p>
        <label>队伍名称：</label><span id="teamName">${res.applicant.team.name}</span>
        <label>领队：</label><span id="teamLeader">${res.applicant.user.name}</span>
        </p>
         <div style="position:relative"><table id="accountTable" class="table table-striped"></table></div>`;
        for (let i = 0; i < res.taskApplicants.length; i++) {
          res.taskApplicants[i]._id2 = i + 1;
          res.taskApplicants[i].user.title = res.taskApplicants[i].user.title||'无';
          if(parseInt(res.taskApplicants[i].role_id)===0){
            res.taskApplicants[i].role_id2 = '领队'
          }else if(parseInt(res.taskApplicants[i].mortgage)!==0){
            res.taskApplicants[i].role_id2 = '合伙人'
          }else if(parseInt(res.taskApplicants[i].mortgage)===0){
            res.taskApplicants[i].role_id2 = '队员'
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
        $('.changeBoxTask .memberInfo .dataTables_wrapper').css('margin-bottom','0');
      }else{
        $('#leaderRelease').removeClass('dis_n');
      }

    })
  }
  //获取任务文档
  function getAsserts(id) {
    service.getAssetByTaskId(id, res => {
      if(res&&res.length>0){
        $('#noFile').css('display','none');
        for(let i=0;i<res.length;i++){
          let pos = res[i].url.lastIndexOf("\/");
          let name=res[i].url.substring(pos + 1);
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
      }else{
        $('#fileList').css('display','none')
      }
    })
  }
  /*获取历史记录*/
  function getHistory(id) {
    service.getHistory(id, (res) => {
      if(res.length == 0 || res.length == '0'){
        $(".historyItem").html('<span>暂无历史记录更新！</span>')
      }
      let html='';
      for(let i=0,len=res.length;i<len;i++){
        html +='<p style="margin-top: 1rem;">'+ res[i].user.name+'&nbsp;&nbsp;于&nbsp;&nbsp;'+dateChange(res[i].created_at)+'&nbsp;&nbsp;'+dateFormat(res[i].created_at)+'&nbsp;&nbsp;更新&nbsp;&nbsp;</p>';
        for (var j = 0, actionLen = (JSON.parse(res[i].action));j < actionLen.length; j++) {
          if (actionLen[j].newvalue||actionLen[j].newvalue==0) {
            if(actionLen[j].oldvalue === null||actionLen[j].oldvalue==='null'||actionLen[j].oldvalue===''){
              if(actionLen[j].newvalue ==='' ||actionLen[j].newvalue ==='null'||actionLen[j].newvalue ===null){
                html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">\"' + actionLen[j].name +'\"&nbsp;从无变更为无</p>';
              }else{
                html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">' + actionLen[j].name +'从无变更为&nbsp;\"<b>'+actionLen[j].newvalue+ '</b>\"&nbsp;</p>';
              }
              //html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;margin-bottom:1rem;">' + actionLen[j].name +'&nbsp;&nbsp;从&nbsp;&nbsp;无&nbsp;&nbsp;变更为&nbsp;&nbsp;'+actionLen[j].newvalue+ '</p></p>';
            }else{
              if((actionLen[j].newvalue||actionLen[j].newvalue==0)&&(actionLen[j].desc||actionLen[j].desc==0)){
                html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">\"' + actionLen[j].newvalue +'\"&nbsp;'+ actionLen[j].desc + '</p>';
              }else if((actionLen[j].oldvalue||actionLen[j].oldvalue==0)&&(actionLen[j].desc||actionLen[j].desc==0)){
                html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">\"' + actionLen[j].oldvalue +'\"&nbsp;'+ actionLen[j].desc + '</p>';
              }else{
                if(actionLen[j].newvalue ==='' ||actionLen[j].newvalue ==='null'||actionLen[j].newvalue ===null){
                  if(actionLen[j].oldvalue==='无'){
                    html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">' + actionLen[j].name +'从'+ actionLen[j].oldvalue +'变更为无</p>';
                  }else{
                    html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">' + actionLen[j].name +'从&nbsp;\"<b>'+ actionLen[j].oldvalue +'</b>\"&nbsp;变更为无</p>';
                  }
                }else{
                  if(actionLen[j].oldvalue==='无'){
                    html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">' + actionLen[j].name +'从'+ actionLen[j].oldvalue +'变更为&nbsp;\"<b>'+actionLen[j].newvalue+ '</b>\"&nbsp;</p>';
                  }else{
                    html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">' + actionLen[j].name +'从&nbsp;\"<b>'+ actionLen[j].oldvalue +'</b>\"&nbsp;变更为&nbsp;\"<b>'+actionLen[j].newvalue+ '</b>\"&nbsp;</p>';
                  }
                }
              }
            }
          } else {
            html += '<p style="color: rgba(255,248,164,1);margin-left:4rem;">' + actionLen[j].name +'&nbsp;\"<b>'+ actionLen[j].desc + '</b>\"</p>';
          }
        }
        $(".historyItem").html(html);
      }
    })
  }
getHistory(id);

  //驳回任务二次弹窗
  $(document).on('click','#returnTask',function(){
    window.parent.playClickEffect();
    $('#returnTask').removeClass('dis_n');
    $("#footer").empty().append('<input id="cancel" class="btn btnStyle subBtn2" type="button" value="取消"/><input id="submitReason" class="btn btnStyle subBtn2" type="button" value="提交"/>');
  });
  /*$(document).on('click','#returnTask',function(){
    window.parent.playClickEffect();
    $('#returnTask').removeClass('dis_n');
    $("#footer").empty().append('<input id="cancel" class="btn btnStyle subBtn2" type="button" value="取消"/><input id="submitReason" class="btn btnStyle subBtn2" type="button" value="提交"/>');
  });*/
  $(document).on('click','#cancel',function(){
    window.parent.playClickEffect();
    $('#returnTask').addClass('dis_n');
    $('#returnReason').val('');
    if(personalTask && personalTask =='true'){
      if(ROLEID === 4||ROLEID === 5){
        $("#footer").empty().append(`
            <input id="returnTask" class="btn btnStyle subBtn2" type="button" value="驳回"/>
            <input id="checkTask" class="btn btnStyle subBtn2" type="button" value="审核通过"/>
            <input id="closeTask" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>
            `);
      }else{
        $("#footer").empty().append(`<input id="returnTask" class="btn btnStyle subBtn2" type="button" value="驳回"/><input id="checkTask" class="btn btnStyle subBtn2" type="button" value="审核通过"/>`);
      }
    }else{
      $("#footer").empty().append(`
            <input id="returnTask" class="btn btnStyle subBtn2" type="button" value="驳回"/>
            <input id="checkTask" class="btn btnStyle subBtn2" type="button" value="审核通过"/>
            <input id="closeTask" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>
            `);
    }
  });
//  确认驳回任务
  $(document).on('click','#submitReason',function(){
    window.parent.playClickEffect();
    let returnReason=$('#returnReason');
    errorTip(returnReason);
    if(returnReason.val()){
      const title = "驳回任务";
      const type= "1";
      const con = `您确认要驳回${$('#publishPerson').text()}发布的任务吗？`;
      const clickBtn ='submitReason';
      zPopup(title,type,con,clickBtn,id);
    }
  });
//审核任务二次弹窗
  $(document).on('click','#checkTask',function(){
    window.parent.playClickEffect();
    const title = "审核通过";
    const type= "1";
    const con = `您确认要批准${$('#publishPerson').text()}发布的任务吗？`;
    const clickBtn ='checkTask';
    zPopup(title,type,con,clickBtn,id);
  });


  /*关闭任务二次弹窗*/
  $(document).on('click','#closeTask',function(){
    window.parent.playClickEffect();
    const title = "关闭任务";
    const type= "1";
    const con = "您确认要关闭此任务吗？";
    const clickBtn ='closeTask';
    zPopup(title,type,con,clickBtn,id);
  });
  /*驳回页面重新编辑*/
  $(document).on('click','#newEdit',function(){
    if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
      if(faction_id||parseInt(faction_id)===0){
        window.location.href =`tempTaskEdit.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}&fromPage=reject`;
      }else{
        window.location.href =`tempTaskEdit.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}&fromPage=reject`;
      }
    }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
      if(faction_id||parseInt(faction_id)===0){
        window.location.href =`tempTaskEdit.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&fromPage=reject`;
      }else{
        window.location.href =`tempTaskEdit.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&fromPage=reject`;
      }
    }else if(personalTask && personalTask == 'true'){
      if(myTask && myTask == 'true'){
        window.location.href =`tempTaskEdit.html?taskId=${id}&fromPage=reject&personalTask=true&myTask=true`;
      }else{
        window.location.href =`tempTaskEdit.html?taskId=${id}&fromPage=reject&personalTask=true`;
      }
    }else{
      if(myTask && myTask == 'true'){
        if(faction_id||parseInt(faction_id)===0){
          window.location.href =`tempTaskEdit.html?taskId=${id}&faction_id=${faction_id}&fromPage=reject&myTask=true`;
        }else{
          window.location.href =`tempTaskEdit.html?taskId=${id}&fromPage=reject&myTask=true`;
        }
      }else{
        if(faction_id||parseInt(faction_id)===0){
          window.location.href =`tempTaskEdit.html?taskId=${id}&faction_id=${faction_id}&fromPage=reject`;
        }else{
          window.location.href =`tempTaskEdit.html?taskId=${id}&fromPage=reject`;
        }
      }
    }
  });

  function zPopup(title,type, con,clickBtn,id,user_id) {
    var h = "";
    if (type == 1) {
      //两个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con"><span>' + con + '</span></div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn '+clickBtn+'">确定</a>' + '</div>' + '</div>'
    } else if (type == 2) {
      //一个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class="u-Popup-close2  btnStyle" style="margin-right: 0;" href="javascript:void(0)">确定</a>' + '</div>' + '</div>'
    }
    $(".feehideBox").html(h);
    //取消按钮
    $(".u-Popup-close").click(function() {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide()
    });

    $(".u-Popup-close2").click(function() {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
      location.reload();
    });
    //确定关闭按钮
    $(".closeTask").off("click").on("click",function(){
      window.parent.playClickEffect();
      service.edit(id, {status:13},(res) => {
        if(!faction_id){
          if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
            window.location.href =`tempCloseTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
          }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
            window.location.href =`tempCloseTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
          }else{
            if(myTask && myTask == 'true'){
              if(personalTask && personalTask =='true'){
                window.location.href =`tempCloseTask.html?taskId=${id}&personalTask=true&myTask=true`;
              }else{
                window.location.href =`tempCloseTask.html?taskId=${id}&myTask=true`;
              }
            }else{
              if(personalTask && personalTask =='true'){
                window.location.href =`tempCloseTask.html?taskId=${id}&personalTask=true`;
              }else{
                window.location.href =`tempCloseTask.html?taskId=${id}`;
              }
            }
          }
        }else{
          if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
            window.location.href =`tempCloseTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
          }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
            window.location.href =`tempCloseTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
          }else{
            if(myTask && myTask == 'true'){
              window.location.href =`tempCloseTask.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
            }else{
              window.location.href =`tempCloseTask.html?taskId=${id}&faction_id=${faction_id}`;
            }
          }
        }
      });
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
    //确定驳回
    $(".submitReason").off("click").on("click",function(){
      window.parent.playClickEffect();
      service.edit(id, {status:3,reject_desc:$('#returnReason').val()},(res) => {
        location.reload();
        //window.location.href = `taskList2.html?faction_id=${faction_id}`;
      });
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
    //确定批准任务
    $(".checkTask").off("click").on("click",function(){
      window.parent.playClickEffect();
      let status;
      if(personalTask && personalTask == 'true'){
        if(parseInt($('#status').data('status'))===0){
          if(ROLEID ===4||ROLEID===5){
            status=4;
          }else{
            status=1;
          }
        }else if(parseInt($('#status').data('status'))===1){
          if(ROLEID ===4||ROLEID===5){
            status=4;
          }else{
            status=2;
          }
        }else{
          status=4
        }
      }else{
        if(parseInt($('#status').data('status'))===1){
          status=2
        }else{
          status=4
        }
      }
      service.edit(id, {status:status},(res) => {
        if(parseInt(res.status)===1||parseInt(res.status)===2){
          window.location.reload();
        }else{
          if(!faction_id){
            if(parseInt(res.status)===4){
              if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
                window.location.href =`tempTaskDetail.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
              }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
                window.location.href =`tempTaskDetail.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
              }else{
                if(myTask && myTask == 'true'){
                  if(personalTask && personalTask =='true'){
                    window.location.href =`tempTaskDetail.html?taskId=${id}&personalTask=true&myTask=true`;
                  }else{
                    window.location.href =`tempTaskDetail.html?taskId=${id}&myTask=true`;
                  }
                }else{
                  if(personalTask && personalTask =='true'){
                    window.location.href =`tempTaskDetail.html?taskId=${id}&personalTask=true`;
                  }else{
                    window.location.href =`tempTaskDetail.html?taskId=${id}`;
                  }
                }
              }
            }else if(parseInt(res.status)===5){
              if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
              }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
              }else{
                if(myTask && myTask == 'true'){
                  if(personalTask && personalTask =='true'){
                    window.location.href =`tempContinueTask.html?taskId=${id}&personalTask=true&myTask=true`;
                  }else{
                    window.location.href =`tempContinueTask.html?taskId=${id}&myTask=true`;
                  }
                }else{
                  if(personalTask && personalTask =='true'){
                    window.location.href =`tempContinueTask.html?taskId=${id}&personalTask=true`;
                  }else{
                    window.location.href =`tempContinueTask.html?taskId=${id}`;
                  }
                }
              }
            }
          }else{
            if(parseInt(res.status)===4){
              if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
                window.location.href =`tempTaskDetail.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
              }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
                window.location.href =`tempTaskDetail.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
              }else{
                if(myTask && myTask == 'true'){
                  window.location.href =`tempTaskDetail.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
                }else{
                  window.location.href =`tempTaskDetail.html?taskId=${id}&faction_id=${faction_id}`;
                }
              }
            }else if(parseInt(res.status)===5){
              if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
                window.location.href =`tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
              }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
                window.location.href =`tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
              }else{
                if(myTask && myTask == 'true'){
                  window.location.href =`tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
                }else{
                  window.location.href =`tempContinueTask.html?taskId=${id}&faction_id=${faction_id}`;
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
    $(".abandonOk").off("click").on("click",function(){
      window.parent.playClickEffect();
      let obj={};
      service.getRevoke(id,obj, (res) => {
        if(res.code==400){
          const title = "提示";
          const type = "2";
          const con = res.msg;
          zPopup(title, type, con)
        }else{
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
    let newDate = date?(new Date(date)):new Date();
    return `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`;
  }
  //时间格式转换 xx:xx
  function dateFormat(date) {
    let newDate = date?(new Date(date)):new Date();
    let minutes=newDate.getMinutes();
    if(minutes<10){
      minutes=`0${minutes}`
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