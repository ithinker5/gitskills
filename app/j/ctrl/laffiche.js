$(function(){
  const service=new SERVICE();
  let faction_id=getUrlParam('faction_id');
  let obj = {};
  if(faction_id){
    $("#pageTitle").text('帮会公告');
    obj.faction_id=faction_id;
  }else{
    $("#pageTitle").text('联盟公告');
    obj.department_id=window.sessionStorage.getItem("department_id");
  }
  function getList() {
    service.getList(obj,res => {
      for(let i=0,len=res.length;i<len;i++){
        res[i].num=`<img class="pitch activeImg" data-id=${res[i]._id} src="../i/pitch.png" alt="" /><span class="pitchId">${i+1}</span>`;
        res[i].btn=`<input class="btndetail" value="详情" data-id=${res[i]._id} type="button" />`;
        res[i].published_user=(res[i].author&&res[i].author.name)?res[i].author.name:'无';
        res[i].created_at=res[i].created_at?dateChange(res[i].created_at):dateChange();
      }
      $('#tab1').empty().append(`<table id="lmMember" class="table2 table-striped"></table>`);
      $('#lmMember').dataTable({
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
        data:res,
        columns: [
          {data: 'num', title: '序号', orderable: true},
          {data: 'title', title: '标题', orderable: true},
          {data: 'published_user', title: '发布人', orderable: true},
          {data: 'created_at', title: '发布时间', orderable: true},
          {data: 'btn', title: '', orderable: false}
        ]
      });
      $(window).resize(function () {          //当浏览器大小变化时
        $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
      });
      $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
      //判断权限
      let ROLE_ID=window.sessionStorage.getItem('role_id');
      if(obj.faction_id){
        if(!(parseInt(ROLE_ID)===5||parseInt(ROLE_ID)===4||parseInt(ROLE_ID)===3||parseInt(ROLE_ID)===2)){
          $('.btnStyle.deleteBtn').css('display','none');
          $('.btnStyle.releaseBtn').css('display','none');
          $('.pitch').remove();
          $('.allPitch').remove();
          $(".pitchId").css({'position':'inherit',"right":"0"});
          $(".gBoxList2").css('height','92%');
          $(".boxBottom2").css('height','8%');
        }
      }else{
        if(!(parseInt(ROLE_ID)===5||parseInt(ROLE_ID)===4)){
          $('.btnStyle.deleteBtn').css('display','none');
          $('.btnStyle.releaseBtn').css('display','none');
          $('.pitch').remove();
          $('.allPitch').remove();
          $(".pitchId").css({'position':'inherit',"right":"0"});
          $(".gBoxList2").css('height','92%');
          $(".boxBottom2").css('height','8%');
        }
      }

      $(".pitch").off("click").on("click",function() {
        window.parent.playClickEffect();
        if ($(this).hasClass("activeImg")) {
          $(this).attr("src", "../i/pitch2.png");
          $(this).removeClass("activeImg");
          $(this).addClass("his_active");
        } else {
          $(this).attr("src", "../i/pitch.png");
          $(this).addClass("activeImg");
          $(this).removeClass("his_active");
        }
      });
      $(".allPitch").off("click").on("click",function(){
        window.parent.playClickEffect();
        if($(this).hasClass("activeImg")){
          $(this).attr("src","../i/pitch2.png");
          $(this).removeClass("activeImg");
          $(".pitch").attr("src","../i/pitch2.png");
          $(".pitch").removeClass("activeImg");
          $(".pitch").addClass("his_active");
        }else{
          $(this).attr("src","../i/pitch.png");
          $(this).addClass("activeImg");
          $(".pitch").attr("src","../i/pitch.png");
          $(".pitch").addClass("activeImg");
          $(".pitch").removeClass("his_active");
        }
      });
      $(document).on('click','table th',function(){
        window.parent.playClickEffect();
      });
      $('.dataTables_scrollBody').off('click', 'input.btndetail').on('click','input.btndetail',function(){
        window.parent.playClickEffect();
        let id=$(this).data('id');
        if(faction_id){
          window.location.href = `lafficheDetails.html?lafficheId=${id}&faction_id=${faction_id}`;
        }else{
          window.location.href = `lafficheDetails.html?lafficheId=${id}`;
        }
      })

    });
  }
  getList();
  $(".deleteBtn").click(function(){
    window.parent.playClickEffect();
    if($(".pitch.his_active").length===0){
      animate($('#footerError'));
    }else{
      confirmAgain({
        title:'删除',
        content:{
          text:'您确认要删除公告吗？'
        },
        btns:[
          {domId:'cancel',text:'取消'},
          {domId:'confirm',text:'确定',event:confirmDelete},
        ]
      });
    }
  });
function confirmDelete() {
  const ids = [];
  $(".pitch.his_active").each(function(){
    ids.push($(this).data('id'));
    $(this).parent().parent().remove();
  });
  service.delete(ids,res => {
    getList()
  });
}
  $(".releaseBtn").click(function(){
    window.parent.playClickEffect();
    if(faction_id){
      window.location.href = `lafficheAdd.html?faction_id=${faction_id}`;
    }else{
      window.location.href = 'lafficheAdd.html';
    }
  });
});

