(function() {
  var $, GameM, GameV;
  $ = jQuery;
  GameM = App.Models.Game;
  GameV = App.Views.Game;
  describe("Game (view)", function() {
    it("displays the open card and a closed stack", function() {
      var el, game, p1, p2, view;
      game = new GameM;
      p1 = game.createPlayer();
      p2 = game.createPlayer();
      game.start();
      view = new GameV({
        model: game
      });
      el = view.render().el;
      expect($('.card.closed', el).length).toBe(1);
      return expect($('.card.open', el).html()).toMatch(game.get('open').get('symbol'));
    });
    return it("let's the player draw a card if he clicks on the closed stack", function() {
      var game, p1, p2, view;
      game = new GameM;
      p1 = game.createPlayer('human');
      p2 = game.createPlayer('computer');
      game.start();
      view = new GameV({
        model: game
      });
      $('.card.closed', view.render().el).click().click();
      expect(p1.countCards()).toBe(App.Settings.startCount + 1);
      return expect(game.currentPlayer()).toBe(p2);
    });
  });
}).call(this);
