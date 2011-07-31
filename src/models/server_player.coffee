{Player} = require './player'
{Card}   = require './card'

class exports.ServerPlayer extends Player

  initialize: (attributes, options) ->
    super attributes, options
    
    {@socket} = options
    
    handleErrors = (fn) =>
      try
        fn()
      catch exc
        console.log "Error: #{exc.message}"
        @socket.emit 'error', exc.message
    
    @socket.on 'eine',    => handleErrors => @eine()
    @socket.on 'start',   => handleErrors => @start()
    @socket.on 'restart', => handleErrors => @restart()
    @socket.on 'draw',    => handleErrors => @draw()
    @socket.on 'next',    => handleErrors => @next()
    @socket.on 'playCard', (card) => handleErrors => @playCard (new Card card)
    
    @socket.on 'disconnect', =>
      @disconnected = yes
      @trigger 'disconnect'
      @bind 'change:current', (m, isCurrent) =>
        setTimeout @playAI, 1500 if isCurrent
      @_emitToOthers 'msg', "Player #{@escape 'name'} has disconnected and was replaced by the AI."
    
    @bind 'change:hand', (m, hand) ->
      @socket.emit 'trigger', @id, 'change:hand', null, hand
    
    @bind 'change:numberOfCards', (m, noc) =>
      @_emitToOthers 'trigger', @id, 'change:numberOfCards', null, noc
    
    @bind 'change:didDraw', (m, didShe) =>
      @socket.emit 'trigger', @id, 'change:didDraw', null, didShe
    
    @bind 'change:saidEine', (m, didHe) =>
      @socket.emit 'trigger', @id, 'change:saidEine', null, didHe

  receiveCards: (cards) ->
    super cards
    @socket.emit 'receiveCards', cards

  _emitToOthers: (args...) ->
    @game._emitToAllExcept this, args...
