import 'cleave.js/dist/addons/cleave-phone.us'
import { Input, Card, Form, Row, Col, Label, Button, CardBody, CardTitle,Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import {  Edit2,Search} from "react-feather";
import {
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem
} from "reactstrap";

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import API_URL from '../../../config'
import EditGuest from './editGuestDetails/index'
import { useNavigate } from 'react-router-dom';
import AddGuest from '././guestProfile/index'
import ViewIDDetails from './viewidDetails'
localStorage.removeItem('guestIDToChange')

/// Guest Search
const GuestModification=({data1})=>{
  //console.log(data1.data1)
  const [guestSearch, setGuestSerach] = useState(); 

let navigate = useNavigate();
    const gridRef = useRef();

//      //API to get all the guests
  useEffect(() => {
    fetchx(API_URL+`/getAllGuestDetails`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
        //console.log(rowData['data'])
      })
  }, [])

  //Search element
  const onFilterTextBoxChanged10 = useCallback(() => {
    //console.log(gridRef.current.api)
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box50').value
    )
  }, [])


    const defaultColDef = useMemo(() => (
        {
          sortable: true,
          filter: true,
          filterParams: {
            buttons: ['apply', 'reset']
          }
        }
      ))
    
      const [rowData, setRowData] = useState()
      const [guest, setGuest] = useState()

        //Guest Profile search ag-grid Button
     const [columnDefs] = useState([
       { headerName: 'Name', field: 'firstName', maxWidth: 140 },
       { headerName: 'Email ID', field: 'email', maxWidth: 300 },
       { headerName: 'Company Name', field: 'accountName', suppressSizeToFit: true, maxWidth: 140 },
       {
      headerName: "City",
      field: "city",
      suppressSizeToFit: true,
      maxWidth: 120,
    },
   {
        headerName: "State",
        field: "state",
        suppressSizeToFit: true,
        maxWidth: 160,
      },
      {
        headerName: "Country",
        field: "countriesname",
        suppressSizeToFit: true,
        maxWidth: 120,
      },
    {
      headerName: "Postal Code",
      field: "postalCode",
      suppressSizeToFit: true,
      maxWidth: 160,
    },
    {
      headerName: 'Action',
      field: 'numAvlRooms',
      suppressSizeToFit: true,
      maxWidth: 125,
      cellRendererFramework: (params) => <Button color='primary' onClick={() => onDiscard(params)}> Select </Button>
    },
      //  {
      //    cellRenderer: () => {
      //      return (<Button color='primary' onClick={() => setViewGuestProfile(!viewguestProfile)} >View Profile</Button>)
      //    }
      //  }
     ])

         
      //ag-grid cell clcked value
      const cellClickedListener = useCallback(event => {
        //console.log('cellClicked', event)
        //console.log(event['data']['id'])
        setGuest(event['data']['id'])
        // localStorage.setItem('guestIDToChange', event['data']['id'])
        // setdetails(event['data'])
        localStorage.setItem('companyname', event['data']['accountName'])
        localStorage.setItem('guestProfileID', event['data']['id'])
        localStorage.setItem('companyID', event['data']['companyID'])
        
}, []);
      


     
  //Modal close function
  const onDiscard = (event) => {
    //console.log(event)
    // //console.log(guest)
    const createmarketGroup = JSON.stringify({      
      guestID: event['data']['id'],
      reservationID:['data1']['data1']['id']
    })
    //console.log(createmarketGroup)
    fetchx(API_URL + "/modifyGuest", {
           method: "PUT",
           headers: { 'Content-Type': 'application/json' },
           body: createmarketGroup
       }).then((res) => {
        //console.log(res)
       })
       navigate('/dashboard/frontdesk')      
     }
      //console.log(localStorage.getItem('guestProfileID'))
      const [guestProfile, setGuestProfile] = useState();
      const [viewguestProfile, setViewGuestProfile] = useState();


