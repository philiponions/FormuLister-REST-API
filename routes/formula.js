const express = require("express")
const User = require("../models/User").model
const Formula = require("../models/Formula").model

const router = express.Router();

router.post("/add", async(req, res) => {
    const { id, equation, variables } = req.body;
    
    const newFormula = new Formula({
        variables: variables,        
        equation: equation
    })
    
    try {
        let user = await User.findById(id);
        user.formulas.push(newFormula);
        await user.save();
        res.send("Formula successfully added");
    
    } catch (err) {
        res.send({message: err})
    }

});

router.get("/get/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id)

    const user = await User.findById(id);        

    if (user) {
        res.send(user.formulas);
    } else {
        res.send("User not found")
    }

});

module.exports = router;
