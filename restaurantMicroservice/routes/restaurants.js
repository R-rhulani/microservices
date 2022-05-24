const express = require('express')
const router = express()
const Restaurant = require('../models/Restaurant')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//Get all restaurants
router.get('/', async (req, res) => {  
    try{
        const restaurant = await Restaurant.find();res.json
        res.json(restaurant)
    } catch(err) {
        res.json({ message:err })
    }
})


//Add restaurant
router.post('/', async (req, res) => {
    const restaurant = new Restaurant({
        restaurantName: req.body.restaurantName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        tables: req.body.tables,
        email: req.body.email
    })
    try{
    const addedRestaurant = await restaurant.save()
        res.json(addedRestaurant)
    } catch(err) {
        res.json({ message: err })
    }
})

//Get restaurant
router.get('/:restaurantId', async (req, res) => {  
    try { 
       const restaurant = await Restaurant.findById(req.params.restaurantId)
       if(restaurant != null) {
        res.json(restaurant);
        } else {
            res.json({message: 'Restaurant not found'})
        }
    } catch (err) {
        res.json({ message: err })
    }
})


//delete restaurant
router.delete('/:restaurantId', async (req, res) => {  
    try { 
       const deletedRestaurant = await Restaurant.deleteOne({ _id: req.params.restaurantId })
       if(deletedRestaurant.deletedCount != 0) {
       res.json("Restaurant deleted successfully")
       } else {
           res.json({message: 'Restaurant not found'})
       }
    } catch (err) {
        res.json({ message: err })
    }
})

//Update restaurant
router.put('/:restaurantId', async (req, res) => {  
    try { 
       const updatedRestaurant = await Restaurant.updateOne({ _id: req.params.restaurantId },
         {$set:{
            restaurantName: req.body.restaurantName,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            tables: req.body.tables,
            email: req.body.email}
        })
        if(updatedRestaurant.modifiedCount != 0) {
            res.json({ message:'Details updated successfully'})
            } else {
                res.json({message: 'No changes registered for restaurant'})
            }
    } catch (err) {
        res.json({ message: err })
    }
})

//Update restaurant tables
    router.patch('/:restaurantId/tables/:tables', async (req, res) => {  
        try { 
            const updatedRestaurant = await Restaurant.updateOne({ _id: req.params.restaurantId },
              {$set:{
                 tables: req.params.tables}
             })
             if(updatedRestaurant.modifiedCount != 0) {
                res.json({ message:'Available tables updated successfully'})
                } else {
                    res.json({message: 'No changes to available tables were registered for restaurant'})
                }
         } catch (err) {
             res.json({ message: err })
         }
    })

    router.post('/sendEmail/:restaurantId', async (req, res) => {

        let email = ''
        try{
            const restaurant = await Restaurant.findById(req.params.restaurantId)
            email = restaurant.email
            console.log(email)

        const msg = {
          to: email,
          from: process.env.FROM_EMAIL,
          subject: 'Restaurant Table Booking Confirmation',
          text: 'A customer booked a table',
          html: '<strong>Your table has been booked</strong>',
        }
        sgMail
          .send(msg)
          .then(() => {
            res.json({message:'Email sent'})
          })
          .catch((error) => {
            console.error(error)
          })
    } catch(err) {
        res.json({ message:err })
    }
})

module.exports = router