const mongoose = require('mongoose');
const Validator = require('validator-json');


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        // validator(value){
        //     if(!validator.isEmail(value)){
        //         throw ("email id is not valid");
        //     }
        // }
    },
    mobile:Number,
    password:String,
    address:String,
    otp:String,
    expireIn:{
        type:Number,
        default:0
      },
      token: {
        type:String,
        default:0,
      },

    verified: {
        type: Boolean,
        default: false,
      },
    date:{
        type:Date,
        default:Date.now
    }
}
)

const UserModels = mongoose.model("user",UserSchema);

module.exports = UserModels;