'use strict';

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  getList: function getList(type, cb) {
    $http.get('/v1/tasks?type=' + type, function (res) {
      cb(res);
    });
  }
};