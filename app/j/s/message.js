let $http = new MID();
let SERVICE = function () {};
SERVICE.prototype = {
  //发送私信
  sendMessage: (obj, cb) => {
    $http.post('/v1/privateMessages', obj, (res) => {
      cb(res)
    })
  },
  //将私信消息置为已读
  alreadyRead: (userId, cb) => {
    $http.put(`/v1/privateMessages/${userId}`, {}, (res) => {
      cb(res)
    })
  },
  //获取聊天记录
  getMessageHistory: (userId, cb) => {
    $http.get(`/v1/privateMessages/${userId}`, (res) => {
      cb(res)
    })
  },
  //获取人员列表
  getUserList: (cb) => {
    $http.get(`/v1/privateMessages/usersList`, (res) => {
      cb(res)
    })
  }
};