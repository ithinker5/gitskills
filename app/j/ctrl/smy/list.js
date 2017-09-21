$(function(){
  const service=new SERVICE();
  function getList() {
    service.getList(res => {
      let $container=$('#tab1');
      for(let i=0,len=res.length;i<len;i++){
        res[i].num=`<img class="pitch activeImg" data-id=${res[i]._id} src="../../i/pitch.png" alt="" /><span class="pitchId">${i+1}</span>`;
        res[i].btn=`<input class="btndetail" value="详情" data-id=${res[i]._id} type="button" />`;
        res[i].created_at=res[i].created_at?dateChange(res[i].created_at):dateChange();
      }
      $container.empty();
      $container.append(`<table id="meeting" class="table2 table-striped"></table>`);
      $('#meeting').dataTable({
        retrieve: true,
        scrollY: 780,
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
          {data: 'user.name', title: '发布人', orderable: true},
          {data: 'created_at', title: '发布时间', orderable: true},
          {data: 'btn', title: '', orderable: false}
        ]
      });
      $(window).resize(function () {          //当浏览器大小变化时
        $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
      });
      $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
      $(".pitch").off("click").on("click",function() {
        window.parent.playClickEffect();
        if ($(this).hasClass("activeImg")) {
          $(this).attr("src", "../../i/pitch2.png").removeClass('activeImg').addClass('his_active');
        } else {
          $(this).attr("src", "../../i/pitch.png").addClass('activeImg').removeClass('his_active');
        }
      });
      $(document).on('click','table th',function(){
        window.parent.playClickEffect();
      });
      $('.dataTables_scrollBody').off('click', 'input.btndetail').on('click','input.btndetail',function(){
        window.parent.playClickEffect();
        let id=$(this).data('id');
        window.location.href = `detail.html?meetId=${id}`;
      })
    });
  }
  getList();
  $(".deleteBtn").click(function(){
    window.parent.playClickEffect();
    if($(".pitch.his_active").length===0){
      animate($('#footerError'))
    }else{
      confirmAgain({
        title:'删除',
        content:{
          text:'您确认要删除会议记录吗？'
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
    window.location.href = 'add.html';
  });
});


