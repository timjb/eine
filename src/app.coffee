window.App =
  Controllers: {}
  Models: {}
  Collections: {}
  Views: {}
  Settings:
    startCount: 7

$('window').ready ->
  new App.Controllers.Application
  Backbone.history.start()
