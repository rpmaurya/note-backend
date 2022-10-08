const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

// router.post("/",(req,res)=>{
//     console.log(req.body);
//     const user = User(req.body);
//     user.save();
//     res.send(req.body);
// })

// router.post("/",[
//     body('name','Enter the valid name').isLength({ min: 3 }),
//     body('email','Enter the valid emailid').isEmail(),
//     body('password','Enter the correct password').isLength({ min: 5 })
// ],(req,res)=>{
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     User.create({
//         name: req.body.name,
//         email: req.body.email,
//         mobile: req.body.mobile,
//         password: req.body.password,
//         address: req.body.address,
//       }).then(user => res.json(user))
//       .catch(err=>{console.log(err)
//         res.json({error:'Please enter another email, its allready inserted'})})

// })

//create user using post method "/api/auth/createuser"

// router.post("/createuser",[
//         body('name','Enter the valid name').isLength({ min: 3 }),
//         body('email','Enter the valid emailid').isEmail(),
//         body('password','Enter the correct password').isLength({ min: 5 })
//     ],async(req,res)=>{
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//           return res.status(400).json({ errors: errors.array() });
//         }
//         try {
//             let user = await User.findOne({email: req.body.email});
//             if(user){
//                 return res.status(400).json({ errors: "Sorry a user with email already exists" }); 
//             }

//             user= await User.create({
//                 name: req.body.name,
//                 email: req.body.email,
//                 mobile: req.body.mobile,
//                 password: req.body.password,
//                 address: req.body.address,
//               })
//               res.json(user);
//         } catch (error) {
//          console.error(error.message); 
//          res.status(500).send("some error is occers"); 
//         }

//     }) 

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
        //create user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: secPass,
            address: req.body.address,
        })
     const data = {
        user:{
            id:user.id
        }
     }
     const authtoken= jwt.sign('data',JWT_SECRET);
     
       // res.json(user);
        res.json({authtoken});
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

    const {email,password} = req.body;
try {
    let user = await User.findOne({email});
    if(!user){
        return res.status(400).json({ errors: "Sorry  user is not exists" });  
    }
  const passwordcompare = await bcrypt.compare(password, user.password);
  if(!passwordcompare){
    return res.status(400).json({ errors: "Sorry  password is not exists" }); 
  }
  const data = {
    user:{
        id:user.id
    }
 }
 const authtoken= jwt.sign(data,JWT_SECRET);
 
   // res.json(user);
    res.json({authtoken});
} catch (error) {
    console.error(error.message);
    res.status(500).send("some error is occers");   
}

})

//router:-3
//get user details using post:"api/auth/getuser" login requred
router.post("/getuser",fetchuser,async(req,res)=>{
try {
   userId = req.user.id;
   const user = await User.findById(userId).select("-password");
   res.send(user);
} catch (error) {
    console.error(error.message);
    res.status(500).send("some error is occer");  
}
})


module.exports = router;