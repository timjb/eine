{Player, Card} = App.Models

class App.Models.Game extends Backbone.Model
  initialize: ->
    @players = []
    @bind 'next', => @_didDraw = no

  createPlayer: ->
    player = new Player @
    @players.push player
    @_give player, App.Settings.startCount
    player
  
  _give: (player, n) ->
    player.receive Card.random() for i in [1..n]

  start: ->
    @set current:0
    @set clockwise:yes
    @set open:Card.random()
    
    @trigger 'next', @currentPlayer()

  currentPlayer: -> @players[@get 'current'] or null

  eine: -> @saidEine = yes

  putDown: (card) ->
    if @lastPlayer?.countCards() is 1 and not @saidEine
      @_give @lastPlayer, App.Settings.einePenalty
    
    unless card or @_didDraw
      @_give @currentPlayer(), 1
      @_didDraw = yes
      return
    
    if card
      throw new Error "invalid move" unless card.matches(@get 'open')
      throw new Error "no color chosen" if card.get('color') is Card.specialColor
      
      @currentPlayer().hand.remove card
      @set open:card
      
      isSkip    = card.get('symbol') is 'skip'
      isReverse = card.get('symbol') is 'reverse'
      @set(clockwise: not @get 'clockwise') if isReverse
    
    if @currentPlayer().countCards() is 0
      @trigger 'winner', @currentPlayer()
    else
      @lastPlayer = @currentPlayer()
      @saidEine = no
      currentOffset = (if @get 'clockwise' then 1 else -1) * (if isSkip then 2 else 1)
      @set current:((@get('current') + currentOffset + @players.length) % @players.length)
      
      if card
        for n in [2,4]
          @_give @currentPlayer(), n if card.get('symbol') is "+#{n}"
      
      @trigger 'next', @currentPlayer()
