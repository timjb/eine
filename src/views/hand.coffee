$ = jQuery

CardV = App.Views.Card

class App.Views.Hand extends Backbone.View
  tagName: 'ol'
  className: 'hand'

  initialize: ->
    _.bindAll this, 'render'
    
    # TODO: maybe not that efficient
    @collection.bind('add', @render)
               .bind('remove', @render)
               .bind('refresh', @render)

  render: ->
    el = $ @el
    el.html('')
    @collection.each (card) =>
      view = new CardV(model:card).render()
      view.bind 'click', => @trigger 'click:card', card
      $('<li />')
        .append(view.el)
        .appendTo(el)
    this
