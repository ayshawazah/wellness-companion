require("dotenv").config();
const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);
const mongoose = require("mongoose");
const express = require("express");
const Goal = require("./models/goal");
const Journal = require("./models/journal");
const Mood = require("./models/mood");
const User = require("./models/user");


const app = express();
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch(err => {
        console.log("MongoDB Connection Error:", err);
    });



app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


// REGISTER
app.post("/register", async (req, res) => {
    try {
        const user = new User(req.body);

        await user.save();

        console.log("User Saved Successfully");

        res.redirect("/login.html");
    } catch (err) {
        console.log(err);
        res.send("Error Saving User");
    }
});


// LOGIN
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });

        if (user) {
            const homeUrl = `/index.html?username=${encodeURIComponent(user.username)}`;
            res.redirect(homeUrl);
        } else {
            res.send("Invalid Username or Password");
        }
    } catch (err) {
        console.log(err);
        res.send("Error");
    }
});


// MOOD
app.post("/mood", async (req, res) => {
    try {
        const mood = new Mood({
            username: req.body.username,
            mood: req.body.mood
        });

        await mood.save();

        console.log("Mood Saved Successfully");

        res.redirect(`/dashboard?username=${encodeURIComponent(req.body.username)}`);
    } catch (err) {
        console.log(err);
        res.send("Error Saving Mood");
    }
});


// JOURNAL
app.post("/journal", async (req, res) => {
    try {
        const journal = new Journal({
            username: req.body.username,
            title: req.body.title,
            entry: req.body.entry
        });

        await journal.save();

        console.log("Journal Saved Successfully");

        res.redirect(`/dashboard?username=${encodeURIComponent(req.body.username)}`);
    } catch (err) {
        console.log(err);
        res.send("Error Saving Journal");
    }
});


// GOAL
app.post("/goal", async (req, res) => {
    try {
        console.log("GOAL FORM DATA:", req.body);
        const { username, goal, status } = req.body;

        console.log("Username:", username);
        console.log("Goal:", goal);
        console.log("Status:", status);

        const newGoal = new Goal({
            username: username,
            goal: goal,
            status: status
        });

        await newGoal.save();

        console.log("Goal Saved Successfully");

        res.redirect(`/dashboard?username=${encodeURIComponent(username)}`);

    } catch (err) {
        console.log(err);
        res.send("Error saving goal");
    }

});


// DASHBOARD
app.get("/dashboard", async (req, res) => {
    try {
        const username = req.query.username;

        const moods = await Mood.find({ username });
        const journals = await Journal.find({ username });
        const goals = await Goal.find({ username });

        res.render("dashboard", {
            moods,
            journals,
            goals
        });
    } catch (err) {
        console.log(err);
        res.send("Error Loading Dashboard");
    }
});


// START SERVER
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});