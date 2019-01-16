let mix = require('laravel-mix')
require('./cordova-submix')

mix.react('src/index.js', 'www').cordova()
