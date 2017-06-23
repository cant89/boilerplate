gulp = require 'gulp'
coffee = require 'gulp-coffee'
svgToCss = require './index'


gulp.task 'build', ->
	gulp.src 'index.coffee'
	.pipe coffee bare: on
	.pipe gulp.dest '.'


gulp.task 'test', ['build'], ->
	gulp.src 'test/svg/**/*.svg'
	.pipe svgToCss
		name: 'svg-vars.styl'
		template: "svg-{{filename}} = '{{dataurl}}'"
	.pipe gulp.dest 'test/'


gulp.task 'watch', ->
	gulp.watch 'index.coffee', ['build']



gulp.task 'default', [
	'test',
	'watch'
]

