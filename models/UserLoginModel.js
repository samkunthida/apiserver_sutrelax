const mongoose = require("mongoose");

const UserLoginSchema = new mongoose.Schema(
    {
    userID: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["user", "admin", "mod"], default: "user" }
    },
    {
    collection: "UserLogin"
});
mongoose.model("UserLogin", UserLoginSchema)