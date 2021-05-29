import React from 'react';
import { OrderProp } from '../interfaces';
import DataTable from '../Pages/DataTable';
export interface SingleDealerProps {
  orders: {
    [dealer: string]: Array<OrderProp>;
  };
   currentDealer: string;
}
 
const SingleDealer: React.SFC<SingleDealerProps> = ({orders,currentDealer}) => {
    return (
      <DataTable
        rows={orders[currentDealer]}
        columns={[
          { field: "date", headerName: "Date", flex:1 },
          { field: "TTNO", headerName: "TTNO", flex:1 },
          { field: "Bill Qty", headerName: "QTY", flex:1 },
        ]}
        checkboxSelection={false}
      />
    );
}

 
export default SingleDealer;