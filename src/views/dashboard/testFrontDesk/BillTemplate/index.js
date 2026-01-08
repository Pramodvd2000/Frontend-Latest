// ** Custom Components
import React, {useEffect, useState } from 'react'
import ReactDOMServer from 'react-dom/server';
import API_URL from "../../../../config";

// import ModalBasic from './changeRoom'
import Billing from './BillTemplate'

const TableBordered = () => {
  const [base64Content, setBase64Content] = useState('');

  useEffect(() => {
    const htmlContent = ReactDOMServer.renderToString(<Billing/>);
    // console.log(htmlContent)
    const base64Content = window.btoa(htmlContent);
    // console.log(base64Content)
    setBase64Content(base64Content);

    // /DummyInvoice
    setTimeout(()=>{fetchx(API_URL + "/DummyInvoice", {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                hotelID: 1,
                billNo: '1234',
                data:ReactDOMServer.renderToString(<Billing/>),
                reservationID: localStorage.getItem('reservationID'),
                folioNo:localStorage.getItem('FolioNo')
                  })
            }).then(result => result.json())
            .then(rowData => {

                console.log(rowData)
                
      
              }).catch((error) => {
                console.log(error)
              })},1000)
  }, []);
  return (
    <div>
    {/* <h4>Billing</h4> */}

      <Billing/>
        
    </div>
  )
}

export default TableBordered