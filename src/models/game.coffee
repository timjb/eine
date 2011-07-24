((exports) ->

  Backbone  = require('backbone') || window.Backbone
  Settings  = require('../settings') || App.Settings
  {Card}    = require('./card') || App.Models
  {Player}  = require('./player') || App.Models
  {Players} = require('../collections/players') || App.Collections

  class exports.Game extends Backbone.Model
    initialize: ->
      @players = new Players
      @set open:Card.randomNormal()
      
      @bind 'winner', (winner) -> winner.trigger 'winner'
      
      @bind 'change:current', (m, player) =>
        player.set current:yes
        @get('previous')?.set saidEine:no
        if previous = @previous 'current'
          previous.set current:no
          @set previous:previous

    start: -> @set current:@players.currentPlayer()

    createPlayer: (attributes) ->
      player = new Player attributes
      player.game = @
      @_give player, Settings.startCount
      @players.add player
      player

    _give: (player, n) ->
      player.receiveCards (Card.random() for i in [1..n]) # -> network

    _checkIfLastPlayerSaidEine: ->
      if previous = @get 'previous'
        if previous.get('numberOfCards') is 1 and not previous.get('saidEine')
          @_give previous, Settings.einePenalty

    putDown: (card) ->
      @_checkIfLastPlayerSaidEine()
      
      # check card
      throw new Error "invalid move"    unless card.matches(@get 'open')
      throw new Error "no color chosen" if card.get('color') is Card.specialColor
      
      current = @get 'current'
      
      # move card from the players hand to the stack
      current.hand.remove card
      @set open:card
      
      # do we have a winner?
      if current.get('numberOfCards') is 0
        @trigger 'winner', current
        return
      
      @players.reverseDirection() if card.get('symbol') is 'reverse'
      @players.next()             if card.get('symbol') is 'skip'
      @players.next()
      
      newCurrent = @players.currentPlayer()
      
      for n in [2,4]
        @_give newCurrent, n if card.get('symbol') is "+#{n}"
      
      @set current:newCurrent

    draw: ->
      @_checkIfLastPlayerSaidEine()
      @_give @get('current'), 1

    next: ->
      @_checkIfLastPlayerSaidEine()
      @players.next()
      @set current:@players.currentPlayer()

)(exports || App.Models)
