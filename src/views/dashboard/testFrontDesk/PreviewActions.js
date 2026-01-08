// ** React Imports
import { Link } from 'react-router-dom'
import Logo from './oterra.jpg';
import { useState,useEffect } from 'react'

// ** Reactstrap Imports
import {Card,CardHeader,CardTitle,CardBody,Button,Modal,ModalBody,Row,InputGroup,
  ModalHeader,Col,Label,Input,Form,UncontrolledButtonDropdown,DropdownToggle,DropdownMenu,DropdownItem,UncontrolledDropdown} from 'reactstrap'

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from "react-hot-toast";
import Avatar from "@components/avatar";
import { Check } from "react-feather";
import { XCircle } from "react-feather";
import API_URL from '../../../config'
import { useForm, Controller } from 'react-hook-form'

const PreviewActions = ({ id, setSendSidebarOpen, setAddPaymentOpen ,data1}) => {

  const [composeOpen, setcomposeOpen] = useState(false)
  const [guestEmail,setguestEmail] = useState(data1.email)
  const { reset, handleSubmit, control ,formState: { errors }
} = useForm({ });
//console.log(data1)

useEffect(() => {
  fetchx(API_URL + "/getConfirmationGuestDetails", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hotelID:'1',
      sharingID:data1.sharingID,
      })
       }).then(result => result.json())
       .then(rowData => {          
        //console.log(rowData['data'])
        setguestEmail(rowData['data'][0]['email'])
       }).catch((error) => {
      //console.log(error)
      
    })
},[]) 
const SendEmail = ()=>{

  // //console.log(JSON.stringify({
  //   hotelID:1,
  //   type:'ConfirmationLetter',
  //   toAddress:guestEmail,
  //   guestProfileID:data1['guestID'],
  //   sharingID:data1['sharingID'],
  //   reservationID:data1['id']
  //     }))
  fetchx(API_URL + "/sendemailCnfLetter", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hotelID:1,
      type:'ConfirmationLetter',
      toAddress:guestEmail,
      guestProfileID:data1['guestID'],
      sharingID:data1['sharingID'],
      reservationID:data1['id']
        })
  }).then(result => result.json())
  .then(resp => {
      //console.log(resp)
      if(resp.statusCode==200){
        //console.log(resp)
        setcomposeOpen(false)

        toast(
          <div className="d-flex">
            <div className="me-1">
              <Avatar size="sm" color="success" icon={<Check size={12} />} />
            </div>
            <div className="d-flex flex-column">
              <h6>Email sent successfully</h6>
              {/* <h4>Wait-List Added Successfully</h4> */}
            </div>
          </div>
        );
      }
      
    }).catch((error) => {
      //console.log(error)
      setcomposeOpen(false)

      toast(
        <div className="d-flex">
          <div className="me-1">
            <Avatar size="sm" color="danger" icon={<XCircle size={12} />} />
          </div>
          <div className="d-flex flex-column">
            <h6>Could not send Email</h6>
            {/* <h4>Wait-List Added Successfully</h4> */}
          </div>
        </div>
      );
    })
}  

  // Function to handle input change
  const handleEmailChange = (event) => {
    setguestEmail(event.target.value); // Update the guestEmail state with the input value
  };
  return (
    <div>
    <Card className='invoice-action-wrapper'>
      <CardBody>        
        {/* <Button color='secondary' block outline className='mb-75'  onClick={ConfirmationLetter} >
          Download          
        </Button> */}
        <Button color='secondary' tag={Link} to='/dashboard/confirmationinvoice/print' target='_blank' block outline className='mb-75'>
          Print
        </Button>       
        <Button color='primary' onClick={()=>{setcomposeOpen(true)}}  block className='mb-75'>
          SendEmail
        </Button> 
      </CardBody>
    </Card>
   
{/* //Email Template */}
<Modal
      style={{height:'200px'}}
      className='modal-dialog-centered modal-lg'
      isOpen={composeOpen}
      toggle={() => setcomposeOpen(!composeOpen)}
    >
      <ModalHeader toggle={() => setcomposeOpen(!composeOpen)} className='bg-transparent'>Send Email</ModalHeader>
      <ModalBody >

      <Form className='compose-form' onSubmit={handleSubmit(SendEmail)}>
      <div className='compose-mail-form-field'>
          <Label htmlFor='email-to' className='form-label'>
        To:
      </Label>
      <div className='flex-grow-1'>
      <InputGroup className="input-group-merge">
        <Input
            type="email"
            id="email-to"
            name="email-to"
            value={guestEmail} // Set the value to guestEmail state
            onChange={handleEmailChange} // Handle input changes
            required
          />
        </InputGroup>
      </div>
    </div>
          {/* <div className='compose-mail-form-field'>
            <Label for='email-to' className='form-label'>
              To:
            </Label>
            <div className='flex-grow-1'>
                <InputGroup className="input-group-merge">
                  <Controller
                    id="email-to"
                    name="email-to"
                    control={control}
                    
                    render={({ field }) => (
                      <Input
                      required
                      defaultValue={guestEmail}
                        {...field}
                      />
                    )}
                  />
                </InputGroup>
            </div>
          </div> */}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ marginTop: '22px' }} type='submit' color='primary'>
               Send
               </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>


    </div>
  )
}

export default PreviewActions
