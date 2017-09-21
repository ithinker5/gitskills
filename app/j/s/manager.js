let $http = new MID();
let SERVICE = function () {
};
SERVICE.prototype = {
  //获取联盟列表
  getDepartList: (cb) => {
    $http.get(`/v1/departments`, (res) => {
      cb(res)
    })
  },
  //获取联盟详情
  getDepartById: (id, cb) => {
    $http.get(`/v1/departments/${id}`, (res) => {
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
  getFactionList: (filter, cb) => {
    if (filter) {
      $http.get(`/v1/factions/${filter}`, (res) => {
        cb([res])
      })
    } else {
      $http.get(`/v1/factions`, (res) => {
        cb(res)
      })
    }
  },
  //新建帮会
  addFaction: (obj, cb) => {
    $http.post('/v1/factions', obj, (res) => {
      cb(res)
    })
  },
  //获取帮会详情
  getFactionById: (id, cb) => {
    $http.get(`/v1/factions/${id}`, (res) => {
      cb(res)
    })
  },
  //修改帮会信息
  editFaction: (id, obj, cb) => {
    $http.put(`/v1/factions/${id}`, obj, (res) => {
      cb(res)
    })
  },
  //解散帮会
  deleteFaction: (id, cb) => {
    $http.delete(`/v1/factions/${id}`, (res) => {
      cb(res)
    })
  },
  //获取堂列表
  getTangList: (filter, cb) => {
    let url = (filter || filter === 0) ? `/v1/sections?faction_id=${filter}` : '/v1/sections';
    $http.get(url, (res) => {
      cb(res)
    })
  },
  //新建堂
  addTang: (obj, cb) => {
    $http.post(`/v1/sections`, obj, (res) => {
      cb(res)
    })
  },
  //获取堂详情
  getTangById: (id, cb) => {
    $http.get(`/v1/sections/${id}`, (res) => {
      cb(res)
    })
  },
  //修改堂信息
  editTang: (id, obj, cb) => {
    $http.put(`/v1/sections/${id}`, obj, (res) => {
      cb(res)
    })
  },
  //解散堂
  deleteTang: (id, cb) => {
    $http.delete(`/v1/sections/${id}`, (res) => {
      cb(res)
    })
  },
  //获取员工列表
  getUserList: (filter, cb) => {
    let url = (filter || filter === 0) ? `/v1/users?faction_id=${filter}` : '/v1/users';
    $http.get(url, (res) => {
      cb(res)
    })
  },
  //新建员工
  addUser: (obj, cb) => {
    $http.post(`/v1/users`, obj, (res) => {
      cb(res)
    })
  },
  //获取员工详情
  getUserById: (id, cb) => {
    $http.get(`/v1/users/${id}`, (res) => {
      cb(res)
    })
  },
  //修改员工信息
  editUser: (id, obj, cb) => {
    $http.put(`/v1/users/${id}`, obj, (res) => {
      cb(res)
    })
  },
  //导入
  uploadFile:(id, cb, page)=>{
    $http.uploadFile('/v1/users/import', id, (res) => {
      cb(res)
    },page)
  },
  //删除员工
  deleteUser: (id, cb) => {
    $http.delete(`/v1/users/${id}`, (res) => {
      cb(res)
    })
  },
  //重置密码
  resetPsw: (id, cb) => {
    $http.get(`/v1/users/${id}/reset_password`, (res) => {
      cb(res)
    })
  },
  //获取属性
  getProperties: (cb) => {
    $http.get('/v1/metrics', (res) => {
      cb(res)
    })
  },
  //修改属性信息
  editProperties: (obj, cb) => {
    $http.post(`/v1/metrics`, obj, (res) => {
      cb(res)
    })
  },
  //获取新手任务列表
  getNewPersonTaskList: (cb) => {
    $http.get(`/v1/guides`, (res) => {
      cb(res)
    })
  },
  //修改新手任务
  editNewPersonTaskList: (id, obj, cb) => {
    $http.put(`/v1/guides/${id}`, obj, (res) => {
      cb(res)
    })
  },
  //获取级别列表
  getLevelList: (cb) => {
    $http.get(`/v1/levels`, (res) => {
      cb(res)
    })
  },
  //修改任务
  editLevelNumber: (obj, cb) => {
    $http.post(`/v1/levels`, obj, (res) => {
      cb(res)
    })
  },
  //获取任务列表
  getTaskList: (cb) => {
    $http.get(`/v1/taskexp`, (res) => {
      cb(res)
    })
  },
  //修改任务
  editTaskList: (id, obj, cb) => {
    $http.put(`/v1/taskexp/${id}`, obj, (res) => {
      cb(res)
    })
  },
  //获取组织架构
  getStructure: (cb) => {
    $http.get(`/v1/departments/1/structure`, (res) => {
      cb(res)
    })
  },
};