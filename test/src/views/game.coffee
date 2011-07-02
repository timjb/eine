$ = jQuery

GameM = App.Models.Game
GameV = App.Views.Game

describe "Game (view)", ->
  it "displays the open card and a closed stack", ->
    game = new GameM
    p1 = game.createPlayer()
    p2 = game.createPlayer()
    game.start()
    view = new GameV model:game
    el = view.render().el
    expect($('.card.closed', el).length).toBe 1
    expect($('.card.open', el).html()).toMatch(game.get('open').get('symbol'))

  it "let's the player draw a card if he clicks on the closed stack", ->
    game = new GameM
    p1 = game.createPlayer 'human'
    p2 = game.createPlayer 'computer'
    game.start()
    view = new GameV model:game
    $('.card.closed', view.render().el).click().click()
    expect(p1.countCards()).toBe(App.Settings.startCount + 1)
    expect(game.currentPlayer()).toBe(p2)

  describe "it displays the players", ->
    game = view = el = human = null
    beforeEach ->
      game = new GameM
      view = new GameV model:game
      el = view.render().el
      human = game.createPlayer 'human'

    # the human player is always displayed at the bottom of the page
    # 2 players => bottom, top
    it "2 players", ->
      c1 = game.createPlayer 'computer'
      game.start()
      playerEls = $('.player', el)
      expect(playerEls.eq 0).toHaveClass 'bottom'
      expect(playerEls.eq 1).toHaveClass 'top'

    # 3 players => bottom, left, right
    it "3 players", ->
      c1 = game.createPlayer 'computer'
      c2 = game.createPlayer 'computer'
      game.start()
      playerEls = $('.player', el)
      expect(playerEls.eq 0).toHaveClass 'bottom'
      expect(playerEls.eq 1).toHaveClass 'left'
      expect(playerEls.eq 2).toHaveClass 'right'

    # 4 players => bottom, left, top, right
    it "4 players", ->
      c1 = game.createPlayer 'computer'
      c2 = game.createPlayer 'computer'
      c3 = game.createPlayer 'computer'
      game.start()
      playerEls = $('.player', el)
      expect(playerEls.eq 0).toHaveClass 'bottom'
      expect(playerEls.eq 1).toHaveClass 'left'
      expect(playerEls.eq 2).toHaveClass 'top'
      expect(playerEls.eq 3).toHaveClass 'right'
