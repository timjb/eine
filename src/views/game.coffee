$ = jQuery

{Card, Player} = App.Views

class App.Views.Game extends Backbone.View
  className: 'game'

  initialize: (options, @humanPlayer) ->
    _.bindAll this, 'render'
    
    @model.bind 'change:open', @render
    @model.players.bind 'all', @render

  render: ->
    $(@el).html('')
    
    openCard = $((new Card model:(@model.get 'open')).render().el).addClass('open')
      .appendTo(@el)
    
    closedCard = $(Card.closedHtml).click =>
      current = @model.currentPlayer()
      current.playCard null if current is @humanPlayer
    closedCard.appendTo(@el)
    
    humanPlayerView = new Player model:@humanPlayer, yes
    $(humanPlayerView.render().el)
      .addClass('bottom')
      .appendTo(@el)
    
    nextPlayers = @model.players.nextPlayers @humanPlayer
    
    positions = switch nextPlayers.length
      when 1 then ['top']
      when 2 then ['left', 'right']
      when 3 then ['left', 'top', 'right']
      else throw new Error "game view can handle at most 4 players"
    
    _.each _.zip(nextPlayers, positions), ([player, position]) =>
      playerView = new Player model:player, no
      $(playerView.render().el)
        .addClass(position)
        .appendTo(@el)
    
    this
