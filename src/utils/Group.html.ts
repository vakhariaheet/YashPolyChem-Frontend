import { OrderProp } from "../interfaces";

interface GroupProp {
  Sum: (arr: Array<number>) => number | string;
  orders: {
    [dealer: string]: Array<OrderProp>;
  };
  dealers: Array<string>;
  groupOrders: Array<OrderProp>;
}
const Group = ({ Sum, orders, dealers, groupOrders }: GroupProp) => {
  const dateFilter: {
    [date: string]: Array<number>;
  } = {};
  dealers.map((dealer, i) =>
    orders[dealer].map((order) => {
      if (!dateFilter[order.date]) {
        dateFilter[order.date] = [0, 0, 0];
      }
      return (dateFilter[order.date][i] =
        dateFilter[order.date][i] || 0 + Number(order["Bill Qty"]));
    })
  );

  return `
        <html>
        <head>
        <style>
        table {
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        </style>
        </head>
        <body>
        <table>
          <tr>
            <th>Trans. Date</th>
             <th>TTNO</th>
              ${dealers
                .map(
                  (dealer) => `
              <th>${dealer}</th>
              `
                )
                .join("")}
          </tr>
          
          ${groupOrders
            .map(
              (order) => `
            <tr>
             <td>${order.date}</td>
            <td>${order["TTNO"]}</td>
           ${dealers
             .map((_, i) => {
               if (i === dealers.indexOf(order["Name"])) {
                 return `<td>${parseFloat(order["Bill Qty"].toString()).toFixed(
                   3
                 )}</td>`;
               } else {
                 return `<td>0.000</td>`;
               }
             })
             .join("")}
            </tr>
          `
            )
            .join("")}
          <tr>
              <td></td>
              <td>total</td>
              ${dealers
                .map(
                  (dealer) => `
                  <td>${Sum(
                    orders[dealer].map((order) => Number(order["Bill Qty"]))
                  )}</td>
        `
                )
                .join("")}
          </tr>
        </table>
        <h3>Summary</h3>
        <table>
          <tr>
            <th>Trans. Date</th>
            ${dealers
              .map(
                (dealer) => `
              <th>${dealer}</th>
              `
              )
              .join("")}
              <th>total</th>
          </tr>
          ${Object.keys(dateFilter)
            .map(
              (date) => `
          <tr>
          <td>${date}</td>
          ${dateFilter[date]
            .map(
              (total) => `<td>${parseFloat(total.toString()).toFixed(3)}</td>`
            )
            .join("")}
            <td>${Sum(dateFilter[date])}</td>
          </tr>
          `
            )
            .join("")}
          <tr>
              <td>total</td>
              ${dealers
                .map((dealer) => {
                  return `
                  
                  <td>${Sum(
                    orders[dealer].map((order) => Number(order["Bill Qty"]))
                  )}</td>
        `;
                })
                .join("")}
                <td>${Sum(
                  dealers.map((dealer) =>
                    Number(
                      Sum(
                        orders[dealer].map((order) => Number(order["Bill Qty"]))
                      )
                    )
                  )
                )}</td>
                
          </tr>
        </table>
        </body>
        </html>
        `;
};

export default Group;
