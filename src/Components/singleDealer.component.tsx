import React from 'react';
import { Table } from "react-bootstrap";
export interface SingleDealerProps {
  orders: {
    [dealer: string]: Array<{
      "Bill Qty": number;
      Name: string;
      TTNO: string;
      "Tran. Date": string;
      email: string;
    }>;
  };
   currentDealer: string;
}
 
const SingleDealer: React.SFC<SingleDealerProps> = ({orders,currentDealer}) => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Trans. Date</th>
            <th>TTNO</th>
            <th>Qty</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {orders[currentDealer].map((order) => (
            <tr>
              <th>{order["Tran. Date"]}</th>
              <th>{order.TTNO}</th>
              <th>{parseFloat(order["Bill Qty"].toString()).toFixed(3)}</th>
              <th>{order.Name}</th>
            </tr>
          ))}
        </tbody>
      </Table>
    );
}
 
export default SingleDealer;