import emailjs from "emailjs-com";
import { init } from "emailjs-com";
import { Dispatch, SetStateAction } from "react";
init("user_adbjg0UTdltr9SLemobjd");

interface sendEmailProps {
  to: string;
  name: string;
  lastDate: string;
  html: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}
const sendEmail = ({
  to,
  name,
  lastDate,
  html,
  setIsLoading,
}: sendEmailProps) => {
  setIsLoading(true);
  emailjs
    .send("service_zxt47mb", "template_e91m0uj", {
      to,
      name,
      lastDate,
      html,
    })
    .then(
      function (response) {
        setIsLoading(false);
      },
      function (error) {
        setIsLoading(false);
        alert(error.message);
      }
    );
};
export default sendEmail;
