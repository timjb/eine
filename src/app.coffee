window.App =
  Routers: {}
  Models: {}
  Collections: {}
  Views: {}
  Settings:
    startCount: 7
    einePenalty: 2

$('window').ready ->
  new App.Routers.Application
  Backbone.history.start()
