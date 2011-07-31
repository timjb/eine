class App.Views.RemotePlayer extends App.Views.Player

  initialize: (options) ->
    super(options)
    
    _.bindAll this, '_updateNumberOfCards', 'render'
    @model.bind 'change:numberOfCards', @_updateNumberOfCards

  _updateNumberOfCards: ->
    @$('.number-of-cards').text @model.get('numberOfCards')

  render: ->
    $(@el)
      .html """
            <span class="name">#{@model.escape 'name'}</span>
            <span class="number-of-cards">#{@model.escape 'numberOfCards'}</span>
            """
    this
