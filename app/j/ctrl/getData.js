/*获取表格中所需的模拟数据*/
const apiFI = (j) => {
  const arr = [];
  for (let i = 0; i < j; i++) {
    const o = {};
    o.name = '名字'+Math.round(Math.random() * 1000);//姓名
    o.rank = '<img src="../i/magatama.png" /> <img src="../i/magatama.png" /> <img src="../i/magatama.png" /> <img src="../i/magatama.png" /> <img src="../i/magatama.png" />';//任务等级
    o.date = Math.round(Math.random() * 10)+'年' + Math.round(Math.random() * 10) +'个月';//从业时长
    o.job = '岗位' + Math.round(Math.random() * 10000);//岗位
    o.jobName = '岗位名称' + Math.round(Math.random() * 10000);//岗位名称
    o.grade ='级别' + Math.round(Math.random() * 100);//级别
    o.duty = '职务' + Math.round(Math.random() * 1000);//帮派职务
    o.society = '所属帮会' + Math.round(Math.random() * 100);//所属帮会
    o.num = '<span class="pitch2"  alt="" ></span><span class="">' + Math.round(Math.random() * 100000) + '</span>'
    //o.num = Math.round(Math.random() * 100000);
    o.num2 ='<img class="pitch activeImg" src="../i/pitch.png" alt="" />' + Math.round(Math.random() * 100000);//带单选框序号
    o.title = '标题' + Math.round(Math.random() * 10000000)+'标题标题标题标题';//标题
    o.promulgator = '发布人' + Math.round(Math.random() * 100000);//发布人
    o.fDate = Date.now();
    o.btn = '<input class="btndetail" value="详情" type="button" />';

    o.task_name = '任务名字'+Math.round(Math.random() * 1000);//任务名称
    o.team_name = '队伍名字'+Math.round(Math.random() * 1000);//队伍名称
    o.agree = '<input class="btndetail" value="同意" type="button" />';//同意
    o.refuse = '<input class="btndetail" value="拒绝" type="button" />';//拒绝
    o.id = Math.round(Math.random() * 1000);
    o.vcnum = Math.round(Math.random() * 100000);
    o.station = Math.round(Math.random() * 100000);
    o.duty2 ='等级' + Math.round(Math.random() * 100000);
    o.checkper ='验收' + Math.round(Math.random() * 100000);
    arr.push(o);
  }
  return arr;
};

const getLaffiche=()=>{
  let arr=[];
  for(let i=0;i<20;i++){
    let obj={
      _id:`0000000000000${i}`,
      title:`公告标题${i}`,
      author_id:`10000000000000${i}`,
      author_name:`发布者${i}`,
      status:i%3==0?1:(i%3==1?0:-1),
      created_at:new Date('2017-04-15'),
      updated_at:new Date('2017-04-17'),
      published_at:new Date('2017-04-20'),
    };
    arr.push(obj)
  }
  return arr
};
