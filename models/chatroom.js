const mongoose = require('mongoose');
const chatRoomsSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    messages: [{ user: { type: String }, message: { type: String }, status: { type: String }}]
})
module.exports = mongoose.model('ChatRoom', chatRoomsSchema);