class App.Models.Card
  constructor: (@color, @symbol) ->
    @special = @color is @constructor.specialColor

  matches: (other) ->
    @special or @symbol is other.symbol or @color is other.color

  @colors         = 'red green blue yellow'.split ' '
  @specialColor   = 'black'
  @normalSymbols  = '0 1 2 3 4 5 6 7 8 9 skip reverse +2'.split ' '
  @specialSymbols = ['wish', '+4']
  @symbols        = @normalSymbols.slice().concat(@specialSymbols)

  validate: ->
    return no if @constructor.symbols.indexOf(@symbol) is -1
    return no if @constructor.colors.indexOf(@color) is -1 and @color isnt @constructor.specialColor
    return yes

  @deck: ->
    deck = []
    
    for color in @colors
      for symbol in @normalSymbols
        for i in [0,1]
          deck.push(new @ color, symbol)
    
    deck.push(new @ 'black', 'wish') for i in [1..4]
    deck.push(new @ 'black', '+4')   for i in [1..2]
    
    deck

  @random: ->
    deck = @deck()
    deck[Math.floor(Math.random() * deck.length)]
