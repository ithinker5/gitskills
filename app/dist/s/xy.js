'use strict';

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  //获取纠纷列表
  getJudgeList: function getJudgeList(cb) {
    $http.get('/v1/judges', function (res) {
      cb(res);
    });
  },
  //获取纠纷详情
  getJudgeById: function getJudgeById(id, cb) {
    $http.get('/v1/judges/' + id, function (res) {
      cb(res);
    });
  },
  //添加纠纷
  addJudge: function addJudge(obj, cb) {
    $http.post('/v1/judges', obj, function (res) {
      cb(res);
    });
  },
  //调节诉讼
  editJudge: function editJudge(id, obj, cb) {
    $http.put('/v1/judges/' + id, obj, function (res) {
      cb(res);
    });
  },
  //关闭诉讼
  getCloseJudge: function getCloseJudge(id, cb) {
    $http.put('/v1/judges/close/' + id, {}, function (res) {
      cb(res);
    });
  },
  //获取投诉列表
  getComplainList: function getComplainList(cb) {
    $http.get('/v1/complains', function (res) {
      cb(res);
    });
  },
  //获取投诉详情
  getComplainById: function getComplainById(id, cb) {
    $http.get('/v1/complains/' + id, function (res) {
      cb(res);
    });
  },
  //添加投诉
  addComplain: function addComplain(obj, cb) {
    $http.post('/v1/complains', obj, function (res) {
      cb(res);
    });
  },
  //调节投诉
  editComplain: function editComplain(id, obj, cb) {
    $http.put('/v1/complains/' + id, obj, function (res) {
      cb(res);
    });
  },
  //关闭投诉
  getCloseComplain: function getCloseComplain(id, cb) {
    $http.put('/v1/complains/close/' + id, {}, function (res) {
      cb(res);
    });
  }
};