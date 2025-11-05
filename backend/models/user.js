const mongoose=require("mongoose");

const user=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        
    },
    address:{
        type:String,
        required:true,
     
    },
    avatar:{
        type:String,
        default:"https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"
        
    },
    role:{
        type:String,
        default:"user",
        enum: ["user","admin"],
    },
    favourites:[
        {
            type:mongoose.Types.ObjectId,
            ref:"books",
        },
    ],
    cart:[
        {
            type:mongoose.Types.ObjectId,
            ref:"books",
        },
    ],
    orders:[
        {
            type:mongoose.Types.ObjectId,
            ref:"order",
        },
    ],
    
},
{timestamps:true}
);
module.exports=mongoose.model("user",user);