const mongoose = require('mongoose')

const dbconnect= mongoose.connect("mongodb://localhost:27017/enotebook").then(()=>{
console.log("db is connected");
}).catch((err)=>{
console.log(err);
});

module.exports = dbconnect;