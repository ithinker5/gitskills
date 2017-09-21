"use strict";

$(function () {
  var service = new SERVICE();
  //获取帮会信息
  function getAlliance(id) {
    service.getAlliance(id, function (res) {
      $(".allianceName").html(res.name);
      $(".allianceBoss").html(res.master.name);
      $(".allianceNum").html(res.member_count);
      $(".allianceVc").html(res.vc);
      $(".allianceMoney").html(res.gold);
      $(".allianceIntro").html(res.desc);
      $(".allianceOrg").html(res.org_info || '无');
    });
  }
  var abc = window.sessionStorage.getItem("department_id");
  getAlliance(abc);
});