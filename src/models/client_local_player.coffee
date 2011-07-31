{Card} = App.Models
{Hand} = App.Collections

class App.Models.ClientLocalPlayer extends App.Models.Player

  initialize: (attributes, options) ->
    super attributes, options
    
    @bind 'server:change:current',  (m, v) => @set current:v
    @bind 'server:change:didDraw',  (m, v) => @set didDraw:v
    @bind 'server:change:saidEine', (m, v) => @set saidEine:v
    @bind 'server:change:hand',     (m, v) => @set hand:(new Hand(_.map v, (a) -> new Card a))
    
    @socket = options.socket
    @socket.on 'receiveCards', (cards) =>
      @receiveCards(_.map cards, (c) -> new Card c)

  eine: -> @game.eine()
