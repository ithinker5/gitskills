'use strict';

$(function () {
  var service = new SERVICE();
  //联盟id
  var lID = window.sessionStorage.getItem('department_id');
  //获取联盟信息
  function getInfo() {
    service.getInfo(lID, function (res) {
      console.log(res);
    });
  }
  getInfo();
});