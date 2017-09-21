$(function () {
  const service = new SERVICE();
  //从哪个页面跳转过来的，判断时联盟任务还是帮会任务
  // let fromPage = getUrlParam('fromPage');
  let department_id=window.sessionStorage.getItem('department_id');
  const faction_id = parseInt(getUrlParam('faction_id'));
  let personalTask = getUrlParam('personalTask');
  let myTask = getUrlParam('myTask');
  let teamId=getUrlParam('teamId');
  let id = parseInt(getUrlParam('taskId'));
  let section_id=window.sessionStorage.getItem('section_id');
  let role_id=parseInt(window.sessionStorage.getItem('role_id'));
  let fileNames = [];//存放文件名称
  let fileArr = [];//存放文件链接
  let taskObj = {};//提交时的task对象
  let expRole=[];
  let properties=[];
  let departInfo={};
  let factionInfo={};
  let sectionInfo={};
  let personalInfo={};
  let departGold=0;
  let factionGold=0;
  let personalGold=0;
  let factionVC=0;
  let departVC=0;
  let personalVC=0;
  if(faction_id||faction_id==0){
    getFactionInfo(faction_id);
    getProperties();
    getDepartmentInfo(department_id);
    getUserLeaderGrade(window.sessionStorage.getItem('user_id'));
  }else if(personalTask && personalTask=='true'){
    getProperties();
    if(section_id !='0'){
      getSectionsInfo(section_id);
    }
    if(faction_id !='0'){
      getFactionInfo(window.sessionStorage.getItem('faction_id'));
    }
    getDepartmentInfo(department_id);
    getUserLeaderGrade(window.sessionStorage.getItem('user_id'));
  }else{
    getProperties();
    getDepartmentInfo(department_id);
    getUserLeaderGrade(window.sessionStorage.getItem('user_id'));
  }

  /*模拟下拉框效果*/
  $(".select_box input").click(function () {
    let thisinput = $(this);
    let thisul = $(this).parent().find("ul");
    if (thisul.css("display") == "none") {
      thisul.fadeIn("100");
      thisul.unbind('hover').hover(function () {
      }, function () {
        thisul.fadeOut("100");
      });
      thisul.find("li").unbind('click').click(function () {
        if (thisinput.attr('id') == 'taskLevel') {
          let type=0,subtype=1, level=parseInt($(this).val());
          if(faction_id||faction_id===0){
            type=parseInt($('#taskTypeText').data('type'));
            subtype=parseInt($('#taskTypeText').data('subtype'));
            level=parseInt($(this).val());
          }
          for(let i=0;i<expRole.length;i++){
            if(parseInt(expRole[i].type)===type&&parseInt(expRole[i].subtype)===subtype&&parseInt(expRole[i].level)===level){
              $('#exp').text(expRole[i].exp);
              $("#base_vc").val(expRole[i].default_vc);
              $("#gold").val(expRole[i].default_gold);
              break;
            }
          }
        }
        thisinput.attr('data-value',$(this).val());
        thisinput.attr('data-num',$(this).val());
        thisinput.attr('value',$(this).text());
        thisul.fadeOut("100");
      }).unbind('hover').hover(function () {
        $(this).addClass("hover");
      }, function () {
        $(this).removeClass("hover");
      });
    }
    else {
      thisul.fadeOut("fast");
    }
  });
  $('.btnBack').click(function () {
    back();
  });
  if(window.sessionStorage.getItem('tempTaskObj')){
    init(JSON.parse(window.sessionStorage.getItem('tempTaskObj')))
  }else{
    //获取任务信息
    getTask(id);
    getAsserts(id);
  }
  getExpRole();
  //任务详情
  function getTask(id) {
    service.getById(id, (res) => {
      $('#title').val(res.title);
      $('#desc').val(res.remark);
      let $taskTypeText=$('#taskTypeText');
      if (res.type == '2'){
        $taskTypeText.text('个人任务').attr({'data-type':res.type,'data-subtype':res.subtype});
        $taskTypeText.css('width','inherit');
      }else if(res.type == '3'){
        $taskTypeText.text('试炼任务').attr({'data-type':res.type,'data-subtype':res.subtype});
        $taskTypeText.css('width','inherit');
      }else{
        switch (res.subtype){
          case 1:
            $taskTypeText.text('联盟临时任务').attr({'data-type':res.type,'data-subtype':res.subtype});
            break;
          case 2:
            $taskTypeText.text('帮会挑战任务').attr({'data-type':res.type,'data-subtype':res.subtype});
            break;
          case 3:
            $taskTypeText.text('帮会基础任务').attr({'data-type':res.type,'data-subtype':res.subtype});
            break;
          case 4:
            $taskTypeText.text('帮会临时任务').attr({'data-type':res.type,'data-subtype':res.subtype});
            break;
        }
      }
      $taskTypeText.attr('data-status',res.status);
      if(personalTask && personalTask == 'true'){
        $(".taskGrade").addClass("dis_n");
      }else{
        if(res.level||res.level==0){
          $('#taskLevel')
            .attr('data-value', res.level)
            .attr('data-num', res.level)
            .attr('value', res.level+'级');
        }
      }
      if(res.deadline){
        document.getElementById('deadline').valueAsDate = new Date(res.deadline);
      }
      // $('#publishDate').val(dateChange(res.created_at));
      $('#exp').text(res.exp>0?res.exp:0);
      // $('#finishDate').val(dateChange(res.deadline));
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
      $('#publishPerson').val(res.created.name);
      $('#base_vc').val(res.base_vc>0?res.base_vc:0).attr('data-vcorigin',res.base_vc);
      $('#gold').val(res.gold>0?res.gold:0).attr('data-goldorigin',res.gold);
      $('#mortgage').val(res.mortgage>0?res.mortgage:0);
      if(res.assets&&res.assets.length>0){
        fileArr=res.assets;
        for(let  i=0;i<res.assets.length;i++){
          let pos = res.assets[i].url.lastIndexOf("\/");
          let name=res.assets[i].url.substring(pos + 1);
          fileNames.push(name);
          addFile(name);
        }
      }
      if(res.leader_level||res.leader_level!=0){
        $('#leader_level').attr('value', res.leader_level);
      }
      if(res.leader_grade) {
        $('#leader_grade').attr('value', res.leader_grade).val(res.leader_grade);
      }
    })
  }
  //获取任务文档
  function getAsserts(id) {
    service.getAssetByTaskId(id, res => {
      if(res&&res.length>0){
        fileArr=[];
        for(let i=0;i<res.length;i++){
          fileArr.push({_id:res[i]._id, url:res[i].url});
          let pos = res[i].url.lastIndexOf("\/");
          let name=res[i].url.substring(pos + 1);
          fileNames.push(name);
          addFile(name);
        }
      }
    })
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
      if(!faction_id){
        if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
          window.location.href = `tempTaskDetail.html?teamId=${teamId}&taskId=${id}`;
        }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
          window.location.href = `tempTaskDetail.html?teamId=${teamId}&taskId=${id}&roleId=1`;
        }else{
          if(myTask && myTask == 'true'){
            if(personalTask && personalTask == 'true'){
              window.location.href = `tempTaskDetail.html?taskId=${id}&personalTask=true&myTask=true`;
            }else{
              window.location.href = `tempTaskDetail.html?taskId=${id}&myTask=true`;
            }
          }else{
            if(personalTask && personalTask == 'true'){
              window.location.href = `tempTaskDetail.html?taskId=${id}&personalTask=true`;
            }else{
              window.location.href = `tempTaskDetail.html?taskId=${id}`;
            }
          }
        }
      }else{
        if(getUrlParam('fromPage')&&getUrlParam('fromPage')=='reject'){
          if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
            window.location.href = `waitCheckTask.html?teamId=${teamId}&faction_id=${faction_id}&taskId=${id}`;
          }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
            window.location.href = `waitCheckTask.html?teamId=${teamId}&faction_id=${faction_id}&taskId=${id}&roleId=1`;
          }else{
            if(myTask && myTask == 'true'){
              window.location.href = `waitCheckTask.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
            }else{
              window.location.href = `waitCheckTask.html?taskId=${id}&faction_id=${faction_id}`;
            }
          }
        }else{
          if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
            window.location.href = `tempTaskDetail.html?teamId=${teamId}&faction_id=${faction_id}&taskId=${id}`;
          }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
            window.location.href = `tempTaskDetail.html?teamId=${teamId}&faction_id=${faction_id}&taskId=${id}&roleId=1`;
          }else{
            if(myTask && myTask == 'true'){
              window.location.href = `tempTaskDetail.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
            }else{
              window.location.href = `tempTaskDetail.html?taskId=${id}&faction_id=${faction_id}`;
            }
          }
        }
      }
    window.sessionStorage.removeItem('tempTaskObj');
  }
  $('#addLeader').click(() => {
    let temp = getObj();
    window.sessionStorage.setItem('tempTaskObj', JSON.stringify(temp));
    if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
      window.location.href = `assignLeader.html?fromPage=edit&fromPage=teaRoom&taskId=${id}&teamId=${getUrlParam('teamId')}`;
    }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
      window.location.href = `assignLeader.html?fromPage=edit&fromPage=teaRoomEdit&taskId=${id}&teamId=${getUrlParam('teamId')}&roleId=1`;
    }else{
      if(!faction_id){
        if(myTask && myTask == 'true'){
          if(personalTask && personalTask == 'true'){
            window.location.href = `assignLeader.html?fromPage=edit&taskId=${id}&personalTask=true&myTask=true`;
          }else{
            window.location.href = `assignLeader.html?fromPage=edit&taskId=${id}&myTask=true`
          }
        }else{
          if(personalTask && personalTask == 'true'){
            window.location.href = `assignLeader.html?fromPage=edit&taskId=${id}&personalTask=true`;
          }else{
            window.location.href = `assignLeader.html?fromPage=edit&taskId=${id}`
          }
        }
      }else{
        if(myTask && myTask == 'true'){
          window.location.href = `assignLeader.html?fromPage=edit&taskId=${id}&faction_id=${faction_id}&myTask=true`
        }else{
          window.location.href = `assignLeader.html?fromPage=edit&taskId=${id}&faction_id=${faction_id}`
        }
      }
    }
  });
