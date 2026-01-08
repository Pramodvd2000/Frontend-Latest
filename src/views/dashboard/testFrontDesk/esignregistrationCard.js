import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input,InputGroup, InputGroupText } from 'reactstrap'
// import Logo from './oterra.jpg';
import {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import API_URL from '../../../config';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

// import "./A4style.scss";
function App({data1,toggleModal}) {
  const [details,setDetails] = useState('')
  const [iddetails,setIDDetails] = useState('')
  const [hotelDetails, setHotelDetails] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [hotelAddress, setHotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const handleErrorReg = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }

  useEffect(() => {

    fetchx(API_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
      .then(postres => {
        setHotelDetails(postres['data'])
        setHotelAddress(postres['data'][0]['address'])
        setHotelName(postres['data'][0]['name'])
        setHotelNo(postres['data'][0]['phoneNumber'])
        sethotelFax(postres['data'][0]['fax'])
        setLogo(postres['data'][0]['logo'])
      })

      
    fetchx(API_URL + "/getReservationGuestDetails", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID:'1',
            reservationID:data1.id,
            })
        }).then(result => result.json())
        .then(rowData => {
          // if (rowData['data'][0]['roomNumber'] === null) {
          //   handleErrorReg("Can't print registration card !! (please assign the room first)")
          //   toggleModal()
          //   return;
  
          // }
          // else{
          rowData['data'].forEach(item => {
            if (item.IDType === 'passport') {
              setIDDetails(item);
            }
          });
            setDetails(rowData['data'][0])
            localStorage.setItem('guestidDetail',(rowData['data'][0]['id'])); 
        // }
          }).catch((error) => {
          })
    }, [])



    const [encodedSignature, setEncodedSignature] = useState('');

    useEffect(() => {
    if (details && details['maxSignature']) {
      const binaryData = new Uint8Array(atob(details['maxSignature']).split('').map(char => char.charCodeAt(0)));
      const encodedBinaryData = btoa(String.fromCharCode(...binaryData));
      setEncodedSignature(encodedBinaryData);
    }
  }, [details]);

 

  const[logostatus, setlogostatus] = useState()
  const [imagelogo, setimage] = useState()


