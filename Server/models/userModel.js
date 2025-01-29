import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNo: {
        type: Number,
        required: true
    },
    shortUrls: [
        {
            type: Schema.Types.ObjectId,
            ref: "ShortUrl"  
        }
    ]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
