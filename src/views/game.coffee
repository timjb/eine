{Card, Player} = App.Views

class App.Views.Game extends Backbone.View
  className: 'game'

  initialize: ->
    _.bindAll this, 'render'
    
    @model.bind 'change:open', @render
    @model.bind 'add:player', @render

  render: ->
    $(@el).html('')
    
    openCard = $((new Card model:(@model.get 'open')).render().el).addClass('open')
    
    closedCard = $(Card.closedHtml).click =>
      current = @model.currentPlayer()
      current.playCard null if current.type is 'human'
    
    $(@el)
      .append(closedCard)
      .append(openCard)
    
    return this if @model.players.length is 0
    
    humanPlayerIndex = null
    for i, player in @model.players
      if player.type is 'human'
        humanPlayerIndex = i
        break
    
    players = for i in [humanPlayerIndex..(humanPlayerIndex + @model.players.length - 1)]
      @model.players[i % @model.players.length]
    
    POSITIONS = switch @model.players.length
      when 1 then ['bottom']
      when 2 then ['bottom', 'top']
      when 3 then ['bottom', 'left', 'right']
      when 4 then ['bottom', 'left', 'top', 'right']
      else throw new Error "game view can handle at most 4 players"
    
    _.each players, (player, i) =>
      playerView = new Player model:player
      $(@el).append($(playerView.render().el).addClass POSITIONS[i])
    
    this
