import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { validateSignInInput, validateSignUpInput } from '../middlewares/validation.js'
import jwt from 'jsonwebtoken'
import authorization from '../middlewares/authorization.js'
import User from '../models/userModel.js'

const userRouter = express.Router();

userRouter.post("/signup", validateSignUpInput, async (req, res)=>{
    const {username, email, password, mobileNo} = req.body;

    try {
        const user = await User.findOne({email: email});
    if(user){
        return res.json({msg : "User already present", success:false});
    }

    const hashedPassword = bcrypt.hashSync(password, 12);
    const newUser = new User({
        username : username,
        email: email,
        password: hashedPassword,
        mobileNo: mobileNo
    })

    await newUser.save();
    return res.json({msg : "Sign-Up Successful", user : newUser, success: true});
    } catch (error) {
        return res.json({msg : "Error", success: false});
    }
})

userRouter.post("/signin", validateSignInInput, async (req, res)=>{
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email: email});
    if(!user){
        return res.json({msg : "User not present", success:false});
    }

    const passwordCheck = bcrypt.compareSync(password, user.password);
    if(passwordCheck){
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        return res.json({msg : "Sign-In Successful", token:token, success: true});
    }
    else{
        return res.json({msg : "Incorrect Password", success: false});
    }
    } catch (error) {
        return res.json({msg : "Error", success: false});
    }
})

userRouter.get("/links", authorization, async (req, res)=>{
    const id = req.userId;
    try {
        const user = await User.findById(id).populate('shortUrls');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const links = user.shortUrls.map(link => {
            let status = "Active";
            if (link.expiresAt < new Date()) {
                status = "InActive";
            }
            
            return ({
            id: link._id,
            createdAt: link.createdAt,
            originalUrl: link.originalUrl,
            shortId: link.shortId,
            remarks: link.remarks,
            clicks: link.clicks,
            status: status
        })});

        res.json({ success: true, links });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

userRouter.get("/analytics", authorization, async (req, res)=>{
    const id = req.userId;
    try {
        const user = await User.findById(id).populate('shortUrls');
        if (!user) {
            return res.status(404).json({ msg: 'User not found', success: false });
        }

        const links = user.shortUrls.map(link => 
            
             ({
            createdAt: link.createdAt,
            originalUrl: link.originalUrl,
            shortId: link.shortId,
            ipAddress: link.ipAddress,
            userDevice: link.userDevice,
        }));

        res.json({ success: true, links, msg:"Analytics fetched Successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message, success: false });
    }
})

userRouter.post("/edit", authorization, async (req, res) => {
    const userId =req.userId;
    const {name, email, mobileNo} = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(name !== undefined){
            user.username = name;
        }
        if(email !== undefined){
            user.email = email;
        }
        if(mobileNo !== undefined){
            user.mobileNo = mobileNo;
        }

        await user.save();
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

userRouter.get("/getuser", authorization, async (req, res) => {
    const userId =req.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found', success:false });
        }
        res.json({ success: true, user, msg : "User found" });
    } catch (err) {
        res.status(500).json({ msg: err.message, success:false });
    }
})

userRouter.delete("/deleteAcc", authorization, async(req, res)=>{
    const userId = req.userId;

    try {
        const user = await User.findByIdAndDelete(userId);
        if(!user){
           return res.json({msg:"No such user", success:false});
        }
        return res.json({msg : "Account Deleted", success: true})
    } catch (error) {
        return res.json({msg : "Server Error", success : false})
    }
})

userRouter.get('/dashboard',authorization, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId)
            .populate({
                path: 'shortUrls',
                model: 'ShortUrl',
                options: { sort: { createdAt: -1 } }
            });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const urlsData = user.shortUrls.map(url => ({
            id: url._id,
            originalLink: url.originalUrl,
            shortLink: url.shortId,
            clicks: url.clicks,
            createdAt: url.createdAt,
            expiresAt: url.expiresAt,
            remarks: url.remarks,
            deviceInfo: {
                ipAddress: url.ipAddress,
                device: url.deviceType
            }
        }));

        const totalClicks = urlsData.reduce((sum, url) => sum + url.clicks, 0);
        const last4Days = [...Array(4)].map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - index);
            return date;
        });

        const dateWiseClicks = last4Days.map(date => {
            const dateStr = date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            });
            const clicks = user.shortUrls.reduce((sum, url) => {
                if (new Date(url.createdAt).toDateString() === date.toDateString()) {
                    return sum + url.clicks;
                }
                return sum;
            }, 0);

            return {
                date: dateStr,
                clicks: clicks
            };
        });

        const deviceCounts = user.shortUrls.reduce((acc, url) => {
            const device = url.userDevice || 'Unknown';
            acc[device] = (acc[device] || 0) + url.clicks;
            return acc;
        }, {});

        const deviceClicks = Object.entries(deviceCounts).map(([device, clicks]) => ({
            device,
            clicks
        }));

        const analytics = {
            totalClicks,
            dateWiseClicks,
            deviceClicks
        };

        res.json({
            success: true,
            data: {
                urls: urlsData,
                analytics: analytics,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error fetching dashboard data'
        });
    }
});

export default userRouter;