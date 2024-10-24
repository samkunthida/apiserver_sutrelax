const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
    {
    title: String,
    desc: String,
    youtubeURL: String,
    dateCreated: Date,
    coverImage: String,
    surveyID: {type: mongoose.Schema.Types.ObjectId, ref: "Survey"},
    userID: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    },
    {
    collection: "Video"
});
mongoose.model("Video", VideoSchema)