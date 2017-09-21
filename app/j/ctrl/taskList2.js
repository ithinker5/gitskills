"use strict";
$(function () {
  var service=new SERVICE();
  const user_role=parseInt(window.sessionStorage.getItem('role_id'));
  const faction_id=getUrlParam('faction_id');

  $('#manager').on('click',function () {
    window.location.href=`manager.html?faction_id=${faction_id}`;
  });

  if(user_role==1){
    $(".fbtask").remove();
    $(".change .boxBottom3").css("height","2rem");
  }
  function getTasks() {
    service.getTasks({faction_id:faction_id,type:1},res=>{
      for(var i=0,len=res.length;i<len;i++){
        res[i].btn='<input class="btndetail" value="详情" type="button" />';
        res[i].num=`<span data-id=${res[i]._id} class="id" data-type=${res[i].type} data-subtype=${res[i].subtype} data-status=${res[i].status}>${i + 1}</span>`;
        switch (res[i].subtype) {
          case 0:
            res[i].subtype2 = '联盟战略任务';
            break;
          case 1:
            res[i].subtype2 = '联盟临时任务';
            break;
          case 2:
            res[i].subtype2 = '帮会挑战任务';
            break;
          case 3:
            res[i].subtype2 = '帮会基础任务';
            break;
          case 4:
            res[i].subtype2 = '帮会临时任务';
            break;
        }
        switch (res[i].status) {
          case -1:
            res[i].status2 = '删除';
            break;
          case 0:
            res[i].status2 = '待审核';
            break;
          case 1:
            res[i].status2 = '待审核';
            break;
          case 2:
            res[i].status2 = '待审核';
            break;
          case 3:
            res[i].status2 = '驳回';
            break;
          case 4:
            if (window.sessionStorage.getItem('role_id') == 5||window.sessionStorage.getItem('role_id') == 4||window.sessionStorage.getItem('role_id') == 3||(window.sessionStorage.getItem('role_id') == 2&&window.sessionStorage.getItem('user_id')==res[i].created._id)){
              if(res[i].leader){
                res[i].status2 = '待批准';
              }else{
                res[i].status2 = '悬赏中';
              }
            }else{
              if(res[i].leader){
                if(window.sessionStorage.getItem('user_id')==res[i].leader._id){
                  res[i].status2 = '待批准';
                }else{
                  res[i].status2 = '悬赏中';
                }
              }else{
                res[i].status2 = '悬赏中';
              }
            }
            /*res[i].status2 = '悬赏中';*/
            break;
          case 5:
            res[i].status2 = '进行中';
            break;
          case 6:
            res[i].status2 = '待验收';
            break;
          case 7:
            res[i].status2 = '待验收';
            break;
          case 8:
            res[i].status2 = '待验收';
            break;
          case 9:
            res[i].status2 = '待验收';
            break;
          case 10:
            res[i].status2 = '返工';
            break;
          case 11:
            res[i].status2 = '待分配';
            break;
          case 12:
            res[i].status2 = '已完成';
            break;
          case 13:
            res[i].status2 = '已关闭';
            break;
          case 14:
            res[i].status2 = '失败';
            break;
        }
        // if(parseInt(res[i].status)<=4){
        //   res[i].leader2 = '无';
        // }else {
          if(res[i].leader&&res[i].leader.name){
              if (res[i].status==4||res[i].status<4){
                res[i].leader2 = '无';
              }else{
                res[i].leader2 = res[i].leader.name;
              }
          }else{
            res[i].leader2 = '无';
          }
        // }
        if (res[i].level === 1) {
          res[i].level = "<img src='../i/magatama.png' />";
        } else if (res[i].level === 2) {
          res[i].level = "<img src='../i/magatama.png' /> <img src='../i/magatama.png' />";
        } else if (res[i].level === 3) {
          res[i].level = "<img src='../i/magatama.png' /> <img src='../i/magatama.png' /> <img src='../i/magatama.png' />";
        } else if (res[i].level === 4) {
          res[i].level = "<img src='../i/magatama.png' /> <img src='../i/magatama.png' /> <img src='../i/magatama.png' /> <img src='../i/magatama.png' />";
        } else if (res[i].level === 5) {
          res[i].level = "<img src='../i/magatama.png' /> <img src='../i/magatama.png' /> <img src='../i/magatama.png' /> <img src='../i/magatama.png' /> <img src='../i/magatama.png' />";
        }
        res[i].published_at = res[i].published_at ? dateChange(res[i].published_at) : dateChange();
        res[i].deadline = res[i].deadline ? dateChange(res[i].deadline) : dateChange();
        res[i].leader_grade =res[i].leader_grade||'无';
      }
      $('#accountTable1').dataTable({
        retrieve: true,
        scrollY: 800,
        scrollCollapse: true,
        paging: false, //分页
        ordering: true, //是否启用排序
        searching: true, //搜索
        language: {
          lengthMenu: '',
          info: "",
          sSearch:"",//<span>搜索</span>
          sZeroRecords:"未搜索到相关内容",
          infoEmpty: "",
          infoFiltered: "",
          sEmptyTable: "暂无数据",
        },
        data:res,
        columns: [{data: 'num', title: '序号', orderable: true},
          {data: 'title',title: '任务名称',orderable: true},
          {data: 'leader_grade', title: '最低岗位级别', orderable: true},
          {data: 'base_vc',title: 'VC<!--</br>(单位:VC)-->',orderable: true},
          {data: 'gold', title: '金币<!--</br>(单位:人民币)-->', orderable: true},
          {data: 'exp', title: '经验值<!--</br>/验收人-->', orderable: true},
          {data: 'subtype2', title: '任务类型', orderable: true},
          {data: 'level', title: '任务等级', orderable: true},
          {data: 'status2',title: '任务状态',orderable: true},
          {data: 'created.name', title: '发布人', orderable: true},
          {data: 'leader2', title: '领&nbsp;&nbsp;队', orderable: true},
          {data: 'published_at', title: '发布日期', orderable: true},
          {data: 'deadline', title: '要求完成日期', orderable: true}
        ]
      });
      $("#accountTable1_filter").addClass('dis_n');
      $(window).resize(function () {          //当浏览器大小变化时
        $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
      });
      $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
      $('#accountTable1 tr').click(function () {
        window.parent.playClickEffect();
        let checkId = $(this).find('.id').data('id');
        let checkSubtype = parseInt($(this).find('.id').data('subtype'));
        let status = parseInt($(this).find('.id').data('status'));
        let type = parseInt($(this).find('.id').data('type'));
        if (checkSubtype === 0) {
          //window.location.href = `strategyTaskDetail.html?taskId=${checkId}`;
          window.parent.reloadWeb(`app/h/strategyTaskDetail.html?taskId=${checkId}&faction_id=${faction_id}&skipCocos=true`, false, false, 1465, 820);
        }else if(type===1 && (status===2||status===1||status===3)){
          window.parent.reloadWeb(`app/h/waitCheckTask.html?taskId=${checkId}&faction_id=${faction_id}&skipCocos=true`, false, false, 1465, 820);
          //window.location.href = `waitCheckTask.html?taskId=${checkId}&faction_id=${faction_id}`;
        }else if (type === 1 && status === 4) {
          window.parent.reloadWeb(`app/h/tempTaskDetail.html?taskId=${checkId}&faction_id=${faction_id}&skipCocos=true`, false, false, 1465, 820);
          //window.location.href = `tempTaskDetail.html?taskId=${checkId}&faction_id=${faction_id}`;
        } else if (type === 1 && (status === 5||status===10)) {
          window.parent.reloadWeb(`app/h/tempContinueTask.html?taskId=${checkId}&faction_id=${faction_id}&skipCocos=true`, false, false, 1465, 820);
          //window.location.href = `tempContinueTask.html?taskId=${checkId}&faction_id=${faction_id}`;
        } else if (type === 1 && (status === 6||status === 8||status === 9)) {
          window.parent.reloadWeb(`app/h/willReceipt.html?taskId=${checkId}&faction_id=${faction_id}&skipCocos=true`, false, false, 1465, 820);
          //window.location.href = `willReceipt.html?taskId=${checkId}&faction_id=${faction_id}`;
        }else if(type === 1 && status === 11){
          window.parent.reloadWeb(`app/h/tempAwardTask.html?taskId=${checkId}&faction_id=${faction_id}&skipCocos=true`, false, false, 1465, 820);
          //window.location.href = `tempAwardTask.html?taskId=${checkId}&faction_id=${faction_id}`;
        }else if(type === 1 && status === 12){
          window.parent.reloadWeb(`app/h/tempCompleteTask.html?taskId=${checkId}&faction_id=${faction_id}&skipCocos=true`, false, false, 1465, 820);
          //window.location.href = `tempCompleteTask.html?taskId=${checkId}&faction_id=${faction_id}`;
        }else if(type === 1 && status === 13){
          window.parent.reloadWeb(`app/h/tempCloseTask.html?taskId=${checkId}&faction_id=${faction_id}&skipCocos=true`, false, false, 1465, 820);
          //window.location.href = `tempCloseTask.html?taskId=${checkId}&faction_id=${faction_id}`;
        }else if(type === 1 && status === 14){
          window.parent.reloadWeb(`app/h/tempFailTask.html?taskId=${checkId}&faction_id=${faction_id}&skipCocos=true`, false, false, 1465, 820);
          //window.location.href = `tempFailTask.html?taskId=${checkId}&faction_id=${faction_id}`;
        }
        window.sessionStorage.setItem('fromPage', 'faction')
      })
    })
  }
  /*点击单选选择过滤器*/
  $(document).on("click", '.pitch', function () {
    window.parent.playClickEffect();
    if ($(this).hasClass("activeImg")) {
      $(this).attr("src", "../i/pitch2.png").removeClass("activeImg").addClass('his_active');
      $(this).parent().siblings('b').find('.pitch').attr("src", "../i/pitch.png").addClass("activeImg").removeClass('his_active');
    } else {
      let value=$(this).val();
      let arr=[];
      $('.pitch.his_active').each((index,item)=>{
        arr.push(parseInt($(item).data('colums')));
      });
      $('#accountTable1').DataTable().columns(arr).search(value, true, true).draw();
      $(this).attr("src", "../i/pitch.png").addClass("activeImg").removeClass('his_active');
      if($(this).attr("src", "../i/pitch2.png")){
        $(this).attr("src", "../i/pitch.png").addClass("activeImg").removeClass('his_active');
      }else{
        $(this).parent().siblings('b').find('.pitch').attr("src", "../i/pitch2.png").removeClass("activeImg").addClass('his_active');
      }
    }
    $(document).on('keyup','#accountTable1_filter label input',function () {
      let value=$(this).val();
      let arr=[];
      $('.pitch.his_active').each((index,item)=>{
        arr.push(parseInt($(item).data('colums')));
      });
      $('#accountTable1').DataTable().columns(arr).search(value, true, true).draw();
    });
  });
  $(document).on('click','table.table2 th',function(){
    window.parent.playClickEffect();
  });
  $(document).on('click','input[type=search]',function(){
    window.parent.playClickEffect();
  });
  $(document).on('click','.filterIcon',function(){
    if($(".filterIcon").hasClass('filterIconDown')){
      $(this).addClass('filterIconUp').removeClass('filterIconDown');
      $(".foldLeft").removeClass('dis_n');
      $(".filterFold").css('height','7.7%');
      $("#accountTable1_filter").removeClass('dis_n');
    }else{
      $(this).removeClass('filterIconUp').addClass('filterIconDown');
      $(".foldLeft").addClass('dis_n');
      $(".filterFold").css('height','2%');
      $("#accountTable1_filter").addClass('dis_n');
    }
  });
  getTasks();
  $(document).on('keyup','#accountTable1_filter label input',function () {
    let value=$(this).val();
    let arr=[];
    $('.pitch.his_active').each((index,item)=>{
      arr.push(parseInt($(item).data('colums')));
    });
    $('#accountTable1').DataTable().columns(arr).search(value, true, true).draw();
  });
  $('.fbtask').click(()=>{
    window.parent.playClickEffect();
    window.sessionStorage.setItem('fromPage','faction');
    window.sessionStorage.setItem('faction_id',faction_id);
    //window.parent.closeWebPop();
    //window.location.href = `tempTaskAdd.html?taskId=${checkId}&faction_id=${faction_id}`;
    window.parent.reloadWeb(`app/h/tempTaskAdd.html?fromPage=taskList&faction_id=${faction_id}&skipCocos=true`, false, false, 1465, 820);
    //window.location.href = `tempTaskAdd.html?fromPage=taskList&faction_id=${faction_id}`;
  });
  function dateChange(date) {
    let newDate = date?(new Date(date)):new Date();
    return `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`;
  }
});
