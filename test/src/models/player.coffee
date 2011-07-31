{Game, Card} = App.Models
{startCount} = App.Settings

describe "Player (model)", ->
  it "should receive cards", ->
    game = new Game
    player = game.createPlayer name:"Player"
    player.bind 'change:numberOfCards', (spy = jasmine.createSpy())
    expect(player.get 'numberOfCards').toBe startCount
    player.receiveCards([new Card color:'black', symbol:'wish'])
    expect(spy).toHaveBeenCalled()
    expect(player.get 'numberOfCards').toBe startCount + 1

  it "should draw cards", ->
    hasCard = (player, card) ->
      for card2 in player.get('hand').models
        return yes if card.get('color')  is card2.get('color') and
                      card.get('symbol') is card2.get('symbol')

    for i in [1..10]
      game = new Game
      tim  = game.createPlayer name:"Tim"  # me
      nina = game.createPlayer name:"Nina" # my sister
      tim.bind  'change:numberOfCards', (timSpy  = jasmine.createSpy())
      nina.bind 'change:numberOfCards', (ninaSpy = jasmine.createSpy())
      game.start()
      
      expect(tim.get 'numberOfCards').toBe startCount
      expect(game.get 'current').toBe tim
      tim.draw()
      expect(timSpy).toHaveBeenCalled()
      expect(tim.get 'numberOfCards').toBe(startCount + 1)
      expect(game.get 'current').toBe tim
      tim.next()
      expect(tim.get 'numberOfCards').toBe(startCount + 1)
      expect(game.get 'current').toBe nina
      for card in Card.deck()
        if not hasCard(nina, card) or not card.matches(game.get 'open')
          expect(-> nina.playCard card).toThrow()
      expect(ninaSpy).not.toHaveBeenCalled()
      for card in nina.get('hand').models
        if card.matches(game.get 'open')
          card.wish 'green' if card.get 'special'
          nina.playCard card
          expect(ninaSpy).toHaveBeenCalled()
          expect(nina.get 'numberOfCards').toBe(startCount - 1)
          expect(game.get 'current').toBe tim if card.get('symbol') isnt 'skip'
          break

  it "should know how to play uno", ->
    game    = new Game
    player1 = game.createPlayer name:"Player1"
    player2 = game.createPlayer name:"Player2"
    
    winner = null
    game.bind 'winner', (w) -> winner = w
    
    game.start()
    i = 0
    while i < 1000 and not winner
      game.get('current').playAI()
      i += 1
    
    expect(winner.get 'numberOfCards').toBe 0
    expect(winner is player1 or winner is player2).toBe yes

  it "should take forever for three computer players if they didn't know that they have to say 'eine'", ->
    game    = new Game
    player1 = game.createPlayer name:"Player1"
    player2 = game.createPlayer name:"Player2"
    player3 = game.createPlayer name:"Player3"
    
    player1.eine = player2.eine = player3.eine = ->
    
    winner = null
    game.bind 'winner', (w) -> winner = w
    
    game.start()
    i = 0
    while i < 1000 and not winner
      game.get('current').playAI()
      i += 1
    
    expect(winner).toBe null
