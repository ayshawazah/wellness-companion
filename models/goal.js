const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    goal: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Goal", goalSchema);