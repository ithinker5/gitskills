$(function () {
  const service = new SERVICE();
  const id = getUrlParam('taskId');
  let ROLE_ID=parseInt(window.sessionStorage.getItem('role_id'));
  let myTask = getUrlParam('myTask');
  getHistory(id);
  if(!(ROLE_ID===5||ROLE_ID===4)){
    $('#footer input').css('display','none');
  }
  //返回
  $('.btnBack').click(function () {
    back();
  });
  //编辑任务
  $('#edit').click(function () {
    window.parent.playClickEffect();
    window.location.href = `strategyTaskEdit.html?taskId=${id}`;
  });
  //关闭任务
  $('#close').click(function () {
    window.parent.playClickEffect();
    const title = "关闭任务";
    const type= "1";
    const con = "您确认要关闭此任务吗？";
    zPopup(title,type,con);
  });
  /*二次确认弹窗*/
  function zPopup(title,type, con) {
    var h = "";
    if (type == 1) {
      //两个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn gotoDelete">确定</a>' + '</div>' + '</div>'
    } else if (type == 2) {
      //一个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class="u-Popup-close u-Popup-ok-btn  btnStyle">知道啦</a>' + '</div>' + '</div>'
    }

    $(".feehideBox").html(h)
    //取消按钮
    $(".u-Popup-close").click(function() {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide()
    });
    //确定按钮
    $(".gotoDelete").off("click").on("click",function(){
      window.parent.playClickEffect();
      service.edit(id,{status:13},function () {
        getTask(id);
        getHistory(id);
      });
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
  }
  //获取任务信息
  getTask(id);
  //获取任务文档信息
  getAsserts(id);
  function back() {
    window.parent.playClickEffect();
    if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
      window.location.href = `createTearm.html?teamId=${getUrlParam('teamId')}`;
    }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
      window.location.href = `createTearmDetail.html?teamId=${teamId}&roleId=1`;
    }else if(myTask && myTask == 'true'){
      window.parent.reloadWeb('app/h/myTaskList.html?personalTask=true', false, false, 1465, 820);
    }else{
      //window.parent.closeWebPop();
        window.parent.reloadWeb('app/h/taskList.html', false, false, 1465, 820);
      //window.location.href = 'taskList.html';
    }
  }

  //任务详情
  function getTask(id) {
    service.getById(id, (res) => {
      $('#title').text(res.title);
      $('#desc').text(res.remark);
      let type=`${res.level}级`;
      switch (res.subtype){
        case 0:type=`${type}联盟战略任务`;break;
        case 1:type=`${type}联盟临时任务`;break;
        case 2:type=`${type}帮会挑战任务`;break;
        case 3:type=`${type}帮会基础任务`;break;
        case 4:type=`${type}帮会临时任务`;break;
      }
      $('#type').text(type);
      $('#publishDate').text(dateChange(res.published_at));
      $('#exp').text(res.exp>0?res.exp:'无');
      $('#finishDate').text(dateChange(res.deadline));
      let $status=$('#status');
      switch (res.status){
        case -1:$status.text('删除');break;
        case 0:$status.text('待审核');break;
        case 1:$status.text('待审核');break;
        case 2:$status.text('待审核');break;
        case 3:$status.text('驳回');break;
        case 4:$status.text('悬赏中');break;
        case 5:$status.text('进行中');break;
        case 6:$status.text('待验收');break;
        case 7:$status.text('待验收');break;
        case 8:$status.text('待验收');break;
        case 9:$status.text('待验收');break;
        case 10:$status.text('返工');break;
        case 11:$status.text('验收通过');break;
        case 12:$status.text('已完成');break;
        case 13:$status.text('已关闭');break;
      }
      $('#publishPerson').text(res.created.name);
      $('#vc').text(res.base_vc>0?res.base_vc:'无');
      $('#gold').text(res.gold>0?res.gold:'无');
      $('#mortgage').text(res.mortgage>0?res.mortgage:'无');
      if(res.assigned_factions&&res.assigned_factions.length>0){
        $('#factions').empty()
        for(let i=0;i<res.assigned_factions.length;i++){
          $('#factions').append(
            `<span class="detail">${res.assigned_factions[i].name}</span>`
          )
        }
      }else{
        $('#factions').append(
          `<span class="detail">无</span>`
        )
      }
      if(parseInt(res.status)===13){
        $('#footer input').css('display','none')
      }
    })
  }

  //获取任务文档
  function getAsserts(id) {
    service.getAssetByTaskId(id, res => {
      if(res&&res.length>0){
        $('#nofile').css('display','none');
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
});
