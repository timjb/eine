(function() {
  var $, Card, Game, Hand, LocalPlayerView, RemotePlayerView, _ref;
  $ = jQuery;
  _ref = App.Models, Game = _ref.Game, Card = _ref.Card;
  Hand = App.Collections.Hand;
  LocalPlayerView = App.Views.LocalPlayer;
  RemotePlayerView = App.Views.RemotePlayer;
  describe("Player (view)", function() {
    it("gives the current player the css class 'current' and the winner 'winner'", function() {
      var game, p1, p1V, p2, p2V, winner, wishCard;
      game = new Game;
      p1 = game.createPlayer({
        name: "P1"
      });
      p1V = new RemotePlayerView({
        model: p1
      });
      p2 = game.createPlayer({
        name: "P2"
      });
      p2.eine = function() {};
      p2V = new RemotePlayerView({
        model: p2
      });
      wishCard = new Card({
        color: 'black',
        symbol: 'wish'
      });
      p1.receiveCards([wishCard]);
      winner = null;
      game.bind('winner', function(w) {
        return winner = w;
      });
      expect($(p1V.el).hasClass('current')).toBe(false);
      expect($(p2V.el).hasClass('current')).toBe(false);
      game.start();
      expect($(p1V.el).hasClass('current')).toBe(true);
      expect($(p2V.el).hasClass('current')).toBe(false);
      p1.playCard(wishCard.wish('blue'));
      expect($(p1V.el).hasClass('current')).toBe(false);
      expect($(p2V.el).hasClass('current')).toBe(true);
      while (!winner) {
        game.get('current').playAI();
      }
      expect($(p1V.el).hasClass('winner')).toBe(true);
      return expect($(p2V.el).hasClass('winner')).toBe(false);
    });
    it("shows the number of cards and the name if the player is not human", function() {
      var cp1, cp1View, game, me, meView;
      game = new Game;
      me = game.createPlayer({
        name: "Human"
      });
      cp1 = game.createPlayer({
        name: "Computer"
      });
      meView = new LocalPlayerView({
        model: me
      });
      cp1View = new RemotePlayerView({
        model: cp1
      });
      meView.render();
      cp1View.render();
      game.start();
      expect($('.name', meView.el).length).toBe(0);
      expect($('.number-of-cards', meView.el).length).toBe(0);
      expect($('.name', cp1View.el).text()).toBe("Computer");
      return _.times(5, function() {
        game.get('current').playAI();
        return expect(+$('.number-of-cards', cp1View.el).text()).toBe(cp1.get('numberOfCards'));
      });
    });
    it("should say eine if the user clicks the 'Eine!' button", function() {
      var game, loser, view, winner;
      game = new Game;
      winner = game.createPlayer({
        name: "I"
      });
      loser = game.createPlayer({
        name: "You"
      });
      view = new LocalPlayerView({
        model: winner
      });
      game.start();
      expect(winner.get('saidEine')).toBe(false);
      $('.eine-button', view.render().el).click();
      return expect(winner.get('saidEine')).toBe(true);
    });
    it("shows the player's hand if the player's human", function() {
      var aiPlayer, game, humanPlayer;
      game = new Game;
      aiPlayer = game.createPlayer({
        name: "Computer"
      });
      humanPlayer = game.createPlayer({
        name: "Human"
      });
      expect($('.card', new RemotePlayerView({
        model: aiPlayer
      }).render().el).length).toBe(0);
      return expect($('.card', new LocalPlayerView({
        model: humanPlayer
      }).render().el).length).not.toBe(0);
    });
    return it("plays a card when the user clicks on it", function() {
      var aiPlayer, g5, g6, g7, g8, g9, game, humanPlayer, view;
      game = new Game;
      humanPlayer = game.createPlayer({
        name: "human"
      });
      humanPlayer.set({
        hand: new Hand
      });
      humanPlayer.get('hand').add([
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
      aiPlayer = game.createPlayer({
        name: "computer"
      });
      game.start();
      game.set({
        'open': new Card({
          color: 'green',
          symbol: '0'
        })
      });
      view = new LocalPlayerView({
        model: humanPlayer
      });
      $('.card', view.render().el).eq(1).click();
      expect(humanPlayer.get('hand').length).toBe(4);
      return expect(game.get('open')).toBe(g6);
    });
  });
}).call(this);
