let $http = new MID();
let SERVICE = function () {
};
SERVICE.prototype = {
  /*获取队伍*/
  getTeams: function (cb) {
    $http.get('/v1/teams', (res) => {
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
  getCreateTeams: function (obj, cb) {
    $http.post('/v1/teams', obj, (res) => {
      cb(res)
    })
  },
  /*修改队伍*/
  getChangeTeams: function (id, obj, cb) {
    $http.put('/v1/teams/' + id, obj, (res) => {
      cb(res)
    })
  },
  /*获取团队信息*/
  getTeamsInfo: function (id, cb) {
    $http.get('/v1/teams/' + id, (res) => {
      cb(res)
    })
  },
  /*获取团队接取得任务*/
  getTeamsTasks: function (id, cb) {
    $http.get('/v1/team/' + id + '/tasks', (res) => {
      cb(res)
    })
  },
  /*获取团队成员列表*/
  getTeamsList: function (team_id, cb) {
    $http.get('/v1/members/team/' + team_id, (res) => {
      cb(res)
    })
  },
  /*招募队员*/
  getRecruit: function (obj, cb) {
    $http.post('/v1/members/team', obj, (res) => {
      cb(res)
    })
  },
  /*解散队员或者退出队伍*/
  getDeleteTeams: function (_ids, cb) {
    $http.delete('/v1/members/team?ids=' + _ids, (res) => {
      cb(res)
    })
  },
  /*队伍获得的积分详细*/
  getIntegral: function (id, cb) {
    $http.get('/v1/team/' + id + '/gains', (res) => {
      cb(res)
    })
  },
  /*获取总用户信息*/
  getList: function (id, cb) {
    $http.get('/v1/users?excludes=' + id, (res) => {
      cb(res)
    })
  },
  /*获取用户信息*/
  getListInfo: function (id, cb) {
    $http.get('/v1/users/' + id, (res) => {
      cb(res)
    })
  },
  addMessage: function (obj, cb) {
    $http.post('/v1/messages', obj, (res) => {
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
