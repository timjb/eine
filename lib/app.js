(function() {
  window.App = {
    Routers: {},
    Models: {},
    Collections: {},
    Views: {},
    Settings: {
      startCount: 7,
      einePenalty: 2
    }
  };
  $('window').ready(function() {
    new App.Routers.Application;
    return Backbone.history.start();
  });
}).call(this);
