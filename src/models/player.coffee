{Card} = App.Models
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
    
    rand = (n) -> Math.floor(Math.random() * n)
    randomElem = (arr) -> arr[rand(arr.length)]
    
    chooseCard = ->
      possible = hand.filter (card) -> card.matches open
      return randomElem(possible) if possible.length
      null
    
    chooseColor = (card) ->
      return card unless card?.get 'special'
      
      wishColor = 'green'
      max = 0
      for color in Card.colors
        if _.filter(hand.models, (card) -> card.get('color') is color).length > max
          wishColor = color
      card.wish wishColor
      card
    
    if chosenCard = chooseColor(chooseCard())
      @playCard chosenCard
    else
      @draw()
      if chosenCard = chooseColor(chooseCard())
        @playCard chosenCard
      else
        @next()
    
    # even computers sometimes forget to say eine
    @eine() if @countCards() is 1 and Math.random() < 0.9

  eine: -> @game.eine()
