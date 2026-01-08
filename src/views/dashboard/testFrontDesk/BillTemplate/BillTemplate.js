// ** React Imports
import { useEffect } from 'react'
import React, {  useState } from 'react'

// import './a.scss'
import Logo from '@src/assets/images/logo/oterra.jpg';
// ** Reactstrap Imports
import { Row, Col, Table } from 'reactstrap'
import { Nav,TabPane,Button,NavItem,NavLink,TabContent,Form,Label,InputGroup,Modal,ModalBody,
  ModalHeader,} from 'reactstrap'
  import { useParams, Link } from 'react-router-dom'
  import Moment from 'moment';
  import API_URL from "../../../../config";

// ** Styles
import '@styles/base/pages/app-invoice-print.scss'
import { useSSR } from 'react-i18next';
// import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
let getData =''
let testJSON = []
let testTrxnCode =[]
let totalDisp =[]
fetchx(API_URL + "/getReservationDetails", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hotelID:1,
                reservationID:localStorage.getItem('reservationID')
              })
          }).then(result => result.json())
          .then(rowData => {
              console.log(rowData['data'])
              getData = rowData['data'][0]
            }).catch((error) => {
              console.log(error)
            })
const Print = () => {
  const [trxnDetails,settrxnDetails] = useState('')
  const [GrandDetails,setGrandDetails] = useState([])
  // ** Print on mount
  useEffect(() => {

      fetchx(API_URL + "/GetBillData", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              hotelID:1,
              reservationID:localStorage.getItem('reservationID'),
              folioNo:localStorage.getItem('FolioNo')
              })
          }).then(result => result.json())
          .then(rowData => {
              console.log(rowData['data'])
               
              setGrandDetails(rowData['data']['TotalDescription'])
              
              Object.entries(rowData['data']['AllTrxnJSON']).forEach(([key, value]) => {
                let total = 0
                 console.log(value.length)
                //  console.log(value)
                 for(let i=0 ;i<value.length ; i++){
                  total+=parseFloat(rowData['data']['AllTrxnJSON'][key][i]['total'])
                  // rowData['data']['AllTrxnJSON'][key][i]['daytotal'] = null
                  // rowData['data']['AllTrxnJSON'][key][i]['total'] = null
                  
                  testJSON.push(rowData['data']['AllTrxnJSON'][key][i])
                  settrxnDetails(trxnDetails =>[...trxnDetails,testJSON])
                  // setTableData(tableData => [...tableData, newRow]);
                  // console.log(testJSON)
                //   if(i==value.length-1){
                //     // rowData['data']['AllTrxnJSON'][key][i]['transaction_type']
                //   let json = {base_amount:'',cgst:'',date:"",daytotal:Math.abs(total),description:"Day Total",sgst:'',tax_percentage:12,transaction_type:'Bill'}
                // testJSON.push(json)
                // settrxnDetails(trxnDetails =>[...trxnDetails,json])
                //   }
                }
                
              })
              let grandTotalBills=0
              let grandTotalPayments = 0
              console.log(testJSON)
              for(let i =0 ;i<testJSON.length;i++){
                // console.log(testJSON[i])
                // if(testJSON[i]['base_amount']=='' && testJSON[i]['transaction_type']=='Bill'){
                //   console.log(console.log(testJSON[i]['daytotal']))
                // }
                if(testJSON[i]['base_amount']=='' && testJSON[i]['transaction_type']=='Bill'){
                  console.log(testJSON[i]['daytotal'])
                grandTotalBills+= parseFloat(testJSON[i]['daytotal'])
                }else if(testJSON[i]['transaction_type'] == "Payments"){
                  console.log(testJSON[i]['daytotal'])
                  grandTotalPayments += testJSON[i]['daytotal']
                }
                else{

                }
                 if(i==testJSON.length-1){
                  console.log(grandTotalBills,grandTotalPayments)
                  let Balance  = (grandTotalBills+grandTotalPayments).toFixed(2)
                 let totalJSON = {description:'Grand Total',BillTotal:Math.abs(grandTotalBills).toFixed(2) , PaymentsTotal:Math.abs(grandTotalPayments).toFixed(2) ,balance:Math.abs(Balance).toFixed(2)}
                  totalDisp.push(totalJSON)
                  let roundoff = {description:'RoundOff' , BillTotal:'',PaymentsTotal:'',balance:(Math.round(Math.abs(Balance))-Math.abs(Balance)).toFixed(2)}
                  totalDisp.push(roundoff)
                  let NetTotal = {description:'Net Total' , BillTotal:'',PaymentsTotal:'',balance:(Math.round(Math.abs(Balance))).toFixed(2)}
                  totalDisp.push(NetTotal)

                  console.log(totalDisp)
                }
                
              }

              Object.entries(rowData['data']['AllTraxnCodesJSON']).forEach(([key, value]) => {
                //  console.log(key)
                //  console.log(value)
                //  for(let i=0 ;i<value.length ; i++){
                 
                  
                  testTrxnCode.push(rowData['data']['AllTraxnCodesJSON'][key])
                  // settrxnDetails(trxnDetails =>[...trxnDetails,testTrxnCode])
                  // setTableData(tableData => [...tableData, newRow]);
                  // console.log(testTrxnCode)
                  
                // }
                
              })
              
              console.log("==================>")
              // console.log((rowData['data']))
              console.log(testTrxnCode)
              // settrxnDetails(testJSON)
              // getData = rowData['data']
              // setFolioCount(rowData['data'])
            //   FolioOptions = rowData['data']
            }).catch((error) => {
              console.log(error)
            })
    // setTimeout(() => window.print(), 50)
  }, [])


  return (
<html id='BillData'>
<div style={{width:'210mm',border:'1px solid black'}}>
{/* <Button color='danger' tag={Link} to='/dashboard/testFrontDesk/BillTemplate' target='_blank' block className='mb-75'>
          Print
        </Button> */}
  <table style={{width:'210mm',border:'1px solid black'}}>
  {/* table Head should come in all pages */}
    <thead>
    <tr>
      <th class="align-center" colspan="1">
        <img style={{  width: '80px', height: '80px' }} src={"https://www.theoterra.com/assets/images/logo-gold-ot_80x80.jpg"} ></img>
      </th>
      <th class="align-bottom" colspan="6">
        <h1 style={{  'text-align': 'center', 'color': 'rgb(0, 0, 0)', 'font-style': 'normal' }}>
          <font style={{  'font-size': '24px', 'line-height': '80%' }}><b >THE OTERRA</b></font>
        </h1>
        <p style={{  'line-height': '80%', 'text-align': 'center' }}><b><u>A DIVISION OF VELANKANI INFORMATION SYSTEMS LTD</u></b></p>
        <p style={{  'line-height': '80%', 'text-align': 'center' }}>43, Hosur Road, Electronic City Phase 1, Bengaluru, Karnataka- 560100</p>
        <p style={{  'line-height': '80%', 'text-align': 'center' }}>+918030030303</p>
        <p style={{  'line-height': '80%', 'text-align': 'center' }}>www.theoterra.com</p>
        <p style={{  'line-height': '80%', 'text-align': 'center' }}>GSTIN:29AABCV0552G1ZF</p>
      </th>
      <th valign="bottom" colspan="2" style={{'text-align': 'right'}}>Bill Date : {(Moment(String(new Date())).format('YYYY-MM-DD'))}</th>
    </tr>

    <tr>
      <th style={{'text-align': 'left','border': '1px solid black'}} colspan="2">&nbsp;&nbsp;Name&Address</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base">Room No</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base" >Type</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base">No of Pax</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base">Meal Plan</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} colspan='2' id="base">Rate</th>
      <th style={{'text-align': 'center','border': '1px solid black'}}  id="base">Reg. No</th>
    </tr>
    <tr class="border_all">
      <th style={{'text-align': 'left', border: '1px solid black'}} rowspan='3' colspan="2"> {getData["salutation"]}{" "+getData["firstName"]}{" "+getData['lastName']}{'\n'}{getData['addressOne']} </th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base" >{getData["roomNumber"]}</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base">{getData["roomType"]}</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base">{1}</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base">{getData["packageCode"]}</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} colspan='2' id="base">{getData["rate"]}</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base">{getData["bookingID"]}</th>
    </tr>
    <tr>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base">Check-In</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base">Check-Out</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base">Extra Pax</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base">Nationality</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} colspan='2' id="base">BillNo.</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base">Page</th>
    </tr>
    <tr>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base"> {getData["arrivalDate"]}</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base"> {getData["departureDate"]}</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base"> {0}</th>
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base"> {getData["nationality"]}</th>
      {testJSON.length!=0  && testJSON[0]['billNo']==null && <th style={{'text-align': 'center','border': '1px solid black'}} colspan='2' id="base"> DUMMY</th>}
      {testJSON.length!=0  && testJSON[0]['billNo']!=null && <th style={{'text-align': 'center','border': '1px solid black'}} colspan='2' id="base"> {testJSON[0]['billNo']}</th>}
      
      <th style={{'text-align': 'center','border': '1px solid black'}} id="base"> {getData["regNo"]}</th>
    </tr> 
    <tr style={{border: '1px solid black', 'text-align': 'center'}}>
       <th >Date</th>
       <th  colspan="4">Description</th>
       <th  colspan="1">Reference</th>
       <th  >Charges</th>
       <th >Credits</th>
       <th >Balance</th>
    </tr>
  

    </thead>


    <tbody>

        {/* nayana */}
    {testJSON.length!=0  && testJSON.map((row, index) => (
                    <>
                    {/* {row.transaction_type=="Bill" && */}

                    {row.transaction_type=='Bill' && row.id!=0 &&<tr style={{'text-align': 'center'}}>
                      <td >{row.date}</td>
                      <td style={{'text-align': 'left'}} colspan="4">{row.description}</td>
                      <td colspan="1"></td>
                      <td style={{'text-align': 'right'}}>{row.base_amount.toFixed(2)}</td>
                      <td></td>
                      <td ></td>
                      {/* <td>{index}</td> */}
                      
                    </tr>}
                    {(row.transaction_type=='Payments' || row.transaction_type=='Allowance') && row.id!=0 &&<tr style={{'text-align': 'center'}}>
                      <td >{row.date}</td>
                      <td style={{'text-align': 'left'}} colspan="4">{row.description}</td>
                      <td colspan="1"></td>
                      <td></td>
                      <td style={{'text-align': 'right'}}>{row.base_amount.toFixed(2)}</td>
                      
                      <td ></td>
                      {/* <td>{index}</td> */}
                      
                    </tr>}

                    {row.id==0 &&<tr style={{'text-align': 'center'}}>
                      <td ></td>
                      <td style={{'text-align': 'left'}}  colspan="4">Day Total</td>
                      <td colspan="1"></td>
                      <td ></td>
                      <td></td>
                      <td style={{'text-align': 'right'}} >{row.DayTotal}</td>
                      {/* <td>{index}</td> */}
                      
                    </tr>}

                    {/* {row.transaction_type=="Bill" && row.tax_percentage!=0 && row.cgst!=0 && row.sgst!=0 && */}
                 
                    {row.id!=0 && row.tax_percentage!=0 && row.cgst!=0 && row.sgst!=0 &&
                      <>
                      <tr style={{'text-align': 'center'}}>
                        <td >{row.date}</td>
                        <td style={{'text-align': 'left'}} colspan="4">SGST{parseInt(row.tax_percentage)/2}%</td>
                        <td colspan="1"></td>
                        <td style={{'text-align': 'right'}} >{row.sgst.toFixed(2)}</td>
                      </tr>
                      <tr style={{'text-align': 'center'}}>
                        <td >{row.date}</td>
                        <td style={{'text-align': 'left'}} colspan="4">CGST{parseInt(row.tax_percentage)/2}%</td>
                        <td colspan="1"></td>
                        <td style={{'text-align': 'right'}}>{row.cgst.toFixed(2)}</td>
                      </tr>
                      </>
                      
                      }
                    </>

                ))}
                <br></br>

                    {GrandDetails.length!=0  && GrandDetails.map((row, index) => (
                    <>
                    
                    {
                    <tr style={{'text-align': 'center'}}>
                      <td >{row.date}</td>
                      <td style={{'text-align': 'left'}} colspan="4">{row.Description}</td>
                      <td colspan="1"></td>
                      {/* <td >{row.base_amount}</td> */}
                      <td style={{'text-align': 'right'}}>{row.Charges}</td>
                      <td style={{'text-align': 'right'}}>{(Math.abs(row.Credits)).toFixed(2)}</td>
                      <td style={{'text-align': 'right'}}>{row.Balance}</td>
                      {/* <td>{index}</td> */}
                      
                    </tr>}
                    </>))}
    </tbody>
    <br></br>
