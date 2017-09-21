'use strict';
$(function () {
  let service = new SERVICE();
  let maxGrade=window.sessionStorage.getItem('grade');
  let fromPage=  getUrlParam('fromPage');
  const faction_id = getUrlParam('faction_id');
  let section_id = window.sessionStorage.getItem('section_id');
  let role_id = parseInt(window.sessionStorage.getItem('role_id'));
  let personalTask = getUrlParam('personalTask');
  let myTask = getUrlParam('myTask');
  let trialTask = getUrlParam('trialTask');
  let teamId=getUrlParam('teamId');
  const returnPage=getUrlParam('returnPage');
  let id=getUrlParam('taskId');
  let selectId='';
  let selectLeaderName='';
  let selectLeaderGold='';
  $('.btnBack').click(function () {
    back();
  });
  $('.subBtn2').click(function () {
    if($("#accountTable1 tr").children().children('.activeImg2').length===0){
      $('#footerError').fadeIn(1000);
      setTimeout( ()=>{
        $('#footerError').fadeOut(1000);
      },3000)
    }else{
      submit();
    }
  });
  // 提交
  function submit() {
    window.parent.playClickEffect();
    if(selectId||parseInt(selectId)===0){
      window.sessionStorage.setItem('selectId',selectId);
      window.sessionStorage.setItem('selectLeaderName',selectLeaderName);
      window.sessionStorage.setItem('selectLeaderGold',selectLeaderGold);
    }
    back();
  }
  //返回到临时任务页面
  function back() {
    window.parent.playClickEffect();
    if(getUrlParam('fromPageTea')&&getUrlParam('fromPageTea')=="teaRoom"){
      //window.location.href =`assignLeader.html?fromPage=continueTask&taskId=${id}&faction_id=${faction_id}&pitchTeams=${$('#teamName').data('team')}&fromPage=teaRoom&teamId=${teamId}`;
      if(fromPage==='add'){
        if(!faction_id){
          if(personalTask && personalTask=='true'){
            window.location.href = `tempTaskAdd.html?fromPage=teaRoom&teamId=${teamId}&personalTask=true`;
          }else if(trialTask && trialTask=='true'){
            window.location.href = `tempTaskAdd.html?fromPage=teaRoom&teamId=${teamId}&trialTask=true`;
          }else{
            window.location.href = `tempTaskAdd.html?fromPage=teaRoom&teamId=${teamId}`;
          }
        }else{
          if(returnPage){
            window.location.href = `tempTaskAdd.html?faction_id=${faction_id}&fromPage=taskList&fromPage=teaRoom&teamId=${teamId}`;
          }else{
            window.location.href = `tempTaskAdd.html?faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
          }
        }
      }else if(fromPage==='edit'){
        if(!faction_id){
          if(personalTask && personalTask=='true'){
            window.location.href = `tempTaskEdit.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}&personalTask=true`;
          }else{
            window.location.href = `tempTaskEdit.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
          }
        }else{
          window.location.href = `tempTaskEdit.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
        }
      }else if(fromPage==='detail'){
        if(!faction_id){
          if(personalTask && personalTask=='true'){
            window.location.href = `tempTaskDetail.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}&personalTask=true`;
          }else{
            window.location.href = `tempTaskDetail.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
          }
        }else{
          window.location.href = `tempTaskDetail.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
        }
      }else if(fromPage==='continueTask'){
        if(!faction_id){
          if(personalTask && personalTask=='true'){
            window.location.href = `tempContinueTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}&personalTask=true`;
          }else if(trialTask && trialTask=='true'){
            window.location.href = `tempContinueTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}&trialTask=true`;
          }else{
            window.location.href = `tempContinueTask.html?taskId=${id}&fromPage=teaRoom&teamId=${teamId}`;
          }
        }else{
          window.location.href = `tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
        }
      }
    }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
      //window.location.href =`assignLeader.html?fromPage=continueTask&taskId=${id}&faction_id=${faction_id}&pitchTeams=${$('#teamName').data('team')}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
      if(fromPage==='add'){
        if(!faction_id){
          if(personalTask && personalTask=='true'){
            window.location.href = `tempTaskAdd.html?fromPage=teaRoomEdit&teamId=${teamId}&personalTask=true&roleId=1`;
          }else if(trialTask && trialTask=='true'){
            window.location.href = `tempTaskAdd.html?fromPage=teaRoomEdit&teamId=${teamId}&trialTask=true&roleId=1`;
          }else{
            window.location.href = `tempTaskAdd.html?fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
          }
        }else{
          if(returnPage){
            window.location.href = `tempTaskAdd.html?faction_id=${faction_id}&fromPage=taskList&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
          }else{
            window.location.href = `tempTaskAdd.html?faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
          }
        }
      }else if(fromPage==='edit'){
        if(!faction_id){
          if(personalTask && personalTask=='true'){
            window.location.href = `tempTaskEdit.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&personalTask=true&roleId=1`;
          }else{
            window.location.href = `tempTaskEdit.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
          }
        }else{
          window.location.href = `tempTaskEdit.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
        }
      }else if(fromPage==='detail'){
        if(!faction_id){
          if(personalTask && personalTask=='true'){
            window.location.href = `tempTaskDetail.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&personalTask=true&roleId=1`;
          }else{
            window.location.href = `tempTaskDetail.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
          }
        }else{
          window.location.href = `tempTaskDetail.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
        }
      }else if(fromPage==='continueTask'){
        if(!faction_id){
          if(personalTask && personalTask=='true'){
            window.location.href = `tempContinueTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&personalTask=true&roleId=1`;
          }else if(trialTask && trialTask=='true'){
            window.location.href = `tempContinueTask.html?fromPage=teaRoomEdit&teamId=${teamId}&trialTask=true&roleId=1`;
          }else{
            window.location.href = `tempContinueTask.html?taskId=${id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
          }
        }else{
          window.location.href = `tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
        }
      }
    }else{
      if(myTask && myTask == 'true'){
        if(fromPage==='add'){
          if(!faction_id){
            if(personalTask && personalTask=='true'){
              window.location.href = `tempTaskAdd.html?personalTask=true&myTask=true`;
            }else if(trialTask && trialTask=='true'){
              window.location.href = `tempTaskAdd.html?trialTask=true&myTask=true`;
            }else{
              window.location.href = 'tempTaskAdd.html&myTask=true';
            }
          }else{
            if(returnPage){
              window.location.href = `tempTaskAdd.html?faction_id=${faction_id}&fromPage=taskList&myTask=true`;
            }else{
              window.location.href = `tempTaskAdd.html?faction_id=${faction_id}&myTask=true`;
            }
          }
        }else if(fromPage==='edit'){
          if(!faction_id){
            if(personalTask && personalTask=='true'){
              window.location.href = `tempTaskEdit.html?taskId=${id}&personalTask=true&myTask=true`;
            }else{
              window.location.href = `tempTaskEdit.html?taskId=${id}&myTask=true`;
            }
          }else{
            window.location.href = `tempTaskEdit.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
          }
        }else if(fromPage==='detail'){
          if(!faction_id){
            if(personalTask && personalTask=='true'){
              window.location.href = `tempTaskDetail.html?taskId=${id}&personalTask=true&myTask=true`;
            }else{
              window.location.href = `tempTaskDetail.html?taskId=${id}&myTask=true`;
            }
          }else{
            window.location.href = `tempTaskDetail.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
          }
        }else if(fromPage==='continueTask'){
          if(!faction_id){
            if(personalTask && personalTask=='true'){
              window.location.href = `tempContinueTask.html?taskId=${id}&personalTask=true&myTask=true`;
            }else if(trialTask && trialTask=='true'){
              window.location.href = `tempContinueTask.html?taskId=${id}&trialTask=true&myTask=true`;
            }else{
              window.location.href = `tempContinueTask.html?taskId=${id}&myTask=true`;
            }
          }else{
            window.location.href = `tempContinueTask.html?taskId=${id}&faction_id=${faction_id}&myTask=true`;
          }
        }
      }else{
        if(fromPage==='add'){
          if(!faction_id){
            if(personalTask && personalTask=='true'){
              window.location.href = `tempTaskAdd.html?personalTask=true`;
            }else if(trialTask && trialTask=='true'){
              window.location.href = `tempTaskAdd.html?trialTask=true`;
            }else{
              window.location.href = 'tempTaskAdd.html';
            }
          }else{
            if(returnPage){
              window.location.href = `tempTaskAdd.html?faction_id=${faction_id}&fromPage=taskList`;
            }else{
              window.location.href = `tempTaskAdd.html?faction_id=${faction_id}`;
            }
          }
        }else if(fromPage==='edit'){
          if(!faction_id){
            if(personalTask && personalTask=='true'){
              window.location.href = `tempTaskEdit.html?taskId=${id}&personalTask=true`;
            }else{
              window.location.href = `tempTaskEdit.html?taskId=${id}`;
            }
          }else{
            window.location.href = `tempTaskEdit.html?taskId=${id}&faction_id=${faction_id}`;
          }
        }else if(fromPage==='detail'){
          if(!faction_id){
            if(personalTask && personalTask=='true'){
              window.location.href = `tempTaskDetail.html?taskId=${id}&personalTask=true`;
            }else{
              window.location.href = `tempTaskDetail.html?taskId=${id}`;
            }
          }else{
            window.location.href = `tempTaskDetail.html?taskId=${id}&faction_id=${faction_id}`;
          }
        }else if(fromPage==='continueTask'){
          if(!faction_id){
            if(personalTask && personalTask=='true'){
              window.location.href = `tempContinueTask.html?taskId=${id}&personalTask=true`;
            }else if(trialTask && trialTask=='true'){
              window.location.href = `tempContinueTask.html?taskId=${id}&trialTask=true`;
            }else{
              window.location.href = `tempContinueTask.html?taskId=${id}`;
            }
          }else{
            window.location.href = `tempContinueTask.html?taskId=${id}&faction_id=${faction_id}`;
          }
        }
      }
    }
  }

  //获取领队列表
  function getLeaders() {
    // if(getUrlParam('pitchTeams')){
      let pitchTeams=getUrlParam('pitchTeams');
      let obj={maxGrade:maxGrade};
      if(faction_id||faction_id==0){
        if(pitchTeams){
          obj.pitchTeams = pitchTeams;
        }
        obj.faction_id =faction_id;
      }else if(trialTask && trialTask == 'true'){
        if(pitchTeams){
          obj.pitchTeams = pitchTeams;
        }
        obj.filter =1;
        /*if(role_id === 3){
          obj.faction_id =faction_id;
        }else if(role_id === 2){
          obj.section_id =section_id;
        }*/
      }else{
        if(pitchTeams){
          obj.pitchTeams = pitchTeams;
        }
      }
      service.getLeadersFilter(obj,function (res) {
        for (var i = 0, len = res.length; i < len; i++) {
          res[i].num = '<span class="pitch2" data-id=' + res[i].created._id + ' data-name='+res[i].created.name+' data-gold='+res[i].created.task_vc+' alt="" ></span><span class="serialWidth">' + (i + 1) + '</span>';
          res[i].btn = '<input class="btndetail" value="\u8BE6\u60C5" data-id=' + res[i]._id + ' type="button" />';
          res[i].published_user = res[i].author && res[i].author.name ? res[i].author.name : '无';
          res[i].created.worker_num=(res[i].created&&res[i].created.worker_num)?res[i].created.worker_num:'无';
          res[i].leader_grade =(res[i].created&&res[i].created.task_score)?res[i].created.task_score.toFixed(1):'0';
          res[i].grade =(res[i].created)?'Lv'+res[i].created.level:'无';
          res[i].job_name =(res[i].created&&res[i].created.title)?res[i].created.title:'无';
          res[i].job_grade =(res[i].created&&res[i].created.grade)?res[i].created.grade:'无';
        }
        $('#accountTable1').dataTable({
          retrieve: true,
          scrollY: 800,
          scrollCollapse: true,
          paging: false, //分页
          ordering: true, //是否启用排序
          searching: false, //搜索
          language: {
            lengthMenu: '',
            info: "",
            infoEmpty: "",
            infoFiltered: "",
            sEmptyTable: "暂无数据",
          },
          data: res,
          columns: [{ data: 'num', title: '序号', orderable: true },
            { data: 'name', title: '队伍名称', orderable: true },
            { data: 'member_count', title: '队伍人数', orderable: true },
            { data: 'created.name', title: '领队', orderable: true },
            { data: 'created.worker_number', title: '工号', orderable: true },
            { data: 'leader_grade', title: '领队评分', orderable: true },
            { data: 'grade', title: '等级', orderable: true },
            { data: 'job_name', title: '岗位名称', orderable: true },
            { data: 'job_grade', title: '岗位级别', orderable: true },
            { data: 'grade', title: 'f', orderable: false }
          ]
        });
        $(window).resize(function () {          //当浏览器大小变化时
          $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
        });
        $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
        let items = $(".row").find(".pitch2");
        $("#accountTable1 tr").click(function(){
          selectId=$(this).find(".pitch2").data('id');
          selectLeaderName=$(this).find(".pitch2").data('name');
          selectLeaderGold=$(this).find(".pitch2").data('gold');
          $(this).find(".pitch2").addClass("activeImg2").parent().parent().siblings().children().children(".activeImg2").addClass("pitch2");
          $(this).find(".pitch2").removeClass("pitch2").parent().parent().siblings().children().children(".activeImg").addClass("pitch2");
        });
      });
    /*}else{
      service.getLeaders(maxGrade,function (res) {
        for (var i = 0, len = res.length; i < len; i++) {
          res[i].num = '<span class="pitch2" data-id=' + res[i].created._id + ' data-name='+res[i].created.name+'  alt="" ></span><span class="serialWidth">' + (i + 1) + '</span>';
          res[i].btn = '<input class="btndetail" value="\u8BE6\u60C5" data-id=' + res[i]._id + ' type="button" />';
          res[i].published_user = res[i].author && res[i].author.name ? res[i].author.name : '无';
          res[i].created.worker_num=(res[i].created&&res[i].created.worker_num)?res[i].created.worker_num:'无'
          res[i].leader_grade =(res[i].created&&res[i].created.task_score)?res[i].created.task_score:'0';
          res[i].grade =(res[i].created&&res[i].created.level)?res[i].created.level:'无';
          res[i].job_name =(res[i].created&&res[i].created.title)?res[i].created.title:'无';
          res[i].job_grade =(res[i].created&&res[i].created.grade)?res[i].created.grade:'无';
        }
        $('#accountTable1').dataTable({
          retrieve: true,
          scrollY: 780,
          scrollCollapse: true,
          paging: false, //分页
          ordering: false, //是否启用排序
          searching: false, //搜索
          language: {
            lengthMenu: '',
            info: "",
            infoEmpty: "0条记录",
            infoFiltered: ""
          },
          data: res,
          columns: [{ data: 'num', title: '序号', orderable: false },
            { data: 'name', title: '队伍名称', orderable: false },
            { data: 'member_count', title: '队伍人数', orderable: false },
            { data: 'created.name', title: '领队', orderable: false },
            { data: 'created.worker_num', title: '工号', orderable: false },
            { data: 'leader_grade', title: '领队评分', orderable: false },
            { data: 'grade', title: '等级', orderable: false },
            { data: 'job_name', title: '岗位名称', orderable: false },
            { data: 'job_grade', title: '岗位级别', orderable: false },
            { data: 'name', title: 'f', orderable: false }
          ]
        });
        let items = $(".row").find(".pitch2");
        $("#accountTable1 tr").click(function(){
          selectId=$(this).find(".pitch2").data('id');
          selectLeaderName=$(this).find(".pitch2").data('name');
          $(this).find(".pitch2").addClass("activeImg2").parent().parent().siblings().children().children(".activeImg2").addClass("pitch2");
          $(this).find(".pitch2").removeClass("pitch2").parent().parent().siblings().children().children(".activeImg").addClass("pitch2");
        });
      });
    }
*/

  }
  $(document).on('click','table th',function(){
    window.parent.playClickEffect();
  });
  getLeaders();
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
