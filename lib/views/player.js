(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  App.Views.Player = (function() {
    __extends(Player, Backbone.View);
    function Player() {
      Player.__super__.constructor.apply(this, arguments);
    }
    Player.prototype.initialize = function() {
      this.model.game.bind('next', __bind(function(current) {
        return $(this.el)[current === this.model ? 'addClass' : 'removeClass']('current');
      }, this));
      return this.model.game.bind('winner', __bind(function(winner) {
        if (winner === this.model) {
          return $(this.el).addClass('winner');
        }
      }, this));
    };
    return Player;
  })();
}).call(this);
