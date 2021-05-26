import React, { useState, useEffect } from "react";
import { Table, Form, Container, Button, Row, Col } from "react-bootstrap";
import singleHtmlTemplate from "../utils/Single.html";
import groupHtmlTemplate from "../utils/Group.html";
import "bootstrap/dist/css/bootstrap.min.css";
import sendEmail from "../utils/sendEmail.utils";
import SingleDealer from "../Components/singleDealer.component";
import MultipleDealer from "../Components/MultipleDealer.component";

function Upload() {
  const [file, setFile] = useState<FileList>();
  const [currentDealer, setCurrentDealer] = useState<string>();

  const [groupOrders, setGroupOrders] =
    useState<
      Array<{
        "Bill Qty": number;
        Name: string;
        TTNO: string;
        "Tran. Date": string;
        email: string;
      }>
    >();
  const [orders, setOrders] =
    useState<{
      [dealer: string]: Array<{
        "Bill Qty": number;
        Name: string;
        TTNO: string;
        "Tran. Date": string;
        email: string;
      }>;
    }>();
  const onFileInput = (e: any) => {
    console.log(e.target.files);
    setFile(e.target.files);
  };
  const Sum = (arr: Array<number>) => {
      console.log(arr)
    let final = 0;
    arr.map((num) => {
      final += num;
    });
    return parseFloat(final.toString()).toFixed(3);
  };
  const convertToDate = (date: string) => {
    const [day, month, year] = date.split(".");
    return new Date(`${year}-${month}-${day}`);
  };
  const lastDate = (arr: Array<string>) => {
    const dates = arr
      .map((date) => convertToDate(date))
      .sort((a, b) => a.getTime() - b.getTime());
    const date = dates[dates.length - 1];
    return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  };
  const sendSingleEmail = (dealer: string | Array<string>) => {
    if (!orders) return;
    if (typeof dealer === "string") {
      return sendEmail({
        to: orders[dealer][0].email,
        name: dealer,
        lastDate: lastDate(orders[dealer].map((order) => order["Tran. Date"])),
        html: singleHtmlTemplate({ Sum, orders, dealer }),
      });
    } else {
      if (!groupOrders) return;
      return sendEmail({
        to: `${dealer
          .map((name) => `${name} ${orders[name][0].email} `)
          .join("")}`,
        name: dealer.join("|"),
        lastDate: lastDate(groupOrders.map((order) => order["Tran. Date"])),
        html: groupHtmlTemplate({ Sum, orders, dealers: dealer, groupOrders }),
      });
    }
  };
  const onClick = (e: any) => {
    if (!file) return;
    const fr = new FileReader();
    fr.readAsBinaryString(file[0]);
    fr.onload = (event) => {
      const binaryString = event.target?.result;

      fetch("http://localhost:5000/upload", {
        method: "POST",
        body: JSON.stringify({ binaryString }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          const { dealerOrder } = data;
          console.log(data);
          setOrders(dealerOrder);
          setCurrentDealer(Object.keys(dealerOrder)[0]);
        });
    };
  };

  return (
    <Container className="App">
      <Row style={{ margin: "1rem" }}>
        <Col sm={8}>
          <Form>
            <Form.File
              id="custom-file"
              label={file ? file[0].name : "Input"}
              custom
              onChange={onFileInput}
            />
          </Form>
        </Col>
        <Col sm={4}>
          <Button variant="primary" onClick={onClick}>
            Upload
          </Button>
        </Col>
      </Row>
      {orders && currentDealer && (
        <>
          <Form>
            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Label>Dealer</Form.Label>
              <Form.Control
                as="select"
                custom
                onChange={({ target }) => {
                  setCurrentDealer(target.value);
                  if (target.value.split("|").length === 1)
                    return setCurrentDealer(target.value);
                  if (!orders) return;
                  const dealer = target.value.split("|");
                  let tempGroupOrders: Array<{
                    "Bill Qty": number;
                    Name: string;
                    TTNO: string;
                    "Tran. Date": string;
                    email: string;
                  }> = [];
                  dealer.map((name) => tempGroupOrders.push(...orders[name]));
                  setGroupOrders(
                    tempGroupOrders.sort(
                      (a, b) =>
                        convertToDate(a["Tran. Date"]).getTime() -
                        convertToDate(b["Tran. Date"]).getTime()
                    )
                  );
                }}
              >
                {Object.keys(orders).map((dealer) => {
                  const groups = [
                   ["KUTCH","PANOLI(J)","PANOLI(N)"],
                    ["AARTI Bhachau","AARTI Jdia","AARTI Vapi"],
                  ];
                  if (dealer === "KUTCH") {
                    return <option>{groups[0].join("|")}</option>;
                  }
                  if (dealer === "AARTI Bhachau") {
                    return <option>{groups[1].join("|")}</option>;
                  }
                  if (
                    (groups[0].indexOf(dealer) !== -1 &&
                      groups[0].indexOf(dealer) !== 0) ||
                    (groups[1].indexOf(dealer) !== -1 &&
                    groups[1].indexOf(dealer) !== 0) 
                  )
                    return;

                  return <option>{dealer}</option>;
                })}
              </Form.Control>
            </Form.Group>
          </Form>

          {currentDealer.split("|").length === 1 ? (
            <SingleDealer orders={orders} currentDealer={currentDealer} />
          ) : groupOrders ? (
            <MultipleDealer
              orders={orders}
              groupOrders={groupOrders}
              Sum={Sum}
              dealers={currentDealer.split("|")}
            />
          ) : null}
          <Button
            variant="primary"
            onClick={() =>
              sendSingleEmail(
                currentDealer.split("|").length === 1
                  ? currentDealer
                  : currentDealer.split("|")
              )
            }
          >
            Email {currentDealer}
          </Button>
        </>
          )}
        
    </Container>
  );
}

export default Upload;
