{Game, Card} = App.Models
{startCount} = App.Settings

describe "Player (model)", ->
  it "should receive cards", ->
    game = new Game
    player = game.createPlayer()
    expect(player.countCards()).toBe startCount
    player.receive(new Card 'black', 'wish')
    expect(player.countCards()).toBe startCount + 1

  it "should draw cards", ->
    hasCard = (player, card) ->
      doesShe = no
      player.hand.each (card2) ->
        doesShe = yes if card.get('color')  is card2.get('color') and
                         card.get('symbol') is card2.get('symbol')
      doesShe

    for i in [1..5]
      game = new Game
      tim  = game.createPlayer() # me
      nina = game.createPlayer() # my sister
      game.start()
      
      expect(tim.countCards()).toBe startCount
      expect(game.currentPlayer()).toBe tim
      tim.playCard null
      expect(tim.countCards()).toBe(startCount + 1)
      expect(game.currentPlayer()).toBe tim
      tim.playCard null
      expect(tim.countCards()).toBe(startCount + 1)
      expect(game.currentPlayer()).toBe nina
      #for card in Card.deck()
      #  if not hasCard(nina, card) or not card.matches game._open
      #    expect(-> nina.playCard card).toThrow()
      #for card in nina.hand.models
      #  if card.matches game._open
      #    nina.playCard card
      #    expect(nina.countCards()).toBe(startCount - 1)
      #    expect(game.currentPlayer()).toBe tim
      #    break
