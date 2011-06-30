(function() {
  var $, Card, HandC, HandV;
  $ = jQuery;
  Card = App.Models.Card;
  HandC = App.Collections.Hand;
  HandV = App.Views.Hand;
  describe("Hand (view)", function() {
    it("should display a list of cards", function() {
      var cards, el, hand, view;
      hand = new HandC;
      hand.add([
        new Card({
          color: 'red',
          symbol: '3'
        }), new Card({
          color: 'black',
          symbol: '+4'
        }), new Card({
          color: 'yellow',
          symbol: 'skip'
        })
      ]);
      view = new HandV({
        collection: hand
      });
      el = $(view.render().el);
      cards = $('li .card', el);
      expect(cards.length).toBe(3);
      expect(cards.eq(0).hasClass('red')).toBe(true);
      expect(cards.eq(1).hasClass('yellow')).toBe(true);
      return expect(cards.eq(2).hasClass('black')).toBe(true);
    });
    return it("should refresh automatically", function() {
      var el, hand, view;
      hand = new HandC;
      hand.add([
        new Card({
          color: 'blue',
          symbol: 'reverse'
        }), new Card({
          color: 'green',
          symbol: '1'
        })
      ]);
      view = new HandV({
        collection: hand
      });
      el = $(view.render().el);
      expect($('li .card', el).length).toBe(2);
      hand.add(new Card({
        color: 'red',
        symbol: '8'
      }));
      return expect($('li .card', el).length).toBe(3);
    });
  });
}).call(this);
