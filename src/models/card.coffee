class App.Models.Card
  constructor: (@color, @symbol, @special) ->

  matches: (other) ->
    @special or @symbol is other.symbol or @color is other.color

  @colors  = 'red green blue yellow'.split ' '
  @specialSymbols = 'wish +4'.split ' '
  @symbols = '0 1 2 3 4 5 6 7 8 9 skip reverse +2'.split ' '

  validate: ->
    if @special
      return false if @constructor.specialSymbols.indexOf(@symbol) is -1
    else
      return false if @constructor.symbols.indexOf(@symbol) is -1
    return false if @constructor.colors.indexOf(@color) is -1
    return false if not @special and @constructor.specialSymbols.indexOf(@symbol) isnt -1
    return true
