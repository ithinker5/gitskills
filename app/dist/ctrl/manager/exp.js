'use strict';

$(function () {
  var activePage = 'level';
  var currentNeedChangeId = '';
  var rememberNum = '';
  getExpList('level');
  $(document).on('click', '.nav-tabs li', function () {
    activePage = $(this).attr('id');
    getExpList(activePage);
  });
  $(document).on('click', '.newPersonTaskManager', function () {
    window.parent.playClickEffect();
    var currentTd = $(this).parent();
    var siblingTd = currentTd.siblings('.exp');
    var currentExp = siblingTd.text();
    currentNeedChangeId = $(this).data('id');
    currentTd.html('\n    <button class="btn-manager btn-small newPersonTaskCancel" data-exp=' + currentExp + ' >\u53D6\u6D88</button>\n    <button class="btn-manager btn-small newPersonTaskConfirm" data-exp=' + currentExp + ' >\u786E\u5B9A</button>\n    ');
    siblingTd.html('\n    <input type="text" class="input-text" value=' + currentExp + ' />\n    ');
    $('.newPersonTaskManager').attr('disabled', 'true');
  });
  $(document).on('click', '.newPersonTaskCancel', function () {
    window.parent.playClickEffect();
    var currentTd = $(this).parent();
    var siblingTd = currentTd.siblings('.exp');
    var currentExp = $(this).data('exp');
    currentTd.html('\n    <button class="btn-manager btn-small newPersonTaskManager" data-id=' + currentNeedChangeId + ' >\u4FEE\u6539</button>\n    ');
    siblingTd.text(currentExp);
    $('.newPersonTaskManager').removeAttr('disabled');
  });
  $(document).on('click', '.newPersonTaskConfirm', function () {
    window.parent.playClickEffect();
    var currentTd = $(this).parent();
    var siblingTd = currentTd.siblings('.exp');
    var currentExp = siblingTd.children().val();
    var text = '';
    if (activePage === 'task') {
      var $footerMsg = $('.footerError');
      if (currentExp && !isInt(currentExp)) {
        siblingTd.children().addClass('error');
        animate($footerMsg);
        return false;
      }
      text = '您确认要修改此任务信息吗？';
    } else if (activePage === 'newPersonTask') {
      var _$footerMsg = $('.footerError');
      if (currentExp && !isInt(currentExp)) {
        siblingTd.children().addClass('error');
        animate(_$footerMsg);
        return false;
      } else {
        if (parseInt(currentExp) > 1000) {
          siblingTd.children().addClass('error');
          animate(_$footerMsg);
          return false;
        }
      }
      text = '您确认要修改此新手任务信息吗？';
    }
    confirmAgain({
      title: '重新发布',
      content: {
        text: text
      },
      btns: [{ domId: 'cancel', text: '取消' }, { domId: 'confirm', text: '确定', event: edit }]
    });
    function edit() {
      if (activePage === 'newPersonTask') {
        service.editNewPersonTaskList(currentNeedChangeId, { exp: currentExp }, function (res) {
          currentTd.html('\n    <button class="btn-manager btn-small newPersonTaskManager" data-id=' + currentNeedChangeId + ' >\u4FEE\u6539</button>\n    ');
          siblingTd.text(currentExp);
        });
      } else {
        service.editTaskList(currentNeedChangeId, { exp: currentExp }, function (res) {
          currentTd.html('\n    <button class="btn-manager btn-small newPersonTaskManager" data-id=' + currentNeedChangeId + ' >\u4FEE\u6539</button>\n    ');
          siblingTd.text(currentExp);
          $('.newPersonTaskManager').removeAttr('disabled');
        });
      }
    }
  });
  $(document).on('click', '#editLevel', function () {
    window.parent.playClickEffect();
    var $number = $('#number');
    rememberNum = $number.text();
    $number.html('<input type="text" class="input-text" value=' + rememberNum + ' />');
    var data = {
      levelPage: true,
      edit: true
    };
    $('#footerContainer').html(template('footer', data));
  });
  $(document).on('click', '#cancelLevel', function () {
    window.parent.playClickEffect();
    var data = {
      levelPage: true
    };
    $('#footerContainer').html(template('footer', data));
    $('#number').html('' + rememberNum);
  });
  $(document).on('click', '#confirmLevel', function () {
    window.parent.playClickEffect();
    var number = $('#number input');
    errorTip(number);
    if (number.val()) {
      var cancel = function cancel() {
        $('#cancelLevel').removeAttr('disabled');
        $('#confirmLevel').removeAttr('disabled');
      };

      var $footerMsg = $('#footerError');
      if (!isInt(number.val())) {
        number.addClass('error');
        animate($footerMsg);
        return false;
      } else {
        if (parseInt(number.val()) < 1 || parseInt(number.val()) > 30) {
          number.addClass('error');
          animate($footerMsg);
          return false;
        }
      }
      $('#cancelLevel').attr('disabled', 'disabled');
      $('#confirmLevel').attr('disabled', 'disabled');
      confirmAgain({
        title: '重新发布',
        content: {
          text: '您确认要修改等级系数吗？'
        },
        btns: [{ domId: 'cancel', text: '取消', event: cancel }, { domId: 'confirm', text: '确定' }]
      });


      $(document).on('click', '#confirm', function () {
        $(".feehideBox").empty();
        confirmAgain({
          title: '提示',
          content: {
            text: '正在批量修改数据，请等待。。。'
          },
          btns: []
        });
        service.editLevelNumber({ ratio: number.val() }, function (res) {
          $(".feehideBox").empty();
          var listArr = {
            col0: [],
            col1: [],
            col2: [],
            col3: [],
            col4: [],
            col5: [],
            col6: [],
            col7: [],
            col8: [],
            col9: [],
            col10: [],
            col11: [],
            col12: [],
            col13: [],
            col14: [],
            col15: [],
            col16: [],
            col17: [],
            col18: [],
            col19: []
          };
          for (var i = 0; i < 20; i++) {
            listArr['col' + i % 20].push(res.levels[i % 20]);
            listArr['col' + i % 20].push(res.levels[i % 20 + 20]);
            listArr['col' + i % 20].push(res.levels[i % 20 + 40]);
            listArr['col' + i % 20].push(res.levels[i % 20 + 60]);
            listArr['col' + i % 20].push(res.levels[i % 20 + 80]);
          }
          var data = {
            levelPage: true,
            list: listArr,
            ratio: res.ratio
          };
          $('#boxContainer').html(template('container', data));
        });
      });
    }
  });
});