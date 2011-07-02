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
    it("let's the player draw a card if he clicks on the closed stack", function() {
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
    return describe("it displays the players", function() {
      var el, game, human, view;
      game = view = el = human = null;
      beforeEach(function() {
        game = new GameM;
        view = new GameV({
          model: game
        });
        el = view.render().el;
        return human = game.createPlayer('human');
      });
      it("2 players", function() {
        var c1, playerEls;
        c1 = game.createPlayer('computer');
        game.start();
        playerEls = $('.player', el);
        expect(playerEls.eq(0)).toHaveClass('bottom');
        return expect(playerEls.eq(1)).toHaveClass('top');
      });
      it("3 players", function() {
        var c1, c2, playerEls;
        c1 = game.createPlayer('computer');
        c2 = game.createPlayer('computer');
        game.start();
        playerEls = $('.player', el);
        expect(playerEls.eq(0)).toHaveClass('bottom');
        expect(playerEls.eq(1)).toHaveClass('left');
        return expect(playerEls.eq(2)).toHaveClass('right');
      });
      return it("4 players", function() {
        var c1, c2, c3, playerEls;
        c1 = game.createPlayer('computer');
        c2 = game.createPlayer('computer');
        c3 = game.createPlayer('computer');
        game.start();
        playerEls = $('.player', el);
        expect(playerEls.eq(0)).toHaveClass('bottom');
        expect(playerEls.eq(1)).toHaveClass('left');
        expect(playerEls.eq(2)).toHaveClass('top');
        return expect(playerEls.eq(3)).toHaveClass('right');
      });
    });
  });
}).call(this);
