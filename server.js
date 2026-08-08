const Goal = require("./models/goal");
const Journal = require("./models/journal");
const Mood = require("./models/mood");
const User = require("./models/user");
const mongoose = require("mongoose");
const express = require("express");

const app = express();
app.set("view engine", "ejs");
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.use(express.static("public"));
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
app.post("/mood", async (req, res) => {
    try {
        const mood = new Mood({
            username: req.body.username,
            mood: req.body.mood
        });

        await mood.save();

        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        res.send("Error Saving Mood");
    }
});
app.post("/journal", async (req, res) => {
    try {
        const journal = new Journal({
            username: req.body.username,
            title: req.body.title,
            entry: req.body.entry
        });

        await journal.save();

        console.log("Journal Saved Successfully");
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        res.send("Error Saving Journal");
    }
});
app.post("/goal", async (req, res) => {
    try {
        const goal = new Goal({
            username: req.body.username,
            goal: req.body.goal,
            status: req.body.status
        });

        await goal.save();

        console.log("Goal Saved Successfully");
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        res.send("Error Saving Goal");
    }
});
app.get("/dashboard", async (req, res) => {

    const moods = await Mood.find();
    const journals = await Journal.find();
    const goals = await Goal.find();

    res.render("dashboard", {
        moods,
        journals,
        goals
    });

});
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wellnessDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});