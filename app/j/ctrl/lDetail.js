$(function () {
  const service=new SERVICE();
  //联盟id
  const lID=window.sessionStorage.getItem('department_id');
  //获取联盟信息
  function getInfo() {
    service.getInfo(lID,(res)=>{
      console.log(res)
    })
  }
  getInfo();
});