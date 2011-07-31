{ClientLocalPlayer}  = App.Models
{ClientRemotePlayer} = App.Models
{Card}               = App.Models
{Players}            = App.Collections

class App.Models.ClientGame extends App.Models.Game

  initialize: ->
    super()
    
    @bind 'server:add:player', (unparsedAttributes) ->
      remotePlayer = @createRemotePlayer ClientRemotePlayer.prototype.parse(unparsedAttributes, null)
      ModelsManager.add remotePlayer
    
    @bind 'server:change:state', (m, state) =>
      @set state:state
    
    @bind 'server:change:current', (m, currentId) =>
      current = ModelsManager.get currentId
      @set current:current
    
    @bind 'server:change:open', (m, openAttributes) =>
      open = new Card openAttributes
      @set open:open
    
    @bind 'server:winner', (winnerId) =>
      winner = ModelsManager.get winnerId
      @trigger 'winner', winner

  createPlayer: ->
    throw new Error("Use createLocalPlayer of createRemotePlayer instead.")

  createLocalPlayer: (attributes, options) ->
    @_createPlayer ClientLocalPlayer, attributes, options

  createRemotePlayer: (attributes, options) ->
    @_createPlayer ClientRemotePlayer, attributes, options

  parse: (resp, xhr) ->
    resp.open = new Card resp.open
    players = _.map resp.players, (player) ->
      ModelsManager.create ClientRemotePlayer, player
    resp.players = new Players players
    resp
