jQuery(document).ready(function() {
  const service=new SERVICE();
  function getStructure(id) {
    service.getStructure(id,res=>{
      var showlist = $("<ul id='org' style='display:none'></ul>");
      showall([res], showlist);
      $("#jOrgChart").append(showlist);
      $("#org").jOrgChart( {
        chartElement : '#jOrgChart',//指定在某个dom生成jorgchart
        dragAndDrop : false //设置是否可拖动
      });
      /*气泡划过事件*/
      $( ".firstGrade" ).mouseover(function() {
        $(this).addClass('super');
        $(this).find("div.bubbleBox").removeClass("dis_n");
      }).mouseout(function() {
        $(this).removeClass('super');
        $(this).find("div.bubbleBox").addClass("dis_n");
      })
      if(getUrlParam("isFactionSel")){
        $(document).on('click','.secondGrade',function(){
          window.parent.playClickEffect();
          let bhId=$(this).children('span.bhId').text();
          /*跳转联盟为1*/
          window.parent.closeWebPop(bhId);
        })
      }
      $( ".secondGrade" ).mouseover(function() {
        $(this).addClass('super');
        $(this).find("div.bubbleBox").removeClass("dis_n");
      }).mouseout(function() {
        $(this).removeClass('super');
        $(this).find("div.bubbleBox").addClass("dis_n");
      })
      if(window.sessionStorage.getItem('user_id')==4||window.sessionStorage.getItem('user_id')==5){
        $( ".secondGrade" )
      }
      $( ".thirdGrade" ).mouseover(function() {
        $(this).addClass('super');
        $(this).find("div.bubbleBox").removeClass("dis_n");
      }).mouseout(function() {
        $(this).removeClass('super');
        $(this).find("div.bubbleBox").addClass("dis_n");
      });
    })
  }
  var abc =window.sessionStorage.getItem("department_id")
  getStructure(abc);
  function showall(menu_list, parent) {
    $.each(menu_list, function(index, val) {
      var li = $("<li></li>");
      if (val.desc =='null'||val.desc==null||val.desc==''){
        val.desc='无';
      }
      if (val.org_info =='null'||val.org_info==null||val.org_info==''){
        val.org_info='无';
      }
      if(val.deep === 1){
        var html1='<div style="bottom: -10rem;left:-16rem;" class="bubbleBox dis_n">'
          +'<div class="bubbleTitle">';
          if(val.master==null){
            html1+='<span>盟主</span><span class="span2">无</span>'
              +'</div>'
              +'<p>人数：<span>'+val.member_count+'</span></p>'
          }else{
            html1+='<span>盟主</span><span class="span2">'+val.master.name+'</span>'
                +'</div>'
                +'<p>人数：<span>'+val.member_count+'</span></p>'
          }
        html1+='<p>联盟VC：<span>'+val.vc+'</span></p>'
          +'<p>联盟金币：<span>'+val.gold+'</span></p>'
          +'<p>部门组织架构：<span>'+val.org_info +'</span></p>'
          +'<p>简介：<span>'+val.desc+'</span></p>'
          +'</div>';
        li.append("<div class='firstGrade'><span style='text-shadow: 0 0 10px rgba(218,138,44,1);'>"+val.name + "</span>"+"<span class='lmId' style='display: none;'>"+val._id + "</span>"+html1 +"</div>").append("<ul></ul>").appendTo(parent);
      }else if(val.deep === 2){
        var html2='<div class="bubbleBox dis_n">'
          +'<div class="bubbleTitle">'
        if(val.master==null){
          html2+='<span>帮主</span><span class="span2">无</span>'
            +'</div>'
            +'<p>人数：<span>'+val.member_count+'</span></p>'
            +'<p>帮会VC：<span>'+val.vc+'</span></p>'
            +'<p>帮会金币：<span>无</span></p>'
            +'<p>部门组织架构：<span>无</span></p>'
            +'<p>简介：<span>无</span></p>'
            +'</div>';
        }else{
          html2+='<span>帮主</span><span class="span2">'+val.master.name+'</span>'
            +'</div>'
            +'<p>人数：<span>'+val.member_count+'</span></p>'
            +'<p>帮会VC：<span>'+val.vc+'</span></p>'
            +'<p>帮会金币：<span>'+val.gold+'</span></p>'
            +'<p>部门组织架构：<span>'+val.org_info +'</span></p>'
            +'<p>简介：<span>'+val.desc+'</span></p>'
            +'</div>';
        }
        li.append("<div class='secondGrade'><span style='text-shadow: 0 0 10px rgba(218,138,44,1);'>"+val.name + "</span>"+"<span class='bhId' style='display: none;'>"+val._id + "</span>"+html2 +"</div>").append("<ul></ul>").appendTo(parent);
      }else if(val.deep === 3 ){
        var html3='<div class="bubbleBox dis_n">'
          +'<div class="bubbleTitle">'
        if(val.master==null){
          html3+='<span>堂主</span><span class="span2">无</span>'
            +'</div>'
            +'<p>人数：<span>'+val.member_count+'</span></p>'
        }else{
          html3+='<span>堂主</span><span class="span2">'+val.master.name+'</span>'
            +'</div>'
            +'<p>人数：<span>'+val.member_count+'</span></p>'
        }
        html3+='<p>简介：<span>'+val.desc+'</span></p>'
          +'</div>';
        $("<li></li>").append("<div class='thirdGrade'>"+val.name + html3 +"</div>").appendTo(parent);
      }
      showall(val.children, $(li).children().eq(1));
    });

  }
})