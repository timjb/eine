(function() {
  var Card, ClientLocalPlayer, ClientRemotePlayer, Players;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ClientLocalPlayer = App.Models.ClientLocalPlayer;
  ClientRemotePlayer = App.Models.ClientRemotePlayer;
  Card = App.Models.Card;
  Players = App.Collections.Players;
  App.Models.ClientGame = (function() {
    __extends(ClientGame, App.Models.Game);
    function ClientGame() {
      ClientGame.__super__.constructor.apply(this, arguments);
    }
    ClientGame.prototype.initialize = function() {
      ClientGame.__super__.initialize.call(this);
      this.bind('server:add:player', function(unparsedAttributes) {
        var remotePlayer;
        remotePlayer = this.createRemotePlayer(ClientRemotePlayer.prototype.parse(unparsedAttributes, null));
        return ModelsManager.add(remotePlayer);
      });
      this.bind('server:change:state', __bind(function(m, state) {
        return this.set({
          state: state
        });
      }, this));
      this.bind('server:change:current', __bind(function(m, currentId) {
        var current;
        current = ModelsManager.get(currentId);
        return this.set({
          current: current
        });
      }, this));
      this.bind('server:change:open', __bind(function(m, openAttributes) {
        var open;
        open = new Card(openAttributes);
        return this.set({
          open: open
        });
      }, this));
      return this.bind('server:winner', __bind(function(winnerId) {
        var winner;
        winner = ModelsManager.get(winnerId);
        return this.trigger('winner', winner);
      }, this));
    };
    ClientGame.prototype.createPlayer = function() {
      throw new Error("Use createLocalPlayer of createRemotePlayer instead.");
    };
    ClientGame.prototype.createLocalPlayer = function(attributes, options) {
      return this._createPlayer(ClientLocalPlayer, attributes, options);
    };
    ClientGame.prototype.createRemotePlayer = function(attributes, options) {
      return this._createPlayer(ClientRemotePlayer, attributes, options);
    };
    ClientGame.prototype.parse = function(resp, xhr) {
      var players;
      resp.open = new Card(resp.open);
      players = _.map(resp.players, function(player) {
        return ModelsManager.create(ClientRemotePlayer, player);
      });
      resp.players = new Players(players);
      return resp;
    };
    return ClientGame;
  })();
}).call(this);
