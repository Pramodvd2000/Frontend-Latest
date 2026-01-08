import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input,InputGroup, InputGroupText } from 'reactstrap'
// import Logo from './oterra.jpg';
import {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import API_URL from '../../../../config';
import Logo from '../../../dashboard/oterra.jpg';
//import{'../../views/apps/forex/sellforex'}


// import "./A4style.scss";
function App({data}) {
  const [details,setDetails] = useState('')
  const [Filldata,setFilldata] = useState('')


useEffect(() => {
   if (data && data.guestProfileID) {
     fetchx(API_URL + `/getGuestForexDetails?hotelID=1&guestProfileID=${data.guestProfileID}`)
       .then(result => result.json())
       .then(rowData => {
 
         setDetails(rowData['data'][0]);
       })
       .catch(error => {
         console.error('Error fetching data:', error);
       });
   }
 }, [data]);

     
  return(
    <div style={{ width:'210mm'}}>  
    <div style={{width:'210mm',paddingTop:'10px'}}>
                <tr>
                  <td >
                  <div style={{paddingLeft:'30px', paddingTop:'5px'}}>
                  <img style={{ width: '60px', height: '60px',display:'block', marginBottom:'30px',marginLeft:'auto',marginRight:'auto' }} src={Logo} />
                  </div>
                  </td>  
   
                  <td style={{width:'280px' , verticalAlign: top}}>
                       <h5> <b>VOID ENCASHMENT CERTIFICATE</b></h5>
                  </td>
   
                  <td  style={{textAlign:'right'}}>
                  <th class="align-bottom" colspan="6" >
                  <p style={{ 'text-align': 'right', 'font-style': 'normal'}}>
                    
                  <font style={{ 'font-size': '11px', 'line-height': '100%' }}><b >VELANKANI INFORMATION SYSTEMS LTD.</b></font>
                           
                <br/>THE OTERRA<br/>
                43, Electronic City, Hosur Road<br/>
                  Bengaluru - 560100 ,India <br/>
                  Contact no:+91 80 3003 0303 | F: +91 80 3985 4519 </p>
                 
                  </th>
                  </td>  
                  </tr>  
                </div>
   
   
        <div style={{color:'black'}}>
        <div>
    
    <div class='row' style={{fontSize:'10px'}}>
        <div class='col-sm-4'><b>Certificate No</b></div>
        <div class='col-sm-4'> {details['certificateNo']} </div>
        <div class='col-sm-4'>  </div>
     </div>
    
     <div class='row' style={{fontSize:'10px'}}>
        <div class='col-sm-4'> <b>Date</b> </div>
        <div class='col-sm-4'>  {details['date']}</div>
        <div class='col-sm-4'> </div>
     </div>
     <br/>
    <p style={{fontSize:'9px', lineHeight:'1.5'}}> RBI Licence No: AD-Category II. No.01/2006   </p>
     <p style={{fontSize:'9px', lineHeight:'1.5'}}>
     <p >We hereby certify that we have purchased today foreign currency from Mr. Gal Einhorn holder of Passport No:       22420830 Date of Issue: 19-Nov-2022 <br/>
        2015 Nationality Israel Staying In Room No 304 and paid net amount in INR after adjusting the amount towards settlement of invoices for goods<br/>
        supplied/services rendered as per details given below
     </p> 
        <p>
        A. Details of Foreign Currency Notes/Coins/Traveller cheques purchased
        </p>
        <p>
        CURRENCY PURCHASED (including clearly notes and traveller cheques separately) 
        </p>
        <br/>
        <div style={{paddingLeft:'10px'}}>
        <div class='row' style={{fontSize:'10px',width:650}}>
          <div style={{border: '0.5px solid black'}} class='col-sm-1'> Sl No</div>
          <div style={{border: '0.5px solid black'}} class='col-sm-2'> Currency Type </div>
          <div style={{border: '0.5px solid black'}} class='col-sm-2'> Currency Amount</div>
          <div style={{border: '0.5px solid black'}} class='col-sm-3'> Bank Name & number in case of Travellers cheque</div>
          <div style={{border: '0.5px solid black'}} class='col-sm-2'> Rate of Exchange</div>
          <div style={{border: '0.5px solid black'}} class='col-sm-2'> Rupees Equivalent</div>
        </div>
        <div class='row' style={{fontSize:'10px',width:650}}>
          <div style={{border: '0.5px solid black'}} class='col-sm-1'> {details['id']}</div>
          <div style={{border: '0.5px solid black'}} class='col-sm-2'> {details['currency']}</div>
          <div style={{border: '0.5px solid black'}} class='col-sm-2'> {details['amount']}</div>
          <div style={{border: '0.5px solid black'}} class='col-sm-3'> {details['']}</div>
          <div style={{border: '0.5px solid black'}} class='col-sm-2'> {details['rateForTheDay']}</div>
          <div style={{border: '0.5px solid black'}} class='col-sm-2'> {details['equivalentAmount']} </div>
        </div>
        </div>
    
        <br/>

        <div>
        <div class='row' style={{fontSize:'10px'}}>
        <div class='col-sm-4'>   </div>
        <div class='col-sm-4'> Less:CGST  </div>
        <div class='col-sm-4'> {details['CGST']} </div>
     </div>
     <div class='row' style={{fontSize:'10px'}}>
        <div class='col-sm-4'>   </div>
        <div class='col-sm-4'> Less:SGST </div>
        <div class='col-sm-4'> {details['SGST']} </div>
     </div>
     <div class='row' style={{fontSize:'10px'}}>
        <div class='col-sm-4'> </div>
        <div class='col-sm-4'> Total </div>
        <div class='col-sm-4'> {details['total']} </div>
     </div>
        </div>

        <p style={{fontSize:'9px', lineHeight:'1.5'}}>B. Details of adjustment made towards settlement of invoices for goods supplied/services rendered</p>
        <div style={{paddingLeft:'10px'}}>
        <div class='row' style={{fontSize:'10px' ,width:650}}>
        <div style={{border: '0.5px solid black'}}  class='col-sm-4'> Invoice No</div>
        <div style={{border: '0.5px solid black'}}  class='col-sm-4'> Date </div>
        <div style={{border: '0.5px solid black'}}  class='col-sm-4'> Invoice Amount </div>
       </div>
       <div class='row' style={{fontSize:'10px' ,width:650}}>
        <div style={{border: '0.5px solid black'}}  class='col-sm-4'>   </div>
        <div style={{border: '0.5px solid black'}}  class='col-sm-4'>  </div>
        <div style={{border: '0.5px solid black'}}  class='col-sm-4'>  . </div>
       </div>
        </div>
        <br/>
        <p style={{fontSize:'9px', lineHeight:'1.5'}}> C. Net Amount Paid in Rupees ( A - B) </p>
        <p style={{fontSize:'9px', lineHeight:'1.5'}}> AMOUNT IN WORDS: Five Hundred Fifty Six </p>
        <p style={{fontSize:'9px', lineHeight:'1.5'}}> I/We agree to exchange rate stated above  </p>
     </p> 
     <br/>
     <div class='row' style={{fontSize:'10px'}}>
        <div class='col-sm-6'>  </div>
        <div class='col-sm-6'>  </div>
     </div> 
     <br/>
     <div class='row' style={{fontSize:'10px'}}>
        <div class='col-sm-6'> Guest Signature </div>
        <div class='col-sm-6'> Cashier Signature </div>
     </div>     
     <p style={{fontSize:'9px', lineHeight:'1.5'}}>
     Note : This certificate should be preserved by the holder to facilitate reconversion of the rupee balance (out of amount stated at C) if any, into foreign<br/>
     currency at the time of departure from India and /or for payment of passage/freight cost in rupees if necessary. No duplicate will be issued.
     </p> 
     <div class='row' style={{fontSize:'10px'}}>
        <div class='col-sm-6'> ID Number </div>
        <div class='col-sm-6'> 5678654766 </div>
     </div> 
     
   </div>
  </div>
 </div>
)
}
export default App;
