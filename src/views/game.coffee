$ = jQuery

CardView         = App.Views.Card
LocalPlayerView  = App.Views.LocalPlayer
RemotePlayerView = App.Views.RemotePlayer

class App.Views.Game extends Backbone.View
  className: 'game'

  initialize: (options, @humanPlayer) ->
    _.bindAll this, 'render', 'renderRemotePlayers', '_showWinner'
    
    @_initHumanPlayerView()
    @_initOpenCardView()
    @_initClosedCardEl()
    
    @model.bind 'add:player', @renderRemotePlayers
    @model.bind 'change:open', =>
      @_initOpenCardView()
      $(@openCardView.render().el).replaceAll(@$ '.open')
      @humanPlayerView.highlightMatchingCards(@model.get 'open')
    
    @model.bind 'winner', @_showWinner
    @model.bind 'change:state', =>
      @$('.win-message').remove() if @model.get('state') is 'running'

  _initHumanPlayerView: ->
    @humanPlayerView = new LocalPlayerView model:@humanPlayer
    $(@humanPlayerView.el).addClass 'bottom'

  _initOpenCardView: ->
    @openCardView = new CardView model:@model.get('open')
    $(@openCardView.el).addClass('open')

  _initClosedCardEl: ->
    @closedCardEl = $(CardView.closedHtml).click =>
      current = @model.get 'current'
      if current is @humanPlayer
        current[if current.get 'didDraw' then 'next' else 'draw']()

  _showWinner: (winner) ->
    msg = if winner is @humanPlayer
      "You have won!"
    else
      "#{winner.escape 'name'} has won!"
    $('<p class="win-message" />')
      .text(msg)
      .appendTo(@el)

  render: ->
    $(@el)
      .html('')
      .append(@openCardView.render().el)
      .append(@closedCardEl)
      .append(@humanPlayerView.render().el)
    
    
    @renderRemotePlayers()
    
    @humanPlayerView.highlightMatchingCards(@model.get 'open')
    
    this

  renderRemotePlayers: ->
    nextPlayers = @model.get('players').nextPlayers @humanPlayer
    
    @playerViews ||= []
    
    for i in [0...nextPlayers.length]
      player = nextPlayers[i]
      playerView = @playerViews[i]
      if not playerView or playerView.model isnt player
        playerView = new RemotePlayerView model:player
        $(playerView.render().el).appendTo(@el)
        @playerViews.splice i, 0, playerView
    
    positions = switch nextPlayers.length
      when 0 then []
      when 1 then ['top']
      when 2 then ['left', 'right']
      when 3 then ['left', 'top', 'right']
      else throw new Error "game view can handle at most 4 players"
    
    _.each _.zip(@playerViews, positions), ([playerView, position]) =>
      $(playerView.el)
        .removeClass('left').removeClass('top').removeClass('right')
        .addClass(position)
