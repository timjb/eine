class App.Models.ClientRemotePlayer extends App.Models.Player

  initialize: (attributes, options) ->
    super attributes, options
    
    @bind 'server:change:numberOfCards', (m, v) =>
      @set numberOfCards:v
