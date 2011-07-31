$ = jQuery

class App.Views.Player extends Backbone.View
  className: 'player'

  initialize: (options) ->
    @model.bind 'change:current', (m, isCurrent) =>
      $(@el)[if isCurrent then 'addClass' else 'removeClass']('current')
      
    @model.game.bind 'change:state', (m, state) =>
      $(@el).removeClass('winner') if state is 'running'
    @model.bind 'winner', => $(@el).addClass 'winner'
