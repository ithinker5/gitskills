jQuery(document).ready(function() {
  const service=new SERVICE();
  function getMember(id) {
    service.getMember(id,res=>{
      var showlist = $("<ul id='org' style='display:none'></ul>");
      let children=[];
      let obj={};
      for(let i=0;i<res.children.length;i++){
        if(res.children[i].role_id==4){
          obj=res.children[i];
        }else{
          children.push(res.children[i])
        }
      }
      res.children=children;
      showall([res], showlist,obj);
      $("#jOrgChart").append(showlist);
      $("#org").jOrgChart( {
        chartElement : '#jOrgChart',//指定在某个dom生成jorgchart
        dragAndDrop : false //设置是否可拖动
      });
      $(document).on('mouseover','.parentBubble',function(){
        if($(this).find("div.bubbleBox").find(".yqPerson").text()!=''){
          $(this).addClass('super');
          $(this).find("div.bubbleBox").removeClass("dis_n");
        }
      });
      $(document).on('mouseout','.parentBubble',function(){
        $(this).removeClass('super');
        $(this).find("div.bubbleBox").addClass("dis_n");
      });
      /*$(document).on('mouseover','.secondNode',function(){
        if($(this).siblings("div.bubbleBox").find(".yqPerson").text()!=''){
          $(this).siblings("div.bubbleBox").removeClass("dis_n");
        }
      });
      $(document).on('mouseout','.secondNode',function(){
        $(this).siblings("div.bubbleBox").addClass("dis_n");
      });
      $(document).on('mouseover','.thirdNode',function(){
        if($(this).siblings("div.bubbleBox").find(".yqPerson").text()!=''){
          $(this).siblings("div.bubbleBox").removeClass("dis_n");
        }
      });
      $(document).on('mouseout','.thirdNode',function(){
        $(this).siblings("div.bubbleBox").addClass("dis_n");
      });*/
    })
  }
  let abc =window.sessionStorage.getItem("department_id")
  getMember(abc);
  function showall(menu_list, parent,obj) {
    $.each(menu_list, function(index, val) {
      let li = $("<li></li>");
      if (val.remark =='null'||val.remark==null||val.remark==''){
        val.remark='无';
      }
      if (val.avatar =='null'||val.avatar==null||val.avatar==''){
        val.avatar='../i/head1.png';
      }else if(parseInt(val.avatar) < 8){
        val.avatar='../i/head'+val.avatar+'.png';
      }else{
        val.avatar=val.avatar;
      }
      if (val.name =='null'||val.name==null||val.name==''){
        val.name='无';
      }
      if (val.level =='null'||val.level==null||val.level==''){
        val.level='0';
      }
      if(val.deep === 1){
        let html ='<div class="parentBubble"><div class="firstNode"><span class="title">盟主<span class="name">'+val.name+'</span></span>'
          +'<div class="head"><img src="'+val.avatar+'"/> </div>'
          +'<p class="intro">'+val.remark+'</p>'
          +'<span class="grade">Lv：'+val.level+'</span>'
          +'<img class="add" src="../i/space.png" /></div>';
          html+='<div class="bubbleBox dis_n" style="top:10rem;left: 36%;">'
            +'<div class="bubbleTitle"><span>帮众</span></div>'
            +'<div class="yqPerson">';
        for(let i=0;i<val.children.length;i++){
          if(val.children[i].role_id===1){
            if(i===(parseInt(val.children.length)-1)){
              html+=`<span>${val.children[i].name}</span>`;
            }else{
              html+=`<span>${val.children[i].name}，</span>`;
            }
          }
        }
          html+='</div></div></div>';
        li.append(html).append('<ul></ul>').appendTo(parent);
      }else if (val.deep === 2){
        if(val.role_id >= 4){
          let html ='<div class="parentBubble"><div class="secondNode"><span class="title">帮主<span class="name">'+val.name+'</span></span>'
            +'<div class="head"><img  src="'+val.avatar+'"/> </div>'
            +'<p class="intro">'+val.remark+'</p>'
            +'<span class="grade">Lv：'+val.level+'</span>'
            +'<img class="add" src="../i/space.png" /></div>';
            html+='<div class="bubbleBox bottom80 dis_n">'
              +'<div class="bubbleTitle"><span>帮众</span></div>'
              +'<div class="yqPerson">'
          for(let i=0;i<val.children.length;i++){
            if(val.children[i].role_id===1){
              if(i===(parseInt(val.children.length)-1)){
                html+=`<span>${val.children[i].name}</span>`;
              }else{
                html+=`<span>${val.children[i].name}，</span>`;
              }
            }
          }
          html+='</div></div></div>';
          li.append(html).append('<ul></ul>').appendTo(parent);
        }else{
          if(val.role_id===3){
           let html ='<div class="parentBubble"><div class="secondNode"><span class="title">帮主<span class="name">'+val.name+'</span></span>'
              +'<div class="head"><img  src="'+val.avatar+'"/></div>'
              +'<p class="intro">'+(val.remark!=null && val.remark.length>0?val.remark:'无')+'</p>'
              /*+'<p class="intro">'+(val.remark==null?val.desc:'无')+'</p>'*/
              +'<span class="grade">Lv：'+val.level+'</span>'
              +'<img class="add" src="../i/space.png" /></div>';
              html+='<div class="bubbleBox bottom80 dis_n">'
                +'<div class="bubbleTitle"><span>帮众</span></div>'
                +'<div class="yqPerson">'
            for(let i=0;i<val.children.length;i++){
              if(val.children[i].role_id===1){
                if(i===(parseInt(val.children.length)-1)){
                  html+=`<span>${val.children[i].name}</span>`;
                }else{
                  html+=`<span>${val.children[i].name}，</span>`;
                }
              }
            }
            html+='</div></div></div>';
            li.append(html).append('<ul></ul>').appendTo(parent);
          }
        }
      }else if (val.deep === 3){
        let html='';
        if(val.role_id===2){
          html ='<div class="parentBubble"><div class="thirdNode"><span class="title">'+(val.role_id==2?'长老':'帮众')+'<span class="name">'+val.name+'</span></span>'
            +'<div class="head"><img  src="'+val.avatar+'"/> </div>'
            +'<p class="intro">'+val.remark+'</p>'
            +'<span class="grade">Lv：'+val.level+'</span>'
            +'<img class="add" src="../i/space.png" /></div>';
            html+='<div class="bubbleBox bottom80 dis_n">'
              +'<div class="bubbleTitle"><span>帮众</span></div>'
              +'<div class="yqPerson">'
          for(let i=0;i<val.children.length;i++){
            if(val.children[i].role_id===1){
              if(i===(parseInt(val.children.length)-1)){
                html+=`<span>${val.children[i].name}</span>`;
              }else{
                html+=`<span>${val.children[i].name}，</span>`;
              }
            }
          }
          html+='</div></div></div>';
          li.append(html).append('<ul></ul>').appendTo(parent);
        }
      }


      if(val.role_id === 5){
        if (obj.remark =='null'||obj.remark==null){
          obj.remark='无';
        }
        if (obj.avatar =='null'||obj.avatar==null){
          obj.avatar='../i/head1.png';
        }else if(parseInt(obj.avatar)<8){
          obj.avatar='../i/head'+obj.avatar+'.png';
        }else{
          obj.avatar=obj.avatar;
        }
        if (obj.name =='null'||obj.name==null){
          obj.name='无';
        }
        if (obj.level =='null'||obj.level==null){
          obj.level='0';
        }
        var $i = $('<div></div>');
        var html2 ='<i arrow="left" class="dis_n"><span class="title">'+'护法'+ '<span class="name">'+obj.name+'</span></span>'
          +'<div class="head"><img  src="'+obj.avatar+'"/> </div>'
          +'<p class="intro">'+obj.remark+'</p>'
          +'<span class="grade">Lv：'+obj.level+'</span>'
          +'<img class="add" src="../i/space.png" /></i> ';
        $(li).children().eq(0).after($i.append(html2));
        showall(val.children, $(li).children().eq(2));
      }else{
        showall(val.children, $(li).children().eq(1));
      }
    });

  }




  /*const sUserAgent = navigator.userAgent;
   const isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
   if (isMac){
   console.log('mac');
   $(".node:eq(0)").find('.title').css({'font-size':'22px','top':'3px !important'});
   $(".node:eq(0)").find('.intro').css({'top':'2px !important'});
   $(".node").find('.intro ').css({'font-size':'12px','top':'1.81005615rem'});
   $(".node").find('.title ').css({'font-size':'18px','top':'0'});
   $(".node").find('.name ').css({'font-size':'15px','top':'0'});
   }else{
   $(".node-cells:eq(0)").find('.node').css({'width':'16.46289169rem','height':'7.28332119rem'});
   $(".node-cells:eq(0)").find('.title').css({'left':'7.24022462rem','top':'0.58180376rem'});
   $(".node-cells:eq(0)").find('.head ').css({'bottom':'0.30167603rem','left':'0.3447726rem','width':'6.55067942rem','height':'6.67996914rem'});
   $(".node-cells:eq(0)").find('.intro ').css({'width':'8.85273rem','top':'2.06863561rem','left':'7.14022462rem','font-size':'0.77573835rem','height':'4.70295rem'});
   $(".node-cells:eq(0)").find('.grade ').css({'width':'6.45068rem','height':'1.2619315rem','line-height':'1.2619315rem','bottom':'0.2844374rem','left':'0.25857945rem','font-size':'0.82128rem'});
   }*/
})
