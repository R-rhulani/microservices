const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('dotenv/config')
const restaurantsRoute = require('./routes/restaurants')
const bodyParser = require('body-parser')


//middleware for customers routes
app.use(bodyParser.json())
app.use('/restaurants', restaurantsRoute)


//root get
app.get('/', (req, res) => {
    res.send('Restaurant microservice is running')
})

//DB connection
mongoose.connect(process.env.DB_CONNECTION, ()=>console.log('connected to db'))


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`)) 