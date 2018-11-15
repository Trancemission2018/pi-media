const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
const app = express()
const port = process.env.PORT || 9001
const fs = require('fs')
const path = require('path')
const axios = require('axios')

const MPlayer = require('mplayer')
const player = new MPlayer()

var Transmission = require('transmission')
var transmission = new Transmission({
  port: 9091,			// DEFAULT : 9091
  //host: '192.168.1.34',			// DEAFULT : 127.0.0.1
  username: 'marcus',	// DEFAULT : BLANK
  password: 'password'	// DEFAULT : BLANK
})



app.use(bodyParser.json())
app.use(cors({credentials: true, origin: '*'}))
app.use(cors())
app.use(bodyParser.urlencoded({
  extended: false
}))

app.listen(port, function () {
  console.log("Server is running on port: " + port)
})

const rootDir = '/data/media'

app.get('/files', (req, res) => {

  let fullPath = rootDir

  if (req.query.folder !== undefined && req.query.folder !== '') {
    if (req.query.folder !== '/') {
      fullPath = req.query.folder
    }
  }

  console.log('Looking for', fullPath)

  fs.readdir(fullPath, ((err, currentFolder) => {
    if (err) {
      res.status(500).json({err})
      return
    }
    let folders = []
    let files = []

    currentFolder.forEach(file => {

      let thisFile = `${fullPath}/${file}`
      let pathInfo = path.parse(thisFile)
      let isDirectory = fs.statSync(thisFile).isDirectory()
      if (isDirectory) {
        folders.push({name: file, fullPath: thisFile, pathInfo})
      } else {

        switch (pathInfo.ext) {
          case '.mp4':
          case '.mp3':
          case '.mkv':
          case '.avi':
          case '.mpg':
            files.push({name: file})
            break
        }
      }
    })
    res.json({folders, files})
  }))
})


app.get('/play/:filePath', (req, res) => {
  let decodedPath = Buffer.from(req.params.filePath, 'base64').toString('ascii')
  player.openFile(decodedPath)
  res.json({playing: true})
})

app.get('/pause', (req, res) => {
  player.pause()
  res.json({playing: false})
})

app.get('/resume', (req, res) => {
  player.play()
  res.json({playing: true})
})


app.post('/downloads/search', (req, res) => {

  let query = req.body.query

  axios.get(`https://pirateproxy.live/search/${query}/1/99/0`).then(response => {

    let html = response.data.replace(/(\r\n\t|\n|\r\t|\r)/gm, "")

    let rows = html.match(/<tr>(.*?)<\/tr>/g)

    if (!rows) {
      res.json({totalResults :0})
      next()
    }


    let results = []
    let done = 0
    rows.forEach(row => {
      if (done < 15) {

        let links = row.match(/<a.*?>(.*?)<\/a>/g)
        let titleA = links[2]
        let torrentA = links[3]

        let name = titleA.match(/>(.*?)</)[1]
        let magnet = torrentA.match(/(magnet:.*?)"/)[1]

        let peersMatch = row.match(/<td align="right">(.*?)</g)
        let seeds = peersMatch[0].match(/>(.*?)</)[1]
        let leechers = peersMatch[1].match(/>(.*?)</)[1]

        let meta = row.match(/<font class="detDesc">(.*?), ULed/)[1]

        results.push({
          totalResults: 1,
          name,
          meta,
          seeds,
          leechers,
          magnet
        })
        done++
      }
    })

    res.json({results})
  })

})

app.get('/player', function(req, res) {
  const path = '/data/media/movies/Hot Fuzz (2007)/Hot.Fuzz.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1

    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

app.post('/downloads/download', (req, res) => {

  console.log('Start download', req.body)

  let magnetLink = req.body.magnet
  let downloadDir = req.body.folder

  transmission.addUrl(magnetLink, {
    "download-dir": downloadDir
  }, function (err, result) {
    if (err) {
      res.status(503).json(err)
      return
    }
    res.json({
      added: true, id: result.id
    })
  })
})

app.get('/downloads/session', (req, res) => {

  transmission.sessionStats(function (err, result) {
    if (err) {
      res.status(503).json(err)
      console.log(err)
    } else {
      res.json(result)
    }
  })
})

app.get('/downloads/status', (req, res) => {

  transmission.active(function (err, result) {
    if (err) {
      res.status(503).json(err)
      console.log(err)
    }
    else {
      res.json(result)
    }
  })
})

app.get('/downloads/active', (req, res) => {
  transmission.active(function (err, result) {
    if (err) {
      res.status(503).json(err)
      console.log(err)
    }
    else {
      res.json(result)
    }
  })
})

app.post('/downloads/torrent', (req, res) => {
  let id = req.body.id
  transmission.get(id, function (err, result) {
    if (err) {
      res.status(503).json(err)
      console.log(err)
    }
    else {
      res.json(result)
    }
  })
})

app.post('/downloads/youtube/title', (req, res) => {

  let url = req.body.url

  const {execFile} = require('child_process')
  const child = execFile('youtube-dl', [url, '-e'], (error, stdout, stderr) => {
    if (error) {
      res.status(503).json({error})
      console.log(error)
    }else{
      res.json({title: stdout})
    }
  })
})

app.post('/downloads/youtube', (req, res) => {

  let url = req.body.url
  let folder = req.body.folder

  const {execFile} = require('child_process')
  const child = execFile('youtube-dl', [url, '-o', `${folder}/%(title)s.%(ext)s`], (error, stdout, stderr) => {
    if (error) {
      console.log(error)
    }
  })
  res.json({downloading: true})
})

app.post('/folder/create', (req, res) => {
  let dir = req.body.folder
  if (!dir.match(/\/data\/media/)) {
    let newDir = dir.replace(/\/\//g, '/data/media/')
    console.log('Creating folder, need to add root', newDir)
    dir = newDir
  }
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    res.json({created: true})
  }else{
    res.status(403).json({created: false, error: 'folder exists'})
  }
})

