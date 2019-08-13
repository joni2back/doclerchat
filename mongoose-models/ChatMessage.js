const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    roomId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);