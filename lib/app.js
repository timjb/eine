(function() {
  window.App = {
    Controllers: {},
    Models: {},
    Views: {}
  };
  $('window').ready(function() {
    new App.Controllers.Application;
    return Backbone.history.start();
  });
}).call(this);
