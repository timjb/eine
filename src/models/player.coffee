{Hand} = App.Collections

class App.Models.Player extends Backbone.Model
  initialize: (attributes, options) ->
    @hand = new Hand
    @hand.bind 'all', =>
      @set numberOfCards:@hand.length

  receive: (card) -> @hand.add card

  countCards: -> @hand.length

  playCard: (card) ->
    if card
      card = @hand.getByCid(card) or @hand.get(card)
      throw new Error "Player doesn't have this card" unless card
      @game.putDown card
    else
      @game.putDown null

  playAI: ->
    open = @game.get 'open'
    hand = @hand
    
    chooseCard = ->
      for card in hand.models
        return card if card.matches open
      null
    
    chooseColor = (card) ->
      card.wish 'green' if card?.get 'special'
      card
    
    chosenCard = chooseColor(chooseCard())
    @playCard chosenCard
    @playCard chooseColor(chooseCard()) unless chosenCard
    @eine() if @countCards() is 1

  eine: -> @game.eine()
