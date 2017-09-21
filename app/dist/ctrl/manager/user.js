'use strict';

$(function () {
  navList();
  getUserList();
  var currentUserId = '';
  var structure = {};
  /*模拟下拉框效果*/
  $(document).on('click', '.select_box input', function () {
    var _this = this;
    if ($(_this).attr('id') === 'belongFactionRoleEdit') {
      if (parseInt($('#belongFactionEdit').attr('data-value')) === 0) {
        return;
      }
    }
    if ($(_this).attr('id') === 'belongSectionRoleEdit') {
      if (parseInt($('#belongSectionEdit').attr('data-value')) === 0) {
        return;
      }
    }
    if ($(_this).attr('id') === 'belongFactionRoleAdd') {
      if (parseInt($('#belongFactionAdd').attr('data-value')) === 0) {
        return;
      }
    }
    if ($(_this).attr('id') === 'belongSectionRoleAdd') {
      if (parseInt($('#belongSectionAdd').attr('data-value')) === 0) {
        return;
      }
    }
    if ($(_this).attr('id') === 'belongSectionEdit' || $(_this).attr('id') === 'belongSectionAdd') {
      var factionId = faction_id;
      if (!factionId) {
        if ($(_this).attr('id') === 'belongSectionEdit') {
          factionId = $('#belongFactionEdit').data('value');
        } else {
          factionId = $('#belongSectionAdd').data('value');
        }
      }
      for (var i = 0; i < structure.children.length; i++) {
        if (structure.children[i]._id === parseInt(factionId)) {
          $('#tangList').empty().append('<li value=\'0\'>\u65E0</li>');
          if (structure.children[i].children.length > 0) {
            for (var j = 0; j < structure.children[i].children.length; j++) {
              $('#tangList').append('\n                 <li value=' + structure.children[i].children[j]._id + ' >' + structure.children[i].children[j].name + '</li>\n                ');
            }
          }
          break;
        }
      }
    }
    select(this, function (checkedLi) {
      if ($(_this).attr('id') === 'belongFactionEdit' || $(_this).attr('id') === 'belongFactionAdd') {
        var _factionId = $(checkedLi).val();
        if ($(_this).attr('id') === 'belongFactionEdit') {
          $('#belongSectionEdit').attr({ 'value': '无', 'data-value': 0 });
          $('#belongFactionRoleEdit').attr({ 'value': '无', 'data-value': 0 });
          $('#belongSectionRoleEdit').attr({ 'value': '无', 'data-value': 0 });
        } else {
          $('#belongSectionAdd').attr({ 'value': '无', 'data-value': 0 });
          $('#belongFactionRoleAdd').attr({ 'value': '无', 'data-value': 0 });
          $('#belongSectionRoleAdd').attr({ 'value': '无', 'data-value': 0 });
        }
        for (var _i = 0; _i < structure.children.length; _i++) {
          if (structure.children[_i]._id === parseInt(_factionId)) {
            $('#tangList').empty().append('<li value=\'0\'>\u65E0</li>');
            if (structure.children[_i].children.length > 0) {
              for (var _j = 0; _j < structure.children[_i].children.length; _j++) {
                $('#tangList').append('\n                 <li value=' + structure.children[_i].children[_j]._id + ' >' + structure.children[_i].children[_j].name + '</li>\n                ');
              }
            }
            break;
          }
        }
      }
      if ($(_this).attr('id') === 'belongSectionEdit' || $(_this).attr('id') === 'belongSectionAdd') {
        if ($(_this).attr('id') === 'belongSectionEdit') {
          $('#belongSectionRoleEdit').attr({ 'value': '无', 'data-value': 0 });
        } else {
          $('#belongSectionRoleAdd').attr({ 'value': '无', 'data-value': 0 });
        }
      }
    });
  });
  $(document).on('click', '#backList', function () {
    window.parent.playClickEffect();
    getUserList();
  });
  $(document).on('click', '#add', function () {
    window.parent.playClickEffect();
    var data = {
      addPage: true,
      profiles: [],
      faction_id: faction_id
    };
    service.getStructure(function (structureObj) {
      data.structure = structureObj;
      structure = structureObj;
      service.getProperties(function (obj) {
        data.profiles.push({ showName: obj.metric1.name, points: 0 }, { showName: obj.metric2.name, points: 0 }, { showName: obj.metric3.name, points: 0 }, { showName: obj.metric4.name, points: 0 }, { showName: obj.metric5.name, points: 0 });
        service.getDepartList(function (res) {
          data.departVc = res[0].vc;
          data.departGold = res[0].gold;
          $('#contentContainer').html(template('content', data));
          $('#footerContainer').html(template('footer', data));
          document.getElementById('beginDate').valueAsDate = new Date();
          chartLimit($('#desc'), 18);
        });
      });
    });
  });
  //确定添加进入详情页
  $(document).on('click', '#confirmAdd', function () {
    window.parent.playClickEffect();
    var name = $('#name');
    var workerNumber = $('#workerNumber');
    var beginDate = $('#beginDate');
    var title = $('#title');
    var grade = $('#grade');
    var baseVc = $('#baseVc');
    var gold = $('#gold');
    var trumpetAuth = $('input[name="trumpetAuth"]:checked').val();
    var metric1 = $('#metric1');
    var metric2 = $('#metric2');
    var metric3 = $('#metric3');
    var metric4 = $('#metric4');
    var metric5 = $('#metric5');
    var role_id = 1;
    var factionId = faction_id ? faction_id : 0;
    if (!faction_id) {
      if (parseInt($('#belongDepartAdd').attr('data-value')) === 1) {
        role_id = 5;
      } else if (parseInt($('#belongDepartAdd').attr('data-value')) === 2) {
        role_id = 4;
      }
      factionId = parseInt($('#belongFactionAdd').attr('data-value'));
    }
    if (role_id === 1 && parseInt($('#belongFactionRoleAdd').attr('data-value')) !== 0) {
      role_id = 3;
    }
    var faction_master = parseInt($('#belongFactionRoleAdd').attr('data-value'));
    var section_master = parseInt($('#belongSectionRoleAdd').attr('data-value'));
    var section_id = parseInt($('#belongSectionAdd').attr('data-value'));
    if (role_id === 1 && parseInt($('#belongSectionRoleAdd').attr('data-value')) !== 0) {
      role_id = 2;
    }
    var remark = $('#desc');
    errorTip(name, workerNumber, beginDate, grade, title, baseVc, gold, metric1, metric2, metric3, metric4, metric5, remark);
    if (name.val() && workerNumber.val() && beginDate.val() && baseVc.val() && gold.val() && metric1.val() && metric2.val() && metric3.val() && metric4.val() && metric5.val() && remark.val()) {
      var add = function add() {
        service.addUser({
          name: name.val(),
          entry_time: new Date(beginDate.val()).getTime(),
          worker_number: workerNumber.val(),
          title: title.val(),
          grade: grade.val().toUpperCase(),
          base_vc: baseVc.val(),
          gold: gold.val(),
          message_permission: trumpetAuth,
          profiles: [{ name: 'metric1', points: metric1.val() }, { name: 'metric2', points: metric2.val() }, { name: 'metric3', points: metric3.val() }, { name: 'metric4', points: metric4.val() }, { name: 'metric5', points: metric5.val() }],
          role_id: role_id,
          faction_id: factionId,
          section_id: section_id,
          faction_master: faction_master,
          section_master: section_master,
          remark: remark.val()
        }, function (res) {
          if (res.code === 400) {
            confirmAgain({
              title: '提示',
              content: {
                text: '该工号已注册，请重新输入！'
              },
              btns: [{ domId: 'cancel', text: '确定' }]
            });
          } else {
            currentUserId = res._id;
            getInfoById(currentUserId, 'detail');
          }
        });
      };

      var $footerMsg = $('#footerError');
      if (allGrade.indexOf(grade.val().toUpperCase()) < 0) {
        grade.addClass('error');
        $footerMsg.text('请输入正确的岗位级别！');
        animate($footerMsg);
        return false;
      }
      if (!isInt(baseVc.val())) {
        baseVc.addClass('error');
        $footerMsg.text('基础VC必须是大于等于0的整数！');
        animate($footerMsg);
        return false;
      }
      var departVc = parseInt($('#departVc').data('vc'));
      if (parseInt(baseVc.val()) > departVc) {
        baseVc.addClass('error');
        $footerMsg.text('\u57FA\u7840VC\u4E0D\u80FD\u5927\u4E8E\u8054\u76DFVC' + departVc);
        animate($footerMsg);
        return false;
      }
      if (!isInt(gold.val())) {
        gold.addClass('error');
        $footerMsg.text('金币必须是大于等于0的整数！');
        animate($footerMsg);
        return false;
      } else {
        var departGold = parseInt($('#departGold').data('gold'));
        if (parseInt(gold.val()) > departGold) {
          gold.addClass('error');
          $footerMsg.text('\u8054\u76DF\u91D1\u5E01\u5269\u4F59' + departGold + '\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165\uFF01');
          animate($footerMsg);
          return false;
        }
      }
      if (!isInt(metric1.val())) {
        metric1.addClass('error');
        $footerMsg.text('能力值必须是大于等于0的整数');
        animate($footerMsg);
        return false;
      }
      if (!isInt(metric2.val())) {
        metric2.addClass('error');
        $footerMsg.text('能力值必须是大于等于0的整数');
        animate($footerMsg);
        return false;
      }
      if (!isInt(metric3.val())) {
        metric3.addClass('error');
        $footerMsg.text('能力值必须是大于等于0的整数');
        animate($footerMsg);
        return false;
      }
      if (!isInt(metric4.val())) {
        metric4.addClass('error');
        $footerMsg.text('能力值必须是大于等于0的整数');
        animate($footerMsg);
        return false;
      }
      if (!isInt(metric5.val())) {
        metric5.addClass('error');
        $footerMsg.text('能力值必须是大于等于0的整数');
        animate($footerMsg);
        return false;
      }
      confirmAgain({
        title: '提示',
        content: {
          text: '您确认要新建成员吗？'
        },
        btns: [{ domId: 'cancel', text: '取消' }, { domId: 'confirm', text: '确定', event: add }]
      });
    }
  });
  //取消添加进入列表页
  $(document).on('click', '#cancelAdd', function () {
    window.parent.playClickEffect();
    getUserList();
  });
  //点击进入详情
  $(document).on('click', '#manager', function () {
    window.parent.playClickEffect();
    currentUserId = parseInt($(this).data('id'));
    getInfoById(currentUserId, 'detail');
  });
  //删除成员
  $(document).on('click', '#deleteUser', function () {
    window.parent.playClickEffect();
    confirmAgain({
      title: '提示',
      content: {
        text: '您确认要删除此成员吗？'
      },
      btns: [{ domId: 'cancel', text: '取消' }, { domId: 'confirm', text: '确定', event: deleteUser }]
    });
    function deleteUser() {
      service.deleteUser(currentUserId, function (res) {
        getUserList();
      });
    }
  });
  //重置密码
  $(document).on('click', '#resetPsw', function () {
    window.parent.playClickEffect();
    confirmAgain({
      title: '提示',
      content: {
        text: '您确认要重置此成员密码吗？'
      },
      btns: [{ domId: 'cancel', text: '取消' }, { domId: 'confirm', text: '确定', event: resetPsw }]
    });
    function resetPsw() {
      service.resetPsw(currentUserId, function (res) {
        getInfoById(currentUserId, 'detail');
      });
    }
  });
  //取消编辑进入详情页
  $(document).on('click', '#cancelEdit', function () {
    window.parent.playClickEffect();
    getInfoById(currentUserId, 'detail');
  });
  //确定编辑进入详情页
  $(document).on('click', '#confirmEdit', function () {
    window.parent.playClickEffect();
    var name = $('#nameEdit');
    var workerNumber = $('#workerNumberEdit');
    var beginDate = $('#beginDateEdit');
    var title = $('#titleEdit');
    var grade = $('#gradeEdit');
    var trumpetAuth = $('input[name="trumpetAuthEdit"]:checked').val();
    var metric1 = $('#metric1Edit');
    var metric2 = $('#metric2Edit');
    var metric3 = $('#metric3Edit');
    var metric4 = $('#metric4Edit');
    var metric5 = $('#metric5Edit');
    var role_id = 1;
    var factionId = faction_id ? faction_id : 0;
    if (!faction_id) {
      if (parseInt($('#belongDepartEdit').attr('data-value')) === 1) {
        role_id = 5;
      } else if (parseInt($('#belongDepartEdit').attr('data-value')) === 2) {
        role_id = 4;
      }
      factionId = parseInt($('#belongFactionEdit').attr('data-value'));
    }
    if (role_id === 1 && parseInt($('#belongFactionRoleEdit').attr('data-value')) !== 0) {
      role_id = 3;
    }
    var faction_master = parseInt($('#belongFactionRoleEdit').attr('data-value'));
    var section_master = parseInt($('#belongSectionRoleEdit').attr('data-value'));
    var section_id = parseInt($('#belongSectionEdit').attr('data-value'));
    if (role_id === 1 && parseInt($('#belongSectionRoleEdit').attr('data-value')) !== 0) {
      role_id = 2;
    }
    var remark = $('#descEdit');
    errorTip(name, workerNumber, grade, title, beginDate, metric1, metric2, metric3, metric4, metric5, remark);
    if (name.val() && workerNumber.val() && beginDate.val() && metric1.val() && metric2.val() && metric3.val() && metric4.val() && metric5.val() && remark.val()) {
      var edit = function edit() {
        service.editUser(currentUserId, {
          name: name.val(),
          entry_time: new Date(beginDate.val()).getTime(),
          worker_number: workerNumber.val(),
          title: title.val(),
          grade: grade.val().toUpperCase(),
          message_permission: trumpetAuth,
          profiles: [{ name: 'metric1', points: metric1.val() }, { name: 'metric2', points: metric2.val() }, { name: 'metric3', points: metric3.val() }, { name: 'metric4', points: metric4.val() }, { name: 'metric5', points: metric5.val() }],
          role_id: role_id,
          faction_id: factionId,
          section_id: section_id,
          faction_master: faction_master,
          section_master: section_master,
          remark: remark.val()
        }, function (res) {
          if (res.code === 400) {
            confirmAgain({
              title: '提示',
              content: {
                text: '该工号已注册，请重新输入！'
              },
              btns: [{ domId: 'cancel', text: '知道了' }]
            });
          } else {
            getInfoById(currentUserId, 'detail');
          }
        });
      };

      var $footerMsg = $('#footerError');
      if (allGrade.indexOf(grade.val().toUpperCase()) < 0) {
        grade.addClass('error');
        $footerMsg.text('请输入正确的岗位级别！');
        animate($footerMsg);
        return false;
      }
      if (!isInt(metric1.val())) {
        metric1.addClass('error');
        $footerMsg.text('能力值必须是大于等于0的整数');
        animate($footerMsg);
        return false;
      }
      if (!isInt(metric2.val())) {
        metric2.addClass('error');
        $footerMsg.text('能力值必须是大于等于0的整数');
        animate($footerMsg);
        return false;
      }
      if (!isInt(metric3.val())) {
        metric3.addClass('error');
        $footerMsg.text('能力值必须是大于等于0的整数');
        animate($footerMsg);
        return false;
      }
      if (!isInt(metric4.val())) {
        metric4.addClass('error');
        $footerMsg.text('能力值必须是大于等于0的整数');
        animate($footerMsg);
        return false;
      }
      if (!isInt(metric5.val())) {
        metric5.addClass('error');
        $footerMsg.text('能力值必须是大于等于0的整数');
        animate($footerMsg);
        return false;
      }
      confirmAgain({
        title: '提示',
        content: {
          text: '您确认要修改此成员信息吗？'
        },
        btns: [{ domId: 'cancel', text: '取消' }, { domId: 'confirm', text: '确定', event: edit }]
      });
    }
  });
  $(document).on('click', '#edit', function () {
    window.parent.playClickEffect();
    getInfoById(currentUserId, 'edit');
  });
  function getInfoById(currentUserId, page) {
    service.getUserById(currentUserId, function (res) {
      var data = {
        userObj: res,
        faction_id: faction_id
      };
      if (page === 'detail') {
        data.detailPage = true;
        $('#contentContainer').html(template('content', data));
        $('#footerContainer').html(template('footer', data));
      } else if (page === 'edit') {
        data.editPage = true;
        service.getStructure(function (structureObj) {
          data.structure = structureObj;
          structure = structureObj;
          if (res.profiles.length < 1) {
            data.userObj.profiles = [];
            service.getProperties(function (obj) {
              data.userObj.profiles.push({ showName: obj.metric1.name, points: 0 }, { showName: obj.metric2.name, points: 0 }, { showName: obj.metric3.name, points: 0 }, { showName: obj.metric4.name, points: 0 }, { showName: obj.metric5.name, points: 0 });
              $('#contentContainer').html(template('content', data));
              $('#footerContainer').html(template('footer', data));
              chartLimit($('#descEdit'), 18);
            });
          } else {
            $('#contentContainer').html(template('content', data));
            $('#footerContainer').html(template('footer', data));
            chartLimit($('#descEdit'), 18);
          }
        });
      }
    });
  }
});