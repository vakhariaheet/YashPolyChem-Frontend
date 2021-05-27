import React,{useEffect,useState} from 'react'
import DataTable from './DataTable';
import {CircularProgress ,Backdrop} from "@material-ui/core"
export interface OrdersProps {
    
}
 
const Orders: React.SFC<OrdersProps> = () => {
    const [orders, setOrders] =
      useState<
        Array<{
          "Bill Qty": number;
          Name: string;
          TTNO: string;
        "Tran. Date": string;
        }>
            >();
    useEffect(() => {
        fetch("https://enigmatic-woodland-79956.herokuapp.com/orders").then((response) =>response.json()).then((orders)=> setOrders(orders));
    },[])
    if (!orders) {
        return (
          <Backdrop open={orders === undefined}>
            <CircularProgress color="secondary" />
          </Backdrop>
        );
    }
    return (
      <DataTable
        columns={[
          { field: "Tran. Date", headerName: "Date", flex: 1 },
          { field: "TTNO", headerName: "TTNO", flex: 1 },
          { field: "Bill Qty", headerName: "QTY", flex: 1 },
          { field: "Name", headerName: "Name", flex: 1 },
        ]}
        rows={orders}
        checkboxSelection={true}
        height={700}
      />
    );
}
 
export default Orders;