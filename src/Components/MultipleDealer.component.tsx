/* eslint-disable array-callback-return */
import React from "react";
import DataTable from "../Pages/DataTable";
import {uid} from "uid"
export interface MultipleDealerProps {
  dealers: Array<string>;
  groupOrders: Array<{
    "Bill Qty": number;
    Name: string;
    TTNO: string;
    "Tran. Date": string;
    email: string;
  }>;
  orders: {
    [dealer: string]: Array<{
      "Bill Qty": number;
      Name: string;
      TTNO: string;
      "Tran. Date": string;
      email: string;
    }>;
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
      id: uid(),
      "Tran. Date": order["Tran. Date"],
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
        { field: "Tran. Date", headerName: "Date", flex: 1 },
        { field: "TTNO", headerName: "TTNO", flex: 1 },
        ...dealers.map((dealer) => {
          console.log(dealer, "columns");
          return { field: dealer, headerName: dealer, flex: 1 };
        }),
      ]}
    />
  );
};

export default MultipleDealer;
