'use strict';

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  //获取公告列表
  getList: function getList(obj, cb) {
    var url = '/v1/announcements';
    if (obj.faction_id) {
      url = url + '?faction_id=' + obj.faction_id;
    } else if (obj.department_id) {
      url = url + '?department_id=' + obj.department_id;
    }
    $http.get(url, function (res) {
      cb(res);
    });
  },
  /*getList: (id, cb) => {
    $http.get(`/v1/announcements?department_id=${id}`, (res) => {
      cb(res)
    })
  },*/
  //创建公告
  add: function add(obj, cb) {
    $http.post('/v1/announcements', obj, function (res) {
      cb(res);
    });
  },
  //修改公告
  edit: function edit(id, obj, cb) {
    $http.put('/v1/announcements/' + id, obj, function (res) {
      cb(res);
    });
  },
  //通过公告的id获取单条公告
  getById: function getById(id, cb) {
    $http.get('/v1/announcements/' + id, function (res) {
      cb(res);
    });
  },
  //上传图片
  uploadFile: function uploadFile(id, cb) {
    $http.uploadFile('/v1/announcements/upload', id, function (res) {
      cb(res);
    });
  },

  //批量删除公告
  delete: function _delete(obj, cb) {
    $http.delete('/v1/announcements?ids=' + obj, function (res) {
      cb(res);
    });
  }
};