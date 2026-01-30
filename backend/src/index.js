const express = require('express');
const mongoose = require('mongoose');
const Users = require('./models/Users')

const DB_URL = 'mongodb+srv://23wh1a0528_db_user:fVQF5e1pbUZoXMjv@expensetracker-cluster0.fntvuxo.mongodb.net/'
const app = express()

app.listen(3000, ()=>{
    console.log("Server Listening at port 3000");
})

app.get('/user', async(req, res) =>{
    try{
        await mongoose.connect(DB_URL)
        console.log("Connection Successful")

        const listOfUSers = (await Users.find({})).flat()
        
        res.status(200).json({message: "Connected to database successfully",
            users: listOfUSers
        })

    }catch(err){
        console.log("Error Connecting to Database", err)
        res.status(200).json({message: "Error Connecting to database"})
    }
})