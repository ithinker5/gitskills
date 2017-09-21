let $http = new MID();
let SERVICE = function () {};
SERVICE.prototype = {
  //通过联盟的id或者帮派的id获取任务列表
  getTasks: (obj, cb) => {
    let url = '/v1/tasks';
    if (obj.faction_id) {
      url = `${url}?faction_id=${obj.faction_id}`
    } else if (obj.department_id) {
      url = `${url}?department_id=${obj.department_id}`
    }else{
      url = `${url}`
    }
    //GET /v1/users/:user_id/tasks
    url = `${url}&type=${obj.type}`;
    $http.get(url, (res) => {
      cb(res)
    })
  },
  /*获取个人任务列表*/
  getPersonalTask:(obj,cb)=>{
    $http.get(`/v1/tasks?type=${obj.type}`, (res) => {
      cb(res)
    })
  },
  /*获取用户任务任务经历*/
  getUserTask:(cb)=>{
    $http.get(`/v1/tasks/loginer`, (res) => {
      cb(res)
    })
  },
  //创建任务
  add: (obj, cb) => {
    $http.post('/v1/tasks', obj, (res) => {
      cb(res)
    })
  },
  edit: (id, obj, cb) => {
    $http.put(`/v1/tasks/${id}`, obj, (res) => {
      cb(res)
    })
  },
  //通过任务的id获取任务的详情
  getById: (id, cb) => {
    $http.get(`/v1/tasks/${id}`, (res) => {
      cb(res)
    })
  },
  //通过任务的id删除任务
  delete: (id, cb) => {
    $http.delete(`/v1/tasks/${id}`, (res) => {
      cb(res)
    })
  },
  //通过任务的id获取任务文档
  getAssetByTaskId: (id, cb) => {
    $http.get(`/v1/task/${id}/assets`, (res) => {
      cb(res)
    })
  },
  //上传任务的文档
  addAssert: (fileDomId, cb) => {
    $http.uploadFile(`/v1/tasks/upload`, fileDomId, (res) => {
      cb(res)
    })
  },
  //删除文档，暂定
  deleteAssert: (id, cb) => {
    console.log('暂定')
  },
  //任务申请是否超过某个发布者的权限（暂定）
  isHasAuth: (name, cb) => {
    $http.get(`/v1/properties?name=${name}`, (res) => {
      cb(res)
    })
  },
  //获取帮派列表
  getFactions:(cb)=>{
    $http.get(`/v1/factions`, (res) => {
      cb(res)
    })
  },
  //获取团队列表
  /*getLeaders:(maxLevel,cb)=>{
    $http.get(`/v1/teams?grade=${maxLevel}`, (res) => {
      cb(res)
    })
  },*/
  //获取团队列表
  getLeadersFilter: function getLeadersFilter(obj, cb) {
    let url = `/v1/teams?maxGrade=${obj.maxGrade}`;
    if(obj.faction_id){
      url+=`&faction_id=${obj.faction_id}`
    }else if(obj.section_id){
      url+=`&section_id=${obj.section_id}`;
    }else if(obj.filter){
      url+=`&filter=${obj.filter}`;
    }
    if(obj.pitchTeams){
      url+=`&excludes=${obj.pitchTeams}`
    }
    $http.get(url, function (res) {
      cb(res);
    });
  },
  //选定任务完成人
  getTaskPerson:(id,obj,cb)=>{
    $http.post(`/v1/tasks/${id}/assign`,obj, (res) => {
      cb(res)
    })
  },
  //任务申请团队列表
  getApplication:(id,cb)=>{
    $http.get(`/v1/task/${id}/teams`, (res) => {
      cb(res)
    })
  },
  //用户参加的申请团队列表
  getUserJoin:(id,userId,cb)=>{
    $http.get(`/v1/task/${id}/joins/${userId}`, (res) => {
      cb(res)
    })
  },
  //获取任务变更历史记录
  getHistory:(id,cb)=>{
    $http.get(`/v1/task/${id}/events`, (res) => {
      cb(res)
    })
  },
  //取消申请，放弃任务
  getRevoke:(id,obj,cb)=>{
    $http.post(`/v1/tasks/${id}/revoke`,obj, (res) => {
      cb(res)
    })
  },
  /*获取团队成员列表*/
  getTeamsList: function (team_id,cb) {
    $http.get('/v1/members/team/'+team_id, (res) => {
      cb(res)
    })
  },
  /*任务申请抵押押金*/
  getPledgeGold: function (id,obj,cb) {
    $http.post(`/v1/tasks/${id}/apply`,obj, (res) => {
      cb(res)
    })
  },
  //获取经验配置
  getExpRole:function (cb) {
    $http.get('/v1/taskexp', (res) => {
      cb(res)
    })
  },
  /*获取团队信息*/
  getTeamsInfo: function (id,cb) {
    $http.get('/v1/teams/'+id, (res) => {
      cb(res)
    })
  },
  /*查看我的队伍*/
  getMyTeams: function (cb) {
    $http.get('/v1/teams/owner', (res) => {
      cb(res)
    })
  },
  /*创建队伍*/
  getCreateTeams: function (obj,cb) {
    $http.post('/v1/teams',obj, (res) => {
      cb(res)
    })
  },
  //退出任务
  quitTask:function (id,cb) {
    $http.post(`/v1/tasks/${id}/revoke`,{}, (res) => {
      cb(res)
    })
  },
  //任务奖励并评价接口
  getAwardTask:function(id,obj,cb){
    $http.post(`/v1/tasks/${id}/reward`,obj, (res) => {
      cb(res)
    })
  },
  //获取系统配置
  getProperties: function (cb) {
    $http.get('/v1/properties', (res) => {
      cb(res)
    })
  },
  getDepartmentInfo: (id,cb) =>{
    $http.get(`/v1/departments/${id}`, (res) => {
      cb(res);
    })
  },
  getFactionInfo: (id,cb) =>{
    $http.get(`/v1/factions/${id}`, (res) => {
      cb(res)
    })
  },
  /*获取堂信息*/
  getSectionsInfo: (id,cb) =>{
    $http.get(`/v1/sections/${id}`, (res) => {
      cb(res)
    })
  },
  /*查看成员个人信息*/
  getUserLeaderGrade:(id,cb)=>{
    $http.get(`/v1/users/${id}`, (res) => {
      cb(res)
    })
  },
  //完成新手任务指引
  getCompleteTask:(id,cb)=>{
    $http.post(`/v1/guides/${id}/complete`,{}, (res) => {
      cb(res)
    })
  },
  //获取服务器当前时间
  getTime: function (cb) {
    $http.get('/v1/time', (res) => {
      cb(res)
    })
  },
};