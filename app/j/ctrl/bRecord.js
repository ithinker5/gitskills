$(function () {
  let service = new SERVICE();
  let bID =getUrlParam("faction_id");
  getInfo(bID);
  //获取帮会信息
  function getInfo(id) {
    service.getInfo(id, function (res) {
      $(".allianceName").html(res.name);
      if(res.chief&&res.chief.name){
        $(".factionBoss").html(res.chief.name);
        $(".allianceBoss").html(res.chief.name);
      }else{
        $(".factionBoss").html('无');
        $(".allianceBoss").html('无');
      }
      $(".allianceNum").html(res.member_count);
      $(".allianceVc").html(res.vc);
      $(".allianceVc_total").html(res.vc_total);
      $(".allianceMoney").html(res.gold);
      $(".allianceIntro").html(res.desc);
      $(".allianceOrg").html(res.org_info||'无')
    });
  }
});