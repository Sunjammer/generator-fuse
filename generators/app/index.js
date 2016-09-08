'use strict'
const generators = require('yeoman-generator')
const Process = require('process')
const {spawn} = require('child_process')
const FS = require('fs')
const Path = require('path')

module.exports = generators.Base.extend({
  
  options : {},
  
  constructor: function() {
    generators.Base.apply(this, arguments)
    
    this.pathExists = function({path})
    {
      try {
        FS.statSync(path)
        return true
      } catch (e) {
        return false
      } 
    }
    
    this.tryMakeDir = function({path})
    {
      try {
        FS.mkdirSync(path)
        return true
      } catch (e) {
        console.error(e.message)
        return false
      } 
    }
    
    this.exitWithError = function({message})
    {
      console.error(message)
      console.error('Aborting')
      Process.exit(1)
    }
    
    this.createFuseApp = function({name, dest})
    {
      let done = this.async()
      this.spawnCommand('fuse', ['create', 'app', name, dest]).on('close', done)
    }
    
    this.scaffoldES2015 = function({dir})
    {
      this.log('ES2015 setup')
      this.fs.copyTpl(
        this.templatePath('ES2015/package.json'),
        this.destinationPath('package.json'),
        { name: this.options.name }
      )
      /*this.npmInstall(['babel-preset-es2015'], { 'saveDev': true })
      this.npmInstall(['gulp'], { 'saveDev': true })
      this.npmInstall(['gulp-babel'], { 'saveDev': true })*/
    }
    
    this.scaffoldTypeScript = function({dir})
    {
      this.log('TypeScript setup')
      this.spawnCommand('npm', ['init' , '--yes'])
      this.npmInstall(['gulp'], { 'saveDev': true })
    }
    
  },
  
  prompting: function() {
    return this.prompt([
      {
        typ : 'input',
        name : 'name',
        message : 'Your project name',
        default : this.appname
      }, 
      {
        type : 'list',
        name : 'js',
        message : 'JS source type',
        choices: ['ES5', 'Babel/ES2015', 'TypeScript'],
        default: 0,
        store : true
      }
    ]).then(function (answers) {
      this.options = answers
    }.bind(this))
  },
  
  createapp : function() {
    const cwd = Process.cwd()
    let opts = this.options
    let outDirPath = opts.outDirPath = cwd
    this.log(`Creating Fuse project in ${outDirPath}`)
    
    if(this.pathExists({path:outDirPath})) {
      if(FS.readdirSync(outDirPath).length > 0 )
        this.exitWithError({message:'Target directory exists and is not empty'})
    }
    
    this.createFuseApp({name:this.options.name, dest:outDirPath})
  },
  
  templating : function() {
    this.log('Template')
    const {name, outDirPath, js} = this.options
    
    switch(js) {
      case 'Babel/ES2015':
        this.log('ES2015 setup')
        this.fs.copyTpl(
          this.templatePath('Common/package.json'),
          this.destinationPath('package.json'),
          { name: name }
        )
        this.fs.copyTpl(
          this.templatePath('Common/.gitignore'),
          this.destinationPath('.gitignore')
        )
        this.fs.copyTpl(
          this.templatePath('Common/preview.sh'),
          this.destinationPath('preview.sh')
        )
        this.fs.copyTpl(
          this.templatePath('ES2015/.eslintrc.json'),
          this.destinationPath('.eslintrc.json')
        )
        this.fs.copyTpl(
          this.templatePath('ES2015/gulpfile.js'),
          this.destinationPath('gulpfile.js')
        )
        this.fs.copy(
          this.templatePath('ES2015/src/*'),
          this.destinationPath('src')
        )
        this.npmInstall(['nfuse'], { 'global': true })
        this.npmInstall(['gulp-cli'], { 'global': true })
        this.npmInstall(['babel-preset-es2015'], { 'saveDev': true })
        this.npmInstall(['gulp'], { 'saveDev': true })
        this.npmInstall(['gulp-babel'], { 'saveDev': true })
        break
      case 'TypeScript':
        this.log('TypeScript setup')
        this.fs.copyTpl(
          this.templatePath('Common/package.json'),
          this.destinationPath('package.json'),
          { name: name }
        )
        this.fs.copyTpl(
          this.templatePath('Common/.gitignore'),
          this.destinationPath('.gitignore')
        )
        this.fs.copyTpl(
          this.templatePath('Common/preview.sh'),
          this.destinationPath('preview.sh')
        )
        this.fs.copyTpl(
          this.templatePath('TypeScript/gulpfile.js'),
          this.destinationPath('gulpfile.js')
        )
        this.fs.copy(
          this.templatePath('TypeScript/src/*'),
          this.destinationPath('src')
        )
        this.npmInstall(['nfuse'], { 'global': true })
        this.npmInstall(['typescript'], { 'global': true, 'saveDev':true })
        break
      default:
        this.log('Abominable ES5 does not require scaffolding. "Enjoy!"')
    }
  },
  
  complete: function() {
    this.log('Writing template files...')
  }
  
  
})
