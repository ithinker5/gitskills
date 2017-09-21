"use strict";

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  //获取联盟信息
  getInfo: function getInfo(id, cb) {
    $http.get("/v1/departments/" + id, function (res) {
      cb(res);
    });
  }
};