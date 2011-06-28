(function() {
  var Card, Game, _ref;
  _ref = App.Models, Game = _ref.Game, Card = _ref.Card;
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
      expect(tim.countCards()).toEqual(App.Settings.startCount);
      tom = game.createPlayer();
      expect(tom.countCards()).toEqual(App.Settings.startCount);
      return expect(game._players.length).toBe(2);
    });
    it("should tell me who's turn it is", function() {
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
    it("should give the next player some cards when I lay +2 or +4", function() {
      var me, plus2, plus4, you;
      me = game.createPlayer();
      you = game.createPlayer();
      plus4 = new Card('black', '+4');
      plus4.color = 'green';
      plus2 = new Card('green', '+2');
      game.start();
      game.putDown(plus4);
      expect(you.countCards()).toBe(App.Settings.startCount + 4);
      game.putDown(plus2);
      return expect(me.countCards()).toBe(App.Settings.startCount + 2);
    });
    it("should uncover a random card at game start", function() {
      expect(game._open).not.toBeInstanceof(Card);
      game.start();
      return expect(game._open).toBeInstanceof(Card);
    });
    return it("should throw an exception if the move isn't allowed", function() {
      var wishGreen;
      wishGreen = new Card('black', 'wish');
      wishGreen.color = 'green';
      game.putDown(wishGreen);
      expect(function() {
        return game.putDown(new Card('red', '7'));
      }).toThrow();
      return expect(function() {
        return game.putDown(new Card('green', '3'));
      }).not.toThrow();
    });
  });
}).call(this);
