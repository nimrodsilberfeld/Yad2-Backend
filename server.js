require('dotenv').config();
const express = require('express')
require('./db/mongoose')
const cors = require('cors')
const userRouter = require("./routes/userRoute")
const apartmentRouter = require("./routes/apartmentRoute")
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())

app.use(cors())
app.use(userRouter)
app.use(apartmentRouter)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})