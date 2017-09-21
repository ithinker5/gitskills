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
  //获取联盟详情
  getDepartById: function getDepartById(id, cb) {
    $http.get('/v1/departments/' + id, function (res) {
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
  getFactionList: function getFactionList(filter, cb) {
    if (filter) {
      $http.get('/v1/factions/' + filter, function (res) {
        cb([res]);
      });
    } else {
      $http.get('/v1/factions', function (res) {
        cb(res);
      });
    }
  },
  //新建帮会
  addFaction: function addFaction(obj, cb) {
    $http.post('/v1/factions', obj, function (res) {
      cb(res);
    });
  },
  //获取帮会详情
  getFactionById: function getFactionById(id, cb) {
    $http.get('/v1/factions/' + id, function (res) {
      cb(res);
    });
  },
  //修改帮会信息
  editFaction: function editFaction(id, obj, cb) {
    $http.put('/v1/factions/' + id, obj, function (res) {
      cb(res);
    });
  },
  //解散帮会
  deleteFaction: function deleteFaction(id, cb) {
    $http.delete('/v1/factions/' + id, function (res) {
      cb(res);
    });
  },
  //获取堂列表
  getTangList: function getTangList(filter, cb) {
    var url = filter || filter === 0 ? '/v1/sections?faction_id=' + filter : '/v1/sections';
    $http.get(url, function (res) {
      cb(res);
    });
  },
  //新建堂
  addTang: function addTang(obj, cb) {
    $http.post('/v1/sections', obj, function (res) {
      cb(res);
    });
  },
  //获取堂详情
  getTangById: function getTangById(id, cb) {
    $http.get('/v1/sections/' + id, function (res) {
      cb(res);
    });
  },
  //修改堂信息
  editTang: function editTang(id, obj, cb) {
    $http.put('/v1/sections/' + id, obj, function (res) {
      cb(res);
    });
  },
  //解散堂
  deleteTang: function deleteTang(id, cb) {
    $http.delete('/v1/sections/' + id, function (res) {
      cb(res);
    });
  },
  //获取员工列表
  getUserList: function getUserList(filter, cb) {
    var url = filter || filter === 0 ? '/v1/users?faction_id=' + filter : '/v1/users';
    $http.get(url, function (res) {
      cb(res);
    });
  },
  //新建员工
  addUser: function addUser(obj, cb) {
    $http.post('/v1/users', obj, function (res) {
      cb(res);
    });
  },
  //获取员工详情
  getUserById: function getUserById(id, cb) {
    $http.get('/v1/users/' + id, function (res) {
      cb(res);
    });
  },
  //修改员工信息
  editUser: function editUser(id, obj, cb) {
    $http.put('/v1/users/' + id, obj, function (res) {
      cb(res);
    });
  },
  //导入
  uploadFile: function uploadFile(id, cb, page) {
    $http.uploadFile('/v1/users/import', id, function (res) {
      cb(res);
    }, page);
  },
  //删除员工
  deleteUser: function deleteUser(id, cb) {
    $http.delete('/v1/users/' + id, function (res) {
      cb(res);
    });
  },
  //重置密码
  resetPsw: function resetPsw(id, cb) {
    $http.get('/v1/users/' + id + '/reset_password', function (res) {
      cb(res);
    });
  },
  //获取属性
  getProperties: function getProperties(cb) {
    $http.get('/v1/metrics', function (res) {
      cb(res);
    });
  },
  //修改属性信息
  editProperties: function editProperties(obj, cb) {
    $http.post('/v1/metrics', obj, function (res) {
      cb(res);
    });
  },
  //获取新手任务列表
  getNewPersonTaskList: function getNewPersonTaskList(cb) {
    $http.get('/v1/guides', function (res) {
      cb(res);
    });
  },
  //修改新手任务
  editNewPersonTaskList: function editNewPersonTaskList(id, obj, cb) {
    $http.put('/v1/guides/' + id, obj, function (res) {
      cb(res);
    });
  },
  //获取级别列表
  getLevelList: function getLevelList(cb) {
    $http.get('/v1/levels', function (res) {
      cb(res);
    });
  },
  //修改任务
  editLevelNumber: function editLevelNumber(obj, cb) {
    $http.post('/v1/levels', obj, function (res) {
      cb(res);
    });
  },
  //获取任务列表
  getTaskList: function getTaskList(cb) {
    $http.get('/v1/taskexp', function (res) {
      cb(res);
    });
  },
  //修改任务
  editTaskList: function editTaskList(id, obj, cb) {
    $http.put('/v1/taskexp/' + id, obj, function (res) {
      cb(res);
    });
  },
  //获取组织架构
  getStructure: function getStructure(cb) {
    $http.get('/v1/departments/1/structure', function (res) {
      cb(res);
    });
  }
};