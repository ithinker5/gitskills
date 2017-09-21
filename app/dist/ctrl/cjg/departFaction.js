'use strict';

$(function () {
  var service = new SERVICE();
  var factionId = window.sessionStorage.getItem('faction_id');
  var factionObj = { vc: '', gold: '' };
  var departmentId = window.sessionStorage.getItem('department_id');
  var departmentObj = { vc_total: '', gold_total: '' };
  var departTotalVc = 0;
  var departVc = 0;
  var departTotalGold = 0;
  var departGold = 0;
  var currentFactionVC = 0; //标记选中的帮会的未修改的vc值
  var currentFactionGold = 0; //标记选中的帮会的未修改的gold值
  function getAllianceList() {
    service.getAllianceList(window.sessionStorage.getItem('department_id'), function (res) {
      var html = '';
      html += '<p><b><i>\u8054\u76DF\u603BVC\uFF1A</i><input contenteditable="true" class="changeValue2 inputNoBorder department_vc input-text" value=' + res.vc_total + ' data-id="" type="text" readonly="readonly" /></b>' + ('<b class="boss"><em>\u8054\u76DF\u603B\u91D1\u5E01\uFF1A</em><input contenteditable="true" class="changeValue2 inputNoBorder department_gold input-text" value=' + res.gold_total + ' data-id="" type="text" readonly="readonly" /></b>') + ('<b><input class="btn-manager btn-small btnRightA" value="\u4FEE\u6539" type="button" data-id=' + res._id + ' /></b>') + '</p>' + '<div><p class="divCenter">\u8054\u76DF</p></div>' + ('<p><i>\u8054\u76DF\u540D\u79F0\uFF1A</i><span class="factionName">' + res.name + '</span><b class="boss"><em>\u76DF&nbsp;&nbsp;\u4E3B\uFF1A</em><span class="factionBoss">' + res.master.name + '</span></b></p>') + ('<p><b><i>\u8054\u76DFVC\uFF1A</i><input contenteditable="true" class="changeValue2 inputNoBorder department_vc input-text" value=' + res.vc + ' data-id="" type="text" readonly="readonly" /></b>') + ('<b class="boss"><em>\u91D1\u5E01\uFF1A</em><input contenteditable="true" class="changeValue2 inputNoBorder department_gold input-text" value=' + res.gold + ' data-id=' + res._id + ' type="text" readonly="readonly" /></b>') + '</p>';
      $(".contentBg1").append(html);
      departTotalVc = res.vc_total;
      departVc = res.vc;
      departTotalGold = res.gold_total;
      departGold = res.gold;
    });
  }
  function getFactionList() {
    service.getFactionList(function (res) {
      var html = '';
      for (var i = 0; i < res.length; i++) {
        html += '<div><p class="divCenter">\u5E2E\u4F1A' + (i + 1) + '</p></div>';
        if (res[i].chief == null) {
          html += '<p><i>\u5E2E\u4F1A\u540D\u79F0\uFF1A</i><span class="factionName">' + res[i].name + '</span><b class="boss"><em>\u5E2E&nbsp;&nbsp;\u4E3B\uFF1A</em><span class="factionBoss">\u65E0</span></b></p>';
        } else {
          html += '<p><i>\u5E2E\u4F1A\u540D\u79F0\uFF1A</i><span class="factionName">' + res[i].name + '</span><b class="boss"><em>\u5E2E&nbsp;&nbsp;\u4E3B\uFF1A</em><span class="factionBoss">' + res[i].chief.name + '</span></b></p>';
        }
        html += '<p><b><i>\u5E2E\u4F1AVC\uFF1A</i><input contenteditable="true" class="changeValue2 inputNoBorder faction_vc input-text" value=' + res[i].vc + ' data-id="" type="text" readonly="readonly" /></b>' + ('<b class="boss"><em>\u91D1\u5E01\uFF1A</em><input contenteditable="true" class="changeValue2 inputNoBorder faction_gold input-text" value=' + res[i].gold + ' data-id="" type="text" readonly="readonly" /></b>') + ('<b><input class="btn-manager btn-small btnRight" value="\u4FEE\u6539" type="button" data-id=' + res[i]._id + ' /></b>') + '</p>';
      }
      $(".contentBg2").append(html);
    });
  }
  getAllianceList();
  getFactionList();
  /*切换按钮*/
  $(document).on('click', '.btnRightA', function () {
    if ($("input").hasClass('hintBox')) {
      $("input.btn-manager").removeAttr('disabled', 'disabled');
    } else {
      $("input.btn-manager").attr('disabled', 'disabled');
      $(this).parent('b').siblings().find('.department_vc').removeClass('inputNoBorder').addClass('hintBox').removeAttr('readonly');
      $(this).parent('b').siblings().find('.department_gold').removeClass('inputNoBorder').addClass('hintBox').removeAttr('readonly');
      departmentId = $(this).data('id');
      $(this).parent('b').html('<input class="btn-manager btn-small" id="cancelA" value="取消" type="button" />&nbsp;&nbsp;<input class="btn-manager btn-small" id="confirmChangeA" style="left: 90%;" value="确定" type="button" />');
    }
  });
  //修改帮会配置数据
  $(document).on('click', '.btnRight', function () {
    if ($("input").hasClass('hintBox')) {
      $("input.btn-manager").removeAttr('disabled', 'disabled');
    } else {
      $("input.btn-manager").attr('disabled', 'disabled');
      $(this).parent('b').siblings().find('.faction_vc').removeClass('inputNoBorder').addClass('hintBox').removeAttr('readonly');
      $(this).parent('b').siblings().find('.faction_gold').removeClass('inputNoBorder').addClass('hintBox').removeAttr('readonly');
      factionId = $(this).data('id');
      currentFactionVC = parseInt($(this).parent('b').siblings().find('.faction_vc').val());
      currentFactionGold = parseInt($(this).parent('b').siblings().find('.faction_gold').val());
      $(this).parent('b').html('<input class="btn-manager btn-small" id="cancelD" value="取消" type="button" />&nbsp;&nbsp;<input class="btn-manager btn-small" id="confirmChangeD" style="left: 90%;" value="确定" type="button" />');
    }
  });
  //取消修改帮会数据
  $(document).on('click', '#cancelD', function () {
    $("input.btn-manager").removeAttr('disabled', 'disabled');
    $(this).parent('b').siblings().find('.faction_gold').removeClass('error');
    $(this).parent('b').siblings().find('.faction_vc').removeClass('error');
    $(this).parent('b').siblings().find('.faction_gold').val($(this).parent('b').siblings().find('.faction_gold').attr('value'));
    $(this).parent('b').siblings().find('.faction_vc').val($(this).parent('b').siblings().find('.faction_vc').attr('value'));
    $(this).parent('b').siblings().find('.faction_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly', 'readonly');
    $(this).parent('b').siblings().find('.faction_gold').addClass('inputNoBorder').removeClass('hintBox').attr('readonly', 'readonly');
    $(this).parent('b').html('<input data-id=' + factionId + ' class="btn-manager btn-small btnRight" value="\u4FEE\u6539" type="button" />');
  });
  $(document).on('click', '#cancelA', function () {
    $("input.btn-manager").removeAttr('disabled', 'disabled');
    $(this).parent('b').siblings().find('.department_gold').removeClass('error');
    $(this).parent('b').siblings().find('.department_vc').removeClass('error');
    $(this).parent('b').siblings().find('.department_gold').val($(this).parent('b').siblings().find('.department_gold').attr('value'));
    $(this).parent('b').siblings().find('.department_vc').val($(this).parent('b').siblings().find('.department_vc').attr('value'));
    $(this).parent('b').siblings().find('.department_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly', 'readonly');
    $(this).parent('b').siblings().find('.department_gold').addClass('inputNoBorder').removeClass('hintBox').attr('readonly', 'readonly');
    $(this).parent('b').html('<input class="btn-manager btn-small btnRightA" value="修改" type="button" />');
  });
  //确认修改帮会信息
  $(document).on('click', '#confirmChangeD', function () {
    var number1 = $(this).parent('b').siblings().find('.faction_vc');
    var number2 = $(this).parent('b').siblings().find('.faction_gold');
    errorTip(number1, number2);
    var $footerMsg = $('#footerError');
    $footerMsg.text('输入值必须是大于等于0的整数！');
    if (number1.val() || number2.val()) {
      var changeMember = function changeMember() {
        service.changeFactionList(factionId, factionObj, function () {
          location.reload();
        });
      };

      if (!isInt(number1.val())) {
        number1.addClass('error');
        animate($footerMsg);
        return false;
      }
      if (!isInt(number2.val())) {
        number2.addClass('error');
        animate($footerMsg);
        return false;
      }
      if (parseInt(number1.val()) - currentFactionVC > departVc) {
        number1.addClass('error');
        $footerMsg.text('联盟VC不足,请重新输入！');
        animate($footerMsg);
        return false;
      }
      if (parseInt(number2.val()) - currentFactionGold > departGold) {
        number2.addClass('error');
        $footerMsg.text('联盟金币不足,请重新输入！');
        animate($footerMsg);
        return false;
      }
      factionObj.vc = $(this).parent('b').siblings().find('.faction_vc').val();
      factionObj.gold = $(this).parent('b').siblings().find('.faction_gold').val();
      $("input.btn-manager").removeAttr('disabled', 'disabled');
      $(this).parent('b').siblings().find('.faction_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly', 'readonly');
      $(this).parent('b').siblings().find('.faction_gold').addClass('inputNoBorder').removeClass('hintBox').attr('readonly', 'readonly');
      $(this).parent('b').html('<input data-id=' + factionId + ' class="btn-manager btn-small btnRight" value="\u4FEE\u6539" type="button" />');
      confirmAgain({
        title: '修改',
        content: {
          text: '您确认要修改金币或VC值吗？'
        },
        btns: [{ domId: 'cancelAnswer', text: '取消' }, { domId: 'confirm', text: '确定', event: changeMember }]
      });
    }
  });
  //联盟总确定修改
  $(document).on('click', '#confirmChangeA', function () {
    //departmentObj.vc_total=$(this).parent('b').siblings().find('.department_vc').val();
    var number1 = $(this).parent('b').siblings().find('.department_vc'); //用户输入的联盟vc
    var number2 = $(this).parent('b').siblings().find('.department_gold'); //用户输入的联盟gold
    errorTip(number1, number2);
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
        if (parseInt(departTotalVc) - parseInt($(this).parent('b').siblings().find('.department_vc').val()) > 0 || parseInt(departTotalGold) - parseInt($(this).parent('b').siblings().find('.department_gold').val()) > 0) {
          if (parseInt(departVc) - (parseInt(departTotalVc) - parseInt($(this).parent('b').siblings().find('.department_vc').val())) < 0) {
            number1.addClass('error');
            $footerMsg.text('联盟VC将更改为负值，请重新输入！');
            animate($footerMsg);
          } else if (parseInt(departGold) - (parseInt(departTotalGold) - parseInt($(this).parent('b').siblings().find('.department_gold').val())) < 0) {
            number2.addClass('error');
            $footerMsg.text('联盟金币将更改为负值，请重新输入！');
            animate($footerMsg);
          } else {
            var changeMemberA = function changeMemberA() {
              service.changeAllianceList(departmentId, departmentObj, function () {
                location.reload();
              });
            };

            departmentObj.vc_total = $(this).parent('b').siblings().find('.department_vc').val();
            departmentObj.gold_total = $(this).parent('b').siblings().find('.department_gold').val();
            $("input.btn-manager").removeAttr('disabled', 'disabled');
            $(this).parent('b').siblings().find('.department_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly', 'readonly');
            $(this).parent('b').siblings().find('.department_gold').addClass('inputNoBorder').removeClass('hintBox').attr('readonly', 'readonly');
            $(this).parent('b').html('<input class="btn-manager btn-small btnRightA" value="修改" type="button" />');
            confirmAgain({
              title: '修改',
              content: {
                text: '您确认要修改金币或VC值吗？'
              },
              btns: [{ domId: 'cancelAnswer', text: '取消' }, { domId: 'confirm', text: '确定', event: changeMemberA }]
            });
          }
        } else {
          var _changeMemberA = function _changeMemberA() {
            service.changeAllianceList(departmentId, departmentObj, function () {
              location.reload();
            });
          };

          departmentObj.vc_total = $(this).parent('b').siblings().find('.department_vc').val();
          departmentObj.gold_total = $(this).parent('b').siblings().find('.department_gold').val();
          $("input.btn-manager").removeAttr('disabled', 'disabled');
          $(this).parent('b').siblings().find('.department_vc').addClass('inputNoBorder').removeClass('hintBox').attr('readonly', 'readonly');
          $(this).parent('b').siblings().find('.department_gold').addClass('inputNoBorder').removeClass('hintBox').attr('readonly', 'readonly');
          $(this).parent('b').html('<input class="btn-manager btn-small btnRightA" value="修改" type="button" />');
          confirmAgain({
            title: '修改',
            content: {
              text: '您确认要修改金币或VC值吗？'
            },
            btns: [{ domId: 'cancelAnswer', text: '取消' }, { domId: 'confirm', text: '确定', event: _changeMemberA }]
          });
        }
      }
    }
  });
  $(document).on('click', '#cancelAnswer', function () {
    window.location.reload();
  });
  $(document).on('click', '.margin4R', function () {
    window.parent.playClickEffect();
    confirmAgain({
      title: '一键清零',
      content: {
        text: '您确认要清零联盟及帮会的数值吗？'
      },
      btns: [{ domId: 'cancelAnswer', text: '取消' }, { domId: 'confirm', text: '确定', event: clearAllNum }]
    });
    function clearAllNum() {
      service.getFactionClearing(function () {
        location.reload();
      });
      /*service.getDepartClearing( ()=>{
        });*/
    }
  });

  /*跳转页面*/
  $(document).on('click', '#personal', function () {
    window.parent.playClickEffect();
    window.location.href = 'personal.html';
  });
  $(document).on('click', '#task', function () {
    window.parent.playClickEffect();
    window.location.href = 'task.html';
  });
});