'use strict';
$(function () {
  let service = new SERVICE();
  //帮会id
  let bID = getUrlParam('faction_id');
  let ROLE_ID=parseInt(window.sessionStorage.getItem('role_id'));
  $('.fbtask').click(()=>{
    window.parent.playClickEffect();
    window.sessionStorage.setItem('fromPage','faction');
    window.sessionStorage.setItem('faction_id',bID);
    window.parent.reloadWeb(`app/h/tempTaskAdd.html?skipCocos=true&faction_id=${bID}`, true, false, 1465, 756);
    //window.location.href = `tempTaskAdd.html?faction_id=${bID}`;
  });
  if(!(ROLE_ID===5||ROLE_ID===4||ROLE_ID===2||ROLE_ID===3)){
    $('.fbtask').css('display','none');
  }
  $(".Back").click(function(){
    window.parent.playClickEffect();
    /*if(getUrlParam('fromPage')==1){
      window.location.href='organization1.html';
    }else{*/
      window.parent.closeWebPop();
    //}
  });
  $('.bhtask').click(()=>{
    window.parent.playClickEffect();
    window.location.href = 'taskList2.html?faction_id='+bID;
  });
  $(".factionAffiche").click(function(){
    window.parent.playClickEffect();
    window.parent.reloadWeb('app/h/laffiche.html?faction_id='+bID,true,false,1465,700);
    //window.location.href = 'laffiche.html?faction_id='+bID;
  });

  $(".bhOrgan").click(function(){
    window.parent.playClickEffect();
    //window.parent.reloadWeb('app/h/laffiche.html?faction_id='+bID,true,false,1465,700);
    window.location.href = 'organization1.html?faction_id='+bID;
  });
  $(".bhFramework").click(function(){
    window.parent.playClickEffect();
    //window.parent.reloadWeb('app/h/laffiche.html?faction_id='+bID,true,false,1465,700);
    window.location.href = 'framework1.html?faction_id='+bID;
  });
  //获取帮会信息
  function getInfo() {
    service.getInfo(bID, function (res) {
      $(".tabText").html(res.name);
      $(".factionName").html(res.name);
      $(".factionNum").html(res.member_count);
      $(".factionVc").html(res.vc);
      $(".factionMoney").html(res.gold);
      $(".factionOrg").html(res.org_info);
      $(".factionIntro").html(res.desc);
    });
  }
  //获取帮会成员信息
  function getUsers() {
    service.getUsers(bID, function (res) {
      for(var i=0,len=res.length;i<len;i++){
        res[i].worker_number='<span data-id='+res[i]._id+'>'+res[i].worker_number||'无'+'</span>';
       // res[i].worker_number=res[i].worker_number||'无';
        res[i].year_of_service=res[i].year_of_service.toFixed(1)+'年';
        res[i].level=`Lv${res[i].level}`;
        res[i].title=res[i].title||'无';
        if(parseInt(res[i].role_id)==4){
          res[i].role_id2='护法'
        }else if(parseInt(res[i].role_id)==3){
          $(".factionBoss").html(res[i].name);
          res[i].role_id2='帮主'
        }else if(parseInt(res[i].role_id)==2){
          res[i].role_id2='长老'
        }else if(parseInt(res[i].role_id)==5){
          if($(".factionBoss").text()==''){
            $(".factionBoss").html(res[i].name);
          }
          res[i].role_id2='盟主'
        }else{
          res[i].role_id2='帮众';
          if($(".factionBoss").text()==''){
            $(".factionBoss").html('无');
          }
        }
      }
      $('#accountTable1').dataTable({
        retrieve: true,
        scrollY: 640,
        scrollCollapse: true,
        paging: false, //分页
        ordering: false, //是否启用排序
        searching: false, //搜索
        language: {
          lengthMenu: '',
          info: "",
          infoEmpty: "",
          infoFiltered: "",
          sEmptyTable: "暂无数据",
        },
        data:res,
        columns: [{data: 'worker_number', title: '工号', orderable: false},
          {data: 'name',title: '姓名',orderable: false},
          {data: 'level', title: '等级', orderable: false},
          {data: 'title',title: '岗位名称',orderable: false},
          {data: 'grade', title: '岗位级别', orderable: false},
          {data: 'role_id2', title: '帮会职务', orderable: false},
          {data: 'year_of_service', title: '从业时长', orderable: false},
        ]
      });
     /* if(window.sessionStorage.getItem('role_id')==5||window.sessionStorage.getItem('role_id')==4||window.sessionStorage.getItem('role_id')==3){
        $("#accountTable1 tr").click(function(){
          window.parent.playClickEffect();
          window.parent.checkRoleInfo($(this).children().children('span').data('id'));
        })
      }*/
    });
  }
  getInfo();
  getUsers();
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
