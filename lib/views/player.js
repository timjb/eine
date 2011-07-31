(function() {
  var $;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = jQuery;
  App.Views.Player = (function() {
    __extends(Player, Backbone.View);
    function Player() {
      Player.__super__.constructor.apply(this, arguments);
    }
    Player.prototype.className = 'player';
    Player.prototype.initialize = function(options) {
      this.model.bind('change:current', __bind(function(m, isCurrent) {
        return $(this.el)[isCurrent ? 'addClass' : 'removeClass']('current');
      }, this));
      this.model.game.bind('change:state', __bind(function(m, state) {
        if (state === 'running') {
          return $(this.el).removeClass('winner');
        }
      }, this));
      return this.model.bind('winner', __bind(function() {
        return $(this.el).addClass('winner');
      }, this));
    };
    return Player;
  })();
}).call(this);
