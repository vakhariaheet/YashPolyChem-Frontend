import React, { useReducer } from 'react'
import { Container,Form,Button } from 'react-bootstrap';
import DealerForm from '../Components/DealerForm.component';
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
    return (
      <DealerForm dealer={dealer} setDealer={setDealer} onClick={() => console.log("hello")} />
    );
}
 
export default AddDealer;