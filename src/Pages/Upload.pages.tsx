import React, { useState } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";

import { Button, CircularProgress } from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';
import EmailPreview from '../Components/EmailPreview.components';
import { OrderProp } from '../interfaces';

// 

function Upload() {
  const [file, setFile] = useState<FileList>();
const [currentDealer, setCurrentDealer] = useState<string>("");
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [err,setErr] = useState<boolean>(false);
  const [dealersInfo, setDealersInfo] =
    useState<{
      [dealer: string]: {
        _id: string;
        id: string;
        email: string;
        name: string;
        order: number;
      };
    }>();
  const [orders, setOrders] =
    useState<{
      [dealer: string]: Array<OrderProp>;
    }>();
  const onFileInput = (e: any) => {
    console.log(e.target.files);
    setFile(e.target.files);
  };
  const onClick = (e: any) => {
    setUploadLoading(true);
    if (!file) return;
    const fr = new FileReader();
    fr.readAsBinaryString(file[0]);
    fr.onload = (event) => {
      const binaryString = event.target?.result;

      fetch("https://enigmatic-woodland-79956.herokuapp.com/upload", {
        method: "POST",
        body: JSON.stringify({ binaryString }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          const { dealerOrder, dealersInfo,err } = data;
          if (err)  {
            setUploadLoading(false);
            setErr(true)
            return 
          };
          setOrders(dealerOrder);
          setCurrentDealer(Object.keys(dealerOrder)[0]);
          setDealersInfo(dealersInfo);
          setUploadLoading(false);
        }).catch(err => {
          console.log(err)
          alert("Duplicate");
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
              accept=".xlsx"
            />
          </Form>
        </Col>
        <Col sm={4}>
          <Button variant="contained" color="secondary" onClick={onClick}>
            {!uploadLoading ? (
              "Upload"
            ) : (
              <CircularProgress size={20} color={"primary"} />
            )}
          </Button>
        </Col>
      </Row>
      {err && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          The Excel File has Duplicate Data
        </Alert>
      )}
      {orders && currentDealer && dealersInfo && (
        <EmailPreview
          orders={orders}
          currentDealer={currentDealer}
          dealersInfo={dealersInfo}
          setCurrentDealer={setCurrentDealer}
        />
      )}
    </Container>
  );
}

export default Upload;
