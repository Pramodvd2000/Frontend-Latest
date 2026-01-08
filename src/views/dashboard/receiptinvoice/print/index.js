// ** React Imports
import { useEffect } from 'react'
// import "./style.scss";
import Logo from '../../oterra.jpg';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// ** Reactstrap Imports
import { Row, Col, Table } from 'reactstrap'

// ** Styles
import '@styles/base/pages/app-invoice-print.scss'
import { BlockMapBuilder } from 'draft-js';
import { left } from '@popperjs/core';

const PrintReceipt = () => {
  // ** Print on mount
  useEffect(() => {
    setTimeout(() => window.print(), 50)
  }, [])

  let getData = JSON.parse(localStorage.getItem('data1'))
  console.log(getData['id'])


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

  <th valign="bottom" colspan="2" style={{'text-align': 'right' }}>Bill Date: "06-06-2023"</th>
  </tr>  
   <p style={{ 'line-height': '80%',textAlign:'center'}}><b>GSTIN:29AABCV0552G1ZF</b></p>

</div>
<br/>
<div>
<p class='receiptContent'><b>Received with thanks from {getData["salutation"]} {getData["name"]}                         </b></p> 
<p class='receiptContent'><b>A sum of Rs.{getData["rate"]}/-                                             </b></p>
<p class='receiptContent'><b>towards Advance in AXIS BANK CARDS                                        </b></p>
<p class='receiptContent'><b> Room No :</b> {getData['roomNumber']} Check In Date :{getData["arrivalDate"]} </p>
</div>
</div>
  )
}

export default PrintReceipt
