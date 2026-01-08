// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import Select from 'react-select'
import toast from 'react-hot-toast'
import classnames from 'classnames'
import { Check } from 'react-feather'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import { selectThemeColors } from '@utils'

import "./companydetails.scss"

// ** Reactstrap Imports
import { Card, Form, Row, Col, Label, Input, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

const defaultValues = {
  source: '',
  companyID: null
}


let companyID = []
fetchx(API_URL + '/getAccountName?hotelID=1')
  .then(result => result.json())
  .then(resp => {
    // console.log(resp['data'])
    companyID = resp['data']
    // console.log(companyID)
  })

  
const ValidationThirdPartyComponents = () => {
    // ** State
    const [data, setData] = useState(null)
    const [source, setsource] = useState('')
  
  const [showDropdown, setShowDropdown] = useState(false)

  function handleRadioChange(event) {
    if (event.target.value === 'corporate') {
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
    setsource(event.target.value)
  }

  function handleDropdownChange(event) {
    alert("company selected")
    // Do something with the selected value
  }

  // ** Hooks
  const { reset, handleSubmit, control } = useForm({ defaultValues })

  const onSubmit = data => {
    setData(data)

    if (source !== null && source !== '') {
      //console.log(source)

      if (source === 'corporate' && data.companyID !== null) {
        //console.log(source)
        //console.log(companyID)
        const corporate = JSON.stringify({
          source,
          companyID: data.companyID.value

        })
        //console.log(corporate)
        const res = fetchx(API_URL + "/CompanyInformation", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: corporate
        }).then((res) => {
          //console.log(res)
        }).catch((error) => {
          //console.log(error)
        })
      } else {
        //console.log("FIT")
        //console.log(source)
        const company = JSON.stringify({
          source, 
          companyID:1
        })

        //console.log(company)
        const res = fetchx(API_URL + "/CompanyInformation", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: company
        }).then(result => result.json())
        .then(resp => {
         const floorList = resp['data']['reservationid']
         localStorage.setItem('reservationid', floorList)
          //console.log(floorList)
        }).catch((error) => {
          //console.log(error)
        })
      }
    }
  }


  const handleReset = () => {
    reset({
      source: '',
      companyID: null
    })
  }

  return (
    <div>

      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Source</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col className='name'>
                <div className='demo-inline-spacing'>
                  <div className='form-check'>
                    <Label className='form-check-label' for='ex1-active'>
                      <Input type="radio" name='ex1' value="fit" onChange={handleRadioChange} />
                      FIT
                    </Label>

                    <br></br>
                    <br></br>
                    <Label className='form-check-label'>
                      <Input type="radio" name='ex1' value="corporate" onChange={handleRadioChange} />
                      Corporate
                    </Label>
                  </div>
                </div>
              </Col>

            </Row>
            {showDropdown && (
              <div>
                <br></br>
                <Col md='6' sm='12'>
                  <div className='mb-1'>
                    {/* <Label className='form-label' for='companyID' >
               Select companyID
             </Label> */}
                    <Controller
                      id='companyID'
                      control={control}
                      name='companyID'
                      render={({ field }) => (
                        <Select
                          isClearable
                          options={companyID}
                          classNamePrefix='select'
                          theme={selectThemeColors}
                          className={classnames('react-select', { 'is-invalid': data !== null && data.companyID === null })}
                          {...field}
                        />

                      )}
                    />
                  </div>
                </Col>
              </div>
            )}

            <div className='button'>
              <Button className='me-1' outline color='secondary' type='reset' onClick={handleReset} >
                Reset
              </Button>
              <Button className='me-1' color='primary' type='submit'>
                Submit
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>

    </div>
  )
}

export default ValidationThirdPartyComponents