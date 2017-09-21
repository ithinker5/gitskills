$(function () {
  const $=window.$;
  let picArr=[];
  let picName=[];
  let id=getUrlParam('lafficheId');
  let faction_id=getUrlParam('faction_id');
  let status='';
  $(".btnBack").click(function(){
    window.parent.playClickEffect();
    if(faction_id){
      window.location.href = `lafficheDetails.html?faction_id=${faction_id}&lafficheId=${id}`;
    }else{
      window.location.href = `lafficheDetails.html?lafficheId=${id}`;
    }
  });
  $(".releaseBtn").click(function(){
    window.parent.playClickEffect();
    window.location.href = 'lafficheEdit.html';
  });
  let service=new SERVICE();
  // let id=window.location.href.split('?lafficheId=')[1];
  getById(id);
  $('#submit').off('click').on('click', function(){
    window.parent.playClickEffect();
    let name=$("#name");
    let content=$("#content");
    if(name.val()&&content.val()){
      const title = "重新发布";
      const type= "1";
      const con = "您确认要重新发布此公告吗？";
      zPopup(title,type,con);
    }else{
      errorTip(name,content)
    }
  });
  /*二次确认弹窗*/
  function zPopup(title,type, con) {
    var h = "";
    if (type == 1) {
      //两个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class="btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class="btnStyle u-Popup-btn gotoDelete">确定</a>' + '</div>' + '</div>'
    } else if (type == 2) {
      //一个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class="btnStyle u-Popup-close u-Popup-ok-btn">知道啦</a>' + '</div>' + '</div>'
    }

    $(".feehideBox").html(h);
    //取消按钮
    $(".u-Popup-close").click(function() {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide()
    });
    //确定按钮
    $(".gotoDelete").off("click").on("click",function(){
      window.parent.playClickEffect();
      submit();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
  }
  //上传文件
  $('#file').change(fileChange);
  //删除文件
  $(document).on('click','.delete',deleteFile);
  function fileChange() {
    service.uploadFile('file', res => {
      let file = $(this).val();
      let fileName = getFileName(file);
      addFile(fileName);
      picName.push(fileName);
      picArr.push(res.url);
      $('#file').change(fileChange);
    })
  }
  function addFile(name) {
    $('.fileText').before(`
    <div class="item">
          <span class="filename">${name}</span>
          <span class="delete"></span>
        </div>
    `);
  }
  function submit() {
    let laffiche={
      title:$('#name').val(),
      content:$('#content').val(),
      assets:picArr.join(','),
      status
    };
    service.edit(id,laffiche,()=>{
      if(faction_id){
        window.location.href = `lafficheDetails.html?faction_id=${faction_id}&lafficheId=${id}`;
      }else{
        window.location.href = `lafficheDetails.html?lafficheId=${id}`;
      }
    })
  }
  function getById(id) {
    service.getById(id,res=>{
      $("#name").val(res.title).attr('data-id',res._id);
      $(".publishDate").val(res.created_at);
      $(".publishName").val((res.author&&res.author.name)?res.author.name:'');
      $("#content").val(res.content);
      status=res.status;
      if(!res.assets){
        $('#fileContainer').css('display', 'inline-block');
        $(".fileText").html("选择文件");
      }else{
        picArr=res.assets.split(',');
        for(let i=0;i<picArr.length;i++){
          let arrTemp=picArr[i].split('/');
          let name=arrTemp[arrTemp.length-1];
          picName.push(name);
          $('.fileText').before(`
            <div class="item">
              <span class="filename">${name}</span>
              <span class="delete"></span>
            </div>`);
        }
      }
    })
  }
  function deleteFile() {
    let index=$('#fileContainer .delete').index($(this));
    picName.splice(index,1);
    picArr.splice(index,1);
    $(this).parent().remove()
  }
  function getFileName(o){
    let pos=o.lastIndexOf("\\");
    return o.substring(pos+1);
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

