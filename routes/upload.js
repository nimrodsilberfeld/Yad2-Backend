const express = require('express')
const router = new express.Router()
const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../public/images")
    },
    filename: function (req, file, cb) {
        const parts = file.mimetype.split("/");
        cb(null, `${file.filename}-${Date.now()}.${parts[1]}`)
    }
})
const upload = multer({ storage })
router.post("/save-image", upload.single("imager"), (req, res) => {
    res.sendFile(`${__dirname}/public/images/${req.file.filename}`)
})