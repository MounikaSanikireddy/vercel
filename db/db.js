const mongoose=require("mongoose")

const dbConnect=async ( )=>{
    try{
        mongoose.connect("mongodb://127.0.0.1:27017/URL")
    }

    catch(error){
        console.log("something went wrong in connecting db")
    }   
 }
module.exports=dbConnect