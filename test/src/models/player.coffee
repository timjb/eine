{Game, Card} = App.Models

describe "Player (model)", ->
  it "should receive cards", ->
    game = new Game
    player = game.createPlayer()
    expect(player._cards.length).toBe App.Settings.startCount
    player.receive(new Card 'black', 'wish')
    expect(player._cards.length).toBe App.Settings.startCount + 1
