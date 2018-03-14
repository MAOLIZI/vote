
export default function(url, options) {
  if (!window || !window.jQuery) {
    throw "动态载入模块只能在浏览器环境中使用，并且需要引入jQuery";
  }
  // Allow user to set any option except for dataType, cache, and url
  options = $.extend( options || {}, {
    dataType: "script",
    cache: true,
    url: url
  });

  // Use $.ajax() since it is more flexible than $.getScript
  // Return the jqXHR object so we can chain callbacks
  return window.jQuery.ajax( options );
}
