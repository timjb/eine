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
      expect(tim._cards.length).toEqual(App.Settings.startCount);
      tom = game.createPlayer();
      expect(tom._cards.length).toEqual(App.Settings.startCount);
      return expect(game._players.length).toBe(2);
    });
    return it("should tell me who's turn it is", function() {
      var christian, expectPlayer, julia, nextPlayer, tim;
      tim = game.createPlayer();
      christian = game.createPlayer();
      julia = game.createPlayer();
      nextPlayer = null;
      game.bind('next', function(p) {
        return nextPlayer = p;
      });
      expect(nextPlayer).toBeNull();
      expect(game.currentPlayer()).toBeNull();
      game.start();
      expectPlayer = function(p) {
        expect(nextPlayer).toBe(p);
        return expect(game.currentPlayer()).toBe(p);
      };
      expectPlayer(tim);
      game.putDown(new Card('red', 'wish'));
      expectPlayer(christian);
      game.putDown(new Card('red', 'reverse'));
      expectPlayer(tim);
      game.putDown(new Card('red', '0'));
      expectPlayer(julia);
      game.putDown(new Card('red', 'skip'));
      return expectPlayer(tim);
    });
  });
}).call(this);
