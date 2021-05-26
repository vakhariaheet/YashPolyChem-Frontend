interface SingleProps {
  Sum: (arr: Array<number>) => number | string;
  orders: {
    [dealer: string]: Array<{
      "Bill Qty": number;
      Name: string;
      TTNO: string;
      "Tran. Date": string;
      email: string;
    }>;
  };
  dealer: string;
}
const Single = ({ Sum, orders, dealer }: SingleProps) => {
  const dateFilter: {
    [date: string]: number;
  } = {};
  orders[dealer].map((order) => {
    return (dateFilter[order["Tran. Date"]] =
      dateFilter[order["Tran. Date"]] || 0 + Number(order["Bill Qty"]));
  });
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
          <th>Qty</th>
          <th>Name</th>
         
        </tr>
        ${orders[dealer]
          .map(
            (order) => `
          <tr>
            <td>${order["Tran. Date"]}</td>
            <td>${order["TTNO"]}</td>
            <td>${parseFloat(order["Bill Qty"].toString()).toFixed(3)}</td>
            <td>${order["Name"]}</td>
           
          </tr>
        `
          )
          .join("")}
        <tr>
            <td></td>
            <td>total</td>
            <td>${Sum(
              orders[dealer].map((order) => Number(order["Bill Qty"]))
            )}</td>
            <td></td>
        </tr>
      </table>
      <h4>Summary</h4>
      <table>
        <tr>
          <th>Trans. Date</th>
          <th>Toatl Bill Qty</th>
         
        </tr>
        ${Object.keys(dateFilter)
          .map(
            (date) => `
        <tr>
        <td>${date}</td>
        <td>${dateFilter[date]}</td>
        </tr>
        `
          )
          .join("")}
        <tr>
            
            <td>total</td>
            <td>${Sum(
              orders[dealer].map((order) => Number(order["Bill Qty"]))
            )}</td>
           
        </tr>
      </table>
      </body>
      </html>
      `;
};
export default Single;
