import React,{useState} from 'react'
import {Card,Modal,Button} from "react-bootstrap"
import { Link } from 'react-router-dom';
export interface DealerCardProps {
    dealer: {
        name: string;
        id: string;
        email: string;
        _id?:string
    }
    
}
 
const DealerCard: React.FC<DealerCardProps> = ({dealer}) => {
    const [toggleModal, setToggleModal] = useState(false)
    const onDelete = () => {
        fetch(`http://localhost:5000/dealers/${dealer._id}`, {
            method: "DELETE", 
        }).then(resp => {
            setToggleModal(false)
            document.location.reload()
        })
    }
    return (
      <>
        <Card style={{ width: "18rem" }} className="dealer__card">
          <Card.Body>
            <Card.Title>{dealer.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {dealer.id}
            </Card.Subtitle>
            <Card.Text>{dealer.email}</Card.Text>
            <Link to={`/update/d/${dealer.id}`} className="card-link">
              Update
            </Link>
            <Card.Link style={{cursor:"pointer"}} onClick={() => setToggleModal(true)}>Delete</Card.Link>
          </Card.Body>
        </Card>
        <Modal show={toggleModal} onHide={() => setToggleModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete</Modal.Title>
          </Modal.Header>
                <Modal.Body>Are you sure u want delete {dealer.name }</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setToggleModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}
 
export default DealerCard;