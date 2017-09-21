$(function () {
  let service=new SERVICE();
  chartLimit($('#content'),250);
  $(".btnBack").click(function(){
    window.parent.playClickEffect();
    window.history.go(-1);
  });
  //添加
  $('#submit').click(function(){
    window.parent.playClickEffect();
    let name=$("#name");
    let content=$("#content");
    errorTip(name,content);
    if(name.val()&&content.val()){
      confirmAgain({
        title:'提交问题',
        content:{
          text:'您确认要提交此问题吗？'
        },
        btns:[
          {domId:'cancel',text:'取消'},
          {domId:'confirm',text:'确定',event:add},
        ]
      });
    }
  });
  function add() {
    let question={
      title:$('#name').val(),
      question:$('#content').val()
    };
    service.getCompleteTask(3,res => {});
    service.addQuestion(question,(res)=>{
      window.location.href = `questionDetail.html?questionId=${res._id}`;
    })
  }
});