$(function(){
  const service=new SERVICE();
  function getList() {
    service.getQuestionList(res => {
      let $container=$('#tab1');
      for(let i=0,len=res.length;i<len;i++){
        res[i].num=`<span data-id=${res[i]._id} class="id">${i + 1}</span>`;
        res[i].created_at=res[i].created_at?dateChange(res[i].created_at):dateChange();
        switch (parseInt(res[i].status)){
          case 0:res[i].statusChinese='提问中';break;
          case 1:res[i].statusChinese='已解答';break;
          case 2:res[i].statusChinese='已关闭';break;
        }
      }
      $container.empty();
      $container.append(`<table id="question" class="table2 table-striped"></table>`);
      $('#question').dataTable({
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
          {data: 'author.name', title: '提问人', orderable: true},
          {data: 'statusChinese', title: '状态', orderable: true},
          {data: 'created_at', title: '发布时间', orderable: true},
        ]
      });
      $(window).resize(function () {
        $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
      });
      $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))-10+'px');
      $('#question tr').click(function(){
        window.parent.playClickEffect();
        let id=$(this).find('.id').data('id');
        if(id){
          window.location.href = `questionDetail.html?questionId=${id}`;
        }
      })
    });
  }
  $(document).on('click','table th',function(){
    window.parent.playClickEffect();
  });
  getList();
  $(".releaseBtn").click(function(){
    window.parent.playClickEffect();
    window.location.href = 'questionAdd.html';
  });
});


