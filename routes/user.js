const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require("../models/User").model

// Checks the validity of an email using regex expression
function checkValidity(email) {
    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
    return validEmail
}

router.post("/register", async(req, res) => {
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email

    const saltRounds = 10;    
    
    bcrypt.hash(password, saltRounds, async function(err, hash) {        
        console.log("to", hash)
        if (checkValidity(email)) {
            const user = new User({
                username: username,
                password: hash,
                email: email
            })
            
            await user.save()

            res.send("good")
        }     
        else { res.send("error") }
    })


})

router.post("/login", async(req, res) => {
    const { username, password } = req.body

    const saltRounds = 10;    

    // Find user with provided username
    const user = await User.findOne({ username });
    
    // If user not found, send an error response
    if (!user) {
        return res.status(400).send({message: "Invalid email or password"})
    }    

    // No need to hash the password again as bcrypt.compare takes care of it
    bcrypt.compare(password, user.password, function(err, valid) {
        if (valid) {
            res.status(200).send({message: "Succesfully logged in"})
        }
        else { res.status(400).send({message: "Invalid email or password"})}
    });
    
})


module.exports = router;