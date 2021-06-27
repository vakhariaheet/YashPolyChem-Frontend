import React, { useState, SetStateAction, Dispatch } from "react";
import singleHtmlTemplate from "../utils/Single.html";
import groupHtmlTemplate from "../utils/Group.html";
import sendEmail from "../utils/sendEmail.utils";
import SingleDealer from "../Components/singleDealer.component";
import MultipleDealer from "../Components/MultipleDealer.component";
import { OrderProp } from "../interfaces";
import {
  Button,
  Box,
  FormControl,
  NativeSelect,
  InputLabel,
  CircularProgress,
} from "@material-ui/core";

export interface EmailPreviewProps {
  orders: {
    [dealer: string]: Array<OrderProp>;
  };
  setCurrentDealer: Dispatch<SetStateAction<string>>;
  currentDealer: string;
  dealersInfo: {
    [dealer: string]: {
      _id: string;
      id: string;
      email: string;
      name: string;
      order: number;
    };
  };
}
const EmailPreview: React.SFC<EmailPreviewProps> = ({
  orders,
  dealersInfo,
  currentDealer,
  setCurrentDealer,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [groupOrders, setGroupOrders] = useState<Array<OrderProp>>();
  const Sum = (arr: Array<number>) => {

    let final = 0;
    arr.map((num) => {
      final += num;
      // eslint-disable-next-line array-callback-return
      return;
    });
    return parseFloat(final.toString()).toFixed(3);
  };

  const lastDate = (arr: Array<string>) => {
    const dates = arr
      .map((wholedate) => {
        const [date, month, year] = wholedate.split("/");
        return new Date(`${year}-${month}-${date}`);
      })
      .sort((a, b) => a.getTime() - b.getTime());
    const date = dates[dates.length - 1];
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };
  const sendSingleEmail = (dealer: string | Array<string>) => {
    if (typeof dealer === "string") {
      return sendEmail({
        to: dealersInfo[dealer].email,
        name: dealer,
        lastDate: lastDate(orders[dealer].map((order) => order.date)),
        html: singleHtmlTemplate({ Sum, orders, dealer }),
        setIsLoading,
      });
    } else {
      if (!groupOrders) return;
      return sendEmail({
        to: `${dealer
          .map((name) => `${name} ${dealersInfo[name].email} `)
          .join("")}`,
        name: dealer.join("|"),
        lastDate: lastDate(groupOrders.map((order) => order.date)),
        html: groupHtmlTemplate({
          Sum,
          orders,
          dealers: dealer,
          groupOrders,
        }),
        setIsLoading,
      });
    }
  };

  return (
    <>
      <Box
        justifyContent="center"
        marginTop={3}
        style={{ height: "3rem", width: "100%", display: "flex" }}
      >
        <FormControl variant="outlined" style={{ width: "100%" }}>
          <InputLabel htmlFor="dealer-native-simple">Dealer</InputLabel>
          <NativeSelect
            value={currentDealer}
            onChange={({ target }) => {
              setCurrentDealer(target.value);
              if (target.value.split("|").length === 1)
                return setCurrentDealer(target.value);
              if (!orders) return;
              const dealer = target.value.split("|");
              let tempGroupOrders: Array<OrderProp> = [];
              dealer.map((name) => tempGroupOrders.push(...orders[name]));
              setGroupOrders(
                tempGroupOrders.sort(
                  (a, b) =>
                    new Date(a.date).getTime() -
                    new Date(b.date).getTime()
                )
              );
            }}
            inputProps={{
              id: "dealer-native-simple",
            }}
          >
            {Object.keys(dealersInfo).map((dealer) => {
              const groups = [
                ["KUTCH", "PANOLI(J)", "PANOLI(N)"],
                ["AARTI Bhachau", "AARTI Jdia", "AARTI Vapi"],
              ];
              if (dealer === "KUTCH") {
                return (
                  <option value={groups[0].join("|")}>
                    {groups[0].join("|")}
                  </option>
                );
              }
              if (dealer === "AARTI Bhachau") {
                return (
                  <option value={groups[1].join("|")}>
                    {groups[1].join("|")}
                  </option>
                );
              }
              if (
                (groups[0].indexOf(dealer) !== -1 &&
                  groups[0].indexOf(dealer) !== 0) ||
                (groups[1].indexOf(dealer) !== -1 &&
                  groups[1].indexOf(dealer) !== 0) ||
                dealersInfo[dealer].order === 0
              )
                // eslint-disable-next-line array-callback-return
                return;

              return <option value={dealer}>{dealer}</option>;
            })}
          </NativeSelect>
        </FormControl>
      </Box>
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
      <Box
        justifyContent="center"
        marginTop={3}
        style={{ height: "3rem", width: "100%", display: "flex" }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={() =>
            sendSingleEmail(
              currentDealer.split("|").length === 1
                ? currentDealer
                : currentDealer.split("|")
            )
          }
        >
          {isLoading ? (
            <CircularProgress size={20} />
          ) : (
            `Email ${currentDealer}`
          )}
        </Button>
      </Box>
    </>
  );
};

export default EmailPreview;
