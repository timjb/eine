(function() {
  var $, Hand;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  $ = jQuery;
  Hand = App.Views.Hand;
  App.Views.Player = (function() {
    __extends(Player, Backbone.View);
    function Player() {
      Player.__super__.constructor.apply(this, arguments);
    }
    Player.prototype.className = 'player';
    Player.prototype.initialize = function(options, isHuman) {
      this.isHuman = isHuman;
      _.bindAll(this, '_updateNumberOfCards', 'render');
      if (this.isHuman) {
        this.handView = new Hand({
          collection: this.model.hand
        });
        this.handView.bind('click:card', __bind(function(card) {
          return this.model.playCard(card);
        }, this));
      }
      this.model.game.bind('next', __bind(function(current) {
        return $(this.el)[current === this.model ? 'addClass' : 'removeClass']('current');
      }, this));
      this.model.game.bind('winner', __bind(function(winner) {
        if (winner === this.model) {
          return $(this.el).addClass('winner');
        }
      }, this));
      this.model.bind('change:numberOfCards', this._updateNumberOfCards);
      if (this.isHuman) {
        return this.model.bind('receive', __bind(function() {
          return this.highlightMatchingCards(this.model.game.get('open'));
        }, this));
      }
    };
    Player.prototype.highlightMatchingCards = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.handView).highlightMatchingCards.apply(_ref, args);
    };
    Player.prototype._updateNumberOfCards = function() {
      return this.$('.number-of-cards').text(this.model.get('numberOfCards'));
    };
    Player.prototype._eineButton = function() {
      return $('<a href="#" class="eine-button">Eine!</a>').click(__bind(function(event) {
        event.preventDefault();
        return this.model.eine();
      }, this));
    };
    Player.prototype.render = function() {
      if (this.isHuman) {
        $(this.el).append(this.handView.render().el).append(this._eineButton());
      } else {
        $(this.el).html("<span class=\"name\">" + (this.model.escape('name')) + "</span>\n<span class=\"number-of-cards\">" + (this.model.escape('numberOfCards')) + "</span>");
      }
      return this;
    };
    return Player;
  })();
}).call(this);
