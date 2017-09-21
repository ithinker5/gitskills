$(function () {
  const service = new SERVICE();
  // let fromPage = window.sessionStorage.getItem('fromPage');//从哪个页面跳转过来的，判断时联盟任务还是帮会任务
  let fileNames = [];//存放文件名称
  let fileArr = [];//存放文件链接
  let taskObj = {};//提交时的task对象
  let saveTempTaskObj=window.sessionStorage.getItem('tempTaskObj');
  let selectId=window.sessionStorage.getItem('selectId');
  let faction_id=getUrlParam('faction_id');
  let personalTask = getUrlParam('personalTask');
  let trialTask = getUrlParam('trialTask');
  let department_id=window.sessionStorage.getItem('department_id');
  let section_id=window.sessionStorage.getItem('section_id');
  let role_id=parseInt(window.sessionStorage.getItem('role_id'));
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
        if (thisinput.attr('id') == 'taskType') {
          window.location.href = 'strategyTaskAdd.html';
          return false;
        }
        if(thisinput.attr('id') == 'bTaskType'){
          let type,subtype, level;
          type=1;
          subtype=parseInt($(this).val());
          level=parseInt($('#taskLevel').data('value'));
          for(let i=0;i<expRole.length;i++){
            if(parseInt(expRole[i].type)===type&&parseInt(expRole[i].subtype)===subtype&&parseInt(expRole[i].level)===level){
              $('#exp').text(expRole[i].exp);
              $("#base_vc").val(expRole[i].default_vc);
              $("#gold").val(expRole[i].default_gold);
              break;
            }
          }
        }
        if (thisinput.attr('id') == 'taskLevel') {
          let type=0,subtype=1, level=parseInt($(this).val());
          if(faction_id||faction_id===0){
            type=1;
            subtype=parseInt($('#bTaskType').data('value'));
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
        thisinput.attr('data-value', $(this).val());
        thisinput.attr('data-num', $(this).val());
        thisinput.attr('value', $(this).text());
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
  //返回
  $('.btnBack').click(function () {
    back();
  });
  //删除选择的文件
  $(document).on('click', '.delete', deleteFile);
  //指定领队
    $('#addLeader').click(() => {
      let temp = getObj();
      window.sessionStorage.setItem('tempTaskObj', JSON.stringify(temp));
      if(faction_id||faction_id==0){
        if(getUrlParam('fromPage')==='taskList'){
          window.location.href = `assignLeader.html?fromPage=add&faction_id=${faction_id}&returnPage=taskList`;
        }else{
          window.location.href = `assignLeader.html?fromPage=add&faction_id=${faction_id}`;
        }
      }else if(personalTask && personalTask == 'true'){
        window.location.href = 'assignLeader.html?fromPage=add&personalTask=true';
      }else if(trialTask && trialTask=='true'){
        window.location.href = 'assignLeader.html?fromPage=add&trialTask=true';
      }else{
        window.location.href = 'assignLeader.html?fromPage=add';
      }
    });
  //上传文件
  $('#file').change(fileChange);
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
  }else if(trialTask && trialTask=='true'){
    getFactionInfo(window.sessionStorage.getItem('faction_id'));
  }else{
    getProperties();
    getDepartmentInfo(department_id);
    getUserLeaderGrade(window.sessionStorage.getItem('user_id'));
  }
  if(saveTempTaskObj){
    init(JSON.parse(saveTempTaskObj));
    getExpRoleFromAssignLeader();
  }else{
    getExpRole();
  }
  if (selectId || parseInt(selectId) === 0) {
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
  } else {
    $('input[name="applicant_id"]').eq(0).attr('checked', 'checked')
  }
  $('#submit').click(() => {
    window.parent.playClickEffect();
    let title=$('#title');
    let desc=$('#desc');
    let deadline=$('#deadline');
    errorTip(title,desc,deadline);
    if(title.val()&&desc.val()&&deadline.val()){
      let $baseVC=$('#base_vc').val();
      let $gold=$('#gold').val();
      let $mortgage=$('#mortgage').val();
      let $leader_level=$('#leader_level').val();
      $('#gold').siblings('span').text(`金币必须是大于等于0的整数`);
      $('#base_vc').siblings('span').text(`任务VC必须是大于等于0的整数`);
      $('#mortgage').siblings('span').text(`押金必须是大于等于0的整数`);
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
      if(!$baseVC&&!$gold&&!$mortgage&&!$leader_level){
        let error=false;
        service.getTime(res=>{
          if(new Date(deadline.val()).getTime()<res.now){
            error=true;
            $('#footerError').text('要求完成日期必须大于当前日期');
            $('#footerError').fadeIn(1000);
            setTimeout( () =>{
              $('#footerError').fadeOut(1000);
            },3000)
          }
          if(error){
            return false;
          }
          temp();
        });
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
          }
        });
        if(error){
          return false;
        }
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
                if(parseInt($('#base_vc').val())>parseInt(personalVC)){
                  $('#base_vc').addClass('error');
                  $('#base_vc').siblings('span').text(`个人任务VC剩余${personalVC}`);
                  $('#base_vc').siblings('span').fadeIn(1000);
                  setTimeout( () =>{
                    $('#base_vc').siblings('span').fadeOut(1000);
                  },3000);
                  error=true
                }
              }else{
                if(parseInt($('#base_vc').val())>parseInt(departVC)){
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
              if(parseInt($('#base_vc').val())>parseInt(factionVC)){
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
                if(parseInt($('#gold').val())>parseInt(personalGold)){
                  $('#gold').addClass('error');
                  $('#gold').siblings('span').text(`个人金币剩余${personalGold}`);
                  $('#gold').siblings('span').fadeIn(1000);
                  setTimeout( () =>{
                    $('#gold').siblings('span').fadeOut(1000);
                  },3000);
                  error=true;
                }
              }else{
                if(parseInt($('#gold').val())>parseInt(departGold)){
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
              if(parseInt($('#gold').val())>parseInt(factionGold)){
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
              $('#mortgage').siblings('span').text(`指定领队任务VC剩余${$('#applicant_id').data('gold')}，不足以支付押金！`);
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
        });
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
              if((userInputVc>section_vc&&userInputVc<faction_vc)||userInputVc===faction_vc){
                let name=factionInfo.chief.name;
                con = `悬赏任务VC超过${section_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
                type = "3";
              }else if(userInputVc>faction_vc){
                let name=factionInfo.chief.name;
                if(factionInfo.chief.name!=departInfo.master.name){
                  name+=`、${departInfo.master.name}`
                }
                con = `悬赏任务VC超过${faction_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
                type = "3";
              }else{
                type = "1";
                con = "您确认要发布此任务吗？"
              }
            }else if(role_id===1){
              /*若帮派不存在直接盟主审核，若堂不存在，则直接由帮主和盟主审核*/
              if(userInputVc>personal_vc&&userInputVc<section_vc||userInputVc===section_vc){
                if(window.sessionStorage.getItem('section_id')==''||window.sessionStorage.getItem('section_id')=='0'){
                  let name=departInfo.chief.name;
                  con = `悬赏任务VC超过${personal_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
                  type = "3";
                }else{
                  let name=sectionInfo.master.name;
                  con = `悬赏任务VC超过${personal_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
                  type = "3";
                }
              }else if((userInputVc>section_vc&&userInputVc<faction_vc)||userInputVc===faction_vc){
                if(window.sessionStorage.getItem('section_id')==''||window.sessionStorage.getItem('section_id')=='0'){
                  if(window.sessionStorage.getItem('faction_id')==''||window.sessionStorage.getItem('faction_id')=='0'){
                    let name=departInfo.master.name;
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
            zPopup(title, type, con);
          }else{
            const title = "发布任务";
            const type = "1";
            const con = "您确认要发布此任务吗？";
            zPopup(title, type, con);
          }
        }else{
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
            if((userInputVc>section_vc&&userInputVc<faction_vc)||userInputVc===faction_vc){
              let name=factionInfo.chief.name;
              con = `悬赏任务VC超过${section_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
              type = "3";
            }else if(userInputVc>faction_vc){
              let name=factionInfo.chief.name;
              if(factionInfo.chief.name!=departInfo.master.name){
                name+=`、${departInfo.master.name}`
              }
              con = `悬赏任务VC超过${faction_vc}，<br/>任务将提交${name}审核，<br/>您确认发布吗？`;
              type = "3";
            }else{
              type = "1";
              con = "您确认要发布此任务吗？"
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
          zPopup(title, type, con);
        }
      }
    }
  });
  /*二次确认弹窗*/
  function zPopup(title, type, con) {
    var h = "";
    if (type == 1) {
      //两个按钮 一行
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn gotoDelete">确定</a>' + '</div>' + '</div>'
    } else if (type == 2) {
      //一个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '<div class="m-Popup-con"><span>' + con + '</span></div>' + '<div class="m-Popup-footer">' + '<a class="u-Popup-close  btnStyle" href="javascript:void(0)">确定</a>' + '</div>' + '</div>'
    }if (type == 3) {
      //三行
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con" style="line-height: 3rem">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn gotoDelete">确定</a>' + '</div>' + '</div>'
    }

    $(".feehideBox").html(h);
    //取消按钮
    $(".u-Popup-close").click(function () {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide()
    });
    //确定按钮
    $(".gotoDelete").off("click").on("click", function () {
      window.parent.playClickEffect();
      addTask(getObj());
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
  }
  $('input[name="applicant_id"]').change(() => {
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
  //创建任务
  function addTask(task) {
    service.add(task, (res) => {
      if(res.code==400){
        const title = "提示";
        const type = "2";
        const con = res.msg;
        zPopup(title, type, con)
      }else{
        // if(parseInt(task.applicant_id)||parseInt(task.applicant_id)===0){
        //   back(res._id,'continue')
        // }else{
        if(faction_id||faction_id==0){
          if(res.status===1||res.status===2||res.status===3){
            //back(res._id,'check')
            window.location.href = `waitCheckTask.html?taskId=${res._id}&faction_id=${faction_id}`;
          }else if(res.status===4){
            //back(res._id,'detail')
            window.location.href = `tempTaskDetail.html?taskId=${res._id}&faction_id=${faction_id}`;
          }else if(res.status===5){
            //back(res._id,'continue')
            window.location.href = `tempContinueTask.html?taskId=${res._id}&faction_id=${faction_id}`;
          }else{
            back()
          }
        }else if(personalTask && personalTask=='true'){
          if(res.status===1||res.status===2||res.status===3){
            window.location.href = `waitCheckTask.html?taskId=${res._id}&personalTask=true`;
          }else if(res.status===4){
            window.location.href = `tempTaskDetail.html?taskId=${res._id}&personalTask=true`;
          }else if(res.status===5){
            window.location.href = `tempContinueTask.html?taskId=${res._id}&personalTask=true`;
          }else{
            back()
          }
        }else if(trialTask && trialTask=='true'){
          if(res.status===1||res.status===2||res.status===3){
            window.location.href = `waitCheckTask.html?taskId=${res._id}&trialTask=true`;
          }else if(res.status===4){
            window.location.href = `tempTaskDetail.html?taskId=${res._id}&trialTask=true`;
          }else if(res.status===5){
            window.location.href = `tempContinueTask.html?taskId=${res._id}&trialTask=true`;
          }else{
            back()
          }
        }else{
          if(res.status===1||res.status===2||res.status===3){
            //back(res._id,'check')
            window.location.href = `waitCheckTask.html?taskId=${res._id}`;
          }else if(res.status===4){
            //back(res._id,'detail')
            window.location.href = `tempTaskDetail.html?taskId=${res._id}`;
          }else if(res.status===5){
            //back(res._id,'continue')
            window.location.href = `tempContinueTask.html?taskId=${res._id}`;
          }else{
            back()
          }
        }
      }
    })
  }
  function getFileName(o) {
    let pos = o.lastIndexOf("\\");
    return o.substring(pos + 1);
  }
  function back() {
    window.parent.playClickEffect();
    window.sessionStorage.removeItem('tempTaskObj');
    // window.sessionStorage.removeItem('fromPage');
      if (faction_id||faction_id==0) {
        //let faction_id = window.sessionStorage.getItem('faction_id');
        window.parent.reloadWeb(`app/h/taskList2.html?faction_id=${faction_id}&skipCocos=true`, false, false, 1465, 820);
      }else if(personalTask && personalTask=='true'){
        window.parent.reloadWeb(`app/h/tasklistPersonal.html`, false, false, 1465, 820);
      }else if(trialTask && trialTask=='true'){
        window.parent.reloadWeb(`app/h/ywc/tryTasklist.html`, false, false, 1465, 820);
      } else {
        window.parent.reloadWeb(`app/h/taskList.html`, false, false, 1465, 820);
      }
  }
  //获取用户填写的信息
  function getObj() {
    let title = $('#title').val(),
      desc = $('#desc').val(),
      level = parseInt($('#taskLevel').data('num')),
      deadline = parseInt(new Date($('#deadline').val()).getTime()),
      exp = parseInt($('#exp').text()),
      base_vc = parseInt($('#base_vc').val()),
      gold = parseInt($('#gold').val()),
      mortgage = parseInt($('#mortgage').val()),
      applicant_id=$('input[name="applicant_id"]:checked').val(),
      leader_level=parseInt($('#leader_level').val()),
      leader_grade=$('#leader_grade').val().toUpperCase();
    if (faction_id||faction_id===0) {
      taskObj.type = 1;
      taskObj.subtype = parseInt($('#bTaskType').data('value'));
      taskObj.faction_id=parseInt(faction_id);
    } else {
      if(personalTask&&personalTask=='true'){
        taskObj.type = 2;
        taskObj.subtype = 5;
      }else if(trialTask && trialTask =='true'){
        taskObj.type =3;
        taskObj.subtype = 6;
      }else{
        taskObj.type = 0;
        taskObj.subtype = parseInt($('#taskType').data('value'));
        taskObj.department_id=parseInt(department_id);
      }
    }
    if (title) { taskObj.title = title; }
    if (desc) { taskObj.remark = desc; }
    if (level || level === 0) { taskObj.level = level; }
    if (deadline) { taskObj.deadline = deadline; }
    if (exp || exp === 0) { taskObj.exp = exp; }
    if (base_vc || base_vc === 0) { taskObj.base_vc = base_vc; }
    if (gold || gold === 0) { taskObj.gold = gold; }
    if (mortgage || mortgage === 0) { taskObj.mortgage = mortgage; }
    if(applicant_id) { taskObj.applicant_id = applicant_id; }
    taskObj.assets = fileArr;
    if (taskObj.applicant_id || parseInt(taskObj.applicant_id) === 0) {
      if(taskObj.leader_level||taskObj.leader_level===0){
        delete taskObj.leader_level
      }
      if(taskObj.leader_grade){
        delete taskObj.leader_grade
      }
    } else {
      if (leader_level || leader_level === 0) { taskObj.leader_level = leader_level; }
      if (leader_grade || leader_grade === 0) { taskObj.leader_grade = leader_grade; }
    }
    return taskObj;
  }
  //删除文档
  function deleteFile() {
    let index = $('#fileContainer .delete').index($(this));
    fileNames.splice(index, 1);
    fileArr.splice(index, 1);
    $(this).parent().remove()
  }
  function fileChange() {
    service.addAssert('file', res => {
      let file = $(this).val();
      let fileName = getFileName(file);
      addFile(fileName);
      fileNames.push(fileName);
      fileArr.push(res.url);
      $('#file').change(fileChange);
    })
  }
  //在页面展示添加的文档
  function addFile(name) {
    $('#fileContainer .item label').before(`
    <div class="item2">
          <span class="filename">${name}</span>
          <span class="delete"></span>
        </div>
    `);
  }
  function init(obj) {
    if (obj) {
      let $subtype=parseInt(obj.subtype);
      if($subtype===2){
        $('#bTaskType').val('帮会挑战任务').attr('data-value','2')
      }else if($subtype===3){
        $('#bTaskType').val('帮会基础任务').attr('data-value','3')
      }else if($subtype===4){
        $('#bTaskType').val('帮会临时任务').attr('data-value','4')
      }
      $('#taskType').attr('data-value', obj.subtype || 1);
      $('#title').attr('value', obj.title || '');
      $('#desc').attr('value', obj.remark || '');
      if (obj.level || obj.level == 0) {
        $('#taskLevel')
          .attr('data-value', obj.level)
          .attr('data-num', obj.level)
          .attr('value', obj.level + '级');
      }
      if (obj.deadline) {
        document.getElementById('deadline').valueAsDate = new Date(obj.deadline);
      }
      $('#exp').text(obj.exp);
      $('#base_vc').attr('value', obj.base_vc || '');
      $('#mortgage').attr('value', obj.mortgage || '');
      $('#gold').attr('value', obj.gold || '');
      if (obj.leader_level || obj.leader_level !== 0) {
        $('#leader_level').attr('value', obj.leader_level);
      }
      if (obj.leader_grade) {
        $('#leader_grade').attr('value', obj.leader_grade).val(obj.leader_grade);
      }
      if (obj.assets && obj.assets.length > 0) {
        fileArr = obj.assets;
        for (let i = 0; i < obj.assets.length; i++) {
          let pos = obj.assets[i].lastIndexOf("\/");
          let name = obj.assets[i].substring(pos + 1);
          fileNames.push(name);
          addFile(name);
        }
      }
      window.sessionStorage.removeItem('tempTaskObj')
    } else {
      if(faction_id||faction_id===0){
        $('#taskType').attr('data-value', 1);
      }else{
        $('#taskType').attr('data-value', 2);
      }
      $('input[name="applicant_id"]').eq(0).attr('checked', 'checked')
    }
  }
  function getExpRole() {
    service.getExpRole((res)=>{
      expRole=res;
      let type, subtype, level;
      //判断是帮会任务还是联盟任务，显示选择任务类型
      if (faction_id||faction_id===0) {
        taskObj.type = 1;
        type=1;
        subtype=2;
        level=1;
        $('#lTaskTypeContainer').css('display', 'none');
        $('#PTaskTypeContainer').css('display', 'none');
        $('#STaskTypeContainer').css('display', 'none');
      } else {
        if(personalTask && personalTask=='true'){
          taskObj.type = 5;
          type=2;
          subtype=5;
          $('#lTaskTypeContainer').css('display', 'none');
          $('#bTaskTypeContainer').css('display', 'none');
          $('#STaskTypeContainer').css('display', 'none');
          $(".taskGrade").css('display','none');
        }else if(trialTask && trialTask == 'true'){
          taskObj.type = 6;
          type=3;
          subtype=6;
          $('#lTaskTypeContainer').css('display', 'none');
          $('#bTaskTypeContainer').css('display', 'none');
          $('#PTaskTypeContainer').css('display', 'none');
          $(".taskGrade").css('display','none');
          $(".taskGrade2").css('display','none');
        }else{
          taskObj.type = 0;
          type=0;
          subtype=1;
          level=1;
          $('#bTaskTypeContainer').css('display', 'none');
          $('#PTaskTypeContainer').css('display', 'none');
          $('#STaskTypeContainer').css('display', 'none');
        }
      }
      for(let i=0;i<res.length;i++){
        if(parseInt(res[i].type)===type&&parseInt(res[i].subtype)===subtype&&parseInt(res[i].level)===level){
          $('#exp').text(res[i].exp);
          $("#base_vc").val(res[i].default_vc);
          $("#gold").val(res[i].default_gold);
          break;
        }else if(parseInt(res[i].type)===type){
          $('#exp').text(res[i].exp);
          $("#base_vc").val(res[i].default_vc);
          $("#gold").val(res[i].default_gold);
          break;
        }
      }
    })
  }
  function getExpRoleFromAssignLeader() {
    service.getExpRole((res)=>{
      expRole=res;
      if (faction_id||faction_id===0) {
        $('#lTaskTypeContainer').css('display', 'none');
        $('#PTaskTypeContainer').css('display', 'none');
        $('#STaskTypeContainer').css('display', 'none');
      }else if(personalTask && personalTask=='true'){
        $('#bTaskTypeContainer').css('display', 'none');
        $('#lTaskTypeContainer').css('display', 'none');
        $('#STaskTypeContainer').css('display', 'none');
        $(".taskGrade").css('display','none');
      }else if(trialTask && trialTask == 'true'){
        $('#lTaskTypeContainer').css('display', 'none');
        $('#bTaskTypeContainer').css('display', 'none');
        $('#PTaskTypeContainer').css('display', 'none');
        $(".taskGrade").css('display','none');
        $(".taskGrade2").css('display','none');
      } else {
        $('#bTaskTypeContainer').css('display', 'none');
        $('#PTaskTypeContainer').css('display', 'none');
        $('#STaskTypeContainer').css('display', 'none');
      }
    })
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
      // for(let i=0;i<index;i++){
      //   $(".leader_ul").append('<li>'+allGrade[i]+'</li>')
      // }
    })
  }
});
