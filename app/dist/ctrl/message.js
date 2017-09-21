'use strict';

$(function () {
  var service = new SERVICE();
  var role_id = parseInt(window.sessionStorage.getItem('role_id'));
  var user_id = parseInt(window.sessionStorage.getItem('user_id'));
  var receiver_id = 0;
  var currentUser = 0;
  var currentName = '';
  var userInput = '';
  $(document).on('click', '.users .item', function () {
    window.parent.playClickEffect();
    var $this = $(this);
    $this.siblings().removeClass('active');
    $(this).addClass('active');
    service.alreadyRead($this.data('id'), function (res) {
      getData(parseInt($this.data('id')), $this.data('name'), true);
    });
  });
  $(".btnBack").click(function () {
    window.parent.playClickEffect();
    window.parent.closeWebPop();
  });
  getData(currentUser, currentName, true);
  // setInterval(function () {
  //   if(role_id===4){
  //     userInput=$('#mangerSend').val()
  //   }else{
  //     userInput=$('#send').val()
  //   }
  //   service.alreadyRead(currentUser,res=>{
  //     getData(currentUser,currentName);
  //   });
  // },10000);
  $(document).on('click', '#submit', function () {
    window.parent.playClickEffect();
    sendMessage();
  });
  $("body").keydown(function (event) {
    if (event.ctrlKey && event.keyCode == 13) {
      var content = '';
      if (role_id === 4) {
        content = $('#mangerSend');
      } else {
        content = $('#send');
      }
      var text = content.val() + '\n';
      content.val(text);
    } else if (event.keyCode == 13) {
      event.cancelBubble = true;
      event.preventDefault();
      event.stopPropagation();
      sendMessage();
    }
  });
  function getData(id, name, canScoll) {
    if (role_id === 4) {
      var userList = [];
      service.getUserList(function (users) {
        if (users && users.length > 0) {
          for (var i = 0; i < users.length; i++) {
            if (parseInt(users[i].sender._id) !== user_id) {
              userList.push(users[i]);
            }
          }
          currentUser = userList[0].sender._id;
          currentName = userList[0].sender.name;
          $('footer').empty().append('\n          <div class="buttons" style="width: 97%;justify-content: flex-end">\n            <input id="submit" class="btnStyle" type="button" value="\u53D1\u9001"/>\n          </div>\n          ');
        } else {
          $('footer').empty();
        }
        if (id) {
          currentUser = id;
          currentName = name;
        }
        service.getMessageHistory(currentUser, function (res) {
          receiver_id = currentUser;
          var historyList = {};
          for (var _i = 0; _i < res.privateMsgList.length; _i++) {
            if (!historyList[dateChange(res.privateMsgList[_i].created_at)]) {
              historyList[dateChange(res.privateMsgList[_i].created_at)] = [res.privateMsgList[_i]];
            } else {
              historyList[dateChange(res.privateMsgList[_i].created_at)].push(res.privateMsgList[_i]);
            }
          }
          var data = {
            userList: userList,
            manager: true,
            dataObj: { hasHistory: JSON.stringify(historyList) != '{}', privateMsgList: historyList, receiver: res.receiver },
            user_id: user_id,
            currentUser: currentUser,
            currentName: currentName
          };
          var scroll = $('.history').scrollTop() || 0;
          $('#boxContainer').html(template('container', data));
          $('#mangerSend').val('').focus().val(userInput);
          chartLimit($('#mangerSend'), 500);
          if (canScoll) {
            $('.history').scrollTop($('.history')[0].scrollHeight);
          } else {
            $('.history').scrollTop(scroll);
          }
        });
      });
    } else {
      service.getMessageHistory(user_id, function (res) {
        receiver_id = res.receiver._id;
        var historyList = {};
        for (var i = 0; i < res.privateMsgList.length; i++) {
          if (!historyList[dateChange(res.privateMsgList[i].created_at)]) {
            historyList[dateChange(res.privateMsgList[i].created_at)] = [res.privateMsgList[i]];
          } else {
            historyList[dateChange(res.privateMsgList[i].created_at)].push(res.privateMsgList[i]);
          }
        }
        var data = {
          manager: false,
          dataObj: { hasHistory: JSON.stringify(historyList) != '{}', privateMsgList: historyList, receiver: res.receiver },
          user_id: user_id
        };
        var scroll = $('.history').scrollTop() || 0;
        $('#boxContainer').html(template('container', data));
        $('#send').val('').focus().val(userInput);
        chartLimit($('#send'), 500);
        if (canScoll) {
          $('.history').scrollTop($('.history')[0].scrollHeight);
        } else {
          $('.history').scrollTop(scroll);
        }
      });
    }
  }
  function sendMessage() {
    var content = '';
    if (role_id === 4) {
      content = $('#mangerSend');
    } else {
      content = $('#send');
    }
    errorTip(content);
    if (content.val()) {
      var text = content.val();
      content.val('').focus();
      service.sendMessage({ receiver_id: receiver_id, content: text }, function (res) {
        userInput = '';
        getData(currentUser, currentName, true);
      });
    }
  }
});