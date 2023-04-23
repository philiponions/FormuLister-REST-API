const express = require("express")
const User = require("../models/User").model
const Formula = require("../models/Formula").model

const router = express.Router();

router.post("/add", async(req, res) => {
    const { id, equation, variables, title } = req.body;
    
    const newFormula = new Formula({
        variables: variables,        
        equation: equation,
        title: title
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

router.put("/users/:userId/formulas/:formulaId", async (req, res) => {
    const userId = req.params.userId;
    const formulaId = req.params.formulaId;

    console.log("userID:",userId)
    console.log("formulaID:",formulaId)
    await User.findByIdAndUpdate(
        userId,
        { $pull: { formulas: { _id: formulaId} } },
        { new: true}
    )
    .exec()
    .then(updatedUser => {
        console.log(`Formula ${formulaId} removed from user ${updatedUser._id}`);
        console.log(updatedUser);
        res.send({message: "Deletion successful"});
    })
    .catch(err => {        
        console.log(err)
        res.send({message: err});
    })
});

module.exports = router;
