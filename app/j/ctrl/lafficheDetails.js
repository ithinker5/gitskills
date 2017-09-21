$(function () {
  const $=window.$;
  let service=new SERVICE();
  let id=getUrlParam('lafficheId');
  let faction_id=getUrlParam('faction_id');
  $(".btnBack").click(function(){
    window.parent.playClickEffect();
    if(faction_id){
      window.location.href = `laffiche.html?faction_id=${faction_id}`;
    }else{
      window.location.href = 'laffiche.html';
    }
  });
  $(".subBtn").click(function(){
    window.parent.playClickEffect();
    if(faction_id){
      window.location.href = "lafficheEdit.html?lafficheId=" + id+"&faction_id="+faction_id;
    }else{
      window.location.href = "lafficheEdit.html?lafficheId=" + id;
    }
  });
  //判断权限
  let ROLE_ID=parseInt(window.sessionStorage.getItem('role_id'));
  getById(id);
  //通过公告的id获取公告信息
  function getById(id) {
    service.getById(id,res=>{
      if(res.faction_id==0){
        if(!(ROLE_ID===5||ROLE_ID===4)){
          $('.btnStyle.subBtn').css('display','none');
          $("footer").css('height','2rem');
          $(".contentBox").css('height','82%');
        }
      }else{
        if(!(ROLE_ID===5||ROLE_ID===4||ROLE_ID===3||ROLE_ID===2)){
          $('.btnStyle.subBtn').css('display','none');
          $("footer").css('height','2rem');
          $(".contentBox").css('height','82%');
        }
      }
      let date=dateChange(res.created_at);
      $("#name").val(res.title);
      $(".publishDate").val(date);
      $(".publishName").val((res.author&&res.author.name?res.author.name:''));
      $(".textDetail").val(res.content);
      if(!res.assets){
        $(".fileText").html("无附件");
        $('#fileContainer').css('display', 'none');
      }else{
        let arr=res.assets.split(',');
        $('#file_c').css({position:'relative'});
        $('#fileContainer').css({display:'inline-block'});
        for(let i=0;i<arr.length;i++){
          let arrTemp=arr[i].split('/');
          let name=arrTemp[arrTemp.length-1];
          $('#fileContainer').append(`
            <div class="item">
              <span class="filename">${name}</span>
              <a href=${arr[i]} class="download" download=${name}></a>
            </div>`);
        }
      }
    })
  }
  function dateChange(date) {
    let newDate = date?(new Date(date)):new Date();
    // let result = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();
    let result = `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`;
    return result
  }
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    } else {
      return null;
    }
  }
});
