(function() {
  var Card, Player, _ref;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  _ref = App.Views, Card = _ref.Card, Player = _ref.Player;
  App.Views.Game = (function() {
    __extends(Game, Backbone.View);
    function Game() {
      Game.__super__.constructor.apply(this, arguments);
    }
    Game.prototype.className = 'game';
    Game.prototype.initialize = function() {
      _.bindAll(this, 'render');
      this.model.bind('change:open', this.render);
      return this.model.bind('add:player', this.render);
    };
    Game.prototype.render = function() {
      var POSITIONS, closedCard, humanPlayerIndex, i, openCard, player, players, _len, _ref2;
      $(this.el).html('');
      openCard = $((new Card({
        model: this.model.get('open')
      })).render().el).addClass('open');
      closedCard = $(Card.closedHtml).click(__bind(function() {
        var current;
        current = this.model.currentPlayer();
        if (current.type === 'human') {
          return current.playCard(null);
        }
      }, this));
      $(this.el).append(closedCard).append(openCard);
      if (this.model.players.length === 0) {
        return this;
      }
      humanPlayerIndex = null;
      _ref2 = this.model.players;
      for (player = 0, _len = _ref2.length; player < _len; player++) {
        i = _ref2[player];
        if (player.type === 'human') {
          humanPlayerIndex = i;
          break;
        }
      }
      players = (function() {
        var _ref3, _results;
        _results = [];
        for (i = humanPlayerIndex, _ref3 = humanPlayerIndex + this.model.players.length - 1; humanPlayerIndex <= _ref3 ? i <= _ref3 : i >= _ref3; humanPlayerIndex <= _ref3 ? i++ : i--) {
          _results.push(this.model.players[i % this.model.players.length]);
        }
        return _results;
      }).call(this);
      POSITIONS = (function() {
        switch (this.model.players.length) {
          case 1:
            return ['bottom'];
          case 2:
            return ['bottom', 'top'];
          case 3:
            return ['bottom', 'left', 'right'];
          case 4:
            return ['bottom', 'left', 'top', 'right'];
          default:
            throw new Error("game view can handle at most 4 players");
        }
      }).call(this);
      _.each(players, __bind(function(player, i) {
        var playerView;
        playerView = new Player({
          model: player
        });
        return $(this.el).append($(playerView.render().el).addClass(POSITIONS[i]));
      }, this));
      return this;
    };
    return Game;
  })();
}).call(this);
