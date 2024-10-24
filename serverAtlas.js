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
require('./models/AssessmentModel') // file path /models/AssessmentModel.js
require('./models/PostModel') // file path /models/PostModel.js
require('./models/UserAssessmentResultModel') // file path /models/UserAssessmentResultModel.js
require('./models/VideoModel') // file path /models/VideoModel.js

// Declare Collections
const UserLogin = mongoose.model("UserLogin"); // UserLogin Collection
const User = mongoose.model("User"); // UserDetail Collection
const Quote = mongoose.model("Quote"); // Quote Collection
const Article = mongoose.model("Article"); // Article Collection
const Assessment = mongoose.model("Assessment"); // Assessment Collection
const Post = mongoose.model("Post"); // Post Collection
const UserAssessmentResult = mongoose.model("UserAssessmentResult"); // UserAssessmentResult Collection
const Video = mongoose.model("Video"); // Video Collection

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

app.post("/updateUserName", async (req, res) => {
    const { token, firstName, lastName} = req.body;
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

app.post("/updateUserGender", async (req, res) => {
    const { token, gender } = req.body;
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
        userDetail.gender = gender;
        await userDetail.save();

        return res.send({ status: "Ok", data: userDetail });

    } catch (error) {
        res.send({ status: "error", data: error.message });
    }
});

app.post("/updateUserDateOfBirth", async (req, res) => {
    const { token, dateOfBirth } = req.body;
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
        userDetail.dateOfBirth = dateOfBirth;
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

//POST Article

app.post("/articleFetch", async (req, res) => {
    try {
        const articles = await Article.find().populate("userID");

        if (!articles || articles.length === 0) {
            return res.status(404).send({ status: "error", data: "No articles found" });
        }
        res.status(200).send({ status: "Ok", data: articles });

    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

app.post('/articleDetail', async (req, res) => {
    const { articleId } = req.body;

    try {
        const article = await Article.findById(articleId).populate("userID", "firstName");
        if (!article) {
            return res.status(404).json({ status: "Error", data: "Article not found" });
        }

        res.status(200).json({ status: "Ok", data: article });
    } catch (error) {
        console.error("Error fetching article details:", error);
        res.status(500).json({ status: "Error", data: "Server error" });
    }
});

// POST Video
app.post("/videoFetch", async (req, res) => {
    try {
        const videos = await Video.find().populate("userID");

        if (!videos || videos.length === 0) {
            return res.status(404).send({ status: "error", data: "No videos found" });
        }
        res.status(200).send({ status: "Ok", data: videos });

    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

app.post('/videoDetail', async (req, res) => {
    const { videoId } = req.body;

    try {
        const video = await Video.findById(videoId).populate("userID");
        if (!video) {
            return res.status(404).json({ status: "Error", data: "Video not found" });
        }

        res.status(200).json({ status: "Ok", data: video });
    } catch (error) {
        console.error("Error fetching video details:", error);
        res.status(500).json({ status: "Error", data: "Server error" });
    }
});

// POST Post

app.post("/PostFetch", async (req, res) => {
    try {
        const posts = await Post.find().populate("userID");

        if (!posts || posts.length === 0) {
            return res.status(404).send({ status: "error", data: "No posts found" });
        }
        res.status(200).send({ status: "Ok", data: posts });

    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

//POST Assessment

app.post("/assessmentFetch", async (req, res) => {
    try {
        const assessments = await Assessment.find(); 

        if (!assessments || assessments.length === 0) {
            return res.status(404).send({ status: "error", data: "No assessments found" });
        }

        res.status(200).send({ status: "Ok", data: assessments });
        
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Fetch data and show on AssessmentChooseScreen.js
//Wrong Name: suppose to be assessmentFetch
app.post("/userAssessmentResultFetch", async (req, res) => {
    const { userID } = req.body;

    try {
        const userAssessmentResults = await UserAssessmentResult.find({ userID: userID })
            .populate("assessmentID", "name");

        if (!userAssessmentResults || userAssessmentResults.length === 0) {
            return res.status(404).send({ status: "error", data: "No assessment results found" });
        }

        res.status(200).send({ status: "Ok", data: userAssessmentResults });
    } catch (error) {
        console.error("Error fetching user assessment results:", error);
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Send data into UserAssessmentResult from AssessmentQuestionScreen.js

app.post('/sendAssessmentResult', async (req, res) => {
    const { score, userID, assessmentID } = req.body;

    try {
        const newResult = await UserAssessmentResult.create({
            score: score,
            dateCreated: new Date(),
            userID: userID,
            assessmentID: assessmentID,
        });

        res.status(200).send({ status: 'ok', data: newResult });
    } catch (error) {
        console.error('Error saving assessment result:', error);
        res.status(500).send({ status: 'error', message: 'Failed to save assessment result.' });
    }
});

app.post("/userAssessmentHistoryFetch", async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).send({ status: "error", message: "userID is required" });
    }

    try {
        const userAssessmentResults = await UserAssessmentResult.find({ userID: userID })
            .populate("assessmentID", "title questions");

        if (!userAssessmentResults || userAssessmentResults.length === 0) {
            return res.status(404).send({ status: "error", data: "No assessment results found" });
        }

        const formattedResults = userAssessmentResults.map(result => {
            const assessment = result.assessmentID;

            const maxScore = assessment.questions.reduce((total, question) => {
                const maxPoint = question.choices ? Math.max(...question.choices.map(choice => choice.point)) : 0;
                return total + maxPoint; 
            }, 0);

            return {
                assessmentTitle: assessment.title,
                score: result.score,
                maxScore: maxScore,
                dateCreated: result.dateCreated,
            };
        });

        res.status(200).send({ status: "Ok", data: formattedResults });
    } catch (error) {
        console.error("Error fetching user assessment results for userID:", userID, error);
        res.status(500).send({ status: "error", message: error.message });
    }
});


// POST User Data

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

