(function() {
  var __slice = Array.prototype.slice;
  describe("Card (model)", function() {
    var Card;
    Card = App.Models.Card;
    it("allows me to lay 'normal' cards on top of others if the symbol or the number matches", function() {
      var greenNine;
      greenNine = new Card('green', '9');
      expect(new Card('green', '7').matches(greenNine)).toBeTruthy();
      expect(new Card('red', '9').matches(greenNine)).toBeTruthy();
      return expect(new Card('red', '7').matches(greenNine)).toBeFalsy();
    });
    it("allows me to lay special (=wild) cards on every other card", function() {
      return expect(new Card('red', 'wish', true).matches(new Card('green', '9'))).toBeTruthy();
    });
    it("validates cards", function() {
      var v;
      v = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return typeof result === "object" ? result : child;
        })(Card, args, function() {}).validate();
      };
      expect(v('green', '5')).toBeTruthy();
      expect(v('yellow', '5')).toBeTruthy();
      expect(v('blue', '5')).toBeTruthy();
      expect(v('red', '5')).toBeTruthy();
      expect(v('purple', '5')).toBeFalsy();
      expect(v('red', '0')).toBeTruthy();
      expect(v('red', '1')).toBeTruthy();
      expect(v('red', '2')).toBeTruthy();
      expect(v('red', '3')).toBeTruthy();
      expect(v('red', '4')).toBeTruthy();
      expect(v('red', '5')).toBeTruthy();
      expect(v('red', '6')).toBeTruthy();
      expect(v('red', '7')).toBeTruthy();
      expect(v('red', '8')).toBeTruthy();
      expect(v('red', '9')).toBeTruthy();
      expect(v('red', '+2')).toBeTruthy();
      expect(v('red', 'skip')).toBeTruthy();
      expect(v('red', 'reverse')).toBeTruthy();
      expect(v('red', '+4', true)).toBeTruthy();
      expect(v('red', '+2', true)).toBeFalsy();
      expect(v('red', '+4')).toBeFalsy();
      expect(v('red', 'wish', true)).toBeTruthy();
      expect(v('red', 'wish')).toBeFalsy();
      return expect(v('red', '+42')).toBeFalsy();
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
    return it("gives me a random card", function() {
      var card1, card2, i, isEqual, notEqual;
      notEqual = 0;
      for (i = 1; i <= 100; i++) {
        card1 = Card.random();
        card2 = Card.random();
        isEqual = card1.color === card2.color && card1.symbol === card2.symbol;
        if (!isEqual) {
          notEqual += 1;
        }
      }
      return expect(notEqual).toBeGreaterThan(50);
    });
  });
}).call(this);
