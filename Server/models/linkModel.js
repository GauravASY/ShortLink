import mongoose from "mongoose";
import shortid from "shortid";

const shortUrlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortId: { type: String, default: shortid.generate, unique: true },
    clicks: { type: Number, default: 0 },
    expiresAt: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    remarks: { type: String, default: "No Remarks" },
    ipAddress: { type: String, default: ""},
    userDevice: { type: String, default: ""},
});

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);
export default ShortUrl;
