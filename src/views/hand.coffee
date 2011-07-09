$ = jQuery

CardV = App.Views.Card

class App.Views.Hand extends Backbone.View
  tagName: 'ol'
  className: 'hand'

  initialize: ->
    _.bindAll this, '_addCard', '_removeCard', 'render'
    
    @collection
      .bind('add',    @_addCard)
      .bind('remove', @_removeCard)
      .bind('reset',  @render)

  _addCard: (card) ->
    cardView = @_cardView card
    index = @collection.models.indexOf card
    @cardViews.splice(index, 0, cardView)
    cardEl = $('<li />').append(cardView.render().el)
      .addClass('hidden')
    if index is 0
      cardEl.prependTo @el
    else
      cardEl.insertAfter @$('li:not(.hidden)').eq(index - 1)
    setTimeout (-> cardEl.removeClass('hidden')), 10

  _removeCard: (card) ->
    i = 0
    for cardView in @cardViews
      if cardView.model is card
        @cardViews.splice(i, 1)
        li = $(cardView.el).parent()
        li.addClass('hidden')
        setTimeout((-> li.remove()), 500)
        break
      i += 1

  _cardView: (card) ->
    cardView = new CardV(model:card).render()
    cardView.bind 'click', => @trigger 'click:card', card

  render: ->
    $(@el).html('')
    
    @cardViews = []
    @collection.each (card) =>
      cardView = @_cardView card
      @cardViews.push cardView
      $('<li />')
        .append(cardView.el)
        .appendTo(@el)
    this
