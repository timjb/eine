$ = jQuery

class App.Views.Card extends Backbone.View
  className: 'card'

  events:
    click: 'triggerClick'

  initialize: ->
    _.bindAll this, 'render'
    @model.bind 'set:color', @render

  render: ->
    symbol = @model.escape 'symbol'
    symbol = @constructor.SYMBOLS[symbol] if @constructor.SYMBOLS.hasOwnProperty symbol
    
    $(@el)
      .addClass(@model.escape 'color')
      .append($('<span />').html(symbol))
    
    if @model.get('special')
      for color in App.Models.Card.colors
        do (color) =>
          colorEl = $('<div class="color" />').addClass(color)
          if @model.get('color') is App.Models.Card.specialColor
            colorEl.click (event) =>
              @model.set color:color
              event.stopPropagation()
              @triggerClick()
          else if @model.get('color') is color
            colorEl.addClass 'active'
          colorEl.appendTo(@el)
    
    this

  @SYMBOLS:
    reverse: '\u2942'
    skip:    '\u2717'
    wish:    ''

  triggerClick: -> @trigger 'click'

  @closedHtml = '<div class="card closed" title="Draw card"><span>?</span></div>'
