((exports) ->

  _         = require('underscore') || window._
  Backbone  = require('backbone') || window.Backbone
  Settings  = require('../settings') || App.Settings
  {Card}    = require('./card') || App.Models
  {Player}  = require('./player') || App.Models
  {Players} = require('../collections/players') || App.Collections
  {Hand}    = require('../collections/hand') || App.Collections

  class exports.Game extends Backbone.Model

    defaults: ->
      players: new Players
      open: Card.randomNormal()
      state: 'pre-start'

    initialize: ->
      @bind 'winner', (winner) -> winner.trigger 'winner'
      
      @bind 'change:current', (m, player) =>
        player.set current:yes
        @get('previous')?.set saidEine:no
        if previous = @previous 'current'
          previous.set current:no
          @set previous:previous

    start: ->
      @set current:@get('players').currentPlayer()
      @set state:'running'
    
    _newHand: -> new Hand(Card.random() for i in [1..Settings.startCount])
    
    restart: ->
      @get('players').each (player) =>
        player.set hand:@_newHand()
      players = @get 'players'
      players.next()
      @set current:players.currentPlayer()
      @unset 'previous'
      @set state:'running'
      @set open:Card.randomNormal()

    isRunning: -> @get('state') is 'running'
    
    _createPlayer: (Klass, attributes, options) ->
      attributes.hand ||= @_newHand()
      player = new Klass attributes, options
      player.game = @
      @get('players').add player
      @trigger 'add:player', player
      player

    createPlayer: (attributes, options) ->
      @_createPlayer Player, attributes, options

    _give: (player, n) ->
      player.receiveCards (Card.random() for i in [1..n]) # -> network

    _checkIfLastPlayerSaidEine: ->
      if previous = @get 'previous'
        # `<=` because of a rare case:
        # * 2 players
        # * One player has only 2 cards left.
        # * He plays a skip card and then a normal card.
        if previous.get('numberOfCards') <= 1 and not previous.get('saidEine')
          @_give previous, Settings.einePenalty

    playCard: (card) ->
      @_checkIfLastPlayerSaidEine()
      
      players = @get 'players'
      current = @get 'current'
      
      @set open:card
      
      # do we have a winner?
      if current.get('numberOfCards') is 0
        current.set current:no
        @trigger 'winner', current
        @set state:'ended'
        return
      
      players.reverseDirection() if card.get('symbol') is 'reverse'
      players.next()             if card.get('symbol') is 'skip'
      players.next()
      
      newCurrent = players.currentPlayer()
      
      for n in [2,4]
        @_give newCurrent, n if card.get('symbol') is "+#{n}"
      
      if current is newCurrent
        # can happen if there are two players,
        # one player has two cards and plays a 'skip' card
        console.log "foo"
        current.set current:no
        @set previous:current
        current.set current:yes
      else
        @set current:newCurrent

    draw: ->
      @_checkIfLastPlayerSaidEine()
      @_give @get('current'), 1

    next: ->
      @_checkIfLastPlayerSaidEine()
      @get('players').next()
      @set current:@get('players').currentPlayer()

)(exports || App.Models)
