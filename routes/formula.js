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
    
    let user = await User.findById(id);
    user.formulas.push(newFormula);
    await user.save();

    res.send(req.body);
});

module.exports = router;
