import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input,InputGroup, InputGroupText, Table, CardFooter } from 'reactstrap'
// import "./A4style.scss";
import Logo from './oterra.jpg';
import { TableFooter, TableHead } from '@mui/material';
function App({data1}) {
  return(
<div className='proForma'>
<body>
  <div >
  <Card style={{ height:'296mm'}}>
    <CardHeader>
      <table style={{ width:'680px'}}>
      <Row>
        <Col md='8' sm='12'>
        <tr>
  <Row>
      <Col md='5' sm='12'>  <td>GST ID  </td> </Col>
      <Col md='7' sm='12'>  <td> :{data1["gstId"]}  </td> </Col>
  </Row>
 </tr>
 <tr>
  <Row>
      <Col md='5' sm='12'>  <td> Original Bill</td> </Col>
      <Col md='7' sm='12'>  <td> :{data1["bill"]} </td> </Col>
     </Row>
 </tr>
 <tr>
  <Row>
      <Col md='5' sm='12'>  <td>OriginalBillDate</td> </Col>
      <Col md='7' sm='12'>  <td> :{data1["bill"]} </td> </Col> 
  </Row>
 </tr> 
 <tr> <b> <h3>PRO-FORMA FOLIO</h3></b></tr>
        </Col>
        <Col md='4' sm='12'>
        <img style={{ width: '80px', height: '80px' }} src={Logo} />
        </Col>
    </Row>

 <tr>
 <Row>
      <Col md='6' sm='12'>  <td><b> TEST TEST</b> </td> </Col>
      <Col md='2' sm='12'>  <td>Bill No </td> </Col>
      <Col md='4' sm='12'>  <td> : {data1["name"]}</td> </Col>
      {/* <Col md='3' sm='12'>  <td> {data1["name"]}</td> </Col> */}
      </Row>
      </tr>
      <tr>
 <Row>
      <Col md='6' sm='12'>  <td><b> UNKNOWN</b> </td> </Col>
      <Col md='2' sm='12'>  <td>Page</td> </Col>
      <Col md='4' sm='12'>  <td> : 1 of 1</td> </Col>
    {/* <Col md='3' sm='12'>  <td>1 of 1</td> </Col> */}
      </Row>
      </tr>
      <tr>
 <Row>
      <Col md='6' sm='12'>  <td> </td> </Col>
      <Col md='2' sm='12'>  <td>Room No.</td> </Col>
      <Col md='4' sm='12'>  <td> : {data1["room"]}</td> </Col>
    {/* <Col md='3' sm='12'>  <td> {data1["room"]}</td> </Col> */}
      </Row>
      </tr>
      <tr>
 <Row>
    <Col md='6' sm='12'>  <td> </td> </Col>
    <Col md='2' sm='12'>  <td>Rate.</td> </Col>
    <Col md='4' sm='12'>  <td> :</td> </Col>
    {/* <Col md='3' sm='12'>  <td> {data1["rates"]}</td> </Col> */}
      </Row>      
      </tr>
      <tr>
 <Row>
      <Col md='6' sm='12'>  <td> </td> </Col>
      <Col md='2' sm='12'>  <td>Guests</td> </Col>
      <Col md='4' sm='12'>  <td> : {data1["numberOfAdults"]}</td> </Col>
    {/* <Col md='3' sm='12'>  <td> {data1["numberOfAdults"]}</td> </Col> */}
      </Row>
      </tr>
      

 
 <tr>
  <Row>
  <Col md='3' sm='12'>  <td> Guest Name </td> </Col>
      <Col md='3' sm='12'>  <td> :  {data1["name"]}</td> </Col>
      {/* <Col md='3' sm='12'>  <td> {data1["name"]} </td> </Col> */}
      <Col md='3' sm='12'>  <td> Arrival</td> </Col>
      <Col md='3' sm='12'>  <td> : {data1["arrivalDate"]}</td> </Col>
      {/* <Col md='3' sm='12'>  <td> {data1["arrivalDate"]} </td> </Col> */}
  </Row>
 </tr> 
 <tr>
  <Row>
  <Col md='3' sm='12'>  <td> Travel Agent</td> </Col>
<Col md='3' sm='12'>  <td> : {data1["agent"]}</td> </Col>
{/* <Col md='3' sm='12'>  <td> {data1["agent"]} </td> </Col> */}
<Col md='3' sm='12'>  <td> Departure</td> </Col>
<Col md='3' sm='12'>  <td> : {data1["Departure"]}</td> </Col>
{/* <Col md='3' sm='12'>  <td> {data1["Departure"]} </td> </Col> */}
  </Row>
 </tr>
 
 <tr>
  <Row>
      <Col md='3' sm='12'>  <td> Property Tax ID </td> </Col>
      <Col md='3' sm='12'>  <td> :{data1["roomCategory"]}</td> </Col>
      {/* <Col md='2' sm='12'>  <td> {data1["roomCategory"]} </td> </Col> */}
      <Col md='3' sm='12'>  <td>Membership</td> </Col>
      <Col md='3' sm='12'>  <td> : {data1["account"]}</td> </Col>
      {/* <Col md='2' sm='12'>  <td> {data1["account"]} </td> </Col> */}
  </Row>
 </tr>
 <tr>
  <Row>
  <Col md='3' sm='12'>  <td> Billing </td> </Col>
      <Col md='3' sm='12'>  <td> : {data1["name"]}</td> </Col>
      {/* <Col md='2' sm='12'>  <td> {data1["name"]} </td> </Col> */}
      <Col md='3' sm='12'>  <td> Confirmation No.</td> </Col>
      <Col md='3' sm='12'>  <td> : {data1["name"]}</td> </Col>
      {/* <Col md='2' sm='12'>  <td> {data1["account"]} </td> </Col> */}
  </Row>
 </tr>
      </table>
    </CardHeader>
    <table style={{border:'25px solid white'}}>
 <table style={{borderTop: '1px solid black', borderBottom:'1px solid black',  width:'660px', height:'20px'}}>
 <tr>
  <Row>
  <Col md='2' sm='12'>  <th><b>Date</b> </th> </Col>
<Col md='2' sm='12'>  <th> <b> Description </b></th> </Col>
<Col md='4' sm='12'> <center> <th> <b> Reference</b> </th></center>  </Col>
<Col md='2' sm='12'>  <th><b> Debit</b>  </th> </Col>
<Col md='2' sm='12'>  <th><b> Credit</b>  </th> </Col>
  </Row>
 </tr>
 </table>

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
 <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br>

 <b>  
<table style={{border:'1px solid white', width:'660px', height:'20px'}}>
<tr>
 <Row>
      <Col md='2' sm='12'>  <td>HSN/SAC CODE </td> </Col>
      <Col md='2' sm='12'>  <td>SALES </td> </Col>
      <Col md='2' sm='12'>  <td> CGST TAX </td> </Col>
      <Col md='2' sm='12'>  <td>SGST TAX  </td> </Col>
      <Col md='2' sm='12'>  <td>IGST TAX </td> </Col>
      <Col md='2' sm='12'>  <td> CESS TAX </td> </Col>
      </Row>
 </tr>
</table>
 <table style={{border:'1px solid black', width:'660px', height:'20px'}}>
    <tr>
      <Row>
      <Col md='2' sm='12'>  <td>{data1["name"]}  </td> </Col>
      <Col md='2' sm='12'>  <td> {data1["name"]} </td> </Col>
      <Col md='2' sm='12'>  <td>{data1["name"]}  </td> </Col>
      <Col md='2' sm='12'>  <td>{data1["name"]}  </td> </Col>
      <Col md='2' sm='12'>  <td>{data1["name"]}  </td> </Col>
      <Col md='2' sm='12'>  <td>{data1["name"]}   </td> </Col>
      </Row>
    </tr>
  </table>
<br></br> {/* <hr></hr> */}

 <br></br>
 <tr>
  <Row>
      <Col md='2' sm='12'>  <td>CASHIER</td> </Col>
      <Col md='2' sm='12'>  <td>_____________ </td> </Col>
      <Col md='2' sm='12'>  <td>_ </td> </Col>
      <Col md='4' sm='12'>  <td>GUEST'S SIGNATURE</td> </Col>
      <Col md='2' sm='12'>  <td>_____________ </td> </Col>
  </Row>
 </tr>
 </b>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
 {/* <hr></hr> */}
 
 
</table>
<CardFooter style={{borderTop: '1px solid black'}}>
<center>
 <tr> <td><b>The Oterra</b> </td></tr>
 <tr> <td> <b>#43,Electronics City, Phase 1, Hosur Road, Bengaluru 560100 India </b></td></tr>
 <tr> <td><b>CIN No.:U72200KA1999PLC025275 </b></td></tr>
 </center>
</CardFooter>
</Card>
</div>
</body>
</div>
)
}
export default App;


{/* <div>
<tr> <td> </td></tr>
<tr>
  <Row>
      <Col md='2' sm='12'>  <td><b> </b> </td> </Col>
      <Col md='1' sm='12'>  <td> : </td> </Col>
      <Col md='2' sm='12'>  <td> </td> </Col>
      <Col md='2' sm='12'>  <td><b> </b>  </td> </Col>
      <Col md='2' sm='12'>  <td> :</td> </Col>
      <Col md='2' sm='12'>  <td> </td> </Col>
  </Row>
 </tr>
</div> */}