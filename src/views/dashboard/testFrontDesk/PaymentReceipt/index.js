// ** React Imports
import { useEffect,useState } from 'react'
// import "./style.scss";
import Logo from '@src/assets/images/logo/oterra.jpg';

// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// ** Reactstrap Imports
import { Row, Col, Table } from 'reactstrap'

// ** Styles
import '@styles/base/pages/app-invoice-print.scss'
import { BlockMapBuilder } from 'draft-js';
import { left } from '@popperjs/core';
import API_URL from "../../../../config";

const PrintReceipt = () => {
  //console.log('In payment receipt')
  const [Data,setData] = useState([])
  // ** Print on mount
  useEffect(() => {
    sessionStorage.setItem('TransactionID',localStorage.getItem('TransactionID'))
    localStorage.removeItem('TransactionID')
    fetchx(API_URL + "/getPaymentDetails", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        transactionID:sessionStorage.getItem('TransactionID')
          })
    }).then(result => result.json())
    .then(resp => {
        //console.log(resp)
        if(resp.statusCode==200){
          setData(resp['data'][0])
        }
        // PaymentOptions = resp['data']
      }).catch((error) => {
        //console.log(error)
      })
    // setTimeout(() => window.print(), 50)
  }, [])

  // let getData = JSON.parse(localStorage.getItem('data1'))
  // //console.log(getData)


  return (
<div>

<div style={{width:'210mm',paddingTop:'50px'}}>
<tr>
  <td >
  <div style={{paddingLeft:'30px', paddingTop:'20px'}}>
  <img style={{ width: '80px', height: '80px',display:'block',marginLeft:'auto',marginRight:'auto' }} src={Logo} />
  </div>
  </td>  
  <td >

  <th class="align-bottom" colspan="6">
  <h1 style={{ 'text-align': 'center', 'font-style': 'normal' }}>
  <font style={{ 'font-size': '24px', 'line-height': '100%' }}><b >THE OTERRA</b></font>
  </h1>
  <p style={{'line-height': '80%', 'text-align': 'center', paddingLeft:'15px',fontSize:'13px'}}><b><u>A DIVISION OF VELANKANI INFORMATION SYSTEMS LTD</u></b></p>
  <p class="receiptHeader" style={{  paddingLeft:'40px' }}>43, Hosur Road, Electronic City Phase 1, Bengaluru, Karnataka- 560100</p>
  <p class="receiptHeader" >+918030030303</p>
  <p class="receiptHeader" >www.theoterra.com</p>
  <p class="receiptHeader" >RECEIPT</p>
  </th>
  </td>

  <th valign="bottom" colspan="2" style={{'text-align': 'right' }}>Bill Date: {Data["createdAt"]}</th>
  </tr>  
   <p style={{ 'line-height': '80%',textAlign:'center'}}><b>GSTIN:29AABCV0552G1ZF</b></p>

</div>



<br/>
{<div>
<p class='receiptContent'><b>Received with thanks from {Data["name"]}                         </b></p> 
<p class='receiptContent'><b>A sum of Rs.{Data["Amount"]}/-                                             </b></p>
<p class='receiptContent'><b>towards Advance in {Data["paymentMode"]}                                        </b></p>
<p class='receiptContent'><b> Room No :</b> {Data['roomNumber']} Check In Date :{Data["arrivalDate"]} </p>
</div>}

       



      
</div>
  )
}

export default PrintReceipt