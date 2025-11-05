const router=require("express").Router();
const User=require("../models/user");
const {authenticateToken}=require("./userAuth");

//add book to cart
// Use req.body.bookid instead of req.headers.bookid
router.put("/add-to-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.body; // updated to use req.body
        const { id } = req.headers;
        const userData = await User.findById(id);
        const isBookinCart = userData.cart.includes(bookid);
        if (isBookinCart) {
            return res.json({ status: "Success", message: "Book is already in cart" });
        }
        await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
        return res.status(200).json({ message: "Book added to cart" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


router.put("/del-cart/:bookid",authenticateToken,async(req,res)=>{
    try{
        const {bookid}=req.params;
        const {id}=req.headers;
        const userData=await User.findById(id);
        
        await User.findByIdAndUpdate(id,{$pull: {cart:bookid}});
        return res.json({status:"Success",message:"Book removed from cart"});
    }catch(error)
    {
        res.status(500).json({message: "Internal server error"});
    }
});

router.get("/get-cart",authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const userData=await User.findById(id).populate("cart");
        const cart=userData.cart.reverse();
        return res.json({status:"Success",data:cart});
        
    }catch(error)
    {
        res.status(500).json({message: "An error occured"});
    }
});


module.exports=router;