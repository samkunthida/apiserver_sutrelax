const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

app.use(express.json());
app.use(cors());

const mongoUrl = "mongodb+srv://kunthidakk:vhnlEtm7f1bATZiS@sutrelaxdb.mzomu.mongodb.net/?retryWrites=true&w=majority&appName=sutrelaxdb"

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

// Declare Collections
const UserLogin = mongoose.model("UserLogin"); // UserLogin Collection
const User = mongoose.model("User"); // UserDetail Collection

// GET POST

app.get("/", (req, res)=>{
        res.send({status: "Started"})
})

// POST UserLogin & User
app.post('/registerUser', async(req, res)=>{
    const {email, password, role} = req.body;
    const {firstName, lastName, profileImage, dateOfBirth, gender, dateCreatedAccount } = req.body;
    
    // Check if there's any email repeat
    const oldUser = await UserLogin.findOne({email:email});

    if(oldUser){
        return res.send({data: "User already exists"})
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
        res.send({status: "ok", data: "User Created!!!"})

    }catch(error){
        res.send({ status: "error", data: error });
    }
})

// GET Articles
app.get('/articles', async(req, res)=>{

})

app.listen(8000, ()=>{
    console.log("Node js server started");
})

