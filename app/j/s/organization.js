var $http=new MID();
var SERVICE=function(){};
SERVICE.prototype= {
  getList: function (cb) {
    $http.get('/v1/departments', (res) => {
      cb(res)
    })
  },
  getList2: function (cb) {
    $http.get('/v1/factions', (res) => {
      cb(res)
    })
  },
  getAlliance: function (id,cb) {
    $http.get('/v1/departments/'+id, (res) => {
      cb(res)
    })
  },
  //通过联盟的id获取此联盟下的组织架构
  getStructure: function (id,cb) {
    $http.get(`/v1/departments/${id}/structure`, (res) => {
      cb(res)
    })
  },
  //通过帮会的id获取此联盟下的组织架构
  getStructure1: function (id,cb) {
    $http.get(`/v1/factions/${id}/structure`, (res) => {
      cb(res)
    })
  }
};
