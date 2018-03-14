

var visibleQueue = [];
var invisibleQueue = [];

var listened = false;

function listener() {
  var win = $(window);
  var windowScroll = win.scrollTop();
  var windowHeight = win.height();

  var fired = false;
  for (let i=0; i<visibleQueue.length; i++) {
    let item = visibleQueue[i];
    let offset = item.elm.offset().top;

    // offset为0可能表示该元素不在页面上了
    if ((windowScroll + windowHeight > offset && windowScroll < offset + item.elm.height()) || offset === 0) {
      visibleQueue[i] = null;
      fired = true;
      window.setTimeout(item.callback, 1);
    }
  }

  for (let i=0; i<invisibleQueue.length; i++) {
    let item = invisibleQueue[i];
    let offset = item.elm.offset().top;
    if ((windowScroll + windowHeight < offset || windowScroll > offset + item.elm.height()) || offset === 0) {
      invisibleQueue[i] = null;
      fired = true;
      window.setTimeout(item.callback, 1);
    }
  }

  if (fired) {
    visibleQueue = visibleQueue.filter((d)=>d!==null);
    invisibleQueue = invisibleQueue.filter((d)=>d!==null);
    refreshListener();
  }
}

function refreshListener() {
  if (!listened && (visibleQueue.length > 0 || invisibleQueue.length > 0)) {
    // 新的监听器
    $(window).on("scroll", listener);
    listened = true;
  }

  if (visibleQueue.length === 0 && invisibleQueue.length === 0) {
    $(window).off("scroll", listener);
    listened = false;
  }
}


export const whenVisible = function(elm, callback) {
  elm = $(elm);

  var win = $(window);
  var windowScroll = win.scrollTop();
  var windowHeight = win.height();

  let offset = elm.offset().top;

  if (offset === 0 && $(document.body).has(elm).length === 0) {
    // 元素不在页面上
    return;
  }
  // offset为0可能表示该元素不在页面上了
  if ((windowScroll + windowHeight > offset && windowScroll < offset + elm.height()) || offset === 0) {
    window.setTimeout(callback, 1);
  }else {
    visibleQueue.push({
      elm: elm,
      callback: callback
    });

    refreshListener();
  }

}

export const whenInvisible = function(elm, callback) {
  elm = $(elm);
  if ($(document.body).has(elm).length === 0) {
    // 元素不在页面上
    return;
  }
  invisibleQueue.push({
    elm: elm,
    callback: callback
  });

  refreshListener();
};
