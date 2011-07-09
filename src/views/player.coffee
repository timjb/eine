$ = jQuery

{Hand} = App.Views

class App.Views.Player extends Backbone.View
  className: 'player'

  initialize: (options, @isHuman) ->
    _.bindAll this, 'render'
    
    @handView = new Hand collection:@model.hand
    @handView.bind 'click:card', (card) => @model.playCard card
    
    @model.game.bind 'next', (current) =>
      $(@el)[if current is @model then 'addClass' else 'removeClass']('current')
    @model.game.bind 'winner', (winner) =>
      $(@el).addClass 'winner' if winner is @model
    @model.bind 'change:numberOfCards', @render

  render: ->
    $(@el).html('')
    
    if @isHuman # local, human player
      $(@el).append(@handView.render().el)
    else
      $(@el).html '<span class="count">' + @model.countCards() + '</span>'
    
    this
