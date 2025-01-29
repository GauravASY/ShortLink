import React, { useState } from 'react'
import '../SignUp/SignUp.css'
import image from '../../src/assets/CoverImage.png'
import logo from '../../src/assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function SignIn() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        
        if(email==="" || password===""){
            alert('Please fill all the fields');
            return;
        }
        try {
            const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signin`, {email, password});
            if(data.success){
                localStorage.setItem('token', data.token);
                navigate("/");
            }
            else{
                console.log(data.msg);
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
                <h1 className='headings' style={{marginBottom:"80px"}}>Login</h1>              
                <input className='inputCell' type="email" placeholder='Email Id ' value={email} onChange={(e)=> setEmail(e.target.value)}/>
                <input className='inputCell' type="password" placeholder='Password ' value={password} onChange={(e)=> setPassword(e.target.value)}/>
                <button className='buttons text' onClick={handleSubmit}>Login</button>
                <span className='text' style={{textAlign:'center'}}>Don't have an account ? <Link to="/signup" >Sign Up</Link></span>
            </div>
        </div>
    </div>
  )
}

export default SignIn