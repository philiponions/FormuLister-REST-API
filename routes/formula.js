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

    const user = await User.findById(id);        

    if (user) {
        // Sort the results by date
        const sortedList = user.formulas.sort(function(a, b) {
            var keyA = a.createdAt, keyB = b.createdAt
            // Compare the 2 dates
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return 0;
          });

        res.send(sortedList);
    } else {
        res.send("User not found")
    }

});

router.put("/users/:userId/formulas/:formulaId", async (req, res) => {
    const userId = req.params.userId;
    const formulaId = req.params.formulaId;

    await User.findByIdAndUpdate(
        userId,
        { $pull: { formulas: { _id: formulaId} } },
        { new: true}
    )
    .exec()
    .then(updatedUser => {
        console.log(`Formula ${formulaId} removed from user ${updatedUser._id}`);        
        res.send({message: "Deletion successful"});
    })
    .catch(err => {        
        console.log(err)
        res.send({message: err});
    })
});

module.exports = router;
