const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
    title: String,
    content: String,
    dateCreated: Date,
    userID: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    },
    {
    collection: "Post"
});
mongoose.model("Post", PostSchema)