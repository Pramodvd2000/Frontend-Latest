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
    vipLevel: '',
    vipType:''
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
    fetchx(API_URL2 + '/getvip?hotelID=1')
      .then(result => result.json())
      .then(rowData => setRowData(rowData['data']))

      // fetchx(API_URL2 +"/getAccomadationTransactionCode?hotelID=1")
      // .then((result) => result.json())
      // .then((rowData) => setTransactionCodeData(rowData["data"][0]['id']));
  }, []);


  const onSubmit = (data) => {
    console.log(data)
    setData(data);
    // if (data.firstName !== null && data.name !== null) {
      let createmarketGroup = JSON.stringify({
        id: data1.id,
        hotelID:data1.hotelID,
        vipLevel: data.vipLevel1,
        vipType:data.vipType1
          }); 
          console.log(createmarketGroup)
      let columnsToUpdate = createmarketGroup
      let res = fetchx(API_URL2 + `/updateVipData?id=${data1.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: columnsToUpdate,
        }
      )
        .then((result) => result.json())
        .then((resp) => {
                localStorage.setItem("id", data1["id"]);
                 if(resp['statusCode']==200){
            const swalInstance = MySwal.fire({
             text: 'VIP Details Updated Successfully!',
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
                text: 'VIP Details Not Updated!',
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
    
        })
        .catch((error) => {
         //console.log(error);
        });
        //  }
  };
 

  return (
    <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Row>            
              <Col md='4' sm='12'>
                 <div className='mb-1'>
                   <Label className='form-label' for='vipType'>
                     VIP Type
                   </Label>
                   <InputGroup className='input-group-merge'>                     
                     <Controller
                       id='vipType1'
                       name='vipType1'
                       control={control}
                       defaultValue={data1["vipType"]}

                       render={({ field }) => 
                         <Input placeholder='vipType'
                         // pattern="[a-zA-Z ]*" title="Type Only Alphabets" 
                         required 
                          {...field} />}
                     />
                   </InputGroup>
                 </div>
               </Col>  

                               <Col md='4' sm='12'>
                 <div className='mb-1'>
                   <Label className='form-label' for='vipLevel'>
                     VIP Level
                   </Label>
                   <InputGroup className='input-group-merge'>
                     
                     <Controller
                       id='vipLevel1'
                       name='vipLevel1'
                       control={control}
                       defaultValue={data1["vipLevel"]}

                       render={({ field }) => 
                         <Input placeholder='vipLevel'
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