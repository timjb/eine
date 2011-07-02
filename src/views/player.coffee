{Hand} = App.Views

class App.Views.Player extends Backbone.View
  initialize: ->
    @model.game.bind 'next', (current) =>
      $(@el)[if current is @model then 'addClass' else 'removeClass']('current')
    @model.game.bind 'winner', (winner) =>
      $(@el).addClass 'winner' if winner is @model

  render: ->
    if @model.type is 'human' # local, human player
      handView = new Hand collection:@model.hand
      handView.bind 'click:card', (card) => @model.playCard card
      $(@el).append(handView.render().el)
    this
