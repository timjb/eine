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
    @collection.each (card) ->
      $('<li />')
        .append(new CardV(model:card).render().el)
        .appendTo(el)
    this
