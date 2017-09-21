$(function () {
  let service=new SERVICE();
  let user_id=parseInt(window.sessionStorage.getItem('user_id'));
  let role=parseInt(window.sessionStorage.getItem('role_id'));
  let id=getUrlParam('questionId');
  $(document).on('click','.btnBack',function(){
    window.parent.playClickEffect();
    window.location.href = 'questionList.html';
  });
  $(document).on('click','#cancel',function(){
    window.parent.playClickEffect();
    $('#toAnswer').addClass('dis_n');
    $('#answer').val('');
    if(role===4||role===5){
      $('#footer').empty().append(`
    <input id="close" class="btnStyle subBtn" type="button" value="关闭问题"/>
    <input id="edit" class="btnStyle subBtn" type="button" value="回&nbsp;&nbsp;答"/>
    `)
    }else{
      $('#footer').empty().append(`
    <input id="edit" class="btnStyle subBtn" type="button" value="回&nbsp;&nbsp;答"/>
    `)
    }
  });
  $(document).on('click','#edit',function(){
    window.parent.playClickEffect();
    $('#toAnswer').removeClass('dis_n');
    $('#footer').empty().append(`
    <input id="cancel" class="btnStyle subBtn" type="button" value="取&nbsp;&nbsp;消"/>
    <input id="submit" class="btnStyle subBtn" type="button" value="回&nbsp;&nbsp;答"/>
    `)
  });
  $(document).on('click','#submit',function(){
    window.parent.playClickEffect();
    let answer=$("#answer");
    errorTip(answer);
    if(answer.val()){
      confirmAgain({
        title:'提交答案',
        content:{
          text:'您确认要提交答案吗？'
        },
        btns:[
          {domId:'cancelAnswer',text:'取消'},
          {domId:'confirm',text:'确定',event:edit},
        ]
      });
    }
  });
  $(document).on('click','#close',function(){
    window.parent.playClickEffect();
    confirmAgain({
      title:'关闭问题',
      content:{
        text:'您确认要关闭此问题吗？'
      },
      btns:[
        {domId:'cancelAnswer',text:'取消'},
        {domId:'confirm',text:'确定',event:close},
      ]
    });
  });
  function edit() {
    service.getCompleteTask(4,res => {});
    service.editQuestion($('#title').data('id'),{answer:$('#answer').val()}, (res) =>{
      $('#toAnswer').addClass('dis_n');
      $('#answer').val('');
      $('#footer').empty().append(`
    <input id="edit" class="btnStyle subBtn" type="button" value="回&nbsp;&nbsp;答"/>
    `);
      getById(id);
    })
  }
  function close() {
    service.closeQuestion(id, ()=>{
      getById(id);
    })
  }
  getById(id);
  function getById(id) {
    service.getQuestionById(id,res=>{
      let hasAnswer=true,
      canAnswer=true,
      canClose=false;
      if(res.answers&&(res.answers.length<1)){
        hasAnswer=false
      }
      if(parseInt(res.author._id)===user_id){
        canAnswer=false;
        if(parseInt(res.status)!==2){
          canClose=true;
        }
      }else if(parseInt(res.status)===2){
        canAnswer=false;
      }
      if((role===4||role===5)&&(parseInt(res.status)!==2)){
        canClose=true;
      }
      let data={
        obj:res,
        hasAnswer,
        canAnswer,
        canClose
      };
      $('#question').html(template('container', data));
      service.getExp(res=>{
        $('#exp').text(res[0].value);
      })
    })
  }
});