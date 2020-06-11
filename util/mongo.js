const mongoose = require('mongoose');
const MONGO_URL = ''

const connectMongo = () => {
    return mongoose.connect(MONGO_URL)
}
module.exports = connectMongo