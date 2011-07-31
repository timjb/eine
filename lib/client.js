(function() {
  var ClientGame, ClientLocalPlayer, createFakeGame, displayError, game, getName, joinGame, localPlayer, newGame, renderOpenGames, showGame, showMessage;
  var __slice = Array.prototype.slice;
  ClientGame = App.Models.ClientGame;
  ClientLocalPlayer = App.Models.ClientLocalPlayer;
  game = localPlayer = null;
  window.ModelsManager = {
    models: {},
    add: function(model) {
      return this.models[model.id] = model;
    },
    create: function(Model, unparsedAttributes, options) {
      var model, parsedAttributes;
      parsedAttributes = Model.prototype.parse(unparsedAttributes, null);
      model = new Model(parsedAttributes, options);
      this.add(model);
      return model;
    },
    get: function(id) {
      return this.models[id];
    }
  };
  getName = function() {
    return $('#name').val();
  };
  $('#new-game').click(function() {
    return newGame(getName());
  });
  $('#open-games li').live('click', function() {
    var gameId;
    gameId = $(this).attr('data-id');
    return joinGame(getName(), gameId);
  });
  renderOpenGames = function(games) {
    var arrayToText, el, game, _i, _len;
    el = $('#open-games').html('').css({
      display: 'none'
    });
    arrayToText = function(arr) {
      switch (arr.length) {
        case 0:
          return "";
        case 1:
          return arr[0];
        default:
          return "" + (arr.slice(0, arr.length - 1).join(", ")) + " and " + arr[arr.length - 1];
      }
    };
    for (_i = 0, _len = games.length; _i < _len; _i++) {
      game = games[_i];
      $('<li />').attr('data-id', game.id).html(arrayToText(game.players)).appendTo(el);
    }
    return el.css({
      display: 'block'
    });
  };
  showGame = function() {
    var view;
    view = new App.Views.Game({
      model: game
    }, localPlayer);
    $('#games').fadeOut();
    return $(document.body).append(view.render().el);
  };
  displayError = function(msg) {
    if (window.console && console.error) {
      console.error("Error sent from server: " + msg);
    }
    return showMessage("Error: " + msg);
  };
  showMessage = function(msg) {
    var el;
    console.log("Message from server: " + msg);
    return el = $('<p class="message" />').text(msg).appendTo(document.body);
  };
  socket.on('open-games', renderOpenGames);
  socket.on('error', displayError);
  socket.on('msg', showMessage);
  createFakeGame = function() {
    return {
      _call: function() {
        var args, method;
        method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return socket.emit.apply(socket, [method].concat(__slice.call(args)));
      },
      eine: function() {
        return this._call('eine');
      },
      start: function() {
        return this._call('start');
      },
      restart: function() {
        return this._call('restart');
      },
      playCard: function(card) {
        return this._call('playCard', card);
      },
      draw: function() {
        return this._call('draw');
      },
      next: function() {
        return this._call('next');
      },
      get: function(attribute) {
        return game.get(attribute);
      },
      bind: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return game.bind.apply(game, args);
      },
      isRunning: function() {
        return game.isRunning();
      }
    };
  };
  socket.on('create', function(modelName, unparsedAttributes) {
    if (modelName === 'game') {
      return game = ModelsManager.create(ClientGame, unparsedAttributes);
    } else if (modelName === 'player') {
      localPlayer = game.createLocalPlayer(ClientLocalPlayer.prototype.parse(unparsedAttributes, null), {
        socket: socket
      });
      localPlayer.game = createFakeGame();
      ModelsManager.add(localPlayer);
      return showGame();
    }
  });
  socket.on('trigger', function() {
    var args, eventName, id, model;
    id = arguments[0], eventName = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    model = ModelsManager.get(id);
    if (model) {
      return model.trigger.apply(model, ["server:" + eventName].concat(__slice.call(args)));
    }
  });
  newGame = function(name) {
    return socket.emit('new-game', name);
  };
  joinGame = function(name, gameId) {
    return socket.emit('join-game', name, gameId);
  };
}).call(this);
