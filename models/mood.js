const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
    username: String,
    mood: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Mood", moodSchema);