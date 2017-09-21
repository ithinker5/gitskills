'use strict';

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  //导入
  uploadFile: function uploadFile(id, cb, page) {
    $http.uploadFile('/v1/council/import', id, function (res) {
      cb(res);
    }, page);
  },
  //导出
  exportFile: function exportFile(cb) {
    $http.get('/v1/council/export', function (res) {
      cb(res);
    });
  },
  /*获取人员名单*/
  getMemberList: function getMemberList(cb) {
    $http.get('/v1/users', function (res) {
      cb(res);
    });
  },
  /*修改人员vc及金币值*/
  getChangeMember: function getChangeMember(id, obj, cb) {
    $http.put('/v1/users/' + id, obj, function (res) {
      cb(res);
    });
  },
  /*获取任务列表*/
  getTaskList: function getTaskList(cb) {
    $http.get('/v1/taskexp', function (res) {
      cb(res);
    });
  },
  /*修改任务列表*/
  changeTaskList: function changeTaskList(id, obj, cb) {
    $http.put('/v1/taskexp/' + id, obj, function (res) {
      cb(res);
    });
  },
  /*获取联盟信息*/
  getAllianceList: function getAllianceList(id, cb) {
    $http.get('/v1/departments/' + id, function (res) {
      cb(res);
    });
  },
  /*修改联盟信息*/
  changeAllianceList: function changeAllianceList(id, obj, cb) {
    $http.put('/v1/departments/' + id, obj, function (res) {
      cb(res);
    });
  },
  /*获取帮会信息*/
  getFactionList: function getFactionList(cb) {
    $http.get('/v1/factions', function (res) {
      cb(res);
    });
  },
  /*修改帮会信息*/
  changeFactionList: function changeFactionList(id, obj, cb) {
    $http.put('/v1/factions/' + id, obj, function (res) {
      cb(res);
    });
  },
  //获取系统配置
  getProperties: function getProperties(cb) {
    $http.get('/v1/properties', function (res) {
      cb(res);
    });
  },
  /*修改配置*/
  changeProperties: function changeProperties(obj, cb) {
    $http.put('/v1/properties', obj, function (res) {
      cb(res);
    });
  },
  /*一键清零*/
  getClearing: function getClearing(cb) {
    $http.put('/v1/users/zeroClearing', {}, function (res) {
      cb(res);
    });
  },
  /*联盟清零*/
  getDepartClearing: function getDepartClearing(cb) {
    $http.put('/v1/departments/zeroClearing', {}, function (res) {
      cb(res);
    });
  },
  /*帮派清零*/
  getFactionClearing: function getFactionClearing(cb) {
    $http.put('/v1/factions/zeroClearing', {}, function (res) {
      cb(res);
    });
  }
};