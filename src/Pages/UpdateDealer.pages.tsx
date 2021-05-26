import React, { useEffect,useReducer } from 'react'
import {useHistory, useParams} from "react-router-dom"
import DealerForm from '../Components/DealerForm.component'
export interface UpdateDealerProps {
    
}
 
const UpdateDealer: React.SFC<UpdateDealerProps> = () => {
    const { dealer:dealerID } = useParams<{ dealer: string }>();
const dealerReducer = (
  state: { id: string; name: string; email: string; _id?: "" },
  action: {
    type: string;
    payloadValue: string | { id: string; name: string; email: string };
  }
) => {
  const { type, payloadValue } = action;
  if (type === "ALL" && typeof payloadValue !== "string") return payloadValue;
  return { ...state, [type.toLowerCase()]: payloadValue };
};
const [dealer, setDealer] = useReducer(dealerReducer, {
  id: "",
  name: "",
email: "",
  
});
    const history = useHistory();
    useEffect(() => {
        fetch(`http://localhost:5000/dealers/${dealerID}`)
          .then((response) => response.json())
            .then((data) => {
                setDealer({ type: "ALL", payloadValue: data });
                
          });
    }, [])
    const onUpdate = () => {
        fetch("http://localhost:5000/dealers/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dealer,
          }),
        })
          .then((response) => response.json())
          .then(() => history.push("/dealers"));
    }
    return (
        <DealerForm dealer={dealer} setDealer={setDealer} onClick={onUpdate}/>
     );
}
 
export default UpdateDealer;