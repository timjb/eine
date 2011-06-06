{spawn} = require 'child_process'

connectStd = (childProcess) ->
  childProcess.stdout.pipe process.stdout
  childProcess.stderr.pipe process.stderr

task 'build', "Compile CoffeeScript", ->
  connectStd(spawn 'coffee', ['--compile', '--output', 'lib', 'src'])
  connectStd(spawn 'coffee', ['--compile', '--output', 'test/lib', 'test/src'])

task 'serve', "Start the node server", ->
  connectStd(spawn 'coffee', ['server/index.coffee'])
