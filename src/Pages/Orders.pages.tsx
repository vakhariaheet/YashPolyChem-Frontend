import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";
import { CircularProgress, Backdrop,Grid,Button } from "@material-ui/core";
import { GridSelectionModelChangeParams } from "@material-ui/data-grid";
import EmailPreview from "../Components/EmailPreview.components";
import { OrderProp } from "../interfaces";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
export interface OrdersProps {}
const Orders: React.SFC<OrdersProps> = () => {
  const [orders, setOrders] = useState<Array<OrderProp>>([]);
  const [dealersInfo, setDealersInfo] = useState<{
    [dealer: string]: {
      _id: string;
      id: string;
      name: string;
      email: string;
      order: number;
    };
  }>({});
  const [currentDealer, setCurrentDealer] = useState("");
  const [filteredRows, setFilteredRows] = useState<{
    [dealer: string]: OrderProp[];
  }>({});
  const [date, setDate] = useState({
    up: "",
    low: "",
  });
  
  useEffect(() => {
    fetch("https://enigmatic-woodland-79956.herokuapp.com/orders")
      .then((response) => response.json())
      .then(({orders,upperDate,lowerDate}) => {
        setOrders(orders);
         setDate({ low: lowerDate, up: upperDate });
      });
    fetch("https://enigmatic-woodland-79956.herokuapp.com/dealers")
      .then((response) => response.json())
      .then((dealers) => {
        const dealersInfo: {
          [dealer: string]: {
            _id: string;
            id: string;
            name: string;
            email: string;
            order: number;
          };
        } = {};
        dealers.forEach((dealer: any) => {
          dealersInfo[dealer.name] = dealer;
        });
        setDealersInfo(dealersInfo);
      });
  }, []);
  const onClick = () => {
    fetch(`https://enigmatic-woodland-79956.herokuapp.com/orders?lt=${date.low}&gt=${date.up}`)
      .then((response) => response.json())
      .then((data) => {
        const {orders,lowerDate,upperDate} = data
        setDate({ low: lowerDate, up: upperDate });
        setOrders(orders)
        const filteredOrders: {
          [dealer: string]: OrderProp[];
        } = {};
        const dI = dealersInfo;
        
        Object.keys(dealersInfo).forEach((dealer) => {
          const Orders = orders.filter(
            (order:OrderProp) => order.Name === dealersInfo[dealer].name
          ).map((order:OrderProp) => {
            const date = new Date(order.date);
            return {
              ...order,
              date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
            };
          });
          filteredOrders[dealer] = Orders;
          dI[dealer] = {
            ...dealersInfo[dealer],
            order: Orders.length,
          };
        });
         
        setFilteredRows(filteredOrders);
        setCurrentDealer("CHEMIE");
      });
  
  }

  if (!orders) {
    return (
      <Backdrop open={orders === undefined}>
        <CircularProgress color="secondary" />
      </Backdrop>
    );
  }
  const onRowSelect = (param: GridSelectionModelChangeParams) => {
    const filteredOrders: {
      [dealer: string]: OrderProp[];
    } = {};
    const dI = dealersInfo;
    Object.keys(dealersInfo).forEach((dealer) => {
      const Orders = orders.filter(
        (order) =>
          param.selectionModel.indexOf(order.id) !== -1 &&
          order.Name === dealersInfo[dealer].name
      );
      filteredOrders[dealer] = Orders.map((order: OrderProp) => {
        const date = new Date(order.date);
        return {
          ...order,
          date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        };
      });
      dI[dealer] = {
        ...dealersInfo[dealer],
        order: Orders.length,
      };
    });
    
    setCurrentDealer(Object.keys(filteredOrders)[0]);
    setFilteredRows(filteredOrders);
  };
  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="center" alignItems="center">
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-inline"
            
            value={date.low}
            onChange={(value) =>
              setDate((prevDate) => {
                if (!value) return prevDate;
                return {
                  ...prevDate,
                  low: `${value.getFullYear()}-${
                    value.getMonth() + 1
                  }-${value.getDate()}`,
                };
              })
            }
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            
            value={date.up}
            onChange={(value) =>
              setDate((prevDate) => {
                if (!value) return prevDate;
                return {
                  ...prevDate,
                  up: `${value.getFullYear()}-${
                    value.getMonth() + 1
                  }-${value.getDate()}`,
                };
              })
            }
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <Button variant="contained" color="secondary" onClick={onClick}>
            Fetch
          </Button>
        </Grid>
      </MuiPickersUtilsProvider>
      <DataTable
        columns={[
          { field: "date", headerName: "Date", flex: 1 },
          { field: "TTNO", headerName: "TTNO", flex: 1 },
          { field: "Bill Qty", headerName: "QTY", flex: 1 },
          { field: "Name", headerName: "Name", flex: 1 },
        ]}
        rows={orders.map((order:OrderProp) => {
          const date = new Date(order.date);
            return {
              ...order,
              date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
            };
        })}
        checkboxSelection={true}
        height={700}
        onSelectionModelChange={onRowSelect}
      />
      {filteredRows && currentDealer && (
        <EmailPreview
          orders={filteredRows}
          currentDealer={currentDealer}
          dealersInfo={dealersInfo}
          setCurrentDealer={setCurrentDealer}
        />
      )}
    </>
  );
};

export default Orders;
