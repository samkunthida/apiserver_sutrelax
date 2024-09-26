const mongoose = require("mongoose");

const AssessmentSchema = new mongoose.Schema(
    {
        title: String,
        questions: [
            {
                topic: String,
                choices: [
                    {
                        text: String,
                        point: Number
                    }
                ]
            }
        ]
    },
    {
        collection: "Assessment"
    });
mongoose.model("Assessment", AssessmentSchema)