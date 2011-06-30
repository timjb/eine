{Game} = App.Models
PlayerV = App.Views.Player

describe "Player (view)", ->
  it "gives the current player the css class 'current' and the winner 'winner'", ->
    game = new Game
    p1   = game.createPlayer()
    p1V  = new PlayerV model:p1
    p2   = game.createPlayer()
    p2.eine = ->
    p2V  = new PlayerV model:p2
    winner = null
    game.bind 'winner', (w) -> winner = w
    expect($(p1V.el).hasClass 'current').toBe no
    expect($(p2V.el).hasClass 'current').toBe no
    game.start()
    expect($(p1V.el).hasClass 'current').toBe yes
    expect($(p2V.el).hasClass 'current').toBe no
    p1.playAI()
    expect($(p1V.el).hasClass 'current').toBe no
    expect($(p2V.el).hasClass 'current').toBe yes
    game.currentPlayer().playAI() until winner
    expect($(p1V.el).hasClass 'winner').toBe yes
    expect($(p2V.el).hasClass 'winner').toBe no
