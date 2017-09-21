'use strict';

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  //获取联盟列表
  getDepartList: function getDepartList(cb) {
    $http.get('/v1/departments', function (res) {
      cb(res);
    });
  },
  //新建联盟
  addDepart: function addDepart(obj, cb) {
    $http.post('/v1/departments', obj, function (res) {
      cb(res);
    });
  },
  //修改联盟信息
  editDepart: function editDepart(id, obj, cb) {
    $http.put('/v1/departments/' + id, obj, function (res) {
      cb(res);
    });
  },
  //获取帮会列表
  getFactionList: function getFactionList(cb) {
    $http.get('/v1/factions', function (res) {
      cb(res);
    });
  },
  //新建帮会
  addFaction: function addFaction(obj, cb) {
    $http.post('/v1/factions', obj, function (res) {
      cb(res);
    });
  },
  //修改帮会信息
  editFaction: function editFaction(id, obj, cb) {
    $http.put('/v1/factions/' + id, obj, function (res) {
      cb(res);
    });
  },
  //获取堂列表
  getTangList: function getTangList(faction_id, cb) {
    $http.get('/v1/factions/' + faction_id + '/sections', function (res) {
      cb(res);
    });
  },
  //新建堂
  addTang: function addTang(faction_id, obj, cb) {
    $http.post('/v1/factions/' + faction_id + '/sections', obj, function (res) {
      cb(res);
    });
  },
  //修改堂信息
  editTang: function editTang(id, faction_id, obj, cb) {
    $http.put('/v1/factions/' + faction_id + '/sections/' + id, obj, function (res) {
      cb(res);
    });
  },
  //获取员工列表
  getUserList: function getUserList(cb) {
    $http.get('/v1/users', function (res) {
      cb(res);
    });
  },
  //新建员工
  addUser: function addUser(obj, cb) {
    $http.post('/v1/users', obj, function (res) {
      cb(res);
    });
  },
  //修改员工信息
  editUser: function editUser(id, obj, cb) {
    $http.put('/v1/users/' + id, obj, function (res) {
      cb(res);
    });
  }
};