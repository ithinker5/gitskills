let $http = new MID();
let SERVICE = function () {};
SERVICE.prototype = {
  //获取联盟列表
  getDepartList: (cb) => {
    $http.get(`/v1/departments`, (res) => {
      cb(res)
    })
  },
  //新建联盟
  addDepart: (obj, cb) => {
    $http.post('/v1/departments', obj, (res) => {
      cb(res)
    })
  },
  //修改联盟信息
  editDepart: (id, obj, cb) => {
    $http.put(`/v1/departments/${id}`, obj, (res) => {
      cb(res)
    })
  },
//获取帮会列表
  getFactionList: (cb) => {
    $http.get(`/v1/factions`, (res) => {
      cb(res)
    })
  },
  //新建帮会
  addFaction: (obj, cb) => {
    $http.post('/v1/factions', obj, (res) => {
      cb(res)
    })
  },
  //修改帮会信息
  editFaction: (id, obj, cb) => {
    $http.put(`/v1/factions/${id}`, obj, (res) => {
      cb(res)
    })
  },
  //获取堂列表
  getTangList: (faction_id,cb) => {
    $http.get(`/v1/factions/${faction_id}/sections`, (res) => {
      cb(res)
    })
  },
  //新建堂
  addTang: (faction_id,obj, cb) => {
    $http.post(`/v1/factions/${faction_id}/sections`, obj, (res) => {
      cb(res)
    })
  },
  //修改堂信息
  editTang: (id, faction_id, obj, cb) => {
    $http.put(`/v1/factions/${faction_id}/sections/${id}`, obj, (res) => {
      cb(res)
    })
  },
  //获取员工列表
  getUserList: (cb) => {
    $http.get(`/v1/users`, (res) => {
      cb(res)
    })
  },
  //新建员工
  addUser: (obj, cb) => {
    $http.post(`/v1/users`, obj, (res) => {
      cb(res)
    })
  },
  //修改员工信息
  editUser: (id, obj, cb) => {
    $http.put(`/v1/users/${id}`, obj, (res) => {
      cb(res)
    })
  }
};