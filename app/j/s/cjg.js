let $http = new MID();
let SERVICE = function () {};
SERVICE.prototype = {
  //导入
  uploadFile:(id, cb, page)=>{
    $http.uploadFile('/v1/council/import', id, (res) => {
      cb(res)
    },page)
  },
  //导出
  exportFile:(cb)=>{
    $http.get('/v1/council/export', (res) => {
      cb(res)
    })
  },
  /*获取人员名单*/
  getMemberList: function (cb) {
    $http.get('/v1/users', (res) => {
      cb(res)
    })
  },
  /*修改人员vc及金币值*/
  getChangeMember: function (id,obj,cb) {
    $http.put(`/v1/users/${id}`,obj, (res) => {
      cb(res)
    })
  },
  /*获取任务列表*/
  getTaskList: function (cb) {
    $http.get('/v1/taskexp', (res) => {
      cb(res)
    })
  },
  /*修改任务列表*/
  changeTaskList: function (id,obj,cb) {
    $http.put(`/v1/taskexp/${id}`,obj, (res) => {
      cb(res)
    })
  },
  /*获取联盟信息*/
  getAllianceList: function (id,cb) {
    $http.get(`/v1/departments/${id}`, (res) => {
      cb(res)
    })
  },
  /*修改联盟信息*/
  changeAllianceList: function (id,obj,cb) {
    $http.put(`/v1/departments/${id}`,obj, (res) => {
      cb(res)
    })
  },
  /*获取帮会信息*/
  getFactionList: function (cb) {
    $http.get('/v1/factions', (res) => {
      cb(res)
    })
  },
  /*修改帮会信息*/
  changeFactionList: function (id,obj,cb) {
    $http.put(`/v1/factions/${id}`,obj, (res) => {
      cb(res)
    })
  },
  //获取系统配置
  getProperties: function (cb) {
    $http.get('/v1/properties', (res) => {
      cb(res)
    })
  },
  /*修改配置*/
  changeProperties: function (obj,cb) {
    $http.put('/v1/properties',obj, (res) => {
      cb(res)
    })
  },
  /*一键清零*/
  getClearing: function (cb) {
    $http.put('/v1/users/zeroClearing',{}, (res) => {
      cb(res)
    })
  },
  /*联盟清零*/
  getDepartClearing: function (cb) {
    $http.put('/v1/departments/zeroClearing',{}, (res) => {
      cb(res)
    })
  },
  /*帮派清零*/
  getFactionClearing: function (cb) {
    $http.put('/v1/factions/zeroClearing',{}, (res) => {
      cb(res)
    })
  },
};
