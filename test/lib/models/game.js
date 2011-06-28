(function() {
  var Card, Game;
  Game = App.Models.Game;
  Card = App.Models.Card;
  describe("Game (model)", function() {
    var game;
    game = null;
    beforeEach(function() {
      return game = new Game;
    });
    it("should create players", function() {
      var tim, tom;
      expect(game._players).toEqual([]);
      tim = game.createPlayer();
      tom = game.createPlayer();
      return expect(game._players.length).toBe(2);
    });
    return it("should tell me who's turn it is", function() {
      var christian, julia, tim;
      tim = game.createPlayer();
      christian = game.createPlayer();
      julia = game.createPlayer();
      expect(game.currentPlayer()).toBe(tim);
      game.putDown(new Card('red', 'wish', true));
      expect(game.currentPlayer()).toBe(christian);
      game.putDown(new Card('red', 'reverse'));
      expect(game.currentPlayer()).toBe(tim);
      game.putDown(new Card('red', '0'));
      expect(game.currentPlayer()).toBe(julia);
      game.putDown(new Card('red', 'skip'));
      return expect(game.currentPlayer().toBe);
    });
  });
}).call(this);
