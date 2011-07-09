$ = jQuery

{Hand} = App.Views

class App.Views.Player extends Backbone.View
  className: 'player'

  initialize: (options, @isHuman) ->
    _.bindAll this, '_updateNumberOfCards', 'render'
    
    if @isHuman
      @handView = new Hand collection:@model.hand
      @handView.bind 'click:card', (card) => @model.playCard card
    
    @model.game.bind 'next', (current) =>
      $(@el)[if current is @model then 'addClass' else 'removeClass']('current')
    @model.game.bind 'winner', (winner) =>
      $(@el).addClass 'winner' if winner is @model
    @model.bind 'change:numberOfCards', @_updateNumberOfCards

  _updateNumberOfCards: ->
    @$('.number-of-cards').text @model.get('numberOfCards')

  render: ->
    $(@el).html('')
    
    if @isHuman # local, human player
      $(@el).append(@handView.render().el)
    else
      $('<span class="number-of-cards" />')
        .text(@model.get('numberOfCards'))
        .appendTo(@el)
    
    this
