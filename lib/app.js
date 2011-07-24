(function() {
  window.App = {
    Routers: {},
    Models: {},
    Collections: {},
    Views: {},
    Settings: {}
  };
  window.exports = void 0;
  window.require = function() {
    return;
  };
  $('window').ready(function() {
    new App.Routers.Application;
    return Backbone.history.start();
  });
}).call(this);
