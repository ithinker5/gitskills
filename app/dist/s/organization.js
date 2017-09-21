'use strict';

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  getList: function getList(cb) {
    $http.get('/v1/departments', function (res) {
      cb(res);
    });
  },
  getList2: function getList2(cb) {
    $http.get('/v1/factions', function (res) {
      cb(res);
    });
  },
  getAlliance: function getAlliance(id, cb) {
    $http.get('/v1/departments/' + id, function (res) {
      cb(res);
    });
  },
  //通过联盟的id获取此联盟下的组织架构
  getStructure: function getStructure(id, cb) {
    $http.get('/v1/departments/' + id + '/structure', function (res) {
      cb(res);
    });
  },
  //通过帮会的id获取此联盟下的组织架构
  getStructure1: function getStructure1(id, cb) {
    $http.get('/v1/factions/' + id + '/structure', function (res) {
      cb(res);
    });
  }
};