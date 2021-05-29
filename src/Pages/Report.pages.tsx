import React, { useEffect, useState } from "react";
import { Button, Backdrop, CircularProgress, Grid } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DataTable from "./DataTable";
import { jsPDF } from "jspdf";
import { uid } from "uid";
import autoTable from "jspdf-autotable";
require("jspdf-autotable");
export interface ReportProps {}

const Report: React.SFC<ReportProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [rows, setRows] = useState<
    Array<{
      name: string;
      MTD: string;
      daily: string;
    }>
  >([]);
  const [date, setDate] = useState({
    up: "",
    low: "",
  });
  const Sum = (arr: Array<number>): string => {
    let final = 0;
    arr.map((num) => {
      final += num;
      // eslint-disable-next-line array-callback-return
      return;
    });
    return final.toFixed(3);
  };
  useEffect(() => {
    setIsLoading(true);
    fetch(`https://enigmatic-woodland-79956.herokuapp.com/report`)
      .then((response) => response.json())
      .then((data) => {
        Object.keys(data.orders).forEach((dealer) => {
          const row = {
            id: uid(),
            name: dealer,
            daily: parseFloat(data.tOrders[dealer].toString()).toFixed(3),
            MTD:
              Sum(
                data.orders[dealer].map(
                  (order: {
                    TTNO: string;
                    date: string;
                    Name: string;
                    "Bill Qty": number;
                    id: string;
                  }) => Number(order["Bill Qty"])
                )
              ) || '0.000',
          };

          setDate({ low: data.lowerDate, up: data.upperDate });
          setRows((prevRows) => [...Array.from(new Set([...prevRows, row]))]);
        });
        setIsLoading(false);
      });
  }, []);
  const genratePDF = () => {
    if (!rows) return;
    const doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
    });

    doc.setFillColor("#331E38");
    doc.setFontSize(20);
    doc.text(
      `${new Date(date.low).toDateString()} to ${new Date(
        date.up
      ).toDateString()}`,
      300,
      50,
      { align: "center" }
    );
    const today = new Date();

    autoTable(doc, {
      body: [
        ...rows,
        {
          name: "Total",
          daily: 
            Sum(rows.map((row) => Number(row.daily))),
          MTD: Sum(rows.map((row) => Number(row.MTD))),
        },
      ],
      columns: [
        { header: "Name", dataKey: "name" },
        { header: `${today.getDate()}/${today.getMonth() +1}/${today.getFullYear()}`, dataKey: "daily" },
        { header: "MTD", dataKey: "MTD" },
      ],
      margin: { top: 70, right: 14, bottom: 0, left: 14 },
    });
    doc.save(`${date.low}_${date.up}`);
  };

  const onClick = () => {
    fetch(
      `https://enigmatic-woodland-79956.herokuapp.com/report?lt=${date.low}&gt=${date.up}`
    )
      .then((response) => response.json())
      .then((data) => {
        setRows([]);
        Object.keys(data.orders).forEach((dealer) => {
          const row = {
            id: uid(),
            name: dealer,
            daily: data.tOrders[dealer],
            MTD: Sum(
              data.orders[dealer].map(
                (order: {
                  TTNO: string;
                  date: string;
                  Name: string;
                  "Bill Qty": number;
                  id: string;
                }) => Number(order["Bill Qty"])
              ) || 0.0
            ),
          };

          
          setRows((prevRows) => [...Array.from(new Set([...prevRows, row]))]);
        });
        setDate({ low: data.lowerDate, up: data.upperDate });
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="secondary" />
      </Backdrop>
    );
  }

  return (
    <div className="">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="center" alignItems="center">
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
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
            label="Date picker dialog"
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
          { field: "name", headerName: "Name", flex: 1 },
          { field: "daily", headerName: "Daily", flex: 1 },
          { field: "MTD", headerName: "MTD", flex: 1 },
        ]}

        height={600}
        rows={[
          ...rows,
          {
            id: uid(),
            name: "Total",
            daily: Sum(rows.map((row) => Number(row.daily))),
            MTD: Sum(rows.map((row) => Number(row.MTD))),
          },
        ]}
        checkboxSelection={true}
      />
      <Button variant="outlined" color="primary" onClick={genratePDF}>
        Generate PDF
      </Button>
    </div>
  );
};

export default Report;
