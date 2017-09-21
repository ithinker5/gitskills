'use strict';

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  //获取属性
  getProperties: function getProperties(cb) {
    $http.get('/v1/metrics', function (res) {
      cb(res);
    });
  },
  //获取达人榜列表
  getList: function getList(type, cb) {
    $http.get('/v1/talents?type=' + type, function (res) {
      cb(res);
    });
  }
};