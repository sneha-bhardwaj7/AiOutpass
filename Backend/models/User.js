const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
name:{
type:String,
required:true
},

email:{
type:String,
required:true,
unique:true
},

password:{
type:String,
required:true
},

role:{
type:String,
enum:["student","parent","admin"],
required:true
},

studentId:String,
hostelRoom:String,
phone:String,
relation:String,

// 🔗 Parent linked to a student
student:{
type: mongoose.Schema.Types.ObjectId,
ref:"User"
}

},{timestamps:true});

module.exports = mongoose.model("User",userSchema);