

// ------------------------------///  E-Bill  With API   ///-------------------------------------------------//

// ** React Imports
import { useEffect } from 'react'
import React, { useState } from 'react'
// API_URL
import API_URL from '../../../../config'
// import './a.scss'
import Logo from '@src/assets/images/logo/oterra.jpg';
// ** Reactstrap Imports
import { Row, Col, Table } from 'reactstrap'
import { Nav,TabPane,Button,NavItem,NavLink,TabContent,Form,Label,InputGroup,Modal,ModalBody,
 ModalHeader,} from 'reactstrap'
 import { useParams, Link } from 'react-router-dom'

// ** Styles
import '@styles/base/pages/app-invoice-print.scss'
import { useSSR } from 'react-i18next';
// import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
let getData =''
fetchx(API_URL + "/getReservationDetails", {
 method: "POST",
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 hotelID:1,
 reservationID:6
 })
 }).then(result => result.json())
 .then(rowData => {
 console.log(rowData['data'])
 getData = rowData['data'][0]
 }).catch((error) => {
 console.log(error)
 })

 
const ebill = () => {
 const [trxnDetails,settrxnDetails] = useState('')
 // ** Print on mount
 useEffect(() => {

 fetchx(API_URL + "/GetBillData", {
 method: "POST",
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 hotelID:1,
 reservationID:6,
 folioNo:1
 })
 }).then(result => result.json())
 .then(rowData => {
 console.log(rowData['data'])
 settrxnDetails(rowData['data'])
 // getData = rowData['data']
 // setFolioCount(rowData['data'])
 // FolioOptions = rowData['data']
 }).catch((error) => {
 console.log(error)
 })
 // setTimeout(() => window.print(), 50)
 }, [])




 // localStorage.setItem('data1',)
 // let getData = JSON.parse(localStorage.getItem('data1'))
 // console.log(getData)
 // console.log(getData['id'])

 return (

<div style={{width:'210mm',border:'1px solid black'}}>
 <table style={{width:'210mm',border:'1px solid black'}}>
 {/* table Head should come in all pages */}
 <thead>
 <tr>
 <th class="align-center" colspan="1">
 <img style={{ width: '80px', height: '80px' }} src={Logo} ></img>
 </th>
 <th class="align-bottom" colspan="6">
 <h1 style={{ 'text-align': 'center', 'color': 'rgb(0, 0, 0)', 'font-style': 'normal'}}>
 <font style={{ 'font-size': '24px', 'line-height': '80%' }}><b >THE OTERRA</b></font>
 </h1>
 <p className='ebill_p'><b><u>A DIVISION OF VELANKANI INFORMATION SYSTEMS LTD</u></b></p>
 <p className='ebill_p'>43, Hosur Road, Electronic City Phase 1, Bengaluru, Karnataka- 560100</p>
 <p className='ebill_p'>+918030030303</p>
 <p className='ebill_p'>www.theoterra.com</p>
 <p className='ebill_p'>GSTIN:29AABCV0552G1ZF</p>
 </th>
 <th valign="bottom" colspan="2" style={{'text-align': 'right'}}>Bill Date : "06-06-2023"</th>
 </tr>

 <tr>
 <th style={{'text-align': 'left','border': '1px solid black'}} colspan="2">&nbsp;&nbsp;Name&Address</th>
 <th className='ebill__th' id="base">Room No</th>
 <th className='ebill__th' id="base" >Type</th>
 <th className='ebill__th' id="base">No of Pax</th>
 <th className='ebill__th' id="base">Meal Plan</th>
 <th className='ebill__th' colspan='2' id="base">Rate</th>
 <th className='ebill__th' id="base">Reg. No</th>
 </tr>
 <tr class="border_all">
 <th style={{'text-align': 'left', border: '1px solid black'}} rowspan='3' colspan="2"> {getData["firstName"]} </th>
 <th className='ebill__th' id="base" >{getData["roomNumber"]}</th>
 <th className='ebill__th' id="base">{getData["roomType"]}</th>
 <th className='ebill__th' id="base">{getData["pax"]}</th>
 <th className='ebill__th' id="base">{getData["mealPlan"]}</th>
 <th className='ebill__th' colspan='2' id="base">{getData["rate"]}</th>
 <th className='ebill__th' id="base">{getData["regNo"]}</th>
 </tr>
 <tr>
 <th className='ebill__th' id="base">Check-In</th>
 <th className='ebill__th' id="base">Check-Out</th>
 <th className='ebill__th' id="base">Extra Pax</th>
 <th className='ebill__th' id="base">Nationality</th>
 <th className='ebill__th' colspan='2' id="base">BillNo.</th>
 <th className='ebill__th' id="base">Page</th>
 </tr>
 <tr>
 <th className='ebill__th' id="base"> {getData["arrivalDate"]}</th>
 <th className='ebill__th' id="base"> {getData["departureDate"]}</th>
 <th className='ebill__th' id="base"> {getData["pax"]}</th>
 <th className='ebill__th' id="base"> {getData["country"]}</th>
 <th className='ebill__th' colspan='2' id="base"> DUMMY</th>
 <th className='ebill__th' id="base"> {getData["regNo"]}</th>
 </tr> 
 <tr style={{border: '1px solid black', 'text-align': 'center'}}>
 <th >Date</th>
 <th colspan="3">Description</th>
 <th colspan="1">Reference</th>
 <th >Charges</th>
 <th >Credits</th>
 <th >Balance</th>
 </tr>
 </thead>


 <tbody>
 {trxnDetails.length!=0 && trxnDetails.map((row, index) => ( 
 <>
 {row.transaction_type=="Bill" &&
 <tr style={{'text-align': 'center'}}>
 <td >{row.date}</td>
 <td colspan="3">{row.description}</td>
 <td colspan="1"></td>
 <td >{row.base_amount}</td>
 </tr>}
 {row.transaction_type=="Bill" && row.tax_percentage!=0 && row.cgst!=0 && row.sgst!=0 &&
 <>
 <tr style={{'text-align': 'center'}}>
 <td >{row.date}</td>
 <td colspan="3">SGST{parseInt(row.tax_percentage)/2}%</td>
 <td colspan="1"></td>
 <td >{row.sgst}</td>
 </tr>
 <tr style={{'text-align': 'center'}}>
 <td >{row.date}</td>
 <td colspan="3">CGST{parseInt(row.tax_percentage)/2}%</td>
 <td colspan="1"></td>
 <td >{row.cgst}</td>
 </tr>
 </>}
 </>

 ))}

{/* <tr style={{'text-align': 'center'}}>
 <th >{getData["arrivalDate"]}</th>
 <th >{getData["arrivalDate"]}</th>
 <th colspan="4">{getData["arrivalDate"]}</th>
 <th >{getData["arrivalDate"]}</th>
 <th >{getData["arrivalDate"]}</th>
 <th >{getData["arrivalDate"]}</th>
 </tr> */}
 <tr style={{ 'text-align': 'center' }}> <b> Transaction Summary</b></tr>
 <tr style={{border: '1px solid black', 'text-align': 'center'}} colspan= '2'>
 <th >Description</th>
 <th >Amount</th>
 <th colspan="4"> Tax Per</th>
 <th >SGST</th>
 <th >Tax Percent</th>
 <th >CGST</th>
 </tr>
 <tr style={{border: '1px solid black', 'text-align': 'center'}} colspan= '2'>
 <td >{getData["description"]}</td>
 <td >{getData["rate"]} </td>
 <td colspan="4"> {getData["taxPercentage"]}</td>
 <td >{getData["sgst"]} </td>
 <td >{getData["taxPercentage"]}</td>
 <td >{getData["cgst"]} </td>
 </tr>
 <tr>
 <td colspan="8" >
 <p> <span className='ebill__body_td'> Amount in words: {getData["paymode"]}</span> </p> </td>
 </tr>
 <tr >
 <td colspan="8" >
 <p> <span className='ebill__body_td'> Paymode: {getData["paymode"]}</span> </p> </td>
 </tr>
 <tr >
 <td colspan="8" >
 <p> <span className='ebill__body_td'> Agent Details: {getData["agent"]} </span> </p> </td>
 </tr>

 </tbody>
 
 {/* <tbody>
 <tr style={{'text-align': 'center'}}>
 <th >{getData["arrivalDate"]}</th>
 <th >{getData["arrivalDate"]}</th>
 <th colspan="4">{getData["arrivalDate"]}</th>
 <th >{getData["arrivalDate"]}</th>
 <th >{getData["arrivalDate"]}</th>
 <th >{getData["arrivalDate"]}</th>
 </tr>
 <tr style={{ 'text-align': 'center' }}> <b> Transaction Summary</b></tr>
 <tr style={{border: '1px solid black', 'text-align': 'center'}} colspan= '2'>
 <th >Description</th>
 <th >Amount</th>
 <th colspan="4"> Tax Per</th>
 <th >SGST</th>
 <th >Tax Percent</th>
 <th >CGST</th>
 </tr>
 <tr style={{border: '1px solid black', 'text-align': 'center'}} colspan= '2'>
 <td >{getData["description"]}</td>
 <td >{getData["rate"]} </td>
 <td colspan="4"> {getData["taxPercentage"]}</td>
 <td >{getData["sgst"]} </td>
 <td >{getData["taxPercentage"]}</td>
 <td >{getData["cgst"]} </td>
 </tr>
 <tr>
 <td colspan="8" >
 <p> <span className='ebill__body_td'> Amount in words: {getData["paymode"]}</span> </p> </td>
 </tr>
 <tr >
 <td colspan="8" >
 <p> <span className='ebill__body_td'> Paymode: {getData["paymode"]}</span> </p> </td>
 </tr>
 <tr >
 <td colspan="8" >
 <p> <span className='ebill__body_td'> Agent Details: {getData["agent"]} </span> </p> </td>
 </tr>

 
 </tbody> */}

 {/* table footter should come in all pages */}
 
 <tfoot style={{ border:'1px,solid black' }}>
 
 <tr vertical-align:bottom valign="bottom" style={{width:'210mm', height:'80px',border:'1px solid black',borderRight:'1px solid black', borderLeft: '1px solid black','text-align': 'left' ,'border-collapse': 'collapse'}} rowspan='100px' colspan="4">
 <td colspan="4" style={{'text-align': 'left'}}>Cashier Signature &nbsp;&nbsp;&nbsp;&nbsp;</td>
 <td colspan="4" style={{'text-align': 'center'}}>Duty Manager Signature &nbsp;&nbsp;&nbsp;&nbsp;</td>
 <td colspan="4" style={{'text-align': 'right'}}>Guest Signature &nbsp;&nbsp;&nbsp;&nbsp;</td>
 </tr>
 
 <tr valign="top" style={{border: '1px solid black', 'text-align': 'left',width:'210mm'}}>
 <td colspan="12">Service Accounting Codes :Tariff:996311</td>
 </tr>
 </tfoot>
 </table>
</div>

 )
}

