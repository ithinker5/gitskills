'use strict';

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  //发送私信
  sendMessage: function sendMessage(obj, cb) {
    $http.post('/v1/privateMessages', obj, function (res) {
      cb(res);
    });
  },
  //将私信消息置为已读
  alreadyRead: function alreadyRead(userId, cb) {
    $http.put('/v1/privateMessages/' + userId, {}, function (res) {
      cb(res);
    });
  },
  //获取聊天记录
  getMessageHistory: function getMessageHistory(userId, cb) {
    $http.get('/v1/privateMessages/' + userId, function (res) {
      cb(res);
    });
  },
  //获取人员列表
  getUserList: function getUserList(cb) {
    $http.get('/v1/privateMessages/usersList', function (res) {
      cb(res);
    });
  }
};