(function() {
  var Game, PlayerV;
  Game = App.Models.Game;
  PlayerV = App.Views.Player;
  describe("Player (view)", function() {
    return it("gives the current player the css class 'current' and the winner 'winner'", function() {
      var game, p1, p1V, p2, p2V, winner;
      game = new Game;
      p1 = game.createPlayer();
      p1V = new PlayerV({
        model: p1
      });
      p2 = game.createPlayer();
      p2.eine = function() {};
      p2V = new PlayerV({
        model: p2
      });
      winner = null;
      game.bind('winner', function(w) {
        return winner = w;
      });
      expect($(p1V.el).hasClass('current')).toBe(false);
      expect($(p2V.el).hasClass('current')).toBe(false);
      game.start();
      expect($(p1V.el).hasClass('current')).toBe(true);
      expect($(p2V.el).hasClass('current')).toBe(false);
      p1.playAI();
      expect($(p1V.el).hasClass('current')).toBe(false);
      expect($(p2V.el).hasClass('current')).toBe(true);
      while (!winner) {
        game.currentPlayer().playAI();
      }
      expect($(p1V.el).hasClass('winner')).toBe(true);
      return expect($(p2V.el).hasClass('winner')).toBe(false);
    });
  });
}).call(this);
