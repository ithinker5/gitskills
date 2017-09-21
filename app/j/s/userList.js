const $http=new MID();
let SERVICE=function(){};
SERVICE.prototype= {
  getList: function (cb) {
    $http.get('/v1/users', (res) => {
      cb(res)
    })
  }
};
