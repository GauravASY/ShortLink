import express from "express";
import ShortUrl from "../models/linkModel.js";
import User from "../models/userModel.js";
import authorization from "../middlewares/authorization.js";

const linkRouter = express.Router();


linkRouter.post("/", authorization, async (req, res) => {
  const { originalUrl, remarks, expiresAt } = req.body;
  const parsedDate =new Date(expiresAt);
  const formattedDate = parsedDate.toLocaleString('en-US', {
    month: 'short',  // "Jan"
    day: '2-digit',  // "14"
    year: 'numeric', // "2025"
    hour: '2-digit', // "16"
    minute: '2-digit', // "30"
    hour12: false // 24-hour format
  }).replace(',', '');
  const userId = req.userId;

  if (!originalUrl || !expiresAt) {
    return res.json({ msg: "Original URL and expiry date are required.", success: false });
  }

  try {
    const newLink = new ShortUrl({
      originalUrl,
      remarks,
      expiresAt : formattedDate,
      ipAddress: req.headers['x-forwarded-for'] || req.ip,
      userDevice: req.headers["user-agent"] || "Unknown",
    });

    await newLink.save();
    await User.findByIdAndUpdate(
        userId, 
        { $push: { shortUrls: newLink._id } },
        { new: true } 
      );
    res.json({ msg: "Shortened link created successfully.", link: newLink, success: true });
  } catch (error) {
    res.json({ msg: "Server error.", error , success: false});
  }
});

linkRouter.post("/edit", authorization, async (req, res) => {
    const { originalUrl, remarks, expiresAt, id } = req.body;
    const parsedDate =new Date(expiresAt);
    const formattedDate = parsedDate.toLocaleString('en-US', {
      month: 'short',  // "Jan"
      day: '2-digit',  // "14"
      year: 'numeric', // "2025"
      hour: '2-digit', // "16"
      minute: '2-digit', // "30"
      hour12: false // 24-hour format
    }).replace(',', '');
    const userId = req.userId;
  
    if (!id || !originalUrl || !expiresAt) {
      return res.status(400).json({ msg: "ID, Original URL, and expiry date are required." });
    }
  
    try {
      const existingLink = await ShortUrl.findById(id);
  
      if (!existingLink) {
        return res.status(404).json({ msg: "Shortened link not found.", success: false });
      }

      const user = await User.findById(userId);
      if (!user || !user.shortUrls.includes(id)) {
        return res.status(403).json({ msg: "Unauthorized to edit this link.", success: false });
      }
  
      const updatedLink = await ShortUrl.findByIdAndUpdate(
        id,
        {
          originalUrl,
          remarks,
          expiresAt : formattedDate,
        },
        { new: true } 
      );
  
      res.status(200).json({ msg: "Shortened link updated successfully.", link: updatedLink, success: true });
    } catch (error) {
      res.status(500).json({ msg: "Server error.", error, success: false });
    }
  });

linkRouter.post("/delete", authorization, async(req, res)=> {

        const id = req.body.linkId;
        const userId = req.userId;
        try{
        const deletedLink = await ShortUrl.findByIdAndDelete(id);
        if (!deletedLink) {
          return res.status(404).json({ msg: "Link not found", success:false });
        }
    

        await User.findByIdAndUpdate(userId, { $pull: { shortUrls: id } });
    
        res.status(200).json({ msg: "Link deleted successfully", success:true });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", success:false });
      }
})

linkRouter.get('/:shortId', async (req, res) => {
    try {
      const { shortId } = req.params;
      const urlEntry = await ShortUrl.findOne({ shortId });
      
      if (urlEntry) {
        urlEntry.clicks += 1;
        await urlEntry.save();
        return res.redirect(urlEntry.originalUrl);
      } else {
        return res.status(404).json({ error: 'URL not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  




export default linkRouter;
