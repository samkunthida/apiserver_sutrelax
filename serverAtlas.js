const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
//const crypto = require('crypto');

app.use(express.json());
app.use(cors());

// sensitive data
const mongoUrl = "mongodb+srv://kunthidakk:vhnlEtm7f1bATZiS@sutrelaxdb.mzomu.mongodb.net/?retryWrites=true&w=majority&appName=sutrelaxdb"

// sensitive data
JWT_SECRET = "9b7cca92093cee49f51adf17cd0a63d43113bb7aba952cb65f526e263424ebd416893213627c19d150f9f2ed88331e4253f69083e0ae91c9e6feec2ce2ce9bf7";

// [In case] For randomly generate JWT_SECRET
// const JWT_SECRET_GENERATE = crypto.randomBytes(64).toString('hex');
// console.log(JWT_SECRET_GENERATE);

mongoose
    .connect(mongoUrl)
    .then(() => {
        console.log("Database Connected")
    })
    .catch((e) => {
        console.log(e);
    });

require('./models/UserLoginModel') // file path /models/UserLoginModel.js
require('./models/UserDetailModel') // file path /models/UserDetailModel.js
require('./models/QuoteModel') // file path /models/QuoteModel.js
require('./models/ArticleModel') // file path /models/ArticleModel.js

// Declare Collections
const UserLogin = mongoose.model("UserLogin"); // UserLogin Collection
const User = mongoose.model("User"); // UserDetail Collection
const Quote = mongoose.model("Quote"); // Quote Collection
const Article = mongoose.model("Article"); // Article Collection

// GET POST
app.get("/", (req, res) => {
    res.send({ status: "Started" })
})

// POST UserLogin & User
app.post('/registerUser', async (req, res) => {
    const { email, password, role } = req.body;
    const { firstName, lastName, profileImage, dateOfBirth, gender, dateCreatedAccount } = req.body;

    // Check if there's any email repeat
    const oldUser = await UserLogin.findOne({ email: email });

    if (oldUser) {
        return res.send({ data: "User already exists" })
    }

    const encryptedPassword = await bcrypt.hash(password, 10)
        
    try {
        const newUser = await User.create({
            firstName: firstName,
            lastName: lastName,
            profileImage: profileImage,
            dateOfBirth: dateOfBirth,
            gender: gender,
            dateCreatedAccount: dateCreatedAccount
        });

        await UserLogin.create({
            userID: newUser._id,
            email: email,
            password: encryptedPassword,
            role: "user",
        });
        res.send({ status: "ok", data: "User Created!" })

    } catch (error) {
        res.send({ status: "error", data: error });
    }
})

// POST update user details

app.post("/updateUserDetails", async (req, res) => {
    const { token, firstName, lastName } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET);
        const userEmail = user.email;

        const userLogin = await UserLogin.findOne({ email: userEmail });
        if (!userLogin) {
            return res.send({ status: "error", data: "User not found" });
        }

        const userDetail = await User.findOne({ _id: userLogin.userID });
        if (!userDetail) {
            return res.send({ status: "error", data: "User details not found" });
        }

        // Update user details
        userDetail.firstName = firstName;
        userDetail.lastName = lastName;
        await userDetail.save();

        return res.send({ status: "Ok", data: userDetail });

    } catch (error) {
        res.send({ status: "error", data: error.message });
    }
});


// POST Login
app.post("/loginUser", async (req, res) => {
    const { email, password } = req.body;
    const oldUser = await UserLogin.findOne({ email: email });

    if (!oldUser) {
        return res.send({ data: "User doesn't exist!" });
    }

    if (await bcrypt.compare(password, oldUser.password)) {
        const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);

        if (res.status(201)) {
            return res.send({ status: "ok", data: token });
        } else {
            return res.send({ error: "error" })
        }
    }
});

// POST Quote
app.post("/quoteData", async (req, res) => {
    try {
        const quotes = await Quote.find();
        if (!quotes || quotes.length === 0) {
            return res.send({ status: "error", data: "No quotes found" });
        }
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        res.send({ status: "Ok", data: randomQuote });
    } catch (error) {
        res.send({ status: "error", data: error.message });
    }
});

app.post("/articleFetch", async (req, res) => {
    try {
        // Fetch all articles and populate userID (which references the User collection)
        const articles = await Article.find().populate("userID"); 

        // Check if no articles are found
        if (!articles || articles.length === 0) {
            return res.status(404).send({ status: "error", data: "No articles found" });
        }

        // Send the articles in the response
        res.status(200).send({ status: "Ok", data: articles });
    } catch (error) {
        // Handle any server errors
        res.status(500).send({ status: "error", message: error.message });
    }
});


app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET)
        const userEmail = user.email;

        const userLogin = await UserLogin.findOne({ email: userEmail });
        if (!userLogin) {
            return res.send({ status: "error", data: "User not found" })
        }

        const userDetail = await User.findOne({ _id: userLogin.userID });
        if (!userDetail) {
            return res.send({ status: "error", data: "User details not found" })
        }

        return res.send({ status: "Ok", data: userDetail });

    } catch (error) {
        res.send({ status: "error", data: error });
    }
})

// Running at port 8000
app.listen(8000, () => {
    console.log("Node js server started");
})

