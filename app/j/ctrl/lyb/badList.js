"use strict";
$(function () {
  const service = new SERVICE();
  let user_id=window.sessionStorage.getItem('user_id');
  let deleteId='';
  if(window.sessionStorage.getItem('role_id')==4||window.sessionStorage.getItem('role_id')==5){
    $(".btnStyle").removeClass('dis_n');
  }
  function getHitList() {
    service.getHitList(res => {
      for (var i = 0, len = res.length; i < len; i++) {
        res[i].num = `<span data-id=${res[i]._id} id="id" data-status=${res[i].status}>${i + 1}</span>`;
        res[i].dataTime=dateChange(res[i].start_time)+'&nbsp;—&nbsp;'+dateChange(res[i].end_time);
        if(window.sessionStorage.getItem('role_id')==4||window.sessionStorage.getItem('role_id')==5){
          res[i].btn = '<input class="btn-manager btn-small" value="移除" data-id=' + res[i]._id + ' type="button" />';
        }else{
          res[i].btn = '<input class="btn-manager btn-small dis_n" value="移除" data-id=' + res[i]._id + ' type="button" />';
        }
      }
      $('#accountTable1').dataTable({
        retrieve: true,
        scrollY: 800,
        scrollCollapse: true,
        paging: false, //分页
        ordering: false, //是否启用排序
        searching: false, //搜索
        language: {
          lengthMenu: '',
          info: "",
          infoEmpty: "0条记录",
          infoFiltered: "",
          sEmptyTable: "暂无数据",
        },
        data: res,
        columns: [{data: 'num', title: '序号', orderable: false},
          {data: 'user.name', title: '姓名', orderable: false},
          {data: 'dataTime', title: '禁止接任务时间', orderable: false},
          {data: 'reason', title: '说明', orderable: false},
          {data: 'btn', title: '', orderable: false},
          ]
      });
      deleteId=$("#id").data('id');
      $(window).resize(function () {          //当浏览器大小变化时
        $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
      });
      $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
    })
  }
  $(document).on('click','.btn-manager',function(){
    window.parent.playClickEffect();
    if(window.sessionStorage.getItem('role_id')==4||window.sessionStorage.getItem('role_id')==5){
      confirmAgain({
        title:'移除黑名单',
        content:{
          text:'您确认要将此人移除黑名单吗？'
        },
        btns:[
          {domId:'cancelAnswer',text:'取消'},
          {domId:'confirm',text:'确定',event:deleteMember},
        ]
      });
    }else{
      confirmAgain({
        title:'移除黑名单',
        content:{
          text:'您没有权限将此人移除黑名单！'
        },
        btns:[
          {domId:'confirm',text:'确定'},
        ]
      });
    }
  });
  function deleteMember(){
    service.getDeleteBlackList(deleteId, ()=>{
      location.reload();
    })
  }
  getHitList();
  $(".btnStyle").click(function () {
    window.parent.playClickEffect();
    window.location.href='addBadList.html';
  });
  function dateChange(date) {
    let newDate = date ? (new Date(date)) : new Date();
    return `${newDate.getFullYear()}年${newDate.getMonth() + 1}月${newDate.getDate()}日`;
  }
});
