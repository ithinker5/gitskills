'use strict';

$(function () {
  var service = new SERVICE();
  $(document).on('click', '.nav-tabs li', function () {
    $(this).addClass('active').siblings().removeClass('active');
    getList();
  });
  getProperties();
  //获取属性列表
  function getProperties() {
    service.getProperties(function (res) {
      var data = {
        propertyList: res
      };
      $('#tabList').html(template('properties', data));
      getList();
    });
  }

  function getList() {
    var $active = $('li.active');
    var $activeType = $active.data('type');
    var $activeName = $active.data('name');
    service.getList($activeType, function (res) {
      var data = {
        hasData: false,
        list: [],
        activeType: $activeName
      };
      if (res.length > 0) {
        data.hasData = true;
      }
      data.list = res;
      $('#tableContainer').html(template('dataContainer', data));
      getBodyHeight();
    });
  }
});