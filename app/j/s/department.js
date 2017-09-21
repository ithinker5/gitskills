let $http=new MID();
let SERVICE=function(){};
SERVICE.prototype= {
  //获取联盟信息
  getInfo: (id,cb) =>{
    $http.get(`/v1/departments/${id}`, (res) => {
      cb(res);
    })
  }
};