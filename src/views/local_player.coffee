HandView = App.Views.Hand

class App.Views.LocalPlayer extends App.Views.Player

  events:
    'click .draw-or-next-button': '_clickDrawOrNextButton'

  initialize: (options) ->
    super(options)
    
    _.bindAll this, 'render'
    @_initHandView()
    @model.bind 'change:hand', =>
      oldEl = @handView.el
      @_initHandView()
      $(@handView.render().el).replaceAll(oldEl)
    @_initDrawOrNextButton()
    @_initEineButton()

  _initHandView: ->
    @handView = new HandView collection:@model.get('hand')
    @handView.bind 'click:card', (card) => @model.playCard card
    @model.bind 'receive', => @highlightMatchingCards @model.game.get('open')

  highlightMatchingCards: (args...) ->
    @handView.highlightMatchingCards(args...)
    this

  _initDrawOrNextButton: ->
    @drawOrNextButton = $('<a href="#" class="draw-or-next-button"></a>')
    
    buttonText = =>
      switch @model.game.get('state')
        when 'pre-start' then "Start"
        when 'running'
          if @model.get 'current'
            if @model.get 'didDraw'
              "Next Player"
            else
              "Draw a card"
          else
            ""
        when 'ended' then "Restart"
    
    updateButtonText = => @drawOrNextButton.html buttonText
    @model.game.bind 'change:state', updateButtonText
    @model.bind 'change:current', updateButtonText
    @model.bind 'change:didDraw', updateButtonText
    updateButtonText()

  _clickDrawOrNextButton: (event) ->
    event.preventDefault()
    switch @model.game.get('state')
      when 'pre-start'
        @model.start()
        @drawOrNextButton.html('')
      when 'running'
        if @model.get 'didDraw' then @model.next() else @model.draw()
      when 'ended'
        @model.restart()

  _initEineButton: ->
    @eineButton = $('<a href="#" class="eine-button">Eine!</a>').click (event) =>
      event.preventDefault()
      @model.eine()
    @model.bind 'change:saidEine', (m, didShe) =>
      @eineButton[if didShe then 'addClass' else 'removeClass']('active')

  render: ->
    $(@el)
      .append(@handView.render().el)
      .append(@drawOrNextButton)
      .append(@eineButton)
    this
