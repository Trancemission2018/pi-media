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

app.use(bodyParser.json())
app.use(cors({credentials: true, origin: 'http://localhost:8082'}))
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


app.get('/downloads/search', (req, res) => {

  axios.get('https://pirateproxy.live/search/paddington/1/99/0').then(response => {


    let html = response.data.replace(/(\r\n\t|\n|\r\t|\r)/gm, "")

    let rows = html.match(/<tr>(.*?)<\/tr>/g)

    let allLinks = []
    let allTitles = []
    let allMagnets = []

    let results = []
    console.log('We have', rows.length)
    let done = 0
    rows.forEach(row => {
      if (done < 15) {

        let links = row.match(/<a.*?>(.*?)<\/a>/g)
        let titleA = links[2]
        let torrentA = links[3]

        let titleMatch = titleA.match(/>(.*?)</)
        let magnetMatch = torrentA.match(/(magnet:.*?)"/)

        console.log('The title is ', titleMatch[1])
        console.log('The link is ', magnetMatch[1])

        allTitles.push(titleMatch)
        allMagnets.push(magnetMatch)

        allLinks.push(links)

        results.push({
          name: titleMatch[1],
          link: magnetMatch[1]
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
