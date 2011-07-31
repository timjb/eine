(function() {
  var $, CardView, LocalPlayerView, RemotePlayerView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = jQuery;
  CardView = App.Views.Card;
  LocalPlayerView = App.Views.LocalPlayer;
  RemotePlayerView = App.Views.RemotePlayer;
  App.Views.Game = (function() {
    __extends(Game, Backbone.View);
    function Game() {
      Game.__super__.constructor.apply(this, arguments);
    }
    Game.prototype.className = 'game';
    Game.prototype.initialize = function(options, humanPlayer) {
      this.humanPlayer = humanPlayer;
      _.bindAll(this, 'render', 'renderRemotePlayers', '_showWinner');
      this._initHumanPlayerView();
      this._initOpenCardView();
      this._initClosedCardEl();
      this.model.bind('add:player', this.renderRemotePlayers);
      this.model.bind('change:open', __bind(function() {
        this._initOpenCardView();
        $(this.openCardView.render().el).replaceAll(this.$('.open'));
        return this.humanPlayerView.highlightMatchingCards(this.model.get('open'));
      }, this));
      this.model.bind('winner', this._showWinner);
      return this.model.bind('change:state', __bind(function() {
        if (this.model.get('state') === 'running') {
          return this.$('.win-message').remove();
        }
      }, this));
    };
    Game.prototype._initHumanPlayerView = function() {
      this.humanPlayerView = new LocalPlayerView({
        model: this.humanPlayer
      });
      return $(this.humanPlayerView.el).addClass('bottom');
    };
    Game.prototype._initOpenCardView = function() {
      this.openCardView = new CardView({
        model: this.model.get('open')
      });
      return $(this.openCardView.el).addClass('open');
    };
    Game.prototype._initClosedCardEl = function() {
      return this.closedCardEl = $(CardView.closedHtml).click(__bind(function() {
        var current;
        current = this.model.get('current');
        if (current === this.humanPlayer) {
          return current[current.get('didDraw') ? 'next' : 'draw']();
        }
      }, this));
    };
    Game.prototype._showWinner = function(winner) {
      var msg;
      msg = winner === this.humanPlayer ? "You have won!" : "" + (winner.escape('name')) + " has won!";
      return $('<p class="win-message" />').text(msg).appendTo(this.el);
    };
    Game.prototype.render = function() {
      $(this.el).html('').append(this.openCardView.render().el).append(this.closedCardEl).append(this.humanPlayerView.render().el);
      this.renderRemotePlayers();
      this.humanPlayerView.highlightMatchingCards(this.model.get('open'));
      return this;
    };
    Game.prototype.renderRemotePlayers = function() {
      var i, nextPlayers, player, playerView, positions, _ref;
      nextPlayers = this.model.get('players').nextPlayers(this.humanPlayer);
      this.playerViews || (this.playerViews = []);
      for (i = 0, _ref = nextPlayers.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        player = nextPlayers[i];
        playerView = this.playerViews[i];
        if (!playerView || playerView.model !== player) {
          playerView = new RemotePlayerView({
            model: player
          });
          $(playerView.render().el).appendTo(this.el);
          this.playerViews.splice(i, 0, playerView);
        }
      }
      positions = (function() {
        switch (nextPlayers.length) {
          case 0:
            return [];
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
      return _.each(_.zip(this.playerViews, positions), __bind(function(_arg) {
        var playerView, position;
        playerView = _arg[0], position = _arg[1];
        return $(playerView.el).removeClass('left').removeClass('top').removeClass('right').addClass(position);
      }, this));
    };
    return Game;
  })();
}).call(this);
