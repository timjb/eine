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
      player.receive(new Card('black', 'wish'));
      return expect(player.countCards()).toBe(startCount + 1);
    });
    return it("should draw cards", function() {
      var game, hasCard, i, nina, tim, _results;
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
        _results.push(expect(game.currentPlayer()).toBe(nina));
      }
      return _results;
    });
  });
}).call(this);
