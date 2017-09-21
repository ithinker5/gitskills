'use strict';

var $http = new MID();
var SERVICE = function SERVICE() {};
SERVICE.prototype = {
  //获取问题列表
  getQuestionList: function getQuestionList(cb) {
    $http.get('/v1/questions', function (res) {
      cb(res);
    });
  },
  //创建问题
  addQuestion: function addQuestion(obj, cb) {
    $http.post('/v1/questions', obj, function (res) {
      cb(res);
    });
  },
  //修改问题
  editQuestion: function editQuestion(id, obj, cb) {
    $http.post('/v1/questions/' + id + '/answer', obj, function (res) {
      cb(res);
    });
  },
  //关闭问题
  closeQuestion: function closeQuestion(id, cb) {
    $http.put('/v1/questions/' + id, {}, function (res) {
      cb(res);
    });
  },
  //获取单条问题
  getQuestionById: function getQuestionById(id, cb) {
    $http.get('/v1/questions/' + id, function (res) {
      cb(res);
    });
  },
  //获取经验值
  getExp: function getExp(cb) {
    $http.get('/v1/properties?name=question_exp', function (res) {
      cb(res);
    });
  },
  //新手任务列表
  getNewTaskList: function getNewTaskList(cb) {
    $http.get('/v1/guides', function (res) {
      cb(res);
    });
  },
  //新手指引完成情况表
  getNewTaskComplete: function getNewTaskComplete(id, cb) {
    $http.get('/v1/users/' + id + '/guides', function (res) {
      cb(res);
    });
  },
  //领取奖励
  getAward: function getAward(id, cb) {
    $http.post('/v1/guides/' + id + '/reward', {}, function (res) {
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