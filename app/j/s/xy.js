const $http = new MID();
let SERVICE = function () {};
SERVICE.prototype = {
  //获取纠纷列表
  getJudgeList: (cb) => {
    $http.get(`/v1/judges`, (res) => {
      cb(res)
    })
  },
  //获取纠纷详情
  getJudgeById: (id,cb) => {
    $http.get(`/v1/judges/${id}`, (res) => {
      cb(res)
    })
  },
  //添加纠纷
  addJudge: (obj, cb) => {
    $http.post('/v1/judges', obj, (res) => {
      cb(res)
    })
  },
  //调节诉讼
  editJudge: (id, obj, cb) => {
    $http.put(`/v1/judges/${id}`, obj, (res) => {
      cb(res)
    })
  },
  //关闭诉讼
  getCloseJudge: (id, cb) => {
    $http.put(`/v1/judges/close/${id}`, {},(res) => {
      cb(res)
    })
  },
  //获取投诉列表
  getComplainList: (cb) => {
    $http.get(`/v1/complains`, (res) => {
      cb(res)
    })
  },
  //获取投诉详情
  getComplainById: (id,cb) => {
    $http.get(`/v1/complains/${id}`, (res) => {
      cb(res)
    })
  },
  //添加投诉
  addComplain: (obj, cb) => {
    $http.post('/v1/complains', obj, (res) => {
      cb(res)
    })
  },
  //调节投诉
  editComplain: (id, obj, cb) => {
    $http.put(`/v1/complains/${id}`, obj, (res) => {
      cb(res)
    })
  },
  //关闭投诉
  getCloseComplain: (id, cb) => {
    $http.put(`/v1/complains/close/${id}`, {},(res) => {
      cb(res)
    })
  }
};