$(function () {
  let service=new SERVICE();
  let id=getUrlParam('meetId');
  $(".btnBack").click(function(){
    window.parent.playClickEffect();
    window.location.href = 'list.html';
  });
  $(".subBtn").click(function(){
    window.parent.playClickEffect();
    window.location.href = "edit.html?meetId=" + id;
  });
  getById(id);
  //通过会议的id获取会议信息
  function getById(id) {
    service.getById(id,res=>{
      let date=dateChange(res.created_at);
      $("#name").val(res.title);
      $(".publishDate").val(date);
      $(".publishName").val((res.user&&res.user.name?res.user.name:'无'));
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
});