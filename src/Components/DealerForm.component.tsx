import React, { Dispatch,MouseEventHandler } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Alert, AlertTitle } from '@material-ui/lab';
export interface DealerFormProps {
  dealer: {
    id: string;
    name: string;
    email: string;
  };
  err: boolean;
  setDealer: Dispatch<{ type: string; payloadValue: string }>;
  onClick: MouseEventHandler<HTMLElement>;
}

const DealerForm: React.SFC<DealerFormProps> = ({ dealer, setDealer,onClick,err }) => {
  return (
    <Container>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group>
          <Form.Label>Dealer Name</Form.Label>
          <Form.Control
            value={dealer.name}
            type="text"
            placeholder="Dealer Name"
            onChange={({ target }) =>
              setDealer({ type: "NAME", payloadValue: target.value })
            }
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Dealer Code</Form.Label>
          <Form.Control
            value={dealer.id}
            type="text"
            placeholder="Dealer Code"
            onChange={({ target }) =>
              setDealer({ type: "ID", payloadValue: target.value })
            }
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Dealer's email(s)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Dealer's email(s)"
            value={dealer.email}
            onChange={({ target }) =>
              setDealer({ type: "EMAIL", payloadValue: target.value })
            }
          />
          <Form.Text className="text-muted">
            Coma Separated Email Address
          </Form.Text>
        </Form.Group>

        <Button variant="primary" onClick={onClick}>
          Submit
        </Button>
        {err && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Dealer Already exists!
          </Alert>
        )}
      </Form>
    </Container>
  );
};

export default DealerForm;
