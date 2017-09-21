'use strict';

$(function () {
  var currentDepartId = '';
  getDepartList();
  //取消编辑进入详情页
  $(document).on('click', '#cancelEdit', function () {
    window.parent.playClickEffect();
    getInfoById(currentDepartId, 'detail');
  });
  //确定提交编辑
  $(document).on('click', '#confirmEdit', function () {
    window.parent.playClickEffect();
    var name = $('#name');
    var desc = $('#desc');
    var org = $('#org');
    errorTip(name, desc, org);
    if (name.val() && desc.val() && org.val()) {
      confirmAgain({
        title: '重新发布',
        content: {
          text: '您确认要修改此联盟信息吗？'
        },
        btns: [{ domId: 'cancel', text: '取消' }, { domId: 'confirm', text: '确定', event: edit }]
      });
    }
  });
  $(document).on('click', '#edit', function () {
    window.parent.playClickEffect();
    currentDepartId = $('#departName').data('id');
    getInfoById(currentDepartId, 'edit');
  });
  function getInfoById(currentDepartId, page) {
    service.getDepartById(currentDepartId, function (res) {
      var data = {
        departObj: res
      };
      if (page === 'detail') {
        data.detailPage = true;
      } else if (page === 'edit') {
        data.editPage = true;
      }
      $('#boxContainer').html(template('container', data));
      chartLimit($('#desc'), 70);
    });
  }
  function edit() {
    var name = $('#name');
    var desc = $('#desc');
    var org = $('#org');
    service.editDepart(currentDepartId, { name: name.val(), desc: desc.val(), org_info: org.val() }, function () {
      getInfoById(currentDepartId, 'detail');
    });
  }
});