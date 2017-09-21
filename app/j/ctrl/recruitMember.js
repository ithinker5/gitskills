'use strict';
$(function () {
  let service = new SERVICE();
  let obj =[];
  const id = getUrlParam('taskId');
  let teamId=getUrlParam('teamId');
  const faction_id = getUrlParam('faction_id');
  let personalTask = getUrlParam('personalTask');
  let myTask = getUrlParam('myTask');
  $('.btnBack').click(function () {
    window.parent.playClickEffect();
    back();
  });
  $('.subBtn2').click(function () {
    window.parent.playClickEffect();
    if($("#accountTable1 tr").children().children('.activeImg3').length===0){
      $('#footerError').fadeIn(1000);
      setTimeout(function () {
        $('#footerError').fadeOut(1000);
      },3000)
    }else{
      submit();
    }
  });
  // 提交
  function submit() {
    function getRecruit(user_ids) {
      let userId={
        user_ids:user_ids,
      };
      service.getRecruit(userId,function (res) {
        if(getUrlParam('roleId')==1){
          window.location.href = 'createTearmDetail.html?roleId=1&teamId='+teamId;
        }else if(getUrlParam('receiveTask')==2){//continue
          if(!faction_id){
            if(myTask && myTask == 'true'){
              if(personalTask && personalTask == 'true'){
                if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
                  window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoom&teamId=${teamId}&myTask=true`;
                }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
                  window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&myTask=true`;
                }else{
                  window.location.href = `tempContinueTask.html?taskId=${id}&receiveTask=2&personalTask=true&myTask=true`;
                }
              }else{
                if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
                  window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoom&teamId=${teamId}&myTask=true`;
                }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
                  window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&myTask=true`;
                }else{
                  window.location.href = `tempContinueTask.html?taskId=${id}&receiveTask=2&myTask=true`;
                }
              }
            }else{
              if(personalTask && personalTask == 'true'){
                if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
                  window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoom&teamId=${teamId}`;
                }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
                  window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
                }else{
                  window.location.href = `tempContinueTask.html?taskId=${id}&receiveTask=2&personalTask=true`;
                }
              }else{
                if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
                  window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoom&teamId=${teamId}`;
                }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
                  window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
                }else{
                  window.location.href = `tempContinueTask.html?taskId=${id}&receiveTask=2`;
                }
              }
            }
          }else{
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            }else{
              if(myTask && myTask == 'true'){
                window.location.href = `tempContinueTask.html?taskId=${id}&receiveTask=2&faction_id=${faction_id}&myTask=true`;
              }else{
                window.location.href = `tempContinueTask.html?taskId=${id}&receiveTask=2&faction_id=${faction_id}`;
              }
            }
          }
        }else if(getUrlParam('receiveTask')==1){//detail
          if(!faction_id){
            if(myTask && myTask == 'true'){
              if(personalTask && personalTask == 'true'){
                if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
                  window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoom&teamId=${teamId}&myTask=true`;
                }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
                  window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&myTask=true`;
                }else{
                  window.location.href = 'tempTaskDetail.html?taskId='+id+'&receiveTask=1&personalTask=true&myTask=true';
                }
              }else{
                if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
                  window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoom&teamId=${teamId}&myTask=true`;
                }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
                  window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&myTask=true`;
                }else{
                  window.location.href = 'tempTaskDetail.html?taskId='+id+'&receiveTask=1&myTask=true';
                }
              }
            }else{
              if(personalTask && personalTask == 'true'){
                if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
                  window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoom&teamId=${teamId}`;
                }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
                  window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
                }else{
                  window.location.href = 'tempTaskDetail.html?taskId='+id+'&receiveTask=1&personalTask=true';
                }
              }else{
                if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
                  window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoom&teamId=${teamId}`;
                }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
                  window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
                }else{
                  window.location.href = 'tempTaskDetail.html?taskId='+id+'&receiveTask=1';
                }
              }
            }
          }else{
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            }else{
              if(myTask && myTask == 'true'){
                window.location.href = `tempTaskDetail.html?taskId=${id}&receiveTask=1&faction_id=${faction_id}&myTask=true`;
              }else{
                window.location.href = `tempTaskDetail.html?taskId=${id}&receiveTask=1&faction_id=${faction_id}`;
              }
            }
          }
        }else{
          window.location.href = 'createTearmDetail.html?roleId=0&teamId='+teamId;
        }
      })
    }
    getRecruit(obj);
  }
  //返回到创建队伍页面
  function back() {
    /*1:详情页进入，2表示创建队伍进入*/
    if(getUrlParam('roleId')==1){
      window.location.href = 'createTearmDetail.html?roleId=1&teamId='+teamId;
    }else if(getUrlParam('receiveTask')==2){
      if(!faction_id){
        if(myTask && myTask == 'true'){
          if(personalTask && personalTask == 'true'){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoom&teamId=${teamId}&myTask=true`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&myTask=true`;
            }else{
              window.location.href = `tempContinueTask.html?taskId=${id}&receiveTask=2&personalTask=true&myTask=true`;
            }
          }else{
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoom&teamId=${teamId}&myTask=true`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&myTask=true`;
            }else{
              window.location.href = `tempContinueTask.html?taskId=${id}&receiveTask=2&myTask=true`;
            }
          }
        }else{
          if(personalTask && personalTask == 'true'){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoom&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            }else{
              window.location.href = `tempContinueTask.html?taskId=${id}&receiveTask=2&personalTask=true`;
            }
          }else{
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoom&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            }else{
              window.location.href = `tempContinueTask.html?taskId=${id}&receiveTask=2`;
            }
          }
        }
      }else{
        if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
          window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
        }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
          window.location.href =`tempContinueTask.html?taskId=${id}&receiveTask=2&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
        }else{
          if(myTask && myTask == 'true'){
            window.location.href = `tempContinueTask.html?taskId=${id}&receiveTask=2&faction_id=${faction_id}&myTask=true`;
          }else{
            window.location.href = `tempContinueTask.html?taskId=${id}&receiveTask=2&faction_id=${faction_id}`;
          }
        }
      }
    }else if(getUrlParam('receiveTask')==1){
      if(!faction_id){
        if(myTask && myTask == 'true'){
          if(personalTask && personalTask == 'true'){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoom&teamId=${teamId}&myTask=true`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&myTask=true`;
            }else{
              window.location.href = 'tempTaskDetail.html?taskId='+id+'&receiveTask=1&personalTask=true&myTask=true';
            }
          }else{
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoom&teamId=${teamId}&myTask=true`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1&myTask=true`;
            }else{
              window.location.href = 'tempTaskDetail.html?taskId='+id+'&receiveTask=1&myTask=true';
            }
          }
        }else{
          if(personalTask && personalTask == 'true'){
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoom&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            }else{
              window.location.href = 'tempTaskDetail.html?taskId='+id+'&receiveTask=1&personalTask=true';
            }
          }else{
            if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
              window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoom&teamId=${teamId}`;
            }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
              window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
            }else{
              window.location.href = 'tempTaskDetail.html?taskId='+id+'&receiveTask=1';
            }
          }
        }
      }else{
        if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoom"){
          window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&faction_id=${faction_id}&fromPage=teaRoom&teamId=${teamId}`;
        }else if(getUrlParam('fromPage')&&getUrlParam('fromPage')=="teaRoomEdit"){
          window.location.href =`tempTaskDetail.html?taskId=${id}&receiveTask=1&faction_id=${faction_id}&fromPage=teaRoomEdit&teamId=${teamId}&roleId=1`;
        }else{
          if(myTask && myTask == 'true'){
            window.location.href = `tempTaskDetail.html?taskId=${id}&receiveTask=1&faction_id=${faction_id}&myTask=true`;
          }else{
            window.location.href = `tempTaskDetail.html?taskId=${id}&receiveTask=1&faction_id=${faction_id}`;
          }
        }
      }
    }else{
      window.location.href = 'createTearmDetail.html?roleId=0&teamId='+teamId;
    }
  }

  //获取招募队员列表
  function getList() {
    service.getList(getUrlParam('exclude'),function (res) {
      for (let i = 0, len = res.length; i < len; i++) {
        res[i].worker_number = '<span class="pitch" data-id=' + res[i]._id + ' alt="" ></span><span class="serialWidth">' + res[i].worker_number + '</span>'||'无';
        res[i].title=res[i].title||'无';
        res[i].level2=`Lv${res[i].level}`;
        if(res[i].role_id === 5||res[i].role_id === '5'){
          res[i].role_id2='盟主'
        }else if(res[i].role_id === 4||res[i].role_id === '4'){
          res[i].role_id2='护法'
        }else if(res[i].role_id === 3||res[i].role_id === '3'){
          res[i].role_id2='帮主'
        }else if(res[i].role_id === 2||res[i].role_id === '2'){
          res[i].role_id2='长老'
        }else{
          res[i].role_id2='帮众'
        }
        res[i].year_of_service='<span class="year">'+res[i].year_of_service.toFixed(1)+'</span><span class="units"></span>';
        res[i].grade=res[i].grade||'无';
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
        columns: [{ data: 'worker_number', title: '工号', orderable: true },
          { data: 'name', title: '姓名', orderable: true },
          { data: 'level2', title: '等级', orderable: true },
          { data: 'title', title: '岗位名称', orderable: true },
          { data: 'grade', title: '岗位级别', orderable: true },
          { data: 'role_id2', title: '帮会职务', orderable: true },
          { data: 'year_of_service', title: '从业时长', orderable: true },
          { data: '_id', title: 'aaa', orderable: false },
        ]
      });
      $("#accountTable1").find('.units').html('年');
      $(window).resize(function () {          //当浏览器大小变化时
        $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
      });
      $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
      $("#accountTable1 tr").click(function(){
        window.parent.playClickEffect();
        if($(this).find(".pitch").hasClass("pitch")){
          $(this).find(".pitch").removeClass("pitch").addClass("activeImg3");
          obj.push($(this).find(".activeImg3").data("id"));
        }else if($(this).find(".activeImg3").hasClass("activeImg3")){
          $(this).find(".activeImg3").addClass("pitch").removeClass("activeImg3");
        }
      });
    });
  }
  $(document).on('click','table th',function(){
    window.parent.playClickEffect();
  });
  getList();
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
