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
  $(".btnBack").click(function(){
    window.parent.playClickEffect();
    window.location.href='addBadList.html';
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
    }
    window.location.href='addBadList.html';
  }

  //获取领队列表
  function getLeaders() {
    let pitchTeams=getUrlParam('pitchTeams');
    service.getMemberList(function (res) {
      for (var i = 0, len = res.length; i < len; i++) {
        res[i].work_num = '<span class="pitch2" data-id=' + res[i]._id + ' data-name='+res[i].name+' alt="" ></span><span style="min-width: 10.5rem;" class="serialWidth">' + res[i].worker_number + '</span>';
        res[i].level=`Lv${res[i].level}`;
        res[i].title=res[i].title||'无';
        res[i].factions2=(res[i].faction&&res[i].faction.name)||'无';
        if(parseInt(res[i].role_id)==5){
          res[i].role_id2='盟主'
        }else if(parseInt(res[i].role_id)==4){
          res[i].role_id2='护法'
        }else if(parseInt(res[i].role_id)==3){
          res[i].role_id2='帮主'
        }else if(parseInt(res[i].role_id)==2){
          res[i].role_id2='长老'
        }else{
          res[i].role_id2='帮众'
        }
        res[i].factions2=(res[i].faction&&res[i].faction.name)||'无';
        res[i].year_of_service='<span class="year">'+res[i].year_of_service.toFixed(1)+'</span><span class="units"></span>';
      }
      $('#accountTable1').dataTable({
        retrieve: true,
        scrollY: 860,
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
        columns: [{ data: 'work_num', title: '工号', orderable: true },
          { data: 'name', title: '姓名', orderable: true },
          { data: 'title', title: '岗位名称', orderable: true },
          { data: 'grade', title: '岗位级别', orderable: true },
          { data: 'level', title: '等级', orderable: true },
          // { data: 'factions2', title: '所属帮会', orderable: false },
          { data: 'role_id2', title: '帮会职务', orderable: true },
          { data: 'year_of_service', title: '从业时长', orderable: true },
          /*{ data: 'level', title: 'f', orderable: false },*/
        ]
      });
      $("#accountTable1").find('.units').html('年');
      $(window).resize(function () {          //当浏览器大小变化时
        $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
      });
      $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
      $("#accountTable1 tr").click(function(){
        selectId=$(this).find(".pitch2").data('id');
        selectLeaderName=$(this).find(".pitch2").data('name');
        $(this).find(".pitch2").addClass("activeImg2").parent().parent().siblings().children().children(".activeImg2").addClass("pitch2");
        $(this).find(".pitch2").removeClass("pitch2").parent().parent().siblings().children().children(".activeImg").addClass("pitch2");
      });
    });
  }
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
