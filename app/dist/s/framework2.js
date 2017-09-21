"use strict";

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  /*联盟*/
  getMember: function getMember(id, cb) {
    $http.get("/v1/members/department/" + id, function (res) {
      cb(res);
    });
  },
  /*帮会*/
  getMember1: function getMember1(id, cb) {
    $http.get("/v1/factions/" + id + "/members", function (res) {
      cb(res);
    });
  }
};