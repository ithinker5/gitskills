/*盟主：是否有队伍接取该任务，有则为待批准，无则为悬赏中*/
/*其他人：自己是否有申请，有则为待批准，无则为悬赏中*/
$(function () {
  const service = new SERVICE();
  const id = window.location.href.split('?taskId=')[1];
  //返回
  $('.btnBack').click(function () {
    back();
  });
  $('#edit').click(function () {
    window.location.href = `tempTaskEdit.html?taskId=${id}`;
  });
  //获取任务信息
  getTask(id);
  //获取任务文档信息
  getAsserts(id);
  /*获取申请人信息*/
  getApplication(id);
  function back() {
    window.location.href = 'taskList.html';
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
        case 11:$status.text('待分配');break;
        case 12:$status.text('已完成');break;
        case 13:$status.text('已关闭');break;
      }
      $('#publishPerson').text(res.created.name);
      $('#vc').text(res.base_vc>0?res.base_vc:'无');
      $('#gold').text(res.gold>0?res.gold:'无');
      $('#mortgage').text(res.mortgage>0?res.mortgage:'无');
      var gradeText = '无';
      if (res.leader_grade &&res.leader_grade!==null&&res.leader_grade!=='') {
        gradeText=res.leader_grade;
      }
      $('#leader_grade').text(gradeText);
      $('#leader_level').text(res.leader_level > 0 ? res.leader_level : '无');
    })
  }

  //获取任务文档
  function getAsserts(id) {
    service.getAssetByTaskId(id, res => {
      if(res&&res.length>0){
        for(let i=0;i<res.length;i++){
          $('#fileList').append(`
          <div class="fileItem">
                            <label>${res[i].name}</label>
                            <i></i>
                            <span>${res[i].user_name}</span>
                            <span>${dateChange(res[i].created_at)}</span>
                            <span>${dateFormat(res[i].created_at)}</span>
                        </div>
          `)
        }
      }else{
        $('#fileContainer').css('display','none')
      }
    })
  }

  //获取申请人信息
  function getApplication(id) {
    service.getApplication(id, (res) => {
      if (window.sessionStorage.getItem('role_id') == 5||window.sessionStorage.getItem('role_id') == 4){
        if(res === null || res==='null')
        $('.roleId1').hide();
        $('.roleId5').show();
      }else{
        $('.roleId1').show();
        $('.roleId5').hide();
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
    return `${newDate.getHours()}:${newDate.getMinutes()}`;
  }
});
