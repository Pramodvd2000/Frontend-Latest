
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'


import API_URL from "../../config";
import { Button, Label, Input, Form, InputGroup } from 'reactstrap'
import { useForm } from 'react-hook-form'
import toast from "react-hot-toast";
import Avatar from "@components/avatar";
import { Check } from "react-feather";
import { XCircle } from "react-feather";
let is_test = false


const EmailComp = ({ toggleModal, CompleteInvData }) => {


  // ** States
  const [ccOpen, setCCOpen] = useState(false)
  const [bccOpen, setBCCOpen] = useState(false)
  const [composeOpen, setcomposeOpen] = useState(false)
  const [toggleCompose, settoggleCompose] = useState(false)
  const [guestEmail, setguestEmail] = useState()
  const [CC1_Email, setCC1_Email] = useState('')
  const [CC2_Email, setCC2_Email] = useState('')


  const [CompleteData, setCompleteData] = useState(CompleteInvData)


  const { reset, handleSubmit, control, formState: { errors }
  } = useForm({});
  useEffect(() => {
    if (CompleteInvData.BTCAccount == null) {
      setguestEmail(CompleteInvData.guestEmail)
      setCCOpen(false)
    } else {
      setguestEmail(CompleteInvData.BTCCompanyEmail)
      let EMail = CompleteInvData.guestEmail + ' ' + CompleteInvData.bookerEmail
      setCC1_Email(CompleteInvData.guestEmail)
      setCC2_Email(CompleteInvData.bookerEmail)

      setCCOpen(true)
    }
  }, []);
  const SendEmail = (data) => {
    toggleModal()
    if (data['email-to'] == undefined) {
      data['email-to'] = guestEmail
    }
    if (data['email-cc'] == undefined) {
      data['email-cc'] = CC1_Email + ' ' + CC2_Email
    }


    fetchx(API_URL + "/sendemailtest", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'PMSInvoice',
        amount: CompleteData.invoiceAmount,
        toAddress: guestEmail,
        receiptNo: CompleteData.billNoDisplay,
        ccAddress: CC1_Email + ';' + CC2_Email,
        billID: CompleteData.id,
        BillNo: CompleteData.billNo,
        reservationID: CompleteData.reservationID
      })
    }).then(result => result.json())
      .then(resp => {
        if (resp.statusCode == 200) {
          setcomposeOpen(false)

          toast(
            <div className="d-flex">
              <div className="me-1">
                <Avatar size="sm" color="success" icon={<Check size={12} />} />
              </div>
              <div className="d-flex flex-column">
                <h6>Email sent successfully</h6>
              </div>
            </div>
          );
        }

      }).catch((error) => {
        setcomposeOpen(false)
        toast(
          <div className="d-flex">
            <div className="me-1">
              <Avatar size="sm" color="danger" icon={<XCircle size={12} />} />
            </div>
            <div className="d-flex flex-column">
              <h6>Could not send Email</h6>
            </div>
          </div>
        );
      })


  }

  const handleEmailChange = (event) => {
    setguestEmail(event.target.value); // Update the guestEmail state with the input value
  };

  const handleCC1EmailChange = (event) => {
    setCC1_Email(event.target.value); // Update the guestEmail state with the input value
  };
  const handleCC2EmailChange = (event) => {
    setCC2_Email(event.target.value); // Update the guestEmail state with the input value
  };

  return (
    <>

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
        {ccOpen === true && (
          <div className='compose-mail-form-field'>
            <Label htmlFor='email-cc' className='form-label'>
              guest Email(cc) :
            </Label>
            <div className='flex-grow-1'>
              <InputGroup className="input-group-merge">
                <Input
                  type="email"
                  placeholder='guest Email'
                  id="email-cc"
                  name="email-cc"
                  value={CC1_Email} // Set the value to guestEmail state
                  onChange={handleCC1EmailChange} // Handle input changes

                />
              </InputGroup>
            </div>
            <Label htmlFor='email-cc' className='form-label'>
              booker Email(cc) :
            </Label>
            <div className='flex-grow-1'>
              <InputGroup className="input-group-merge">
                <Input
                  placeholder='booker Email'
                  type="email"
                  id="email-cc"
                  name="email-cc"
                  value={CC2_Email} // Set the value to guestEmail state
                  onChange={handleCC2EmailChange} // Handle input changes

                />
              </InputGroup>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button style={{ marginTop: '22px' }} type='submit' color='primary'>
            Send
          </Button>
        </div>
      </Form>
    </>
  )
}

export default EmailComp;