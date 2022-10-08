const mongoose = require('mongoose');



const NoteSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type:String,
        required:true
    },
    subject:String,
    description:String,
   
    date:{
        type:Date,
        default:Date.now
    }
})

const NoteModels = mongoose.model("note",NoteSchema);

module.exports = NoteModels;