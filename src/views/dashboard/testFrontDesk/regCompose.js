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
            <Input id='email-subject' placeholder='Subject' defaultValue={"This is the Registration Card"} > </Input>
          </div>
          <div>

    

            <h4 style={{paddingLeft:'250px'}}>REGISTRATION CARD</h4>  
    <div style={{color:'black'}}>
    <div style={{paddingLeft:'10px', paddingRight:'5px'}}>
     <table  style={{border:'1px solid black','width':'202mm' ,height:'60mm' }}>      
        <tr> 
           <td style={{paddingLeft:'10px'}} colSpan={3}> Title     </td> 
           <td colSpan={3}>FirstName </td> 
           <td colSpan={3}>Initial </td> 
           <td colSpan={3}>Surname    </td>              
      </tr> 
        <tr style={{borderBottom:'0.5px solid #575b63',height:'25px'}} >  
        <td style={{paddingLeft:'10px'}} colSpan={3}> <b>{details["salutation"]}  </b> </td>  
        <td  colSpan={3}> <b>{details["name"]}        </b> </td>   
        <td  colSpan={3}> <b>{details["initial"]}        </b> </td>   
        <td  colSpan={3}> <b>{details["lastName"]}    </b> </td> 
        </tr>
  
      <tr> 
         <td style={{paddingLeft:'10px'}} colSpan={12}>Address &nbsp; </td> 
      </tr> 
      <tr style={{borderBottom:'0.5px solid #575b63', height:'25px'}}> 
        <td style={{paddingLeft:'10px'}} colSpan={12}> <b>{details["addressOne"] +' '+details["city"]+' '+ details["state"]+' '+details["postalCode"]+' '+details["countriesname"]} </b></td> 
      </tr>     
      <tr >  
        <td style={{paddingLeft:'10px',width:'50%'}} colSpan={6}> E-Mail </td>
        <td colSpan={6}> Mobile </td>
     </tr>
      <tr style={{borderBottom:'0.5px solid #575b63',height:'25px'}}> 
       <td style={{paddingLeft:'10px',width:'50%'}} colSpan={6}><b>{details["email"]}</b> </td>
       <td colSpan={6}><b>{details["phoneNumber"]}</b> </td>
      </tr>
      <tr> 
        <td style={{paddingLeft:'10px',width:'50%'}} colSpan={6}>Date of Birth  </td> 
        <td colSpan={6}>Organization </td>    
      </tr>
      <tr style={{borderBottom:'0.5px solid #575b63',height:'25px'}}> 
        <td style={{paddingLeft:'10px',width:'50%'}} colSpan={6}><b>{details["dob"]}</b>  </td> 
        <td colSpan={6}><b>{details["accountName"]}</b></td>      
      </tr>
     
      <tr >  
        <td style={{paddingLeft:'10px',width:'50%'}} colSpan={6}> Passport Number</td>  
        <td colSpan={6}> Nationality </td>   
      </tr>
      <tr style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>  
        <td style={{paddingLeft:'10px',width:'50%'}} colSpan={6}> <b>{details["idNumber"]} </b></td>  
        <td colSpan={6}> <b>{details["countriesname"]} </b></td>   
      </tr>
      <tr>   
        <td style={{paddingLeft:'10px',width:'50%'}}colSpan={6}>Passport Issue Date </td>   
        <td colSpan={6}>Place of Issue </td>   
      </tr>
      <tr style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>  
        <td style={{paddingLeft:'10px'}}colSpan={6}> <b>{details["date"]} </b></td>  
        <td colSpan={6}> <b>{details["countriesname"]} </b></td>   
      </tr>
      <tr>   
        <td style={{paddingLeft:'10px'}}colSpan={6}>Visa Number </td>   
        <td colSpan={6}>Visa Issue Date </td>   
      </tr>
      <tr style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>  
        <td style={{paddingLeft:'10px'}}colSpan={6}> <b>{details["date"]} </b></td>  
        <td colSpan={6}> <b>{details["countriesname"]} </b></td>   
      </tr>  
     </table>
     </div>  
        </div> 
      








      
      <br></br>
      
        <div style={{color:'black'}} >
        <div style={{paddingLeft:'10px', paddingRight:'5px'}}>
        <table  style={{border:'1px solid black','width':'202mm' ,height:'60mm'}}> 
        <div style={{paddingLeft:'10px',paddingRight:'10px'}}> 
          <tr>         
            <td colSpan={4}>Payment By       </td> 
            <td colSpan={4}>Credit Card       </td> 
            <td colSpan={4}>Expiry Date       </td> 
            </tr>
            <tr  style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>
              <td colSpan={12}>
              <input type='radio' name='CreditCard' ></input>  <label>Credit Card </label> &nbsp;
            <input type='radio' name='Cash' ></input>  <label>Cash </label>  &nbsp;
            <input type='radio' name='BTC' ></input>  <label>BTC </label>  &nbsp;
            <input type='radio' name='Voucher' ></input>  <label>Voucher </label>
              </td>
          </tr>  
         
         
          <tr>         
            <td colSpan={3}>Arrival Date  </td>  
            <td colSpan={2}>Arrival Time  </td> 
            <td colSpan={2}>Flight        </td> 
            <td colSpan={2}>Arrival From  </td> 
            <td colSpan={3}>Date of arrival in India </td>             
          </tr>   
          <tr  style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>      
            <td colSpan={3}><b>{details["arrivalDate"]}</b> </td>  
            <td colSpan={3}><b>{details["arrivalTime"]}</b> </td>   
            <td colSpan={3}><b> <i>NON</i>             </b> </td> 
            <td colSpan={3}><b>{details["arrivalDate"]}</b> </td>  
          </tr>
              
          <tr>         
              <td colSpan={3}>Departure Date   </td> 
              <td colSpan={3}>Departure Time   </td> 
              <td colSpan={3}>Flight           </td> 
              <td colSpan={3}>Next Destination </td>           
        </tr>
        <tr  style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>        
         <td colSpan={4}><b>{details["departureDate"]}</b></td>  
         <td colSpan={3}><b>{details["dropTime"]}     </b></td> 
         <td colSpan={2}> <b>                         </b></td>         
         <td colSpan={3}> <b><i>NON</i>               </b></td>  
        </tr>

        <tr>   
          <td colSpan={3}> Room number </td>   
          <td colSpan={3}> Room Category </td>  
          <td colSpan={3}> Room Rate</td> 
          <td colSpan={3}> Room Tax</td>                 
        </tr>
          <tr  style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>          
            <td colSpan={3}><b>{details["room"]}         </b></td>  
            <td colSpan={3}><b>{details["roomType"]}   </b></td> 
            <td colSpan={3}><b>{details["roomRate"]}         </b></td> 
            <td colSpan={3}><b>{details["totalTax"]}</b></td>                  
          </tr>
          <tr>   
            <td colSpan={6}>Prefernces </td>   
            <td colSpan={6}>Extras </td>   
          </tr>
          <tr style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>
            <td colSpan={12}>{details['hotelDescription']}</td>
            <td colSpan={12}>{['extradetails']}</td>

          </tr>
          <tr  style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>           
            <td colSpan={4}>Newspaper </td> 
            <td colSpan={8}>
            <input type='radio' name='CreditCard' ></input>  <label>Times of India </label> &nbsp;
            <input type='radio' name='Cash' ></input>  <label>Hindustan Times </label>  &nbsp;
            <input type='radio' name='BTC' ></input>  <label>None </label>   </td>  
            {/* <td colSpan={8}>Billing Instruction  {details["billingInstruction"]} </td>               */}
          </tr>
            <tr> 
              <td colSpan={12} style={{fontSize:'10px', textAlign:'justify'}} > I agree to abide by the above terms and conditions governing my/our stay in the hotel:
            1.Tariff: The rate on the confirmation is for accommodation charges per night exclusive of taxes. Extra occupant charges will be applicable as per the occupancy in the room. Resident guests should obtain key cards from reception after registering the extra occupant. 2.Bills must be settled on presentation. Cheques are not accepted. 3.Company Lien on visitors Luggage & Belongings: In case of default of payment of dues by a guest the management shall be entitled to a lien on the luggage & belongings and to detain the same and to sell or auction such property at any time after the date of departure without reference to the party and appropriate the net sale proceeds towards the amount due by the guest. 4.Check-in/Checkout: Our Check-in time is 1500 hrs and Check-out time is 1200 hrs. If you wish to avail a late checkout the same can be extended subject to availability and at additional room charges, 50% room charges up to 1800hrs and 100% room charges beyond 1800hrs. 5.Visitor and Belongings: Visitors are requested to lock the doors of their room when going out/going to bed. The company will not in any way whatsoever be responsible for the loss of the guest's goods and any other property not entrusted to the management or for damage therefore whether due to neglect of hotel staff any other cause whatsoever including theft or pilferage. 6.Hazardous Goods: Storing of combustible or hazardous materials in guest rooms are strictly prohibited. 7.Management Rights: The management reserves to itself the absolute right of any admission to any person in the hotel premises and to request any guest to vacate his or her room at any room moment without previous notice and without assigning any reason whatsoever and the guest shall be bound to vacate when requested to do so. In default the management will be entitled to remove the luggage of the visitor from the room occupied by him/her & lock the room. 8.Visitors: Visitors are not permitted in guest rooms after 2000Hrs, beyond which guests can entertain their visitors in any public area of the hotel which is accessible 9. Government Rules & Regulations: Guests are requested to observe the Govt Rules & Regulations in force from time to time in respect of registration alcoholic drinks firearms etc. 10.Amendment Rules: The management reserves to itself the right to add or to amend any of the above term conditions & rules. 11.Disputes: All disputes are subject to the jurisdiction of the Bangalore courts only. 12.The company's anti-sexual harassment policy applies to all guest staying in the hotel and persons involved in the operations and prohibits harassment by any guest or team member of the company towards          
           </td> </tr>
           {/* <tr>
           <table  style={{paddingLeft:'10px' ,border:'1px solid black','width':'180mm' ,height:'10mm'}}>
            <center><u><b> For Internal Use Only</b></u></center>
            <tr>
              <td> C/In By:</td>
              <td> No of Bags:</td>
              <td> Excort:</td>
            </tr>
            <tr>
             <td> C Form:</td>
              <td> C Form No:</td>
            </tr>
            <tr>
              <td colSpan={4}>.................... </td> 
              <td colSpan={4}>.................... </td> 
              <td colSpan={4}>.................... </td> 
            </tr>
           </table>
           </tr> */}
           <tr  style={{height:'25px'}}> 
            </tr>
          
           <tr>
            <td colSpan={4}>Front Office Associate </td> 
            <td colSpan={4} style={{textAlign:'center'}} >Duty Manager           </td> 
            <td colSpan={4} style={{textAlign:'right'}} >Guest signature      </td> 
           </tr>

          </div>
          </table>
          </div>  
        </div>
      <br></br>
      {/* </div> */}
    <br></br>
</div>
   
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