<thead>
    <tr style={{border: '1px solid black', 'text-align': 'center'}}>
       
       <th  colspan="3">Description</th>
       <th >Amount</th>
       <th >Tax Percent</th>
       <th  colspan="1">cgst</th>
       <th>Tax Percent</th>
       <th >sgst</th>
       <th >vat</th>
       <th >total</th>
    </tr>
    </thead>
    <tbody>

      {testTrxnCode.length!=0  && testTrxnCode.map((row, index) => (
                    <>
{/* row.tax_percentage!=0 && row.cgst!=0 && row.sgst!=0 && */}
                    {
                      <>
                      <tr style={{'text-align': 'center'}}>
                      
                      <td style={{'text-align': 'left'}}  colspan="3">{row.name}</td>
                      <td style={{'text-align': 'right'}}>{row.baseAmt.toFixed(2)}</td>
                      <td style={{'text-align': 'right'}}>{row.taxPer.toFixed(2)}</td>
                        <td style={{'text-align': 'right'}}>{row.cgst.toFixed(2)}</td>
                        <td style={{'text-align': 'right'}}>{row.taxPer.toFixed(2)}</td>
                        <td style={{'text-align': 'right'}}>{row.sgst.toFixed(2)}</td>
                        <td style={{'text-align': 'right'}}>{row.vat.toFixed(2)}</td>
                        <td style={{'text-align': 'right'}}>{row.total.toFixed(2)}</td>


                      </tr>
                   
                      </>}
                    </>

                ))}
    </tbody>
    {/* <tbody>
    <tr style={{'text-align': 'center'}}>
       <th >{getData["arrivalDate"]}</th>
       <th >{getData["arrivalDate"]}</th>
       <th  colspan="4">{getData["arrivalDate"]}</th>
       <th >{getData["arrivalDate"]}</th>
       <th >{getData["arrivalDate"]}</th>
       <th >{getData["arrivalDate"]}</th>
    </tr>
  <tr style={{ 'text-align': 'center' }}> <b> Transaction Summary</b></tr>
  <tr style={{border: '1px solid black', 'text-align': 'center'}} colspan= '2'>
    <th >Description</th>
    <th >Amount</th>
    <th  colspan="4"> Tax Per</th>
    <th >SGST</th>
    <th >Tax Percent</th>
    <th >CGST</th>
  </tr>
  <tr style={{border: '1px solid black', 'text-align': 'center'}} colspan= '2'>
    <td >{getData["description"]}</td>
    <td >{getData["rate"]}       </td>
    <td  colspan="4"> {getData["taxPercentage"]}</td>
    <td >{getData["sgst"]}         </td>
    <td >{getData["taxPercentage"]}</td>
    <td >{getData["cgst"]}         </td>
  </tr>
    <tr>
     <td colspan="8" >
     <p> <span style={{"font-weight": 'bold','text-align': 'left'}}> Amount in words: {getData["paymode"]}</span> </p>  </td>
    </tr>
    <tr >
     <td colspan="8" >
     <p> <span style={{"font-weight": 'bold','text-align': 'left'}}> Paymode: {getData["paymode"]}</span> </p>  </td>
    </tr>
    <tr >
     <td colspan="8" >
     <p> <span style={{"font-weight": 'bold','text-align': 'left'}}> Agent Details: {getData["agent"]} </span> </p>  </td>
    </tr>

    
    </tbody> */}

    {/* table footter should come in all pages */}
    
    <tfoot style={{ border:'1px,solid black' }}>
   
    <tr vertical-align:bottom valign="bottom" style={{width:'210mm', height:'80px',border:'1px solid black',borderRight:'1px solid black', borderLeft: '1px solid black','text-align': 'left' ,'border-collapse': 'collapse'}} rowspan='100px' colspan="4">
       <td colspan="4" style={{'text-align': 'left'}}>Cashier Signature &nbsp;&nbsp;&nbsp;&nbsp;</td>
       <td colspan="4" style={{'text-align': 'center'}}>Duty Manager Signature &nbsp;&nbsp;&nbsp;&nbsp;</td>
       <td colspan="4" style={{'text-align': 'right'}}>Guest Signature &nbsp;&nbsp;&nbsp;&nbsp;</td>
    </tr>
   
    <tr  valign="top" style={{border: '1px solid black', 'text-align': 'left',width:'210mm'}}>
       <td colspan="12">Service Accounting Codes :Tariff:996311</td>
    </tr>
    </tfoot>
  </table>
</div>
</html>
  )
}

export default Print
