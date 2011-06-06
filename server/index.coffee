path    = require 'path'

express = require 'express'
now     = require 'now'

app = express.createServer()


# Setup
# =====

mainDir = path.join __dirname, '..'

app.configure ->
  app.use express.static "#{mainDir}/public"
  app.use express.compiler
    src:    "#{mainDir}/lib"
    dest:   "#{mainDir}/src"
    enable: ['coffeescript']
  app.use express.static "#{mainDir}/lib"
  app.use express.static mainDir


# Now.js
# ======

everyone = now.initialize app

#everyone.now.example = (callback) ->
#  setTimeout (-> callback 42), 1000


# Go!
# ===

app.listen(8000)
console.log "Server is running on port 8000."
