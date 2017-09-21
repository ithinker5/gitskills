$(function(){
  let service = new SERVICE();
  let userId='';
  let changeVc={base_vc:'',gold:''};
  let departVc=0;
  //let taskVc=0;
  let baseVc=0;
  //获取领队列表
  function getLeaders() {
    service.getMemberList(function (res) {
      for (var i = 0, len = res.length; i < len; i++) {
        res[i].num =  i+1 ;
        res[i].task_vc2=res[i].task_vc-res[i].base_vc;
        res[i].work_num = '<span class="serialWidth">' + res[i].worker_number + '</span>';
        res[i].title=res[i].title||'无';
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
        res[i].btn = '<input class="btn-manager btn-small" id="btnChange" value="修改" data-id=' + res[i]._id + ' type="button" />';
        //res[i].task_vc='<input contenteditable="true" class="changeValue inputNoBorder input-text" id="task_vc" data-value='+res[i].task_vc+' value='+res[i].task_vc+' data-id='+res[i]._id+' type="text" readonly="readonly" />';
        res[i].base_vc='<input contenteditable="true" class="changeValue inputNoBorder input-text" id="base_vc" data-value='+res[i].base_vc+' value='+res[i].base_vc+' data-id='+res[i]._id+' type="text" readonly="readonly" /><span class="dis_n">'+res[i].base_vc+'</span>';
        res[i].gold='<input contenteditable="true" class="changeValue inputNoBorder input-text" id="gold" data-value='+res[i].gold+' value='+res[i].gold+' type="text" readonly="readonly" /><span class="dis_n">'+res[i].gold+'</span>';
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
        columns: [
          { data: 'num', title: '序号', orderable: true },
          { data: 'work_num', title: '工号', orderable: true },
          { data: 'name', title: '姓名', orderable: true },
          { data: 'factions2', title: '所属帮会', orderable: true },
          { data: 'role_id2', title: '职务', orderable: true },
          { data: 'base_vc', title: '基础VC', orderable: true },
          { data: 'task_vc2', title: '任务VC', orderable: true },
          { data: 'gold', title: '金币', orderable: true },
          { data: 'btn', title: '', orderable: false },
        ]
      });
      $(window).resize(function () {          //当浏览器大小变化时
        $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
      });
      $(".dataTables_scrollBody").css("height",(parseInt($(".dataTables_scroll").height())-parseInt($(".dataTables_scrollHead").height()))+'px');
    });
  }
  getLeaders();
  /*获取联盟VC*/
  service.getAllianceList(window.sessionStorage.getItem('department_id'), (res)=> {
    departVc=res.vc;
  });
  /*个人等级*/
  $(document).on('click','#btnChange',function () {
    if($("input").hasClass('hintBox')){
      $("input.btn-manager").removeAttr('disabled','disabled');
    }else{
      //taskVc=$(this).parent('td').siblings().find('#task_vc').val();
      baseVc=$(this).parent('td').siblings().find('#base_vc').val();
      $("input.btn-manager").attr('disabled','disabled');
      $(this).parent('td').siblings().find('#gold').removeClass('inputNoBorder').addClass('hintBox').removeAttr('readonly');
      //$(this).parent('td').siblings().find('#task_vc').removeClass('inputNoBorder').addClass('hintBox').removeAttr('readonly');
      $(this).parent('td').siblings().find('#base_vc').removeClass('inputNoBorder').addClass('hintBox').removeAttr('readonly');
      userId=$(this).parent('td').siblings().find('#base_vc').data('id');
      $(this).parent('td').html('<input class="btn-manager btn-small" id="cancel" value="取消" type="button" />&nbsp;&nbsp;<input class="btn-manager btn-small" id="confirmChange" value="确定" type="button" />')
    }
  });
  $(document).on('click','table th',function(){
    window.parent.playClickEffect();
  });
  $(document).on('click','#cancel',function () {
    $("input.btn-manager").removeAttr('disabled','disabled');
    $(this).parent('td').siblings().find('#gold').removeClass('error');
   // $(this).parent('td').siblings().find('#task_vc').removeClass('error');
    $(this).parent('td').siblings().find('#base_vc').removeClass('error');
    $(this).parent('td').siblings().find('#gold').val($(this).parent('td').siblings().find('#gold').data('value'));
    //$(this).parent('td').siblings().find('#task_vc').val($(this).parent('td').siblings().find('#task_vc').data('value'));
    $(this).parent('td').siblings().find('#base_vc').val($(this).parent('td').siblings().find('#base_vc').data('value'));
    $(this).parent('td').siblings().find('#gold').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
    //$(this).parent('td').siblings().find('#task_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
    $(this).parent('td').siblings().find('#base_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
    $(this).parent('td').html('<input class="btn-manager btn-small" id="btnChange" value="修改" type="button" />')
  });
  /*$('#base_vc').bind('input propertychange', function() {
   changeVc.base_vc=$(this).val();
   });*/
  $(document).on('click','#confirmChange',function () {
    let number1=$(this).parent('td').siblings().find('#base_vc');
    //let number3=$(this).parent('td').siblings().find('#task_vc');
    let number2=$(this).parent('td').siblings().find('#gold');
    errorTip(number1);
    errorTip(number2);
    let $footerMsg=$('#footerError');
    if(number1.val()||number2.val()){
      if(!isInt(number1.val())){
        number1.addClass('error');
        animate($footerMsg);
        return false
      }else if(!isInt(number2.val())){
        number2.addClass('error');
        animate($footerMsg);
        return false
      }else{
        changeVc.base_vc=$(this).parent('td').siblings().find('#base_vc').val();
        changeVc.gold=$(this).parent('td').siblings().find('#gold').val();
        if((parseInt(departVc)+parseInt(baseVc))<(parseInt(changeVc.base_vc))){
          number1.addClass('error');
          $footerMsg.text('联盟VC不足，请重新输入！');
          animate($footerMsg);
        }else{
          $("input.btn-manager").removeAttr('disabled','disabled');
          $(this).parent('td').siblings().find('#gold').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
          //$(this).parent('td').siblings().find('#task_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
          $(this).parent('td').siblings().find('#base_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
          $(this).parent('td').html('<input class="btn-manager btn-small" id="btnChange" value="修改" type="button" />');
          confirmAgain({
            title:'修改',
            content:{
              text:'您确认要修改金币或VC值吗？'
            },
            btns:[
              {domId:'cancelAnswer1',text:'取消'},
              {domId:'confirm',text:'确定',event:changeMember},
            ]
          });
          function changeMember(){
            service.getChangeMember(userId,changeVc, ()=>{
              window.location.reload();
            })
          }
        }
      }
    }
  });
  $(document).on('click','#cancelAnswer1',function(){
    window.location.reload();
  });
  /*一键清零功能*/
  $(document).on('click','.clearZero',function(){
    window.parent.playClickEffect();
    confirmAgain({
      title:'一键清零',
      content:{
        text:'您确认要将所有成员的VC清零吗？'
      },
      btns:[
        {domId:'cancelAnswer',text:'取消'},
        {domId:'confirm',text:'确定',event:clearAll},
      ]
    });
    function clearAll(){
      service.getClearing((res)=>{window.location.reload();});
    }
  });
  /*跳转页面*/
  $(document).on('click', '#departFaction', function () {
    window.parent.playClickEffect();
    window.location.href = 'departFaction.html';
  });
  $(document).on('click', '#task', function () {
    window.parent.playClickEffect();
    window.location.href = `task.html`
  });
  $(document).on('click', '#default', function () {
    window.parent.playClickEffect();
    window.location.href = `personal.html`
  });
  //导入
  $('#file').change(fileChange);
  function fileChange() {
    confirmAgain({
      title:'提示',
      content:{
        text:'正在导入数据，请等待。。。'
      },
      btns:[]
    });
    service.uploadFile('file', res => {
      if(res.error_code&&(parseInt(res.error_code)===100001)){
        console.log('123232');
        confirmAgain({
          title:'提示',
          content:{
            text:res.error_msg
          },
          btns:[
            {domId:'confirm',text:'确定',event:failData}
          ]
        });
        function failData() {
          console.log('123');
          window.location.reload();
          // $(".feehideBox").empty();
          // getLeaders();
        }
      }else{
        // $(".feehideBox").empty();
        window.location.reload();
        // getLeaders();
      }
    },'member');
  }
  // exportFile();
  $(document).on('click','#exportFile',function () {
    confirmAgain({
      title:'提示',
      content:{
        text:'正在导出数据，请等待。。。'
      },
      btns:[]
    });
    exportFile()
  });
  $('#exportFile').attr('href');
  //导出
  function exportFile() {
    service.exportFile(res => {
      window.open(res);
      $(".feehideBox").html('');
    })
  }
});
