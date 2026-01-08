import { useEffect, useState } from 'react'
import "./style.scss";
// import Logo from '../../oterra.jpg';
import '@styles/base/pages/app-invoice-print.scss'
import API_URL from '../../../../config'

const confirmationLetter = () => {
  const [iddetails,setIDDetails] = useState('')
  const [details,setDetails] = useState('')
  const [hotelDetails, setHotelDetails] = useState(null);
    const [logoimage, setLogo] = useState(null);
    const [hotelAddress, setHotelAddress] = useState(null);
    const [hotelName, setHotelName] = useState(null);
    const [hotelNo, setHotelNo] = useState(null);
    const[hotelFax,sethotelFax] = useState(null)
    const [hotelReservationPolicy, sethotelReservationPolicy] = useState(null);
    const [hotelBillPolicy, sethotelBillPolicy] = useState(null);
    const [hotelAirportTransfers, sethotelAirportTransfers] = useState(null);
    const [hotelCancelPolicy, sethotelCancelPolicy] = useState(null);
    const [hotelEmail, sethotelEmail] = useState(null);
    const [hotelnote, sethotelNote] = useState(null);
    const [dutyManagerEmail, setDutyManagerEmail] = useState(null);
    const [dutyManagerPhNo, setDutyManagerPhNo] = useState(null);
    const [hotelPostalCode,setHotelPostalCode] = useState(null)
    const [country, setHotelCountry] = useState(null)
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
        sethotelReservationPolicy(postres['data'][0]['reservationPolicy'])
        sethotelBillPolicy(postres['data'][0]['billingDetails'])
        sethotelEmail(postres['data'][0]['email'])
        sethotelAirportTransfers(postres['data'][0]['airportTransfer'])
        sethotelCancelPolicy(postres['data'][0]['cancellationPolicy'])
        sethotelNote(postres['data'][0]['cnfLetterNote'])
        setDutyManagerEmail(postres['data'][0]['dutyManagerEmail'])
        setDutyManagerPhNo(postres['data'][0]['dutyManagerPhNo'])
        setHotelPostalCode(postres['data'][0]['postalcode'])
        setHotelPostalCode(postres['data'][0]['postalcode'])
        setHotelCountry(postres['data'][0]['country'])
      })
 
    // console.log(localStorage.getItem('guestData'))          
    fetchx(API_URL + "/getConfirmationGuestDetails", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID:'1',
            sharingID:localStorage.getItem('guestData'),
            })
        }).then(result => result.json())
        .then(rowData => {
                 rowData['data'].forEach(item => {
            if (item.IDType === 'passport') {
              setIDDetails(item);
            }
          });
            console.log(rowData['data'])
            setDetails(rowData['data'][0]) 
          }).catch((error) => {
            console.log(error)
          })
    }, [])

  // ** Print on mount
  useEffect(() => {
    fetchx(API_URL + "/getConfirmationGuestDetails", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID:'1',
        sharingID:localStorage.getItem('guestData'),
        })
    }).then(result => result.json())
    .then(rowData => {
      setDetails(rowData['data'][0])       
      }).catch((error) => {
        // console.log(error)
      })
    setTimeout(() => window.print(), 1000)
    const divToPrint = document.getElementById('divId');
  }, [])


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

  return (   
    <div >
  <div>
  {/* <img style={{ width: '60px', height: '60px',display:'block',marginLeft:'auto', marginRight:'auto' }} src={Logo} /> */}
  <img style={{ width: '60px', height: '60px',display:'block',marginLeft:'auto', marginRight:'auto' }}  src={API_URL+`/imagepaths/${logoimage}`}  alt="Hotel Logo" onError={(e) => {   console.log('Error loading image:', e); }} />

  </div>
  <div style={{color:'black', paddingLeft:'10px'}}>
    <div style={{'margin-left': '3px','font-weight': 'bold', fontSize: '12px', color: 'black'}} class='row'>Dear {details['firstName'] +' '+ details.lastName},</div>
    <p style={{fontSize:'11px', lineHeight:'1.5', color: 'black'}}>Thank you for choosing {hotelName}. We are pleased to confirm your reservation as follows:<br></br>
    Please review your reservation details for accuracy:
    </p>
    <table style={{width:'210mm', fontSize: '10px' , color: 'black'}}>
      <tr>
        <td colSpan={6} style={{ fontSize: '10px'}}><b style={{ fontSize: '11px' }}>Guest Name  </b> <span style={{ marginLeft: '67px'}}>  : {details['salutation']+' '+  details['firstName'] +' '+ details.lastName} </span></td>
        <td colSpan={6}><b>Company    </b> <span style={{fontSize:'10px', marginLeft: '75px'}}>:{details['companyName']}</span>  </td>
      </tr>

      <tr>
      <td colSpan={6}> <b>Arrival Date/Time  </b>  <span style={{ marginLeft: '46px'}}> :{details["arrivalDate"]}</span> </td> 
        <td colSpan={6}> <b>Travel Agent </b> <span style={{ fontSize:'10px',marginLeft: '58px'}}></span> :{details["agentName"]} </td> 
      </tr>
      
      <tr>
        <td colSpan={6}> <b>Departure Date/Time </b>  <span style={{ marginLeft: '26px'}}>: {details["departureDate"]} </span> </td> 
        <td colSpan={6}> <b>Number of Persons</b>    <span style={{ marginLeft: '23px'}}>: {details["numberOfAdults"]}</span> </td> 
      </tr>
      
      <tr>
        <td colSpan={6}> <b>Room Type </b>       <span style={{ marginLeft: '79px'}}> : {details["roomType"]} </span> </td> 
        <td colSpan={6}> <b>Number of Rooms</b>  <span style={{ marginLeft: '28px'}}> : {details["numberOfRooms"]}</span> </td> 
      </tr>
      <tr>
        <td colSpan={6}> <b>Room Rate </b>  <span style={{ marginLeft: '80px'}}> : {details.printRate == 1 ? details["rate"] : null} </span></td>  
        <td colSpan={6}> <b>ConfirmationNumber</b> <span style={{ marginLeft: '10px'}}> : {details.bookingID}</span></td>  

      </tr>
      
      <tr>
        <td colSpan={6}> <b>Package   </b> <span style={{ marginLeft: '92px'}}>            :{details["packageCode"]}</span> </td>  
        <td colSpan={6}> <b>Membership Number </b> <span style={{ marginLeft: '10px'}}>   :{details["membershipNo"]}</span> </td>  
      </tr>
      
      <tr>
        <td colSpan={6}> <b>Booker Name </b> <span style={{ marginLeft: '66px'}}>    : {details["bookerName"]}</span> </td>  
        <td colSpan={6}> <b>Sharer Details</b> <span style={{ marginLeft: '49px'}}>  : {details["sharer_names"]}</span> </td>  
      </tr>
      <tr>
        <td style={{ fontSize: '11px' }} colSpan={12}>To facilitate express check-in, may we request you to kindly furnish other details not specified herein: </td>
      </tr>
      <tr>
        <td colSpan={6}><b>Pickup Required (Yes/No) </b> : {details["pickUpID"] === null ? 'NO' : 'YES'}  </td>  
        <td colSpan={6}><b> Drop Required (Yes/No)</b> : {details["dropID"] === null ? 'NO' : 'YES'}  </td>  
      </tr>

      <tr>
        <td colSpan={6}><b>Arrival Flight Number </b>  <span style={{ marginLeft: '20px'}}>  : {details["pickUpCarrierCode"]}</span></td>  
        <td colSpan={6}><b> Arrival Time</b> <span style={{ marginLeft: '63px'}}> : {(details["pickUpDate"] === null ? ' ' : details["pickUpDate"])+' '+(details["pickUpTime"] === null ? ' ' : details["pickUpTime"])}</span></td>  
      </tr>
      
      <tr>
        <td colSpan={6}><b>Departure Flight Number </b>   : {details["dropCarrierCode"]}</td>  
        <td colSpan={6}> <b>Departure Time </b>   <span style={{ marginLeft: '431x'}}>  : {(details["dropDate"] === null ? ' ' : details["dropDate"])+' '+(details["dropTime"] === null ? ' ' : details["dropTime"]) }</span></td>  
      </tr>
      <tr>
     <td colSpan={10} style={{ wordWrap: 'break-word' }}> <b>Inclusions</b> <span style={{ marginLeft: '82px', whiteSpace: 'pre-wrap' }}>
      :{details["extra"]}  </span>
  </td>
  <td colSpan={2} ></td>
</tr>

      <tr>
      <td colSpan={12} style={{ fontSize: '10px' }}>For any assistance at the airport please contact our Hotel Duty Manager @ {dutyManagerPhNo} (or) hotel land line @ {hotelNo}. </td>
      </tr>

      <tr> 
        <td colSpan={12}> Guest Address Details </td>
      </tr>

      <tr> 
        <td colSpan={12}><b>Address  </b> <span style={{ marginLeft: '65px'}}>   : {(details["addressOne"] === null ? ' ' : details["addressOne"]) + ' ' +
               (details["city"] === null ? ' ' : details["city"]) + ' ' +
               (details["state"] === null ? ' ' : details["state"]) + ' ' +
               (details["postalCode"] === null ? ' ' : details["postalCode"]) + ' ' +
               (details["countriesname"] === null ? ' ' : details["countriesname"])} </span></td>    
      </tr>

    
      <tr> 
        <td colSpan={12}><b>E-mail Address </b> <span style={{ marginLeft: '29px'}}> : {details["email"]}</span> </td>  
      </tr>

      <tr> 
        <td colSpan={6}><b>Credit Card Number </b>  : {details["maskedCardNumber"]} </td>  
        <td colSpan={6}><b>Expiry Date</b>  : {details["cardExpiryDate"]}  </td>  
      </tr>

      <tr style={{fontSize:'10px'}}> 
        <td colSpan={3}><b> Passport Number</b> <span style={{fontSize:'9px', marginLeft: '14px'}}> :{iddetails["IDType"] === 'passport' ? iddetails["idNumber"] : ' '}</span>   </td>  
        <td colSpan={4} style={{marginRight: '40px'}}><b>Place of Issue </b> <span  style={{ fontSize:'9px', wordWrap: 'break-word' }}>:{iddetails["IDType"] === 'passport' ? iddetails["issuePlace"] :' ' }  </span>  </td>  
        <td colSpan={5}><b>Date of Issue </b> : <span  style={{ marginRight: '15px',fontSize:'9px'}}> {iddetails["IDType"] === 'passport' ? iddetails["issueDate"] : ' '} </span></td>  
      </tr>
      {/* </table> */}
      <tr>
      <td colSpan={12}><b>Billing Details </b> <span style={{ marginLeft: '32px'}}>: {details["billingInstruction"]} </span> </td>  
      </tr>
    </table>
   
  <p style={{fontSize:'10px', lineHeight:'1.5', color: 'black'}}>
   
    <b>Reservation Policy: </b><br></br>
    {hotelReservationPolicy}<br/> </p>


     <p style={{fontSize:'10px', lineHeight:'1.5', color: 'black'}}>
  
     <p style={{fontSize:'10px', lineHeight:'1.5', color: 'black'}}>
  {hotelBillPolicy && <b> Billing:</b>} {hotelBillPolicy} <br/>
  </p> 
  <p style={{fontSize:'10px', lineHeight:'1.5', color: 'black'}}>
     <b> Cancellation Policy: </b><br></br> 
     {hotelCancelPolicy}<br></br>
     </p>

     {hotelAirportTransfers && <b> Airport transfers:</b>}
{hotelAirportTransfers &&
  hotelAirportTransfers
    .split('\n')
    .map((line, index) => (
      <div key={index}>
        <pre>{line.replace(/INR/g, "     INR")}</pre>
      </div>
    ))}
</p>

      {/* <p style={{fontSize:'10px', lineHeight:'1.5'}}>
     <b> Airport transfers:</b>We can also organize for the airport pick up and drop at a nominal cost. Please find below the charges for the same .<br></br> */}
     {/* Request you to kindly contact reservations@theoterra.com for further correspondence on the same.<br/>

   
     <div class='row' style={{fontSize:'10px'}}>
        <div class='col-sm-4'> Car Type </div>
        <div class='col-sm-4'> One Way </div>
        <div class='col-sm-4'> Two Way </div>
     </div>
     <div class='row' style={{fontSize:'10px'}}>
        <div class='col-sm-4'> Sedan </div>
        <div class='col-sm-4'> INR 3599 + 5%Taxes </div>
        <div class='col-sm-4'> INR 7198 + 5%Taxes </div>
     </div>
     <div class='row' style={{fontSize:'10px'}}>
        <div class='col-sm-4'> BYD / MPV</div>
        <div class='col-sm-4'> INR 4699 + 5%Taxes </div>
        <div class='col-sm-4'> INR 9398 + 5%Taxes </div>
     </div>
     </p>  */}
     <p style={{fontSize:'10px', lineHeight:'1.5', color: 'black'}}>
     <b>Note : </b><br/>
     {hotelnote}<br/>
     </p>  
     <p style={{fontSize:'10px', lineHeight:'1.5', color: 'black'}}>
     In case of any discomfort, please feel free to reach out to us at:<br/>
     {dutyManagerEmail}<br/>
     {hotelEmail}<br/>
     </p> 
     <p style={{fontSize:'10px', lineHeight:'1.5', color: 'black'}}>
    We are look forward to welcoming you to {hotelName} <br/>
    Thank you.<br></br>
    Warm Regards,<br></br>
    Reservations Department<br></br>
    </p>
  {/* <br/> */}
  <p style={{fontSize:'10px', lineHeight:'1.5', color: 'black'}}>{hotelAddress} - {hotelPostalCode} India. Tel: +{hotelNo}, Fax: + {hotelFax} email:{hotelEmail}</p>
  
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        {logostatus === 1 ? (
            <img src={API_URL + `/imagepaths/${imagelogo}`} alt="NatZero Logo" style={{ width: '100px', height: '80px' }} />
        ) : (
            <div></div>
        )}
    </div>
  </div>
</div> 
  )
}

export default confirmationLetter