export default ebill





/////////////////////Deposit Receipt//////////////////////////////


// // ** React Imports
// import { useEffect } from 'react'
// // import "./style.scss";
// import Logo from '../../oterra.jpg';

// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// // ** Reactstrap Imports
// import { Row, Col, Table } from 'reactstrap'

// // ** Styles
// import '@styles/base/pages/app-invoice-print.scss'
// import { BlockMapBuilder } from 'draft-js';
// import { left } from '@popperjs/core';

// const DepositReceipt = () => {
//   // ** Print on mount
//   useEffect(() => {
//     setTimeout(() => window.print(), 50)
//   }, [])

//   let getData = JSON.parse(localStorage.getItem('data1'))
//   console.log(getData['id'])


//   return (
// <div>

// <div style={{width:'210mm',paddingTop:'50px'}}>
// <tr>
//   <td >
//   <div style={{paddingLeft:'30px', paddingTop:'20px'}}>
//   <img style={{ width: '80px', height: '80px',display:'block',marginLeft:'auto',marginRight:'auto' }} src={Logo} />
//   </div>
//   </td>  
//   <td >

//   <th class="align-bottom" colspan="6">
//   <h1 style={{ 'text-align': 'center', 'font-style': 'normal' }}>
//   <font style={{ 'font-size': '24px', 'line-height': '100%' }}><b >THE OTERRA</b></font>
//   </h1>
//   <p style={{'line-height': '80%', 'text-align': 'center', paddingLeft:'15px',fontSize:'13px'}}><b><u>A DIVISION OF VELANKANI INFORMATION SYSTEMS LTD</u></b></p>
//   <p class="receiptHeader" style={{ paddingLeft:'40px' }}>43, Hosur Road, Electronic City Phase 1, Bengaluru, Karnataka- 560100</p>
//   <p class="receiptHeader">+918030030303</p>
//   <p class="receiptHeader">www.theoterra.com</p>
//   <p class="receiptHeader">GSTIN:29AABCV0552G1ZF </p>
//   </th>
//   </td>

