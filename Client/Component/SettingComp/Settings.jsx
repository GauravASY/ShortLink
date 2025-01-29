import React, { useState } from 'react'
import './Settings.css'
import axios from 'axios'

function Settings({setBoxVisible, user, setDeleteAcc}) {
  const token = localStorage.getItem('token');

  const [formdata, setformdata] = useState({
    name : user.username || "",
    email : user.email || "",
    mobile : user.mobileNo || ""
  })

  async function handleSubmit(){
    if(formdata.name === "" && formdata.email === "" && formdata.mobile === ""){
      return;
    }
    const { data } = await axios.post(
  `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/edit`,
  {
    name: formdata.name,
    email: formdata.email,
    mobileNo: formdata.mobile,
  },
  {
    headers: {
      Authorization: token, // Ensure the token is prefixed with "Bearer"
    },
  }
);
    if(data.success){
      alert("Changes Saved Successfully");
    }
    else{
      alert(data.msg);
    }
    setformdata({name: "", email: "", mobile: ""});
  }

  async function handleDelete(){
    setBoxVisible(true);
    setDeleteAcc(true);
  }

  return (
    <div className='settingContainer'>
      <div className='InputContainer'>
        <span  className='text labelText'>Name</span>
        <input type="text" id="Name" value={formdata.name} placeholder="John Doe" className='settingInput' onChange={(e)=> setformdata({...formdata, name : e.target.value})}/>
      </div>
      <div className='InputContainer'>
        <span  className='text labelText'>Email Id</span>
        <input type="email" id="Email" value={formdata.email} placeholder='example@gmail.com' className='settingInput' onChange={(e)=> setformdata({...formdata, email : e.target.value})}/>
      </div>
      <div className='InputContainer'>
        <span  className='text labelText'>Mobile No.</span>
        <input type="tel" id="Mobile" value={formdata.mobile} placeholder='8888888888' className='settingInput' onChange={(e)=> setformdata({...formdata, mobile : e.target.value})}/>
      </div>
      <div className='InputContainer' style={{marginTop:'40px'}}>
        <button className='buttons text' style={{width:'100%'}} onClick={handleSubmit}>Save Changes</button>
      </div>
      <div className='InputContainer'>
        <button className='buttons text' style={{background:'#EB0D0D', width:'100%'}} onClick={handleDelete}>Delete Account</button>
      </div>
    </div>
  )
}

export default Settings