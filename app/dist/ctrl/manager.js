'use strict';

/**
 * Created by liujuanjuan on 2017/5/26.
 */
$(function () {
  var service = new SERVICE();
  var faction_id = parseInt(getUrlParam('faction_id'));
  var nav = [];
  if (faction_id || faction_id === 0) {
    nav = [{ domId: 'faction', name: '帮会管理' }, { domId: 'tang', name: '堂管理' }, { domId: 'user', name: '成员管理' }];
    getFactionList();
  } else {
    nav = [{ domId: 'department', name: '联盟管理' }, { domId: 'faction', name: '帮会管理' }, { domId: 'tang', name: '堂管理' }, { domId: 'user', name: '成员管理' }, { domId: 'exp', name: '经验管理' }, { domId: 'power', name: '能力属性管理' }];
    getDepartList();
  }
  $('#boxContainer').html(template('container', {
    nav: nav,
    text: '联盟管理'
  }));
  //点击进入联盟管理
  $('#department').on('click', getDepartList);
  //点击进入帮会管理
  $('#faction').on('click', getFactionList);
  //点击进入堂管理
  $('#tang').on('click', function () {
    $('#contentContainer').html(template('content', {
      text: '堂管理'
    }));
  });
  //点击进入成员管理
  $('#user').on('click', function () {
    $('#contentContainer').html(template('content', {
      text: '成员管理'
    }));
  });
  //点击进入经验管理
  $('#exp').on('click', function () {
    $('#contentContainer').html(template('content', {
      text: '经验管理'
    }));
  });
  //点击进入能力属性管理
  $('#power').on('click', function () {
    $('#contentContainer').html(template('content', {
      text: '能力属性管理'
    }));
  });
  //获取联盟列表
  function getDepartList() {
    service.getDepartList(function (res) {
      var data = {
        depart: true,
        departs: res
      };
      $('#contentContainer').html(template('content', data));
    });
  }
  //获取帮会列表
  function getFactionList() {
    service.getFactionList(function (res) {
      var data = {
        faction: true,
        factions: res
      };
      $('#contentContainer').html(template('content', data));
    });
  }
});