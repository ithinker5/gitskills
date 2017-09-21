const $http = new MID();
let SERVICE = function () {
};
SERVICE.prototype = {
  //获取属性
  getProperties: (cb) => {
    $http.get('/v1/metrics', (res) => {
      cb(res)
    })
  },
  //获取达人榜列表
  getList: (type, cb) => {
    $http.get(`/v1/talents?type=${type}`, (res) => {
      cb(res)
    })
  }
};