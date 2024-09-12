const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
    {
    title: String,
    coverImage: String,
    content: String,
    dateCreated: Date,
    userID: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    },
    {
    collection: "Article"
});
mongoose.model("Article", ArticleSchema)