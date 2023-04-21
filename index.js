const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRouter = require("./routes/user")
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.ATLAS_URI

async function connect() {
    try {
        await mongoose.connect(uri, {dbName: "FormuLister"})
        console.log("Connected to MongoDB!")
    } catch (error) {
        console.log(error)
    }
}

connect();


app.use("/user", express.json())
app.use("/user", userRouter)
app.listen(8000, () => {    
    console.log('Server started on post 8000');
})