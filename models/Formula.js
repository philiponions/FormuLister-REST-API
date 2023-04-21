const mongoose = require("mongoose")

const schema = mongoose.Schema({
    variables: [String],
    expression: String
})

exports.schema = schema 
exports.model = mongoose.model("Formula", schema)