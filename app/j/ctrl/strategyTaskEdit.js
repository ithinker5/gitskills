$(function () {
  const service = new SERVICE();
  let fileNames = [];
  let fileArr = [];
  let taskObj = {};
  let factionsChecked = [];
  const id = window.location.href.split('?taskId=')[1];
  let myTask = getUrlParam('myTask');
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
        thisinput.attr('data-value', $(this).val());
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
  //获取任务信息
  getTask(id);
  getAsserts(id);
  $('#submit').click(() => {
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
          $('#factions input[name="factions"]:checked').each((index, item) => {
            factionsChecked.push($(item).val())
          });
          taskObj.type = 0;
          taskObj.subtype = 0;
          taskObj.status = 5;
          taskObj.title = $('#title').val();
          taskObj.remark = $('#desc').val();
          taskObj.level = $('#taskLevel').data('value');
          taskObj.deadline = parseInt(new Date($('#deadline').val()).getTime());
          taskObj.assets = fileArr;
          taskObj.assigned_factions = factionsChecked;
          const title = "重新发布";
          const type = "1";
          const con = "您确认要重新发布此任务吗？";
          zPopup(title, type, con, taskObj);
        }
      });
    }
  });
  /*二次确认弹窗*/
  function zPopup(title, type, con, task) {
    var h = "";
    if (type == 1) {
      //两个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn gotoDelete">确定</a>' + '</div>' + '</div>'
    } else if (type == 2) {
      //一个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class="u-Popup-close u-Popup-ok-btn  btnStyle">知道啦</a>' + '</div>' + '</div>'
    }

    $(".feehideBox").html(h)
    //取消按钮
    $(".u-Popup-close").click(function () {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide()
    });
    //确定按钮
    $(".gotoDelete").off("click").on("click", function () {
      window.parent.playClickEffect();
      service.edit(id, task, (res) => {
        window.location.href = `strategyTaskDetail.html?taskId=${id}`;
      });
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
  }
  //上传文件
  $('#file').change(fileChange);
  //删除文件
  $(document).on('click', '.delete', deleteFile);
  function fileChange() {
    service.addAssert('file', res => {
      let file = $(this).val();
      let fileName = getFileName(file);
      addFile(fileName);
      fileNames.push(fileName);
      fileArr.push({url:res.url});
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
    let index = $('#fileContainer .delete').index($(this));
    fileNames.splice(index, 1);
    fileArr.splice(index, 1);
    $(this).parent().remove()
  }
  function getFileName(o) {
    let pos = o.lastIndexOf("\\");
    return o.substring(pos + 1);
  }
  //任务详情
  function getTask(id) {
    service.getById(id, (res) => {
      $('#title').val(res.title);
      $('#desc').val(res.remark);
      let level=`${res.level}级`;
      $('#taskLevel').attr({'data-value':res.level,'value':level});
      if(res.deadline){
        document.getElementById('deadline').valueAsDate = new Date(res.deadline);
      }
      if(res.assigned_factions&&res.assigned_factions.length>0){
        for(let i=0;i<res.assigned_factions.length;i++){
          $(`#${res.assigned_factions[i]._id}`).attr("checked",true);
        }
      }
    })
  }
  //获取任务文档
  function getAsserts(id) {
    service.getAssetByTaskId(id, res => {
      if(res&&res.length>0){
        fileArr=[];
        for(let i=0;i<res.length;i++){
          fileArr.push({_id:res[i]._id, url:res[i].url});
          let pos = res[i].url.lastIndexOf("\/");
          let name=res[i].url.substring(pos + 1);
          fileNames.push(name);
          addFile(name);
        }
      }
    })
  }
  //返回到临时任务页面
  function back() {
    window.parent.playClickEffect();
    if(myTask && myTask == 'true'){
      window.parent.reloadWeb(`app/h/strategyTaskDetail.html?taskId=${id}&personalTask=true`, false, false, 1465, 820);
    }else{
      window.location.href = `strategyTaskDetail.html?taskId=${id}`;
    }

  }
  //获取帮派列表
  function getFactions() {
    service.getFactions((res) => {
      for (let i = 0; i < res.length; i++) {
        $('#factions').append(`<span>
                        <input id="${res[i]._id}" value="${res[i]._id}" type="checkbox" name="factions">
                        <label for="${res[i]._id}"></label>${res[i].name}
                    </span>`)
      }
    })
  }
  getFactions()
});
