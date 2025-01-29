import { useEffect, useState } from 'react'
import './App.css'
import Navbar from '../Component/Navbar/Navbar'
import logo from '../src/assets/logo.png'
import dashboard from '../src/assets/dashboard.png'
import link from '../src/assets/link.png'
import setting from '../src/assets/setting.png'
import analytics from '../src/assets/analytics.png'
import dashboard2 from '../src/assets/dashboardtwo.png'
import link2 from '../src/assets/linktwo.png'
import setting2 from '../src/assets/settingtwo.png'
import analytics2 from '../src/assets/analyticstwo.png'
import Dashboard from '../Component/Dashboard/Dashboard'
import Link from '../Component/Link/Link'
import Analytics from '../Component/Analytics/Analytics'
import Settings from '../Component/SettingComp/Settings'
import ConfirmBox from '../Component/ConfirmBox/ConfirmBox'
import LinkBox from '../Component/LinkBox/LinkBox'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function App() {
  const [selected , setSelected] = useState('Dashboard');
  const navigate = useNavigate();
  const [boxVisible, setBoxVisible] = useState(false);
  const [linkBoxVisible, setLinkBoxVisible] = useState(false);
  const [linkType, setLinkType] = useState("");
  const [linkId, setLinkId] = useState("");
  const [user, setUser] = useState({});
  const [deleteAcc, setDeleteAcc] = useState(false);
  const token = localStorage.getItem('token');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(()=>{
    if(!token){
      navigate("/signup")
    }
  }, [token])

  useEffect(()=>{
    getUser();
  },[token])

  async function getUser(){
    const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/getuser`, {
      headers: {
        'Authorization': token
      }
    })
    if(data.success){
      setUser(data.user);
    }
    else{
      console.log(data.msg);
    }
  }
  const dataComponent = {
    Dashboard : <Dashboard/>,
    Link : <Link setBoxVisible={setBoxVisible} setLinkBoxVisible={setLinkBoxVisible} setLinkType={setLinkType} setLinkId={setLinkId} searchTerm={searchTerm}/>,
    Analytics : <Analytics/>,
    Settings : <Settings setBoxVisible={setBoxVisible} user={user} setDeleteAcc={setDeleteAcc}/>
  }

  return (
    <div style={{display:"flex", height:'100%', width:'100%'}}>
      <div className='Sidebar'>
        <div style={{padding:'11px', display:'flex',paddingLeft:'40px', alignItems:'center'}}>
          <img src={logo} alt="Logo" />
        </div>
        <div style={{display:'flex', flexDirection:'column', padding:'40px 20px 12px 20px'}}>
          <div className='LinkContainer' style={selected == 'Dashboard' ? {background:'#EFF6FF'}:{}} onClick={()=> setSelected('Dashboard')}>
            {
              selected === 'Dashboard' ? <img src={dashboard2} alt="Dashboard" /> : <img src={dashboard} alt="Dashboard" />
            }
            <span className='text' style={selected === 'Dashboard' ? {color : '#1B48DA'}:{}}>Dashboard</span>
          </div>
          <div className='LinkContainer' style={selected === 'Link' ? {background:'#EFF6FF'}:{}} onClick={()=> setSelected('Link')}> 
            {
              selected === 'Link' ? <img src={link2} alt="Link" /> : <img src={link} alt="Link" />
            }
            
            <span className='text' style={selected === 'Link' ? {color : '#1B48DA'}:{}}>Link</span>
          </div>
          <div className='LinkContainer' style={selected === 'Analytics' ? {background:'#EFF6FF'}:{}} onClick={()=> setSelected('Analytics')}>
            {
              selected === 'Analytics' ?  <img src={analytics2} alt="Analytics" /> :  <img src={analytics} alt="Analytics" />
            }
            <span className='text' style={selected === 'Analytics' ? {color : '#1B48DA'}:{}}>Analytics</span>
          </div>
        </div>
        <div style={{padding:'0 20px', marginTop:'40px'}}>
        <div className='LinkContainer' style={selected === 'Settings' ? {background:'#EFF6FF'}:{}} onClick={()=> setSelected('Settings')}>
            {
              selected === 'Settings' ? <img src={setting2} alt="Settings" /> : <img src={setting} alt="Settings" />
            }     
          <span className='text' style={selected === 'Settings' ? {color : '#1B48DA'}:{}}>Settings</span>
        </div>
        </div>
      </div>
      <div className='MainContainer'>
          <Navbar setLinkBoxVisible={setLinkBoxVisible} setLinkType={setLinkType} searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user}/>
          <div className="DataContainer">
              {
                dataComponent[selected]
              }
              {
                boxVisible ? <ConfirmBox setBoxVisible={setBoxVisible} linkId={linkId} deleteAcc={deleteAcc} setDeleteAcc={setDeleteAcc} /> : null  
              }
              {
                linkBoxVisible ? <LinkBox setLinkBoxVisible={setLinkBoxVisible} setLinkType={setLinkType} linkType={linkType} linkId={linkId}/> : null
              }
          </div>
      </div>
    </div>
  )
}

export default App
