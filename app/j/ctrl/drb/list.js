$(function () {
  const service = new SERVICE();
  $(document).on('click','.nav-tabs li',function () {
    $(this).addClass('active').siblings().removeClass('active');
    getList()
  });
  getProperties();
  //获取属性列表
  function getProperties() {
    service.getProperties(res => {
      let data = {
        propertyList: res
      };
      $('#tabList').html(template('properties', data));
      getList()
    })
  }

  function getList() {
    let $active=$('li.active');
    let $activeType = $active.data('type');
    let $activeName = $active.data('name');
    service.getList($activeType, res => {
      let data = {
        hasData: false,
        list: [],
        activeType:$activeName
      };
      if (res.length > 0) {
        data.hasData = true
      }
      data.list = res;
      $('#tableContainer').html(template('dataContainer', data));
      getBodyHeight()
    })
  }
});