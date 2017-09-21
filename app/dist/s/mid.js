'use strict';

var $ = window.$;
var MID = function MID() {};
MID.prototype = {
  get: function get(url, cb) {
    $.ajax({
      url: url,
      type: 'get',
      success: function success(res) {
        cb(res);
      },
      error: function error(res) {
        if (res.status == 401) {
          window.parent.backToLoginLayer();
        } else {
          console.log(res);
        }
      }
    });
  },
  delete: function _delete(url, cb) {
    $.ajax({
      url: url,
      type: 'delete',
      success: function success(res) {
        cb(res);
      },
      error: function error(res) {
        if (res.status == 401) {
          window.parent.backToLoginLayer();
        } else {
          console.log(res);
        }
      }
    });
  },
  deleteByArr: function deleteByArr(url, obj, cb) {
    var obj1 = {
      ids: obj
    };

    $.ajax({
      url: url,
      type: 'delete',
      contentType: 'application/json',
      data: JSON.stringify(obj1),
      success: function success(res) {
        cb(res);
      },
      error: function error(res) {
        if (res.status == 401) {
          window.parent.backToLoginLayer();
        } else {
          console.log(res);
        }
      }
    });
  },
  post: function post(url, obj, cb) {
    $.ajax({
      url: url,
      type: 'post',
      data: JSON.stringify(obj),
      contentType: 'application/json; charset=utf-8',
      success: function success(res) {
        cb(res);
      },
      error: function error(res) {
        if (res.status == 401) {
          window.parent.backToLoginLayer();
        } else if (res.status == 400) {
          console.log('400', res);
          var responseText = JSON.parse(res.responseText);
          cb({ code: 400, msg: responseText.error_msg });
        } else {
          console.log(res);
        }
      }
    });
  },
  put: function put(url, obj, cb) {
    $.ajax({
      url: url,
      type: 'put',
      data: JSON.stringify(obj),
      contentType: 'application/json; charset=utf-8',
      success: function success(res) {
        cb(res);
      },
      error: function error(res) {
        if (res.status == 401) {
          window.parent.backToLoginLayer();
        } else {
          console.log(res);
        }
      }
    });
  },
  uploadFile: function uploadFile(url, id, cb, page) {
    $.ajaxFileUpload({
      url: url,
      fileElementId: id,
      dataType: 'json',
      contentType: 'multipart/form-data',
      secureuri: false,
      success: function success(res) {
        if (parseInt(res.error_code) === 100001) {
          if (page && (page === 'user' || page === 'member')) {
            cb(res);
          } else {
            confirmAgain({
              title: '提示',
              content: {
                text: res.error_msg
              },
              btns: [{ domId: 'cancel', text: '确定' }]
            });
          }
        } else {
          cb(res);
        }
      },
      error: function error(res) {
        if (res.status == 401) {
          window.parent.backToLoginLayer();
        } else {
          console.log(res);
        }
      }
    });
  }
};