useEffect(() => {
 const hotelID = JSON.stringify({
   hotelID: 10
 })
 console.log(hotelID)
 fetchx(API_URL + "/getHotelConfigByhotelID", {
   method: "POST",
   headers: { 'Content-Type': 'application/json' },
   body: hotelID
 }).then((res) => res.json())
 .then(response => {
   console.log(response)
   console.log(response["data"][0]["netZeroLogoName"])
   setimage(response["data"][0]["netZeroLogoName"])
   setlogostatus(response["data"][0]["isNetZeroLogo"])

 })
},[])


  return(
    <div>
    {/* {details !== '' && */}
    <div style={{ width:'210mm'}}>  
     <div style={{width:'210mm',paddingTop:'10px'}}>
                <tr>
                  <td >
                  <div style={{paddingLeft:'30px', paddingTop:'5px'}}>
                  {/* <img style={{ width: '80px', height: '80px',display:'block', marginBottom:'20px',marginLeft:'auto',marginRight:'auto' }} src={Logo} /> */}
                  <img style={{   width: '80px',   height: '80px',   display: 'block',   marginBottom: '20px',   marginLeft: 'auto',   marginRight: 'auto' }} src={API_URL+`/imagepaths/${logoimage}`} alt="Hotel Logo" onError={(e) => {   console.log('Error loading image:', e); }}/>
                  </div>
                  </td>  
   
                  <td style={{width:'300px'}}>
   
                  </td>
   
                  <td  style={{textAlign:'right'}}>
                  <th class="align-bottom" colspan="6" >
                  <p style={{ 'text-align': 'right', 'font-style': 'normal', color: 'black'}}>
                  <font style={{ 'font-size': '14px', 'line-height': '100%' }}><b >{hotelName}</b></font>
                           
                  <br/>{hotelAddress}
                  <br/>Contact no:{hotelNo} |F + {hotelFax}
                  {/* | F: +91 80 3985 4519  */}
                  </p>
                 
                 
                  </th>
                  </td>  
                  </tr>  
                </div>
   
                <h4 style={{paddingLeft:'250px', color: 'black'}}>REGISTRATION CARD</h4>  
   
   
   
        <div style={{color:'black'}}>
        <div style={{paddingLeft:'10px', paddingRight:'5px'}}>
         <table  style={{border:'1px solid black','width':'202mm' ,height:'60mm', color: 'black' }}>      
            <tr>
               <td style={{paddingLeft:'10px'}} colSpan={4}> Title     </td>
               <td colSpan={4}>FirstName </td>
               <td colSpan={4}>Surname    </td>              
          </tr>
            <tr style={{borderBottom:'0.5px solid #575b63',height:'25px'}} >  
            <td style={{paddingLeft:'10px'}} colSpan={4}> <b>{details["salutation"]}  </b> </td>  
            <td  colSpan={4}> <b>{details["firstName"]}        </b> </td>  
            <td  colSpan={4}> <b>{details["lastName"]}    </b> </td>
            </tr>
     
          <tr>
             <td style={{paddingLeft:'10px'}} colSpan={12}>Address &nbsp; </td>
          </tr>
          <tr style={{borderBottom:'0.5px solid #575b63', height:'25px'}}>
            <td style={{paddingLeft:'10px'}} colSpan={12}> <b>
              {(details["addressOne"] === null ? ' ' : details["addressOne"]) + ' ' +
               (details["city"] === null ? ' ' : details["city"]) + ' ' +
               (details["state"] === null ? ' ' : details["state"]) + ' ' +
               (details["postalCode"] === null ? ' ' : details["postalCode"]) + ' ' +
               (details["countriesname"] === null ? ' ' : details["countriesname"])} </b></td>
          </tr>    
          <tr >  
            <td style={{paddingLeft:'10px', width:'50%'}} colSpan={6}> E-Mail </td>
            <td colSpan={6}> Mobile </td>
         </tr>
   
   
   
          <tr style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>
           <td style={{paddingLeft:'10px', width:'50%'}} colSpan={6}><b>{details["email"]}</b> </td>
           <td colSpan={6}><b>{details["guestNumbers"]}</b> </td>
          </tr>
          <tr>
            <td style={{paddingLeft:'10px', width:'50%'}} colSpan={6}>Date of Birth  </td>
            <td colSpan={6}>Company  </td>    
          </tr>
          <tr style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>
            <td style={{paddingLeft:'10px', width:'50%'}} colSpan={6}><b>{details["dob"]=== null  ? ' ' : details["dob"]}</b>  </td>
            <td colSpan={6}><b>{details["resCompanyName"]}</b></td>      
          </tr>
         
          <tr >  
            <td style={{paddingLeft:'10px'}} colSpan={6}> Passport Number</td>  
            <td colSpan={6}> Nationality </td>  
          </tr>
          <tr style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>  
            <td style={{paddingLeft:'10px'}} colSpan={6}> <b>{iddetails["IDType"]=== 'passport' ? iddetails["idNumber"] : ''} </b></td>  
            <td colSpan={6}> <b>{details["nationalityName"]} </b></td>  
          </tr>
          <tr>  
            <td style={{paddingLeft:'10px'}}colSpan={6}>Passport Issue Date </td>  
            <td colSpan={6}>Place of Issue </td>  
          </tr>
          <tr style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>  
            <td style={{paddingLeft:'10px'}}colSpan={6}> <b>{iddetails["IDType"] === 'passport' ? iddetails["issueDate"] : ' '} </b></td>  
            <td colSpan={6}> <b>{iddetails["IDType"] === 'passport' ? iddetails["issuePlace"] :' '} </b></td>  
          </tr>
          <tr>  
            <td style={{paddingLeft:'10px'}}colSpan={6}>Visa Number </td>  
            <td colSpan={6}>Visa Issue Date </td>  
          </tr>
          <tr style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>  
            <td style={{paddingLeft:'10px'}}colSpan={6}> <b>{details["maxVisaNumber"]} </b></td>  
            <td colSpan={6}> <b>{details["maxVisaIssueDate"]} </b></td>  
          </tr>  
         </table>
         </div>  
            </div>
         
            {/* paymentTypeCode */}
         
          <br></br>
         
            <div style={{color:'black'}} >
            <div style={{paddingLeft:'10px', paddingRight:'5px'}}>
            <table  style={{border:'1px solid black','width':'202mm' ,height:'60mm', color: 'black'}}>
            <div style={{paddingLeft:'10px',paddingRight:'10px'}}>
              <tr>        
                <td colSpan={6}>Payment By       </td>
                <td colSpan={3}>Credit Card       </td>
                <td colSpan={3}>Expiry Date       </td>
                </tr>
                <tr  style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>
                
                  <td colSpan={6}><b>{details["paymentTypeCode"]}</b>  </td>
                <td colSpan={3}><b>{details["maskedCardNumber"]}</b>     </td>
                <td colSpan={3}><b>{details["cardExpiryDate"]}</b>     </td>
              </tr>  
             
              <tr>        
                <td colSpan={3}>Arrival Date  </td>  
                <td colSpan={3}>Arrival Time  </td>
                <td colSpan={3}>Flight        </td>
                <td colSpan={3}>Arrival From  </td>
                {/* <td colSpan={3}>Date of arrival in India </td>             */}
              </tr>  
              <tr  style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>      
                <td colSpan={3}><b>{details["arrivalDate"]}</b> </td>  
                <td colSpan={3}><b>{details["ETA"]}</b> </td>  
                <td colSpan={3}><b> <i>{details["pickUpCarrierCode"]}</i>             </b> </td>
                <td colSpan={3}><b></b> </td>  
              </tr>
                 
              <tr>        
                  <td colSpan={3}>Departure Date   </td>
                  <td colSpan={3}>Departure Time   </td>
                  <td colSpan={3}>Flight           </td>
                  <td colSpan={3}>  </td>          
            </tr>
            <tr  style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>        
             <td colSpan={3}><b>{details["departureDate"]}</b></td>  
             <td colSpan={3}><b>{details["ETD"]}     </b></td>
             <td colSpan={3}> <b>      <i>{details["dropCarrierCode"]}</i>                    </b></td>        
             <td colSpan={3}> <b>             </b></td>  
            </tr>
   
            <tr>  
              <td colSpan={3}> Room number </td>  
              <td colSpan={3}> Room Category </td>  
              <td colSpan={3}> Room Rate</td>
              <td colSpan={3}> Package</td>                
            </tr>
              <tr  style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>          
                <td colSpan={3}><b>{details["roomNumber"]}         </b></td>  
                <td colSpan={3}><b>{details["roomType"]}   </b></td>
                <td colSpan={3}><b>{details.printRate == 1 ? details["rate"] : null}         </b></td>
                <td colSpan={3}><b>{details["packageCode"]}</b></td>                  
              </tr>
              <tr>  
              <td colSpan={3}> Pax</td>  
              <td colSpan={3}> No. of Nights </td>  
              <td colSpan={6}> Billing Instructions</td>
              {/* <td colSpan={3}> Package</td>                 */}
            </tr>
              <tr  style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>          
                <td colSpan={3}><b>{details["numberOfAdults"]}         </b></td>  
                <td colSpan={3}><b>{details["numberOfNights"]}   </b></td>
                <td colSpan={3}><b>{details["billingInstruction"]}         </b></td>
                {/* <td colSpan={3}><b>{details["packageCode"]}</b></td>                   */}
              </tr>
              <tr>  
                <td colSpan={6}>Prefernces </td>  
                <td colSpan={6}>Extras </td>  
              </tr>
              <tr style={{borderBottom:'0.5px solid #575b63',height:'25px'}}>
                <td colSpan={6}><b>{details['preference']}</b></td>
                <td colSpan={6}><b>{details['extra']}</b></td>
              </tr>
            
                <tr>
                  <td colSpan={12} style={{fontSize:'9px', textAlign:'justify'}} > I agree to abide by the above terms and conditions governing my/our stay in the hotel:
                1.Tariff: The rate on the confirmation is for accommodation charges per night exclusive of taxes. Extra occupant charges will be applicable as per the occupancy in the room. Resident guests should obtain key cards from reception after registering the extra occupant. 2.Bills must be settled on presentation. Cheques are not accepted. 3.Company Lien on visitors Luggage & Belongings: In case of default of payment of dues by a guest the management shall be entitled to a lien on the luggage & belongings and to detain the same and to sell or auction such property at any time after the date of departure without reference to the party and appropriate the net sale proceeds towards the amount due by the guest. 4.Check-in/Checkout: Our Check-in time is 1500 hrs and Check-out time is 1200 hrs. If you wish to avail a late checkout the same can be extended subject to availability and at additional room charges, 50% room charges up to 1800hrs and 100% room charges beyond 1800hrs. 5.Visitor and Belongings: Visitors are requested to lock the doors of their room when going out/going to bed. The company will not in any way whatsoever be responsible for the loss of the guest's goods and any other property not entrusted to the management or for damage therefore whether due to neglect of hotel staff any other cause whatsoever including theft or pilferage. 6.Hazardous Goods: Storing of combustible or hazardous materials in guest rooms are strictly prohibited. 7.Management Rights: The management reserves to itself the absolute right of any admission to any person in the hotel premises and to request any guest to vacate his or her room at any room moment without previous notice and without assigning any reason whatsoever and the guest shall be bound to vacate when requested to do so. In default the management will be entitled to remove the luggage of the visitor from the room occupied by him/her & lock the room. 8.Visitors: Visitors are not permitted in guest rooms after 2000Hrs, beyond which guests can entertain their visitors in any public area of the hotel which is accessible 9. Government Rules & Regulations: Guests are requested to observe the Govt Rules & Regulations in force from time to time in respect of registration alcoholic drinks firearms etc. 10.Amendment Rules: The management reserves to itself the right to add or to amend any of the above term conditions & rules. 11.Disputes: All disputes are subject to the jurisdiction of the Bangalore courts only. 12.The company's anti-sexual harassment policy applies to all guest staying in the hotel and persons involved in the operations and prohibits harassment by any guest or team member of the company towards          
               </td> </tr>
             
               <tr style={{height:'25px'}}>
               <td colSpan={4}> </td>
                <td colSpan={4} style={{textAlign:'center'}} > </td>
                {/* <td colSpan={4} style={{textAlign:'right',height:'25px', width:'35px'}} > {details['maxSignature']} </td> */}
                <td colSpan={4}> <b>
                {encodedSignature && (
                 <img
                   src={`data:image/jpeg;base64,${encodedSignature}`}
                   alt="Signature"
                   style={{ maxWidth: '170px', maxHeight: '75px', paddingLeft: '70px', paddingRight: '10px' , margin: '0 auto', }} // Adjust the dimensions as needed
                 />
               )}
               </b>
                </td>
               
                </tr>
             
               <tr>
                <td colSpan={4}>FO Associate </td>
                <td colSpan={4} style={{textAlign:'center', paddingRight:'50px'}} >Duty Manager   </td>
                <td colSpan={4} style={{textAlign:'right', paddingRight: '60px' }} >Guest signature </td>
               </tr>
              </div>
              </table>
              </div>  
            </div>
          <br></br>
          {/* </div> */}
        <br></br>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        {logostatus === 1 ? (
            <img src={API_URL + `/imagepaths/${imagelogo}`} alt="NatZero Logo" style={{ width: '100px', height: '80px' }} />
        ) : (
            <div> </div>
        )}
    </div>
    </div>
)
}
export default App;