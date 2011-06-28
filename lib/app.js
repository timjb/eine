(function() {
  window.App = {
    Controllers: {},
    Models: {},
    Views: {},
    Settings: {
      startCount: 7
    }
  };
  $('window').ready(function() {
    new App.Controllers.Application;
    return Backbone.history.start();
  });
}).call(this);
