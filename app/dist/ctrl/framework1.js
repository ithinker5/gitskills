"use strict";

jQuery(document).ready(function () {
  $(".goBack").click(function () {
    window.parent.playClickEffect();
    window.parent.closeWebPop();
    //window.location.href='bDetail.html?faction_id='+getUrlParam('faction_id');
  });
  var service = new SERVICE();
  function getMember1(id) {
    service.getMember1(id, function (res) {
      var showlist = $("<ul id='org' style='display:none'></ul>");
      showall([res], showlist);
      $("#jOrgChart").append(showlist);
      $("#org").jOrgChart({
        chartElement: '#jOrgChart', //指定在某个dom生成jorgchart
        dragAndDrop: false //设置是否可拖动
      });
      $(document).on('mouseover', '.parentBubble', function () {
        if ($(this).find("div.bubbleBox").find(".yqPerson").text() != '') {
          $(this).addClass('super');
          $(this).find("div.bubbleBox").removeClass("dis_n");
        }
      });
      $(document).on('mouseout', '.parentBubble', function () {
        $(this).removeClass('super');
        $(this).find("div.bubbleBox").addClass("dis_n");
      });
    });
  }
  var abc = getUrlParam("faction_id");
  getMember1(abc);
  function showall(menu_list, parent) {
    $.each(menu_list, function (index, val) {
      var li = $("<li></li>");
      if (val.remark == 'null' || val.remark == null || val.remark == '') {
        val.remark = '无';
      }
      if (val.avatar == 'null' || val.avatar == null || val.avatar == '') {
        val.avatar = '../i/head1.png';
      } else if (parseInt(val.avatar) < 8) {
        val.avatar = '../i/head' + val.avatar + '.png';
      } else {
        val.avatar = val.avatar;
      }
      if (val.name == 'null' || val.name == null || val.name == '') {
        val.name = '无';
      }
      if (val.level == 'null' || val.level == null || val.level == '') {
        val.level = '0';
      }
      if (val.deep == 1) {
        var html = '<div class="parentBubble"><div class="firstNode"><span class="title">帮主<span class="name">' + val.name + '</span></span>' + '<div class="head"><img src="' + val.avatar + '"/> </div>' + '<p class="intro">' + val.remark + '</p>' + '<span class="grade">Lv：' + val.level + '</span>' + '<img class="add" src="../i/space.png" /></div> ' + '<div class="bubbleBox dis_n" style="top:10rem;left: 36%;">' + '<div class="bubbleTitle"><span>帮众</span></div>' + '<div class="yqPerson">';
        for (var i = 0; i < val.children.length; i++) {
          if (val.children[i].role_id === 1) {
            if (i === parseInt(val.children.length) - 1) {
              html += "<span>" + val.children[i].name + "</span>";
            } else {
              html += "<span>" + val.children[i].name + "\uFF0C</span>";
            }
          }
        }
        html += '</div></div></div>';
        li.append(html).append("<ul></ul>").appendTo(parent);
      } else if (val.deep === 2) {
        var _html = '';
        if (val.role_id === 2) {
          _html = '<div class="parentBubble"><div class="secondNode"><span class="title">' + (val.role_id == 2 ? '长老' : '帮众') + '<span class="name">' + val.name + '</span></span>' + '<div class="head"><img src="' + val.avatar + '"/> </div>' + '<p class="intro">' + val.remark + '</p>' + '<span class="grade">Lv：' + val.level + '</span>' + '<img class="add" src="../i/space.png" /></div> ' + '<div class="bubbleBox bottom80 dis_n">' + '<div class="bubbleTitle"><span>帮众</span></div>' + '<div class="yqPerson">';
          for (var _i = 0; _i < val.children.length; _i++) {
            if (val.children[_i].role_id === 1) {
              if (_i === parseInt(val.children.length) - 1) {
                _html += "<span>" + val.children[_i].name + "</span>";
              } else {
                _html += "<span>" + val.children[_i].name + "\uFF0C</span>";
              }
            }
          }
          _html += '</div></div></div>';
          li.append(_html).append("<ul></ul>").appendTo(parent);
        }
      }
      showall(val.children, $(li).children().eq(1));
    });
  }
});