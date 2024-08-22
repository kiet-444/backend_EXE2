const mongoose = require('mongoose')
async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Connect successfully')
    } catch (error) {
        console.error('Connect failure')
    }
}

module.exports = { connect }
