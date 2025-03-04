import React, { useState } from 'react'
import search from '../../src/assets/Frame.png'
import sun from '../../src/assets/Sun.png'
import { useNavigate } from 'react-router-dom';
import './Navbar.css'

function Navbar({setLinkBoxVisible, setLinkType, searchTerm, setSearchTerm, user}) {
    const [isDropdownVisible, setisDropdownVisible] = useState(false);
    const navigate = useNavigate();

    function handleClick(){
        setLinkBoxVisible(true);
        setLinkType("New");
    }

    function handlelogout(){
        localStorage.removeItem('token');
        navigate("/signin");
    }

    let date = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    date = date.toLocaleDateString('en-US', options);
  return (
    <div style={{display:'flex',alignItems:'center', padding:'10px' }}>
        <div style={{width:'40%', paddingLeft:'36px', display:'flex', gap:'8px'}}>
            <div>
                <img src={sun} alt="Sun" style={{height:'24px'}}/>
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
                <span className='headings'>{`Good Morning, ${user.username}`}</span>
                <span className='greyText'>{date}</span>
            </div>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'60%', padding:'0px 24px'}}>
            <button className='buttons text' onClick={handleClick}>+ Create new</button>
            <div style={{display:'flex', gap:'10px', alignItems:'center', position:'relative', marginLeft:'-8rem'}}>
                <img src={search} alt="Search Icon" style={{position:'absolute', left:'12px'}}/>
                <input type="text" placeholder='Search by remarks' className='inputCell' style={{paddingLeft:'36px', marginBottom:"0px"}} value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>
            </div>
            <div className="headings dropdownContainer" style={{display:'flex', justifyContent:'center', alignItems:'center', padding:'8px', borderRadius:'4rem', background:'#FDE48A', color:'#923E0E'}}
            onClick={()=> setisDropdownVisible(!isDropdownVisible)}
            >
                { user?.username?.split(' ').map(word => word[0].toUpperCase()).join('')}
            {isDropdownVisible && (
                <div className="dropdown">
                    <span className='text' style={{fontSize:"0.8rem"}} onClick={handlelogout}>Logout</span>
                </div>
            )}
            </div>
        </div>
    </div>
  )
}

export default Navbar