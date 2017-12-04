const sse = require('connect-sse')
const express = require('express')
const crypto = require('crypto')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.set('view engine', 'ejs')

const clients = {}

app.get('/', (req, res) => {
  const token = crypto.randomBytes(12).toString('base64');
  res.redirect(token);
})

app.get('/:token', (req, res) => {
  res.render('index', {token: req.params.token})
})

app.post('/:token', (req, res) => {
  const client = clients[req.params.token]
  if (client) {
    console.log('passing on webhook', req.body)
    client.json(req.body)
    res.status(200)
  } else {
    res.status(404).end('No client listening for ' + req.params.token)
  }
  res.end()
})

app.get('/:token/events', sse(), (req, res) => {
  clients[req.params.token] = res
  console.log('connected', req.params.token)

  // TODO:
  // - delete from clients on disconnect
  // - allow multipl clients to connect to same token
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + listener.address().port)
})
