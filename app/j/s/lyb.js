const $http = new MID();
let SERVICE = function () {};
SERVICE.prototype = {
  //新手任务列表
  getRedList:(cb)=>{
    $http.get(`/v1/rank/red`, (res) => {
      cb(res)
    })
  },
  getBlackList:(cb)=>{
    $http.get(`/v1/rank/black`, (res) => {
      cb(res)
    })
  },
  getHitList:(cb)=>{
    $http.get(`/v1/blacklist`, (res) => {
      cb(res)
    })
  },
  /*获取人员名单*/
  getMemberList: function (cb) {
    $http.get('/v1/users', (res) => {
      cb(res)
    })
  },
  /*添加黑名单*/
  getAddBlackList: function (obj,cb) {
    $http.post('/v1/blacklist',obj, (res) => {
      cb(res)
    })
  },
  /*移除黑名单*/
  getDeleteBlackList: function (id,cb) {
    $http.delete(`/v1/blacklist/${id}`, (res) => {
      cb(res)
    })
  },
  //获取服务器当前时间
  getTime: function (cb) {
    $http.get('/v1/time', (res) => {
      cb(res)
    })
  },
};