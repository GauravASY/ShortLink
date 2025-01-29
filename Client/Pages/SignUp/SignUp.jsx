import React, {useState} from 'react'
import './SignUp.css'
import image from '../../src/assets/CoverImage.png'
import logo from '../../src/assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'


function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email :"",
        mobileNo:"",
        password:"",
        confirmPassword:""
    })

   async function handleSubmit(){
        if(formData.password === '' || formData.confirmPassword === '' || formData.email === '' || formData.mobileNo === '' || formData.username === ''){
            alert('Please fill all the fields');
            return;
        }
        if(formData.password !== formData.confirmPassword){
            alert('Password and Confirm Password do not match');
            return;
        }
        try {
            const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signup`, formData);
            if(data.success){
                navigate("/signin");
            }
            else{
                console.log(data);
            }
        } catch (error) {
            alert("Unexpected Error Occured");
        }

    }


  return (
    <div style={{width:'100%', height:'100%', display: 'flex'}}>
        <div style={{width:'45%', position:'relative'}}>
            <img src={image} alt="Cover Image" style={{width:'100%', height:'100%', objectfit:'cover'}}/>
            <img src={logo} alt="Logo" style={{position:'absolute', top:'20px', left:'20px'}}/>
        </div>
        <div style={{width:'55%', display: 'flex', flexDirection:'column', padding:'20px 80px 0 100px'}}>
            <div style={{display: 'flex', justifyContent:'end', gap:'26px', marginBottom:'60px'}}>
                <span className='text' style={{display:'flex', alignItems:'center'}}>Sign Up</span>
                <button className='buttons text'>Login</button>
            </div>
            <div style={{ display: 'flex', flexDirection:'column', gap:"24px", padding:'0 70px 0 0'}}>
                <h1 className='headings'>Join us Today !</h1>
                <input className='inputCell' type="text" placeholder='Name ' value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}/>
                <input className='inputCell' type="email" placeholder='Email Id ' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
                <input className='inputCell' type="number" placeholder='Mobile No. ' value={formData.mobileNo} onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}/>
                <input className='inputCell' type="password" placeholder='Password ' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
                <input className='inputCell' type="password" placeholder='Confirm Password ' value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}/>
                <button className='buttons text' onClick={handleSubmit}>Register</button>
                <span className='text' style={{textAlign:'center'}}>Already have an account ? <Link to="/signin" >Login</Link></span>
            </div>
        </div>
    </div>
  )
}

export default SignUp