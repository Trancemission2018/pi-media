const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
const app = express()
const port = process.env.PORT || 9001
const fs = require('fs')
const path = require('path')

app.use(bodyParser.json())
app.use(cors({credentials: true, origin: 'http://localhost:8082'}))
app.use(cors())
app.use(bodyParser.urlencoded({
  extended: false
}))

// var Users = require('./routes/Users');

// app.use('/users',Users);

app.listen(port, function () {
  console.log("Server is running on port: " + port)
})


app.get('/files', (req, res) => {

  let rootDir = '/data/media'
  if (req.query.folder !== undefined && req.query.folder !== '') {
    rootDir = req.query.folder
  }


  fs.readdir(rootDir, ((err, currentFolder) => {
    if (err) {
      res.status(500).json({err})
      return
    }
    let folders = []
    let files = []
    let parent = ''

    currentFolder.forEach(file => {

      let thisFile = `${rootDir}/${file}`
      let pathInfo = path.parse(thisFile)
      var isDirectory = fs.statSync(thisFile).isDirectory()
      parent = {name: 'Up', fullPath: getParent(rootDir)}
      if (isDirectory) {
        folders.push({name: file, fullPath: thisFile, pathInfo})
      } else {
        files.push({name: file})
      }
    })
    res.json({parent, folders, files})
  }))


})

function getParent(fullPath)
{
  var the_arr = fullPath.split('/');
  the_arr.pop();
  return( the_arr.join('/') );
}

