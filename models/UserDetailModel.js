const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema(
    {
    firstName: String,
    lastName: String,
    profileImage: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ["male", "female", "unknown"] },
    dateCreatedAccount: Date,

    },
    {
    collection: "User"
});
mongoose.model("User", UserDetailSchema)