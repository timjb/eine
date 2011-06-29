{Hand} = App.Collections

class App.Models.Player extends Backbone.Model
  initialize: (@game) ->
    @hand = new Hand

  receive: (card) -> @hand.add card

  countCards: -> @hand.length

  playCard: (card) ->
    if card
      card = @hand.getByCid(card) or @hand.get(card)
      throw new Error "Player doesn't have this card" unless card
      @game.putDown card
      @hand.remove card
    else
      @game.putDown null
