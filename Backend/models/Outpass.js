const mongoose = require("mongoose");

const outpassSchema = new mongoose.Schema(
{
student:{
type: mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

studentName:{
type:String,
required:true
},

studentId:{
type:String,
required:true
},

hostelRoom:{
type:String,
required:true
},

destination:{
type:String,
required:true
},

reason:{
type:String,
required:true
},

leaveDateFrom:{
type:Date,
required:true
},

leaveDateTo:{
type:Date,
required:true
},

timeFrom:{
type:String
},

timeTo:{
type:String
},

parentRelation:{
type:String,
required:true
},

parentContact:{
type:String,
required:true
},

parentEmail:{
type:String
},

status:{
type:String,
enum:["pending","pending-admin","approved","rejected"],
default:"pending"
},

parentDecision: {
  type: String,
  enum: ["approved", "rejected"],
},

parentPhotoPath: {
  type: String,  // e.g. "uploads/photo-<id>.jpg"
},

parentVideoPath: {
  type: String,  // e.g. "uploads/video-<id>.webm"
},

verifiedAt: {
  type: Date,
},

},
{timestamps:true}
);

module.exports = mongoose.model("Outpass",outpassSchema);