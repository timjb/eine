(function() {
  App.Models.Card = (function() {
    function Card(color, symbol) {
      this.color = color;
      this.symbol = symbol;
      this.special = this.color === this.constructor.specialColor;
    }
    Card.prototype.matches = function(other) {
      return this.special || this.symbol === other.symbol || this.color === other.color;
    };
    Card.colors = 'red green blue yellow'.split(' ');
    Card.specialColor = 'black';
    Card.normalSymbols = '0 1 2 3 4 5 6 7 8 9 skip reverse +2'.split(' ');
    Card.specialSymbols = ['wish', '+4'];
    Card.symbols = Card.normalSymbols.slice().concat(Card.specialSymbols);
    Card.prototype.validate = function() {
      if (this.constructor.symbols.indexOf(this.symbol) === -1) {
        return false;
      }
      if (this.constructor.colors.indexOf(this.color) === -1 && this.color !== this.constructor.specialColor) {
        return false;
      }
      return true;
    };
    Card.deck = function() {
      var color, deck, i, symbol, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
      deck = [];
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
      return deck;
    };
    Card.random = function() {
      var deck;
      deck = this.deck();
      return deck[Math.floor(Math.random() * deck.length)];
    };
    return Card;
  })();
}).call(this);
