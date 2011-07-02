(function() {
  var $, CardM, CardV;
  $ = jQuery;
  CardM = App.Models.Card;
  CardV = App.Views.Card;
  describe("Card (view)", function() {
    var card, view;
    card = view = null;
    beforeEach(function() {
      card = new CardM({
        color: 'yellow',
        symbol: '6'
      });
      return view = new CardV({
        model: card
      }).render();
    });
    it("has it's color as it's class and it's symbol as it's content", function() {
      expect($(view.el).hasClass('yellow')).toBe(true);
      return expect($(view.el).text()).toMatch(/6/);
    });
    return it("should trigger the 'click' event when the user clicks it", function() {
      var triggered;
      triggered = false;
      view.bind('click', function() {
        return triggered = true;
      });
      expect(triggered).toBe(false);
      $(view.el).click();
      return expect(triggered).toBe(true);
    });
  });
}).call(this);
