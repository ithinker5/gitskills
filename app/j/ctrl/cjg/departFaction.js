$(function () {
  let service = new SERVICE();
  let factionId=window.sessionStorage.getItem('faction_id');
  let factionObj={vc:'',gold:''};
  let departmentId=window.sessionStorage.getItem('department_id');
  let departmentObj={vc_total:'',gold_total:''};
  let departTotalVc=0;
  let departVc=0;
  let departTotalGold=0;
  let departGold=0;
  let currentFactionVC=0;//标记选中的帮会的未修改的vc值
  let currentFactionGold=0;//标记选中的帮会的未修改的gold值
  function getAllianceList() {
    service.getAllianceList(window.sessionStorage.getItem('department_id'), (res)=> {
      let html='';
      html+=`<p><b><i>联盟总VC：</i><input contenteditable="true" class="changeValue2 inputNoBorder department_vc input-text" value=${res.vc_total} data-id="" type="text" readonly="readonly" /></b>`
        +`<b class="boss"><em>联盟总金币：</em><input contenteditable="true" class="changeValue2 inputNoBorder department_gold input-text" value=${res.gold_total} data-id="" type="text" readonly="readonly" /></b>`
        +`<b><input class="btn-manager btn-small btnRightA" value="修改" type="button" data-id=${res._id} /></b>`
        +`</p>`
        +`<div><p class="divCenter">联盟</p></div>`
        +`<p><i>联盟名称：</i><span class="factionName">${res.name}</span><b class="boss"><em>盟&nbsp;&nbsp;主：</em><span class="factionBoss">${res.master.name}</span></b></p>`
        +`<p><b><i>联盟VC：</i><input contenteditable="true" class="changeValue2 inputNoBorder department_vc input-text" value=${res.vc} data-id="" type="text" readonly="readonly" /></b>`
        +`<b class="boss"><em>金币：</em><input contenteditable="true" class="changeValue2 inputNoBorder department_gold input-text" value=${res.gold} data-id=${res._id} type="text" readonly="readonly" /></b>`
        +`</p>`;
      $(".contentBg1").append(html);
      departTotalVc=res.vc_total;
      departVc=res.vc;
      departTotalGold=res.gold_total;
      departGold=res.gold;
    })
  }
  function getFactionList() {
    service.getFactionList(function (res) {
      let html='';
      for(let i=0;i<res.length;i++){
        html+=`<div><p class="divCenter">帮会${i+1}</p></div>`;
            if(res[i].chief==null){
              html+=`<p><i>帮会名称：</i><span class="factionName">${res[i].name}</span><b class="boss"><em>帮&nbsp;&nbsp;主：</em><span class="factionBoss">无</span></b></p>`;
            }else{
              html+=`<p><i>帮会名称：</i><span class="factionName">${res[i].name}</span><b class="boss"><em>帮&nbsp;&nbsp;主：</em><span class="factionBoss">${res[i].chief.name}</span></b></p>`;
            }
            html+=`<p><b><i>帮会VC：</i><input contenteditable="true" class="changeValue2 inputNoBorder faction_vc input-text" value=${res[i].vc} data-id="" type="text" readonly="readonly" /></b>`
            +`<b class="boss"><em>金币：</em><input contenteditable="true" class="changeValue2 inputNoBorder faction_gold input-text" value=${res[i].gold} data-id="" type="text" readonly="readonly" /></b>`
            +`<b><input class="btn-manager btn-small btnRight" value="修改" type="button" data-id=${res[i]._id} /></b>`
            +`</p>`
      }
      $(".contentBg2").append(html);
    })
  }
  getAllianceList();
  getFactionList();
  /*切换按钮*/
    $(document).on('click','.btnRightA',function () {
      if($("input").hasClass('hintBox')){
        $("input.btn-manager").removeAttr('disabled','disabled');
      }else{
        $("input.btn-manager").attr('disabled','disabled');
        $(this).parent('b').siblings().find('.department_vc').removeClass('inputNoBorder').addClass('hintBox').removeAttr('readonly');
        $(this).parent('b').siblings().find('.department_gold').removeClass('inputNoBorder').addClass('hintBox').removeAttr('readonly');
        departmentId=$(this).data('id');
        $(this).parent('b').html('<input class="btn-manager btn-small" id="cancelA" value="取消" type="button" />&nbsp;&nbsp;<input class="btn-manager btn-small" id="confirmChangeA" style="left: 90%;" value="确定" type="button" />')
      }
    });
    //修改帮会配置数据
    $(document).on('click','.btnRight',function () {
      if($("input").hasClass('hintBox')){
        $("input.btn-manager").removeAttr('disabled','disabled');
      }else{
        $("input.btn-manager").attr('disabled','disabled');
        $(this).parent('b').siblings().find('.faction_vc').removeClass('inputNoBorder').addClass('hintBox').removeAttr('readonly');
        $(this).parent('b').siblings().find('.faction_gold').removeClass('inputNoBorder').addClass('hintBox').removeAttr('readonly');
        factionId=$(this).data('id');
        currentFactionVC=parseInt($(this).parent('b').siblings().find('.faction_vc').val());
        currentFactionGold=parseInt($(this).parent('b').siblings().find('.faction_gold').val());
        $(this).parent('b').html('<input class="btn-manager btn-small" id="cancelD" value="取消" type="button" />&nbsp;&nbsp;<input class="btn-manager btn-small" id="confirmChangeD" style="left: 90%;" value="确定" type="button" />')
      }
    });
    //取消修改帮会数据
  $(document).on('click','#cancelD',function () {
    $("input.btn-manager").removeAttr('disabled','disabled');
    $(this).parent('b').siblings().find('.faction_gold').removeClass('error');
    $(this).parent('b').siblings().find('.faction_vc').removeClass('error');
    $(this).parent('b').siblings().find('.faction_gold').val($(this).parent('b').siblings().find('.faction_gold').attr('value'));
    $(this).parent('b').siblings().find('.faction_vc').val($(this).parent('b').siblings().find('.faction_vc').attr('value'));
    $(this).parent('b').siblings().find('.faction_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
    $(this).parent('b').siblings().find('.faction_gold').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
    $(this).parent('b').html(`<input data-id=${factionId} class="btn-manager btn-small btnRight" value="修改" type="button" />`)
  });
  $(document).on('click','#cancelA',function () {
    $("input.btn-manager").removeAttr('disabled','disabled');
    $(this).parent('b').siblings().find('.department_gold').removeClass('error');
    $(this).parent('b').siblings().find('.department_vc').removeClass('error');
    $(this).parent('b').siblings().find('.department_gold').val($(this).parent('b').siblings().find('.department_gold').attr('value'));
    $(this).parent('b').siblings().find('.department_vc').val($(this).parent('b').siblings().find('.department_vc').attr('value'));
    $(this).parent('b').siblings().find('.department_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
    $(this).parent('b').siblings().find('.department_gold').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
    $(this).parent('b').html('<input class="btn-manager btn-small btnRightA" value="修改" type="button" />')
  });
  //确认修改帮会信息
  $(document).on('click','#confirmChangeD',function () {
    let number1=$(this).parent('b').siblings().find('.faction_vc');
    let number2=$(this).parent('b').siblings().find('.faction_gold');
    errorTip(number1,number2);
    let $footerMsg=$('#footerError');
      $footerMsg.text('输入值必须是大于等于0的整数！');
    if(number1.val()||number2.val()){
      if(!isInt(number1.val())){
        number1.addClass('error');
        animate($footerMsg);
        return false
      }
      if(!isInt(number2.val())){
        number2.addClass('error');
        animate($footerMsg);
        return false
      }
      if((parseInt(number1.val())-currentFactionVC)>departVc){
        number1.addClass('error');
        $footerMsg.text('联盟VC不足,请重新输入！');
        animate($footerMsg);
        return false
      }
      if((parseInt(number2.val())-currentFactionGold)>departGold){
        number2.addClass('error');
        $footerMsg.text('联盟金币不足,请重新输入！');
        animate($footerMsg);
        return false
      }
      factionObj.vc=$(this).parent('b').siblings().find('.faction_vc').val();
      factionObj.gold=$(this).parent('b').siblings().find('.faction_gold').val();
      $("input.btn-manager").removeAttr('disabled','disabled');
      $(this).parent('b').siblings().find('.faction_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
      $(this).parent('b').siblings().find('.faction_gold').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
      $(this).parent('b').html(`<input data-id=${factionId} class="btn-manager btn-small btnRight" value="修改" type="button" />`);
      confirmAgain({
        title:'修改',
        content:{
          text:'您确认要修改金币或VC值吗？'
        },
        btns:[
          {domId:'cancelAnswer',text:'取消'},
          {domId:'confirm',text:'确定',event:changeMember},
        ]
      });
      function changeMember(){
        service.changeFactionList(factionId,factionObj, ()=>{
          location.reload();
        })
      }
    }
  });
  //联盟总确定修改
  $(document).on('click','#confirmChangeA',function () {
    //departmentObj.vc_total=$(this).parent('b').siblings().find('.department_vc').val();
    let number1=$(this).parent('b').siblings().find('.department_vc');//用户输入的联盟vc
    let number2=$(this).parent('b').siblings().find('.department_gold');//用户输入的联盟gold
    errorTip(number1,number2);
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
        if(parseInt(departTotalVc)-parseInt($(this).parent('b').siblings().find('.department_vc').val())>0||parseInt(departTotalGold)-parseInt($(this).parent('b').siblings().find('.department_gold').val())>0){
          if(parseInt(departVc)-(parseInt(departTotalVc)-parseInt($(this).parent('b').siblings().find('.department_vc').val()))<0){
            number1.addClass('error');
            $footerMsg.text('联盟VC将更改为负值，请重新输入！');
            animate($footerMsg);
          }else if(parseInt(departGold)-(parseInt(departTotalGold)-parseInt($(this).parent('b').siblings().find('.department_gold').val()))<0){
            number2.addClass('error');
            $footerMsg.text('联盟金币将更改为负值，请重新输入！');
            animate($footerMsg);
          }else{
            departmentObj.vc_total=$(this).parent('b').siblings().find('.department_vc').val();
            departmentObj.gold_total=$(this).parent('b').siblings().find('.department_gold').val();
            $("input.btn-manager").removeAttr('disabled','disabled');
            $(this).parent('b').siblings().find('.department_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
            $(this).parent('b').siblings().find('.department_gold').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
            $(this).parent('b').html('<input class="btn-manager btn-small btnRightA" value="修改" type="button" />');
            confirmAgain({
              title:'修改',
              content:{
                text:'您确认要修改金币或VC值吗？'
              },
              btns:[
                {domId:'cancelAnswer',text:'取消'},
                {domId:'confirm',text:'确定',event:changeMemberA},
              ]
            });
            function changeMemberA(){
              service.changeAllianceList(departmentId,departmentObj, ()=>{
                location.reload();
              })
            }
          }
        }else{
          departmentObj.vc_total=$(this).parent('b').siblings().find('.department_vc').val();
          departmentObj.gold_total=$(this).parent('b').siblings().find('.department_gold').val();
          $("input.btn-manager").removeAttr('disabled','disabled');
          $(this).parent('b').siblings().find('.department_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
          $(this).parent('b').siblings().find('.department_gold').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
          $(this).parent('b').html('<input class="btn-manager btn-small btnRightA" value="修改" type="button" />');
          confirmAgain({
            title:'修改',
            content:{
              text:'您确认要修改金币或VC值吗？'
            },
            btns:[
              {domId:'cancelAnswer',text:'取消'},
              {domId:'confirm',text:'确定',event:changeMemberA},
            ]
          });
          function changeMemberA(){
            service.changeAllianceList(departmentId,departmentObj, ()=>{
              location.reload();
            })
          }
        }
      }
    }
  });
  $(document).on('click','#cancelAnswer',function () {
    window.location.reload();
  });
  $(document).on('click','.margin4R',function(){
    window.parent.playClickEffect();
    confirmAgain({
      title:'一键清零',
      content:{
        text:'您确认要清零联盟及帮会的数值吗？'
      },
      btns:[
        {domId:'cancelAnswer',text:'取消'},
        {domId:'confirm',text:'确定',event:clearAllNum},
      ]
    });
    function clearAllNum(){
      service.getFactionClearing( ()=>{
        location.reload();
      })
      /*service.getDepartClearing( ()=>{

      });*/
    }
  });

  /*跳转页面*/
  $(document).on('click', '#personal', function () {
    window.parent.playClickEffect();
    window.location.href = `personal.html`
  });
  $(document).on('click', '#task', function () {
    window.parent.playClickEffect();
    window.location.href = `task.html`
  });
});
