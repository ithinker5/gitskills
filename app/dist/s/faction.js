"use strict";

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  //获取帮会信息
  getInfo: function getInfo(id, cb) {
    $http.get("/v1/factions/" + id, function (res) {
      cb(res);
    });
  },
  //获取帮会成员信息
  getUsers: function getUsers(id, cb) {
    $http.get("/v1/members/faction/" + id, function (res) {
      cb(res);
    });
  }
};