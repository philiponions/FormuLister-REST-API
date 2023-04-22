const mongoose = require("mongoose")
const Formula = require("./Formula").schema

const schema = mongoose.Schema({    
    username: String,
    email: String,
    password: String,
    token: String,
    formulas: [Formula]
})

exports.schema
exports.model = mongoose.model("User", schema)