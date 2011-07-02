{Card} = App.Views

class App.Views.Game extends Backbone.View
  initialize: ->
    _.bindAll this, 'render'
    
    @model.bind 'change:open', @render

  render: ->
    openCardView = new Card model:(@model.get 'open')

    drawCard = =>
      current = @model.currentPlayer()
      current.playCard null if current.type is 'human'

    $(@el)
      .append($('<div class="card closed" />').click drawCard)
      .append($(openCardView.render().el).addClass 'open')
    this
