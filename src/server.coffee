# Imports
# =======

# Stdlib
path     = require 'path'

# Packages
express  = require 'express'
socketIO = require 'socket.io'
_        = require 'underscore'

# Project
{Card}       = require './models/card'
{Player}     = require './models/player'
{ServerGame} = require './models/server_game'


# Express
# =======

mainDir = path.join __dirname, '..'

app = express.createServer()

app.configure ->
  app.use express.static "#{mainDir}/public"
  app.use express.static "#{mainDir}/lib"
  app.use express.static mainDir


# Socket.IO
# =========

io = socketIO.listen(app)

# Games management
# ----------------

games = {}

createGame = ->
  id = _.uniqueId 'game'
  game = new ServerGame id:id
  games[id] = game
  game.bind 'garbage', ->
    delete games[id]
  game

getGame = (id) ->
  games[id]

openGamesInfo = ->
  _(games)
    .filter (game) ->
      not game.isRunning()
    .map (game) ->
      id: game.get 'id'
      players: game.get('players').map (player) -> player.escape 'name'

broadcastGames = ->
  io.sockets.emit 'open-games', openGamesInfo()


# Logic
# -----

io.sockets.on 'connection', (socket) ->
  
  socket.emit 'open-games', openGamesInfo()
  
  join = (game, name) ->
    throw new Error "You must choose a name." unless name
    id = _.uniqueId 'player'
    player = game.createPlayer { name:name, id:id }, { socket: socket }
    socket.emit 'create', 'player', player
    if game.get('players').length is 4
      game.start()
  
  sendGame = (game) -> socket.emit 'create', 'game', game
  
  handleErrors = (fn) ->
    try
      fn()
    catch exc
      console.log "Error: #{exc.message}"
      socket.emit 'error', exc.message
  
  socket.on 'new-game', (name) -> handleErrors ->
    game = createGame()
    sendGame game
    join game, name
    broadcastGames()
  
  socket.on 'join-game', (name, id) -> handleErrors ->
    game = getGame(id)
    throw new Error "There's no game with this id." unless game
    throw new Error "You can't join a running game." if game.isRunning()
    sendGame game
    join game, name
    broadcastGames()


# Go!
# ===

# Make sure that the process doesn't shut down if an error occurs.
process.on 'uncaughtException', (error) ->
  console.log error

app.listen(8000)
console.log "Server is running on port 8000."
