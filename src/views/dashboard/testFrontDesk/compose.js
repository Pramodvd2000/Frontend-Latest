// ** React Imports
import { useEffect, useState } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { Editor } from 'react-draft-wysiwyg'
import Select, { components } from 'react-select'
import { Minus, X, Maximize2, Paperclip, MoreVertical, Trash } from 'react-feather'

// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Modal,
  Button,
  ModalBody,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  UncontrolledButtonDropdown
} from 'reactstrap'


// ** Utils
import { selectThemeColors } from '@utils'

// ** User Avatars
import img1 from '@src/assets/images/portrait/small/avatar-s-3.jpg'
import img2 from '@src/assets/images/portrait/small/avatar-s-1.jpg'
import img3 from '@src/assets/images/portrait/small/avatar-s-4.jpg'
import img4 from '@src/assets/images/portrait/small/avatar-s-6.jpg'
import img5 from '@src/assets/images/portrait/small/avatar-s-2.jpg'
import img6 from '@src/assets/images/portrait/small/avatar-s-11.jpg'

// ** Styles
import '@styles/react/libs/editor/editor.scss'
import '@styles/react/libs/react-select/_react-select.scss'

const ComposePopup = props => {
    let getData = JSON.parse(localStorage.getItem('data1'))
    //console.log(getData['id'])
    //console.log(getData)
    const [details,setDetails] = useState('')

    useEffect(() => {
      fetchx(API_URL + "/getReservationGuestDetails", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              hotelID:'1',
              reservationID:getData['id'],
              })
          }).then(result => result.json())
          .then(rowData => {
            // //console.log(hotelID)
            // //console.log(data1['data1']['id'])
              //console.log(rowData['data'])
              setDetails(rowData['data'][0]) 
              //console.log(rowData['data'][0]['guestID']) 
              //console.log(rowData['data'][0]['printRate'])  
 
              // localStorage.setItem('guestID',(rowData['data'][0]['guestID']));            
            }).catch((error) => {
              //console.log(error)
            })
      }, [])
  
      //console.log(details)
  // ** Props & Custom Hooks
  const { composeOpen, toggleCompose } = props

  // ** States
  const [ccOpen, setCCOpen] = useState(false)
  const [bccOpen, setBCCOpen] = useState(false)

  // ** User Select Options & Components
  const selectOptions = [
    { value: 'nidhi@graspberry.com', label: 'nidhi@graspberry.com' },
    // { value: 'chandler', label: 'Chandler Bing', img: img2 },
    // { value: 'ross', label: 'Ross Geller', img: img3 },
    // { value: 'monica', label: 'Monica Geller', img: img4 },
    // { value: 'joey', label: 'Joey Tribbiani', img: img5 },
    // { value: 'Rachel', label: 'Rachel Green', img: img6 }
  ]

  const SelectComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className='d-flex flex-wrap align-items-center'>
          <Avatar className='my-0 me-50' size='sm' img={data.img} />
          {data.label}
        </div>
      </components.Option>
    )
  }

  // ** CC Toggle Function
  const toggleCC = e => {
    e.preventDefault()
    setCCOpen(!ccOpen)
  }

  // ** BCC Toggle Function
  const toggleBCC = e => {
    e.preventDefault()
    setBCCOpen(!bccOpen)
  }

  // ** Toggles Compose POPUP
  const togglePopUp = e => {
    e.preventDefault()
    toggleCompose()
  }

  return (
    // <Modal
    //   scrollable
    //   fade={false}
    //   keyboard={false}
    //   backdrop={false}
    //   id='compose-mail'
    //   container='.content-body'
    //   className='modal-lg'
    //   isOpen={composeOpen}
    //   contentClassName='p-0'
    //   toggle={toggleCompose}
    //   modalClassName='modal-sticky'
    // >
    //   <div className='modal-header'>
        // <h5 className='modal-title'>Compose Mail</h5>
        // <div className='modal-actions'>
        //   <a href='/' className='text-body me-75' onClick={togglePopUp}>
        //     <Minus size={14} />
        //   </a>
        //   <a href='/' className='text-body me-75' onClick={e => e.preventDefault()}>
        //     <Maximize2 size={14} />
        //   </a>
        //   <a href='/' className='text-body' onClick={togglePopUp}>
        //     <X size={14} />
        //   </a>
        // </div>
    //   </div>
    //   <ModalBody className='flex-grow-1 p-0'>
        <Form className='compose-form' onSubmit={e => e.preventDefault()}>
          <div className='compose-mail-form-field'>
            <Label for='email-to' className='form-label'>
              To:
            </Label>
            <div className='flex-grow-1'>
              <Select
                isMulti
                id='email-to'
                isClearable={false}
                theme={selectThemeColors}
                options={selectOptions}
                className='react-select select-borderless'
                classNamePrefix='select'
                components={{ Option: SelectComponent }}
              />
            </div>
            <div>
              <a href='/' className='toggle-cc text-body me-1' onClick={toggleCC}>
                Cc
              </a>
              <a href='/' className='toggle-cc text-body' onClick={toggleBCC}>
                Bcc
              </a>
            </div>
          </div>
          {ccOpen === true ? (
            <div className='compose-mail-form-field cc-wrapper'>
              <Label for='email-cc' className='form-label'>
                Cc:
              </Label>
              <div className='flex-grow-1'>
                <Select
                  isMulti
                  id='email-cc'
                  isClearable={false}
                  theme={selectThemeColors}
                  options={selectOptions}
                  className='react-select select-borderless'
                  classNamePrefix='select'
                  components={{ Option: SelectComponent }}
                />
              </div>
              <div>
                <a href='/' className='toggle-cc text-body' onClick={toggleCC}>
                  <X size={14} />
                </a>
              </div>
            </div>
          ) : null}
          {bccOpen === true ? (
            <div className='compose-mail-form-field cc-wrapper'>
              <Label for='email-bcc' className='form-label'>
                Bcc:
              </Label>
              <div className='flex-grow-1'>
                <Select
                  isMulti
                  id='email-bcc'
                  isClearable={false}
                  theme={selectThemeColors}
                  options={selectOptions}
                  className='react-select select-borderless'
                  classNamePrefix='select'
                  components={{ Option: SelectComponent }}
                />
              </div>
              <div>
                <a href='/' className='toggle-cc text-body' onClick={toggleBCC}>
                  <X size={14} />
                </a>
              </div>
            </div>
          ) : null}
          <div className='compose-mail-form-field'>
            <Label for='email-subject' className='form-label'>
              Subject:
            </Label>
            <Input id='email-subject' placeholder='Subject' defaultValue={"This is the Confirmation Letter"} > </Input>
          </div>
          <table style={{width:'210mm'}}>
      <tr>
        <td colSpan={6}><b>Guest Name  </b>  : {details['salutation'] +'.'+ details['name'] +' '+ details.lastName}</td>
        <td colSpan={6}><b>Company    </b>   :{details['rateCode']}</td>
      </tr>

      <tr>
        <td colSpan={6}> <b>Arrival Date/Time  </b>    :{details["arrivalDate"]}</td> 
        <td colSpan={6}> <b>Travel Agent </b>  :{details["accountName"]} </td> 
      </tr>
      
      <tr>
        <td colSpan={6}> <b>Departure Date/Time </b> : {details["departureDate"]} </td> 
        <td colSpan={6}> <b>Number of Persons</b> :{details["numberOfAdults"]}</td> 
      </tr>
      
      <tr>
        <td colSpan={6}> <b>Room Type </b>  : {details["roomType"]} </td> 
        <td colSpan={6}> <b>Number of Rooms</b>  : {details["numberOfRooms"]}</td> 
      </tr>
      <tr>
        <td colSpan={6}> <b>Room Rate  : {details["rate"]} </b> </td>  
        {/* <td> <b>ConfirmationNumber</b>  : {data1["account"]}</td> */}
        <td colSpan={6}> <b>ConfirmationNumber</b>  : {details.bookingID}</td>  

      </tr>
      
      <tr>
        <td colSpan={6}> <b>Package   </b>  :{details["packageCode"]}</td>  
        <td colSpan={6}> <b>Membership Number </b>   :{details["membershipNo"]}</td>  
      </tr>
      
      <tr>
        <td colSpan={6}> <b>Booker Name </b>  : {details["bookerName"]}</td>  
        <td colSpan={6}> <b>Booker Number</b>  : {details["bookerID"]}</td>  
      </tr>
      <tr>
        <td colSpan={12}>To facilitate express check-in, may we request you to kindly furnish other details not specified herein: </td>
      </tr>
 
      <tr>
        <td colSpan={6}><b>Pickup Required (Yes/No) </b> : Please Advise </td>  
        <td colSpan={6}><b> Drop Required (Yes/No)</b> : Please Advise </td>  
      </tr>

      <tr>
        <td colSpan={6}><b>Arrival Flight Number </b>   : {details["pickUpCarrierCode"]}</td>  
        <td colSpan={6}><b> Arrival Time</b>  : {details["pickUpTime"]}</td>  
      </tr>
      
      <tr>
        <td colSpan={6}><b>Departure Flight Number </b>  : {details["dropCarrierCode"]}</td>  
        <td colSpan={6}> <b>Departure Time </b>   : {details["dropTime"]}</td>  
      </tr>
      <tr>
        <td> <b>Inclusions</b> :{details["extraCode"]} </td>
      </tr>

      {/* <tr>
        <td colSpan={12} style={{ fontSize: '11px' }}>For any assistance at the airport please contact our Hotel Duty Manager @ 9620800541 (or) hotel land line @ 91 80 3003 0303. </td>
      </tr> */}

      <tr> 
        <td colSpan={12}> Guest Address Details </td>
      </tr>

      <tr> 
        <td colSpan={12}><b>Address  </b>   : {details["addressOne"]} </td>    
      </tr>

      <tr>      
        <td colSpan={6}><b>City/State </b> :  {details["city"]} </td> 
        <td colSpan={6}><b>Country/Pin code </b>  :{details["countriesname"] +'/'+ details["postalCode"]}</td>
      </tr>

      <tr> 
        <td colSpan={6}><b> Telephone Number</b> : {details["phoneNumber"]} </td>  
        <td colSpan={6}><b> Fax</b> :  </td> 
      </tr>

      <tr> 
        <td colSpan={12}><b>E-mail Address </b> : {details["email"]} </td>  
      </tr>

      <tr> 
        <td colSpan={6}><b>Credit Card Number </b>  : {details["cardNumber "]} </td>  
        <td colSpan={6}><b>Expiry Date</b>  : {details["expiryDate"]}  </td>  
      </tr>

      <tr> 
        <td colSpan={6}><b>Nationality </b> : {details["countriesname"]} </td>  
        <td colSpan={6}><b> Date of Birth</b>  : {details["dob"]} </td>  
      </tr>

      <tr> 
        <td colSpan={4}><b> Passport Number</b>  :{details["idNumber"]}  </td>  
        <td colSpan={4}><b>Place of Issue </b>  :{details["issuePlace"]} </td>  
        <td colSpan={4}><b>Date of Issue </b> : {details["issueDate"]}</td>  
      </tr>

      <tr>
      <td colSpan={12}><b>Billing Details </b> : {details["billingInstruction"]}  </td>  
      </tr>
    </table>
   
          <div id='message-editor'>
            <Editor
              placeholder='Message'
              toolbarClassName='rounded-0'
              wrapperClassName='toolbar-bottom'
              editorClassName='rounded-0 border-0'
              toolbar={{
                options: ['inline', 'textAlign'],
                inline: {
                  inDropdown: false,
                  options: ['bold', 'italic', 'underline', 'strikethrough']
                }
              }}
             
            > </Editor>
            
          </div>
          <div className='compose-footer-wrapper'>
            <div className='btn-wrapper d-flex align-items-center'>
              <UncontrolledButtonDropdown direction='up' className='me-1'>
                <Button color='primary' onClick={toggleCompose}>
                  Send
                </Button>
                <DropdownToggle className='dropdown-toggle-split' color='primary' caret></DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem href='/' tag='a' onClick={togglePopUp}>
                    Schedule Send
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
              <div className='email-attachement'>
                <Label className='mb-0' for='attach-email-item'>
                  <Paperclip className='cursor-pointer ms-50' size={18} />
                  <input type='file' name='attach-email-item' id='attach-email-item' hidden />
                </Label>
              </div>
            </div>
            {/* <div className='footer-action d-flex align-items-center'>
              <UncontrolledDropdown className='me-50' direction='up'>
                <DropdownToggle tag='span'>
                  <MoreVertical className='cursor-pointer' size={18} />
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem href='/' tag='a' onClick={e => e.preventDefault()}>
                    Add Label
                  </DropdownItem>
                  <DropdownItem href='/' tag='a' onClick={e => e.preventDefault()}>
                    Plain text mode
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem href='/' tag='a' onClick={e => e.preventDefault()}>
                    Print
                  </DropdownItem>
                  <DropdownItem href='/' tag='a' onClick={e => e.preventDefault()}>
                    Check Spelling
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <Trash className='cursor-pointer' size={18} onClick={toggleCompose} />
            </div> */}
          </div>
        </Form>
    //   </ModalBody>
    // </Modal>
  )
}

export default ComposePopup
