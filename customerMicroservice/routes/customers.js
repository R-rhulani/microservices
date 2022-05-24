const express = require('express')
const router = express()
const Customer = require('../models/Customers')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

express.json()

//Get all customers
router.get('/', async (req, res) => {  
    try{
        const customers = await Customer.find();res.json
        res.json(customers)
    } catch(err) {
        res.json({ message:err })
    }
})

//Add customer
router.post('/', async (req, res) => {
    console.log(req.body)
    const customer = new Customer({
        name: req.body.name,
        customerId: req.body.customerId,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email
    })
    try{
    const addedCustomer = await customer.save()
        res.json(addedCustomer)
    } catch(err) {
        res.json({ message: err })
    }
})

//Get Customer
router.get('/:customerId', async (req, res) => {  
    try { 
       const customer = await Customer.findById(req.params.customerId)
       if(customer != null) {
        res.json(customer);
        } else {
            res.json({message: 'Customer not found'})
        }
    } catch (err) {
        res.json({ message: err })
    }
})


//delete customer
router.delete('/:customerId', async (req, res) => {  
    try { 
       const deletedCustomer = await Customer.deleteOne({ _id: req.params.customerId })
       if(deletedCustomer.deletedCount != 0) {
        res.json({message:'Customer deleted successfully'})
        } else {
            res.json({message: 'Customer not found'})
        }
    } catch (err) {
        res.json({ message: err })
    }
})

//Update customer
router.put('/:customerId', async (req, res) => {  
    try { 
       const updatedCustomer = await Customer.updateOne({ _id: req.params.customerId },
         {$set:{
            name: req.body.name,
            customerId: req.body.customerId,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email}
        })

        if(updatedCustomer.modifiedCount != 0) {
            res.json({ message:'Details updated successfully'})
            } else {
                res.json({message: 'No changes registered for customer'})
            }
       res.json()
    } catch (err) {
        res.json({ message: err })
    }
})

router.post('/sendEmail/:customerId', async (req, res) => {

    let email = ''
    try{
        const customer = await Customer.findById(req.params.customerId)
        email = customer.email
        console.log(email)

    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Customer Booking Confirmation',
      text: 'This is to confirm your table reservation',
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