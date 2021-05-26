import React from 'react'
import { Table } from 'react-bootstrap';
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
    Sum:(arr: Array<number>) => string;
  
}
 
const MultipleDealer: React.SFC<MultipleDealerProps> = ({orders,dealers, groupOrders,Sum}) => {
    return (
      <Table>
        <thead>
          <tr>
            <th>Trans. Date</th>
            <th>TTNO</th>
            
            {dealers
              .map(
                (dealer) => 
              <th>{dealer}</th>
              
              )
              }
          </tr>
        </thead>
        <tbody>
          {groupOrders.map((order) => (
            <tr>
              <td>{order["Tran. Date"]}</td>
              <td>{order["TTNO"]}</td>
            
                  {dealers.map((_, i) => {
                      if (i === dealers.indexOf(order["Name"])) {
                        return (
                          <td>
                            {parseFloat(order["Bill Qty"].toString()).toFixed(
                              3
                            )}
                          </td>
                        );
                      } else {
                        return <td>0.000</td>;
                      }
            })}
            </tr>
          ))}

          <tr>
            <td></td>
            <td>total</td>
            {dealers.map((dealer) => (
              <td>
                {Sum(orders[dealer].map((order) => Number(order["Bill Qty"])))}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    );
}
 
export default MultipleDealer;