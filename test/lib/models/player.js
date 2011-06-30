(function() {
  var Card, Game, startCount, _ref;
  _ref = App.Models, Game = _ref.Game, Card = _ref.Card;
  startCount = App.Settings.startCount;
  describe("Player (model)", function() {
    it("should receive cards", function() {
      var game, player;
      game = new Game;
      player = game.createPlayer();
      expect(player.countCards()).toBe(startCount);
      player.receive(new Card({
        color: 'black',
        symbol: 'wish'
      }));
      return expect(player.countCards()).toBe(startCount + 1);
    });
    it("should draw cards", function() {
      var card, game, hasCard, i, nina, tim, _i, _len, _ref2, _results;
      hasCard = function(player, card) {
        var doesShe;
        doesShe = false;
        player.hand.each(function(card2) {
          if (card.get('color') === card2.get('color') && card.get('symbol') === card2.get('symbol')) {
            return doesShe = true;
          }
        });
        return doesShe;
      };
      _results = [];
      for (i = 1; i <= 5; i++) {
        game = new Game;
        tim = game.createPlayer();
        nina = game.createPlayer();
        game.start();
        expect(tim.countCards()).toBe(startCount);
        expect(game.currentPlayer()).toBe(tim);
        tim.playCard(null);
        expect(tim.countCards()).toBe(startCount + 1);
        expect(game.currentPlayer()).toBe(tim);
        tim.playCard(null);
        expect(tim.countCards()).toBe(startCount + 1);
        expect(game.currentPlayer()).toBe(nina);
        _ref2 = Card.deck();
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          card = _ref2[_i];
          if (!hasCard(nina, card) || !card.matches(game.get('open'))) {
            expect(function() {
              return nina.playCard(card);
            }).toThrow();
          }
        }
        _results.push((function() {
          var _j, _len2, _ref3, _results2;
          _ref3 = nina.hand.models;
          _results2 = [];
          for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
            card = _ref3[_j];
            if (card.matches(game.get('open'))) {
              if (card.get('special')) {
                card.wish('green');
              }
              nina.playCard(card);
              expect(nina.countCards()).toBe(startCount - 1);
              expect(game.currentPlayer()).toBe(tim);
              break;
            }
          }
          return _results2;
        })());
      }
      return _results;
    });
    it("should know how to play uno", function() {
      var game, i, player1, player2, winner;
      game = new Game;
      player1 = game.createPlayer();
      player2 = game.createPlayer();
      winner = null;
      game.bind('winner', function(w) {
        return winner = w;
      });
      game.start();
      i = 0;
      while (i < 1000 && !winner) {
        game.currentPlayer().playAI();
        i += 1;
      }
      expect(winner.countCards()).toBe(0);
      return expect(winner === player1 || winner === player2).toBe(true);
    });
    return it("should take forever for two computer players if they didn't know that they have to say 'eine'", function() {
      var game, i, player1, player2, winner;
      game = new Game;
      player1 = game.createPlayer();
      player2 = game.createPlayer();
      player1.eine = player2.eine = function() {};
      winner = null;
      game.bind('winner', function(w) {
        return winner = w;
      });
      game.start();
      i = 0;
      while (i < 1000 && !winner) {
        game.currentPlayer().playAI();
        i += 1;
      }
      return expect(winner === player1 || winner === player2).toBe(false);
    });
  });
}).call(this);
