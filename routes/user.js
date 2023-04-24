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
    
    const checkUserExists = await User.findOne({ $or: [{ username }, { email }] });
    
    // Check if the user already exists in the database
    if (!checkUserExists) {
        // Hash the password first before saving in db
        bcrypt.hash(password, saltRounds, async function(err, hash) {        
    
            if (checkValidity(email)) {
                const user = new User({
                    username: username,
                    password: hash,
                    email: email
                })
                
                // Save changees in db
                await user.save();
    
                res.status(200).send("success");
            }     
            else { res.status(400).send("error") }
        })
    } else {
        res.status(409).send("User with name/email already exists.");
    }



})

router.post("/login", async(req, res) => {
    const { username, password, token } = req.body

    // Find user with provided username
    const user = await User.findOne({ username });
    
    // If user not found, send an error response
    if (!user) {
        return res.status(400).send({message: "Invalid email or password"});
    }    

    // No need to hash the password again as bcrypt.compare takes care of it
    bcrypt.compare(password, user.password, async function(err, valid) {
        if (valid) {            
            user.token = token;
            await user.save();
            res.send({username: user.username, id: user._id});
        }
        else { res.status(400).send({message: "Invalid email or password"})}
    });        
})


router.post("/authenticate", async(req, res) => {
    const { token } = req.body

    // Find user with provided username
    const user = await User.findOne({ token: token });
    
    // If user not found, send an error response
    if (!user) {
        return res.status(400).send({message: "Invalid Token"});
    }    
    
    res.status(200).send({username: user.username, id: user._id})
})

router.put("/logout", async(req, res) => {
    const { token } = req.body

    console.log(token)
    // Find user with provided username
    const user = await User.findOne({ token: token });
    
    if (user) {
        try {
            // Remove the token from the user
            user.token = null;
            await user.save();
            console.log("success")
            res.status({message: "User successfully logged out."})
        } catch (error) {
            console.log(error)
            res.status({message: error})
        }
    }
    else { 
        console.log("Could not find user from token.")
        res.send({message: "Could not find user from token."}) 
    }

})



module.exports = router;