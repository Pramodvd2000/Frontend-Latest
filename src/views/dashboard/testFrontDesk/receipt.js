

import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input,InputGroup, InputGroupText } from 'reactstrap'
import Logo from './oterra.jpg';
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas';

import "./A4style.scss";
function Receipt({data1}) {
    //console.log(data1)
    // //console.log(data1.marketCode)
    // //console.log(data1.name)

    const divToPrint = document.getElementById('divId');
    
    // Create a canvas from the div element
    html2canvas(divToPrint).then((canvas) => {
      const divWidth = divToPrint.offsetWidth;
      const divHeight = divToPrint.offsetHeight;
      const ratio = divWidth / divHeight;
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const width = pdf.internal.pageSize.getWidth();
      const height = width / ratio;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('file.pdf');
    });
    
  return(
<div className='a4-card'>
<div>

 <div style={{width:'210mm',paddingTop:'30px'}}>
 <tr>
   <td >
   <div style={{paddingLeft:'30px', paddingTop:'20px'}}>
   <img style={{ width: '80px', height: '80px',display:'block', marginBottom:'80px',marginLeft:'auto',marginRight:'auto' }} src={Logo} />
   </div>
   </td>  
   <td >
   <th class="align-bottom" colspan="6">
   <h1 style={{ 'text-align': 'center', 'font-style': 'normal' }}>
   <font style={{ 'font-size': '24px', 'line-height': '100%' }}><b >THE OTERRA</b></font>
   </h1>
   <p style={{'line-height': '80%', 'text-align': 'center', paddingLeft:'15px',fontSize:'13px'}}><b><u>A DIVISION OF VELANKANI INFORMATION SYSTEMS LTD</u></b></p>
   <p class="receiptHeader" style={{  paddingLeft:'40px' }}>43, Hosur Road, Electronic City Phase 1, Bengaluru, Karnataka- 560100</p>
   <p style={{ 'line-height': '50%', 'text-align': 'center','font-size': '13px',paddingLeft:'10px'}} >+918030030303</p>
   <p style={{ 'line-height': '50%', 'text-align': 'center','font-size': '13px',paddingLeft:'10px'}} >www.theoterra.com</p>
   <p style={{ 'line-height': '50%', 'text-align': 'center','font-size': '13px',paddingLeft:'10px'}} >RECEIPT</p>
   </th>
   </td>
   <th valign="bottom" colspan="2" style={{'text-align': 'right' }}>Bill Date: "06-06-2023"</th>
   </tr>  
    <p style={{ 'line-height': '80%',textAlign:'center', paddingRight:'180px'}}><b>GSTIN:29AABCV0552G1ZF</b></p>
 </div>
 <br/>
 <br/>
 <div>
 <p style={{paddingLeft:'20px'}}><b>Received with thanks from {data1["salutation"]} {data1["name"]}                         </b></p> 
 <p style={{paddingLeft:'20px'}}><b>A sum of Rs.{data1["rate"]}/-                                             </b></p>
 <p style={{paddingLeft:'20px'}}><b>towards Advance in AXIS BANK CARDS                                        </b></p>
 <p style={{paddingLeft:'20px'}}><b> Room No :</b> {data1['roomNumber']} Check In Date :{data1["arrivalDate"]} </p>
 </div>
 </div>
</div>
)
}

export default Receipt;