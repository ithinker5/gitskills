$(function () {
  let service=new SERVICE();
  let picArr=[];
  let picName=[];
  $(".btnBack").click(function(){
    window.parent.playClickEffect();
    window.history.go(-1);
  });
  //添加会议
  $('#submit').click(function(){
    window.parent.playClickEffect();
    let name=$("#name");
    let content=$("#content");
    errorTip(name,content);
    if(name.val()&&content.val()){
      confirmAgain({
        title:'发布会议记录',
        content:{
          text:'您确认要发布此会议记录吗？'
        },
        btns:[
          {domId:'cancel',text:'取消'},
          {domId:'confirm',text:'确定',event:add},
        ]
      });
    }
  });
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
    let meetObj={
      title:$('#name').val(),
      content:$('#content').val(),
      assets:picArr.join(',')
    };
    service.add(meetObj,(res)=>{
      window.location.href = `detail.html?meetId=${res._id}`;
    })
  }
});

