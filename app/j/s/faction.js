let $http=new MID();
let SERVICE=function(){};
SERVICE.prototype= {
  //获取帮会信息
  getInfo: (id,cb) =>{
    $http.get(`/v1/factions/${id}`, (res) => {
      cb(res)
    })
  },
  //获取帮会成员信息
  getUsers: (id,cb) =>{
    $http.get(`/v1/members/faction/${id}`, (res) => {
      cb(res)
    })
  },
};