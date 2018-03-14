
let HISTORY;
let BASE_URL = "/";

export default {
  init (history, base) {
    HISTORY = history;
    if (base[base.length-1] !== "/") base = base + "/";
    BASE_URL = base || "/";
  },

  getUrl (url) {
    if (url && url[0] === "/") {
      if (url.indexOf(BASE_URL) === 0) {
        url = url.replace(BASE_URL, "/");
      }

      return BASE_URL + url.substring(1);
    } else {
      return url;
    }
  },

  back() {
    window.history.back()
  },

  push (url) {
    url = this.getUrl(url);
    HISTORY.push(url);
  },

  replace (url) {
    url = this.getUrl(url);
    HISTORY.replace(url);
  },


  getHistory() {
    return HISTORY;
  }
}