return(
<div>
<div>
  <Modal isOpen={viewguestProfile} toggle={() => setViewGuestProfile(!viewguestProfile)} className='modal-lg'>
   <ModalHeader className='modal-lg' toggle={() => setViewGuestProfile(!viewguestProfile)}> View Guest</ModalHeader>
    <ModalBody className='pb-3 px-sm-1 mx-20'>         
    <Col>
         
         {/* <Form onSubmit={handleSubmit(onSubmit)}> */}
           <Col>
           <Row>
             <Col>
               <div className="mb-1">
                 <Row>
                 <UncontrolledAccordion defaultOpen='1'>
                             <AccordionItem>
                 <AccordionHeader
                   style={{ backgroundColor: "#F2E5D9" }}
                   targetId="1"
                 >
                   <b> Overview </b>
                    </AccordionHeader>
                    <AccordionBody accordionId="1">
                   <Row>
                   <Col>
                       <div>
                         <h5>
                           <b> Basic Details </b>
                         </h5>
                         <br></br>
                         <h6> Name:<b>{data1["salutation"] + data1["firstName"] 
                         + data1["lastName"]
                         }</b> </h6>
                         <h6>Email: <b>{data1["email"]}</b>  </h6>
                         <h6> Phone Number: <b> {data1["phoneNumber"]}</b></h6>
                       </div>
                     </Col>

                 <Col>
                   <div>
                     <h5>
                       <b> Address data1</b>
                     </h5>
                     <br></br>

                     <h6>
                       Address One: <b>{data1["addressOne"]}</b>
                     </h6>                        
                     <h6>
                       Anniversary Date: <b>{data1["anniversary"]}</b>
                     </h6>
                     <h6>
                       Company: <b>{data1["accountName"]}</b>
                     </h6>
                     <h6>
                       Country: <b>{data1["countriesname"]}</b>
                     </h6>
                     <h6>
                       State: <b>{data1["state"]}</b>
                     </h6>
                     <h6>
                       City: <b>{data1["city"]}</b>
                     </h6>
                     <h6>
                       PostalCode: <b>{data1["postalCode"]}</b>
                     </h6>
                   </div>
                 </Col>
                   </Row>
                   </AccordionBody>
                  </AccordionItem>
                </UncontrolledAccordion>
                 </Row>                   
               </div>
             </Col>                
           </Row>   
           </Col>

           <br></br>

           <Col>
           <Row>
             <Col>
               <div className="mb-1">
                 <Row>
                 <UncontrolledAccordion defaultOpen='1'>
                   <AccordionItem>
                 <AccordionHeader
                   style={{ backgroundColor: "#F2E5D9" }}
                   targetId="1" >
                   <b> Company Details and GST </b>
                    </AccordionHeader>
                    <AccordionBody accordionId="1">
                   <Row>
                   <Col>
                  
                   <Row>
                       <Col> <h6>
                       Company: <b>{data1["accountName"]}</b>
                     </h6> </Col>
                       
                       <Col> <h6> GST Number: <b>{data1["gstID"]}</b> </h6>  </Col>
                       </Row>  
                 </Col>
                   </Row>
                   </AccordionBody>
                  </AccordionItem>
                </UncontrolledAccordion>
                 </Row>                   
               </div>
             </Col>                
           </Row> 
           </Col>

           <br></br>

           <Col>
           <Row>
             <Col>
               <div className="mb-1">
                 <Row>
                 <UncontrolledAccordion defaultOpen='1'>
                   <AccordionItem>      
                   <AccordionHeader
                   style={{ backgroundColor: "#F2E5D9" }}
                   targetId="1" >
                   <b>  ID data1 </b>
                    </AccordionHeader>
                   <AccordionBody accordionId="1">
                   <Row>
                   
             <h5 > <b>  ID Details </b> </h5>
  
               <Row>
               <h6> ID Type: {data1["IDType"]}</h6>        
                 <h6> ID Number: {data1["idNumber"]}</h6>    
                 <h6> Expiry Date: {data1["expiryDate"]}</h6>
               </Row>
              
 
        
                 {/* <DataGrid/> */}
                   </Row>
                   </AccordionBody>
                  </AccordionItem>
                </UncontrolledAccordion>
                 </Row>                   
               </div>
             </Col>                
           </Row> 
           </Col>

           <br></br>

           

            <br></br>

           <Col>
           <Row>
             <Col>
               <div className="mb-1">
                 <Row>
                 <UncontrolledAccordion defaultOpen='1'>
                   <AccordionItem> 
                   <AccordionHeader
                   style={{ backgroundColor: "#F2E5D9" }}
                   targetId="1" >
                   <b>Other Details </b>
                    </AccordionHeader>
                   <AccordionBody accordionId="1">
                   <Row>
                   <Col>
                   
                      <Row>
                      <Col> <h6>DOB: <b> {data1["dob"]}</b> </h6></Col>
                      <Col> <h6>Anniversary Date: <b>{data1["anniversary"]}</b> </h6></Col>
                      <Col> <h6> Guest Preference Notes: <b>{data1["guestpreferencenotes"]} </b> </h6> </Col>
                       
                       </Row>  
                 </Col>
                   </Row>
                   </AccordionBody>
                  </AccordionItem>
                </UncontrolledAccordion>
                 </Row>                   
               </div>
             </Col>                
           </Row> 
           
           
           </Col>

       
     </Col>
    </ModalBody>
 </Modal>
</div>

<div>
  <Modal isOpen={guestProfile} toggle={() => setGuestProfile(!guestProfile)} className='modal-lg'>
   <ModalHeader className='modal-lg' toggle={() => setGuestProfile(!guestProfile)}> Add Guest</ModalHeader>
    <ModalBody className='pb-3 px-sm-1 mx-20'>         
     <AddGuest />        
    </ModalBody>
 </Modal>
</div>

    <Row className='mb-1'>
      <Col md='3' sm='12' className='me-1'>
        <Label className='form-label' for='fullName'>
          Search
        </Label>
        <Input
          type="text"
          id="filter-text-box50"
          placeholder="Filter..."
          onInput={onFilterTextBoxChanged10}
        />
      </Col>
      <Col md='3' sm='12' className='me-1'>
        <br></br> &nbsp;&nbsp;&nbsp;
        <Button align='right' color='primary' onClick={() =>{ setGuestProfile(!guestProfile)}}> Add New Guest</Button>
      </Col>
    </Row> 
  <div className="ag-theme-alpine" style={{ height: 520 }}>
    <AgGridReact
      ref={gridRef}
      rowData={rowData}
      columnDefs={columnDefs}
      animateRows={true}
      rowSelection='multiple'
      onCellClicked={cellClickedListener}
      paginationPageSize='10'
      pagination='true'
      defaultColDef={defaultColDef}
      headerColor="ddw-primary"
    />
  </div>
</div>
)
}






