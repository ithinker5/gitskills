$(function(){
  const service = new SERVICE();
  let badListObj={user_ids:[],start_time:'',end_time:'',reason:''};
  let savebadListObj=window.sessionStorage.getItem('badListObj');
  let selectId =window.sessionStorage.getItem('selectId');
  $(".addLeader").click(function(){
    window.parent.playClickEffect();
    let temp = getObj();
    window.sessionStorage.setItem('badListObj', JSON.stringify(temp));
    window.location.href='addLeader.html';
  });
  $(".btnBack").click(function(){
    window.parent.playClickEffect();
    window.sessionStorage.removeItem('badListObj');
    window.location.href='badList.html';
  });
  if (selectId || parseInt(selectId) === 0) {
    $('.addName').text(`${window.sessionStorage.getItem('selectLeaderName')}`);
    $('.addName').attr('value',selectId);
    window.sessionStorage.removeItem('selectId');
    window.sessionStorage.removeItem('selectLeaderName');
  }
  function getObj() {
    let deadlineStart=$('#deadlineStart').val();
    let desc=$('.allianceIntro').val();
    let deadlineEnd=$('#deadlineEnd').val();
    //let addName=$('.addName').text();
    if (deadlineStart) { badListObj.start_time = deadlineStart; }
    if (desc) { badListObj.reason = desc; }
    if (deadlineEnd ) { badListObj.end_time = deadlineEnd; }
    //if (addName ) { badListObj.end_time = addName; }
    return badListObj;
  }
  if(savebadListObj){
    init(JSON.parse(savebadListObj));
  }
  function init(obj) {
    if (obj) {
      $('.allianceIntro').attr('value', obj.reason || '');
      if (obj.start_time) {
        document.getElementById('deadlineStart').valueAsDate = new Date(obj.start_time);
      }
      if (obj.end_time) {
        document.getElementById('deadlineEnd').valueAsDate = new Date(obj.end_time);
      }
      window.sessionStorage.removeItem('badListObj')
    }
  }




  $("#submit").click(function(){
    window.parent.playClickEffect();
    let deadlineStart=$('#deadlineStart');
    let desc=$('.allianceIntro');
    let deadlineEnd=$('#deadlineEnd');
    let addName=$('.addName');
    let addLeader=$('.addLeader');
    if(addName.val()!=''){
      errorTip(deadlineStart,desc,deadlineEnd);
    }else{
      errorTip(deadlineStart,desc,deadlineEnd,addLeader);
    }
    if(deadlineStart.val()&&desc.val()&&deadlineEnd.val()&&addName.val()){
      badListObj.user_ids.push(selectId);
      if(parseInt(new Date($('#deadlineStart').val()).getTime())>=parseInt(new Date($('#deadlineEnd').val()).getTime())){
        $('#footerError').text('开始日期必须小于结束日期！');
        animate($('#footerError'));
        return false;
      }
      service.getTime(res=>{
        if(parseInt(res.now)<=parseInt(new Date($('#deadlineStart').val()).getTime())){
          badListObj.start_time=parseInt(new Date($('#deadlineStart').val()).getTime());
          badListObj.end_time=parseInt(new Date($('#deadlineEnd').val()).getTime());
          badListObj.reason=$(".allianceIntro").val();
          confirmAgain({
            title:'添加黑名单',
            content:{
              text:'您确认要将此人添加黑名单吗？'
            },
            btns:[
              {domId:'cancelAnswer',text:'取消'},
              {domId:'confirm',text:'确定',event:confirm},
            ]
          });
        }else{
          $('#footerError').text('开始日期必须大于当前时间！');
          animate($('#footerError'));
          return false;
        }
      });
    }
  });
  function confirm(){
    service.getAddBlackList(badListObj,res => {
      if(res.status==400){
        confirmAgain({
          title:'提示',
          content:{
            text:res.msg,
          },
          btns:[
            {domId:'confirm',text:'确定'},
          ]
        });
      }else{
        window.location.href='badList.html';
      }
    })
  }
});
