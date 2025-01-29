import {z} from 'zod';

const SignUpInputSchema = z.object({
    username : z.string().min(3).max(255),
    email : z.string().email().min(3).max(255),
    password : z.string().min(5, 'Password too short').max(255),
    mobileNo : z.string().min(10).max(10),
});

const SignInInputSchema = z.object({
    email : z.string().email().min(3).max(255),
    password : z.string().min(5, 'Password too short').max(255),
})

export function validateSignUpInput(req, res, next){
    try{
        SignUpInputSchema.safeParse(req.body).success ? next() : res.json({msg : "Invalid Input", success: false});
    }
    catch(error){
        return res.json({msg : "Error Occured", success: false});
    }
}   

export function validateSignInInput(req, res, next){
    try{
        SignInInputSchema.safeParse(req.body).success ? next() : res.json({msg : "Invalid Input", success: false});
    }
    catch(error){
        return res.json({msg : "Error Occured", success: false});
    }
}   