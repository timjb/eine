(function() {
  describe("Card (model)", function() {
    var Card;
    Card = App.Models.Card;
    it("allows me to lay 'normal' cards on top of others if the symbol or the number matches", function() {
      var greenNine;
      greenNine = new Card({
        color: 'green',
        symbol: '9'
      });
      expect(new Card({
        color: 'green',
        symbol: '7'
      }).matches(greenNine)).toBe(true);
      expect(new Card({
        color: 'red',
        symbol: '9'
      }).matches(greenNine)).toBe(true);
      return expect(new Card({
        color: 'red',
        symbol: '7'
      }).matches(greenNine)).toBe(false);
    });
    it("allows me to lay special (=wild) cards on every other card", function() {
      var wishCard;
      wishCard = new Card({
        color: 'black',
        symbol: 'wish'
      }).wish('red');
      return expect(wishCard.matches(new Card({
        color: 'green',
        symbol: '9'
      }))).toBe(true);
    });
    it("validates cards", function() {
      var v;
      v = function(color, symbol) {
        var card;
        card = new Card({
          color: color,
          symbol: symbol
        });
        return !card.validate(card.attributes);
      };
      expect(v('green', '5')).toBe(true);
      expect(v('yellow', '5')).toBe(true);
      expect(v('blue', '5')).toBe(true);
      expect(v('red', '5')).toBe(true);
      expect(v('purple', '5')).toBe(false);
      expect(v('red', '0')).toBe(true);
      expect(v('red', '1')).toBe(true);
      expect(v('red', '2')).toBe(true);
      expect(v('red', '3')).toBe(true);
      expect(v('red', '4')).toBe(true);
      expect(v('red', '5')).toBe(true);
      expect(v('red', '6')).toBe(true);
      expect(v('red', '7')).toBe(true);
      expect(v('red', '8')).toBe(true);
      expect(v('red', '9')).toBe(true);
      expect(v('red', '+2')).toBe(true);
      expect(v('red', 'skip')).toBe(true);
      expect(v('red', 'reverse')).toBe(true);
      expect(v('black', '+4')).toBe(true);
      expect(v('black', 'wish')).toBe(true);
      expect(v('red', '+42')).toBe(false);
      return expect(v('lila', '+4')).toBe(false);
    });
    it("creates a typical card deck", function() {
      var card, deck, _i, _len, _results;
      deck = Card.deck();
      expect(deck.length).toBe(110);
      _results = [];
      for (_i = 0, _len = deck.length; _i < _len; _i++) {
        card = deck[_i];
        _results.push(expect(card).toBeInstanceof(Card));
      }
      return _results;
    });
    it("gives me a random card", function() {
      var card1, card2, i, isEqual, notEqual;
      notEqual = 0;
      for (i = 1; i <= 100; i++) {
        card1 = Card.random();
        card2 = Card.random();
        isEqual = card1.get('color') === card2.get('color') && card1.get('symbol') === card2.get('symbol');
        if (!isEqual) {
          notEqual += 1;
        }
      }
      return expect(notEqual).toBeGreaterThan(50);
    });
    return it("gives me a normal random card", function() {
      var i, _results;
      _results = [];
      for (i = 1; i <= 25; i++) {
        _results.push(expect(Card.randomNormal().get('symbol')).toMatch(/^[0-9]$/));
      }
      return _results;
    });
  });
}).call(this);
