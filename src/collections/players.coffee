{Player} = App.Models

class App.Collections.Players extends Backbone.Collection
  model: Player

  initialize: ->
    @current   = 0
    @direction = 1 # clockwise

  reverseDirection: ->
    @direction *= -1

  next: ->
    normalize = (n) => (n + @length) % @length
    @current = normalize(@current + @direction)

  currentPlayer: ->
    @at @current

  nextPlayers: (player) ->
    index = @models.indexOf player
    throw "No such player." if index is -1
    for i in [(index + 1)..(index + @length - 1)]
      @at (i % @length)
