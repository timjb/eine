window.App =
  Controllers: {}
  Models: {}
  Views: {}

$('window').ready ->
  new App.Controllers.Application
  Backbone.history.start()
