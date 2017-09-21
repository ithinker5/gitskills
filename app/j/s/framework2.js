let $http=new MID();
let SERVICE=function(){};
SERVICE.prototype= {
  /*联盟*/
  getMember: function (id,cb) {
    $http.get(`/v1/members/department/${id}`, (res) => {
      cb(res)
    })
  },
  /*帮会*/
  getMember1: function (id,cb) {
    $http.get(`/v1/factions/${id}/members`, (res) => {
      cb(res)
    })
  }
};