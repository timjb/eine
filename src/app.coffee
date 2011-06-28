window.App =
  Controllers: {}
  Models: {}
  Views: {}
  Settings:
    startCount: 7

$('window').ready ->
  new App.Controllers.Application
  Backbone.history.start()
