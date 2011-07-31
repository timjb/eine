(function() {
  var Card, Game, startCount, _ref;
  _ref = App.Models, Game = _ref.Game, Card = _ref.Card;
  startCount = App.Settings.startCount;
  describe("Player (model)", function() {
    it("should receive cards", function() {
      var game, player, spy;
      game = new Game;
      player = game.createPlayer({
        name: "Player"
      });
      player.bind('change:numberOfCards', (spy = jasmine.createSpy()));
      expect(player.get('numberOfCards')).toBe(startCount);
      player.receiveCards([
        new Card({
          color: 'black',
          symbol: 'wish'
        })
      ]);
      expect(spy).toHaveBeenCalled();
      return expect(player.get('numberOfCards')).toBe(startCount + 1);
    });
    it("should draw cards", function() {
      var card, game, hasCard, i, nina, ninaSpy, tim, timSpy, _i, _len, _ref2, _results;
      hasCard = function(player, card) {
        var card2, _i, _len, _ref2;
        _ref2 = player.get('hand').models;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          card2 = _ref2[_i];
          if (card.get('color') === card2.get('color') && card.get('symbol') === card2.get('symbol')) {
            return true;
          }
        }
      };
      _results = [];
      for (i = 1; i <= 10; i++) {
        game = new Game;
        tim = game.createPlayer({
          name: "Tim"
        });
        nina = game.createPlayer({
          name: "Nina"
        });
        tim.bind('change:numberOfCards', (timSpy = jasmine.createSpy()));
        nina.bind('change:numberOfCards', (ninaSpy = jasmine.createSpy()));
        game.start();
        expect(tim.get('numberOfCards')).toBe(startCount);
        expect(game.get('current')).toBe(tim);
        tim.draw();
        expect(timSpy).toHaveBeenCalled();
        expect(tim.get('numberOfCards')).toBe(startCount + 1);
        expect(game.get('current')).toBe(tim);
        tim.next();
        expect(tim.get('numberOfCards')).toBe(startCount + 1);
        expect(game.get('current')).toBe(nina);
        _ref2 = Card.deck();
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          card = _ref2[_i];
          if (!hasCard(nina, card) || !card.matches(game.get('open'))) {
            expect(function() {
              return nina.playCard(card);
            }).toThrow();
          }
        }
        expect(ninaSpy).not.toHaveBeenCalled();
        _results.push((function() {
          var _j, _len2, _ref3, _results2;
          _ref3 = nina.get('hand').models;
          _results2 = [];
          for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
            card = _ref3[_j];
            if (card.matches(game.get('open'))) {
              if (card.get('special')) {
                card.wish('green');
              }
              nina.playCard(card);
              expect(ninaSpy).toHaveBeenCalled();
              expect(nina.get('numberOfCards')).toBe(startCount - 1);
              if (card.get('symbol') !== 'skip') {
                expect(game.get('current')).toBe(tim);
              }
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
      player1 = game.createPlayer({
        name: "Player1"
      });
      player2 = game.createPlayer({
        name: "Player2"
      });
      winner = null;
      game.bind('winner', function(w) {
        return winner = w;
      });
      game.start();
      i = 0;
      while (i < 1000 && !winner) {
        game.get('current').playAI();
        i += 1;
      }
      expect(winner.get('numberOfCards')).toBe(0);
      return expect(winner === player1 || winner === player2).toBe(true);
    });
    return it("should take forever for three computer players if they didn't know that they have to say 'eine'", function() {
      var game, i, player1, player2, player3, winner;
      game = new Game;
      player1 = game.createPlayer({
        name: "Player1"
      });
      player2 = game.createPlayer({
        name: "Player2"
      });
      player3 = game.createPlayer({
        name: "Player3"
      });
      player1.eine = player2.eine = player3.eine = function() {};
      winner = null;
      game.bind('winner', function(w) {
        return winner = w;
      });
      game.start();
      i = 0;
      while (i < 1000 && !winner) {
        game.get('current').playAI();
        i += 1;
      }
      return expect(winner).toBe(null);
    });
  });
}).call(this);
