((exports) ->

  _        = require('underscore') || window._
  Backbone = require('backbone') || window.Backbone
  {Card}   = require('./card') || App.Models
  {Hand}   = require('../collections/hand') || App.Collections

  class exports.Player extends Backbone.Model
    initialize: (attributes, options) ->
      _.bindAll this, 'playAI'
      
      initHand = =>
        @set numberOfCards:@get('hand').length
        @get('hand').bind 'all', => @set numberOfCards:@get('hand').length
      @bind 'change:hand', initHand
      initHand()
      @bind 'change:current', (m, isCurrent) =>
        @set(didDraw:no, saidEine:no) if isCurrent

    parse: (resp, xhr) ->
      cards = _.map resp.hand, (card) -> new Card card
      resp.hand = new Hand cards
      resp

    start: -> @game.start()

    restart: -> @game.restart()

    receiveCards: (cards) ->
      @get('hand').add cards
      @trigger 'receive'

    _checkIfCurrent: ->
      throw new Error "It's not your turn." unless @get 'current'

    playCard: (cardClone) ->
      @_checkIfCurrent()
      
      card = @get('hand').get cardClone
      throw new Error "Player doesn't have this card" unless card
      
      # adjust color
      if card.get('special') and card.get('color') isnt cardClone.get('color')
        card.set color:cardClone.get('color')
      
      # check card
      throw new Error "invalid move"    unless card.matches(@game.get 'open')
      throw new Error "no color chosen" if card.get('color') is Card.specialColor
      
      @get('hand').remove card
      @game.playCard card

    draw: ->
      @_checkIfCurrent()
      @game.draw()
      @set didDraw:yes

    next: ->
      @_checkIfCurrent()
      throw new Error "You must draw a card before." unless @get('didDraw')
      @game.next()

    eine: -> @set saidEine:yes

    playAI: ->
      open = @game.get 'open'
      hand = @get 'hand'
      
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
      @eine() if @get('numberOfCards') is 1 and Math.random() < 0.9

)(exports || App.Models)
