'use strict'
const generators = require('yeoman-generator')
const Process = require('process')
const FS = require('fs')
const Path = require('path')

function pathExists({path})
{
  try {
    FS.statSync(path)
    return true
  } catch (e) {
    return false
  } 
}

function tryMakeDir({path})
{
  try {
    FS.mkdirSync(path)
    return true
  } catch (e) {
    console.error(e.message)
    return false
  } 
}

function exitWithError({message})
{
  console.error(message)
  console.error('Aborting')
  Process.exit(1)
}

module.exports = generators.Base.extend({
  
  options : {},
  
  constructor: function() {
    generators.Base.apply(this, arguments)
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
  
  method1 : function() {
    /*
      Evaluate and if necessary create target directory
    */
    const cwd = Process.cwd()
    let opts = this.options
    let outDirPath = opts.name == this.appname ? cwd : Path.join(cwd, opts.name)
    console.log(`Creating Fuse project in ${outDirPath}`)
    
    if(pathExists({path:outDirPath})) {
      if(FS.readdirSync(outDirPath).length > 0 )
        exitWithError({message:'Target directory exists and is not empty'})
    }else{
      if(!tryMakeDir({path:outDirPath}))
        exitWithError({message:'Target directory could not be created'})
    }
    opts.outDirPath = outDirPath
  },
  
  method2 : function() {
    /*
      Determine files to include
    */
    let opts = this.options
    console.dir(opts)
    console.log('All done')
  }
})
