{Hand} = App.Collections

class App.Models.Player extends Backbone.Model
  initialize: (attributes, options) ->
    @hand = new Hand
    @hand.bind 'all', =>
      @set numberOfCards:@hand.length
    @bind 'current', => @set didDraw:no

  receive: (card) ->
    @hand.add card
    @trigger 'receive'

  countCards: -> @hand.length

  playCard: (card) ->
    card = @hand.getByCid(card) or @hand.get(card)
    throw new Error "Player doesn't have this card" unless card
    @game.putDown card

  draw: ->
    @game.draw()
    @set didDraw:yes

  next: ->
    throw new Error "You must draw a card before." unless @get('didDraw')
    @game.next()

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
    
    if chosenCard = chooseColor(chooseCard())
      @playCard chosenCard
    else
      @draw()
      if chosenCard = chooseColor(chooseCard())
        @playCard chosenCard
      else
        @next()
    
    @eine() if @countCards() is 1

  eine: -> @game.eine()
