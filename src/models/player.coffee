class App.Models.Player extends Backbone.Model
  initialize: (@game) ->
    @_cards = []
