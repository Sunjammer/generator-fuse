const Gulp = require('gulp')
const Babel = require('gulp-babel')

function printError(e)
{
  console.log(e.toString())
  this.emit('end')
}

function process(path) {
  Gulp.src(path)
  .pipe(Babel({
    presets: ['es2015']
  }))
  .on('error', printError)
  .pipe(Gulp.dest('lib'))
}

Gulp.task('watch', () => {
  Gulp.watch('src/**/*.js', (evt) => {
    process(evt.path)
  })
})

Gulp.task('build', () => {
  process('src/**/*.js')
})

Gulp.task('default', ['build', 'watch'])
