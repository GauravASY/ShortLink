import React from "react";
import {useNavigate} from 'react-router-dom'
import "./ConfirmBox.css";
import cross from "../../src/assets/cross.png";
import axios from 'axios'

function ConfirmBox({setBoxVisible, linkId, deleteAcc, setDeleteAcc}) {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
    function handleNo() {
        setBoxVisible(false);
        setDeleteAcc(false);
    }

    function handleYes() {
        if(deleteAcc === true){
          handleDeleteAcc();
          setDeleteAcc(false);
        }
        else{
        handleDelete(linkId);
        }
        setBoxVisible(false);
    }

    async function handleDeleteAcc(){
      try{
        const {data} = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/deleteAcc`, {
          headers : {
            'Authorization' : token
          }
        })
        if(data.success){
          alert("Account Deleted");
          localStorage.removeItem('token');
          navigate("/signup");
        }
        else{
          alert("Unexpected error, Try again");
        }
      }
        catch(e){
          alert("Error");
        }
    }

    async function handleDelete(linkId){
      try{
        const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/link/delete`, {linkId}, {
          headers : {
            'Authorization' : token
          }
        })
        if(data.success){
          alert("link successfully Deleted");
        }
        else{
          alert("Unexpected error, Try again");
        }
      }
        catch(e){
          alert("Error");
        }
    }
  return (
    <div className="dialog-overlay" onClick={()=> setBoxVisible(false)}>
      <div className="dialog-box">
        <p className="text">Are you sure, you want to remove it?</p>
        <div className="dialog-actions">
          <button className="dialog-button no-button" onClick={handleNo}>
            NO
          </button>
          <button className="dialog-button yes-button" onClick={handleYes}>
            YES
          </button>
        </div>
        <img src={cross} alt="cross" style={{position:'absolute', top:'15px', right:'20px'}} onClick={()=> setBoxVisible(false)}/>
      </div>
    </div>
  );
}

export default ConfirmBox;
