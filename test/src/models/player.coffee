{Game, Card} = App.Models

describe "Player (model)", ->
  it "should receive cards", ->
    game = new Game
    player = game.createPlayer()
    expect(player.countCards()).toBe App.Settings.startCount
    player.receive(new Card 'black', 'wish')
    expect(player.countCards()).toBe App.Settings.startCount + 1