//   <th valign="bottom" colspan="2" style={{'text-align': 'right' }}>Bill Date: "06-06-2023"</th>
//   </tr>  
//    <p style={{ 'line-height': '80%',textAlign:'center'}}>RECEIPT</p>

// </div>
// {/* style={{'font-weight': '400' ,'font-size': '14px',paddingLeft:'60px' }}
// style={{'font-weight': '400' ,'font-size': '14px',paddingLeft:'60px' }}
// style={{'font-weight': '400' ,'font-size': '14px',paddingLeft:'60px' }} */}

// <br/>
// <div>
// <p class='receiptContent'><b>Received with thanks from {getData["salutation"]} {getData["name"]} </b></p> 
// <p class='receiptContent'><b>A sum of Rs.{getData["rate"]}/-                                     </b></p>
// <p class='receiptContent'><b>towards Deposit in Master Cards                                     </b></p>
// </div>

      
// </div>
//   )
// }

// export default DepositReceipt







///////////////////// Receipt//////////////////////////////


// // ** React Imports
// import { useEffect } from 'react'
// // import "./style.scss";
// import Logo from '../../oterra.jpg';

// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// // ** Reactstrap Imports
// import { Row, Col, Table } from 'reactstrap'

// // ** Styles
// import '@styles/base/pages/app-invoice-print.scss'
// import { BlockMapBuilder } from 'draft-js';
// import { left } from '@popperjs/core';

