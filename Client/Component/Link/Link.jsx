import React, { useEffect, useState } from "react";
import "./Link.css"; 
import del from '../../src/assets/delete.png';
import edit from '../../src/assets/edit.png';
import copy from '../../src/assets/copy.png';
import axios from 'axios';

const Link = ({setBoxVisible, setLinkBoxVisible, setLinkType, setLinkId, searchTerm}) => {
  const token = localStorage.getItem('token');
  const [links , setLinks] = useState([]);

  useEffect(()=>{
    getLinks();
  },[token])


  function handleEditClick(linkId){
    setLinkBoxVisible(true);
    setLinkType("Edit");
    setLinkId(linkId);
  }

  function handleDeleteClick(linkId){
    setBoxVisible(true);
    setLinkId(linkId);
  }

  async function getLinks(){
    try {
      const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/links`, {
        headers: {
          'Authorization': token
        }
      })
      if(data.success){
          setLinks(data.links);
      }
      else{
          console.log(data.msg);
      }
    }
    catch (error) {
      alert("Unexpected Error Occured");
    }
  };
  
  const filteredLinks = links.filter(link => 
    link.remarks?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Original Link</th>
            <th>Short Link</th>
            <th>Remarks</th>
            <th>Clicks</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          { filteredLinks.length > 0 && filteredLinks?.map((link, index) => (
            <tr key={index}>
              <td>{new Date(link.createdAt).toLocaleString('en-US', { 
  month: 'short', 
  day: '2-digit', 
  year: 'numeric', 
  hour: '2-digit', 
  minute: '2-digit', 
  hour12: false 
}).replace(',', '')}</td>

              <td>
                <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
                  {link.originalUrl}
                </a>
              </td>
              <td >
                <a href={`${window.location.origin}/api/v1/link/${link.shortId}`} target="_blank" rel="noopener noreferrer">
                  {link.shortId}
                </a>
                <img src={copy} alt="Copy" onClick={() => navigator.clipboard.writeText(link.shortId)}/>
              </td>
              <td>{link.remarks}</td>
              <td>{link.clicks}</td>
              <td>
                <span
                  className={`status ${
                    link.status === "Active" ? "active" : "inactive"
                  }`}
                >
                  {link.status}
                </span>
              </td>
              <td className="action-buttons">
                <img src={edit} alt= "Edit" onClick={()=>handleEditClick(link.id)}/>
                <img src={del} alt= "Delete" onClick={(e)=>handleDeleteClick(link.id)}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Link;
