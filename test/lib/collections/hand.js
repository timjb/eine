(function() {
  var Card, Hand;
  Hand = App.Collections.Hand;
  Card = App.Models.Card;
  describe("Hand (collection)", function() {
    return it("is sorted: 1. normal cards, then special cards 2. cards are grouped by color 3. within each color numbers come first, in ascending order", function() {
      var a, b, c, d, hand;
      hand = new Hand;
      hand.add([
        a = new Card({
          color: 'red',
          symbol: '9'
        }), b = new Card({
          color: 'black',
          symbol: 'wish'
        }), c = new Card({
          color: 'yellow',
          symbol: '+2'
        }), d = new Card({
          color: 'red',
          symbol: '0'
        })
      ]);
      expect(hand.at(0)).toBe(d);
      expect(hand.at(1)).toBe(a);
      expect(hand.at(2)).toBe(c);
      return expect(hand.at(3)).toBe(b);
    });
  });
}).call(this);
