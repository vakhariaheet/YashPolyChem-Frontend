/* eslint-disable array-callback-return */
import React from "react";
import DataTable from "../Pages/DataTable";
import { OrderProp } from '../interfaces';
export interface MultipleDealerProps {
  dealers: Array<string>;
  groupOrders: Array<OrderProp>;
  orders: {
    [dealer: string]: Array<OrderProp>;
  };
  Sum: (arr: Array<number>) => string;
}

const MultipleDealer: React.SFC<MultipleDealerProps> = ({
  orders,
  dealers,
  groupOrders,
  Sum,
}) => {
  const rows = groupOrders.map((order) => {
    const row: { [coulumn: string]: string | number } = {
      ...order,
      TTNO: order.TTNO,
    };
    dealers.map((dealer, i) => {
      if (i === dealers.indexOf(order["Name"])) {
        row[dealer] = order["Bill Qty"];
        return;
      } else {
        row[dealer] = 0.0;
        return;
      }
    });

    return row;
  });
  return (
    <DataTable
      rows={rows}
      columns={[
        { field: "date", headerName: "Date", flex: 1 },
        { field: "TTNO", headerName: "TTNO", flex: 1 },
        ...dealers.map((dealer) => {
        
          return { field: dealer, headerName: dealer, flex: 1 };
        }),
      ]}
    />
  );
};

export default MultipleDealer;
