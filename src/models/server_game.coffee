_ = require 'underscore'
{Game} = require './game'
{ServerPlayer} = require './server_player'

class exports.ServerGame extends Game

  initialize: ->
    super()
    _.bindAll this, '_close', '_resetCloseTimeout'
    
    @_resetCloseTimeout()
    @bind 'change', @_resetCloseTimeout
    
    @bind 'add:player', (newPlayer) =>
      @get('players').each (player) =>
        if player isnt newPlayer
          player.socket.emit 'trigger', @id, 'add:player', newPlayer
    
    @bind 'change:state', (m, state) =>
      @_emitToAll 'trigger', @id, 'change:state', null, state
    
    @bind 'change:current', (m, current) =>
      @_emitToAll 'trigger', @id, 'change:current', null, current.id
    
    @bind 'change:open', (m, open) =>
      @_emitToAll 'trigger', @id, 'change:open', null, open
    
    @bind 'winner', (w) =>
      @_emitToAll 'trigger', @id, 'winner', w.id

  _close: ->
    @_emitToAll 'msg', "The game was closed because it was inactive for too long."
    for player in @get('players').models
      player.unbind 'disconnect'
      player.socket.disconnect()
    @trigger 'garbage'

  _resetCloseTimeout: ->
    clearTimeout @closeTimeout
    @closeTimeout = setTimeout @_close, 1 * 60 * 1000

  _emitToAll: (args...) ->
    @get('players').each (player) -> player.socket.emit args...

  _emitToAllExcept: (excludedPlayer, args...) ->
    @get('players').each (player) ->
      player.socket.emit args... if player isnt excludedPlayer

  _allPlayersDisconnected: ->
    for player in @get('players').models
      return false if not player.disconnected
    return true

  createPlayer: (attributes, options) ->
    player = @_createPlayer ServerPlayer, attributes, options
    player.bind 'disconnect', =>
      @_close() if @_allPlayersDisconnected()
    player
