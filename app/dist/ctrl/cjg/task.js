'use strict';

$(function () {
  var service = new SERVICE();
  var userId = '';
  var changeVc = { default_vc: '', default_gold: '' };
  getTaskList();
  //获取领队列表
  function getTaskList() {
    service.getTaskList(function (res) {
      for (var i = 0, len = res.length; i < len; i++) {
        res[i].btn = '<input class="btn-manager btn-small" id="btnChange" value="修改" data-id=' + res[i]._id + ' type="button" />';
        res[i].default_vc = '<input contenteditable="true" class="changeValue inputNoBorder input-text" data-id=' + res[i]._id + '  id="task_vc" value=' + res[i].default_vc + ' type="text" readonly="readonly" />';
        res[i].default_gold = '<input contenteditable="true" class="changeValue inputNoBorder input-text" id="gold" value=' + res[i].default_gold + ' type="text" readonly="readonly" />';
        if (parseInt(res[i].type) == '2') {
          res[i].type = '\u4E2A\u4EBA\u4EFB\u52A1';
          res[i].level = '无';
        } else if (parseInt(res[i].type) == '3') {
          res[i].type = '<span class="disHide">\u8BD5\u70BC\u4EFB\u52A1</span>';
          res[i].level = '无';
        } else {
          switch (res[i].subtype) {
            case 0:
              res[i].type = '\u8054\u76DF\u6218\u7565\u4EFB\u52A1';
              break;
            case 1:
              res[i].type = '\u8054\u76DF\u4E34\u65F6\u4EFB\u52A1';
              break;
            case 2:
              res[i].type = '\u5E2E\u4F1A\u6311\u6218\u4EFB\u52A1';
              break;
            case 3:
              res[i].type = '\u5E2E\u4F1A\u57FA\u7840\u4EFB\u52A1';
              break;
            case 4:
              res[i].type = '\u5E2E\u4F1A\u4E34\u65F6\u4EFB\u52A1';
              break;
          };
          if (parseInt(res[i].level) === 1) {
            res[i].level = "<img src='../../i/magatama.png' />";
          } else if (parseInt(res[i].level) === 2) {
            res[i].level = "<img src='../../i/magatama.png' /> <img src='../../i/magatama.png' />";
          } else if (parseInt(res[i].level) === 3) {
            res[i].level = "<img src='../../i/magatama.png' /> <img src='../../i/magatama.png' /> <img src='../../i/magatama.png' />";
          } else if (parseInt(res[i].level) === 4) {
            res[i].level = "<img src='../../i/magatama.png' /> <img src='../../i/magatama.png' /> <img src='../../i/magatama.png' /> <img src='../../i/magatama.png' />";
          } else if (parseInt(res[i].level) === 5) {
            res[i].level = "<img src='../../i/magatama.png' /> <img src='../../i/magatama.png' /> <img src='../../i/magatama.png' /> <img src='../../i/magatama.png' /> <img src='../../i/magatama.png' />";
          }
        }
      }
      $('#accountTable1').dataTable({
        retrieve: true,
        scrollY: 860,
        scrollCollapse: true,
        paging: false, //分页
        ordering: false, //是否启用排序
        searching: false, //搜索
        language: {
          lengthMenu: '',
          info: "",
          infoEmpty: "",
          infoFiltered: "",
          sEmptyTable: "暂无数据"
        },
        data: res,
        columns: [{ data: 'type', title: '任务类型', orderable: false }, { data: 'level', title: '级别', orderable: false }, { data: 'default_vc', title: '默认VC值', orderable: false }, { data: 'default_gold', title: '默认金币值', orderable: false }, { data: 'btn', title: '', orderable: false }]
      });
      $(".disHide").parent().parent('tr').addClass('dis_n');
      $("#contentContainer").css('padding-top', '0');
      $(window).resize(function () {
        //当浏览器大小变化时
        $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) + 'px');
      });
      $(".dataTables_scrollBody").css("height", parseInt($(".dataTables_scroll").height()) - parseInt($(".dataTables_scrollHead").height()) + 'px');
    });
  }
  $(document).on('click', '#btnChange', function () {
    if ($("input").hasClass('hintBox')) {
      $("input.btn-manager").removeAttr('disabled', 'disabled');
    } else {
      $("input.btn-manager").attr('disabled', 'disabled');
      $(this).parent('td').siblings().find('#gold').removeClass('inputNoBorder').addClass('hintBox').removeAttr('readonly');
      $(this).parent('td').siblings().find('#task_vc').removeClass('inputNoBorder').addClass('hintBox').removeAttr('readonly');
      userId = $(this).parent('td').siblings().find('#task_vc').data('id');
      $(this).parent('td').html('<input class="btn-manager btn-small" id="cancel" value="取消" type="button" />&nbsp;&nbsp;<input class="btn-manager btn-small" id="confirmChange" value="确定" type="button" />');
    }
  });
  $(document).on('click', '#cancel', function () {
    $("input.btn-manager").removeAttr('disabled', 'disabled');
    $(this).parent('td').siblings().find('#gold').removeClass('error');
    $(this).parent('td').siblings().find('#task_vc').removeClass('error');
    $(this).parent('td').siblings().find('#gold').val($(this).parent('td').siblings().find('#gold').attr('value'));
    $(this).parent('td').siblings().find('#task_vc').val($(this).parent('td').siblings().find('#task_vc').attr('value'));
    $(this).parent('td').siblings().find('#gold').addClass('inputNoBorder').removeClass('hintBox').attr('readonly', 'readonly');
    $(this).parent('td').siblings().find('#task_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly', 'readonly');
    $(this).parent('td').html('<input class="btn-manager btn-small" id="btnChange" value="修改" type="button" />');
  });
  //let changeVc={default_vc:'',default_gold:'',exp:'',level:'',subtype:'',type:''};
  $(document).on('click', '#confirmChange', function () {
    var number1 = $(this).parent('td').siblings().find('#task_vc');
    var number2 = $(this).parent('td').siblings().find('#gold');
    errorTip(number1);
    errorTip(number2);
    var $footerMsg = $('#footerError');
    if (number1.val() || number2.val()) {
      if (!isInt(number1.val())) {
        number1.addClass('error');
        animate($footerMsg);
        return false;
      } else if (!isInt(number2.val())) {
        number2.addClass('error');
        animate($footerMsg);
        return false;
      } else {
        var changeMember = function changeMember() {
          service.changeTaskList(userId, changeVc, function () {
            //location.reload();
          });
        };

        changeVc.default_vc = parseInt($(this).parent('td').siblings().find('#task_vc').val());
        changeVc.default_gold = parseInt($(this).parent('td').siblings().find('#gold').val());
        $("input.btn-manager").removeAttr('disabled', 'disabled');
        $(this).parent('td').siblings().find('#gold').addClass('inputNoBorder').removeClass('hintBox').attr('readonly', 'readonly');
        $(this).parent('td').siblings().find('#task_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly', 'readonly');
        $(this).parent('td').html('<input class="btn-manager btn-small" id="btnChange" value="修改" type="button" />');
        confirmAgain({
          title: '修改',
          content: {
            text: '您确认要修改金币或VC值吗？'
          },
          btns: [{ domId: 'cancelAnswer', text: '取消' }, { domId: 'confirm', text: '确定', event: changeMember }]
        });
      }
    }
  });
  $(document).on('click', '#cancelAnswer', function () {
    window.location.reload();
  });
  /*跳转页面*/
  $(document).on('click', '#departFaction', function () {
    window.parent.playClickEffect();
    window.location.href = 'departFaction.html';
  });
  $(document).on('click', '#personal', function () {
    window.parent.playClickEffect();
    window.location.href = 'personal.html';
  });
});