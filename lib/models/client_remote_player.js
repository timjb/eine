(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  App.Models.ClientRemotePlayer = (function() {
    __extends(ClientRemotePlayer, App.Models.Player);
    function ClientRemotePlayer() {
      ClientRemotePlayer.__super__.constructor.apply(this, arguments);
    }
    ClientRemotePlayer.prototype.initialize = function(attributes, options) {
      ClientRemotePlayer.__super__.initialize.call(this, attributes, options);
      return this.bind('server:change:numberOfCards', __bind(function(m, v) {
        return this.set({
          numberOfCards: v
        });
      }, this));
    };
    return ClientRemotePlayer;
  })();
}).call(this);
