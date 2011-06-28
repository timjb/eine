Player = App.Models.Player
Card   = App.Models.Card

class App.Models.Game extends Backbone.Model
  initialize: ->
    @_players = []
    @_clockwise = yes
    #@_stack   = []
    #@_open    = null

  createPlayer: ->
    player = new Player
    @_players.push player
    player.receive Card.random() for i in [1..App.Settings.startCount]
    player

  start: ->
    @_current = 0
    @trigger 'next', @currentPlayer()

  currentPlayer: -> @_players[@_current] or null

  putDown: (card) ->
    isSkip    = card.symbol is 'skip'
    isReverse = card.symbol is 'reverse'
    @_clockwise = not @_clockwise if isReverse
    currentOffset = (if @_clockwise then 1 else -1) * (if isSkip then 2 else 1)
    @_current = ((@_current + currentOffset) + @_players.length) % @_players.length
    @trigger 'next', @currentPlayer()
