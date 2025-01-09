// require('dotenv').config()

import dotenv from 'dotenv'
//  import {app} from "app.js"
import {app} from "./app.js"
import connectDB from "./db/index.js";


dotenv.config({
    path:'./.env'
})

connectDB()

.then(()=>{
  app.listen(process.env.PORT||8000,()=>{
    console.log(`server is running at port :${process.env.PORT}`);
    
  })

  app.on('error', (err) => {
    console.error('Server encountered an error:', err);
  })


})



.catch((err)=>{
  console.log('Mongo Db connection failed !!',err)})



// in db alternative

/*
import express from "express";
const app =express()

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error",(error)=>{console.log('ERROR',error);
        throw error 
    })

    app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`); 
    })
  }
   catch (error) {
    console.error("ERROR:", error);
    throw error;
  }
})();

*/
