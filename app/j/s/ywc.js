const $http = new MID();
let SERVICE = function () {};
SERVICE.prototype = {
  //获取问题列表
  getQuestionList: (cb) => {
    $http.get(`/v1/questions`, (res) => {
      cb(res)
    })
  },
  //创建问题
  addQuestion: (obj, cb) => {
    $http.post('/v1/questions', obj, (res) => {
      cb(res)
    })
  },
  //修改问题
  editQuestion: (id, obj, cb) => {
    $http.post(`/v1/questions/${id}/answer`, obj, (res) => {
      cb(res)
    })
  },
  //关闭问题
  closeQuestion: (id,cb) => {
    $http.put(`/v1/questions/${id}`, {},(res) => {
      cb(res)
    })
  },
  //获取单条问题
  getQuestionById: (id, cb) => {
    $http.get(`/v1/questions/${id}`, (res) => {
      cb(res)
    })
  },
  //获取经验值
  getExp: (cb) => {
    $http.get(`/v1/properties?name=question_exp`, (res) => {
      cb(res)
    })
  },
  //新手任务列表
  getNewTaskList:(cb)=>{
    $http.get(`/v1/guides`, (res) => {
      cb(res)
    })
  },
  //新手指引完成情况表
  getNewTaskComplete:(id,cb)=>{
    $http.get(`/v1/users/${id}/guides`, (res) => {
      cb(res)
    })
  },
  //领取奖励
  getAward:(id,cb)=>{
    $http.post(`/v1/guides/${id}/reward`,{}, (res) => {
      cb(res)
    })
  },
  //完成新手任务指引
  getCompleteTask:(id,cb)=>{
    $http.post(`/v1/guides/${id}/complete`,{}, (res) => {
      cb(res)
    })
  }
};