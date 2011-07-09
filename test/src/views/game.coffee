$ = jQuery

GameM = App.Models.Game
GameV = App.Views.Game

describe "Game (view)", ->
  it "displays the open card and a closed stack", ->
    game = new GameM
    p1 = game.createPlayer name:"P1"
    p2 = game.createPlayer name:"P2"
    game.start()
    view = new GameV model:game, p1
    el = view.render().el
    expect($('.card.closed', el).length).toBe 1
    expect($('.card.open', el).html()).toMatch(game.get('open').get('symbol'))

  it "let's the player draw a card if he clicks on the closed stack", ->
    game = new GameM
    p1   = game.createPlayer name:"Mensch"
    p2   = game.createPlayer name:"Maschine"
    view = new GameV model:game, p1
    game.start()
    closedCard = $('.card.closed', view.render().el)
    closedCard.click()
    expect(p1.countCards()).toBe(App.Settings.startCount + 1)
    expect(game.currentPlayer()).toBe(p1)
    closedCard.click()
    expect(game.currentPlayer()).toBe(p2)

  describe "it displays the players", ->
    game = view = el = human = null
    beforeEach ->
      game  = new GameM
      human = game.createPlayer name:"Ali"
      view  = new GameV model:game, human
      el    = view.render().el

    # the human player is always displayed at the bottom of the page
    # 2 players => bottom, top
    it "2 players", ->
      c1 = game.createPlayer name:"EinePlayer2000"
      game.start()
      playerEls = $('.player', el)
      expect(playerEls.eq 0).toHaveClass 'bottom'
      expect(playerEls.eq 1).toHaveClass 'top'

    # 3 players => bottom, left, right
    it "3 players", ->
      c1 = game.createPlayer name:"EinePlayer2000"
      c2 = game.createPlayer name:"Plague"
      game.start()
      playerEls = $('.player', el)
      expect(playerEls.eq 0).toHaveClass 'bottom'
      expect(playerEls.eq 1).toHaveClass 'left'
      expect(playerEls.eq 2).toHaveClass 'right'

    # 4 players => bottom, left, top, right
    it "4 players", ->
      c1 = game.createPlayer name:"EinePlayer2000"
      c2 = game.createPlayer name:"Plague"
      c3 = game.createPlayer name:"LISP"
      game.start()
      playerEls = $('.player', el)
      expect(playerEls.eq 0).toHaveClass 'bottom'
      expect(playerEls.eq 1).toHaveClass 'left'
      expect(playerEls.eq 2).toHaveClass 'top'
      expect(playerEls.eq 3).toHaveClass 'right'
