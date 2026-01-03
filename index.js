require("dotenv").config();
const path = require("path");
const express=require("express");
const app=express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
const { nanoid }=require("nanoid");

const mongoose=require("mongoose");
const Url=require("./db");
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("db connected"))
.catch(err=>console.log(err));

app.post("/short", async function(req,res){
    const {longUrl}=req.body;
   shortCode=nanoid(6);
   await Url.create({
    shortCode,
   
    longUrl
   });
   res.json({
    shortUrl:`http://localhost:3000/${shortCode}`
   });
});

app.get("/:code", async (req,res)=>{
    const { code } =req.params;
    
    const url=await Url.findOne({shortCode:code});
    if(!url){
        return res.status(404).json({
            message:"code not found"
        });
    }
   
    res.redirect(url.longUrl);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
