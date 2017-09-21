$(function () {
  navList();
  getFactionList();
  let currentFactionId=faction_id||'';
  $(document).on('click','#backList',function () {
    window.parent.playClickEffect();
    getFactionList()
  });
  //点击进入添加
  $(document).on('click','#add',function () {
    window.parent.playClickEffect();
    service.getDepartList((res) => {
      let data={
        addPage:true,
        departVc:res[0].vc,
        departGold:res[0].gold
      };
      $('#contentContainer').html(template('content', data));
      $('#footerContainer').html(template('footer', data));
      chartLimit($('#descAdd'),70);
    });
  });
  //点击进入详情
  $(document).on('click','#manager',function () {
    window.parent.playClickEffect();
    currentFactionId=parseInt($(this).data('id'));
    getInfoById(currentFactionId,'detail')
  });
  //取消编辑进入详情页
  $(document).on('click','#cancelEdit',function () {
    window.parent.playClickEffect();
    getInfoById(currentFactionId,'detail')
  });
  //取消添加进入列表页
  $(document).on('click','#cancelAdd',function () {
    window.parent.playClickEffect();
    getFactionList();
  });
  //确定添加帮会
  $(document).on('click','#confirmAdd',function () {
    window.parent.playClickEffect();
    let name=$('#nameAdd');
    let vc=$('#vcAdd');
    let gold=$('#goldAdd');
    let desc=$('#descAdd');
    let org=$('#org');
    errorTip(name,vc,gold,desc,org);
    if(name.val()&&desc.val()&&vc.val()&&gold.val()&&org.val()){
      let $footerMsg=$('#footerError');
      if(!isInt(vc.val())){
        vc.addClass('error');
        $footerMsg.text('帮会VC必须是大于等于0的整数！');
        animate($footerMsg);
        return false
      }else{
        let departVc=parseInt($('#departVc').data('vc'));
        if(parseInt(vc.val())>departVc){
          vc.addClass('error');
          $footerMsg.text(`联盟VC剩余${departVc}，请重新输入！`);
          animate($footerMsg);
          return false
        }
      }
      if(!isInt(gold.val())){
        gold.addClass('error');
        $footerMsg.text('帮会金币必须是大于等于0的整数！');
        animate($footerMsg);
        return false
      }else{
        let departGold=parseInt($('#departGold').data('gold'));
        if(parseInt(gold.val())>departGold){
          gold.addClass('error');
          $footerMsg.text(`联盟金币剩余${departGold}，请重新输入！`);
          animate($footerMsg);
          return false
        }
      }
      confirmAgain({
        title:'提示',
        content:{
          text:'您确认要创建新帮会吗？'
        },
        btns:[
          {domId:'cancel',text:'取消'},
          {domId:'confirm',text:'确定',event:add},
        ]
      });
    }else{
      return false
    }
  });
  $(document).on('click','#edit',function () {
    window.parent.playClickEffect();
    getInfoById(currentFactionId,'edit')
  });
  //解散帮会
  $(document).on('click','#deleteFaction',function () {
    window.parent.playClickEffect();
    confirmAgain({
      title:'提示',
      content:{
        text:'您确认要解散此帮会吗？'
      },
      btns:[
        {domId:'cancel',text:'取消'},
        {domId:'confirm',text:'确定',event:deleteFaction},
      ]
    });
    function deleteFaction() {
      service.deleteFaction(currentFactionId,res=>{
        getFactionList();
      })
    }
  });
  //确定提交编辑
  $(document).on('click','#confirmEdit',function () {
    window.parent.playClickEffect();
    let name=$('#name');
    let desc=$('#desc');
    let org=$('#orgEdit');
    errorTip(name,desc,org);
    if(name.val()&&desc.val()&&org.val()){
      confirmAgain({
        title:'重新发布',
        content:{
          text:'您确认要修改此帮会信息吗？'
        },
        btns:[
          {domId:'cancel',text:'取消'},
          {domId:'confirm',text:'确定',event:edit},
        ]
      });
    }
  });
  function getInfoById(currentFactionId,page) {
    service.getFactionById(currentFactionId,res=>{
      let data={
        factionObj:res
      };
      if(page==='detail'){
        data.detailPage=true;
        data.faction=faction_id||faction_id===0;
      }else if(page==='edit'){
        data.editPage=true
      }
      $('#contentContainer').html(template('content', data));
      $('#footerContainer').html(template('footer', data));
      chartLimit($('#desc'),70);
    })
  }
  function edit() {
    let name=$('#name');
    let desc=$('#desc');
    let org=$('#orgEdit');
    service.editFaction(currentFactionId,{name:name.val(),desc:desc.val(),org_info:org.val()},function () {
      getInfoById(currentFactionId,'detail')
    })
  }
  function add() {
    service.addFaction({
      name:$('#nameAdd').val(),
      vc:$('#vcAdd').val(),
      gold:$('#goldAdd').val(),
      desc:$('#descAdd').val(),
      org_info:$('#org').val()
    },res=>{
      currentFactionId=res._id;
      getInfoById(res._id,'detail')
    })
  }
});