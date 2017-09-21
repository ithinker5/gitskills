const service = new SERVICE();
let nav=[];
//点击进入联盟管理
$(document).on('click', '#departFaction', function () {
  window.parent.playClickEffect();
  if($("input").hasClass('hintBox')){
    confirmAgain({
      title:'提示',
      content:{
          text:'请您将内容编辑完毕再跳转页面！'
      },
      btns:[
        {domId:'cancelAnswer',text:'知道啦'},
      ]
    });
  }else{
    window.location.href = 'departFaction.html';
  }
});
//点击进入帮会管理
$(document).on('click', '#personal', function () {
  window.parent.playClickEffect();
  if($("input").hasClass('hintBox')){
    confirmAgain({
      title:'提示',
      content:{
        text:'请您将内容编辑完毕再跳转页面！'
      },
      btns:[
        {domId:'cancelAnswer',text:'知道啦'},
      ]
    });
  }else{
    window.location.href = `personal.html`
  }
});
//点击进入堂管理
$(document).on('click', '#task', function () {
  window.parent.playClickEffect();
  if($("input").hasClass('hintBox')){
    confirmAgain({
      title:'提示',
      content:{
        text:'请您将内容编辑完毕再跳转页面！'
      },
      btns:[
        {domId:'cancelAnswer',text:'知道啦'},
      ]
    });
  }else{
    window.location.href = `task.html`
  }
});
function navList() {
  nav=[
    {domId:'departFaction',name:'帮会管理'},
    {domId:'personal',name:'个&nbsp;&nbsp;人'},
    {domId:'task',name:'任&nbsp;&nbsp;务'}
  ];
}