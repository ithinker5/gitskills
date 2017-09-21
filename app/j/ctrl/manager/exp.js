$(function () {
  let activePage = 'level';
  let currentNeedChangeId = '';
  let rememberNum = '';
  getExpList('level');
  $(document).on('click', '.nav-tabs li', function () {
    activePage = $(this).attr('id');
    getExpList(activePage)
  });
  $(document).on('click', '.newPersonTaskManager', function () {
    window.parent.playClickEffect();
    let currentTd = $(this).parent();
    let siblingTd = currentTd.siblings('.exp');
    let currentExp = siblingTd.text();
    currentNeedChangeId = $(this).data('id');
    currentTd.html(`
    <button class="btn-manager btn-small newPersonTaskCancel" data-exp=${currentExp} >取消</button>
    <button class="btn-manager btn-small newPersonTaskConfirm" data-exp=${currentExp} >确定</button>
    `);
    siblingTd.html(`
    <input type="text" class="input-text" value=${currentExp} />
    `);
    $('.newPersonTaskManager').attr('disabled', 'true');
  });
  $(document).on('click', '.newPersonTaskCancel', function () {
    window.parent.playClickEffect();
    let currentTd = $(this).parent();
    let siblingTd = currentTd.siblings('.exp');
    let currentExp = $(this).data('exp');
    currentTd.html(`
    <button class="btn-manager btn-small newPersonTaskManager" data-id=${currentNeedChangeId} >修改</button>
    `);
    siblingTd.text(currentExp);
    $('.newPersonTaskManager').removeAttr('disabled');
  });
  $(document).on('click', '.newPersonTaskConfirm', function () {
    window.parent.playClickEffect();
    let currentTd = $(this).parent();
    let siblingTd = currentTd.siblings('.exp');
    let currentExp = siblingTd.children().val();
    let text = '';
    if (activePage === 'task') {
      let $footerMsg = $('.footerError');
      if (currentExp && !isInt(currentExp)) {
        siblingTd.children().addClass('error');
        animate($footerMsg);
        return false
      }
      text = '您确认要修改此任务信息吗？'
    } else if (activePage === 'newPersonTask') {
      let $footerMsg = $('.footerError');
      if (currentExp && !isInt(currentExp)) {
        siblingTd.children().addClass('error');
        animate($footerMsg);
        return false
      } else {
        if (parseInt(currentExp) > 1000) {
          siblingTd.children().addClass('error');
          animate($footerMsg);
          return false
        }
      }
      text = '您确认要修改此新手任务信息吗？'
    }
    confirmAgain({
      title: '重新发布',
      content: {
        text: text
      },
      btns: [
        {domId: 'cancel', text: '取消'},
        {domId: 'confirm', text: '确定', event: edit},
      ]
    });
    function edit() {
      if (activePage === 'newPersonTask') {
        service.editNewPersonTaskList(currentNeedChangeId, {exp: currentExp}, res => {
          currentTd.html(`
    <button class="btn-manager btn-small newPersonTaskManager" data-id=${currentNeedChangeId} >修改</button>
    `);
          siblingTd.text(currentExp)
        })
      } else {
        service.editTaskList(currentNeedChangeId, {exp: currentExp}, res => {
          currentTd.html(`
    <button class="btn-manager btn-small newPersonTaskManager" data-id=${currentNeedChangeId} >修改</button>
    `);
          siblingTd.text(currentExp);
          $('.newPersonTaskManager').removeAttr('disabled');
        })
      }
    }
  });
  $(document).on('click', '#editLevel', function () {
    window.parent.playClickEffect();
    let $number = $('#number');
    rememberNum = $number.text();
    $number.html(`<input type="text" class="input-text" value=${rememberNum} />`);
    let data = {
      levelPage: true,
      edit: true
    };
    $('#footerContainer').html(template('footer', data));
  });
  $(document).on('click', '#cancelLevel', function () {
    window.parent.playClickEffect();
    let data = {
      levelPage: true
    };
    $('#footerContainer').html(template('footer', data));
    $('#number').html(`${rememberNum}`)
  });
  $(document).on('click', '#confirmLevel', function () {
    window.parent.playClickEffect();
    let number = $('#number input');
    errorTip(number);
    if (number.val()) {
      let $footerMsg = $('#footerError');
      if (!isInt(number.val())) {
        number.addClass('error');
        animate($footerMsg);
        return false
      } else {
        if (parseInt(number.val()) < 1 || parseInt(number.val()) > 30) {
          number.addClass('error');
          animate($footerMsg);
          return false
        }
      }
      $('#cancelLevel').attr('disabled', 'disabled');
      $('#confirmLevel').attr('disabled', 'disabled');
      confirmAgain({
        title: '重新发布',
        content: {
          text: '您确认要修改等级系数吗？'
        },
        btns: [
          {domId: 'cancel', text: '取消', event: cancel},
          {domId: 'confirm', text: '确定'},
        ]
      });
      function cancel() {
        $('#cancelLevel').removeAttr('disabled');
        $('#confirmLevel').removeAttr('disabled');
      }

      $(document).on('click', '#confirm', function () {
        $(".feehideBox").empty();
        confirmAgain({
          title: '提示',
          content: {
            text: '正在批量修改数据，请等待。。。'
          },
          btns: []
        });
        service.editLevelNumber({ratio: number.val()}, (res) => {
          $(".feehideBox").empty();
          let listArr = {
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
            col19: [],
          };
          for (let i = 0; i < 20; i++) {
            listArr[`col${i % 20}`].push(res.levels[i % 20]);
            listArr[`col${i % 20}`].push(res.levels[i % 20 + 20]);
            listArr[`col${i % 20}`].push(res.levels[i % 20 + 40]);
            listArr[`col${i % 20}`].push(res.levels[i % 20 + 60]);
            listArr[`col${i % 20}`].push(res.levels[i % 20 + 80]);
          }
          let data = {
            levelPage: true,
            list: listArr,
            ratio: res.ratio
          };
          $('#boxContainer').html(template('container', data));
        });
      })
    }
  });
});