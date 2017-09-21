'use strict';

$(function () {
  var service = new SERVICE();
  // let fromPage = window.sessionStorage.getItem('fromPage');//从哪个页面跳转过来的，判断时联盟任务还是帮会任务
  var fileNames = []; //存放文件名称
  var fileArr = []; //存放文件链接
  var taskObj = {}; //提交时的task对象
  var saveTempTaskObj = window.sessionStorage.getItem('tempTaskObj');
  var selectId = window.sessionStorage.getItem('selectId');
  var faction_id = getUrlParam('faction_id');
  var personalTask = getUrlParam('personalTask');
  var trialTask = getUrlParam('trialTask');
  var department_id = window.sessionStorage.getItem('department_id');
  var section_id = window.sessionStorage.getItem('section_id');
  var role_id = parseInt(window.sessionStorage.getItem('role_id'));
  var expRole = [];
  var properties = [];
  var departInfo = {};
  var factionInfo = {};
  var sectionInfo = {};
  var personalInfo = {};
  var departGold = 0;
  var factionGold = 0;
  var personalGold = 0;
  var factionVC = 0;
  var departVC = 0;
  var personalVC = 0;
  /*模拟下拉框效果*/
  $(".select_box input").click(function () {
    var thisinput = $(this);
    var thisul = $(this).parent().find("ul");
    if (thisul.css("display") == "none") {
      thisul.fadeIn("100");
      thisul.unbind('hover').hover(function () {}, function () {
        thisul.fadeOut("100");
      });
      thisul.find("li").unbind('click').click(function () {
        if (thisinput.attr('id') == 'taskType') {
          window.location.href = 'strategyTaskAdd.html';
          return false;
        }
        if (thisinput.attr('id') == 'bTaskType') {
          var type = void 0,
              subtype = void 0,
              level = void 0;
          type = 1;
          subtype = parseInt($(this).val());
          level = parseInt($('#taskLevel').data('value'));
          for (var i = 0; i < expRole.length; i++) {
            if (parseInt(expRole[i].type) === type && parseInt(expRole[i].subtype) === subtype && parseInt(expRole[i].level) === level) {
              $('#exp').text(expRole[i].exp);
              $("#base_vc").val(expRole[i].default_vc);
              $("#gold").val(expRole[i].default_gold);
              break;
            }
          }
        }
        if (thisinput.attr('id') == 'taskLevel') {
          var _type = 0,
              _subtype = 1,
              _level = parseInt($(this).val());
          if (faction_id || faction_id === 0) {
            _type = 1;
            _subtype = parseInt($('#bTaskType').data('value'));
            _level = parseInt($(this).val());
          }
          for (var _i = 0; _i < expRole.length; _i++) {
            if (parseInt(expRole[_i].type) === _type && parseInt(expRole[_i].subtype) === _subtype && parseInt(expRole[_i].level) === _level) {
              $('#exp').text(expRole[_i].exp);
              $("#base_vc").val(expRole[_i].default_vc);
              $("#gold").val(expRole[_i].default_gold);
              break;
            }
          }
        }
        thisinput.attr('data-value', $(this).val());
        thisinput.attr('data-num', $(this).val());
        thisinput.attr('value', $(this).text());
        thisul.fadeOut("100");
      }).unbind('hover').hover(function () {
        $(this).addClass("hover");
      }, function () {
        $(this).removeClass("hover");
      });
    } else {
      thisul.fadeOut("fast");
    }
  });
  //返回
  $('.btnBack').click(function () {
    back();
  });
  //删除选择的文件
  $(document).on('click', '.delete', deleteFile);
  //指定领队
  $('#addLeader').click(function () {
    var temp = getObj();
    window.sessionStorage.setItem('tempTaskObj', JSON.stringify(temp));
    if (faction_id || faction_id == 0) {
      if (getUrlParam('fromPage') === 'taskList') {
        window.location.href = 'assignLeader.html?fromPage=add&faction_id=' + faction_id + '&returnPage=taskList';
      } else {
        window.location.href = 'assignLeader.html?fromPage=add&faction_id=' + faction_id;
      }
    } else if (personalTask && personalTask == 'true') {
      window.location.href = 'assignLeader.html?fromPage=add&personalTask=true';
    } else if (trialTask && trialTask == 'true') {
      window.location.href = 'assignLeader.html?fromPage=add&trialTask=true';
    } else {
      window.location.href = 'assignLeader.html?fromPage=add';
    }
  });
  //上传文件
  $('#file').change(fileChange);
  if (faction_id || faction_id == 0) {
    getFactionInfo(faction_id);
    getProperties();
    getDepartmentInfo(department_id);
    getUserLeaderGrade(window.sessionStorage.getItem('user_id'));
  } else if (personalTask && personalTask == 'true') {
    getProperties();
    if (section_id != '0') {
      getSectionsInfo(section_id);
    }
    if (faction_id != '0') {
      getFactionInfo(window.sessionStorage.getItem('faction_id'));
    }
    getDepartmentInfo(department_id);
    getUserLeaderGrade(window.sessionStorage.getItem('user_id'));
  } else if (trialTask && trialTask == 'true') {
    getFactionInfo(window.sessionStorage.getItem('faction_id'));
  } else {
    getProperties();
    getDepartmentInfo(department_id);
    getUserLeaderGrade(window.sessionStorage.getItem('user_id'));
  }
  if (saveTempTaskObj) {
    init(JSON.parse(saveTempTaskObj));
    getExpRoleFromAssignLeader();
  } else {
    getExpRole();
  }
  if (selectId || parseInt(selectId) === 0) {
    $('#leaderRequire').css('display', 'none');
    $('#applicant_id').val('' + window.sessionStorage.getItem('selectId')).attr({ 'data-name': '' + window.sessionStorage.getItem('selectLeaderName'), 'data-gold': '' + window.sessionStorage.getItem('selectLeaderGold') });
    $('#applicant').css('display', 'inline-block').after('<span style="vertical-align: middle">' + window.sessionStorage.getItem('selectLeaderName') + '</span>');
    $('input[name="applicant_id"]').eq(1).attr('checked', 'checked');
    window.sessionStorage.removeItem('selectId');
    window.sessionStorage.removeItem('selectLeaderName');
    window.sessionStorage.removeItem('selectLeaderGold');
  } else {
    $('input[name="applicant_id"]').eq(0).attr('checked', 'checked');
  }
  $('#submit').click(function () {
    window.parent.playClickEffect();
    var title = $('#title');
    var desc = $('#desc');
    var deadline = $('#deadline');
    errorTip(title, desc, deadline);
    if (title.val() && desc.val() && deadline.val()) {
      var temp = function temp() {
        if (!faction_id) {
          if (personalTask && personalTask == 'true') {
            var personal_vc = 0;
            var section_vc = 0;
            var faction_vc = 0;
            var con = "";
            var type = "1";
            for (var i = 0; i < properties.length; i++) {
              if (properties[i].name === 'personal_vc') {
                personal_vc = parseInt(properties[i].value); //20
              } else if (properties[i].name === 'section_vc') {
                section_vc = parseInt(properties[i].value); //40
              } else if (properties[i].name === 'faction_vc') {
                faction_vc = parseInt(properties[i].value); //60
              }
            }
            var userInputVc = parseInt($('#base_vc').val());
            if (role_id === 2) {
              if (userInputVc > section_vc && userInputVc < faction_vc || userInputVc === faction_vc) {
                var name = factionInfo.chief.name;
                con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + section_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + name + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                type = "3";
              } else if (userInputVc > faction_vc) {
                var _name = factionInfo.chief.name;
                if (factionInfo.chief.name != departInfo.master.name) {
                  _name += '\u3001' + departInfo.master.name;
                }
                con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + faction_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                type = "3";
              } else {
                type = "1";
                con = "您确认要发布此任务吗？";
              }
            } else if (role_id === 1) {
              /*若帮派不存在直接盟主审核，若堂不存在，则直接由帮主和盟主审核*/
              if (userInputVc > personal_vc && userInputVc < section_vc || userInputVc === section_vc) {
                if (window.sessionStorage.getItem('section_id') == '' || window.sessionStorage.getItem('section_id') == '0') {
                  var _name2 = departInfo.chief.name;
                  con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + personal_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name2 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                  type = "3";
                } else {
                  var _name3 = sectionInfo.master.name;
                  con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + personal_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name3 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                  type = "3";
                }
              } else if (userInputVc > section_vc && userInputVc < faction_vc || userInputVc === faction_vc) {
                if (window.sessionStorage.getItem('section_id') == '' || window.sessionStorage.getItem('section_id') == '0') {
                  if (window.sessionStorage.getItem('faction_id') == '' || window.sessionStorage.getItem('faction_id') == '0') {
                    var _name4 = departInfo.master.name;
                    con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + section_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name4 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                    type = "3";
                  } else {
                    var _name5 = sectionInfo.master.name;
                    if (factionInfo.chief.name != departInfo.master.name) {
                      _name5 += '\u3001' + factionInfo.chief.name;
                    };
                    con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + section_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name5 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                    type = "3";
                  }
                } else {
                  if (window.sessionStorage.getItem('faction_id') == '' || window.sessionStorage.getItem('faction_id') == '0') {
                    var _name6 = sectionInfo.master.name;
                    _name6 += '\u3001' + departInfo.master.name;
                    con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + section_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name6 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                    type = "3";
                  } else {
                    var _name7 = sectionInfo.master.name;
                    if (factionInfo.chief.name != departInfo.master.name) {
                      _name7 += '\u3001' + factionInfo.chief.name;
                    };
                    con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + section_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name7 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                    type = "3";
                  }
                }
              } else if (userInputVc > faction_vc) {
                if (window.sessionStorage.getItem('section_id') == '' || window.sessionStorage.getItem('section_id') == '0') {
                  if (window.sessionStorage.getItem('faction_id') == '' || window.sessionStorage.getItem('faction_id') == '0') {
                    var _name8 = departInfo.master.name;
                    con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + faction_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name8 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                    type = "3";
                  } else {
                    var _name9 = factionInfo.chief.name;
                    if (factionInfo.chief.name != departInfo.master.name) {
                      _name9 += '\u3001' + departInfo.master.name;
                    };
                    con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + faction_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name9 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                    type = "3";
                  }
                } else {
                  var _name10 = sectionInfo.master.name;
                  if (factionInfo.chief.name != departInfo.master.name) {
                    _name10 += '\u3001' + factionInfo.chief.name;
                    _name10 += '\u3001' + departInfo.master.name;
                  }
                  con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + faction_vc + '\uFF0C\u4EFB\u52A1\u5C06<br/>\u63D0\u4EA4' + _name10 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                  type = "3";
                }
              } else {
                type = "1";
                con = "您确认要发布此任务吗？";
              }
            } else if (role_id === 3) {
              if (userInputVc > faction_vc) {
                con = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + faction_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + departInfo.master.name + '\u5BA1\u6838\uFF0C<br>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
                type = "3";
              } else {
                con = "您确认要发布此任务吗？";
                type = "1";
              }
            } else {
              type = "1";
              con = "您确认要发布此任务吗？";
            }
            var _title = "发布任务";
            zPopup(_title, type, con);
          } else {
            var _title2 = "发布任务";
            var _type2 = "1";
            var _con = "您确认要发布此任务吗？";
            zPopup(_title2, _type2, _con);
          }
        } else {
          var _personal_vc = 0;
          var _section_vc = 0;
          var _faction_vc = 0;
          var _con2 = "";
          var _type3 = "1";
          for (var _i2 = 0; _i2 < properties.length; _i2++) {
            if (properties[_i2].name === 'personal_vc') {
              _personal_vc = parseInt(properties[_i2].value);
            } else if (properties[_i2].name === 'section_vc') {
              _section_vc = parseInt(properties[_i2].value);
            } else if (properties[_i2].name === 'faction_vc') {
              _faction_vc = parseInt(properties[_i2].value);
            }
          }
          var _userInputVc = parseInt($('#base_vc').val());
          if (role_id === 2) {
            if (_userInputVc > _section_vc && _userInputVc < _faction_vc || _userInputVc === _faction_vc) {
              var _name11 = factionInfo.chief.name;
              _con2 = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + _section_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name11 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
              _type3 = "3";
            } else if (_userInputVc > _faction_vc) {
              var _name12 = factionInfo.chief.name;
              if (factionInfo.chief.name != departInfo.master.name) {
                _name12 += '\u3001' + departInfo.master.name;
              }
              _con2 = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + _faction_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + _name12 + '\u5BA1\u6838\uFF0C<br/>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
              _type3 = "3";
            } else {
              _type3 = "1";
              _con2 = "您确认要发布此任务吗？";
            }
          } else if (role_id === 3) {
            if (_userInputVc > _faction_vc) {
              _con2 = '\u60AC\u8D4F\u4EFB\u52A1VC\u8D85\u8FC7' + _faction_vc + '\uFF0C<br/>\u4EFB\u52A1\u5C06\u63D0\u4EA4' + departInfo.master.name + '\u5BA1\u6838\uFF0C<br>\u60A8\u786E\u8BA4\u53D1\u5E03\u5417\uFF1F';
              _type3 = "3";
            } else {
              _con2 = "您确认要发布此任务吗？";
              _type3 = "1";
            }
          } else {
            _type3 = "1";
            _con2 = "您确认要发布此任务吗？";
          }
          var _title3 = "发布任务";
          zPopup(_title3, _type3, _con2);
        }
      };

      var $baseVC = $('#base_vc').val();
      var $gold = $('#gold').val();
      var $mortgage = $('#mortgage').val();
      var $leader_level = $('#leader_level').val();
      $('#gold').siblings('span').text('\u91D1\u5E01\u5FC5\u987B\u662F\u5927\u4E8E\u7B49\u4E8E0\u7684\u6574\u6570');
      $('#base_vc').siblings('span').text('\u4EFB\u52A1VC\u5FC5\u987B\u662F\u5927\u4E8E\u7B49\u4E8E0\u7684\u6574\u6570');
      $('#mortgage').siblings('span').text('\u62BC\u91D1\u5FC5\u987B\u662F\u5927\u4E8E\u7B49\u4E8E0\u7684\u6574\u6570');
      if ($('#leader_grade').val()) {
        if (allGrade.indexOf($('#leader_grade').val().toUpperCase()) < 0) {
          errorTip($('#leader_grade'));
          $('#footerError').text('请输入正确的岗位级别！');
          $('#footerError').fadeIn(1000);
          setTimeout(function () {
            $('#footerError').fadeOut(1000);
          }, 3000);
          return;
        } else {
          if (allGrade.indexOf($('#leader_grade').val().toUpperCase()) > $('#leader_grade').data('gradeindex')) {
            errorTip($('#leader_grade'));
            $('#footerError').text('最低岗位级别不能高于您的级别！');
            $('#footerError').fadeIn(1000);
            setTimeout(function () {
              $('#footerError').fadeOut(1000);
            }, 3000);
            return;
          }
        }
      }
      if (!$baseVC && !$gold && !$mortgage && !$leader_level) {
        var error = false;
        service.getTime(function (res) {
          if (new Date(deadline.val()).getTime() < res.now) {
            error = true;
            $('#footerError').text('要求完成日期必须大于当前日期');
            $('#footerError').fadeIn(1000);
            setTimeout(function () {
              $('#footerError').fadeOut(1000);
            }, 3000);
          }
          if (error) {
            return false;
          }
          temp();
        });
      } else {
        var _error = false;
        $('.isErrorGroup').each(function () {
          var _this = this;

          var $this = $(this).val();
          if ($this && !isInt($this)) {
            $(this).addClass('error');
            $(this).siblings('span').fadeIn(1000);
            setTimeout(function () {
              $(_this).siblings('span').fadeOut(1000);
            }, 3000);
            _error = true;
          } else {
            $(this).removeClass('error');
          }
        });
        if (_error) {
          return false;
        }
        service.getTime(function (res) {
          if (new Date(deadline.val()).getTime() < res.now) {
            _error = true;
            $('#footerError').text('要求完成日期必须大于当前日期');
            $('#footerError').fadeIn(1000);
            setTimeout(function () {
              $('#footerError').fadeOut(1000);
            }, 3000);
          }
          if (_error) {
            return false;
          }
          if ($leader_level && !isInt($leader_level)) {
            _error = true;
            $('#footerError').fadeIn(1000);
            setTimeout(function () {
              $('#footerError').fadeOut(1000);
            }, 3000);
          }
          if ($('#base_vc').val()) {
            if (!faction_id) {
              if (personalTask && personalTask == 'true') {
                if (parseInt($('#base_vc').val()) > parseInt(personalVC)) {
                  $('#base_vc').addClass('error');
                  $('#base_vc').siblings('span').text('\u4E2A\u4EBA\u4EFB\u52A1VC\u5269\u4F59' + personalVC);
                  $('#base_vc').siblings('span').fadeIn(1000);
                  setTimeout(function () {
                    $('#base_vc').siblings('span').fadeOut(1000);
                  }, 3000);
                  _error = true;
                }
              } else {
                if (parseInt($('#base_vc').val()) > parseInt(departVC)) {
                  $('#base_vc').addClass('error');
                  $('#base_vc').siblings('span').text('\u8054\u76DFVC\u5269\u4F59' + departVC);
                  $('#base_vc').siblings('span').fadeIn(1000);
                  setTimeout(function () {
                    $('#base_vc').siblings('span').fadeOut(1000);
                  }, 3000);
                  _error = true;
                }
              }
            } else {
              if (parseInt($('#base_vc').val()) > parseInt(factionVC)) {
                $('#base_vc').addClass('error');
                $('#base_vc').siblings('span').text('\u5E2E\u4F1AVC\u5269\u4F59' + factionVC);
                $('#base_vc').siblings('span').fadeIn(1000);
                setTimeout(function () {
                  $('#base_vc').siblings('span').fadeOut(1000);
                }, 3000);
                _error = true;
              }
            }
          }
          if (_error) {
            return false;
          }
          if ($('#gold').val()) {
            if (!faction_id) {
              if (personalTask && personalTask == 'true') {
                if (parseInt($('#gold').val()) > parseInt(personalGold)) {
                  $('#gold').addClass('error');
                  $('#gold').siblings('span').text('\u4E2A\u4EBA\u91D1\u5E01\u5269\u4F59' + personalGold);
                  $('#gold').siblings('span').fadeIn(1000);
                  setTimeout(function () {
                    $('#gold').siblings('span').fadeOut(1000);
                  }, 3000);
                  _error = true;
                }
              } else {
                if (parseInt($('#gold').val()) > parseInt(departGold)) {
                  $('#gold').addClass('error');
                  $('#gold').siblings('span').text('\u8054\u76DF\u91D1\u5E01\u5269\u4F59' + departGold);
                  $('#gold').siblings('span').fadeIn(1000);
                  setTimeout(function () {
                    $('#gold').siblings('span').fadeOut(1000);
                  }, 3000);
                  _error = true;
                }
              }
            } else {
              if (parseInt($('#gold').val()) > parseInt(factionGold)) {
                $('#gold').addClass('error');
                $('#gold').siblings('span').text('\u5E2E\u4F1A\u91D1\u5E01\u5269\u4F59' + factionGold);
                $('#gold').siblings('span').fadeIn(1000);
                setTimeout(function () {
                  $('#gold').siblings('span').fadeOut(1000);
                }, 3000);
                _error = true;
              }
            }
          }
          if (_error) {
            return false;
          }
          if (parseInt($('#applicant_id').val()) || parseInt($('#applicant_id').val() === 0)) {
            if ($('#mortgage').val() && parseInt($('#mortgage').val()) > parseInt($('#applicant_id').data('gold'))) {
              $('#mortgage').addClass('error');
              $('#mortgage').siblings('span').text('\u6307\u5B9A\u9886\u961F\u4EFB\u52A1VC\u5269\u4F59' + $('#applicant_id').data('gold') + '\uFF0C\u4E0D\u8DB3\u4EE5\u652F\u4ED8\u62BC\u91D1\uFF01');
              $('#mortgage').siblings('span').fadeIn(1000);
              setTimeout(function () {
                $('#mortgage').siblings('span').fadeOut(1000);
              }, 3000);
              _error = true;
            }
          }
          if (_error) {
            return false;
          }
          if (!_error) {
            temp();
          }
        });
      }
    }
  });
  /*二次确认弹窗*/
  function zPopup(title, type, con) {
    var h = "";
    if (type == 1) {
      //两个按钮 一行
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn gotoDelete">确定</a>' + '</div>' + '</div>';
    } else if (type == 2) {
      //一个按钮
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '<div class="m-Popup-con"><span>' + con + '</span></div>' + '<div class="m-Popup-footer">' + '<a class="u-Popup-close  btnStyle" href="javascript:void(0)">确定</a>' + '</div>' + '</div>';
    }if (type == 3) {
      //三行
      h = '<div class="g-Popup-div">' + '</div>' + '<div class="g-Popup">' + '<div class="m-Popup-title">' + title + '</div>' + '<div class="m-Popup-con" style="line-height: 3rem">' + con + '</div>' + '<div class="m-Popup-footer">' + '<a class=" btnStyle u-Popup-close" href="javascript:void(0)">取消</a>' + '<a class=" btnStyle u-Popup-btn gotoDelete">确定</a>' + '</div>' + '</div>';
    }

    $(".feehideBox").html(h);
    //取消按钮
    $(".u-Popup-close").click(function () {
      window.parent.playClickEffect();
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
    //确定按钮
    $(".gotoDelete").off("click").on("click", function () {
      window.parent.playClickEffect();
      addTask(getObj());
      $(".g-Popup").hide();
      $(".g-Popup-div").hide();
    });
  }
  $('input[name="applicant_id"]').change(function () {
    var selectedvalue = parseInt($("input[name='applicant_id']:checked").val());
    if (selectedvalue || selectedvalue === 0) {
      $('input[name="applicant_id"]').eq(1).attr('checked', 'checked');
      $('#leaderRequire').css('display', 'none');
    } else {
      $('input[name="applicant_id"]').eq(0).attr('checked', 'checked');
      $('#leaderRequire').css('display', 'block');
      $('#leader_level').val('');
      $('#leader_grade').val('I');
      $('#leader_grade').data('value', 1);
    }
  });
  //创建任务
  function addTask(task) {
    service.add(task, function (res) {
      if (res.code == 400) {
        var title = "提示";
        var type = "2";
        var con = res.msg;
        zPopup(title, type, con);
      } else {
        // if(parseInt(task.applicant_id)||parseInt(task.applicant_id)===0){
        //   back(res._id,'continue')
        // }else{
        if (faction_id || faction_id == 0) {
          if (res.status === 1 || res.status === 2 || res.status === 3) {
            //back(res._id,'check')
            window.location.href = 'waitCheckTask.html?taskId=' + res._id + '&faction_id=' + faction_id;
          } else if (res.status === 4) {
            //back(res._id,'detail')
            window.location.href = 'tempTaskDetail.html?taskId=' + res._id + '&faction_id=' + faction_id;
          } else if (res.status === 5) {
            //back(res._id,'continue')
            window.location.href = 'tempContinueTask.html?taskId=' + res._id + '&faction_id=' + faction_id;
          } else {
            back();
          }
        } else if (personalTask && personalTask == 'true') {
          if (res.status === 1 || res.status === 2 || res.status === 3) {
            window.location.href = 'waitCheckTask.html?taskId=' + res._id + '&personalTask=true';
          } else if (res.status === 4) {
            window.location.href = 'tempTaskDetail.html?taskId=' + res._id + '&personalTask=true';
          } else if (res.status === 5) {
            window.location.href = 'tempContinueTask.html?taskId=' + res._id + '&personalTask=true';
          } else {
            back();
          }
        } else if (trialTask && trialTask == 'true') {
          if (res.status === 1 || res.status === 2 || res.status === 3) {
            window.location.href = 'waitCheckTask.html?taskId=' + res._id + '&trialTask=true';
          } else if (res.status === 4) {
            window.location.href = 'tempTaskDetail.html?taskId=' + res._id + '&trialTask=true';
          } else if (res.status === 5) {
            window.location.href = 'tempContinueTask.html?taskId=' + res._id + '&trialTask=true';
          } else {
            back();
          }
        } else {
          if (res.status === 1 || res.status === 2 || res.status === 3) {
            //back(res._id,'check')
            window.location.href = 'waitCheckTask.html?taskId=' + res._id;
          } else if (res.status === 4) {
            //back(res._id,'detail')
            window.location.href = 'tempTaskDetail.html?taskId=' + res._id;
          } else if (res.status === 5) {
            //back(res._id,'continue')
            window.location.href = 'tempContinueTask.html?taskId=' + res._id;
          } else {
            back();
          }
        }
      }
    });
  }
  function getFileName(o) {
    var pos = o.lastIndexOf("\\");
    return o.substring(pos + 1);
  }
  function back() {
    window.parent.playClickEffect();
    window.sessionStorage.removeItem('tempTaskObj');
    // window.sessionStorage.removeItem('fromPage');
    if (faction_id || faction_id == 0) {
      //let faction_id = window.sessionStorage.getItem('faction_id');
      window.parent.reloadWeb('app/h/taskList2.html?faction_id=' + faction_id + '&skipCocos=true', false, false, 1465, 820);
    } else if (personalTask && personalTask == 'true') {
      window.parent.reloadWeb('app/h/tasklistPersonal.html', false, false, 1465, 820);
    } else if (trialTask && trialTask == 'true') {
      window.parent.reloadWeb('app/h/ywc/tryTasklist.html', false, false, 1465, 820);
    } else {
      window.parent.reloadWeb('app/h/taskList.html', false, false, 1465, 820);
    }
  }
  //获取用户填写的信息
  function getObj() {
    var title = $('#title').val(),
        desc = $('#desc').val(),
        level = parseInt($('#taskLevel').data('num')),
        deadline = parseInt(new Date($('#deadline').val()).getTime()),
        exp = parseInt($('#exp').text()),
        base_vc = parseInt($('#base_vc').val()),
        gold = parseInt($('#gold').val()),
        mortgage = parseInt($('#mortgage').val()),
        applicant_id = $('input[name="applicant_id"]:checked').val(),
        leader_level = parseInt($('#leader_level').val()),
        leader_grade = $('#leader_grade').val().toUpperCase();
    if (faction_id || faction_id === 0) {
      taskObj.type = 1;
      taskObj.subtype = parseInt($('#bTaskType').data('value'));
      taskObj.faction_id = parseInt(faction_id);
    } else {
      if (personalTask && personalTask == 'true') {
        taskObj.type = 2;
        taskObj.subtype = 5;
      } else if (trialTask && trialTask == 'true') {
        taskObj.type = 3;
        taskObj.subtype = 6;
      } else {
        taskObj.type = 0;
        taskObj.subtype = parseInt($('#taskType').data('value'));
        taskObj.department_id = parseInt(department_id);
      }
    }
    if (title) {
      taskObj.title = title;
    }
    if (desc) {
      taskObj.remark = desc;
    }
    if (level || level === 0) {
      taskObj.level = level;
    }
    if (deadline) {
      taskObj.deadline = deadline;
    }
    if (exp || exp === 0) {
      taskObj.exp = exp;
    }
    if (base_vc || base_vc === 0) {
      taskObj.base_vc = base_vc;
    }
    if (gold || gold === 0) {
      taskObj.gold = gold;
    }
    if (mortgage || mortgage === 0) {
      taskObj.mortgage = mortgage;
    }
    if (applicant_id) {
      taskObj.applicant_id = applicant_id;
    }
    taskObj.assets = fileArr;
    if (taskObj.applicant_id || parseInt(taskObj.applicant_id) === 0) {
      if (taskObj.leader_level || taskObj.leader_level === 0) {
        delete taskObj.leader_level;
      }
      if (taskObj.leader_grade) {
        delete taskObj.leader_grade;
      }
    } else {
      if (leader_level || leader_level === 0) {
        taskObj.leader_level = leader_level;
      }
      if (leader_grade || leader_grade === 0) {
        taskObj.leader_grade = leader_grade;
      }
    }
    return taskObj;
  }
  //删除文档
  function deleteFile() {
    var index = $('#fileContainer .delete').index($(this));
    fileNames.splice(index, 1);
    fileArr.splice(index, 1);
    $(this).parent().remove();
  }
  function fileChange() {
    var _this2 = this;

    service.addAssert('file', function (res) {
      var file = $(_this2).val();
      var fileName = getFileName(file);
      addFile(fileName);
      fileNames.push(fileName);
      fileArr.push(res.url);
      $('#file').change(fileChange);
    });
  }
  //在页面展示添加的文档
  function addFile(name) {
    $('#fileContainer .item label').before('\n    <div class="item2">\n          <span class="filename">' + name + '</span>\n          <span class="delete"></span>\n        </div>\n    ');
  }
  function init(obj) {
    if (obj) {
      var $subtype = parseInt(obj.subtype);
      if ($subtype === 2) {
        $('#bTaskType').val('帮会挑战任务').attr('data-value', '2');
      } else if ($subtype === 3) {
        $('#bTaskType').val('帮会基础任务').attr('data-value', '3');
      } else if ($subtype === 4) {
        $('#bTaskType').val('帮会临时任务').attr('data-value', '4');
      }
      $('#taskType').attr('data-value', obj.subtype || 1);
      $('#title').attr('value', obj.title || '');
      $('#desc').attr('value', obj.remark || '');
      if (obj.level || obj.level == 0) {
        $('#taskLevel').attr('data-value', obj.level).attr('data-num', obj.level).attr('value', obj.level + '级');
      }
      if (obj.deadline) {
        document.getElementById('deadline').valueAsDate = new Date(obj.deadline);
      }
      $('#exp').text(obj.exp);
      $('#base_vc').attr('value', obj.base_vc || '');
      $('#mortgage').attr('value', obj.mortgage || '');
      $('#gold').attr('value', obj.gold || '');
      if (obj.leader_level || obj.leader_level !== 0) {
        $('#leader_level').attr('value', obj.leader_level);
      }
      if (obj.leader_grade) {
        $('#leader_grade').attr('value', obj.leader_grade).val(obj.leader_grade);
      }
      if (obj.assets && obj.assets.length > 0) {
        fileArr = obj.assets;
        for (var i = 0; i < obj.assets.length; i++) {
          var pos = obj.assets[i].lastIndexOf("\/");
          var name = obj.assets[i].substring(pos + 1);
          fileNames.push(name);
          addFile(name);
        }
      }
      window.sessionStorage.removeItem('tempTaskObj');
    } else {
      if (faction_id || faction_id === 0) {
        $('#taskType').attr('data-value', 1);
      } else {
        $('#taskType').attr('data-value', 2);
      }
      $('input[name="applicant_id"]').eq(0).attr('checked', 'checked');
    }
  }
  function getExpRole() {
    service.getExpRole(function (res) {
      expRole = res;
      var type = void 0,
          subtype = void 0,
          level = void 0;
      //判断是帮会任务还是联盟任务，显示选择任务类型
      if (faction_id || faction_id === 0) {
        taskObj.type = 1;
        type = 1;
        subtype = 2;
        level = 1;
        $('#lTaskTypeContainer').css('display', 'none');
        $('#PTaskTypeContainer').css('display', 'none');
        $('#STaskTypeContainer').css('display', 'none');
      } else {
        if (personalTask && personalTask == 'true') {
          taskObj.type = 5;
          type = 2;
          subtype = 5;
          $('#lTaskTypeContainer').css('display', 'none');
          $('#bTaskTypeContainer').css('display', 'none');
          $('#STaskTypeContainer').css('display', 'none');
          $(".taskGrade").css('display', 'none');
        } else if (trialTask && trialTask == 'true') {
          taskObj.type = 6;
          type = 3;
          subtype = 6;
          $('#lTaskTypeContainer').css('display', 'none');
          $('#bTaskTypeContainer').css('display', 'none');
          $('#PTaskTypeContainer').css('display', 'none');
          $(".taskGrade").css('display', 'none');
          $(".taskGrade2").css('display', 'none');
        } else {
          taskObj.type = 0;
          type = 0;
          subtype = 1;
          level = 1;
          $('#bTaskTypeContainer').css('display', 'none');
          $('#PTaskTypeContainer').css('display', 'none');
          $('#STaskTypeContainer').css('display', 'none');
        }
      }
      for (var i = 0; i < res.length; i++) {
        if (parseInt(res[i].type) === type && parseInt(res[i].subtype) === subtype && parseInt(res[i].level) === level) {
          $('#exp').text(res[i].exp);
          $("#base_vc").val(res[i].default_vc);
          $("#gold").val(res[i].default_gold);
          break;
        } else if (parseInt(res[i].type) === type) {
          $('#exp').text(res[i].exp);
          $("#base_vc").val(res[i].default_vc);
          $("#gold").val(res[i].default_gold);
          break;
        }
      }
    });
  }
  function getExpRoleFromAssignLeader() {
    service.getExpRole(function (res) {
      expRole = res;
      if (faction_id || faction_id === 0) {
        $('#lTaskTypeContainer').css('display', 'none');
        $('#PTaskTypeContainer').css('display', 'none');
        $('#STaskTypeContainer').css('display', 'none');
      } else if (personalTask && personalTask == 'true') {
        $('#bTaskTypeContainer').css('display', 'none');
        $('#lTaskTypeContainer').css('display', 'none');
        $('#STaskTypeContainer').css('display', 'none');
        $(".taskGrade").css('display', 'none');
      } else if (trialTask && trialTask == 'true') {
        $('#lTaskTypeContainer').css('display', 'none');
        $('#bTaskTypeContainer').css('display', 'none');
        $('#PTaskTypeContainer').css('display', 'none');
        $(".taskGrade").css('display', 'none');
        $(".taskGrade2").css('display', 'none');
      } else {
        $('#bTaskTypeContainer').css('display', 'none');
        $('#PTaskTypeContainer').css('display', 'none');
        $('#STaskTypeContainer').css('display', 'none');
      }
    });
  }
  function getProperties() {
    service.getProperties(function (res) {
      properties = res;
    });
  }
  function getDepartmentInfo(departmentId) {
    service.getDepartmentInfo(departmentId, function (res) {
      departInfo = res;
      departGold = res.gold;
      departVC = res.vc;
    });
  }
  function getFactionInfo(factionId) {
    service.getFactionInfo(factionId, function (res) {
      factionInfo = res;
      factionGold = res.gold;
      factionVC = res.vc;
    });
  }
  function getSectionsInfo(sectionId) {
    service.getSectionsInfo(sectionId, function (res) {
      sectionInfo = res;
    });
  }
  function getUserLeaderGrade(userid) {
    service.getUserLeaderGrade(userid, function (res) {
      personalInfo = res;
      personalGold = res.gold;
      personalVC = res.task_vc;
      var index = allGrade.indexOf(res.grade);
      $('#leader_grade').attr('data-gradeindex', index);
      // for(let i=0;i<index;i++){
      //   $(".leader_ul").append('<li>'+allGrade[i]+'</li>')
      // }
    });
  }
});