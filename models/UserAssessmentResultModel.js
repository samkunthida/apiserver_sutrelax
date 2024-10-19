const mongoose = require("mongoose");

const UserAssessmentResultModel = new mongoose.Schema(
    {
    score: String,
    dateCreated: Date,
    userID: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    assessmentID: {type: mongoose.Schema.Types.ObjectId, ref: "Assessment"},
    },
    {
    collection: "UserAssessmentResult"
});
mongoose.model("UserAssessmentResult", UserAssessmentResultModel)