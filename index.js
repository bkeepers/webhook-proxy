const sse = require('connect-sse')
const express = require('express')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const EventEmitter = require('events')

const app = express()
app.use(bodyParser.json())
app.set('view engine', 'ejs')

const events = new EventEmitter()

app.get('/', (req, res) => {
  const channel = crypto.randomBytes(12).toString('base64')
  res.redirect(channel)
})

app.get('/:channel',
  // Render HTML page if client accepts HTML
  (req, res, next) => {
    if (req.accepts('html')) {
      const url = `${req.protocol}://${req.get('host')}/${req.params.channel}`
      res.render('index', { url })
    } else {
      next()
    }
  },

  // Otherwise setup SSE
  sse(),

  // Dispatch events for this channel
  (req, res) => {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*')

    const channel = req.params.channel

    // Listen for events on this channel
    events.on(channel, res.json)

    res.on('close', () => {
      events.removeListener(channel, res.json)
      console.log('Client disconnected', channel, events.listenerCount(channel))
    })

    console.log('Client connected', channel, events.listenerCount(channel))
  }
)

app.post('/:channel', (req, res) => {
  events.emit(req.params.channel, {
    ...req.headers,
    body: req.body
  })
  res.status(200).end()
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + listener.address().port)
})
