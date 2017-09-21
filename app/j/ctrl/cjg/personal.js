$(function(){
  let service = new SERVICE();
  let userId='';
  let changeVc={base_vc:'',gold:''};
  let PropertiesObj={name:'',desc:'',value:''};
  /*个人默认值*/
  $(document).on('click','.btnRight',function () {
    if($("input").hasClass('hintBox')){
      $("input.btn-manager").removeAttr('disabled','disabled');
    }else{
      $("input.btn-manager").attr('disabled','disabled');
      $(this).parent('b').siblings().find('.base_limit').removeClass('inputNoBorder').addClass('hintBox').removeAttr('readonly');
      $(this).parent('b').html('<input class="btn-manager btn-small" id="cancelD" value="取消" type="button" />&nbsp;&nbsp;<input class="btn-manager btn-small" id="confirmChangeD" style="left: 90%;" value="确定" type="button" />')
    }
  });
  $(document).on('click','#cancelD',function () {
    $("input.btn-manager").removeAttr('disabled','disabled');
    $(this).parent('b').siblings().find('.base_limit').removeClass('error');
    $(this).parent('b').siblings().find('.base_limit').val($(this).parent('b').siblings().find('.base_limit').attr('value'));
    $(this).parent('b').siblings().find('.base_limit').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
    $(this).parent('b').html('<input class="btn-manager btn-small btnRight" value="修改" type="button" />')
  });
  getProperties();
  function getProperties(){
    service.getProperties((res)=>{
      for(let i=0;i<res.length;i++){
        if(res[i].name==='personal_vc'){
          $(".base_limit3").val(parseInt(res[i].value));//20
          $(".base_limit3").attr('value',parseInt(res[i].value));//20
        }else if(res[i].name==='section_vc'){
          $(".base_limit2").val(parseInt(res[i].value));//40
          $(".base_limit2").attr('value',parseInt(res[i].value));//20
        }else if(res[i].name==='faction_vc'){
          $(".base_limit1").val(parseInt(res[i].value));//60
          $(".base_limit1").attr('value',parseInt(res[i].value));//20
        }
      }
    })
  };
  //let PropertiesObj={personal_vc:'',desc:'',value:''};
  $(document).on('click','#confirmChangeD',function () {
    let number1=$(this).parent('b').siblings().find('.base_limit');
    errorTip(number1);
    let $footerMsg=$('#footerError');
    if(number1.val()){
      if(!isInt(number1.val())){
        number1.addClass('error');
        animate($footerMsg);
        return false
      }else{
        PropertiesObj.value=$(this).parent('b').siblings().find('.base_limit').val();
        PropertiesObj.desc=$(this).parent('b').siblings().find('.base_limit').data('desc');
        PropertiesObj.name=$(this).parent('b').siblings().find('.base_limit').data('name');
        $("input.btn-manager").removeAttr('disabled','disabled');
        $(this).parent('b').siblings().find('.base_limit').addClass('inputNoBorder').removeClass('hintBox').attr('readonly','readonly');
        $(this).parent('b').html('<input class="btn-manager btn-small btnRight" value="修改" type="button" />')
        confirmAgain({
          title:'修改',
          content:{
            text:'您确认要修改审核额度吗？'
          },
          btns:[
            {domId:'cancelAnswer2',text:'取消'},
            {domId:'confirm',text:'确定',event:changeProperties},
          ]
        });
        function changeProperties(){
          service.changeProperties(PropertiesObj, ()=>{
            window.location.reload();
          })
        }
      }
    }
  });
  $(document).on('click','#cancelAnswer2',function () {
    window.location.reload();
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
  $(document).on('click', '#memberNum', function () {
    window.parent.playClickEffect();
    window.location.href = `personalMember.html`
  });
});
