(function() {
  var Card, Game, _ref;
  _ref = App.Models, Game = _ref.Game, Card = _ref.Card;
  describe("Player (model)", function() {
    return it("should receive cards", function() {
      var game, player;
      game = new Game;
      player = game.createPlayer();
      expect(player.countCards()).toBe(App.Settings.startCount);
      player.receive(new Card('black', 'wish'));
      return expect(player.countCards()).toBe(App.Settings.startCount + 1);
    });
  });
}).call(this);
