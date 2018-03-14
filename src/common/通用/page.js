/**方法：
 * const stream = require("通用/page");
 * stream.showAlert(message, opt);
 */
require('./page.less');



export default {
  /* 不带文字纯loading */
  showNoTextLoad: function() {
    $("#noTextLoad").css('display', 'block');
  },

  hideNoTextLoad: function() {
    $("#noTextLoad").css('display', 'none');
  },

  /* 显示/隐藏 中间带文字loading */
  showHasTextLoad: function(loadingText) {
    $(".loadingText").text(loadingText);
    $("#hasTextLoad").css('display', 'block');
  },

  hideHasTextLoad: function() {
    $("#hasTextLoad").css('display', 'none');
  },

  /* 自定义 - 模态框 */
  showWarning: function (title, content, textColor) {
    $(".panel-heading").text(title);
    $(".panel-body").text(content);
    $(".panel-body").css('color', textColor || "black");
    $("#warningItem").css('display', 'block');
  },

  hideWarning: function () {
    $("#warningItem").css('display', 'none');
  },

  showAlert: function(message, opt) {
    opt = opt || {};
    var modal = $("#modalMessage");
    modal.find(".modal-title").text(opt.title || "信息");
    modal.find(".modal-body").text(message || "");
    if(opt.cancel) {
      modal.removeClass("singleButton");
      modal.find(".btn-default").css("display", "block").text(opt.cancel);
    } else {
      modal.addClass("singleButton");
    }
    modal.find(".btn-primary").text(opt.submit || "好");
    if (opt.callback) {
      modal.find(".btn-primary").off("click").on("click", opt.callback);
    }
    modal.modal();
  }
}
