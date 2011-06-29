(function() {
  var $, CardM, CardV;
  $ = jQuery;
  CardM = App.Models.Card;
  CardV = App.Views.Card;
  describe("Card (view)", function() {
    return it("has it's color as it's class and it's symbol as it's content", function() {
      var card, view;
      card = new CardM('yellow', '6');
      view = new CardV({
        model: card
      }).render();
      expect($(view.el).hasClass('yellow')).toBe(true);
      return expect($(view.el).text()).toMatch(/6/);
    });
  });
}).call(this);
