import React, { useEffect,useState } from "react";
import { Container } from "react-bootstrap";
import DealerCard from '../Components/DealerCard.component';
export interface DealersProps {}

const Dealers: React.SFC<DealersProps> = () => {
    const [dealers, setDealers] = useState<Array<{ name: string, email: string, id: string; _id:string}>>()
  useEffect(() => {
    fetch("http://localhost:5005/dealers").then((resp) => resp.json()).then(dealers => setDealers(dealers));
  }, []);
    if (!dealers) {
        return <Container>Loading...</Container>
    }
  return (
    <Container className="dealer_container">
          {dealers.map(dealer => (
          <DealerCard dealer={dealer} />
      ))}
    </Container>
  );
};

export default Dealers;
