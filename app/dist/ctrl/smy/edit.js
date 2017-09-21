'use strict';

$(function () {
  var service = new SERVICE();
  var $ = window.$;
  var picArr = [];
  var picName = [];
  var id = getUrlParam('meetId');
  $(".btnBack").click(function () {
    window.parent.playClickEffect();
    window.location.href = 'detail.html?meetId=' + id;
  });
  getById(id);
  $('#submit').off('click').on('click', function () {
    window.parent.playClickEffect();
    var name = $("#name");
    var content = $("#content");
    if (name.val() && content.val()) {
      confirmAgain({
        title: '重新发布',
        content: {
          text: '您确认要重新发布此会议记录吗？'
        },
        btns: [{ domId: 'cancel', text: '取消' }, { domId: 'confirm', text: '确定', event: submit }]
      });
    } else {
      errorTip(name, content);
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
    $('.fileText').before('\n    <div class="item">\n          <span class="filename">' + name + '</span>\n          <span class="delete"></span>\n        </div>\n    ');
  }
  function submit() {
    var meetObj = {
      title: $('#name').val(),
      content: $('#content').val(),
      assets: picArr.join(',')
    };
    service.edit(id, meetObj, function () {
      window.location.href = 'detail.html?meetId=' + id;
    });
  }
  function getById(id) {
    service.getById(id, function (res) {
      $("#name").val(res.title).attr('data-id', res._id);
      $(".publishDate").val(res.created_at);
      $(".publishName").val(res.user && res.user.name ? res.user.name : '');
      $("#content").val(res.content);
      if (!res.assets) {
        $('#fileContainer').css('display', 'inline-block');
        $(".fileText").html("选择文件");
      } else {
        picArr = res.assets.split(',');
        for (var i = 0; i < picArr.length; i++) {
          var arrTemp = picArr[i].split('/');
          var name = arrTemp[arrTemp.length - 1];
          picName.push(name);
          $('.fileText').before('\n            <div class="item">\n              <span class="filename">' + name + '</span>\n              <span class="delete"></span>\n            </div>');
        }
      }
    });
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
});