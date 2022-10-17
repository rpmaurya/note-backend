const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const sendEmail = require('../middleware/email');




//router:-1
//using cryptjs for security perpose

const JWT_SECRET = 'rpmauya@up';
router.post("/createuser", [
    body('name', 'Enter the valid name').isLength({ min: 3 }),
    body('email', 'Enter the valid emailid').isEmail(),
    body('password', 'Enter the correct password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ errors: "Sorry a user with email already exists" });
        }
        //create password secure
        const salt = await bcrypt.genSaltSync(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        let otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        //create user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: secPass,
            address: req.body.address,
            otp: otp,
        
        })
        // const data = {
        //     user: {
        //         id: user.id
        //     }
        // }
        // const token = await new Token({
        //     userId: user.id,
        //     token: jwt.sign(data, JWT_SECRET),
        // }).save();

        // res.json(user);
        //res.json({token});


        //  const message = `http://localhost:8000/api/auth/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", otp);

        res.send(" otp sent to your email please verify");

    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error is occers");
    }

})
// email verification router
router.get("/verify", async (req, res) => {
    // const userId = req.user.id;
    const email = req.query.email;
    const otp = req.query.otp;
    const user = await User.findOne({ email: email });
    if (otp != user.otp) return res.status(400).json({ errors: "Sorry  otp  is not valid" });

    try {

        await User.findOneAndUpdate({ email: email }, { verified: true }, { new: true });
        res.send("email  varificaton is seccussfull ")

    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error is occers");
    }
})



//router:-2
//authinication for login page

router.post("/login", [

    body('email', 'Enter the valid emailid').isEmail(),
    body('password', 'Enter the correct password').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email:email });
        if (!user) {
            return res.status(400).json({ errors: "Sorry  user is not exists" });
        }
        const passwordcompare = await bcrypt.compare(password, user.password);
        if (!passwordcompare) {
            return res.status(400).json({ errors: "Sorry  password is not exists" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        
        const token = jwt.sign(data, JWT_SECRET);
        const authtoken = await User.findOneAndUpdate({email:email},{token:token},{new:true});

        // res.json(user);
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error is occers");
    }

})

//router:-3
//get logined user details using post:"api/auth/getuser" login requred
router.post("/getuser", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error is occer");
    }
})


//router:-4
//forgot password using post method login are required
router.post('/sendotp', async (req, res) => {
    try {

        const email = req.body.email;
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ errors: "Sorry  user is not exists" });
        }
        let otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        const expireIn = new Date().getTime() + 300 * 1000;
        await User.findOneAndUpdate({ email: email }, { otp: otp, expireIn: expireIn }, { new: true });
        await sendEmail(user.email, "Verify Email", otp);
        res.send(" otp sent on your email please verify");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error is occer");
    }

});

router.post("/resetpassword", async (req, res) => {


    try {
        const email = req.body.email;
        let user = await User.findOne({ email: email });
        const otp = req.query.otp;
        if (otp != user.otp) return res.status(400).json({ errors: "Sorry  otp  is not valid" });
        const newpass = req.query.newpass;
        const cpass = req.query.cpass;
        if (newpass != cpass) return res.status(400).json({ errors: "password is not matched" });

        const salt = await bcrypt.genSaltSync(10);
        const secPass = await bcrypt.hash(req.query.newpass, salt);
        await User.findOneAndUpdate({ email: email }, { password: secPass }, { new: true });
        res.send("reset password  is seccussfull ")

    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error is occers");
    }
})

router.post("/logout",fetchuser,async(req,res)=>{
    try {
        await User.findOneAndUpdate({token:"0"});
    res.send("logout"); 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error is occer"); 
    }
   
})
module.exports = router;