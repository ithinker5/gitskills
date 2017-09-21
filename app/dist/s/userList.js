'use strict';

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  getList: function getList(cb) {
    $http.get('/v1/users', function (res) {
      cb(res);
    });
  }
};