'use strict';

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  //获取会议列表
  getList: function getList(cb) {
    $http.get('/v1/council', function (res) {
      cb(res);
    });
  },
  //创建会议
  add: function add(obj, cb) {
    $http.post('/v1/council', obj, function (res) {
      cb(res);
    });
  },
  //修改会议
  edit: function edit(id, obj, cb) {
    $http.put('/v1/council/' + id, obj, function (res) {
      cb(res);
    });
  },
  //通过会议的id获取单条会议
  getById: function getById(id, cb) {
    $http.get('/v1/council/' + id, function (res) {
      cb(res);
    });
  },
  //上传图片
  uploadFile: function uploadFile(id, cb) {
    $http.uploadFile('/v1/council/upload', id, function (res) {
      cb(res);
    });
  },

  //批量删除会议
  delete: function _delete(obj, cb) {
    $http.delete('/v1/council?ids=' + obj, function (res) {
      cb(res);
    });
  }
};