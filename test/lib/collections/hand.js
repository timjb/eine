(function() {
  var Card, Hand;
  Hand = App.Collections.Hand;
  Card = App.Models.Card;
  describe("Hand (collection)", function() {
    return it("is sorted: 1. normal cards, then special cards 2. cards are grouped by color 3. within each color numbers come first, in ascending order", function() {
      var a, b, c, d, hand;
      hand = new Hand;
      hand.add([a = new Card('red', '9'), b = new Card('black', 'wish'), c = new Card('yellow', '+2'), d = new Card('red', '0')]);
      expect(hand.at(0)).toBe(d);
      expect(hand.at(1)).toBe(a);
      expect(hand.at(2)).toBe(c);
      return expect(hand.at(3)).toBe(b);
    });
  });
}).call(this);
