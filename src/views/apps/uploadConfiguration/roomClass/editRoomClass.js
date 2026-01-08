import { useState } from 'react'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import { Input, Card, Form, Row, Col, Label, Button ,Modal,InputGroup} from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { useRef, useEffect} from 'react';
import API_URL2 from '../../../../config2'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
const MySwal = withReactContent(Swal)

  const defaultValues = { 
    roomClass: ''
  }
   const editBlock = ({data1}) => {
    console.log(data1)
       
    const {setError,formState: { errors }} = useForm()
    const [rowData, setRowData] = useState();
    const [data, setData] = useState(null)
    const { reset, handleSubmit, control } = useForm({ defaultValues })
    let navigate = useNavigate();  
    const [flag,setflag] = useState(false)  
    const [reload, setreload] = useState(true)

      const [TransactionCodeData,setTransactionCodeData] = useState([])


  useEffect(() => {
    fetchx(API_URL2 + '/getroomclass?hotelID=1')
      .then(result => result.json())
      .then(rowData => setRowData(rowData['data']))

      // fetchx(API_URL2 +"/getAccomadationTransactionCode?hotelID=1")
      // .then((result) => result.json())
      // .then((rowData) => setTransactionCodeData(rowData["data"][0]['id']));
  }, []);


  // const onSubmit = (data) => {
  //   console.log(data)
  //   setData(data);
  //   // if (data.firstName !== null && data.name !== null) {
  //     let createmarketGroup = JSON.stringify({
  //       "id": data1.id,
  //       "roomClass": data.roomClass1,
  //       "isActive":data.isActive,
  //       // hotelID:data1.hotelID
  //               // hotelID:1


  //         }); 
  //         console.log(createmarketGroup)
  //     let columnsToUpdate = createmarketGroup
  //     let res = fetchx(API_URL2 + `/updateRoomClass`,
  //       {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: columnsToUpdate,
  //       }
  //     )
  //       .then((result) => result.json())
  //       .then((resp) => {
  //         console.log(resp)
  //                if(resp['statusCode']==200){
  //           const swalInstance = MySwal.fire({
  //            text: 'RoomClass Details Updated Successfully!',
  //            icon: 'success',
  //            buttonsStyling: false,
  //            confirmButtonText: 'Close',
  //            customClass: {
  //              confirmButton: 'btn btn-danger'
  //            }
  //        });
  //        swalInstance.then((result) => {
  //          if (result.isConfirmed) {      
  //            navigate('');
  //          }
  //        }); 
        
  //        }
  //        else{
  //           const swalInstance = MySwal.fire({
  //               text: 'RoomClass Details Not Updated!',
  //               icon: 'success',
  //               buttonsStyling: false,
  //               confirmButtonText: 'Close',
  //               customClass: {
  //                 confirmButton: 'btn btn-danger'
  //               }
  //           });
  //           swalInstance.then((result) => {
  //             if (result.isConfirmed) {      
  //               navigate('');
  //             }
  //           });  
  //        }
    
  //       })
  //       .catch((error) => {
  //        //console.log(error);
  //       });
  //       //  }
  // };
 

  const onSubmit = (data) => {
    setData(data);
      let createmarketGroup = JSON.stringify({
        "id": data1.id,
        "roomClass": data.roomClass1,
        
          }); 
      let columnsToUpdate = createmarketGroup
      let res = fetchx(API_URL2 + `/updateRoomClass?id=${data1.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: columnsToUpdate,
        }
      )
        .then((result) => result.json())
        .then((resp) => {
                 if(resp['statusCode']==200){
            const swalInstance = MySwal.fire({
             text: 'Block Details Updated Successfully!',
             icon: 'success',
             buttonsStyling: false,
             confirmButtonText: 'Close',
             customClass: {
               confirmButton: 'btn btn-danger'
             }
         });
         swalInstance.then((result) => {
           if (result.isConfirmed) {      
             navigate('');
           }
         }); 
        
         }
         else{
            const swalInstance = MySwal.fire({
                text: 'Block Details Not Updated!',
                icon: 'error',
                buttonsStyling: false,
                confirmButtonText: 'Close',
                customClass: {
                  confirmButton: 'btn btn-danger'
                }
            });
            swalInstance.then((result) => {
              if (result.isConfirmed) {      
                navigate('');
              }
            });  
         }
    
        })
        .catch((error) => {
         //console.log(error);
        });
        
  };

  
  return (
    <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Row>            
              <Col md='4' sm='12'>
                 <div className='mb-1'>
                   <Label className='form-label' for='roomClass1'>
                     Room Class
                   </Label>
                   <InputGroup className='input-group-merge'>
                     
                     <Controller
                       id='roomClass1'
                       name='roomClass1'
                       defaultValue={data1["roomClass"]}
                       control={control} 
                       render={({ field }) => 
                         <Input 
                         placeholder='roomClass'
                         // pattern="[a-zA-Z ]*" title="Type Only Alphabets" 
                    
                         required 
                          {...field} />}
                     />
                   </InputGroup>
                 </div>
               </Col>  
               
                    
              </Row>
            </div>

                          <br/>
           <div align='end' className='buttons'>
            <Button className="me-1" color="primary" type='submit' onClick={()=>setflag(true)}>
           Update And Exit
           </Button>
                    </div>           

          </Form>
    </div>
  )
}

export default editBlock;