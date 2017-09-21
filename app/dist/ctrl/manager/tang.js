'use strict';

$(function () {
  navList();
  getTangList();
  var currentTangId = '';

  /*模拟下拉框效果*/
  $(document).on('click', '.select_box input', function () {
    select(this, function (checkedLi) {
      $('#factionMasterName').text($(checkedLi).data('master'));
    });
  });

  $(document).on('click', '#backList', function () {
    window.parent.playClickEffect();
    getTangList();
  });
  //点击进入添加
  $(document).on('click', '#add', function () {
    window.parent.playClickEffect();
    var factionFilter = faction_id || '';
    service.getFactionList(factionFilter, function (res) {
      var data = {
        addPage: true,
        factions: res
      };
      $('#contentContainer').html(template('content', data));
      $('#footerContainer').html(template('footer', data));
      chartLimit($('#descAdd'), 70);
    });
  });
  //点击进入详情
  $(document).on('click', '#manager', function () {
    window.parent.playClickEffect();
    currentTangId = parseInt($(this).data('id'));
    getInfoById(currentTangId, 'detail');
  });
  //取消编辑进入详情页
  $(document).on('click', '#cancelEdit', function () {
    window.parent.playClickEffect();
    getInfoById(currentTangId, 'detail');
  });
  $(document).on('click', '#edit', function () {
    window.parent.playClickEffect();
    getInfoById(currentTangId, 'edit');
  });
  //取消添加进入列表页
  $(document).on('click', '#cancelAdd', function () {
    window.parent.playClickEffect();
    getTangList();
  });
  //确定添加进入详情页
  $(document).on('click', '#confirmAdd', function () {
    window.parent.playClickEffect();
    var name = $('#nameAdd');
    var desc = $('#descAdd');
    errorTip(name, desc);
    if (name.val() && desc.val()) {
      confirmAgain({
        title: '提示',
        content: {
          text: '您确认要创建此堂吗？'
        },
        btns: [{ domId: 'cancel', text: '取消' }, { domId: 'confirm', text: '确定', event: add }]
      });
    }
  });
  //确定提交编辑
  $(document).on('click', '#confirmEdit', function () {
    window.parent.playClickEffect();
    var name = $('#name');
    var desc = $('#desc');
    errorTip(name, desc);
    if (name.val() && desc.val()) {
      confirmAgain({
        title: '重新发布',
        content: {
          text: '您确认要修改此堂信息吗？'
        },
        btns: [{ domId: 'cancel', text: '取消' }, { domId: 'confirm', text: '确定', event: edit }]
      });
    }
  });
  //解散堂
  $(document).on('click', '#deleteSection', function () {
    window.parent.playClickEffect();
    confirmAgain({
      title: '提示',
      content: {
        text: '您确认要解散此堂吗？'
      },
      btns: [{ domId: 'cancel', text: '取消' }, { domId: 'confirm', text: '确定', event: deleteTang }]
    });
    function deleteTang() {
      service.deleteTang(currentTangId, function (res) {
        getTangList();
      });
    }
  });
  function getInfoById(currentTangId, page) {
    service.getTangById(currentTangId, function (res) {
      var data = {
        tangObj: res
      };
      if (page === 'detail') {
        data.detailPage = true;
      } else if (page === 'edit') {
        data.editPage = true;
      }
      $('#contentContainer').html(template('content', data));
      $('#footerContainer').html(template('footer', data));
      chartLimit($('#desc'), 70);
    });
  }
  function edit() {
    var name = $('#name');
    var desc = $('#desc');
    service.editTang(currentTangId, { name: name.val(), desc: desc.val() }, function () {
      getInfoById(currentTangId, 'detail');
    });
  }
  function add() {
    var name = $('#nameAdd');
    var desc = $('#descAdd');
    var faction = $('#factionName').data('value');
    service.addTang({ name: name.val(), desc: desc.val(), faction_id: faction }, function (res) {
      currentTangId = res._id;
      getInfoById(res._id, 'detail');
    });
  }
});