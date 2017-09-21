$(function () {
  let service = new SERVICE();
  const id = getUrlParam('taskId');
  const faction_id = getUrlParam('faction_id');
  let personalTask = getUrlParam('personalTask');
  let myTask = getUrlParam('myTask');
  let trialTask = getUrlParam('trialTask');
  let teamId=getUrlParam('teamId');
  let userId = parseInt(window.sessionStorage.getItem('user_id'));
  let selectLeaderId = window.sessionStorage.getItem('selectId');
  let selectName = window.sessionStorage.getItem('selectLeaderName');
  let selectLeaderGold = window.sessionStorage.getItem('selectLeaderGold');
  let role_id=parseInt(window.sessionStorage.getItem('role_id'));
  let selectId = '';
  let selectLeaderName = '';
  let fileNames = [];//存放文件名称
  let fileArr = [];//存放文件链接
  let exclude = [];
  let members2 = [];
  let applyObj = {mortgage: "", members: []};
  let total = 0;
  let isleader = '';
  //返回
  $('.btnBack').click(function () {
    back();
  });
  $(document).on('click', '#edit', function () {
    window.parent.playClickEffect();
    window.location.href = `tempTaskEdit.html?taskId=${id}`;
  });
  //获取任务信息
  getTask(id);
  //获取任务文档信息
  getAsserts(id);
  //获取历史记录
  getHistory(id);
  function back() {
    window.parent.playClickEffect();
    window.sessionStorage.removeItem('selectId');
    window.sessionStorage.removeItem('selectLeaderName');
    window.sessionStorage.removeItem('selectLeaderGold');
      if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
        window.location.href = `createTearm.html?teamId=${getUrlParam('teamId')}`;
      }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
        window.location.href = `createTearmDetail.html?teamId=${teamId}&roleId=1`;
      }else if(myTask && myTask == 'true'){
        window.parent.reloadWeb('app/h/myTaskList.html?personalTask=true', false, false, 1465, 820);
      }else{
        if (!faction_id) {
          if(personalTask && personalTask=='true'){
            window.parent.reloadWeb('app/h/tasklistPersonal.html?personalTask=true', false, false, 1465, 820);
          }else if(trialTask && trialTask=='true'){
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
      if(res.status==10){
        $('#taskReceiptRead').removeClass('dis_n');
        if(res.complete_desc){
          $('#finishDescRead').text(res.complete_desc);
        }
      }
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
      }
      $('#publishPerson').text(res.created.name);
      $("#checkPerson").text(res.created.name);
      $('#vc').text(res.base_vc > 0 ? res.base_vc : '无');
      $('#gold').text(res.gold > 0 ? res.gold : '无');
      $('#mortgage').text(res.mortgage > 0 ? res.mortgage : '无');
      if (res.applicant && res.applicant.user && parseInt(res.applicant.user._id)!==userId){
        let html = `<p>
        <label>队伍名称：</label><span id="teamName" data-team="${res.applicant.team._id}">${res.applicant.team.name}</span>
        <label>领队：</label><span id="teamLeader">${res.applicant.user.name}</span>
        </p>
         <div style="position:relative"><table id="accountTable" class="table table-striped"></table></div>`;
        for (let i = 0; i < res.taskApplicants.length; i++) {
          res.taskApplicants[i]._id2 = i + 1;
          res.taskApplicants[i].user.title = res.taskApplicants[i].user.title||'无';
          res.taskApplicants[i].user.grade=res.taskApplicants[i].user.grade||'无';
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
        if(trialTask && trialTask =='true'){
          $('.EditTeam').css('display','none');
          $(".dataTables_wrapper").css('margin-bottom','0');
        }
        $('.changeBoxTask .memberInfo .dataTables_wrapper').css('margin-bottom','0');
        if(!faction_id){
          if(personalTask && personalTask == 'true'){
            if(role_id===4||role_id===5||(userId==res.created._id)){
              $("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
            }
          }else if(trialTask && trialTask =='true'){
            if(role_id===4||role_id===5||(userId==res.created._id)){
              $("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
            }
          }else{
            if(role_id===4||role_id===5){
              $("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
            }
          }
          for(let i=0;i<res.taskApplicants.length;i++){
            if(res.taskApplicants[i].user._id==userId){
              if(res.taskApplicants[i].mortgage>0){
                $("#footer").append('<input id="quitTask" class="btn btnStyle subBtn2 quitPartner" type="button" value="退出任务"/>');
              }else{
                $("#footer").append('<input id="quitTask" class="btn btnStyle subBtn2" type="button" value="退出任务"/>');
              }
              break;
            }
          }
        }else{
          if(role_id===4||role_id===5||(role_id===3&&(parseInt(faction_id)===parseInt(window.sessionStorage.getItem('faction_id'))))||(userId==res.created._id)){
            $("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
          }
          for(let i=0;i<res.taskApplicants.length;i++){
            if(res.taskApplicants[i].user._id==userId){
              if(res.taskApplicants[i].mortgage>0){
                $("#footer").append('<input id="quitTask" class="btn btnStyle subBtn2 quitPartner" type="button" value="退出任务"/>');
              }else{
                $("#footer").append('<input id="quitTask" class="btn btnStyle subBtn2" type="button" value="退出任务"/>');
              }
              break;
            }
          }
        }

      }else{
        getUserJoin(id, userId);
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
          if(parseInt(res[i].type)===0){
            $('#fileList').append(`
          <div class="fileItem">
                            <label>${name}</label>
                             <a href=${res[i].url} class="download" download=${name}></a>
                            <span>${res[i].user.name}</span>
                            <span>${dateChange(res[i].created_at)}</span>
                            <span>${dateFormat(res[i].created_at)}</span>
                        </div>
          `)
          }else {
            fileNames.push(name);//存放文件名称
            fileArr.push({_id: res[i]._id, url: res[i].url});//存放文件链接
            $('#finishNoFile').css('display', 'none');
            $('#finishFileList').append(`
          <div class="fileItem">
                            <label>${name}</label>
                             <a href=${res[i].url} class="download" download=${name}></a>
                            <span>${res[i].user.name}</span>
                            <span>${dateChange(res[i].created_at)}</span>
                            <span>${dateFormat(res[i].created_at)}</span>
                        </div>
          `)
          }

        }
      } else {
        $('#fileList').css('display', 'none')
      }
    })
  }
  /*关闭任务二次弹窗*/
  $(document).on('click', '#close', function () {
    window.parent.playClickEffect();
    const title = "关闭任务";
    const type = "1";
    const con = "您确认要关闭此任务吗？";
    const clickBtn = 'gotoDelete';
    zPopup(title, type, con, clickBtn, id);
  });
  /*退出任务二次弹窗*/
  $(document).on('click', '#quitTask', function () {
    window.parent.playClickEffect();
    const title = "退出任务";
    const type = "1";
    let con ='';
    if($("#quitTask").hasClass('quitPartner')){
      con = "您确认要退出此任务吗？</br>（您将失去所有押金！）";
    }else{
      con = "您确认要退出此任务吗？";
    }
    const clickBtn = 'quitTask';
    zPopup(title, type, con, clickBtn, id);
  });
  /*确定关闭按钮*/
  //确定关闭按钮
  $(document).on('click','.gotoDelete',function(){
    window.parent.playClickEffect();
    service.edit(id, {status: 13}, (res) => {
      if (res.code == 400) {
        const title = "提示";
        const type = "2";
        const con = res.msg;
        zPopup(title, type, con)
      } else {
        if(!faction_id){
          if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
            window.location.href =`tempCloseTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
          }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
            window.location.href =`tempCloseTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
          }else{
            if(myTask && myTask == 'true'){
              if(personalTask && personalTask == 'true'){
                window.location.href = `tempCloseTask.html?taskId=${id}&personalTask=true&myTask=true`;
              }else if(trialTask && trialTask=='true'){
                window.location.href =`tempCloseTask.html?taskId=${id}&trialTask=true&myTask=true`;
              }else{
                window.location.href = `tempCloseTask.html?taskId=${id}&myTask=true`;
              }
            }else{
              if(personalTask && personalTask == 'true'){
                window.location.href = `tempCloseTask.html?taskId=${id}&personalTask=true`;
              }else if(trialTask && trialTask=='true'){
                window.location.href =`tempCloseTask.html?taskId=${id}&trialTask=true`;
              }else{
                window.location.href = `tempCloseTask.html?taskId=${id}`;
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
              window.location.href = `tempCloseTask.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
            }else{
              window.location.href = `tempCloseTask.html?taskId=${id}&faction_id=${faction_id}`;
            }
          }
        }
      }
    });
    $(".g-Popup").hide();
    $(".g-Popup-div").hide();
  });
  function zPopup(title, type, con, clickBtn, id, user_id) {
    var h = "";
    if (type == 1) {
      //两个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con"><span>' + con + '</span></div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn ' + clickBtn + '">确定</a>' + '</div>' + '</div>'
    } else if (type == 2) {
      //一个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class="u-Popup-close  btnStyle" style="margin-right: 0;" href="javascript:void(0)">确定</a>' + '</div>' + '</div>'
    }
    $(".feehideBox").html(h);
    //取消按钮
    $(".u-Popup-close").click(function () {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide()
    });

   /* $(".u-Popup-close2").click(function () {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
      // location.reload();
    });*/
    //确定退出任务按钮
    $(".quitTask").off("click").on("click", function () {
      window.parent.playClickEffect();
      service.quitTask(id, (res) => {
        if (res.code == 400) {
          const title = "提示";
          const type = "2";
          const con = res.msg;
          zPopup(title, type, con)
        } else {
          if(!faction_id){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              if(personalTask && personalTask == 'true'){
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}&personalTask=true`;
              }else if(trialTask && trialTask=='true'){
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}&trialTask=true`;
              }else{
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
              }
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              if(personalTask && personalTask == 'true'){
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&personalTask=true`;
              }else if(trialTask && trialTask=='true'){
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&trialTask=true`;
              }else{
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
              }
            }else{
              if(myTask && myTask == 'true'){
                if(personalTask && personalTask == 'true'){
                  window.location.href = `tempContinueTask.html?taskId=${id}&personalTask=true&myTask=true`;
                }else if(trialTask && trialTask=='true'){
                  window.location.href =`tempContinueTask.html?taskId=${id}&trialTask=true&myTask=true`;
                }else{
                  window.location.href = `tempContinueTask.html?taskId=${id}&myTask=true`;
                }
              }else{
                if(personalTask && personalTask == 'true'){
                  window.location.href = `tempContinueTask.html?taskId=${id}&personalTask=true`;
                }else if(trialTask && trialTask=='true'){
                  window.location.href =`tempContinueTask.html?taskId=${id}&trialTask=true`;
                }else{
                  window.location.href = `tempContinueTask.html?taskId=${id}`;
                }
              }
            }
          }else{
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href =`tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href =`tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            }else{
              if(myTask && myTask == 'true'){
                window.location.href = `tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
              }else{
                window.location.href = `tempContinueTask.html?taskId=${id}&faction_id=${faction_id}`;
              }
            }
          }
        }
      });
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
    //确定任务验收单提交
    $(".confirmSubmitTask").off("click").on("click", function () {
      window.parent.playClickEffect();
        let obj={status:6,complete_desc:$('#finishDesc').val()};
        if(fileArr.length>0){
          obj.assets=fileArr
        }
        service.edit(id,obj, (res) => {
          if (res.code == 400) {
            const title = "提示";
            const type = "2";
            const con = res.msg;
            zPopup(title, type, con)
          } else {
            if(!faction_id){
              if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
                if(personalTask && personalTask == 'true'){
                  window.location.href =`willReceipt.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}&personalTask=true`;
                }else if(trialTask && trialTask=='true'){
                  window.location.href =`willReceipt.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}&trialTask=true`;
                }else{
                  window.location.href =`willReceipt.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
                }
              }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
                if(personalTask && personalTask == 'true'){
                  window.location.href =`willReceipt.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&personalTask=true`;
                }else if(trialTask && trialTask=='true'){
                  window.location.href =`willReceipt.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&trialTask=true`;
                }else{
                  window.location.href =`willReceipt.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
                }
              }else{
                if(myTask && myTask == 'true'){
                  if(personalTask && personalTask == 'true'){
                    window.location.href = `willReceipt.html?taskId=${id}&personalTask=true&myTask=true`;
                  }else if(trialTask && trialTask=='true'){
                    window.location.href =`willReceipt.html?taskId=${id}&trialTask=true&myTask=true`;
                  }else{
                    window.location.href = `willReceipt.html?taskId=${id}&myTask=true`;
                  }
                }else{
                  if(personalTask && personalTask == 'true'){
                    window.location.href = `willReceipt.html?taskId=${id}&personalTask=true`;
                  }else if(trialTask && trialTask=='true'){
                    window.location.href =`willReceipt.html?taskId=${id}&trialTask=true`;
                  }else{
                    window.location.href = `willReceipt.html?taskId=${id}`;
                  }
                }
              }
            }else{
              if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
                window.location.href =`willReceipt.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
              }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
                window.location.href =`willReceipt.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
              }else{
                if(myTask && myTask == 'true'){
                  window.location.href = `willReceipt.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
                }else{
                  window.location.href = `willReceipt.html?taskId=${id}&faction_id=${faction_id}`;
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
          if(!faction_id){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href =`tempFailTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href =`tempFailTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            }else{
              if(myTask && myTask == 'true'){
                if(personalTask && personalTask =='true'){
                  window.location.href = `tempFailTask.html?taskId=${id}&personalTask=true&myTask=true`;
                }else if(trialTask && trialTask=='true'){
                  window.location.href =`tempFailTask.html?taskId=${id}&trialTask=true&myTask=true`;
                }else{
                  window.location.href = `tempFailTask.html?taskId=${id}&myTask=true`;
                }
              }else{
                if(personalTask && personalTask =='true'){
                  window.location.href = `tempFailTask.html?taskId=${id}&personalTask=true`;
                }else if(trialTask && trialTask=='true'){
                  window.location.href =`tempFailTask.html?taskId=${id}&trialTask=true`;
                }else{
                  window.location.href = `tempFailTask.html?taskId=${id}`;
                }
              }
            }
          }else{
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href =`tempFailTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href =`tempFailTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            }else{
              if(myTask && myTask == 'true'){
                window.location.href = `tempFailTask.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
              }else{
                window.location.href = `tempFailTask.html?taskId=${id}&faction_id=${faction_id}`;
              }
            }
          }
        }
      });
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
    //确定修改领队 提交
    $(".submitChangeLeader").off("click").on("click", function () {
      window.parent.playClickEffect();
      service.getTaskPerson(id,{user_id:$('input[name="applicant_id"]:checked').val()}, (res) => {
        if (res.code == 400) {
          const title = "提示";
          const type = "2";
          const con = res.msg;
          zPopup(title, type, con)
        } else {
          if(!faction_id){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              if(personalTask && personalTask == 'true'){
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}&personalTask=true`;
              }else if(trialTask && trialTask=='true'){
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}&trialTask=true`;
              }else{
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
              }
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              if(personalTask && personalTask == 'true'){
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&personalTask=true`;
              }else if(trialTask && trialTask=='true'){
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&trialTask=true`;
              }else{
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
              }
            }else{
              if(myTask && myTask == 'true'){
                if(personalTask && personalTask =='true'){
                  window.location.href = `tempContinueTask.html?taskId=${id}&personalTask=true&myTask=true`;
                }else if(trialTask && trialTask=='true'){
                  window.location.href =`tempContinueTask.html?taskId=${id}&trialTask=true&myTask=true`;
                }else{
                  window.location.href = `tempContinueTask.html?taskId=${id}&myTask=true`;
                }
              }else{
                if(personalTask && personalTask =='true'){
                  window.location.href = `tempContinueTask.html?taskId=${id}&personalTask=true`;
                }else if(trialTask && trialTask=='true'){
                  window.location.href =`tempContinueTask.html?taskId=${id}&trialTask=true`;
                }else{
                  window.location.href = `tempContinueTask.html?taskId=${id}`;
                }
              }
            }
          }else{
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href =`tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href =`tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            }else{
              if(myTask && myTask == 'true'){
                window.location.href = `tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
              }else{
                window.location.href = `tempContinueTask.html?taskId=${id}&faction_id=${faction_id}`;
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
        return;
      } else {
        getCreateTeams();
      }
    });
    function getCreateTeams() {
      let name = {
        name: $('.nameBtn').val(),
      };
      service.getCreateTeams(name, function (res) {
        isleader = true;
        $("#taskMember").removeClass('dis_n');
        $(".subBtn2").attr("id", 'receiveTask');
        service.getMyTeams(res2 => {
          let html = '<div class="editTeamBox editTeamBox2">'
            + '<p><label>队伍名称：</label><span id="teamName" data-team='+res2[0]._id+'>' + res2[0].name + '</span><label>'
            + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;领队：<span id="teamLeader">' + res2[0].created.name + '</span><i>押金：</i><input class="goldInput" id="LeaderGold" /></p><p id="test2">队员：'
            + '<div class="recruit2"></div>'
            + '</div>';
          html += '</div>';
          $(".tableBox").append(html);
          for (let j = 0; j < res2[0].members.length; j++) {
            exclude.push(res2[0].members[j].user._id);
            $("#test2").after('<b><img class="pitch activeImg" data-id="' + res2[0].members[j].user._id + '" src="../i/pitch.png" /><i>' + res2[0].members[j].user.name + '</i><em class="dis_n"><i>押金：</i><input class="goldInput" /></em></b>');
          }
        })
        $(".g-Popup").hide();
        $(".g-Popup-div").hide();
      })
    }
  }
  //获取历史记录
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
  //用户参加的申请团队列表-----用于判断其他人中自己或者所在团队是否参与申请分为悬赏中和待批准两种状态
  //-------apply为true，自己作为队长已申请，teams不为空自己的队伍展示，也可能作为别的队伍成员展示一张列表；按钮为放弃任务和编辑队伍
  //-------apply为false，自己作为队长未申请，teams为空，也无参与的队伍进行接取任务。自己可以申请，按钮为接取
  //-------apply为false，自己作为队长未申请，teams不为空，自己作为队员已参加，同时以队长的身份进行接取任务。按钮为接取
  function getUserJoin(id, userId) {
    service.getUserJoin(id, userId, (res) => {
      if (res.isApply === true || res.isApply === 'true') {
        $("#taskMember").removeClass('dis_n');
        for (let i = 0; i < res.teams.length; i++) {
          let html = '<p><label>队伍名称：</label><span id="teamName" data-team='+res.teams[i]._id+'>' + res.teams[i].name + '</span><label>'
            + '领队：</label><span id="teamLeader">' + res.teams[i].created.name + '</span>';
          html += '</p>'
            + '<div style="position:relative"><table id="accountTable' + i + '" class="table table-striped"></table>';
          if (userId === parseInt(res.teams[i].created._id)) {
            if(getUrlParam('receiveTask') === 2||getUrlParam('receiveTask') === '2'){
              html += '<button class="EditTeam dis_n">编辑队伍</button>';
              html+= '<div class="editTeamBox" style="position: relative;">';
            }else{
              html += '<button class="EditTeam">编辑队伍</button>';
              html+='<div class="editTeamBox dis_n" style="position: relative;">';
            }
            if($("#mortgage").text() == '无'||$("#mortgage").text() ==0){
              html+='<p>领队：<span>' + res.teams[i].created.name + '</span></p><p id="test">队员：</p>'
            }else{
              html+='<p>领队：<span>' + res.teams[i].created.name + '</span><i>押金：</i><input class="goldInput" id="LeaderGold" data-gold='+res.teams[i].created.task_vc+' /></p><p id="test">队员：</p>'
            }
              //+ '<p>领队：<span>' + res.teams[i].created.name + '</span><i>押金：</i><input class="goldInput" id="LeaderGold" /></p><p id="test">队员：</p>'
              html+= '<div class="errorText" id="errorText" style="position: absolute;bottom: 0.5rem;left: 0.3rem;"></div><div class="recruit"></div>'
              + '</div>';
            if(getUrlParam('receiveTask') === 2||getUrlParam('receiveTask') === '2'){
              html += '<div class="EditBtn"><span class="cancel">取消</span><span class="confirm">确定</span></div>';
            }else{
              html += '<div class="EditBtn dis_n"><span class="cancel">取消</span><span class="confirm">确定</span></div>';
            }
          }
          html += '</div>';
          $(".tableBox").append(html);
          let $leaderGold=0;
          for (let j = 0; j < res.teams[i].members.length; j++) {
            if(res.teams[i].members[j].role_id ==0){
              res.teams[i].members[j].role_id='领队';
              $leaderGold=res.teams[i].members[j].mortgage
            }else if(res.teams[i].members[j].mortgage!=0){
              res.teams[i].members[j].role_id='合伙人';
            }else if(res.teams[i].members[j].mortgage==0){
              res.teams[i].members[j].role_id='队员';
            }
            res.teams[i].members[j].user.level = 'Lv' + res.teams[i].members[j].user.level;
            res.teams[i].members[j].user.title=res.teams[i].members[j].user.title||'无';
            res.teams[i].members[j]._id = (j + 1);
            res.teams[i].members[j].user.grade=res.teams[i].members[j].user.grade||'无';
          }
          $("#LeaderGold").val($leaderGold).attr('data-origin',$leaderGold);
          if(i===0){
            let $joinMembers=res.teams[0].members;
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
          $("#createdId").val(res.teams[i].created._id);

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
          /*if(trialTask && trialTask =='true'){
            if ((userId == res.teams[i].created._id)&&($("#publishPerson").text()==$("#teamLeader").text())){
              $("#footer").html('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/>');
            }
          }*/
        }
        /*试炼任务隐藏招募队员按钮*/
        if(trialTask && trialTask =='true'){
          $('.EditTeam').css('display','none');
          $(".dataTables_wrapper").css('margin-bottom','0');
        }
        if (selectLeaderId || parseInt(selectLeaderId) === 0) {
          $("#footer").append('<div class="footerError" id="footerError"></div><input id="cancelChangeLeader" class="btn btnStyle subBtn2" type="button" value="取消"/><input id="submitChangeLeader" class="btn btnStyle subBtn2" type="button" value="提交"/>');
          $('#memberInfo').removeClass('dis_n');
          $('.EditTeam').css('display','none');
          $('.changeBoxTask .memberInfo .dataTables_wrapper').css('margin-bottom','0');
          $('#applicant_id')
            .val(`${window.sessionStorage.getItem('selectId')}`)
            .attr({'data-name':window.sessionStorage.getItem('selectLeaderName'),'data-gold':selectLeaderGold});
          $('#applicant').css('display', 'inline-block')
            .after(`<span style="vertical-align: middle">${window.sessionStorage.getItem('selectLeaderName')}</span>`);
          $('input[name="applicant_id"]').eq(1).attr('checked', 'checked');
          $('.activeImg2').removeClass('activeImg2').addClass('pitch2');
          window.sessionStorage.removeItem('selectId');
          window.sessionStorage.removeItem('selectLeaderName');
          window.sessionStorage.removeItem('selectLeaderGold');
        } else {
          $('input[name="applicant_id"]').eq(0).attr('checked', 'checked');
          if(trialTask && trialTask == 'true'){
            if(role_id===4||role_id===5){
              $("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
            }else{
              if(faction_id&&role_id===3&&(parseInt(faction_id)===parseInt(window.sessionStorage.getItem('faction_id')))){
                $("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
              }else if ((userId == $("#createdId").val())&&($("#publishPerson").text()==$("#teamLeader").text())){
                $("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
              }else{
                $("#footer").append('<input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
              }
            }
          }else{
            if(role_id===4||role_id===5){
              $("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="changeTask" class="btn btnStyle subBtn2" type="button" value="转移任务"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
            }else{
              if(faction_id&&role_id===3&&(parseInt(faction_id)===parseInt(window.sessionStorage.getItem('faction_id')))){
                $("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="changeTask" class="btn btnStyle subBtn2" type="button" value="转移任务"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
              }else if ((userId == $("#createdId").val())&&($("#publishPerson").text()==$("#teamLeader").text())){
                $("#footer").append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="changeTask" class="btn btnStyle subBtn2" type="button" value="转移任务"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
              }else{
                $("#footer").append('<input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="changeTask" class="btn btnStyle subBtn2" type="button" value="转移任务"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
              }
            }
          }
        }
      }
      if(getUrlParam('receiveTask')){
        $('#submitTask').attr('disabled',"true");
        $('#changeTask').attr('disabled',"true");
        $('#abandon').attr('disabled',"true");
      }
    })
  }


//指定领队
  $('#addLeader').click(() => {
    window.parent.playClickEffect();
    if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
      if(faction_id||faction_id==0){
        window.location.href =`assignLeader.html?fromPage=continueTask&taskId=${id}&faction_id=${faction_id}&pitchTeams=${$('#teamName').data('team')}&fromPageTea=teaRoom&teamId=${teamId}`;
      }else{
        window.location.href =`assignLeader.html?fromPage=continueTask&taskId=${id}&pitchTeams=${$('#teamName').data('team')}&fromPageTea=teaRoom&teamId=${teamId}`;
      }
    }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
      if(faction_id||faction_id==0){
        window.location.href =`assignLeader.html?fromPage=continueTask&taskId=${id}&faction_id=${faction_id}&pitchTeams=${$('#teamName').data('team')}&fromPageTea=teaRoomEdit&teamId=${teamId}&roleId=1`;
      }else{
        window.location.href =`assignLeader.html?fromPage=continueTask&taskId=${id}&pitchTeams=${$('#teamName').data('team')}&fromPageTea=teaRoomEdit&teamId=${teamId}&roleId=1`;
      }
    }/*else if(personalTask && personalTask =='true'){
      window.location.href = `assignLeader.html?fromPage=continueTask&taskId=${id}&pitchTeams=${$('#teamName').data('team')}&personalTask=true`;
    }*/else{
      if(myTask && myTask == 'true'){
        if(faction_id||faction_id==0){
          window.location.href = `assignLeader.html?fromPage=continueTask&taskId=${id}&faction_id=${faction_id}&pitchTeams=${$('#teamName').data('team')}&myTask=true`
        }else{
          if(personalTask && personalTask =='true'){
            window.location.href = `assignLeader.html?fromPage=continueTask&taskId=${id}&pitchTeams=${$('#teamName').data('team')}&personalTask=true&myTask=true`;
          }else if(trialTask && trialTask=='true'){
            window.location.href =`assignLeader.html?fromPage=continueTask&taskId=${id}&pitchTeams=${$('#teamName').data('team')}&trialTask=true&myTask=true`;
          }else{
            window.location.href = `assignLeader.html?fromPage=continueTask&taskId=${id}&pitchTeams=${$('#teamName').data('team')}&myTask=true`
          }
        }
      }else{
        if(faction_id||faction_id==0){
          window.location.href = `assignLeader.html?fromPage=continueTask&taskId=${id}&faction_id=${faction_id}&pitchTeams=${$('#teamName').data('team')}`
        }else{
          if(personalTask && personalTask =='true'){
            window.location.href = `assignLeader.html?fromPage=continueTask&taskId=${id}&pitchTeams=${$('#teamName').data('team')}&personalTask=true`;
          }else if(trialTask && trialTask=='true'){
            window.location.href =`assignLeader.html?fromPage=continueTask&taskId=${id}&pitchTeams=${$('#teamName').data('team')}&trialTask=true`;
          }else{
            window.location.href = `assignLeader.html?fromPage=continueTask&taskId=${id}&pitchTeams=${$('#teamName').data('team')}`
          }
        }
      }
    }
    //window.location.href = `assignLeader.html?fromPage=continueTask&taskId=${id}&faction_id=${faction_id}&pitchTeams=${$('#teamName').data('team')}`
  });
  //点击提交出现提交内容
  $(document).on('click', '#changeTask', function () {
    window.parent.playClickEffect();
    $('.EditTeam').css('display','none');
    $('.changeBoxTask .memberInfo .dataTables_wrapper').css('margin-bottom','0');
    $('#memberInfo').removeClass('dis_n');
    $("#footer").empty().append('<div class="footerError" id="footerError"></div><input id="cancelChangeLeader" class="btn btnStyle subBtn2" type="button" value="取消"/><input id="submitChangeLeader" class="btn btnStyle subBtn2" type="button" value="提交"/>');
  });
  /*取消指定领队*/
  $(document).on('click', '#cancelChangeLeader', function () {
    window.parent.playClickEffect();
    $('#memberInfo').addClass('dis_n');
    if(!trialTask){
      $('.EditTeam').css('display','block');
      $('.changeBoxTask .memberInfo .dataTables_wrapper').css('margin-bottom','7%');
    }
    if(trialTask && trialTask == 'true'){
      if(role_id===4||role_id===5||(faction_id&&role_id===3&&(parseInt(faction_id)===parseInt(window.sessionStorage.getItem('faction_id'))))){
        $("#footer").empty().append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
      }else if((userId == $("#createdId").val())&&($("#publishPerson").text()==$("#teamLeader").text())){
        $("#footer").empty().append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
      }else{
        $("#footer").empty().append('<input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
      }
    }else{
      if(role_id===4||role_id===5||(faction_id&&role_id===3&&(parseInt(faction_id)===parseInt(window.sessionStorage.getItem('faction_id'))))){
        $("#footer").empty().append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="changeTask" class="btn btnStyle subBtn2" type="button" value="转移任务"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
      }else if((userId == $("#createdId").val())&&($("#publishPerson").text()==$("#teamLeader").text())){
        $("#footer").empty().append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="changeTask" class="btn btnStyle subBtn2" type="button" value="转移任务"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
      }else{
        $("#footer").empty().append('<input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="changeTask" class="btn btnStyle subBtn2" type="button" value="转移任务"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
      }
    }
    window.sessionStorage.removeItem('selectId');
    window.sessionStorage.removeItem('selectLeaderName');
    window.sessionStorage.removeItem('selectLeaderGold');
  });
  /*确定修改指定领队*/
  $(document).on('click', '#submitChangeLeader', function () {
    window.parent.playClickEffect();
    window.sessionStorage.removeItem('selectId');
    window.sessionStorage.removeItem('selectLeaderName');
    window.sessionStorage.removeItem('selectLeaderGold');
    if($('input[name="applicant_id"]:checked').data('name')){
      let error=false;
      if($('#mortgage').text()!='无'&&(parseInt($('#mortgage').text())>parseInt($('#applicant_id').data('gold')))){
        error=true;
        $('#footerError').text(`${$('#applicant_id').data('name')}任务VC剩余${$('#applicant_id').data('gold')}，不足以支付押金！`);
        $('#footerError').fadeIn(1000);
        setTimeout(function () {
          $('#footerError').fadeOut(1000);
        },1000);
      }
      if(error){
        return false;
      }else{
        const title = "转移任务";
        const type = "1";
        let con = '';
        if($("#mortgage").text()=='无'||$("#mortgage").text()==0){
          con = "您确认要将此任务转移给"+$('input[name="applicant_id"]:checked').data('name')+"？</br>";
        }else{
          con = "您确认要将此任务转移给"+$('input[name="applicant_id"]:checked').data('name')+"？</br>（转移后押金如数返还）";
        }
        const clickBtn = 'submitChangeLeader';
        zPopup(title, type, con, clickBtn, id);
      }

    }else{
      const title = "提示";
      const type = "2";
      const con = "请选择要指定的领队";
      zPopup(title, type, con);
    }
  });
  $(document).on('click', '#abandon', function () {
    window.parent.playClickEffect();
    const title = "放弃任务";
    const type = "1";
    let con='';
    if($("#mortgage").text()=='无'||$("#mortgage").text()==0){
      con = "您确认要放弃此任务吗？";
    }else{
      con = "您确认要放弃此任务吗？</br>（您及您的队伍将失去所有押金！）";
    }
    const clickBtn = 'abandonOk';
    zPopup(title, type, con, clickBtn, id);
  });
  /*放弃任务二次弹窗*/
  /*$(document).on('click', '#abandon', function () {
    window.parent.playClickEffect();
    const title = "关闭任务";
    const type = "1";
    const con = "您确认要放弃此任务吗？</br>（盟主暂未审批，押金如数返还）";
    const clickBtn = 'abandonOk';
    zPopup(title, type, con, clickBtn, id);
  });*/
//点击提交出现提交内容
  $(document).on('click', '#submitTask', function () {
    window.parent.playClickEffect();
    $('.EditTeam').css('display','none');
    $('#taskReceiptRead').addClass('dis_n');
    $('.changeBoxTask .memberInfo .dataTables_wrapper').css('margin-bottom','0');
    $('#taskReceipt').removeClass('dis_n');
    $("#footer").empty().append('<input id="cancelSubmitTask" class="btn btnStyle subBtn2" type="button" value="取消"/><input id="confirmSubmitTask" class="btn btnStyle subBtn2" type="button" value="提交"/>');
    $('#finishDesc').val('');
    fileArr=[];
    fileNames=[];
    $('#finishFileContainer>.item>.item').remove();
  });
  /*取消提交任务验收单*/
  $(document).on('click', '#cancelSubmitTask', function () {
    window.parent.playClickEffect();
    if($('#status').text()=='返工'){
      $('#taskReceiptRead').removeClass('dis_n');
    }
    $('#taskReceipt').addClass('dis_n');
    if(!trialTask){
      $('.EditTeam').css('display','block');
      $('.changeBoxTask .memberInfo .dataTables_wrapper').css('margin-bottom','7%');
      if(role_id===4||role_id===5||(faction_id&&role_id===3&&(parseInt(faction_id)===parseInt(window.sessionStorage.getItem('faction_id'))))){
        $("#footer").empty().append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="changeTask" class="btn btnStyle subBtn2" type="button" value="转移任务"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
      }else if((userId == $("#createdId").val())&&($("#publishPerson").text()==$("#teamLeader").text())){
        $("#footer").empty().append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="changeTask" class="btn btnStyle subBtn2" type="button" value="转移任务"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
      }else{
        $("#footer").empty().append('<input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="changeTask" class="btn btnStyle subBtn2" type="button" value="转移任务"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
      }
    }else{
      if(role_id===4||role_id===5||(faction_id&&role_id===3&&(parseInt(faction_id)===parseInt(window.sessionStorage.getItem('faction_id'))))){
        $("#footer").empty().append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
      }else if((userId == $("#createdId").val())&&($("#publishPerson").text()==$("#teamLeader").text())){
        $("#footer").empty().append('<input id="close" class="btn btnStyle subBtn2" type="button" value="关闭任务"/><input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
      }else{
        $("#footer").empty().append('<input id="submitTask" class="btn btnStyle subBtn2" type="button" value="提交"/><input id="abandon" class="btn btnStyle subBtn2" type="button" value="放弃任务"/>');
      }
    }
  });
  /*取消提交任务验收单*/
  $(document).on('click', '#confirmSubmitTask', function () {
    window.parent.playClickEffect();
    let finishDesc=$('#finishDesc');
    errorTip(finishDesc);
    if(finishDesc.val()){
      const title = "提交任务";
      const type = "1";
      const con = "您确认要提交任务吗？";
      const clickBtn = 'confirmSubmitTask';
      zPopup(title, type, con, clickBtn, id);
    }
  });
//上传文件
  $('#file').change(fileChange);
  //删除文件
  $(document).on('click','.delete',deleteFile);
  function fileChange() {
    service.addAssert('file',res => {
      let file = $(this).val();
      let fileName = getFileName(file);
      addFile(fileName);
      fileNames.push(fileName);
      fileArr.push({url:res.url});
      $('#file').change(fileChange);
    })
  }
  function getFileName(o) {
    let pos = o.lastIndexOf("\\");
    return o.substring(pos + 1);
  }
  function addFile(name) {
    $('.fileText').before(`
    <div class="item" style="margin-left: 0.2rem">
          <span class="filename">${name}</span>
          <span class="delete"></span>
        </div>
    `);
  }
  function deleteFile() {
    let index=$('#fileContainer .delete').index($(this));
    fileNames.splice(index,1);
    fileArr.splice(index,1);
    $(this).parent().remove()
  }
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







  /*队员进行接取任务*/
  $(document).on("click", '#receiveTask', function () {
    const title = '接取任务';
    const type = 1;
    const con = '您确认要接取此任务吗？';
    const clickBtn = 'confirm2';
    zPopup(title, type, con, clickBtn);
  });
  /*点击多选及添加押金*/
  $(document).on("click", '.pitch', function () {
    window.parent.playClickEffect();
    if ($(this).hasClass("activeImg")) {
      $(this).attr("src", "../i/pitch2.png");
      $(this).siblings('em').removeClass('dis_n');
      $(this).siblings('em').children('input').attr('value','').removeClass('error');
      $(this).removeClass("activeImg");
      $(this).addClass("his_active");
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
    $('#submitTask').attr('disabled',"true");
    $('#changeTask').attr('disabled',"true");
    $('#abandon').attr('disabled',"true");
    $(".EditTeam").hide();
    $(".editTeamBox").removeClass('dis_n');
    $(".EditBtn").removeClass('dis_n');
  });
  $(document).on("click", '.cancel', function () {
    window.parent.playClickEffect();
    $('#submitTask').removeAttr("disabled");
    $('#changeTask').removeAttr("disabled");
    $('#abandon').removeAttr("disabled");
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
    $(".pitch.his_active").each( function() {
      applyObj.members.push({user_id: $(this).data('id'), mortgage: $(this).siblings('em').find('.goldInput').val()});
      $(".goldInput").each( () =>{
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
          sum = sum + parseInt(applyObj.members[i].mortgage);
        }
      }
    }
    let sumTemp;
    if ($("#mortgage").text() == '无') {
      sumTemp = 0;
    } else {
      sumTemp = $("#mortgage").text();
    }
    if (sumTemp != sum) {
      checkOk = false;
      $('.errorText').text('队伍总抵押值不等于押金！');
    }
    if(!checkOk){
      $('.errorText').fadeIn(1000);
      setTimeout(function () {
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
    if (checkOk) {
      service.getPledgeGold(id, applyObj, res => {
        if (res.code == 400) {
          const title = "提示";
          const type = "2";
          const con = res.msg;
          zPopup(title, type, con)
        } else {
          /*$(".editTeamBox").addClass('dis_n');
          $(".EditBtn").addClass('dis_n');
          $(".EditTeam").show();*/
          //location.reload();
          if (!faction_id) {
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              if(personalTask && personalTask == 'true'){
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}&personalTask=true`;
              }else if(trialTask && trialTask=='true'){
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}&trialTask=true`;
              }else{
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
              }
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              if(personalTask && personalTask == 'true'){
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&personalTask=true`;
              }else if(trialTask && trialTask=='true'){
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&trialTask=true`;
              }else{
                window.location.href =`tempContinueTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
              }
            } else {
              if(myTask && myTask == 'true'){
                if(personalTask && personalTask =='true'){
                  window.location.href = 'tempContinueTask.html?taskId=' + id+'&personalTask=true&myTask=true';
                }else{
                  window.location.href = 'tempContinueTask.html?taskId=' + id+'&myTask=true';
                }
              }else{
                if(personalTask && personalTask =='true'){
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
              if(myTask && myTask == 'true'){
                window.location.href = 'tempContinueTask.html?faction_id=' + faction_id + '&taskId=' + id+'&myTask=true';
              }else{
                window.location.href = 'tempContinueTask.html?faction_id=' + faction_id + '&taskId=' + id;
              }
            }
          }
        }
      })
    }





    // $('#submitTask').removeAttr("disabled");
    // $('#changeTask').removeAttr("disabled");
    // $('#abandon').removeAttr("disabled");
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
    // if($("#mortgage").val()=='无'){
    //   applyObj.mortgage='0';
    //   applyObj.members=members2;
    // }else{
    //   applyObj.mortgage=$("#LeaderGold").val();
    //   applyObj.members=members2;
    //
    // }
    // let service = new SERVICE();
    // service.getPledgeGold(id,applyObj,res=>{
    //   if(res.code==400){
    //     const title = "提示";
    //     const type = "2";
    //     const con = res.msg;
    //     zPopup(title, type, con)
    //   }else{
    //     location.reload();
    //   }
    // });
  });
  $(document).on('click', '.recruit', function () {
    window.parent.playClickEffect();
    if(!faction_id){
      if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
        window.location.href =`recruitMember.html?receiveTask=2&taskId=${id}&exclude=${exclude}&fromPage=teaRoom&teamId=${teamId}`;
      }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
        window.location.href =`recruitMember.html?receiveTask=2&taskId=${id}&exclude=${exclude}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
      }else{
        if(myTask && myTask == 'true'){
          if(personalTask && personalTask == 'true'){
            window.location.href= `recruitMember.html?receiveTask=2&taskId=${id}&exclude=${exclude}&personalTask=true&myTask=true`;
          }else{
            window.location.href= `recruitMember.html?receiveTask=2&taskId=${id}&exclude=${exclude}&myTask=true`;
          }
        }else{
          if(personalTask && personalTask == 'true'){
            window.location.href= `recruitMember.html?receiveTask=2&taskId=${id}&exclude=${exclude}&personalTask=true`;
          }else{
            window.location.href= `recruitMember.html?receiveTask=2&taskId=${id}&exclude=${exclude}`;
          }
        }
      }
    }else{
      if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
        window.location.href =`recruitMember.html?receiveTask=2&taskId=${id}&exclude=${exclude}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
      }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
        window.location.href =`recruitMember.html?receiveTask=2&taskId=${id}&exclude=${exclude}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
      }else{
        if(myTask && myTask == 'true'){
          window.location.href= `recruitMember.html?receiveTask=2&taskId=${id}&exclude=${exclude}&faction_id=${faction_id}&myTask=true`;
        }else{
          window.location.href= `recruitMember.html?receiveTask=2&taskId=${id}&exclude=${exclude}&faction_id=${faction_id}`;
        }
      }
    }
  });
  $(document).on('click', '.recruit2', function () {
    window.parent.playClickEffect();
    if(!faction_id){
      if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
        window.location.href =`recruitMember.html?taskId=${id}&exclude=${exclude}&receiveTask=2&fromPage=teaRoom&teamId=${teamId}`;
      }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
        window.location.href =`recruitMember.html?taskId=${id}&exclude=${exclude}&receiveTask=2&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
      }else{
        if(personalTask && personalTask == 'true'){
          window.location.href= `recruitMember.html?receiveTask=2&taskId=${id}&exclude=${exclude}&personalTask=true`;
        }else{
          window.location.href= `recruitMember.html?receiveTask=2&taskId=${id}&exclude=${exclude}`;
        }
      }
    }else{
      if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
        window.location.href =`recruitMember.html?taskId=${id}&exclude=${exclude}&faction_id=${faction_id}&receiveTask=2&fromPage=teaRoom&teamId=${teamId}`;
      }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
        window.location.href =`recruitMember.html?taskId=${id}&exclude=${exclude}&faction_id=${faction_id}&receiveTask=2&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
      }else{
        window.location.href= `recruitMember.html?taskId=${id}&exclude=${exclude}&receiveTask=2&faction_id=${faction_id}`;
      }
    }
  });


  /*批准任务二次弹窗*/
  $(document).on('click', '#ratify', function () {
    window.parent.playClickEffect();
    let user_id = '';
    let name = '';
    $('.activeImg2').each(function () {
      user_id = $(this).data('id');
      name = $(this).data('name');
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
      if (leaderId) {
        user_id = leaderId;
        const title = "批准任务";
        const type = "1";
        const con = "您确认批准" + name + "接取此任务吗？";
        const clickBtn = 'retifyBtn';
        zPopup(title, type, con, clickBtn, id, user_id);
      }
    }
  });
  /*二次确认弹窗*/
  /*确定前往组队*/
  $(document).on("click", ".formTeam", function () {
    const title = "创建队伍";
    const type = "1";
    const con = "队伍名称：<input type='text' placeholder='请输入队伍名称' class='nameBtn' />";
    const clickBtn = 'createTeam';
    zPopup(title, type, con, clickBtn);
  });
});
