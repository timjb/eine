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
      var deepBlue, tim, triggered;
      expect(game.players).toEqual([]);
      triggered = false;
      game.bind('add:player', function() {
        return triggered = true;
      });
      tim = game.createPlayer('human');
      expect(triggered).toBe(true);
      expect(tim.type).toBe('human');
      expect(tim.countCards()).toBe(App.Settings.startCount);
      deepBlue = game.createPlayer('computer');
      expect(deepBlue.type).toBe('computer');
      expect(deepBlue.countCards()).toBe(App.Settings.startCount);
      return expect(game.players.length).toBe(2);
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
    it("should uncover a numbered, random card at game start", function() {
      return _.times(25, function() {
        game = new Game;
        game.start();
        expect(game.get('open')).toBeInstanceof(Card);
        return expect((game.get('open')).get('symbol')).toMatch(/[0-9]/);
      });
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
