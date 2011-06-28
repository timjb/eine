Player = App.Models.Player

class App.Models.Game extends Backbone.Model
  initialize: ->
    @_players = []
    @_current = 0
    @_clockwise = yes
    #@_stack   = []
    #@_open    = null

  createPlayer: ->
    player = new Player
    @_players.push player
    player

  currentPlayer: -> @_players[@_current]

  putDown: (card) ->
    isSkip    = card.symbol is 'skip'
    isReverse = card.symbol is 'reverse'
    @_clockwise = not @_clockwise if isReverse
    currentOffset = (if @_clockwise then 1 else -1) * (if isSkip then 2 else 1)
    @_current = ((@_current + currentOffset) + @_players.length) % @_players.length
