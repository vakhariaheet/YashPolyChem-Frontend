import emailjs from "emailjs-com";
import { init } from "emailjs-com";
init("user_adbjg0UTdltr9SLemobjd");

interface sendEmailProps {
  to: string;
  name: string;
  lastDate: string;
  html: string;
}
const sendEmail = (props: sendEmailProps) => {
  emailjs.send("service_zxt47mb", "template_e91m0uj", props).then(
    function (response) {
      console.log("SUCCESS!", response.status, response.text);
    },
    function (error) {
      console.log("FAILED...", error);
    }
  );
};
export default sendEmail;
