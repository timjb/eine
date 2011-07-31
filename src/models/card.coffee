((exports) ->

  _        = require('underscore') || window._
  Backbone = require('backbone')   || window.Backbone

  class exports.Card extends Backbone.Model
    initialize: ->
      if @get('special') is undefined
        @set { special:(@get('color') is @constructor.specialColor) }, { silent:yes }
      @set { id: _.uniqueId 'card' }, { silent:yes } unless @id

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
        throw new Error("Can't wish a color, because this is no special card.")
      @set color:color
      this

    @deck: _.memoize ->
      deck = []
      
      for color in @colors
        for symbol in @normalSymbols
          for i in [0,1]
            deck.push(new @(color:color, symbol:symbol))
      
      deck.push(new @(color:'black', symbol:'wish')) for i in [1..4]
      deck.push(new @(color:'black', symbol:'+4'))   for i in [1..2]
      deck

    @random: ->
      rand = (n) -> Math.floor(Math.random() * n)
      randomElement = (arr) -> arr[rand(arr.length)]
      randomCard = randomElement @deck()
      # Use constructor => new cid
      new @ { color:randomCard.get('color'), symbol:randomCard.get('symbol') }

    @randomNormal: ->
      until open and (open.get 'symbol').match /^[0-9]$/
        open = @random()
      open

)(exports || App.Models)
