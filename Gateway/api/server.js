const express = require('express')
const app = express()
const PORT = 3001

app.use(express.json())

app.get('/api', (req, res, next) => {
    res.send('hello from api')
})

app.post('/lalaAPI', (req, res, next) => {
    res.send('hello from Lala api endpoint')
})

app.listen(PORT, () => {
    console.log('API running on port ' + PORT)
})