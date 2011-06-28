class App.Models.Player extends Backbone.Model
  initialize: (@game) ->
    @_cards = []

  receive: (card) -> @_cards.push card

  countCards: -> @_cards.length
