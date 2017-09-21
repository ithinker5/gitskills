'use strict';

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  //通过联盟的id或者帮派的id获取任务列表
  getTasks: function getTasks(obj, cb) {
    var url = '/v1/tasks';
    if (obj.faction_id) {
      url = url + '?faction_id=' + obj.faction_id;
    } else if (obj.department_id) {
      url = url + '?department_id=' + obj.department_id;
    } else {
      url = '' + url;
    }
    //GET /v1/users/:user_id/tasks
    url = url + '&type=' + obj.type;
    $http.get(url, function (res) {
      cb(res);
    });
  },
  /*获取个人任务列表*/
  getPersonalTask: function getPersonalTask(obj, cb) {
    $http.get('/v1/tasks?type=' + obj.type, function (res) {
      cb(res);
    });
  },
  /*获取用户任务任务经历*/
  getUserTask: function getUserTask(cb) {
    $http.get('/v1/tasks/loginer', function (res) {
      cb(res);
    });
  },
  //创建任务
  add: function add(obj, cb) {
    $http.post('/v1/tasks', obj, function (res) {
      cb(res);
    });
  },
  edit: function edit(id, obj, cb) {
    $http.put('/v1/tasks/' + id, obj, function (res) {
      cb(res);
    });
  },
  //通过任务的id获取任务的详情
  getById: function getById(id, cb) {
    $http.get('/v1/tasks/' + id, function (res) {
      cb(res);
    });
  },
  //通过任务的id删除任务
  delete: function _delete(id, cb) {
    $http.delete('/v1/tasks/' + id, function (res) {
      cb(res);
    });
  },
  //通过任务的id获取任务文档
  getAssetByTaskId: function getAssetByTaskId(id, cb) {
    $http.get('/v1/task/' + id + '/assets', function (res) {
      cb(res);
    });
  },
  //上传任务的文档
  addAssert: function addAssert(fileDomId, cb) {
    $http.uploadFile('/v1/tasks/upload', fileDomId, function (res) {
      cb(res);
    });
  },
  //删除文档，暂定
  deleteAssert: function deleteAssert(id, cb) {
    console.log('暂定');
  },
  //任务申请是否超过某个发布者的权限（暂定）
  isHasAuth: function isHasAuth(name, cb) {
    $http.get('/v1/properties?name=' + name, function (res) {
      cb(res);
    });
  },
  //获取帮派列表
  getFactions: function getFactions(cb) {
    $http.get('/v1/factions', function (res) {
      cb(res);
    });
  },
  //获取团队列表
  /*getLeaders:(maxLevel,cb)=>{
    $http.get(`/v1/teams?grade=${maxLevel}`, (res) => {
      cb(res)
    })
  },*/
  //获取团队列表
  getLeadersFilter: function getLeadersFilter(obj, cb) {
    var url = '/v1/teams?maxGrade=' + obj.maxGrade;
    if (obj.faction_id) {
      url += '&faction_id=' + obj.faction_id;
    } else if (obj.section_id) {
      url += '&section_id=' + obj.section_id;
    } else if (obj.filter) {
      url += '&filter=' + obj.filter;
    }
    if (obj.pitchTeams) {
      url += '&excludes=' + obj.pitchTeams;
    }
    $http.get(url, function (res) {
      cb(res);
    });
  },
  //选定任务完成人
  getTaskPerson: function getTaskPerson(id, obj, cb) {
    $http.post('/v1/tasks/' + id + '/assign', obj, function (res) {
      cb(res);
    });
  },
  //任务申请团队列表
  getApplication: function getApplication(id, cb) {
    $http.get('/v1/task/' + id + '/teams', function (res) {
      cb(res);
    });
  },
  //用户参加的申请团队列表
  getUserJoin: function getUserJoin(id, userId, cb) {
    $http.get('/v1/task/' + id + '/joins/' + userId, function (res) {
      cb(res);
    });
  },
  //获取任务变更历史记录
  getHistory: function getHistory(id, cb) {
    $http.get('/v1/task/' + id + '/events', function (res) {
      cb(res);
    });
  },
  //取消申请，放弃任务
  getRevoke: function getRevoke(id, obj, cb) {
    $http.post('/v1/tasks/' + id + '/revoke', obj, function (res) {
      cb(res);
    });
  },
  /*获取团队成员列表*/
  getTeamsList: function getTeamsList(team_id, cb) {
    $http.get('/v1/members/team/' + team_id, function (res) {
      cb(res);
    });
  },
  /*任务申请抵押押金*/
  getPledgeGold: function getPledgeGold(id, obj, cb) {
    $http.post('/v1/tasks/' + id + '/apply', obj, function (res) {
      cb(res);
    });
  },
  //获取经验配置
  getExpRole: function getExpRole(cb) {
    $http.get('/v1/taskexp', function (res) {
      cb(res);
    });
  },
  /*获取团队信息*/
  getTeamsInfo: function getTeamsInfo(id, cb) {
    $http.get('/v1/teams/' + id, function (res) {
      cb(res);
    });
  },
  /*查看我的队伍*/
  getMyTeams: function getMyTeams(cb) {
    $http.get('/v1/teams/owner', function (res) {
      cb(res);
    });
  },
  /*创建队伍*/
  getCreateTeams: function getCreateTeams(obj, cb) {
    $http.post('/v1/teams', obj, function (res) {
      cb(res);
    });
  },
  //退出任务
  quitTask: function quitTask(id, cb) {
    $http.post('/v1/tasks/' + id + '/revoke', {}, function (res) {
      cb(res);
    });
  },
  //任务奖励并评价接口
  getAwardTask: function getAwardTask(id, obj, cb) {
    $http.post('/v1/tasks/' + id + '/reward', obj, function (res) {
      cb(res);
    });
  },
  //获取系统配置
  getProperties: function getProperties(cb) {
    $http.get('/v1/properties', function (res) {
      cb(res);
    });
  },
  getDepartmentInfo: function getDepartmentInfo(id, cb) {
    $http.get('/v1/departments/' + id, function (res) {
      cb(res);
    });
  },
  getFactionInfo: function getFactionInfo(id, cb) {
    $http.get('/v1/factions/' + id, function (res) {
      cb(res);
    });
  },
  /*获取堂信息*/
  getSectionsInfo: function getSectionsInfo(id, cb) {
    $http.get('/v1/sections/' + id, function (res) {
      cb(res);
    });
  },
  /*查看成员个人信息*/
  getUserLeaderGrade: function getUserLeaderGrade(id, cb) {
    $http.get('/v1/users/' + id, function (res) {
      cb(res);
    });
  },
  //完成新手任务指引
  getCompleteTask: function getCompleteTask(id, cb) {
    $http.post('/v1/guides/' + id + '/complete', {}, function (res) {
      cb(res);
    });
  },
  //获取服务器当前时间
  getTime: function getTime(cb) {
    $http.get('/v1/time', function (res) {
      cb(res);
    });
  }
};