(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  App.Models.Card = (function() {
    __extends(Card, Backbone.Model);
    function Card(color, symbol) {
      Backbone.Model.call(this, {
        color: color,
        symbol: symbol,
        special: color === this.constructor.specialColor
      });
    }
    Card.prototype.matches = function(other) {
      return this.get('special') || this.get('symbol') === other.get('symbol') || this.get('color') === other.get('color');
    };
    Card.colors = 'red green blue yellow'.split(' ');
    Card.specialColor = 'black';
    Card.normalSymbols = '0 1 2 3 4 5 6 7 8 9 skip reverse +2'.split(' ');
    Card.specialSymbols = ['wish', '+4'];
    Card.symbols = Card.normalSymbols.slice().concat(Card.specialSymbols);
    Card.prototype.validate = function(attrs) {
      attrs = _.extend({}, attrs, this.attributes);
      if (this.constructor.symbols.indexOf(attrs.symbol) === -1) {
        return "invalid symbol";
      }
      if (this.constructor.colors.indexOf(attrs.color) === -1 && attrs.color !== this.constructor.specialColor) {
        return "invalid color";
      }
    };
    Card.prototype.wish = function(color) {
      if (!this.get('special')) {
        throw new Error("Can't wish a color, because this is no special card");
      }
      this.set({
        color: color
      });
      return this;
    };
    Card.deck = function() {
      var color, deck, i, symbol, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
      if (!this._cachedDeck) {
        this._cachedDeck = deck = [];
        _ref = this.colors;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          color = _ref[_i];
          _ref2 = this.normalSymbols;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            symbol = _ref2[_j];
            _ref3 = [0, 1];
            for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
              i = _ref3[_k];
              deck.push(new this(color, symbol));
            }
          }
        }
        for (i = 1; i <= 4; i++) {
          deck.push(new this('black', 'wish'));
        }
        for (i = 1; i <= 2; i++) {
          deck.push(new this('black', '+4'));
        }
      }
      return this._cachedDeck;
    };
    Card.random = function() {
      var deck;
      deck = this.deck();
      return deck[Math.floor(Math.random() * deck.length)];
    };
    return Card;
  })();
}).call(this);
