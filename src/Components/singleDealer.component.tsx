import React from 'react';
import { uid } from "uid";
import DataTable from '../Pages/DataTable';
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
      <DataTable
        rows={orders[currentDealer].map((order) => {
          return {
            ...order,
            id: uid(),
            "Bill Qty": order["Bill Qty"],
          };
        })}
        columns={[
          { field: "Tran. Date", headerName: "Date", flex:1 },
          { field: "TTNO", headerName: "TTNO", flex:1 },
          { field: "Bill Qty", headerName: "QTY", flex:1 },
        ]}
        checkboxSelection={false}
      />
    );
}

 
export default SingleDealer;