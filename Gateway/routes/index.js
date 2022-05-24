const express = require('express')
const router = express.Router()
const axios = require('axios')
const registry = require('./registry.json')
const fs = require('fs')   //filesystem module

router.use(express.json())

router.all('/:apiName/:path', (req, res) => {
    console.log(req.query)
    if(registry.services[req.params.apiName]) {
        if(req.query.id){
    axios({
        method: req.method,
        url: registry.services[req.params.apiName].url + req.params.path + '/' + req.query.id,
        headers: { "Content-Type": "application/json" },
        data: req.body
    })
    .then((response) => {
        res.send(response.data)
    })
        } else {
    axios({
        method: req.method,
        url: registry.services[req.params.apiName].url + req.params.path,
        data: req.body,
        headers: { "Content-Type": "application/json" }
    })
    .then((response) => {
        res.send(response.data)
    })
}
}
else {
    res.send('API ' + req.params.apiName + ' does not exist :(')
}
})

router.post('/register', (req, res) => {
    const registrationInfo = req.body
    registry.services[registrationInfo.apiName] = { ...registrationInfo }

    fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
        if (error) {
            res.send('Unable to register ' + registrationInfo.apiName + '\n' + error) 
        } else {
            res.send(registrationInfo.apiName + ' successfully registered')
        }
    })
})
module.exports = router