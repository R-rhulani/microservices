const mongoose = require('mongoose')

const CustomerSchema = mongoose.Schema({
    name: {
        type: String
    },
    customerId: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Customers', CustomerSchema, 'customers')