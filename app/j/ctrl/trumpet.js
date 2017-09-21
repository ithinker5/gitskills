$(function () {
  let service=new SERVICE();
  chartLimit($('#content'),60);
  $('#close').on('click',function () {
    window.parent.playClickEffect();
    window.parent.closeWebPop()
  });
  //添加
  $('#submit').click(function(){
    window.parent.playClickEffect();
    let content=$("#content");
    errorTip(content);
    if(content.val()){
      confirmAgain({
        title:'发布江湖令',
        content:{
          text:'您确认要发布此江湖令吗？'
        },
        btns:[
          {domId:'cancel',text:'取消'},
          {domId:'confirm',text:'确定',event:add},
        ]
      });
    }
  });
  function add() {
    let meetObj={
      content:$('#content').val()
    };
    service.addMessage(meetObj,()=>{
      window.parent.closeWebPop()
    })
  }
});