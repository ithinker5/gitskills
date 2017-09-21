$(function () {
  let service=new SERVICE();
  let role_id=parseInt(window.sessionStorage.getItem('role_id'));
  let user_id=parseInt(window.sessionStorage.getItem('user_id'));
  let receiver_id=0;
  let currentUser=0;
  let currentName='';
  let userInput='';
  $(document).on('click','.users .item',function () {
    window.parent.playClickEffect();
    let $this=$(this);
    $this.siblings().removeClass('active');
    $(this).addClass('active');
    service.alreadyRead($this.data('id'),res=>{
      getData(parseInt($this.data('id')),$this.data('name'),true);
    });
  });
  $(".btnBack").click(function(){
    window.parent.playClickEffect();
    window.parent.closeWebPop();
  });
  getData(currentUser,currentName,true);
  // setInterval(function () {
  //   if(role_id===4){
  //     userInput=$('#mangerSend').val()
  //   }else{
  //     userInput=$('#send').val()
  //   }
  //   service.alreadyRead(currentUser,res=>{
  //     getData(currentUser,currentName);
  //   });
  // },10000);
  $(document).on('click','#submit',function () {
    window.parent.playClickEffect();
    sendMessage();
  });
  $("body").keydown((event)=>{
    if (event.ctrlKey && event.keyCode==13){
      let content='';
      if(role_id===4){
        content=$('#mangerSend');
      }else{
        content=$('#send');
      }
      let text=content.val()+'\n';
      content.val(text);
    }else if (event.keyCode == 13) {
      event.cancelBubble=true;
      event.preventDefault();
      event.stopPropagation();
      sendMessage()
    }
  });
  function getData(id,name,canScoll) {
    if(role_id===4){
      let userList=[];
      service.getUserList(users=>{
        if(users&&users.length>0){
          for(let i=0;i<users.length;i++){
            if(parseInt(users[i].sender._id)!==user_id){
              userList.push(users[i])
            }
          }
          currentUser=userList[0].sender._id;
          currentName=userList[0].sender.name;
          $('footer').empty().append(`
          <div class="buttons" style="width: 97%;justify-content: flex-end">
            <input id="submit" class="btnStyle" type="button" value="发送"/>
          </div>
          `)
        }else{
          $('footer').empty();
        }
        if(id){
          currentUser=id;
          currentName=name;
        }
        service.getMessageHistory(currentUser,res=>{
          receiver_id=currentUser;
          let historyList={};
          for(let i=0;i<res.privateMsgList.length;i++){
            if(!historyList[dateChange(res.privateMsgList[i].created_at)]){
              historyList[dateChange(res.privateMsgList[i].created_at)]=[res.privateMsgList[i]]
            }else{
              historyList[dateChange(res.privateMsgList[i].created_at)].push(res.privateMsgList[i])
            }
          }
          let data={
            userList,
            manager:true,
            dataObj:{hasHistory:JSON.stringify(historyList)!='{}',privateMsgList:historyList,receiver:res.receiver},
            user_id,
            currentUser,
            currentName
          };
          let scroll=$('.history').scrollTop()||0;
          $('#boxContainer').html(template('container', data));
          $('#mangerSend').val('').focus().val(userInput);
          chartLimit($('#mangerSend'),500);
          if(canScoll){
            $('.history').scrollTop($('.history')[0].scrollHeight);
          }else{
            $('.history').scrollTop(scroll);
          }
        });
      });
    }else{
      service.getMessageHistory(user_id,res=>{
        receiver_id=res.receiver._id;
        let historyList={};
        for(let i=0;i<res.privateMsgList.length;i++){
          if(!historyList[dateChange(res.privateMsgList[i].created_at)]){
            historyList[dateChange(res.privateMsgList[i].created_at)]=[res.privateMsgList[i]]
          }else{
            historyList[dateChange(res.privateMsgList[i].created_at)].push(res.privateMsgList[i])
          }
        }
        let data={
          manager:false,
          dataObj:{hasHistory:JSON.stringify(historyList)!='{}',privateMsgList:historyList,receiver:res.receiver},
          user_id
        };
        let scroll=$('.history').scrollTop()||0;
        $('#boxContainer').html(template('container', data));
        $('#send').val('').focus().val(userInput);
        chartLimit($('#send'),500);
        if(canScoll){
          $('.history').scrollTop($('.history')[0].scrollHeight);
        }else{
          $('.history').scrollTop(scroll);
        }
      });
    }
  }
  function sendMessage() {
    let content='';
    if(role_id===4){
      content=$('#mangerSend');
    }else{
      content=$('#send');
    }
    errorTip(content);
    if(content.val()){
      let text=content.val();
      content.val('').focus();
      service.sendMessage({receiver_id,content:text},res=>{
        userInput='';
        getData(currentUser,currentName,true)
      })
    }
  }
});