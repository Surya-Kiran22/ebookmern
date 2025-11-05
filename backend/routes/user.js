const router=require("express").Router();
const User=require("../models/user");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {authenticateToken}=require("./userAuth");

//Sign up
router.post("/sign-up",async(req,res)=> {
    try{
      const {username,email,password,address} =req.body;
      
      //check username length is more than 4
      if(username.length<4){
        return res.status(400).json({message:"Username length should be greater than 3"});
      }

      //check username already exists
      const existingUsername = await User.findOne({username:username});
      if(existingUsername){
        return res.status(400).json({message:"Username already exists"});
      }

      //check email already exists
      const existingEmail = await User.findOne({email:email});
      if(existingEmail){
        return res.status(400).json({message:"Email already exists"});
      }
      //check password length
      
      if(password.length <= 5){
        return res.status(400).json({message: "Password length should be greater than 5"});
    }
    const hashPass=await bcrypt.hash(password,10)

      const newUser=new User({
        username:username,
        email:email,
        password:hashPass,
        address:address,
    });
    await newUser.save();
    return res.status(200).json({message:"Signup's successful"});

    }catch(error){
        res.status(500).json({message: "Internal server error"});  
    }
});


//sign in
router.post("/sign-in",async(req,res)=> {
    try{
        const {username,password}=req.body;
        const existingUser=await User.findOne({username});
        if(!existingUser)
        {
            res.status(400).json({message: "Invalid credentials"});
        }
        await bcrypt.compare(password,existingUser.password,(err,data)=> {
            if(data)
            {
                const authClaims=[{name:existingUser.username},{role:existingUser.role},];
                const token=jwt.sign({authClaims},process.env.JWT_SECRET,{
                    expiresIn:"30d",
                });
                res.status(200).json({id:existingUser._id,role:existingUser.role,token:token});
            }
            else
            {
                res.status(400).json({message: "Invalid credentials"});
            }
        });
    }catch(error){
        res.status(500).json({message: "Internal server error"});  
    }
});



// get user information
router.get("/get-user", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).select('username email role avatar'); // Include role here
        return res.status(200).json(userData);  // This will include the role in the response
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});




//update address
router.put("/update-address",authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const {address}=req.body;
        await User.findByIdAndUpdate(id,{ address:address});
        return res.status(200).json({message:"Address updated successfully"});
    }catch(error)
    {
        res.status(500).json({message: "Internal server error"});
    }
});


module.exports=router;
 
// promote user to admin using ADMIN_CODE
router.post("/make-admin", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { code } = req.body;
        if (!code || code !== process.env.ADMIN_CODE) {
            return res.status(403).json({ message: "Invalid admin code" });
        }
        await User.findByIdAndUpdate(id, { role: "admin" });
        return res.status(200).json({ message: "User promoted to admin" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
