'use strict';

$(function () {
  var service = new SERVICE();
  //帮会id
  var bID = getUrlParam('faction_id');
  //获取帮会成员信息
  function getUsers() {
    service.getUsers(bID, function (res) {
      for (var i = 0, len = res.length; i < len; i++) {
        if (res[i].avatar == 'null' || res[i].avatar == null) {
          res[i].avatar = '../i/head1.png';
        } else if (parseInt(res[i].avatar) < 8) {
          res[i].avatar = '../i/head' + res[i].avatar + '.png';
        } else {
          res[i].avatar = res[i].avatar;
        }
        res[i].name = '<div class="memberNameImg"><img src="' + res[i].avatar + '" /></div>&nbsp;&nbsp;' + res[i].name + '&nbsp;&nbsp;<span data-id="' + res[i]._id + '">' + res[i].worker_number || '无' + '</span>';
        res[i].num = i + 1;
        res[i].year_of_service = '<span class="year">' + res[i].year_of_service.toFixed(1) + '</span><span class="units"></span>';
        res[i].level = 'Lv' + res[i].level;
        res[i].title = res[i].title || '无';
        res[i].grade = res[i].grade || '无';
        if (parseInt(res[i].role_id) == 4) {
          res[i].role_id2 = '护法';
        } else if (parseInt(res[i].role_id) == 3) {
          res[i].role_id2 = '帮主';
        } else if (parseInt(res[i].role_id) == 2) {
          res[i].role_id2 = '长老';
        } else if (parseInt(res[i].role_id) == 5) {
          res[i].role_id2 = '盟主';
        } else {
          res[i].role_id2 = '帮众';
        }
      }
      $('#accountTable1').dataTable({
        retrieve: true,
        scrollY: 800,
        scrollCollapse: true,
        paging: false, //分页
        ordering: true, //是否启用排序
        searching: false, //搜索
        language: {
          lengthMenu: '',
          info: "",
          infoEmpty: "",
          infoFiltered: "",
          sEmptyTable: "暂无数据"
        },
        data: res,
        columns: [{ data: 'num', title: '序号', orderable: true }, { data: 'name', title: '姓名', orderable: true }, { data: 'grade', title: '岗位级别', orderable: true }, { data: 'level', title: '等级', orderable: true }, { data: 'role_id2', title: '帮会职务', orderable: true }]
      });
      $("#accountTable1").find('.units').html('年');
      $(window).resize(function () {
        //当浏览器大小变化时
        $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) + 'px');
      });
      $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) + 'px');
    });
  }
  $(document).on('click', 'table th', function () {
    window.parent.playClickEffect();
  });
  getUsers();
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