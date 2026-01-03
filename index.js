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

app.post("/short", async (req, res) => {
  try {
    let longUrl = req.body.longUrl;

    console.log("RAW INPUT:", longUrl);

    if (!longUrl || typeof longUrl !== "string") {
      return res.status(400).json({ message: "URL is required" });
    }

    longUrl = longUrl.trim();

    // ✅ GUARANTEED FIX
    if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
      longUrl = "https://" + longUrl;
    }

    console.log("NORMALIZED:", longUrl);

    const shortCode = nanoid(6);

    await Url.create({
      shortCode,
      longUrl
    });

    return res.json({
      shortUrl: `${process.env.BASE_URL}/${shortCode}`
    });

  } catch (err) {
    console.error("SHORT ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
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
