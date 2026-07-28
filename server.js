const express = require('express');
const app = express();
const Parser = require('rss-parser');
const path = require('path');
const cors = require('cors');
require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("./src/models/users");

const connectDB = require('./src/db/db');
connectDB();

app.use(express.json());

app.use(cors());

const parser = new Parser();
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/news', async (req, res) => {
    try {
       const feed = await parser.parseURL(
               'https://feeds.bbci.co.uk/hindi/rss.xml'
        );
        console.log(feed.title);
       const articles = feed.items.map(item => ({
            title: item.title,
            link: item.link,
            description: item.contentSnippet
        }));

        res.json({ articles });

    } catch (error) {


        res.status(500).json({
            error: 'Failed to fetch news data'
        });
    }
});


app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json ({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword

        });

        await newUser.save();
        res.status(201).json({
            message: "Registration successful"
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

app.post("/login", async (req, res) => {

    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({
                message : "User not found"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message : "Incorrect password"
            });
        }
        res.status(200).json({
            message : "Login Successful"
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message : "Server Error"
        });

    }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
