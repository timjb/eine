Player = App.Models.Player
Card   = App.Models.Card

class App.Models.Game extends Backbone.Model
  initialize: ->
    @_players = []
    @_clockwise = yes
    @_open = null

  createPlayer: ->
    player = new Player
    @_players.push player
    @_give player, App.Settings.startCount
    player
  
  _give: (player, n) ->
    player.receive Card.random() for i in [1..n]

  start: ->
    @_current = 0
    @_open = Card.random()
    @trigger 'next', @currentPlayer()

  currentPlayer: -> @_players[@_current] or null

  putDown: (card) ->
    unless card.matches @_open
      console.log("doesn't match", card, @_open)
      throw new Error("invalid move")
    @_open = card
    
    isSkip    = card.get('symbol') is 'skip'
    isReverse = card.get('symbol') is 'reverse'
    @_clockwise = not @_clockwise if isReverse
    
    currentOffset = (if @_clockwise then 1 else -1) * (if isSkip then 2 else 1)
    @_current = (@_current + currentOffset + @_players.length) % @_players.length
    
    for n in [2,4]
      @_give @currentPlayer(), n if card.get('symbol') is "+#{n}"
    
    @trigger 'next', @currentPlayer()
