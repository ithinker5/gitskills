const service = new SERVICE();
const faction_id = parseInt(getUrlParam('faction_id'));
let nav=[];
//点击进入联盟管理
$(document).on('click', '#department', function () {
  window.parent.playClickEffect();
  window.location.href = 'department.html'
});
//点击进入帮会管理
$(document).on('click', '#faction', function () {
  window.parent.playClickEffect();
  if (faction_id) {
    window.location.href = `faction.html?faction_id=${faction_id}`
  } else {
    window.location.href = `faction.html`
  }
});
//点击进入堂管理
$(document).on('click', '#tang', function () {
  window.parent.playClickEffect();
  if (faction_id) {
    window.location.href = `tang.html?faction_id=${faction_id}`
  } else {
    window.location.href = `tang.html`
  }
});
//点击进入成员管理
$(document).on('click', '#user', function () {
  window.parent.playClickEffect();
  if (faction_id) {
    window.location.href = `user.html?faction_id=${faction_id}`
  } else {
    window.location.href = `user.html`
  }
});
//点击进入经验管理
$(document).on('click', '#exp', function () {
  window.parent.playClickEffect();
  window.location.href = `exp.html`
});
//点击进入能力属性管理
$(document).on('click', '#power', function () {
  window.parent.playClickEffect();
  window.location.href = `power.html`
});
function navList() {
  if(faction_id||faction_id===0){
    nav=[
      {domId:'faction',name:'帮会管理'},
      {domId:'tang',name:'堂管理'},
      {domId:'user',name:'成员管理'}
    ];
    $('#containerTitle').text('帮会管理');
  }else{
    nav=[
      {domId:'department',name:'联盟管理'},
      {domId:'faction',name:'帮会管理'},
      {domId:'tang',name:'堂管理'},
      {domId:'user',name:'成员管理'},
      {domId:'exp',name:'经验管理'},
      {domId:'power',name:'能力属性管理'},
    ];
    $('#containerTitle').text('联盟管理');
  }
}
//转换员工职务
function changeToChina(role_id) {
  let role=parseInt(role_id);
  if(role===5){
    return '盟主'
  }else if(role===4){
    return '护法'
  }else if(role===3){
    return '帮主'
  }else if(role===2){
    return '长老'
  }else{
    return '帮众'
  }
}
//获取联盟列表
function getDepartList() {
  service.getDepartList((res) => {
    let data = {
      detailPage:true,
      departObj: res[0]
    };
    $('#boxContainer').html(template('container', data));
    getManagerBodyHeight()
  });
}

//获取帮会列表
function getFactionList() {
  let factionFilter=faction_id||'';
  service.getFactionList(factionFilter,(res) => {
    let data={};
    if(faction_id){
      data = {
        detailPage:true,
        factionObj: res[0],
        faction:true,
        nav
      };
    }else{
      data = {
        listPage:true,
        list: res,
        canCreateFaction:true,
        nav
      };
    }
    $('#boxContainer').html(template('container', data));
    $('#table').tablesorter();
    getManagerBodyHeight()
  });
}
//获取堂列表
function getTangList() {
  let factionFilter=faction_id||'';
  service.getTangList(factionFilter,(res) => {
    let data = {
      listPage:true,
      list: res,
      nav
    };
    $('#boxContainer').html(template('container', data));
    $('#table').tablesorter();
    getManagerBodyHeight()
  });
}
//获取用户列表
function getUserList() {
  let factionFilter=faction_id||'';
  service.getUserList(factionFilter,(res) => {
    let data = {
      listPage:true,
      faction:factionFilter,
      list: res,
      nav
    };
    $('#boxContainer').html(template('container', data));
    $('#table').tablesorter();
    //导入
    $('#file').change(fileChange);
    function fileChange() {
      confirmAgain({
        title:'提示',
        content:{
          text:'正在导入数据，请等待。。。'
        },
        btns:[]
      });
      service.uploadFile('file', res => {
        if(res.error_code&&(parseInt(res.error_code)===100001)){
          confirmAgain({
            title:'提示',
            content:{
              text:res.error_msg
            },
            btns:[
              {domId:'cancel',text:'确定',event:failData}
            ]
          });
          function failData() {
            $(".feehideBox").empty();
            getUserList();
          }
        }else{
          $(".feehideBox").empty();
          getUserList();
        }
      },'user');
    }
    getManagerBodyHeight();
  });
}
//获取经验列表
function getExpList(activePage) {
  let $activePage=activePage||'level';
  if($activePage==='level'){
    service.getLevelList(res=>{
      let listArr={
        col0:[],
        col1:[],
        col2:[],
        col3:[],
        col4:[],
        col5:[],
        col6:[],
        col7:[],
        col8:[],
        col9:[],
        col10:[],
        col11:[],
        col12:[],
        col13:[],
        col14:[],
        col15:[],
        col16:[],
        col17:[],
        col18:[],
        col19:[],
      };
      for(let i=0;i<20;i++){
        listArr[`col${i%20}`].push(res.levels[i%20]);
        listArr[`col${i%20}`].push(res.levels[i%20+20]);
        listArr[`col${i%20}`].push(res.levels[i%20+40]);
        listArr[`col${i%20}`].push(res.levels[i%20+60]);
        listArr[`col${i%20}`].push(res.levels[i%20+80]);
      }
      let data = {
        levelPage:true,
        list:listArr,
        ratio:res.ratio
      };
      $('#boxContainer').html(template('container', data));
    });
  }else if($activePage==='task'){
    service.getTaskList(res=>{
      for(let i=0;i<res.length;i++){
        toChina(res[i]);
      }
      let data = {
        taskPage:true,
        list:res
      };
      $('#boxContainer').html(template('container', data));
      $('#taskTable').tablesorter();
      getManagerBodyHeight();
      function toChina(obj) {
        if(parseInt(obj.subtype)===0){
          obj.subtypeToChina='联盟战略任务'
        }else if(parseInt(obj.subtype)===1){
          obj.subtypeToChina='联盟临时任务'
        }else if(parseInt(obj.subtype)===2){
          obj.subtypeToChina='帮会挑战任务'
        }else if(parseInt(obj.subtype)===3){
          obj.subtypeToChina='帮会基础任务'
        }else if(parseInt(obj.subtype)===4){
          obj.subtypeToChina='帮会临时任务'
        }else if(parseInt(obj.type)===2){
          obj.subtypeToChina='个人任务'
        }else if(parseInt(obj.type)===3){
          obj.subtypeToChina='试炼任务'
        }
      }
    })
  }else if($activePage==='newPersonTask'){
    service.getNewPersonTaskList(res=>{
      let data = {
        newPersonTaskPage:true,
        list:res
      };
      $('#boxContainer').html(template('container', data));
      $('#newPersonTaskTable').tablesorter();
      getManagerBodyHeight()
    });
  }
}
//获取能力属性
function getProperties(page) {
  service.getProperties((res) => {
    let data = {
      list: res
    };
    if(page==='list'){
      data.listPage=true
    }else if(page==='edit'){
      data.editPage=true
    }
    $('#boxContainer').html(template('container', data));
  });
}
