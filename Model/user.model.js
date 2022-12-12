const mongoose = require("mongoose");
const userSchema =new mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const UserModel = mongoose.model("user987",userSchema);

module.exports = {UserModel}