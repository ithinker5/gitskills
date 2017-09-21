'use strict';

$(function () {
  var service = new SERVICE();
  var user_id = parseInt(window.sessionStorage.getItem('user_id'));
  var role = parseInt(window.sessionStorage.getItem('role_id'));
  var id = getUrlParam('questionId');
  $(document).on('click', '.btnBack', function () {
    window.parent.playClickEffect();
    window.location.href = 'questionList.html';
  });
  $(document).on('click', '#cancel', function () {
    window.parent.playClickEffect();
    $('#toAnswer').addClass('dis_n');
    $('#answer').val('');
    if (role === 4 || role === 5) {
      $('#footer').empty().append('\n    <input id="close" class="btnStyle subBtn" type="button" value="\u5173\u95ED\u95EE\u9898"/>\n    <input id="edit" class="btnStyle subBtn" type="button" value="\u56DE&nbsp;&nbsp;\u7B54"/>\n    ');
    } else {
      $('#footer').empty().append('\n    <input id="edit" class="btnStyle subBtn" type="button" value="\u56DE&nbsp;&nbsp;\u7B54"/>\n    ');
    }
  });
  $(document).on('click', '#edit', function () {
    window.parent.playClickEffect();
    $('#toAnswer').removeClass('dis_n');
    $('#footer').empty().append('\n    <input id="cancel" class="btnStyle subBtn" type="button" value="\u53D6&nbsp;&nbsp;\u6D88"/>\n    <input id="submit" class="btnStyle subBtn" type="button" value="\u56DE&nbsp;&nbsp;\u7B54"/>\n    ');
  });
  $(document).on('click', '#submit', function () {
    window.parent.playClickEffect();
    var answer = $("#answer");
    errorTip(answer);
    if (answer.val()) {
      confirmAgain({
        title: '提交答案',
        content: {
          text: '您确认要提交答案吗？'
        },
        btns: [{ domId: 'cancelAnswer', text: '取消' }, { domId: 'confirm', text: '确定', event: edit }]
      });
    }
  });
  $(document).on('click', '#close', function () {
    window.parent.playClickEffect();
    confirmAgain({
      title: '关闭问题',
      content: {
        text: '您确认要关闭此问题吗？'
      },
      btns: [{ domId: 'cancelAnswer', text: '取消' }, { domId: 'confirm', text: '确定', event: close }]
    });
  });
  function edit() {
    service.getCompleteTask(4, function (res) {});
    service.editQuestion($('#title').data('id'), { answer: $('#answer').val() }, function (res) {
      $('#toAnswer').addClass('dis_n');
      $('#answer').val('');
      $('#footer').empty().append('\n    <input id="edit" class="btnStyle subBtn" type="button" value="\u56DE&nbsp;&nbsp;\u7B54"/>\n    ');
      getById(id);
    });
  }
  function close() {
    service.closeQuestion(id, function () {
      getById(id);
    });
  }
  getById(id);
  function getById(id) {
    service.getQuestionById(id, function (res) {
      var hasAnswer = true,
          canAnswer = true,
          canClose = false;
      if (res.answers && res.answers.length < 1) {
        hasAnswer = false;
      }
      if (parseInt(res.author._id) === user_id) {
        canAnswer = false;
        if (parseInt(res.status) !== 2) {
          canClose = true;
        }
      } else if (parseInt(res.status) === 2) {
        canAnswer = false;
      }
      if ((role === 4 || role === 5) && parseInt(res.status) !== 2) {
        canClose = true;
      }
      var data = {
        obj: res,
        hasAnswer: hasAnswer,
        canAnswer: canAnswer,
        canClose: canClose
      };
      $('#question').html(template('container', data));
      service.getExp(function (res) {
        $('#exp').text(res[0].value);
      });
    });
  }
});