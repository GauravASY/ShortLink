import React from 'react'
import search from '../../src/assets/Frame.png'
import sun from '../../src/assets/Sun.png'

function Navbar({setLinkBoxVisible, setLinkType, searchTerm, setSearchterm}) {

    function handleClick(){
        setLinkBoxVisible(true);
        setLinkType("New");
    }

  return (
    <div style={{display:'flex',alignItems:'center', padding:'10px' }}>
        <div style={{width:'40%', paddingLeft:'36px', display:'flex', gap:'8px'}}>
            <div>
                <img src={sun} alt="Sun" style={{height:'24px'}}/>
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
                <span className='headings'>Good Morning, Gaurav</span>
                <span className='greyText'>8th June, 2024</span>
            </div>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'60%', padding:'0px 24px'}}>
            <button className='buttons text' onClick={handleClick}>+ Create new</button>
            <div style={{display:'flex', gap:'10px', alignItems:'center', position:'relative', marginLeft:'-8rem'}}>
                <img src={search} alt="Search Icon" style={{position:'absolute', left:'12px'}}/>
                <input type="text" placeholder='Search by remarks' className='inputCell' style={{paddingLeft:'36px'}} value={searchTerm} onChange={(e)=> setSearchterm(e.target.value)}/>
            </div>
            <div className="headings" style={{display:'flex', justifyContent:'center', alignItems:'center', padding:'8px', borderRadius:'4rem', background:'#FDE48A', color:'#923E0E'}}>
                GY
            </div>
        </div>
    </div>
  )
}

export default Navbar