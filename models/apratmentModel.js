const mongoose = require('mongoose')


const apartmentSchema = new mongoose.Schema({
    owner: {
        name: { type: String },
        phone: { type: String },
        plan: { type: Number }
    },
    type: { type: String },
    location: {
        city: { type: String },
        street: { type: String },
        number: { type: Number },
        neighborhood: { type: String }
    },
    propertyType: {
        type: { type: String },
        subType: { type: String }
    },
    propertyInfo: {
        rooms: { type: Number },
        floor: { type: Number },
        building_floor: { type: Number },
        price: { type: Number },
        size: { type: Number },
        state: { type: String },
        entryDate: { type: Number }, //  14/6/21
        parking: { type: Number }, //  0/1/2/3
        balcony: { type: Number }, //  0/1/2/3

    },
    propertyFeatures: [String],
    description: { type: String },
    images: [String]
}, {
    timestamps: true
})



const Apartment = mongoose.model('Apartment', apartmentSchema)
module.exports = Apartment
