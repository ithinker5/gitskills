'use strict';

$(function () {
  var service = new SERVICE();
  var id = getUrlParam('meetId');
  $(".btnBack").click(function () {
    window.parent.playClickEffect();
    window.location.href = 'list.html';
  });
  $(".subBtn").click(function () {
    window.parent.playClickEffect();
    window.location.href = "edit.html?meetId=" + id;
  });
  getById(id);
  //通过会议的id获取会议信息
  function getById(id) {
    service.getById(id, function (res) {
      var date = dateChange(res.created_at);
      $("#name").val(res.title);
      $(".publishDate").val(date);
      $(".publishName").val(res.user && res.user.name ? res.user.name : '无');
      $(".textDetail").val(res.content);
      if (!res.assets) {
        $(".fileText").html("无附件");
        $('#fileContainer').css('display', 'none');
      } else {
        var arr = res.assets.split(',');
        $('#file_c').css({ position: 'relative' });
        $('#fileContainer').css({ display: 'inline-block' });
        for (var i = 0; i < arr.length; i++) {
          var arrTemp = arr[i].split('/');
          var name = arrTemp[arrTemp.length - 1];
          $('#fileContainer').append('\n            <div class="item">\n              <span class="filename">' + name + '</span>\n              <a href=' + arr[i] + ' class="download" download=' + name + '></a>\n            </div>');
        }
      }
    });
  }
});