const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema(
    {
    q_text: String,
    },
    {
    collection: "Quote"
});
mongoose.model("Quote", QuoteSchema)