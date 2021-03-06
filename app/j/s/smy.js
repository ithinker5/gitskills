const $http = new MID();
let SERVICE = function () {};
SERVICE.prototype = {
  //获取会议列表
  getList: (cb) => {
    $http.get(`/v1/council`, (res) => {
      cb(res)
    })
  },
  //创建会议
  add: (obj, cb) => {
    $http.post('/v1/council', obj, (res) => {
      cb(res)
    })
  },
  //修改会议
  edit: (id, obj, cb) => {
    $http.put(`/v1/council/${id}`, obj, (res) => {
      cb(res)
    })
  },
  //通过会议的id获取单条会议
  getById: (id, cb) => {
    $http.get(`/v1/council/${id}`, (res) => {
      cb(res)
    })
  },
  //上传图片
  uploadFile(id, cb){
    $http.uploadFile('/v1/council/upload', id, (res) => {
      cb(res)
    })
  },
  //批量删除会议
  delete: (obj, cb) => {
    $http.delete('/v1/council?ids='+ obj, (res) => {
      cb(res)
    })
  },
};