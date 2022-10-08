 const express = require('express');
const dbconnect = require('./db');

 const app = express();
 const port = 8000;

 //middleware
 app.use(express.json());
 //creating route
app.use("/api/auth",require('./routers/auth'));
app.use("/api/notes",require('./routers/notes'));


 app.listen(port,()=>{
    console.log(`Server is running on port no- ${port}`);
 })
