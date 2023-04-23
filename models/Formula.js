const mongoose = require("mongoose")

const schema = mongoose.Schema({
    variables: [String],
    equation: String,
    title: String,
    createdAt: { type: Date, default: Date.now}
})

exports.schema = schema 
exports.model = mongoose.model("Formula", schema)