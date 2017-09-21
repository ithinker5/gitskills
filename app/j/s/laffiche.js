const $http = new MID();
let SERVICE = function () {
};
SERVICE.prototype = {
  //获取公告列表
  getList: (obj, cb) => {
    let url = '/v1/announcements';
    if (obj.faction_id) {
      url = `${url}?faction_id=${obj.faction_id}`
    } else if (obj.department_id) {
      url = `${url}?department_id=${obj.department_id}`
    }
    $http.get(url, (res) => {
      cb(res)
    })
  },
  /*getList: (id, cb) => {
    $http.get(`/v1/announcements?department_id=${id}`, (res) => {
      cb(res)
    })
  },*/
  //创建公告
  add: (obj, cb) => {
    $http.post('/v1/announcements', obj, (res) => {
      cb(res)
    })
  },
  //修改公告
  edit: (id, obj, cb) => {
    $http.put(`/v1/announcements/${id}`, obj, (res) => {
      cb(res)
    })
  },
  //通过公告的id获取单条公告
  getById: (id, cb) => {
    $http.get(`/v1/announcements/${id}`, (res) => {
      cb(res)
    })
  },
  //上传图片
  uploadFile(id, cb){
    $http.uploadFile('/v1/announcements/upload', id, (res) => {
      cb(res)
    })
  },
  //批量删除公告
  delete: (obj, cb) => {
    $http.delete('/v1/announcements?ids='+ obj, (res) => {
      cb(res)
    })
  },
};