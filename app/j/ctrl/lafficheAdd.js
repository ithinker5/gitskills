$(function () {
  const $=window.$;
  let picArr=[];
  let picName=[];
  let faction_id=getUrlParam('faction_id');
  $(".btnBack").click(function(){
    window.parent.playClickEffect();
    window.history.go(-1);
  });
  let service=new SERVICE();
  //添加公告
  $('#submit').click(function(){
    window.parent.playClickEffect();
    let name=$("#name");
    let content=$("#content");
    errorTip(name,content);
    if(name.val()&&content.val()){
      const title = "发布公告";
      const type= "1";
      const con = "您确认要发布此公告吗？";
      zPopup(title,type,con);
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
      add();
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
  function add() {
    let laffiche={};
    if(faction_id){
      laffiche={
        title:$('#name').val(),
        content:$('#content').val(),
        assets:picArr.join(','),
        faction_id:faction_id,
        status:0
      };
    }else{
      laffiche={
        title:$('#name').val(),
        content:$('#content').val(),
        assets:picArr.join(','),
        department_id:window.sessionStorage.getItem("department_id"),
        status:0
      };
    }

    service.add(laffiche,(res)=>{
      if(faction_id){
        window.location.href = `lafficheDetails.html?faction_id=${faction_id}&lafficheId=${res._id}`;
      }else{
        window.location.href = `lafficheDetails.html?lafficheId=${res._id}`;
      }
    })
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

