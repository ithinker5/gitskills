var $http=new MID();
var SERVICE=function(){};
SERVICE.prototype= {
  getList: function (type, cb) {
    $http.get('/v1/tasks?type='+type, (res) => {
      cb(res)
    })
  }
};
