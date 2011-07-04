(function() {
  var $, Card, Game, Hand, PlayerV, _ref;
  $ = jQuery;
  _ref = App.Models, Game = _ref.Game, Card = _ref.Card;
  Hand = App.Collections.Hand;
  PlayerV = App.Views.Player;
  describe("Player (view)", function() {
    it("gives the current player the css class 'current' and the winner 'winner'", function() {
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
    it("shows the numbe of cards a player has if the player is not human", function() {
      var cp1, cp1View, game, me, meView;
      game = new Game;
      me = game.createPlayer('human');
      cp1 = game.createPlayer('computer');
      meView = new PlayerV({
        model: me
      });
      cp1View = new PlayerV({
        model: cp1
      });
      cp1View.render();
      game.start();
      expect($('.count', meView.render().el).length).toBe(0);
      return _.times(5, function() {
        game.currentPlayer().playAI();
        return expect(+$('.count', cp1View.el).text()).toBe(cp1.countCards());
      });
    });
    it("shows the player's hand if the player's human", function() {
      var aiPlayer, game, humanPlayer;
      game = new Game;
      aiPlayer = game.createPlayer('computer');
      humanPlayer = game.createPlayer('human');
      expect($('.card', new PlayerV({
        model: aiPlayer
      }).render().el).length).toBe(0);
      return expect($('.card', new PlayerV({
        model: humanPlayer
      }).render().el).length).not.toBe(0);
    });
    return it("plays a card when the user clicks on it", function() {
      var aiPlayer, g5, g6, g7, g8, g9, game, humanPlayer, view;
      game = new Game;
      game = new Game;
      humanPlayer = game.createPlayer('human');
      humanPlayer.hand = new Hand;
      humanPlayer.hand.add([
        g5 = new Card({
          color: 'green',
          symbol: '5'
        }), g6 = new Card({
          color: 'green',
          symbol: '6'
        }), g7 = new Card({
          color: 'green',
          symbol: '7'
        }), g8 = new Card({
          color: 'green',
          symbol: '8'
        }), g9 = new Card({
          color: 'green',
          symbol: '9'
        })
      ]);
      aiPlayer = game.createPlayer('computer');
      game.start();
      game.set({
        'open': new Card({
          color: 'green',
          symbol: '0'
        })
      });
      view = new PlayerV({
        model: humanPlayer
      });
      $('.card', view.render().el).eq(1).click();
      expect(humanPlayer.hand.length).toBe(4);
      return expect(game.get('open')).toBe(g6);
    });
  });
}).call(this);
