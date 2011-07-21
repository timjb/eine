{Card,Player} = App.Models
{Players} = App.Collections

class App.Models.Game extends Backbone.Model
  initialize: ->
    @players = new Players
    @bind 'next', =>
      @lastPlayer?.trigger 'not:current'
      @currentPlayer().trigger 'current'
    @set open:Card.randomNormal()

  start: ->
    @_saidEine = no
    @trigger 'next', @currentPlayer()

  createPlayer: (attributes) ->
    player = new Player attributes
    player.game = @
    @_give player, App.Settings.startCount
    @players.add player
    player

  currentPlayer: -> @players.currentPlayer()
  
  _give: (player, n) -> player.receive Card.random() for i in [1..n]

  eine: -> @_saidEine = yes

  _checkIfLastPlayerSaidEine: ->
    if @lastPlayer?.countCards() is 1 and not @_saidEine
      null
      @_give @lastPlayer, App.Settings.einePenalty
    @_saidEine = no

  putDown: (card) ->
    @_checkIfLastPlayerSaidEine()
    
    # check card
    throw new Error "invalid move"    unless card.matches(@get 'open')
    throw new Error "no color chosen" if card.get('color') is Card.specialColor
    
    # move card from the players hand to the stack
    @currentPlayer().hand.remove card
    @set open:card
    
    # do we have a winner?
    if @currentPlayer().countCards() is 0
      @trigger 'winner', @currentPlayer()
      return
    
    @lastPlayer = @currentPlayer()
    
    @players.reverseDirection() if card.get('symbol') is 'reverse'
    @players.next()             if card.get('symbol') is 'skip'
    @players.next()
    
    for n in [2,4]
      @_give @currentPlayer(), n if card.get('symbol') is "+#{n}"
    
    @trigger 'next', @currentPlayer()

  draw: ->
    @_checkIfLastPlayerSaidEine()
    @_give @currentPlayer(), 1

  next: ->
    @_checkIfLastPlayerSaidEine()
    @lastPlayer = @currentPlayer()
    @players.next()
    @trigger 'next', @currentPlayer()
