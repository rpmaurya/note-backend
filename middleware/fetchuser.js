var jwt = require('jsonwebtoken');
const JWT_SECRET = 'rpmauya@up';
const User = require('../models/User');


const fetchuser = async(req,res,next)=>{
//get the user from jwt token and add id to req object
try {
    const token =  req.header("auth-token");
const user =  await User.findOne({token:token});
if(token!= user.token) return res.status(401).send({error:'Please authenticate a using valid token'});
    const data = jwt.verify(token,JWT_SECRET);
    req.user = data.user;
    next();  
} catch (error) {
    res.status(401).send({error:'Please authenticate a using valid token'});  
}

}

module.exports = fetchuser;