const GuestModify=(data1)=>{
//console.log(data1.data1)
// Modals
  const [guestSearch, setGuestSerach] = useState();
  const [guestEdit, setGuestEdit] = useState();


  const [details,setDetails] = useState('')

   useEffect(() => {
    //console.log("Hii")
    fetchx(API_URL + "/getReservationGuestDetails", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID:'1',
            reservationID:data1['data1']['id'],
            })
        }).then(result => result.json())
        .then(rowData => {
          // //console.log(hotelID)
          //console.log(data1['data1']['id'])
            //console.log(rowData['data'])
            setDetails(rowData['data'][0])               
          }).catch((error) => {
            //console.log(error)
          })
          //console.log(data1['data1']['guestID'])
          if(data1['data1']['guestID']){
          fetchx(API_URL + `/getGuestInformation?hotelID=1&guestID=${data1['data1']['guestID']}`)
          .then((result) => result.json())
          .then((resp) => {
            //console.log(resp["data"][0])
            const guestData = resp["data"][0];
            //console.log(guestData.nationalityName); 
            sessionStorage.setItem('Nationality',guestData.nationalityName)
            sessionStorage.setItem('NationalityID',guestData.nationality)
            //console.log(sessionStorage.getItem('Nationality'))              
          });
        }
    }, [])
    //console.log(details)
    // //console.log(details['ETA'])
    //console.log(data1)
    

  return(
   <div>
       <div>
      <Modal isOpen={guestSearch} toggle={() => setGuestSerach(!guestSearch)} className='modal-xl'>
       <ModalHeader className='modal-lg' toggle={() => setGuestSerach(!guestSearch)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>         
         <GuestModification data1={data1} />        
        </ModalBody>
     </Modal>
    </div>
    <div>
      <Modal isOpen={guestEdit} toggle={() => setGuestEdit(!guestEdit)} className='modal-xl'>
       <ModalHeader className='modal-lg' toggle={() => setGuestEdit(!guestEdit)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>         
         <EditGuest data2={details} />        
        </ModalBody>
     </Modal>
    </div>

     <Card>
      <div  align='end' className='buttons' >
       <Button className='me-1'  style={{float:'right'}}  color='primary' onClick={() =>{ setGuestEdit(!guestEdit)}}>
       <Edit2 style={{ height: "20px" }} />
       </Button>
       {/* <Button className='me-1'  outline color='secondary'  style={{float:'right'}} onClick={() =>{setGuestSerach(!guestSearch)}} >
       <Search style={{ height: "20px" }} />
       </Button> */}
      </div>
            
       
    <CardTitle style={{backgroundColor:'#F2E5D9'}}>
      Guest Details
    </CardTitle>
    <Row>
    <Col>
         
         {/* <Form onSubmit={handleSubmit(onSubmit)}> */}
           <Col>
           <Row>
             <Col>
               <div className="mb-1">
                 <Row>
                 <UncontrolledAccordion defaultOpen='1'>
                             <AccordionItem>
                 <AccordionHeader
                   style={{ backgroundColor: "#F2E5D9" }}
                   targetId="1"
                 >
                   <b> Overview </b>
                    </AccordionHeader>
                    <AccordionBody accordionId="1">
                   <Row>
                   <Col>
                       <div>
                         <h5>
                           <b> Basic Details </b>
                         </h5>
                         <br></br>
                         <h6> Name:<b>{details["salutation"] + details["firstName"] 
                         + details["lastName"]
                         }</b> </h6>
                         <h6>Email: <b>{details["email"]}</b>  </h6>
                         <h6> Phone Number: <b> {details["guestNumbers"]}</b></h6>
                       </div>
                     </Col>

                 <Col>
                   <div>
                     <h5>
                       <b> Address Details</b>
                     </h5>
                     <br></br>

                     <h6>
                       Address One: <b>{details["addressOne"]}</b>
                     </h6>                        
                     <h6>
                     Address Two: <b>{details["addressTwo"]}</b>
                     </h6>
                     <h6>
                       {/* Company: <b>{details["guestCompanyName"]}</b> */}
                     </h6>
                     <h6>
                       Country: <b>{details["countriesname"]}</b>
                     </h6>
                     <h6>
                       State: <b>{details["state"]}</b>
                     </h6>
                     <h6>
                       City: <b>{details["city"]}</b>
                     </h6>
                     <h6>
                       PostalCode: <b>{details["postalCode"]}</b>
                     </h6>
                   </div>
                 </Col>
                   </Row>
                   </AccordionBody>
                  </AccordionItem>
                </UncontrolledAccordion>
                 </Row>                   
               </div>
             </Col>                
           </Row>   
           </Col>

           <br></br>

           <Col>
           <Row>
             <Col>
               <div className="mb-1">
                 <Row>
                 <UncontrolledAccordion defaultOpen='1'>
                   <AccordionItem>
                 <AccordionHeader
                   style={{ backgroundColor: "#F2E5D9" }}
                   targetId="1" >
                   <b> Company Details and GST </b>
                    </AccordionHeader>
                    <AccordionBody accordionId="1">
                   <Row>
                   <Col>
                  
                   <Row>
                       <Col> <h6>
                       Company: <b>{details["guestCompanyName"]}</b>
                     </h6> </Col>
                       
                       <Col> <h6> GST Number: <b>{details["gstId"]}</b> </h6>  </Col>
                       </Row>  
                 </Col>
                   </Row>
                   </AccordionBody>
                  </AccordionItem>
                </UncontrolledAccordion>
                 </Row>                   
               </div>
             </Col>                
           </Row> 
           </Col>

           <br></br>

           <Col>
           <Row>
             <Col>
               <div className="mb-1">
                 <Row>
                 <UncontrolledAccordion defaultOpen='1'>
                   <AccordionItem>      
                   <AccordionHeader
                   style={{ backgroundColor: "#F2E5D9" }}
                   targetId="1" >
                   <b>  ID Details </b>
                    </AccordionHeader>
                   <AccordionBody accordionId="1">
                   <Row>                   
                {/*   
               <Row>
               <h6> ID Type: {details["IDType"]}</h6>        
                 <h6> ID Number: {details["idNumber"]}</h6>    
                 <h6> Expiry Date: {details["expiryDate"]}</h6>
               </Row> */}
                <ViewIDDetails data1={data1} />

                </Row>
                   </AccordionBody>
                  </AccordionItem>
                </UncontrolledAccordion>
                 </Row>                   
               </div>
             </Col>                
           </Row> 
           </Col>

           <br></br>

           {/* <Col>
           <Row>
             <Col>
               <div className="mb-1">
                 <Row>
                 <UncontrolledAccordion defaultOpen='1'>
                   <AccordionItem> 
                   <AccordionHeader
                   style={{ backgroundColor: "#F2E5D9" }}
                   targetId="1" >
                   <b>Membership Details </b>
                    </AccordionHeader>
                   <AccordionBody accordionId="1">
                   <Row>
                   <Col>
                      <Row>
                      { details &&
                      <>
                       <Col> <h6>Membership Type: {details["membershipType"]} </h6> </Col>
                       <Col> <h6>Membership Number: {details["membershipNo"]} </h6> </Col>
                       <Col> <h6> Membership Level: {details["membershipLevel"]}</h6> </Col>
                       </>
                     }
                      </Row>                        
                   
                 </Col>
                   </Row>
                   </AccordionBody>
                  </AccordionItem>
                </UncontrolledAccordion>
                 </Row>                   
               </div>
             </Col>                
           </Row>  
           </Col> */}

            <br></br>

           <Col>
           <Row>
             <Col>
               <div className="mb-1">
                 <Row>
                 <UncontrolledAccordion defaultOpen='1'>
                   <AccordionItem> 
                   <AccordionHeader
                   style={{ backgroundColor: "#F2E5D9" }}
                   targetId="1" >
                   <b>Other Details </b>
                    </AccordionHeader>
                   <AccordionBody accordionId="1">
                   <Row>
                   <Col>
                   
                      <Row>
                      <Col> <h6>DOB: <b> {details["dob"]}</b> </h6></Col>
                      <Col> <h6>Anniversary Date: <b>{details["anniversary"]}</b> </h6></Col>
                      <Col> <h6> Guest Notes: <b>{details["notes"]} </b> </h6> </Col>
                      <Col> <h6> Guest Preference Notes: <b>{details["guestpreferencenotes"]} </b> </h6> </Col>
                       
                       </Row>  
                 </Col>
                   </Row>
                   </AccordionBody>
                  </AccordionItem>
                </UncontrolledAccordion>
                 </Row>                   
               </div>
             </Col>                
           </Row> 
           
           
           </Col>

       
     </Col>
           
   
        {/* <div className="col">
          <div className="card">
            <h5><b>Basic Details</b></h5>
            <br />
            <h6>Name: <b>{details["salutation"] + details["firstName"] + details["lastName"]}</b></h6>
            <h6>Email: <b>{details["email"]}</b></h6>
            <h6>Phone Number: <b>{details["phoneNumber"]}</b></h6>
          </div>
        </div> */}


 
  {/* <Col>
         <div className="mb-1">
           <Card>
             <h5 > <b>  ID Details </b> </h5>
  
                 <h6> ID Type: {details["IDType"]}</h6>        
                 <h6> ID Number: {details["idNumber"]}</h6>    
                 <h6> Expiry Date: {details["expiryDate"]}</h6>
              
 
             </Card>
         </div>
       </Col>   */}
  
      {/* <div className="mb-1">
        <br/>
        <Row>
        <Card>
          <Row>
          <Col>
           <h5><b> Company Details and GST</b> </h5>
           <br/>
           <h6>Company: <b>{details["accountName"]}</b> </h6>               
           <h6> GST Number: <b>{details["gstID"]}</b> </h6>  
           <h6>VIP ID :<b>{details["vipType"]} </b> </h6>               
        </Col>
        <Col>
        <Card>
           <h5 > <b>  Membership Details </b> </h5>
              <br/>
              <h6>Membership Type: {details["membershipType"]}   </h6> 
              <h6>Membership Number: {details["membershipNo"]}   </h6> 
              <h6>Membership Level: {details["membershipLevel"]} </h6>                         
              <h6>Membership Since: {details["membershipSince"]} </h6>  
              <h6> Membership Expiry: {details["expiryDate"]}    </h6> 
       </Card>
        </Col>
        <Col></Col>
          </Row>
          </Card>
        </Row>                   
         </div> */}
       
 </Row>
    </Card>
   </div>
  
  )

}

export default GuestModify
