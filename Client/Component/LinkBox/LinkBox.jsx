import React, { useState } from "react";
import "./LinkBox.css";
import axios from 'axios';

export default function LinkBox({setLinkBoxVisible, setLinkType, linkType, linkId}) {
  const [isExpirationEnabled, setIsExpirationEnabled] = useState(true);
  const [originalUrl, setOriginalUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const token = localStorage.getItem('token');
  const [error, setError] = useState(false);

  async function handleClick(){
    if(linkType === 'New'){
      createLink();
    }
    else if(linkType === 'Edit'){
      editLink();
    }
    else{

    }
  }

  async function createLink(){
    if(!originalUrl){
      setError(true);
      return;
    }
    try{
      const formattedExpirationDate = new Date(expirationDate).toISOString();
        const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/link`, {originalUrl, remarks, expiresAt :formattedExpirationDate}, {
            headers: {
                'Authorization': token
            }
        })
        if(data.success){
            alert("Link created successfully");
            setLinkBoxVisible(false);
        }
        else{
            alert(data.msg);
        }
    }
    catch(error){
        alert("Unexpected Error Occured");
    }
  }

  async function editLink(){
    if(!originalUrl){
      setError(true);
      return;
    }
    try{
      const formattedExpirationDate = new Date(expirationDate).toISOString();
        const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/link/edit`, {originalUrl, remarks, expiresAt :formattedExpirationDate, id : linkId}, {
            headers: {
                'Authorization': token
            }
        })
        if(data.success){
            alert("Link edited successfully");
            setLinkBoxVisible(false);
        }
        else{
            alert(data.msg);
        }
    }
    catch(error){
        alert("Unexpected Error Occured");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="headings">{`${linkType} Link`}</h2>
          <button className="close-btn" onClick={()=> setLinkBoxVisible(false)}>&times;</button>
        </div>

        <div className="modal-body">
          <label className="text" style={{fontSize:'0.9rem'}}>
            Destination URL <span className="required">*</span>
          </label>
          <input className={`text ${error ? "throwred" : ""}`} type="text" placeholder="https://web.whatsapp.com" value={originalUrl} onChange={(e)=> setOriginalUrl(e.target.value)} style={{width:'95%', fontSize:'0.8rem', marginBottom:'0px'}}/>
          {error ? <span className="text" style={{fontSize:"0.7rem", color: "red"}}>This field is mandatory</span>: <span style={{color:"white"}}>no</span>}

          <label className="text"  style={{fontSize:'0.9rem', marginTop:'10px'}}>
            Remarks <span className="required">*</span>
          </label>
          <textarea className="text" placeholder="Add remarks" value={remarks} onChange={(e)=> setRemarks(e.target.value)} style={{width:'95%', fontSize:'0.8rem'}}></textarea>

          <div className="expiration">
            <span className="text">Link Expiration</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isExpirationEnabled}
                onChange={() => setIsExpirationEnabled(!isExpirationEnabled)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {isExpirationEnabled && <input type="datetime-local" value={expirationDate} onChange={(e)=> setExpirationDate(e.target.value)} style={{width:'95%', fontSize:'0.8rem'}}/>}
        </div>

        <div className="modal-footer">
          <button className="clear-btn" onClick={()=> setLinkBoxVisible(false)}>Clear</button>
          <button className="create-btn" onClick={handleClick}>Create new</button>
        </div>
      </div>
    </div>
  );
}
