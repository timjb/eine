(function() {
  App.Models.Card = (function() {
    function Card(color, symbol, special) {
      this.color = color;
      this.symbol = symbol;
      this.special = special;
    }
    Card.prototype.matches = function(other) {
      return this.special || this.symbol === other.symbol || this.color === other.color;
    };
    Card.colors = 'red green blue yellow'.split(' ');
    Card.specialSymbols = 'wish +4'.split(' ');
    Card.symbols = '0 1 2 3 4 5 6 7 8 9 skip reverse +2'.split(' ');
    Card.prototype.validate = function() {
      if (this.special) {
        if (this.constructor.specialSymbols.indexOf(this.symbol) === -1) {
          return false;
        }
      } else {
        if (this.constructor.symbols.indexOf(this.symbol) === -1) {
          return false;
        }
      }
      if (this.constructor.colors.indexOf(this.color) === -1) {
        return false;
      }
      if (!this.special && this.constructor.specialSymbols.indexOf(this.symbol) !== -1) {
        return false;
      }
      return true;
    };
    return Card;
  })();
}).call(this);
