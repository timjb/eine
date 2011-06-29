{Card} = App.Models

class App.Collections.Hand extends Backbone.Collection
  model: Card

  comparator: (card) ->
    colorIndex  = Card.colors.indexOf(card.get 'color')
    colorIndex  = 10 if colorIndex is -1
    symbolIndex = Card.symbols.indexOf(card.get 'symbol')
    colorIndex * 1000 + symbolIndex
