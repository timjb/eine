$ = jQuery

class App.Views.Card extends Backbone.View
  className: 'card'

  events:
    click: 'triggerClick'

  render: ->
    SYMBOLS =
      reverse: '\u2942'
      skip:    '\u2717'
    
    symbol = @model.escape 'symbol'
    symbol = SYMBOLS[symbol] if SYMBOLS.hasOwnProperty symbol
    
    $(@el)
      .addClass(@model.escape 'color')
      .html(symbol)
    this

  triggerClick: -> @trigger 'click'

  @closedHtml = '<div class="card closed">?</div>'
