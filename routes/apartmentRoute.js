const express = require('express')
const Apartment = require('../models/apratmentModel')
const router = new express.Router()
const auth = require("../middleware/auth")
const multer = require("multer")
const multerS3 = require("multer-s3")
const aws = require("aws-sdk")

const key = "AKIAQBT7J7DV2PUSB5WQ"
const secret = "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"

const s3 = new aws.S3({
    credentials: {
        accessKeyId: key,
        secretAccessKey: secret
    }

})


const upload =
    multer({
        storage: multerS3({
            s3: s3,
            bucket: "apartments-yad2",
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req, file, cb) {
                console.log(req.query.user)
                let user = req.query.user
                //cb(null, Date.now().toString())
                cb(null, `${user}/${Date.now().toString()}`)
            },
            acl: "public-read"
        })
    })



//Upload images to S3 and retrieve the URL to the img
router.post("/save-image", upload.single("image"), (req, res) => {
    try {
        // console.log(req.file)
        res.status(201).json({ path: req.file.location })
    } catch (err) {
        console.log(e)
        res.status(500).send(e.message)
    }

})




//Create new Apartment
router.post("/apartment/new", async (req, res) => {
    const apartment = new Apartment(req.body)
    try {
        await apartment.save()
        res.status(201).send({ apartment })
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})


router.post("/filterApartment", async (req, res) => {
    //console.log("the page is ",req.query.page)
    let pageNumber = req.query.page
    const filters = req.body
    let location = filters.locationFilter + ""
    let fromRoom = filters.fromRoomFilter
    console.log("from room", fromRoom)
    let toRoom = filters.toRoomFilter
    let fromPrice = filters.priceFromFilter
    console.log("from price", fromPrice)
    let toPrice = filters.priceToFilter
    let featureOptions = filters.featureOptions
    let apartmentOptionExists = []
    if (filters.apartmentOptions) {
        filters.apartmentOptions.map((item) => {
            if (item.isChecked) { apartmentOptionExists.push(item.value) }
        })
    }
    if (filters.housesOptions) {
        filters.housesOptions.map((item) => {
            if (item.isChecked) { apartmentOptionExists.push(item.value) }
        })
    }
    if (filters.diffrentOptions) {
        filters.diffrentOptions.map((item) => {
            if (item.isChecked) { apartmentOptionExists.push(item.value) }
        })
    }
    console.log("location", filters.locationFilter)
    let preFilters = {
        "location.city": location,
        "propertyInfo.price": { $gt: fromPrice ? fromPrice : 0, $lt: toPrice ? toPrice : 100000000 },
        "propertyInfo.rooms": { $gt: fromRoom ? fromRoom - 1 : 0, $lt: toRoom ? parseInt(toRoom) + 1 : 12 },

        "propertyFeatures": featureOptions.length > 0 ? { $all: featureOptions } : null,
        "propertyType.subType": apartmentOptionExists.length > 0 ? { $in: apartmentOptionExists } : null
    }

    let filtersToPass = {}
    for (let key in preFilters) {
        if (preFilters[key]) {
            filtersToPass[key] = preFilters[key];
        }
    };
    console.log("after", filtersToPass)
    try {
        //const apartment = await Apartment.find(filters)
        const apartment = await Apartment.find(filtersToPass)
            .limit(5) // how many apartment to pull
            .sort({ _id: 1 })
            .skip(pageNumber > 0 ? ((pageNumber - 1) * 5) : 0)  // how many to skip,later base on page 

        res.send(apartment)
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})

router.post("/testParams", async (req, res) => {
    res.send(req.query.page)
})
module.exports = router