//在页面展示添加的文档
  function addFile(name) {
    $('#fileContainer .item label').before(`
    <div class="item2">
          <span class="filename">${name}</span>
          <span class="delete"></span>
        </div>
    `);
  }
  $(document).on('click','.delete',deleteFile);
//删除文档
  function deleteFile() {
    let index=$('#fileContainer .delete').index($(this));
    fileNames.splice(index,1);
    fileArr.splice(index,1);
    $(this).parent().remove()
  }
  $('#submit').click(() => {
    window.parent.playClickEffect();
    editTask(id,getObj());
  });
  //获取用户填写的信息
  function getObj() {
    if (faction_id||faction_id===0) {
      taskObj.type=parseInt($('#taskTypeText').data('type'));
      taskObj.subtype=parseInt($('#taskTypeText').data('subtype'));
    }else if(personalTask && personalTask == 'true'){
      taskObj.type=2;
      taskObj.subtype=5;
    }else{
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
    if(taskObj.applicant_id||taskObj.applicant_id==0){
      taskObj.leader_level = $('#leader_level').val();
      taskObj.leader_grade = $('#leader_grade').val().toUpperCase();
    }else{
      taskObj.leader_level='';
      taskObj.leader_grade=''
    }
    return taskObj;
  }
  function init(obj) {
    if (obj) {
      let $taskTypeText=$('#taskTypeText');
      if (obj.type == '2'){
        $taskTypeText.text('个人任务').attr({'data-type':obj.type,'data-subtype':obj.subtype});
        $taskTypeText.css('width','inherit');
      }else{
        switch (parseInt(obj.subtype)){
          case 1:
            $taskTypeText.text('联盟临时任务').attr({'data-type':obj.type,'data-subtype':obj.subtype,'data-status':obj.status});
            break;
          case 2:
            $taskTypeText.text('帮会挑战任务').attr({'data-type':obj.type,'data-subtype':obj.subtype,'data-status':obj.status});
            break;
          case 3:
            $taskTypeText.text('帮会基础任务').attr({'data-type':obj.type,'data-subtype':obj.subtype,'data-status':obj.status});
            break;
          case 4:
            $taskTypeText.text('帮会临时任务').attr({'data-type':obj.type,'data-subtype':obj.subtype,'data-status':obj.status});
            break;
        }
      }
      $taskTypeText.attr('data-status',obj.status);
      // $('#taskType').attr('data-value', obj.subtype || 1);
      $('#title').attr('value', obj.title || '');
      $('#desc').attr('value', obj.remark || '');
      if(obj.level||obj.level==0){
        $('#taskLevel')
          .attr('data-value', obj.level)
          .attr('data-num', obj.level)
          .attr('value', obj.level+'级');
      }
      if (obj.deadline) {
        document.getElementById('deadline').valueAsDate = new Date(obj.deadline);
      }
      $('#exp').text(obj.exp);
      $('#base_vc').attr({'value': obj.base_vc || '','data-vcorigin':obj.origin_vc});
      $('#mortgage').attr('value', obj.mortgage || '');
      $('#gold').attr({'value': obj.gold || '','data-goldorigin':obj.origin_gold});
      if(obj.leader_level||obj.leader_level!=0){
        $('#leader_level').attr('value', obj.leader_level);
      }
      if(obj.leader_grade){
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
      if(obj.assets&&obj.assets.length>0){
        fileArr=obj.assets;
        for(let  i=0;i<obj.assets.length;i++){
          let pos = obj.assets[i].url.lastIndexOf("\/");
          let name=obj.assets[i].url.substring(pos + 1);
          fileNames.push(name);
          addFile(name);
        }
      }
      window.sessionStorage.removeItem('tempTaskObj')
    } else {
      // $('#taskType').attr('data-value', 1);
      $('input[name="applicant_id"]').eq(0).attr('checked', 'checked')
    }
  }
  if (window.sessionStorage.getItem('selectId') || window.sessionStorage.getItem('selectId') == 0) {
    $('#leaderRequire').css('display', 'none');
    $('#applicant_id')
      .val(`${window.sessionStorage.getItem('selectId')}`)
      .attr({'data-name':`${window.sessionStorage.getItem('selectLeaderName')}`,'data-gold':`${window.sessionStorage.getItem('selectLeaderGold')}`});
    $('#applicant').css('display', 'inline-block')
      .after(`<span style="vertical-align: middle">${window.sessionStorage.getItem('selectLeaderName')}</span>`);
    $('input[name="applicant_id"]').eq(1).attr('checked', 'checked');
    window.sessionStorage.removeItem('selectId');
    window.sessionStorage.removeItem('selectLeaderName');
    window.sessionStorage.removeItem('selectLeaderGold');
  }else{
    $('input[name="applicant_id"]').eq(0).attr('checked', 'checked')
  }
  $('input[name="applicant_id"]').change(()=>{
    let selectedvalue = parseInt($("input[name='applicant_id']:checked").val());
    if (selectedvalue||selectedvalue===0) {
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
    service.addAssert('file', res => {
      let file = $(this).val();
      let fileName = getFileName(file);
      addFile(fileName);
      fileNames.push(fileName);
      fileArr.push({url:res.url});
      $('#file').change(fileChange);
    })
  }
  //修改任务
  function editTask(id,task) {
    let title=$('#title');
    let desc=$('#desc');
    let deadline=$('#deadline');
    errorTip(title,desc,deadline);
    if($('#leader_grade').val()){
      if(allGrade.indexOf($('#leader_grade').val().toUpperCase())<0){
        errorTip($('#leader_grade'));
        $('#footerError').text('请输入正确的岗位级别！');
        $('#footerError').fadeIn(1000);
        setTimeout( ()=> {
          $('#footerError').fadeOut(1000);
        },3000);
        return;
      }else{
        if(allGrade.indexOf($('#leader_grade').val().toUpperCase())>$('#leader_grade').data('gradeindex')){
          errorTip($('#leader_grade'));
          $('#footerError').text('最低岗位级别不能高于您的级别！');
          $('#footerError').fadeIn(1000);
          setTimeout( ()=> {
            $('#footerError').fadeOut(1000);
          },3000);
          return;
        }
      }
    }
    if(title.val()&&desc.val()&&deadline.val()){
      let $baseVC=$('#base_vc').val();
      let $gold=$('#gold').val();
      let $mortgage=$('#mortgage').val();
      let $leader_level=$('#leader_level').val();
      if(!$baseVC&&!$gold&&!$mortgage&&!$leader_level){
        let error=false;
        service.getTime(res=>{
          if(new Date(deadline.val()).getTime()<res.now){
            error=true;
            $('#footerError').text('要求完成日期必须大于当前日期');
            $('#footerError').fadeIn(1000);
            setTimeout( ()=> {
              $('#footerError').fadeOut(1000);
            },3000)
          }
          if(error){
            return false;
          }
          temp();
        })
      }else{
        let error=false;
        $('.isErrorGroup').each(function () {
          let $this=$(this).val();
          if($this&&!isInt($this)){
            $(this).addClass('error');
            $(this).siblings('span').fadeIn(1000);
            setTimeout( () =>{
              $(this).siblings('span').fadeOut(1000);
            },3000);
            error=true;
          }else{
            $(this).removeClass('error');
            // $(this).siblings('span').css('display','none');
          }
        });
        if(error){
          return false;
        }
        service.getTime(res=>{
          if(new Date(deadline.val()).getTime()<parseInt(res.now)){
            error=true;
            $('#footerError').text('要求完成日期必须大于当前日期');
            $('#footerError').fadeIn(1000);
            setTimeout( () =>{
              $('#footerError').fadeOut(1000);
            },3000);
            if(error){
              return false;
            }
          }
          if($leader_level&&!isInt($leader_level)){
            error=true;
            $('#footerError').fadeIn(1000);
            setTimeout( () =>{
              $('#footerError').fadeOut(1000);
            },3000)
          }
          if($('#base_vc').val()){
            if(!faction_id){
              if(personalTask && personalTask=='true'){
                let personalVCEdit=(parseInt(personalVC)+parseInt($('#base_vc').val()));
                if(parseInt($('#base_vc').val())>parseInt(personalVCEdit)){
                  $('#base_vc').addClass('error');
                  $('#base_vc').siblings('span').text(`个人任务VC剩余${personalVC}`);
                  $('#base_vc').siblings('span').fadeIn(1000);
                  setTimeout( () =>{
                    $('#base_vc').siblings('span').fadeOut(1000);
                  },3000);
                  error=true
                }
              }else{
                if(parseInt($('#base_vc').val())>(parseInt(departVC)+parseInt($('#base_vc').data('vcorigin')))){
                  $('#base_vc').addClass('error');
                  $('#base_vc').siblings('span').text(`联盟VC剩余${departVC}`);
                  $('#base_vc').siblings('span').fadeIn(1000);
                  setTimeout( () =>{
                    $('#base_vc').siblings('span').fadeOut(1000);
                  },3000);
                  error=true
                }
              }
            }else{
              if(parseInt($('#base_vc').val())>(parseInt(factionVC)+parseInt($('#base_vc').data('vcorigin')))){
                $('#base_vc').addClass('error');
                $('#base_vc').siblings('span').text(`帮会VC剩余${factionVC}`);
                $('#base_vc').siblings('span').fadeIn(1000);
                setTimeout( () =>{
                  $('#base_vc').siblings('span').fadeOut(1000);
                },3000);
                error=true
              }
            }
          }
          if(error){
            return false;
          }
          if($('#gold').val()){
            if(!faction_id){
              if(personalTask && personalTask =='true'){
                let personalGoldEdit=(parseInt(personalGold)+parseInt($('#gold').val()));
                if(parseInt($('#gold').val())>parseInt(personalGoldEdit)){
                  $('#gold').addClass('error');
                  $('#gold').siblings('span').text(`个人金币剩余${personalGoldEdit}`);
                  $('#gold').siblings('span').fadeIn(1000);
                  setTimeout( () =>{
                    $('#gold').siblings('span').fadeOut(1000);
                  },3000);
                  error=true;
                }
              }else{
                if(parseInt($('#gold').val())>(parseInt(departGold)+parseInt($('#gold').data('goldorigin')))){
                  $('#gold').addClass('error');
                  $('#gold').siblings('span').text(`联盟金币剩余${departGold}`);
                  $('#gold').siblings('span').fadeIn(1000);
                  setTimeout( () =>{
                    $('#gold').siblings('span').fadeOut(1000);
                  },3000);
                  error=true;
                }
              }
            }else{
              if(parseInt($('#gold').val())>(parseInt(factionGold)+parseInt($('#gold').data('goldorigin')))){
                $('#gold').addClass('error');
                $('#gold').siblings('span').text(`帮会金币剩余${factionGold}`);
                $('#gold').siblings('span').fadeIn(1000);
                setTimeout( () =>{
                  $('#gold').siblings('span').fadeOut(1000);
                },3000);
                error=true
              }
            }
          }
          if(error){
            return false;
          }
          if(parseInt($('#applicant_id').val())||parseInt($('#applicant_id').val()===0)){
            if($('#mortgage').val()&&(parseInt($('#mortgage').val())>parseInt($('#applicant_id').data('gold')))){
              $('#mortgage').addClass('error');
              $('#mortgage').siblings('span').text(`指定领队VC剩余${$('#applicant_id').data('gold')}，不足以支付押金！`);
              $('#mortgage').siblings('span').fadeIn(1000);
              setTimeout( () =>{
                $('#mortgage').siblings('span').fadeOut(1000);
              },3000);
              error=true;
            }
          }
          if(error){
            return false;
          }
          if(!error){
            temp()
          }
        })
      }
      function temp() {
        if(!faction_id){
          if(personalTask && personalTask =='true'){
            let personal_vc=0;
            let section_vc=0;
            let faction_vc=0;
            let con = "";
            let type = "1";
            for(let i=0;i<properties.length;i++){
              if(properties[i].name==='personal_vc'){
                personal_vc=parseInt(properties[i].value);//20
              }else if(properties[i].name==='section_vc'){
                section_vc=parseInt(properties[i].value);//40
              }else if(properties[i].name==='faction_vc'){
                faction_vc=parseInt(properties[i].value);//60
              }
            }
            let userInputVc=parseInt($('#base_vc').val());
            if(role_id===2){
              if(userInputVc>section_vc){
                let name=factionInfo.chief.name;
                if(factionInfo.chief.name!=departInfo.master.name){
                  name+=`、${departInfo.master.name}`
                }
                con = `悬赏任务VC超过${section_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
                type = "3";
              }else{
                type = "1";
                con = "您确认要发布此任务吗？"
              }
            }else if(role_id===1){
              /*若帮派不存在直接盟主审核，若堂不存在，则直接由帮主和盟主审核*/
              if(userInputVc>personal_vc&&userInputVc<section_vc){
                if(window.sessionStorage.getItem('section_id')==''||window.sessionStorage.getItem('section_id')=='0'){
                  let name=departInfo.master.name;
                  con = `悬赏任务VC超过${personal_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
                  type = "3";
                }else{
                  let name=sectionInfo.master.name;
                  con = `悬赏任务VC超过${personal_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
                  type = "3";
                }
              }else if(userInputVc>section_vc&&userInputVc<faction_vc){
                if(window.sessionStorage.getItem('section_id')==''||window.sessionStorage.getItem('section_id')=='0'){
                  if(window.sessionStorage.getItem('faction_id')==''||window.sessionStorage.getItem('faction_id')=='0'){
                    let name=departInfo.master.name;
                    con = `悬赏任务VC超过${section_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
                    type = "3";
                  }else{
                    let name=sectionInfo.master.name;
                    if(factionInfo.chief.name!=departInfo.master.name){
                      name+=`、${section_vc.master.name}`;
                    };
                    con = `悬赏任务VC超过${section_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
                    type = "3";
                  }
                }else{
                  if(window.sessionStorage.getItem('faction_id')==''||window.sessionStorage.getItem('faction_id')=='0'){
                    let name=sectionInfo.master.name;
                    name+=`、${departInfo.master.name}`;
                    con = `悬赏任务VC超过${section_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
                    type = "3";
                  }else{
                    let name=sectionInfo.master.name;
                    if(factionInfo.chief.name!=departInfo.master.name){
                      name+=`、${factionInfo.chief.name}`;
                    };
                    con = `悬赏任务VC超过${section_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
                    type = "3";
                  }
                }
              }else if(userInputVc>faction_vc){
                if(window.sessionStorage.getItem('section_id')==''||window.sessionStorage.getItem('section_id')=='0'){
                  if(window.sessionStorage.getItem('faction_id')==''||window.sessionStorage.getItem('faction_id')=='0'){
                    let name=departInfo.master.name;
                    con = `悬赏任务VC超过${faction_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
                    type = "3";
                  }else{
                    let name=factionInfo.chief.name;
                    if(factionInfo.chief.name!=departInfo.master.name){
                      name+=`、${departInfo.master.name}`;
                    };
                    con = `悬赏任务VC超过${faction_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
                    type = "3";
                  }
                }else{
                  let name=sectionInfo.master.name;
                  if(factionInfo.chief.name!=departInfo.master.name){
                    name+=`、${factionInfo.chief.name}`;
                    name+=`、${departInfo.master.name}`;
                  }
                  con = `悬赏任务VC超过${faction_vc}，任务将<br/>提交${name}审核，<br/>您确认发布吗？`;
                  type = "3";
                }
              }else{
                type = "1";
                con = "您确认要发布此任务吗？";
              }
            }else if(role_id===3){
              if(userInputVc>faction_vc){
                con = `悬赏任务VC超过${faction_vc}，<br/>任务将提交${departInfo.master.name}审核，<br>您确认发布吗？`;
                type = "3";
              }else{
                con = "您确认要发布此任务吗？";
                type = "1";
              }
            }else{
              type = "1";
              con = "您确认要发布此任务吗？"
            }
            const title = "发布任务";
            zPopup(title, type, con,id,task);
          }else{
            const title = "重新发布";
            const type= "1";
            const con = "您确认要重新发布此任务吗？";
            zPopup(title,type,con,id,task);
          }
        }else{
          let role_id=parseInt(window.sessionStorage.getItem('role_id'));
          let personal_vc=0;
          let section_vc=0;
          let faction_vc=0;
          let con = "";
          let type = "1";
          for(let i=0;i<properties.length;i++){
            if(properties[i].name==='personal_vc'){
              personal_vc=parseInt(properties[i].value);
            }else if(properties[i].name==='section_vc'){
              section_vc=parseInt(properties[i].value);
            }else if(properties[i].name==='faction_vc'){
              faction_vc=parseInt(properties[i].value);
            }
          }
          let userInputVc=parseInt($('#base_vc').val());
          if(role_id===2){
            if(userInputVc>section_vc){
              let name=factionInfo.chief.name;
              if(factionInfo.chief.name!=departInfo.master.name){
                name+=`、${departInfo.master.name}`
              }
              con = `悬赏任务VC超过${section_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
              type = "3";
            }else{
              type = "1";
              con = "您确认要发布此任务吗？"
            }

          }else if(role_id===3){
            if(userInputVc>faction_vc){
              con = `悬赏任务VC超过${faction_vc}，<br/>任务将提交${departInfo.master.name}审核，<br>您确认要发布此任务吗？`;
              type = "3";
            }else{
              con = "您确认要发布此任务吗？";
              type = "1";
            }
          }else{
            type = "1";
            con = "您确认要发布此任务吗？"
          }
          const title = "重新发布";
          zPopup(title, type, con,id,task);
        }
      }
    }
  }
  /*二次确认弹窗*/
  function zPopup(title,type, con,id,task) {
    var h = "";
    if (type == 1) {
      //两个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn gotoDelete">确定</a>' + '</div>' + '</div>'
    } else if (type == 2) {
      //一个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class="u-Popup-close u-Popup-ok-btn">知道啦</a>' + '</div>' + '</div>'
    }if (type == 3) {
      //三行
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con" style="line-height: 3rem">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn gotoDelete">确定</a>' + '</div>' + '</div>'
    }

    $(".feehideBox").html(h);
    //取消按钮
    $(".u-Popup-close").click(function() {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide()
    });
    //确定按钮
    $(".gotoDelete").off("click").on("click",function(){
      window.parent.playClickEffect();
      service.edit(id,task, (res) => {
        window.sessionStorage.removeItem('tempTaskObj');
        if(faction_id||parseInt(faction_id)===0){
          if(parseInt(res.status)<2||parseInt(res.status)===2){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href = `waitCheckTask.html?fromPage=teaRoom&taskId=${id}&teamId=${teamId}&faction_id=${faction_id}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href = `waitCheckTask.html?fromPage=teaRoomEdit&taskId=${id}&teamId=${teamId}&roleId=1&faction_id=${faction_id}`;
            }else{
              if(myTask && myTask == 'true'){
                window.location.href = `waitCheckTask.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
              }else{
                window.location.href = `waitCheckTask.html?taskId=${id}&faction_id=${faction_id}`;
              }
            }
          }else if(parseInt(res.status)===4){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href = `tempTaskDetail.html?fromPage=teaRoom&faction_id=${faction_id}&taskId=${id}&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href = `tempTaskDetail.html?fromPage=teaRoomEdit&faction_id=${faction_id}&taskId=${id}&teamId=${teamId}&roleId=1`;
            }else{
              if(myTask && myTask == 'true'){
                window.location.href = `tempTaskDetail.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
              }else{
                window.location.href = `tempTaskDetail.html?taskId=${id}&faction_id=${faction_id}`;
              }
            }
          }else if(parseInt(res.status)===5){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href = `tempContinueTask.html?fromPage=teaRoom&faction_id=${faction_id}&taskId=${id}&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href = `tempContinueTask.html?fromPage=teaRoomEdit&faction_id=${faction_id}&taskId=${id}&teamId=${teamId}&roleId=1`;
            }else{
              if(myTask && myTask == 'true'){
                window.location.href = `tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
              }else{
                window.location.href = `tempContinueTask.html?taskId=${id}&faction_id=${faction_id}`;
              }
            }
          }
        }else if(personalTask && personalTask == 'true'){
          if(parseInt(res.status)<2||parseInt(res.status)===2){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href = `waitCheckTask.html?fromPage=teaRoom&taskId=${id}&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href = `waitCheckTask.html?fromPage=teaRoomEdit&taskId=${id}&teamId=${teamId}&roleId=1`;
            }else{
              if(myTask && myTask == 'true'){
                window.location.href = `waitCheckTask.html?taskId=${id}&personalTask=true&myTask=true`;
              }else{
                window.location.href = `waitCheckTask.html?taskId=${id}&personalTask=true`;
              }
            }
          }else if(parseInt(res.status)===4){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href = `tempTaskDetail.html?fromPage=teaRoom&taskId=${id}&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href = `tempTaskDetail.html?fromPage=teaRoomEdit&taskId=${id}&teamId=${teamId}&roleId=1`;
            }else{
              if(myTask && myTask == 'true'){
                window.location.href = `tempTaskDetail.html?taskId=${id}&personalTask=true&myTask=true`;
              }else{
                window.location.href = `tempTaskDetail.html?taskId=${id}&personalTask=true`;
              }
            }
          }else if(parseInt(res.status)===5){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href = `tempContinueTask.html?fromPage=teaRoom&taskId=${id}&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href = `tempContinueTask.html?fromPage=teaRoomEdit&taskId=${id}&teamId=${teamId}&roleId=1`;
            }else{
              if(myTask && myTask == 'true'){
                window.location.href = `tempContinueTask.html?taskId=${id}&personalTask=true&myTask=true`;
              }else{
                window.location.href = `tempContinueTask.html?taskId=${id}&personalTask=true`;
              }
            }
          }
        }else{
          if(parseInt(res.status)===4){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href = `tempTaskDetail.html?fromPage=teaRoom&taskId=${id}&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href = `tempTaskDetail.html?fromPage=teaRoomEdit&taskId=${id}&teamId=${teamId}&roleId=1`;
            }else{
              if(myTask && myTask == 'true'){
                if(parseInt(res.status)===5){
                  window.location.href = `tempContinueTask.html?taskId=${id}&myTask=true`;
                }else{
                  window.location.href = `tempTaskDetail.html?taskId=${id}&myTask=true`;
                }
              }else{
                if(parseInt(res.status)===5){
                  window.location.href = `tempContinueTask.html?taskId=${id}`;
                }else{
                  window.location.href = `tempTaskDetail.html?taskId=${id}`;
                }
              }
            }
          }else if(parseInt(res.status)===5){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href = `tempContinueTask.html?fromPage=teaRoom&taskId=${id}&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href = `tempContinueTask.html?fromPage=teaRoomEdit&taskId=${id}&teamId=${teamId}&roleId=1`;
            }else{
              if(myTask && myTask == 'true'){
                window.location.href = `tempContinueTask.html?taskId=${id}&myTask=true`;
              }else{
                window.location.href = `tempContinueTask.html?taskId=${id}`;
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
    let pos = o.lastIndexOf("\\");
    return o.substring(pos + 1);
  }
  function getExpRole() {
    service.getExpRole((res)=>{
      expRole=res;
    })
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
      properties=res;
    })
  }
  function getDepartmentInfo(departmentId) {
    service.getDepartmentInfo(departmentId,function (res) {
      departInfo=res;
      departGold=res.gold;
      departVC=res.vc;
    })
  }
  function getFactionInfo(factionId) {
    service.getFactionInfo(factionId,function (res) {
      factionInfo=res;
      factionGold=res.gold;
      factionVC=res.vc;
    })
  }
  function getSectionsInfo(sectionId) {
    service.getSectionsInfo(sectionId,function (res) {
      sectionInfo=res;
    })
  }
  function getUserLeaderGrade(userid){
    service.getUserLeaderGrade(userid,function (res) {
      personalInfo=res;
      personalGold=res.gold;
      personalVC=res.task_vc;
      let index=allGrade.indexOf(res.grade);
      $('#leader_grade').attr('data-gradeindex',index);
    })
  }
});
