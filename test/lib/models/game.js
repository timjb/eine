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
      expect(game.players).toEqual([]);
      tim = game.createPlayer();
      expect(tim.countCards()).toBe(App.Settings.startCount);
      tom = game.createPlayer();
      expect(tom.countCards()).toBe(App.Settings.startCount);
      return expect(game.players.length).toBe(2);
    });
    it("should open a 'normal' card at the beginning", function() {
      return _.times(25, function() {
        var open;
        game = new Game;
        expect(game.get('open')).not.toBeDefined();
        game.start();
        open = game.get('open');
        return expect(open.get('symbol')).toMatch(/[0-9]/);
      });
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
      game.putDown(new Card({
        color: 'black',
        symbol: 'wish'
      }).wish('red'));
      expectPlayer(christian);
      game.putDown(new Card({
        color: 'red',
        symbol: 'reverse'
      }));
      expectPlayer(tim);
      game.putDown(new Card({
        color: 'red',
        symbol: '0'
      }));
      expectPlayer(julia);
      game.putDown(new Card({
        color: 'red',
        symbol: 'skip'
      }));
      return expectPlayer(tim);
    });
    it("should give the next player some cards when I lay +2 or +4", function() {
      var me, plus2, plus4, you;
      me = game.createPlayer();
      you = game.createPlayer();
      plus4 = new Card({
        color: 'black',
        symbol: '+4'
      }).wish('green');
      plus2 = new Card({
        color: 'green',
        symbol: '+2'
      });
      game.start();
      game.putDown(plus4);
      expect(you.countCards()).toBe(App.Settings.startCount + 4);
      game.putDown(plus2);
      return expect(me.countCards()).toBe(App.Settings.startCount + 2);
    });
    it("should uncover a random card at game start", function() {
      expect(game.get('open')).not.toBeInstanceof(Card);
      game.start();
      return expect(game.get('open')).toBeInstanceof(Card);
    });
    return it("should throw an exception if the move isn't allowed", function() {
      var p;
      p = game.createPlayer();
      game.start();
      game.putDown(new Card({
        color: 'black',
        symbol: 'wish'
      }).wish('green'));
      expect(function() {
        return game.putDown(new Card({
          color: 'red',
          symbol: '7'
        }));
      }).toThrow();
      return expect(function() {
        return game.putDown(new Card({
          color: 'green',
          symbol: '3'
        }));
      }).not.toThrow();
    });
  });
}).call(this);
