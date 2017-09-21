'use strict';

$(function () {
  var service = new SERVICE();
  var user_id = parseInt(window.sessionStorage.getItem('user_id'));
  var role = parseInt(window.sessionStorage.getItem('role_id'));
  var id = getUrlParam('id');
  var fromPage = getUrlParam('fromPage');
  chartLimit($('#answer'), 2);
  getById(id);
  function getById(id) {
    if (fromPage === 'judge') {
      service.getJudgeById(id, function (res) {
        var hasAnswer = true,
            canAnswer = true,
            canClose = false;
        if (!res.judge) {
          hasAnswer = false;
        } else {
          canAnswer = false;
        }
        if (parseInt(res.author._id) === user_id) {
          canAnswer = false;
          if (parseInt(res.status) !== 2) {
            canClose = true;
          }
        } else if (parseInt(res.status) === 2 || role !== 4 && role !== 5) {
          canAnswer = false;
        }
        if ((role === 4 || role === 5) && parseInt(res.status) !== 2) {
          canClose = true;
        }
        var data = {
          obj: res,
          hasAnswer: hasAnswer,
          fromPage: fromPage,
          canAnswer: canAnswer,
          canClose: canClose
        };
        $('#container').html(template('dataContainer', data));
      });
    } else {
      service.getComplainById(id, function (res) {
        var hasAnswer = true,
            canAnswer = true,
            canClose = false;
        if (!res.reply) {
          hasAnswer = false;
        } else {
          canAnswer = false;
        }
        if (parseInt(res.author._id) === user_id) {
          canAnswer = false;
          if (parseInt(res.status) !== 2) {
            canClose = true;
          }
        } else if (parseInt(res.status) === 2 || role !== 4 && role !== 5) {
          canAnswer = false;
        }
        if ((role === 4 || role === 5) && parseInt(res.status) !== 2) {
          canClose = true;
        }
        var data = {
          obj: res,
          hasAnswer: hasAnswer,
          fromPage: fromPage,
          canAnswer: canAnswer,
          canClose: canClose
        };
        $('#container').html(template('dataContainer', data));
      });
    }
  }
  $(document).on('click', '.btnBack', function () {
    window.parent.playClickEffect();
    window.location.href = 'list.html?fromPage=' + fromPage;
  });
  $(document).on('click', '#close', function () {
    window.parent.playClickEffect();
    var titleText = fromPage === 'judge' ? '关闭诉讼' : '关闭投诉';
    var introText = fromPage === 'judge' ? '您确认要关闭此诉讼吗?' : '您确认要关闭此投诉吗?';
    confirmAgain({
      title: titleText,
      content: {
        text: introText
      },
      btns: [{ domId: 'cancelAnswer', text: '取消' }, { domId: 'confirm', text: '确定', event: close }]
    });
  });
  $(document).on('click', '#edit', function () {
    window.parent.playClickEffect();
    $('#toAnswer').removeClass('dis_n');
    var btnText = fromPage === 'judge' ? '提&nbsp;&nbsp;交' : '回&nbsp;&nbsp;复';
    $('#footer').empty().append('\n    <input id="cancel" class="btnStyle subBtn" type="button" value="\u53D6&nbsp;&nbsp;\u6D88"/>\n    <input id="submit" class="btnStyle subBtn" type="button" value=' + btnText + ' />\n    ');
  });
  $(document).on('click', '#submit', function () {
    window.parent.playClickEffect();
    var answer = $("#answer");
    errorTip(answer);
    var titleText = fromPage === 'judge' ? '调解' : '回复投诉';
    var introText = fromPage === 'judge' ? '您确认要提交此调解方案吗?' : '您确认要回复此投诉吗?';
    if (answer.val()) {
      confirmAgain({
        title: titleText,
        content: {
          text: introText
        },
        btns: [{ domId: 'cancelAnswer', text: '取消' }, { domId: 'confirm', text: '确定', event: edit }]
      });
    }
  });
  $(document).on('click', '#cancel', function () {
    window.parent.playClickEffect();
    $('#toAnswer').addClass('dis_n');
    $('#answer').val('');
    if (role === 4 || role === 5) {
      var closeBtnText = fromPage === 'judge' ? '关闭诉讼' : '关闭投诉';
      var answerBtnText = fromPage === 'judge' ? '调&nbsp;&nbsp;解' : '回&nbsp;&nbsp;答';
      $('#footer').empty().append('\n    <input id="close" class="btnStyle subBtn" type="button" value=' + closeBtnText + ' />\n    <input id="edit" class="btnStyle subBtn" type="button" value=' + answerBtnText + ' />\n    ');
    } else {
      var _answerBtnText = fromPage === 'judge' ? '调&nbsp;&nbsp;解' : '回&nbsp;&nbsp;答';
      $('#footer').empty().append('\n    <input id="edit" class="btnStyle subBtn" type="button" value=' + _answerBtnText + '/>\n    ');
    }
  });
  function edit() {
    if (fromPage === 'judge') {
      service.editJudge(id, { judge: $('#answer').val() }, function (res) {
        $('#toAnswer').addClass('dis_n');
        $('#answer').val('');
        getById(id);
      });
    } else {
      service.editComplain(id, { reply: $('#answer').val() }, function (res) {
        $('#toAnswer').addClass('dis_n');
        $('#answer').val('');
        getById(id);
      });
    }
  }
  function close() {
    if (fromPage === 'judge') {
      service.getCloseJudge(id, function () {
        getById(id);
      });
    } else {
      service.getCloseComplain(id, function () {
        getById(id);
      });
    }
  }
});