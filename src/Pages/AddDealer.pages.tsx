import React, { useReducer } from 'react'
import DealerForm from '../Components/DealerForm.component';
import {useHistory} from "react-router-dom"
export interface AddDealerProps {
    
}
 
const AddDealer: React.SFC<AddDealerProps> = () => {
  const dealerReducer = (state: { id: string, name: string, email: string }, action: { type: string, payloadValue: string }) => {
    const { type, payloadValue } = action;
    return { ...state, [type.toLowerCase()]: payloadValue };
  }
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
    }).then(() =>history.push("/dealers"));
  }
    return (
      <DealerForm dealer={dealer} setDealer={setDealer} onClick={onClick} />
    );
}
 
export default AddDealer;