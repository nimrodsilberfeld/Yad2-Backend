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

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "apartments-yad2",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        },
        acl: "public-read"
    })
})

module.exports = upload