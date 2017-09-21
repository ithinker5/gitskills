"use strict";

$(function () {
  var service = new SERVICE();
  var picArr = [];
  var picName = [];
  $(".btnBack").click(function () {
    window.parent.playClickEffect();
    window.history.go(-1);
  });
  //添加会议
  $('#submit').click(function () {
    window.parent.playClickEffect();
    var name = $("#name");
    var content = $("#content");
    errorTip(name, content);
    if (name.val() && content.val()) {
      confirmAgain({
        title: '发布会议记录',
        content: {
          text: '您确认要发布此会议记录吗？'
        },
        btns: [{ domId: 'cancel', text: '取消' }, { domId: 'confirm', text: '确定', event: add }]
      });
    }
  });
  //上传文件
  $('#file').change(fileChange);
  //删除文件
  $(document).on('click', '.delete', deleteFile);
  function fileChange() {
    var _this = this;

    service.uploadFile('file', function (res) {
      var file = $(_this).val();
      var fileName = getFileName(file);
      addFile(fileName);
      picName.push(fileName);
      picArr.push(res.url);
      $('#file').change(fileChange);
    });
  }
  function addFile(name) {
    $('.fileText').before("\n    <div class=\"item\">\n          <span class=\"filename\">" + name + "</span>\n          <span class=\"delete\"></span>\n        </div>\n    ");
  }
  function deleteFile() {
    var index = $('#fileContainer .delete').index($(this));
    picName.splice(index, 1);
    picArr.splice(index, 1);
    $(this).parent().remove();
  }
  function getFileName(o) {
    var pos = o.lastIndexOf("\\");
    return o.substring(pos + 1);
  }
  function add() {
    var meetObj = {
      title: $('#name').val(),
      content: $('#content').val(),
      assets: picArr.join(',')
    };
    service.add(meetObj, function (res) {
      window.location.href = "detail.html?meetId=" + res._id;
    });
  }
});