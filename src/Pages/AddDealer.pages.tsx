import React, { useReducer,useState } from 'react'
import DealerForm from '../Components/DealerForm.component';
import {useHistory} from "react-router-dom"
export interface AddDealerProps {
    
}
 
const AddDealer: React.SFC<AddDealerProps> = () => {
  const dealerReducer = (state: { id: string, name: string, email: string }, action: { type: string, payloadValue: string }) => {
    const { type, payloadValue } = action;
    return { ...state, [type.toLowerCase()]: payloadValue };
  }
  const [err,setErr]= useState(false)
  const [dealer, setDealer] = useReducer(dealerReducer,{
    id: "",
    name: "",
    email:""
  })
  const history = useHistory();
  const onClick = () => {
    fetch("https://enigmatic-woodland-79956.herokuapp.com/add/dealer", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({dealer})
    }).then(response => {
      if (response.status === 500) return setErr(true);
      return history.push("/dealers")
    });
  }
    return (
      <DealerForm dealer={dealer} setDealer={setDealer} onClick={onClick} err={err} />
    );
}
 
export default AddDealer;