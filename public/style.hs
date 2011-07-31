{-# LANGUAGE OverloadedStrings #-}

-- You need to `cabal install css`

import Language.CSS hiding (borderRadius, boxShadow, textShadow)
import Data.Text.Lazy (Text,append,intercalate,pack)
import qualified Data.Text.Lazy.IO as LIO
import System (getArgs)

main = do
  [path] <- getArgs
  LIO.writeFile path style

style = renderCSS $ runCSS $ do
  reset
  layout
  cards
  game
  players
  hand
  drawOrNextButton
  eineButton
  games
  message


-- Rules
-- =====

reset = rule "*" $ margin "0" >> padding "0"

layout = do
  rule "html, body, .game" $ do
    width "100%" >> height "100%"
    overflow "hidden"
  rule "body" $ do
    font "16px Ubuntu, Helvetica, sans-serif"
    background "#0d3502 url(\"background.png\")"
    color white

cardRule = rule . (".card" `append`)

bigCard = do
  width "100px" >> height "150px"
  borderWidth "10px"
  fontSize "67px" >> lineHeight "150px"

smallCard = do
  width "60px" >> height "90px"
  borderWidth "6px"
  fontSize "40px" >> lineHeight "90px"

cards = do
  cardRule "" $ do
    borderStyle "solid" >> borderColor white >> borderRadius "10px"
    boxShadow "2px 2px 10px #0a2d00"
    background white
    position "relative"
    cursor "pointer"
    rule "span" $ do
      absolute "0" "0" "0" "0"
      textAlign "center"
      pointerEvents "none"
      zIndex "42"
  
  let colorCard colorStr = borderColor colorStr >> color colorStr
  cardRule ".yellow" $ colorCard yellow
  cardRule ".green"  $ colorCard green
  cardRule ".blue"   $ colorCard blue
  cardRule ".red"    $ colorCard red
  cardRule ".closed" $ colorCard "#888" >> background black
  cardRule ".closed:hover" $ colorCard "#aaa"
  
  rule ".card.special" $ color white
  
  rule ".card.black .color" $ outlineOffset "-5px"
  rule ".card.black .color:hover"  $ outline "5px solid rgba(0,0,0,0.25)"
  rule ".card .red"    $ absolute "0%" "50%" "50%" "0%" >> background red
  rule ".card .green"  $ absolute "0%" "0%" "50%" "50%" >> background green
  rule ".card .blue"   $ absolute "50%" "50%" "0%" "0%" >> background blue
  rule ".card .yellow" $ absolute "50%" "0%" "0%" "50%" >> background yellow
  
  rule ".card.open" $ cursor "default"

game = do
  rule ".win-message" $ do
    position "absolute" >> top "80px" >> left "0" >> right "0"
    fontSize "64px"
    textAlign "center"
  rule ".open, .closed" $ do
    bigCard
    position "absolute" >> left "50%" >> top "50%"
    marginTop "-85px"
  rule ".open"   $ marginLeft "-130px"
  rule ".closed" $ marginLeft "10px"

players = do
  rule ".player" $ do
    minWidth   "150px"
    textAlign  "center"
    position   "absolute"
    fontSize   "18px" >> lineHeight "30px"
    padding    "0 10px"
    background "#375b2d"
    transition "background 0.3s linear"
    rule ".number-of-cards" $ do
      fontWeight "bold"
      color "#ff9"
      marginLeft "5px"
  rule ".player.winner .number-of-cards" $ color black
  rule ".player.current" $ background "#609352"
  rule ".player.winner"  $ background white >> color black
  rule ".player.left, .player.right" $ top "50%"
  rule ".player.left"   $ left "0" >> transform "rotate(90deg) translate(-15px, 70px)" >> margin "0 0 -70px"
  rule ".player.right"  $ right "0" >> transform "rotate(-90deg) translate(15px,  70px)" >> margin "0 0 -70px"
  rule ".player.top"    $ left "50%" >> top "0" >> marginLeft "-85px"
  rule ".player.bottom" $ do
    bottom "0" >> left "50px" >> right "50px"
    padding "15px"
    height "100px" >> lineHeight "100px"
    textAlign "right"

hand :: CSS Rule
hand = rule ".hand" $ do
  listStyle "none"
  rule "li" (float "left")
  rule "li .card" (smallCard >> margin "0 2px" >> transform "rotate(2deg)" >> transition "all 0.3s ease")
  rule "li:nth-child(2n) .card" (transform "rotate(-4deg)")
  rule "li:nth-child(3n) .card" (transform "rotate(12deg)")
  rule "li .card:hover" (transform "rotate(0) translate(0, -10px)")
  rules ["li.fade-out .card", "li.fade-in .card"] $ do
    margin "0 -36px"
    transform "translate(0, 150px)"
  rule ".card:not(.matching)" $ do
    transform "translate(0, 50px) !important"
    cursor "default"

drawOrNextButton = do
  rule ".draw-or-next-button" $ do
    fontSize "18px"
    margin "0 30px 0 0"
    color "inherit"
    textDecoration "none"
  rule ".draw-or-next-button:hover" $ do
    fontWeight "bold"

-- http://css3button.net/5232
eineButton = do
  let purple = "#570071"
  let lightGrey = "#bbb"
  rule ".eine-button" $ do
    --position "absolute" >> top "30px" >> right "30px"
    color purple >> fontSize "32px" >> textDecoration "none"
    padding "20px" >> margin "0 15px"
    border ("3px solid " `append` purple) >> borderRadius "10px"
    boxShadow "0px 1px 3px rgba(000,000,000,0.5), inset 0px 0px 3px rgba(255,255,255,1)"
    verticalGradient white [(0.5,white)] lightGrey
  rule ".eine-button:hover" $ do
    verticalGradient lightGrey [(0.5,white)] white
  rule ".eine-button:active" $ do
    verticalGradient "#000" [(0.5,"#333")] "#333"
    color white
    textShadow "none"
  rules [".eine-button:active", ".eine-button:focus"] $ outline "none"
  rule ".eine-button.active" $ do
    color white
    borderColor white
    background purple

games = do
  rule "#games" $ do
    background "#042600"
    width "400px" >> minHeight "400px"
    margin "64px auto" >> padding "32px"
    boxShadow "inset 0 0 16px #020"
    lineHeight "32px"
  rule "input" $ marginLeft "5px"
  rule "h1" $ do
    textAlign "center"
    fontSize "48px"
    margin "0 0 26px"
  rule "p" $ margin "2px"
  rule "#name" $ do
    padding "2px"
  rule "ul#open-games" $ do
    minHeight "300px"
    listStyle "none"
    rule "li" $ do
      borderTop "1px solid #fff"
      padding "2px 8px"
    rule "li:hover" $ do
      cursor "pointer"
      background "rgba(255,255,255,0.25)"
  rule "#new-game" $ do
    padding "4px"

message = rule ".message" $ do
  position "absolute" >> bottom "150px" >> left "0" >> right "0"
  textAlign "center"
  fontSize "14px"


-- Colors
-- ======

white  = "#fff"
black  = "#000"

yellow = "#ffa200"
green  = "#089720"
blue   = "#0747ff"
red    = "#d50b00"


-- Helpers
-- =======

absolute t r b l = position "absolute" >> top t >> right r >> bottom b >> left l

vendor name value = do
  prop ("-moz-" `append` name) value
  prop ("-webkit-" `append` name) value
  prop name value


-- Properties
-- ==========

-- CSS3
-- ----

borderRadius  = vendor "border-radius"
transform     = vendor "transform"
transition    = vendor "transition"
boxShadow     = vendor "box-shadow"
textShadow    = vendor "text-shadow"
pointerEvents = prop "pointer-events"
outlineOffset = prop "outline-offset"

verticalGradient :: Text -> [(Float, Text)] -> Text -> CSS (Either Property Rule)
verticalGradient top stops bottom = do
  let (++) = append
  let stopToGecko (percentage, color) = color ++ " " ++ (pack $ show (percentage*100)) ++ "%"
  let stopsToGecko = intercalate "," . map stopToGecko
  background $ "-moz-linear-gradient(top, " ++ top ++ " 0%, " ++ stopsToGecko stops ++ "," ++ bottom ++ ")"
  let stopToWebkit (percentage, color) = "color-stop(" ++ (pack $ show percentage) ++ ", " ++ color ++ ")"
  let stopsToWebkit = intercalate "," . map stopToWebkit
  background $ "-webkit-gradient(linear, left top, left bottom, from(" ++ top ++ "), " ++ stopsToWebkit stops ++ ", to(" ++ bottom ++ "))"
