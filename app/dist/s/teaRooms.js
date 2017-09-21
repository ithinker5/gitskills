'use strict';

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  /*获取队伍*/
  getTeams: function getTeams(cb) {
    $http.get('/v1/teams', function (res) {
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
  /*修改队伍*/
  getChangeTeams: function getChangeTeams(id, obj, cb) {
    $http.put('/v1/teams/' + id, obj, function (res) {
      cb(res);
    });
  },
  /*获取团队信息*/
  getTeamsInfo: function getTeamsInfo(id, cb) {
    $http.get('/v1/teams/' + id, function (res) {
      cb(res);
    });
  },
  /*获取团队接取得任务*/
  getTeamsTasks: function getTeamsTasks(id, cb) {
    $http.get('/v1/team/' + id + '/tasks', function (res) {
      cb(res);
    });
  },
  /*获取团队成员列表*/
  getTeamsList: function getTeamsList(team_id, cb) {
    $http.get('/v1/members/team/' + team_id, function (res) {
      cb(res);
    });
  },
  /*招募队员*/
  getRecruit: function getRecruit(obj, cb) {
    $http.post('/v1/members/team', obj, function (res) {
      cb(res);
    });
  },
  /*解散队员或者退出队伍*/
  getDeleteTeams: function getDeleteTeams(_ids, cb) {
    $http.delete('/v1/members/team?ids=' + _ids, function (res) {
      cb(res);
    });
  },
  /*队伍获得的积分详细*/
  getIntegral: function getIntegral(id, cb) {
    $http.get('/v1/team/' + id + '/gains', function (res) {
      cb(res);
    });
  },
  /*获取总用户信息*/
  getList: function getList(id, cb) {
    $http.get('/v1/users?excludes=' + id, function (res) {
      cb(res);
    });
  },
  /*获取用户信息*/
  getListInfo: function getListInfo(id, cb) {
    $http.get('/v1/users/' + id, function (res) {
      cb(res);
    });
  },
  addMessage: function addMessage(obj, cb) {
    $http.post('/v1/messages', obj, function (res) {
      cb(res);
    });
  },
  //完成新手任务指引
  getCompleteTask: function getCompleteTask(id, cb) {
    $http.post('/v1/guides/' + id + '/complete', {}, function (res) {
      cb(res);
    });
  }
};