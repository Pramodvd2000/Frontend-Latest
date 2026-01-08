
import { useState } from 'react'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import classnames from "classnames";
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import { Input, Card, Form, Row, Col, Label, Button ,} from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import API_URL2 from '../../../../config2'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
const MySwal = withReactContent(Swal)

  const defaultValues = { 
    block: ''
  }

  
 
let roomClassID = [
  fetchx(API_URL2 +'/getroomtyperoomclassid?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      // console.log(resp['data'])
      roomClassID = resp['data']
      // console.log(roomClassID)
    })
  ]


   const editReason = ({data1}) => {
       
    const {setError,formState: { errors }} = useForm()
    const [data, setData] = useState(null)
    const { reset, handleSubmit, control } = useForm({ defaultValues })
    let navigate = useNavigate();  
    const [flag,setflag] = useState(false)  
     
  const defaultReason4 = {
    value: data1.roomClassID,
    label: data1.roomClass,
  }; 


  const onSubmit = (data) => {
    console.log(data)
    setData(data);
      let createmarketGroup = JSON.stringify({
        // "id": data1.id,
        "roomType": data.roomType1,
        "maxAdults": data.maxAdults1,
        "maxChildren": data.maxChildren1,
        "totalNumOfRooms": data.totalNumOfRooms1,
        roomClassID: (data.roomClassID1 === undefined)
        ? data1.roomClassID
        : (data.roomClassID1 === null)
          ? null
          : data.roomClassID1.value,
                  
          }); 
      let columnsToUpdate = createmarketGroup
      let res = fetchx(API_URL2 + `/updateRoomTypeData?id=${data1.id}`,
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
             text: 'Room Type Details Updated Successfully!',
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
                text: 'Room Type Details Not Updated!',
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
        });
        
  };
 

  return (
    <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Row>            
              
            <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="roomType1">
                  Room Type 
                  </Label>
                  <Controller
                    defaultValue={data1["roomType"]}
                    control={control}
                    id="roomType1"
                    name="roomType1"
                    render={({ field }) => (
                      <Input
                        required
                        placeholder="Name"
                        invalid={errors.roomType1 && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='maxAdults1'>
                    Maximum Adults  
                    </Label>
                    <Controller
                      defaultValue={data1["maxAdults"]}
                      control={control}
                      id='maxAdults1'
                      name='maxAdults1'
                      render={({ field }) => <Input 
                      placeholder='Maximum Adults' 
                        invalid={errors.maxAdults1 && true} {...
                        field} />}
                    />
                  </div>
                </Col> 
                <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='maxChildren1'>
                    Maximum Children
                    </Label>
                    <Controller
                      defaultValue={data1["maxChildren"]}
                      control={control}
                      id='maxChildren1'
                      name='maxChildren1'
                      render={({ field }) => <Input 
                      placeholder='Maximum Children' 
                        invalid={errors.maxChildren1 && true} {...
                        field} />}
                    />
                  </div>
                </Col> 
                <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='totalNumOfRooms1'>
                    Total Number Of Rooms
                    </Label>
                    <Controller
                      defaultValue={data1["totalNumOfRooms"]}
                      control={control}
                      id='totalNumOfRooms1'
                      name='totalNumOfRooms1'
                      render={({ field }) => <Input 
                      placeholder='Total Number Of Rooms' 
                        invalid={errors.totalNumOfRooms1 && true} {...
                        field} />}
                    />
                  </div>
                </Col> 
                <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="roomClassID1">
                  Room Class
                  </Label>
                  <Controller
                    id="roomClassID1"
                    control={control}
                    name="roomClassID1"
                    render={({ field }) => (
                      <Select
                        defaultValue={defaultReason4}
                        isClearable
                        options={roomClassID}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select", {
                          // "is-invalid": data !== null && data.roomClassID1 === null,
                        })}
                        {...field}
                        // onChange={handleChange4}
                      />
                    )}
                  />
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
export default editReason;