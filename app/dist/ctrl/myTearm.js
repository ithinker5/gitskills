'use strict';

$(function () {
  var service = new SERVICE();
  /*$(".bbsBox").click(function(){
    window.location.href='/v1/redirect?url=/bbs/forum.php'
  });*/
  var teamId = '';
  //获取帮会信息
  function getMyTeams() {
    $(".createBox span").click(function () {
      window.sessionStorage.setItem('teamId', $(".teamId").data('id'));
      window.parent.playClickEffect();
      //window.parent.reloadWeb('app/h/createTearm.html',true,false,1465,756);
      //window.location.href = 'createTearm.html?roleId=0';
      czdd();
    });
    service.getMyTeams(function (res) {
      for (var i = 0, len = res.length; i < len; i++) {
        if (res[i].role_id == 0) {
          res[i].role = '领队';
          $(".createBox").remove();
        } else {
          res[i].role = '队员';
        }
        var teamMember = [];
        for (var j = 0, _len = res[i].members.length; j < _len; j++) {
          teamMember.push(res[i].members[j].user.name);
        }
        res[i].teamMember = teamMember;
        res[i].name = '<span data-id=' + res[i]._id + ' data-role=' + res[i].role_id + ' class="teamId">' + res[i].name + '</span>';
      }
      $('#accountTable1').dataTable({
        retrieve: true,
        scrollY: 800,
        scrollCollapse: true,
        paging: false, //分页
        ordering: true, //是否启用排序
        order: [[1, "desc"]],
        searching: false, //搜索
        language: {
          lengthMenu: '',
          info: "",
          infoEmpty: "",
          infoFiltered: "",
          sEmptyTable: "暂无数据"
        },
        data: res,
        columns: [{ data: 'name', title: '队伍名称', orderable: true }, { data: 'role', title: '担任角色', orderable: true }, { data: 'member_count', title: '队伍人数', orderable: true }, { data: 'task_num', title: '任务数', orderable: true }, { data: 'teamMember', title: '队员', orderable: true }]
      });
      $(window).resize(function () {
        //当浏览器大小变化时
        $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) - parseInt($(".createBox").height()) + 'px');
      });
      $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) - parseInt($(".createBox").height()) + 'px');
      $('#accountTable1 tr').each(function () {
        if ($(this).children().children("span").data('role') == 0) {
          $(this).css({ "border-bottom": "2px solid rgba(165,248,164,0.5)", "color": "rgba(255,248,164,1)" });
        }
      });
      if ($("#accountTable1 td").hasClass("dataTables_empty")) {
        return;
      } else {
        $("#accountTable1 tr").click(function () {
          window.parent.playClickEffect();
          window.sessionStorage.setItem('teamId', $(this).children().children("span").data('id'));
          /*1是队员，0是队长*/
          if ($(this).children().children("span").data('role') == 1) {
            window.parent.reloadWeb('app/h/createTearmDetail.html?teamId=' + $(this).children().children("span").data('id') + '&roleId=1&skipCocos=true', false, false, 1465, 820);
            //window.location.href = 'createTearmDetail.html?roleId=1&teamId='+$(this).children().children("span").data('id');
          } else {
            window.parent.reloadWeb('app/h/createTearm.html?teamId=' + $(this).children().children("span").data('id') + '&roleId=0&skipCocos=true', false, false, 1465, 820);
            //window.location.href = 'createTearm.html?roleId=0&teamId='+$(this).children().children("span").data('id');
          }
        });
      }
    });
  }
  $(document).on('click', 'table th', function () {
    window.parent.playClickEffect();
  });
  getMyTeams();
  function czdd() {
    var title = "创建队伍";
    var type = "1";
    var con = "队伍名称：<input type='text' placeholder='请输入队伍名称' class='nameBtn' maxlength='15' />";
    zPopup(title, type, con);
  }
  function zPopup(title, type, con) {
    var h = "";
    if (type == 1) {
      //两个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn gotoDelete">确定</a>' + '</div>' + '</div>';
    } else if (type == 2) {
      //一个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class="u-Popup-close u-Popup-ok-btn  btnStyle">知道啦</a>' + '</div>' + '</div>';
    }

    $(".feehideBox").html(h);
    //取消按钮
    $(".u-Popup-close").click(function () {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
    /*确定创建*/
    $(".gotoDelete").off("click").on("click", function () {
      window.parent.playClickEffect();
      if (!$(".nameBtn").val() || $(".nameBtn").val() === '') {
        $(".nameBtn").focus();
        return;
      } else {
        getCreateTeams();
      }
    });
    function getCreateTeams() {
      var name = {
        name: $('.nameBtn').val()
      };
      service.getCompleteTask(8, function (res) {});
      service.getCreateTeams(name, function (res) {
        window.parent.reloadWeb('app/h/createTearm.html?teamId=' + res._id + '&roleId=0&skipCocos=true', false, false, 1465, 820);
        //window.location.href='createTearm.html?roleId=0&teamId='+res._id;
      });
    }
  }
  //获取url参数
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