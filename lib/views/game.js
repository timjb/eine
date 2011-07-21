(function() {
  var $, Card, Player, _ref;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = jQuery;
  _ref = App.Views, Card = _ref.Card, Player = _ref.Player;
  App.Views.Game = (function() {
    __extends(Game, Backbone.View);
    function Game() {
      Game.__super__.constructor.apply(this, arguments);
    }
    Game.prototype.className = 'game';
    Game.prototype.initialize = function(options, humanPlayer) {
      this.humanPlayer = humanPlayer;
      _.bindAll(this, 'render');
      this.model.bind('change:open', __bind(function() {
        this._openCard().replaceAll(this.$('.open'));
        return this.humanPlayerView.highlightMatchingCards(this.model.get('open'));
      }, this));
      return this.model.players.bind('add', this.render);
    };
    Game.prototype._openCard = function() {
      return $((new Card({
        model: this.model.get('open')
      })).render().el).addClass('open');
    };
    Game.prototype._closedCard = function() {
      return $(Card.closedHtml).click(__bind(function() {
        var current;
        current = this.model.currentPlayer();
        if (current === this.humanPlayer) {
          if (current.get('didDraw')) {
            return current.next();
          } else {
            return current.draw();
          }
        }
      }, this));
    };
    Game.prototype.render = function() {
      var nextPlayers, positions;
      $(this.el).html('');
      this._openCard().appendTo(this.el);
      this._closedCard().appendTo(this.el);
      this.humanPlayerView = new Player({
        model: this.humanPlayer
      }, true);
      $(this.humanPlayerView.render().el).addClass('bottom').appendTo(this.el);
      nextPlayers = this.model.players.nextPlayers(this.humanPlayer);
      positions = (function() {
        switch (nextPlayers.length) {
          case 1:
            return ['top'];
          case 2:
            return ['left', 'right'];
          case 3:
            return ['left', 'top', 'right'];
          default:
            throw new Error("game view can handle at most 4 players");
        }
      })();
      _.each(_.zip(nextPlayers, positions), __bind(function(_arg) {
        var player, playerView, position;
        player = _arg[0], position = _arg[1];
        playerView = new Player({
          model: player
        }, false);
        return $(playerView.render().el).addClass(position).appendTo(this.el);
      }, this));
      this.humanPlayerView.highlightMatchingCards(this.model.get('open'));
      return this;
    };
    return Game;
  })();
}).call(this);
