const mongoose = require('mongoose')

const users = new mongoose.Schema({
    username: {type : String, required: true, unique:true},
    email: {type: String, required: true, unique: true},
    mobienumber: {type : String, required:true, unique : true}
})

module.exports = mongoose.model('Users', users)

//change this content according to your application