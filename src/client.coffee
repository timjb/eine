{ClientGame}        = App.Models
{ClientLocalPlayer} = App.Models


game = localPlayer = null


# ModelsManager
# =============

window.ModelsManager =
  models: {}

  add: (model) -> @models[model.id] = model

  create: (Model, unparsedAttributes, options) ->
    parsedAttributes = Model.prototype.parse(unparsedAttributes, null)
    model = new Model parsedAttributes, options
    @add model
    model

  get: (id) -> @models[id]


# UI
# ==

getName = -> $('#name').val()

$('#new-game').click -> newGame getName()

$('#open-games li').live 'click', ->
  gameId = $(@).attr 'data-id'
  joinGame getName(), gameId

renderOpenGames = (games) ->
  el = $('#open-games')
    .html('')
    .css(display:'none')
  
  arrayToText = (arr) ->
    switch arr.length
      when 0 then ""
      when 1 then arr[0]
      else "#{arr.slice(0, arr.length - 1).join(", ")} and #{arr[arr.length - 1]}"
    
  for game in games
    $('<li />')
      .attr('data-id', game.id)
      .html(arrayToText game.players)
      .appendTo(el)
  
  el.css display:'block'

showGame = ->
  view = new App.Views.Game { model: game }, localPlayer
  $('#games').fadeOut()
  $(document.body).append(view.render().el)

displayError = (msg) ->
  if window.console and console.error
    console.error "Error sent from server: #{msg}"
  showMessage "Error: #{msg}"

showMessage = (msg) ->
  console.log "Message from server: #{msg}"
  el = $('<p class="message" />').text(msg).appendTo(document.body)
  #setTimeout (-> el.remove()), 5000


# Logic
# =====

socket.on 'open-games', renderOpenGames

socket.on 'error', displayError
socket.on 'msg', showMessage

createFakeGame = ->
  _call: (method, args...) ->
    socket.emit method, args...
  eine: -> @_call 'eine'
  start: -> @_call 'start'
  restart: -> @_call 'restart'
  playCard: (card) -> @_call 'playCard', card
  draw: -> @_call 'draw'
  next: -> @_call 'next'
  
  get: (attribute) -> game.get attribute
  bind: (args...) -> game.bind args...
  isRunning: -> game.isRunning()

socket.on 'create', (modelName, unparsedAttributes) ->
  if modelName is 'game'
    game = ModelsManager.create ClientGame, unparsedAttributes
  else if modelName is 'player'
    localPlayer = game.createLocalPlayer ClientLocalPlayer.prototype.parse(unparsedAttributes, null), { socket:socket }
    localPlayer.game = createFakeGame()
    ModelsManager.add localPlayer
    showGame()

socket.on 'trigger', (id, eventName, args...) ->
  model = ModelsManager.get id
  model.trigger "server:#{eventName}", args... if model

newGame = (name) -> socket.emit 'new-game', name

joinGame = (name, gameId) -> socket.emit 'join-game', name, gameId
