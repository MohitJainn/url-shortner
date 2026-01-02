const mongoose=require("mongoose");

const urlSchema=new mongoose.Schema({
    shortCode:{
        type:String,
        unique:true,
        index:true
    },
    longUrl:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
});
const Url =mongoose.model("Url",urlSchema);
module.exports=Url;