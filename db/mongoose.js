const mongoose = require('mongoose')


mongoose.connect(process.env.REACT_APP_MONGO, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
