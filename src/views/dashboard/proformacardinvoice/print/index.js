import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle,  Input,InputGroup, InputGroupText, Table, CardFooter } from 'reactstrap'
// import "./A4style.scss";
import Logo from '../../oterra.jpg';
import { TableFooter, TableHead } from '@mui/material';
import { useEffect } from 'react'
// import API_URL from '../../../../config'


const Print = () => {
  useEffect(() => {
    setTimeout(() => window.print(), 50)
    const divToPrint = document.getElementById('divId');

    // Create a canvas from the div element
    // html2canvas(divToPrint).then((canvas) => {
    //   const divWidth = divToPrint.offsetWidth;
    //   const divHeight = divToPrint.offsetHeight;
    //   const ratio = divWidth / divHeight;
    //   const imgData = canvas.toDataURL('image/png');
    //   const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    //   const thead = pdf.internal.pageSize.getWidth();
    //   const height = thead / ratio;
    //   pdf.addImage(imgData, 'PNG', 0, 0, thead, height);
    //   pdf.save('file.pdf');
    // });
  }, [])

  // console.log(localStorage.getItem(('getData')['id']))
  let getData = JSON.parse(localStorage.getItem('data1'))
  console.log(getData['id'])




  return(
<div className='proForma'>
<body>
  <div style={{border: '1px solid black', width: '210mm'}} >
  <table >
    <thead>
    <tr>
        <td colSpan={2}> 
     <tr>
            <td colSpan={12}>GST ID :{getData["gstId"]}  </td>    
     </tr>
     <tr>  
            <td colSpan={12}> Original Bill :{getData["bill"]}</td>  
     </tr>
     <tr>   
            <td colSpan={12}>OriginalBillDate :{getData["bill"]}</td>     
     </tr> 
     <b> <h3>PRO-FORMA FOLIO</h3></b>
     </td>
     <td colSpan={6}>         
     <div>
  <img style={{ thead: '80px', height: '80px',display:'block',marginLeft:'auto',marginRight:'auto' }} src={Logo} />
  </div>
     </td>     
     </tr>
    <tr>  
      <td colSpan={2}><b> TEST TEST</b> </td>  
      <td colSpan={10}>Bill No : {getData["name"]} </td>  
   </tr>
   <tr>  
     <td colSpan={2}><b> UNKNOWN</b> </td>  
     <td colSpan={10}>Page : 1 of 1</td>  
    </tr>
      <tr> 
        <td colSpan={2}> </td>
        <td colSpan={10}>Room No. : {getData["room"]}</td>       
      </tr>
      <tr>
        <td colSpan={2}> </td>
        <td colSpan={10}>Rate.: {getData["rate"]}</td>       
      </tr>
      <tr>  
        <td colSpan={2}> </td>  
        <td colSpan={10}> Guests : {getData["numberOfAdults"]}</td>        
      </tr>
     <tr>   
       <td colSpan={2}> Guest Name:  {getData["name"]} </td>  
       <td colSpan={10}> Arrival : {getData["arrivalDate"]}</td>     
    </tr> 
    <tr>   
       <td colSpan={2}> Travel Agent: {getData["agent"]}</td>  
       <td colSpan={10}> Departure : {getData["Departure"]}</td>    
    </tr> 
    <tr>   
       <td colSpan={2}> Property Tax ID:{getData["roomCategory"]} </td>         
       <td colSpan={10}>Membership : {getData["membershipType"]}</td>    
    </tr>
   <tr>   
    <td colSpan={2}> Billing : {getData["billing"]} </td>  
    <td colSpan={10}> Confirmation No.: {getData["name"]} </td>     
   </tr>
    </thead>

   <tbody>
   <tr style={{border: '1px solid black'}}>
      <th style={{border: '1px solid black'}} >Date</th>
      <th style={{border: '1px solid black'}} >Description</th>
      <th style={{border: '1px solid black'}} >Reference</th>
      <th style={{border: '1px solid black'}} >Debit</th>
      <th  style={{border: '1px solid black'}}>Credit</th>
   </tr>
   <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
   <tr>
      <td colSpan={4}> Total</td>
      <td colSpan={4}> INR</td>
      <td colSpan={4}> {getData["vat"]} </td>
    </tr>
   <tr>
      <td colSpan={4}> Balance</td>
      <td colSpan={4}> INR</td>
      <td colSpan={4}> {getData["vat"]} </td>
    </tr>
    <tr>
      <td colSpan={4}> VAT</td>
      <td colSpan={4}> INR</td>
      <td colSpan={4}> {getData["vat"]} </td>
    </tr>
   <br/>
   <tr>
     <td colSpan={2}>HSN/SAC CODE </td>  
     <td colSpan={2}>SALES </td>  
     <td colSpan={2}> CGST  </td>  
     <td colSpan={2}>SGST   </td>  
     <td colSpan={2}>IGST  </td>  
     <td colSpan={2}> CESS TAX </td>  
</tr>
<tr style={{border:'1px solid black', height:'20px'}}>   
    <td colSpan={2}>{getData["name"]}  </td>  
    <td colSpan={2}> {getData["name"]} </td>  
    <td colSpan={2}>{getData["name"]}  </td>  
    <td colSpan={2}>{getData["name"]}  </td>  
    <td colSpan={2}>{getData["name"]}  </td>  
    <td colSpan={2}>{getData["name"]}   </td>  
   
</tr>
<br/>
<tr>
    <td colSpan={2}>CASHIER</td>  
    <td colSpan={2}>_____________ </td>  
    <td colSpan={4}>_ </td>  
    <td colSpan={2}>GUEST'S SIGNATURE</td>  
    <td colSpan={2}>_____________ </td> 
</tr>
   <br/>
   </tbody>

   <tfoot style={{borderTop: '1px solid black'}}>
      <tr><td style={{textAlign:'center'}}><b>The Oterra</b> </td></tr>
      <tr><td style={{textAlign:'center'}}><b>#43,Electronics City, Phase 1, Hosur Road, Bengaluru 560100 India </b></td></tr>
      <tr><td style={{textAlign:'center'}}><b>CIN No.:U72200KA1999PLC025275 </b></td></tr> 
   </tfoot>
</table>
</div>
</body>
</div>
)
}

export default Print


