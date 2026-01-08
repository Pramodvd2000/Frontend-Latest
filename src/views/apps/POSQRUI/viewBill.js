import { useState,useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import "./inventorygrid.css";
import { Input, Form, Label, CardTitle, CardHeader, ModalFooter, InputGroup, InputGroupText, Row, Col,Card,CardBody,Table,Button} from "reactstrap";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import API_URL from "../../../config";
import React from 'react';
import hotellogo from '../../../assets/images/logo/oterra.jpg';
import { FaArrowCircleDown } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";


const PreviewviewBillpage = ({isViewBillVisible,handleCloseViewBillClick,previewdata}) => {
const navigate = useNavigate();
let data = previewdata;
const [logoimage, setLogo] = useState(null);
const [hotelAddress, setHotelAddress] = useState(null);
const [hotelName, setHotelName] = useState(null);
const [hotelNo, setHotelNo] = useState(null);
const[hotelFax,sethotelFax] = useState(null)
const [image, setImage] = useState(null);
const [hotelDetails, setHotelDetails] = useState(null);
const [CINNumber, setCINNumber] = useState(null);
const [FSSAINumber, setFSSAINumber] = useState(null);
const [GSTINNumber, setGSTINNumber] = useState(null);
const [firmdata, setfirmdata] = useState(null);
const [faxdata, setfaxdata] = useState(null);
const [websitedata, setwebsitedata] = useState(null);
const [postalcodedata, setpostalcodedata] = useState(null);
const[logostatus, setlogostatus] = useState()
const [imagelogo, setimage] = useState()


useEffect(() => {
  fetchx(API_URL + "/getBusinessDatePOS", {
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
      setCINNumber(postres['data'][0]['CINNumber'])
      setGSTINNumber(postres['data'][0]['GSTIN'])
      setFSSAINumber(postres['data'][0]['FSSAINumber'])
      setfirmdata(postres['data'][0]['firm'])
      setfaxdata(postres['data']['0']['fax'])
      setwebsitedata(postres['data']['0']['website'])
      setpostalcodedata(postres['data']['0']['postalcode'])
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}, [])

function inWords(num) {
  var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  var n; // Declare 'n' as a variable

  if ((num = num.toString()).length > 9) return 'overflow';
  n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  var str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupees only ' : '';
  return str;
}

// const subtotal = data.reduce((sum, row) => sum + (row.unitPrice ?? row.Price), 0);
const subtotal = data.reduce(
  (sum, row) => sum + Number(row.unitPrice ?? row.Price), 
  0
).toFixed(2);


  return (
    <>
      <Modal
        isOpen={isViewBillVisible}
        className="modal-dialog-centered modal-fullscreen"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 1050, 
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >  
      <div style={{ 
        marginTop: '5px', 
        padding: '20px 8px', 
        marginLeft: '0px', 
        width: '100%', 
        height: '40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <FaArrowLeft style={{ fontSize: '18px', cursor: 'pointer' }} onClick={handleCloseViewBillClick}/>
        <span style={{marginLeft:'-240px',fontSize:'20px',fontFamily: 'Arial, sans-serif'}}>Bill</span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FF4B3A',
          color: 'white',
          fontWeight: 'bold',
          padding: '10px 10px',
          borderRadius: '5px',
        }}
        onClick={() => {
          navigate('/apps/POSQRlogout');
        }}
        >
          
      <IoMdCloseCircleOutline/> 
        </div>
      </div>

      <CardBody>
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <img
            src={hotellogo}
            alt="The Oterra"
            style={{ width: '80px', height: 'auto', marginBottom: '10px' }}
          />
          <h4 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>THE OTERRA</h4>
          <p style={{ margin: '0', fontSize: '12px', lineHeight: '1.5' }}>
            Velankani Tech Park, Hosur Rd,<br />
            Electronics City, Bengaluru<br />
            Karnataka 560100
          </p>
        </div>
        <div
          // style={{
          //   marginTop: '30px',
          //   maxHeight: '400px', 
          //   overflowY: 'auto', 
          //   overflowX: 'hidden',
          // }}
          style={{
            marginTop: '30px',
            maxHeight: '130px', 
            overflowY: 'auto', 
            overflowX: 'hidden',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'Arial, sans-serif',
              fontSize: '12px',
              tableLayout: 'auto',
              minWidth: '300px', 
              overflowY: 'auto',
            }}
          >
      <thead style={{ position: 'sticky', top: 0, background: '#f1f1f1', zIndex: 1 }}>        <tr>
                <th style={{ textAlign: 'left', width: 'auto' }}>Item</th>
                <th style={{ textAlign: 'center', width: 'auto' }}>Qty</th>
                <th style={{ textAlign: 'right', width: 'auto' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td
                    style={{
                      textAlign: 'left',
                      padding: '8px',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {row.itemName}
                  </td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>{row.qty}</td>
                  {/* <td style={{ textAlign: 'right', padding: '8px' }}>₹{row.unitPrice}</td> */}
                  <td style={{ textAlign: 'right', padding: '8px' }}>₹{row.unitPrice ?? row.Price}+GST</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
      <div style={{ 'border-bottom': '1px solid #E8E8E8', 'margin-bottom': '-20px' }} ></div>

      <CardBody className='invoice-padding pb-0'  style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'Arial, sans-serif',
              fontSize: '12px',
              tableLayout: 'auto',
              minWidth: '300px', 
              position: 'sticky',
            }}>
                <Row className='invoice-sales-total-wrapper'>
                  <Col className='mt-md-0 mt-3' md='6' order={{ md: 1, lg: 2 }}>

                  </Col>
                  <Col className='d-flex justify-content-end' md='6' order={{ md: 2, lg: 1 }}>
                    <div className='invoice-total-wrapper'>
                      <div className='invoice-total-item'>
                      </div>
                      <div className='invoice-total-item'>
                      </div>
                     
                      {/* {previewFolioData.classDiscDisplay.map((item, index) => ( */}
                        <div className='invoice-total-item'>
                          <p className='invoice-total-title'><strong>SUB TOTAL: {subtotal} </strong></p>
                        </div>
                      {/* ))} */}
                      <div className='invoice-total-item'>
                        <p className='invoice-total-title'><strong>ROUNDOFF : 0.00</strong></p>
                      </div>
                      <div className='invoice-total-item'>
                        <p className='invoice-total-title'><strong>TOTAL : {subtotal}+GST</strong></p>
                      </div>
                      <div style={{ 'border-bottom': '1px solid #E8E8E8', 'margin-bottom': '2px' }} ></div>

                    </div>
                  </Col>
                </Row>

              </CardBody>

              <div style={{ 'border-bottom': '1px solid #E8E8E8', 'margin-bottom': '2px' }} ></div>


      <CardBody className='invoice-padding pt-0'>
  <Row>
    <Col sm='10'  style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'Arial, sans-serif',
              fontSize: '12px',
              tableLayout: 'auto',
              minWidth: '300px', 
              overflowY: 'auto',
              marginLeft:'5px'
            }}>
      <span>
        <strong><p>GSTIN No. {GSTINNumber}</p></strong>
        <p>CIN: {CINNumber}</p>
        <p>{hotelName} </p>
        <p>{firmdata}</p>
        <p>{hotelAddress} {postalcodedata} India</p>
        <p> T:+{hotelNo}  F: +{faxdata}  W: {websitedata}</p>
      </span>
    </Col>
    <Col sm='2' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      {logostatus === 1 ? (
        <a href="https://www.theoterra.com/net_zero_hotel" target="_blank" rel="noopener noreferrer">
        <img src={API_URL + `/imagepaths/${imagelogo}`} alt="NatZero Logo" style={{ width: '100px', height: '80px' }} />
        </a>
      ) : (
        <div> </div>
      )}
    </Col>
  </Row>
</CardBody>

      </Modal>
   
    </>
  );
};

export default PreviewviewBillpage;
