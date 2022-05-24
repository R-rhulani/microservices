const mongoose = require('mongoose')

const RestaurantSchema = mongoose.Schema({
    restaurantName: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    tables: {
        type: String
    },
    email: {
        type: String
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    address: {
        type: String
    },
})

module.exports = mongoose.model('Restaurant', RestaurantSchema, 'restaurants')