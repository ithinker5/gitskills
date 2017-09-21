'use strict';

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  //新手任务列表
  getRedList: function getRedList(cb) {
    $http.get('/v1/rank/red', function (res) {
      cb(res);
    });
  },
  getBlackList: function getBlackList(cb) {
    $http.get('/v1/rank/black', function (res) {
      cb(res);
    });
  },
  getHitList: function getHitList(cb) {
    $http.get('/v1/blacklist', function (res) {
      cb(res);
    });
  },
  /*获取人员名单*/
  getMemberList: function getMemberList(cb) {
    $http.get('/v1/users', function (res) {
      cb(res);
    });
  },
  /*添加黑名单*/
  getAddBlackList: function getAddBlackList(obj, cb) {
    $http.post('/v1/blacklist', obj, function (res) {
      cb(res);
    });
  },
  /*移除黑名单*/
  getDeleteBlackList: function getDeleteBlackList(id, cb) {
    $http.delete('/v1/blacklist/' + id, function (res) {
      cb(res);
    });
  },
  //获取服务器当前时间
  getTime: function getTime(cb) {
    $http.get('/v1/time', function (res) {
      cb(res);
    });
  }
};