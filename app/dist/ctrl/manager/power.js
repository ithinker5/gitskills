'use strict';

$(function () {
  getProperties('list');
  //确定提交编辑
  $(document).on('click', '#confirmEdit', function () {
    window.parent.playClickEffect();
    var error = false;
    $('.input-text').each(function () {
      if (!$(this).val()) {
        error = true;
        $(this).addClass('error');
      }
    });
    if (!error) {
      confirmAgain({
        title: '重新发布',
        content: {
          text: '您确认要修改属性信息吗？'
        },
        btns: [{ domId: 'cancel', text: '取消' }, { domId: 'confirm', text: '确定', event: edit }]
      });
    }
  });
  $(document).on('click', '#cancelEdit', function () {
    window.parent.playClickEffect();
    getProperties('list');
  });
  $(document).on('click', '#edit', function () {
    window.parent.playClickEffect();
    getProperties('edit');
  });
  function edit() {
    var obj = {
      metric1: {
        name: $('#metric1').val()
      },
      metric2: {
        name: $('#metric2').val()
      },
      metric3: {
        name: $('#metric3').val()
      },
      metric4: {
        name: $('#metric4').val()
      },
      metric5: {
        name: $('#metric5').val()
      }
    };
    service.editProperties(obj, function () {
      getProperties('list');
    });
  }
});