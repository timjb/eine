$ = jQuery

class App.Views.Card extends Backbone.View
  className: 'card'

  events:
    click: 'triggerClick'

  render: ->
    symbolHtml = '<span class="symbol">' + @model.get('symbol') + '</span>'
    $(@el)
      .addClass(@model.get 'color')
      .html(symbolHtml + symbolHtml)
    this

  triggerClick: -> @trigger 'click'
