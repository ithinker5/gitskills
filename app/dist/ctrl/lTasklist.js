'use strict';

/**
 * Created by liujuanjuan on 2017/5/2.
 */
$(function () {
  var service = new SERVICE();
  //联盟id
  var lID = window.sessionStorage.getItem('department_id');
  //获取联盟任务列表
  function getTasks() {
    service.getTasks({ department_id: lID }, function (res) {
      console.log(res);
    });
  }
  getTasks();
});