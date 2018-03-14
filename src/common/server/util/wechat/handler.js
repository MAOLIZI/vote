let handlers = {};

module.exports = {
  registerRedirectHandler(state, handler) {
    handlers[state] = handler;
  },

  getRedirectHandler(state) {
    return handlers[state];
  }
}
