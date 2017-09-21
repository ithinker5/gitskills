$(function () {
  const service=new SERVICE();
  let fileNames=[];
  let fileArr=[];
  let taskObj={};
  let factionsChecked=[];
  // let nowDate=dateChange(new Date());
  // $('#deadline').attr({'value':nowDate,'min':nowDate});
  //返回
  $('.btnBack').click(function () {
    back();
  });
  /*模拟下拉框效果*/
  $(".select_box input").click(function () {
    let thisinput = $(this);
    let thisul = $(this).parent().find("ul");
    if (thisul.css("display") == "none") {
      thisul.fadeIn("100");
      thisul.hover(function () {
      }, function () {
        thisul.fadeOut("100");
      });
      thisul.find("li").click(function () {
        if(thisinput.attr('id')=='taskType'){
          window.location.href = 'tempTaskAdd.html';
          return false;
        }
        thisinput.attr('data-value',$(this).val());
        thisinput.val($(this).text());
        thisul.fadeOut("100");
      }).hover(function () {
        $(this).addClass("hover");
      }, function () {
        $(this).removeClass("hover");
      });
    }
    else {
      thisul.fadeOut("fast");
    }
  });
  $('#submit').click(()=>{
    window.parent.playClickEffect();
    let title=$('#title');
    let desc=$('#desc');
    let deadline=$('#deadline');
    errorTip(title,desc,deadline);
    if(title.val()&&desc.val()&&deadline.val()){
      service.getTime(res=>{
        if(new Date(deadline.val()).getTime()<res.now){
          $('#footerError').fadeIn(1000);
          setTimeout( () =>{
            $('#footerError').fadeOut(1000);
          },3000)
        }else{
          $('#factions input[name="factions"]:checked').each((index,item)=>{
            factionsChecked.push($(item).val())
          });
          taskObj.type=0;
          taskObj.subtype=$('#taskType').data('value');
          taskObj.title=$('#title').val();
          taskObj.remark=$('#desc').val();
          taskObj.level=$('#taskLevel').data('value');
          taskObj.deadline = parseInt(new Date($('#deadline').val()).getTime());
          taskObj.exp = 0;
          taskObj.base_vc = 0;
          taskObj.gold = 0;
          taskObj.assets=fileArr;
          taskObj.assigned_factions=factionsChecked;
          confirmAgain({
            title:'发布任务',
            content:{
              text:'您确认要发布此任务吗？'
            },
            btns:[
              {domId:'cancel',text:'取消'},
              {domId:'confirm',text:'确定',event:add},
            ]
          });
          function add() {
            service.add(taskObj,res=>{
              window.location.href = `strategyTaskDetail.html?taskId=${res._id}`;
            });
          }
        }
      });
    }
  });
  //上传文件
  $('#file').change(fileChange);
  //删除文件
  $(document).on('click','.delete',deleteFile);
  function fileChange() {
    service.addAssert('file', res => {
      let file = $(this).val();
      let fileName = getFileName(file);
      addFile(fileName);
      fileNames.push(fileName);
      fileArr.push(res.url);
      $('#file').change(fileChange);
    })
  }
  //在页面展示添加的文档
  function addFile(name) {
    $('#fileContainer .item label').before(`
    <div class="item2">
          <span class="filename">${name}</span>
          <span class="delete"></span>
        </div>
    `);
  }
  //删除文档
  function deleteFile() {
    let index=$('#fileContainer .delete').index($(this));
    fileNames.splice(index,1);
    fileArr.splice(index,1);
    $(this).parent().remove()
  }
  function getFileName(o){
    let pos=o.lastIndexOf("\\");
    return o.substring(pos+1);
  }
  function back() {
    window.parent.playClickEffect();
    window.parent.reloadWeb('app/h/taskList.html', false, false, 1465, 820);
    //window.location.href = 'taskList.html';
  }
  //获取帮派列表
  function getFactions(){
    service.getFactions((res)=>{
      for(let i=0;i<res.length;i++){
        $('#factions').append(`<span>
                        <input id="${res[i]._id}" value="${res[i]._id}" type="checkbox" name="factions">
                        <label for="${res[i]._id}"></label>${res[i].name}
                    </span>`)
      }
    })
  }
  getFactions()
});