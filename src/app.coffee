window.App =
  Routers: {}
  Models: {}
  Collections: {}
  Views: {}
  Settings: {}

window.exports = undefined
window.require = -> undefined

$('window').ready ->
  new App.Routers.Application
  Backbone.history.start()