// const PrintReceipt = () => {
//   // ** Print on mount
//   useEffect(() => {
//     setTimeout(() => window.print(), 50)
//   }, [])

//   let getData = JSON.parse(localStorage.getItem('data1'))
//   console.log(getData['id'])


//   return (
// <div>

// <div style={{width:'210mm',paddingTop:'50px'}}>
// <tr>
//   <td >
//   <div style={{paddingLeft:'30px', paddingTop:'20px'}}>
//   <img style={{ width: '80px', height: '80px',display:'block',marginLeft:'auto',marginRight:'auto' }} src={Logo} />
//   </div>
//   </td>  
//   <td >

//   <th class="align-bottom" colspan="6">
//   <h1 style={{ 'text-align': 'center', 'font-style': 'normal' }}>
//   <font style={{ 'font-size': '24px', 'line-height': '100%' }}><b >THE OTERRA</b></font>
//   </h1>
//   <p style={{'line-height': '80%', 'text-align': 'center', paddingLeft:'15px',fontSize:'13px'}}><b><u>A DIVISION OF VELANKANI INFORMATION SYSTEMS LTD</u></b></p>
//   <p class="receiptHeader" style={{  paddingLeft:'40px' }}>43, Hosur Road, Electronic City Phase 1, Bengaluru, Karnataka- 560100</p>
//   <p class="receiptHeader" >+918030030303</p>
//   <p class="receiptHeader" >www.theoterra.com</p>
//   <p class="receiptHeader" >RECEIPT</p>
//   </th>
//   </td>

//   <th valign="bottom" colspan="2" style={{'text-align': 'right' }}>Bill Date: "06-06-2023"</th>
//   </tr>  
//    <p style={{ 'line-height': '80%',textAlign:'center'}}><b>GSTIN:29AABCV0552G1ZF</b></p>

// </div>



// <br/>
// <div>
// <p class='receiptContent'><b>Received with thanks from {getData["salutation"]} {getData["name"]}                         </b></p> 
// <p class='receiptContent'><b>A sum of Rs.{getData["rate"]}/-                                             </b></p>
// <p class='receiptContent'><b>towards Advance in AXIS BANK CARDS                                        </b></p>
// <p class='receiptContent'><b> Room No :</b> {getData['roomNumber']} Check In Date :{getData["arrivalDate"]} </p>
// </div>

       



      
// </div>
//   )
// }

// export default PrintReceipt
