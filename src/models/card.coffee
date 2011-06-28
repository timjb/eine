class App.Models.Card extends Backbone.Model
  constructor: (color, symbol) ->
    # for compatibility reasons
    Backbone.Model.call @,
      color:   color
      symbol:  symbol
      special: color is @constructor.specialColor

  matches: (other) ->
    @get('special') or
    @get('symbol') is other.get('symbol') or
    @get('color') is other.get('color')

  @colors         = 'red green blue yellow'.split ' '
  @specialColor   = 'black'
  @normalSymbols  = '0 1 2 3 4 5 6 7 8 9 skip reverse +2'.split ' '
  @specialSymbols = ['wish', '+4']
  @symbols        = @normalSymbols.slice().concat(@specialSymbols)

  validate: (attrs) ->
    attrs = _.extend {}, attrs, @attributes
    return "invalid symbol" if @constructor.symbols.indexOf(attrs.symbol) is -1
    return "invalid color" if @constructor.colors.indexOf(attrs.color) is -1 and
                              attrs.color isnt @constructor.specialColor

  wish: (color) ->
    unless @get 'special'
      throw new Error("Can't wish a color, because this is no special card")
    @set color:color
    this

  @deck: ->
    unless @_cachedDeck
      @_cachedDeck = deck = []
      
      for color in @colors
        for symbol in @normalSymbols
          for i in [0,1]
            deck.push(new @ color, symbol)
      
      deck.push(new @ 'black', 'wish') for i in [1..4]
      deck.push(new @ 'black', '+4')   for i in [1..2]
    @_cachedDeck

  @random: ->
    deck = @deck()
    deck[Math.floor(Math.random() * deck.length)]
