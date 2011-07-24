$ = jQuery

{Hand} = App.Views

class App.Views.Player extends Backbone.View
  className: 'player'

  initialize: (options, @isHuman) ->
    _.bindAll this, '_updateNumberOfCards', 'render'
    
    if @isHuman
      @handView = new Hand collection:@model.hand
      @handView.bind 'click:card', (card) => @model.playCard card
      @model.bind 'receive', => @highlightMatchingCards @model.game.get('open')
      @_initDrawOrNextButton()
      @_initEineButton()
      @model.bind 'change:saidEine', (m, didShe) =>
        @eineButton[if didShe then 'addClass' else 'removeClass']('active')
    
    @model.bind 'change:current', (m, isCurrent) =>
      $(@el)[if isCurrent then 'addClass' else 'removeClass']('current')
    @model.bind 'winner', => $(@el).addClass 'winner'
    @model.bind 'change:numberOfCards', @_updateNumberOfCards

  _initDrawOrNextButton: ->
    @drawOrNextButton = $('<a href="#" class="draw-or-next-button"></a>').click (event) =>
      event.preventDefault()
      if @model.get 'didDraw'
        @model.next()
      else
        @model.draw()
    @model.bind 'change:current', (m, isCurrent) =>
      @drawOrNextButton.text (if isCurrent then "Draw a card" else "")
    @model.bind 'change:didDraw', => @drawOrNextButton.text "Next Player" if @model.get 'didDraw'

  _initEineButton: ->
    @eineButton = $('<a href="#" class="eine-button">Eine!</a>').click (event) =>
      event.preventDefault()
      @model.eine()

  highlightMatchingCards: (args...) -> @handView.highlightMatchingCards(args...)

  _updateNumberOfCards: ->
    @$('.number-of-cards').text @model.get('numberOfCards')

  render: ->
    if @isHuman # local, human player
      $(@el)
        .append(@handView.render().el)
        .append(@drawOrNextButton)
        .append(@eineButton)
    else
      $(@el)
        .html """
              <span class="name">#{@model.escape 'name'}</span>
              <span class="number-of-cards">#{@model.escape 'numberOfCards'}</span>
              """
    
    this
