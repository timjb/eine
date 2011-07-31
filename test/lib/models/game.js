(function() {
  var Card, Game, Hand, _ref;
  _ref = App.Models, Game = _ref.Game, Card = _ref.Card;
  Hand = App.Collections.Hand;
  describe("Game (model)", function() {
    var game;
    game = null;
    beforeEach(function() {
      return game = new Game;
    });
    it("should create players", function() {
      var deepBlue, tim;
      expect(game.get('players').length).toBe(0);
      tim = game.createPlayer({
        name: "Tim"
      });
      expect(tim.get('numberOfCards')).toBe(App.Settings.startCount);
      deepBlue = game.createPlayer({
        name: "Deep Blue"
      });
      expect(deepBlue.get('numberOfCards')).toBe(App.Settings.startCount);
      return expect(game.get('players').length).toBe(2);
    });
    it("should tell me who's turn it is", function() {
      var christian, current, expectPlayer, julia, red0Card, redReverseCard, redSkipCard, tim, wishCard;
      tim = game.createPlayer({
        name: "Tim"
      });
      christian = game.createPlayer({
        name: "Christian"
      });
      julia = game.createPlayer({
        name: "Julia"
      });
      current = null;
      game.bind('change:current', function(m, p) {
        return current = p;
      });
      expectPlayer = function(p) {
        expect(current).toBe(p);
        return expect(game.get('current')).toBe(p);
      };
      wishCard = new Card({
        color: 'black',
        symbol: 'wish'
      });
      redReverseCard = new Card({
        color: 'red',
        symbol: 'reverse'
      });
      red0Card = new Card({
        color: 'red',
        symbol: '0'
      });
      redSkipCard = new Card({
        color: 'red',
        symbol: 'skip'
      });
      tim.receiveCards([wishCard, red0Card]);
      christian.receiveCards([redReverseCard]);
      julia.receiveCards([redSkipCard]);
      game.start();
      expectPlayer(tim);
      tim.playCard(wishCard.wish('red'));
      expectPlayer(christian);
      christian.playCard(redReverseCard);
      expectPlayer(tim);
      tim.playCard(red0Card);
      expectPlayer(julia);
      julia.playCard(redSkipCard);
      return expectPlayer(tim);
    });
    it("should give the next player some cards when I lay +2 or +4", function() {
      var me, plus2, plus4, you;
      me = game.createPlayer({
        name: "Tim"
      });
      you = game.createPlayer({
        name: "You"
      });
      plus4 = new Card({
        color: 'black',
        symbol: '+4'
      }).wish('green');
      plus2 = new Card({
        color: 'green',
        symbol: '+2'
      });
      me.receiveCards([plus4]);
      you.receiveCards([plus2]);
      game.start();
      me.playCard(plus4);
      expect(you.get('numberOfCards')).toBe(App.Settings.startCount + 4 + 1);
      you.playCard(plus2);
      return expect(me.get('numberOfCards')).toBe(App.Settings.startCount + 2);
    });
    it("should uncover a numbered, random card", function() {
      return _.times(25, function() {
        game = new Game;
        game.start();
        expect(game.get('open')).toBeInstanceof(Card);
        return expect((game.get('open')).get('symbol')).toMatch(/^[0-9]$/);
      });
    });
    return it("should throw an exception if the move isn't allowed", function() {
      var green3Card, p1, p2, red7Card, wishCard;
      p1 = game.createPlayer({
        name: "P1"
      });
      p2 = game.createPlayer({
        name: "P2"
      });
      wishCard = new Card({
        color: 'black',
        symbol: 'wish'
      });
      red7Card = new Card({
        color: 'red',
        symbol: '7'
      });
      green3Card = new Card({
        color: 'green',
        symbol: '3'
      });
      p1.receiveCards([wishCard]);
      p2.receiveCards([red7Card, green3Card]);
      game.start();
      p1.playCard(wishCard.wish('green'));
      expect(function() {
        return p2.playCard(red7Card);
      }).toThrow();
      return expect(function() {
        return p2.playCard(green3Card);
      }).not.toThrow();
    });
  });
}).call(this);
