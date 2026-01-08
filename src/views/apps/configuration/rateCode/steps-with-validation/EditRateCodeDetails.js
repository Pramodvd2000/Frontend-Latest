// import { useState, useEffect } from 'react'
// import Select from 'react-select'
// import classnames from 'classnames'
// import Flatpickr from 'react-flatpickr'
// import { useForm, Controller } from 'react-hook-form'
// import { selectThemeColors } from '@utils'
// import { Form, Label, Input, Row, Col, Button } from 'reactstrap'
// import '@styles/react/libs/flatpickr/flatpickr.scss'
// import '@styles/react/libs/react-select/_react-select.scss'
// import API_URL from '../../../../../config'
// import Moment from 'moment'
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'

// const MySwal = withReactContent(Swal)

// const EditRateCodeDetails = ({ stepper, rateCodeId, initialData = [], onComplete }) => {
//   const defaultData = initialData?.[0]

//   const [formValues, setFormValues] = useState({
//     rateCode: defaultData?.rateCode || '',
//     description: defaultData?.description || '',
//     rateCategoryID: defaultData?.rateCategoryID || '',
//     marketID: defaultData?.marketID || '',
//     sourceID: defaultData?.sourceID || '',
//     packageID: defaultData?.packageID || '',
//     packageTransactionCodeID: defaultData?.packageTransactionCodeID || '',
//     beginSellDate: defaultData?.beginSellDate || null,
//     endSellDate: defaultData?.endSellDate || null,
//     printRate: defaultData?.printRate || 0,
//     discount: defaultData?.discount || 0,
//     dayUse: defaultData?.dayUse || 0,
//     complementary: defaultData?.complementary || 0,
//     houseUse: defaultData?.houseUse || 0,
//     daysApplicable: defaultData?.daysApplicable || 0
//   })

//   const [options, setOptions] = useState({
//     rateCategories: [],
//     marketCodes: [],
//     sources: [],
//     packages: [],
//     transactionCodes: []
//   })

//   const { control, handleSubmit } = useForm()

//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const [rateCategories, marketCodes, sources, packages, transactionCodes] = await Promise.all([
//           fetch(`${API_URL}/getRateCodeRateCategory?hotelID=1`).then(r => r.json()),
//           fetch(`${API_URL}/getRateCodeMarketID?hotelID=1`).then(r => r.json()),
//           fetch(`${API_URL}/getRateCodeSourceID?hotelID=1`).then(r => r.json()),
//           fetch(`${API_URL}/getRateCodePackageID?hotelID=1`).then(r => r.json()),
//           fetch(`${API_URL}/getRateCodeTransactionID?hotelID=1`).then(r => r.json())
//         ])

//         setOptions({
//           rateCategories: rateCategories.data || [],
//           marketCodes: marketCodes.data || [],
//           sources: sources.data || [],
//           packages: packages.data || [],
//           transactionCodes: transactionCodes.data || []
//         })
//       } catch (error) {
//         console.error('Error fetching options:', error)
//       }
//     }

//     fetchOptions()
//   }, [])

//   const handleInputChange = (field, value) => {
//     setFormValues(prev => ({
//       ...prev,
//       [field]: value
//     }))
//   }

//   const handleSelectChange = (field, selectedOption) => {
//     const fieldMap = {
//       rateCategory: 'rateCategoryID',
//       marketCode: 'marketID',
//       source: 'sourceID',
//       package: 'packageID',
//       pkgtransactionCode: 'packageTransactionCodeID'
//     }

//     setFormValues(prev => ({
//       ...prev,
//       [fieldMap[field]]: selectedOption?.value || ''
//     }))
//   }

//   const onSubmit = async () => {
//     try {
//       const payload = {
//         rateCode: formValues.rateCode,
//         description: formValues.description,
//         beginSellDate: formValues.beginSellDate ? 
//           Moment(formValues.beginSellDate).format('YYYY-MM-DD') : null,
//         endSellDate: formValues.endSellDate ? 
//           Moment(formValues.endSellDate).format('YYYY-MM-DD') : null,
//         rateCategoryID: formValues.rateCategoryID,
//         marketID: formValues.marketID,
//         sourceID: formValues.sourceID,
//         packageID: formValues.packageID,
//         packageTransactionCodeID: formValues.packageTransactionCodeID,
//         printRate: formValues.printRate,
//         discount: formValues.discount,
//         dayUse: formValues.dayUse,
//         complementary: formValues.complementary,
//         houseUse: formValues.houseUse,
//         daysApplicable: formValues.daysApplicable,
//         discountAmount: defaultData?.discountAmount || 200,
//         discountPercentage: defaultData?.discountPercentage || 10,
//         isActive: 1,
//         hotelID: defaultData?.hotelID || 1
//       }

//       console.log('Sending payload:', payload)

//       const response = await fetch(`${API_URL}/updateRateCode?id=${rateCodeId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update rate code')
//       }

//       const result = await response.json()
//       console.log('Update successful:', result)

//       await MySwal.fire({
//         title: 'Success',
//         text: 'Rate Code Details Updated Successfully!',
//         icon: 'success',
//         customClass: { confirmButton: 'btn btn-primary' }
//       })

//       if (onComplete) {
//         onComplete(result)
//       }

//     } catch (error) {
//       console.error('Update error:', error)
//       MySwal.fire({
//         title: 'Error',
//         text: error.message || 'Failed to update rate code details',
//         icon: 'error',
//         customClass: { confirmButton: 'btn btn-danger' }
//       })
//     }
//   }

//   return (
//     <Form onSubmit={handleSubmit(onSubmit)} className="p-2">
//       <Row>
//         <Col md='3' sm='12'>
//           <div className='mb-1'>
//             <Label className='form-label' for='rateCode1'>
//               Rate Code <span className="text-danger">*</span>
//             </Label>
//             <Controller
//               name='rateCode1'
//               control={control}
//               defaultValue={defaultData?.rateCode}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   placeholder='Rate Code'
//                   onChange={(e) => {
//                     field.onChange(e)
//                     handleInputChange('rateCode', e.target.value)
//                   }}
//                 />
//               )}
//             />
//           </div>
//         </Col>

//         <Col md='3' sm='12'>
//           <div className='mb-1'>
//             <Label className='form-label' for='description1'>
//               Description <span className="text-danger">*</span>
//             </Label>
//             <Controller
//               name='description1'
//               control={control}
//               defaultValue={defaultData?.description}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   placeholder='Description'
//                   onChange={(e) => {
//                     field.onChange(e)
//                     handleInputChange('description', e.target.value)
//                   }}
//                 />
//               )}
//             />
//           </div>
//         </Col>

//         <Col md='3' sm='12'>
//           <div className='mb-1'>
//             <Label className='form-label' for='rateCategory1'>
//               Rate Category <span className="text-danger">*</span>
//             </Label>
//             <Controller
//               name='rateCategory1'
//               control={control}
//               defaultValue={options.rateCategories.find(cat => cat.value === defaultData?.rateCategoryID)}
//               render={({ field }) => (
//                 <Select
//                   {...field}
//                   options={options.rateCategories}
//                   isClearable
//                   classNamePrefix='select'
//                   theme={selectThemeColors}
//                   onChange={(val) => {
//                     field.onChange(val)
//                     handleSelectChange('rateCategory', val)
//                   }}
//                 />
//               )}
//             />
//           </div>
//         </Col>

//         <Col md='3' sm='12'>
//           <div className='mb-1'>
//             <Label className='form-label' for='marketCode1'>
//               Market Code <span className="text-danger">*</span>
//             </Label>
//             <Controller
//               name='marketCode1'
//               control={control}
//               defaultValue={options.marketCodes.find(market => market.value === defaultData?.marketID)}
//               render={({ field }) => (
//                 <Select
//                   {...field}
//                   options={options.marketCodes}
//                   isClearable
//                   classNamePrefix='select'
//                   theme={selectThemeColors}
//                   onChange={(val) => {
//                     field.onChange(val)
//                     handleSelectChange('marketCode', val)
//                   }}
//                 />
//               )}
//             />
//           </div>
//         </Col>

//         <Col md='3' sm='12'>
//           <div className='mb-1'>
//             <Label className='form-label' for='beginDate1'>
//               Begin Date
//             </Label>
//             <Controller
//               name='beginDate1'
//               control={control}
//               defaultValue={defaultData?.beginSellDate ? [new Date(defaultData.beginSellDate)] : []}
//               render={({ field }) => (
//                 <Flatpickr
//                   {...field}
//                   options={{ allowInput: true }}
//                   className='form-control'
//                   onChange={(dates) => {
//                     field.onChange(dates)
//                     handleInputChange('beginSellDate', dates[0])
//                   }}
//                 />
//               )}
//             />
//           </div>
//         </Col>

//         <Col md='3' sm='12'>
//           <div className='mb-1'>
//             <Label className='form-label' for='sellDate1'>
//               End Date
//             </Label>
//             <Controller
//               name='sellDate1'
//               control={control}
//               defaultValue={defaultData?.endSellDate ? [new Date(defaultData.endSellDate)] : []}
//               render={({ field }) => (
//                 <Flatpickr
//                   {...field}
//                   options={{ allowInput: true }}
//                   className='form-control'
//                   onChange={(dates) => {
//                     field.onChange(dates)
//                     handleInputChange('endSellDate', dates[0])
//                   }}
//                 />
//               )}
//             />
//           </div>
//         </Col>

//         <Col md='3' sm='12'>
//           <div className='mb-1'>
//             <Label className='form-label' for='package1'>
//               Package
//             </Label>
//             <Controller
//               control={control}
//               name='package1'
//               render={({ field }) => (
//                 <Select
//                   {...field}
//                   options={options.packages}
//                   value={options.packages.find(pkg => pkg.value === defaultData?.packageID)}
//                   isClearable
//                   classNamePrefix='select'
//                   theme={selectThemeColors}
//                   onChange={(val) => {
//                     field.onChange(val)
//                     handleSelectChange('package', val)
//                   }}
//                 />
//               )}
//             />
//           </div>
//         </Col>

//         <Col md='3' sm='12'>
//           <div className='mb-1'>
//             <Label className='form-label' for='pkgtransactionCode1'>
//               Package Transaction Code
//             </Label>
//             <Controller
//               control={control}
//               name='pkgtransactionCode1'
//               render={({ field }) => (
//                 <Select
//                   {...field}
//                   options={options.transactionCodes}
//                   value={options.transactionCodes.find(trans => trans.value === defaultData?.packageTransactionCodeID)}
//                   isClearable
//                   classNamePrefix='select'
//                   theme={selectThemeColors}
//                   onChange={(val) => {
//                     field.onChange(val)
//                     handleSelectChange('packageTransactionCode', val)
//                   }}
//                 />
//               )}
//             />
//           </div>
//         </Col>
//       </Row>

//       <div className="d-flex justify-content-end gap-2 mt-2">
//         <Button color="primary" type="submit">
//           Update
//         </Button>
//         <Button color="primary" onClick={() => stepper.next()}>
//           Next
//         </Button>
//       </div>
//     </Form>
//   )
// }

// export default EditRateCodeDetails


import { useState, useEffect } from 'react'
import Select from 'react-select'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import { useForm, Controller } from 'react-hook-form'
import { selectThemeColors } from '@utils'
import { Form, Label, Input, Row, Col, Button } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import API_URL from '../../../../../config'
import Moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom'

const MySwal = withReactContent(Swal)


const EditRateCodeDetails = ({ stepper, rateCodeId, initialData = [], onComplete }) => {
  const defaultData = initialData?.[0]
  const navigate = useNavigate()
  console.log("defaultData",defaultData)

  // Add selectedOptions state to track current select values
  const [selectedOptions, setSelectedOptions] = useState({
    rateCategory: null,
    marketCode: null,
    source: null,
    package: null,
    pkgtransactionCode: null    
  })

  console.log("selectedOptions",selectedOptions)

 console.log("selectedOptions.pkgtransactionCode",selectedOptions.pkgtransactionCode)

const [formValues, setFormValues] = useState({
    rateCode: null,
    description: null,
    rateCategoryID: null,
    marketID: null,
    sourceID: null,
    packageID: null,
    packageTransactionCodeID: null,
    beginSellDate: null,
    endSellDate: null,
    printRate: null,
    discount: null,
    dayUse: null,
    complementary: null,
    houseUse: null,
    daysApplicable: null,
  });
  useEffect(() => {
    if (defaultData) {
      setFormValues(prev => ({
        ...prev,
        beginSellDate: defaultData.beginSellDate ? new Date(defaultData.beginSellDate) : null,
        endSellDate: defaultData.endSellDate ? new Date(defaultData.endSellDate) : null
      }))
    }
  }, [defaultData])
 

useEffect(() => {
    if (defaultData) {
      setFormValues({
        rateCode: defaultData.rateCode,
        description: defaultData.description,
        rateCategoryID: defaultData.rateCategoryID,
        marketID: defaultData.marketID,
        sourceID: defaultData.sourceID,
        packageID: defaultData.packageID,
        packageTransactionCodeID: defaultData.packageTransactionCodeID,
        beginSellDate: defaultData.beginSellDate,
        endSellDate: defaultData.endSellDate,
        printRate: defaultData.printRate,
        discount: defaultData.discount,
        dayUse: defaultData.dayUse,
        complementary: defaultData.complementary,
        houseUse: defaultData.houseUse,
        daysApplicable: defaultData.daysApplicable,
      });
    }
  }, [defaultData]);


  const [options, setOptions] = useState({
    rateCategories: [],
    marketCodes: [],
    sources: [],
    packages: [],
    transactionCodes: []
  })

  const { control, handleSubmit } = useForm()

  // Effect to set initial select values
  useEffect(() => {
    if (defaultData && options.rateCategories.length > 0) {
      setSelectedOptions({
        rateCategory: options.rateCategories.find(cat => cat.value === defaultData.rateCategoryID) || null,
        marketCode: options.marketCodes.find(market => market.value === defaultData.marketID) || null,
        source: options.sources.find(source => source.value === defaultData.sourceID) || null,
        package: options.packages.find(pkg => pkg.value === defaultData.packageID) || null,
        pkgtransactionCode: options.transactionCodes.find(trans => trans.value === defaultData.packageTransactionCodeID) || null
      })
    }
  }, [defaultData, options])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [rateCategories, marketCodes, sources, packages, transactionCodes] = await Promise.all([
          fetch(`${API_URL}/getRateCodeRateCategory?hotelID=1`).then(r => r.json()),
          fetch(`${API_URL}/getRateCodeMarketID?hotelID=1`).then(r => r.json()),
          fetch(`${API_URL}/getRateCodeSourceID?hotelID=1`).then(r => r.json()),
          fetch(`${API_URL}/getRateCodePackageID?hotelID=1`).then(r => r.json()),
          fetch(`${API_URL}/getRateCodeTransactionID?hotelID=1`).then(r => r.json())
        ])

        setOptions({
          rateCategories: rateCategories.data || [],
          marketCodes: marketCodes.data || [],
          sources: sources.data || [],
          packages: packages.data || [],
          transactionCodes: transactionCodes.data || []
        })
      } catch (error) {
        console.error('Error fetching options:', error)
      }
    }

    fetchOptions()
  }, [])

  const handleInputChange = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDateChange = (field, dates) => {
    const selectedDate = dates[0] || null
    setFormValues(prev => ({
      ...prev,
      [field]: selectedDate
    }))
  }

  const handleSelectChange = (field, selectedOption) => {
    // Update selected options state
    setSelectedOptions(prev => ({
      ...prev,
      [field]: selectedOption
    }))

  

    // Update form values with the ID
    const fieldMap = {
      rateCategory: 'rateCategoryID',
      marketCode: 'marketID',
      source: 'sourceID',
      package: 'packageID',
      pkgtransactionCode: 'packageTransactionCodeID'
    }

    setFormValues(prev => ({
      ...prev,
      [fieldMap[field]]: selectedOption?.value || ''
    }))
  }


    const onSubmit = async () => {
    try {
      const payload = {
        rateCode: formValues.rateCode,
        description: formValues.description,
        beginSellDate: formValues.beginSellDate ? 
          Moment(formValues.beginSellDate).format('YYYY-MM-DD') : null,
        endSellDate: formValues.endSellDate ? 
          Moment(formValues.endSellDate).format('YYYY-MM-DD') : null,
        rateCategoryID: formValues.rateCategoryID,
        marketID: formValues.marketID,
        sourceID: formValues.sourceID,
        packageID: formValues.packageID,
        packageTransactionCodeID: formValues.packageTransactionCodeID,
        printRate: formValues.printRate,
        discount: formValues.discount,
        dayUse: formValues.dayUse,
        complementary: formValues.complementary,
        houseUse: formValues.houseUse,
        daysApplicable: formValues.daysApplicable,
        discountAmount: defaultData?.discountAmount || 0,
        discountPercentage: defaultData?.discountPercentage || 0,
        isActive: 1,
      }

      console.log('Sending payload:', payload)

      const response = await fetch(`${API_URL}/updateRateCode?id=${rateCodeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Failed to update rate code')
      }

      const result = await response.json()
      console.log('Update successful:', result)

      await MySwal.fire({
        title: 'Success',
        text: 'Rate Code Details Updated Successfully!',
        icon: 'success',
        customClass: { confirmButton: 'btn btn-primary' }
      })
      navigate()

      if (onComplete) {
        onComplete(result)
      }

    } catch (error) {
      console.error('Update error:', error)
      MySwal.fire({
        title: 'Error',
        text: error.message || 'Failed to update rate code details',
        icon: 'error',
        customClass: { confirmButton: 'btn btn-danger' }
      })
    }
  }



  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="p-2">
      <Row>
      <Col md='3' sm='12'>
          <div className='mb-1'>
            <Label className='form-label' for='rateCode1'>
              Rate Code <span className="text-danger">*</span>
            </Label>
            <Controller
              name='rateCode1'
              control={control}
              defaultValue={formValues.rateCode}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Rate Code'
                  value={formValues.rateCode}
                  onChange={(e) => {
                    field.onChange(e)
                    handleInputChange('rateCode', e.target.value)
                  }}
                />
              )}
            />
          </div>
        </Col>

        <Col md='3' sm='12'>
          <div className='mb-1'>
            <Label className='form-label' for='description1'>
              Description <span className="text-danger">*</span>
            </Label>
            <Controller
              name='description1'
              control={control}
              defaultValue={formValues.description}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Description'
                  value={formValues.description}
                  onChange={(e) => {
                    field.onChange(e)
                    handleInputChange('description', e.target.value)
                  }}
                />
              )}
            />
          </div>
        </Col>

        <Col md='3' sm='12'>
          <div className='mb-1'>
            <Label className='form-label' for='rateCategory1'>
              Rate Category <span className="text-danger">*</span>
            </Label>
            <Controller
              name='rateCategory1'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={selectedOptions.rateCategory}
                  options={options.rateCategories}
                  isClearable
                  classNamePrefix='select'
                  theme={selectThemeColors}
                  onChange={(val) => {
                    field.onChange(val)
                    handleSelectChange('rateCategory', val)
                  }}
                />
              )}
            />
          </div>
        </Col>

        <Col md='3' sm='12'>
          <div className='mb-1'>
            <Label className='form-label' for='marketCode1'>
              Market Code <span className="text-danger">*</span>
            </Label>
            <Controller
              name='marketCode1'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={selectedOptions.marketCode}
                  options={options.marketCodes}
                  isClearable
                  classNamePrefix='select'
                  theme={selectThemeColors}
                  onChange={(val) => {
                    field.onChange(val)
                    handleSelectChange('marketCode', val)
                  }}
                />
              )}
            />
          </div>
        </Col>

        <Col md='3' sm='12'>
          <div className='mb-1'>
            <Label className='form-label' for='source1'>
              Source
            </Label>
            <Controller
              name='source1'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={selectedOptions.source}
                  options={options.sources}
                  isClearable
                  classNamePrefix='select'
                  theme={selectThemeColors}
                  onChange={(val) => {
                    field.onChange(val)
                    handleSelectChange('source', val)
                  }}
                />
              )}
            />
          </div>
        </Col>

       {/* {defaultData && <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='beginDate1'>
                      Begin Date
                    </Label>
                    <Controller
                      value={defaultData.beginSellDate}
                      control={control}
                      id='beginDate1'
                      name='beginDate1'
                      render={({ field }) => (
                        <Flatpickr
                          {...field}
                          value={defaultData.beginSellDate}
                          options={{ allowInput: true }} placeholder='YYYY-MM-DD'
                          className={classnames('form-control', {
                            //      'is-invalid': data !== null && data.beginDate1 === null
                                })}
                          
                        />
                      )}
                    />
                  </div>
                </Col> }

                {defaultData &&   <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='sellDate1'>
                      Sell Date
                    </Label>
                    <Controller
                    // defaultValue={data1["endSellDate"]}
                      control={control}
                      id='sellDate1'
                      name='sellDate1'
                      render={({ field }) => (
                        <Flatpickr
                          {...field}
                          value={defaultData.endSellDate}
                          options={{ allowInput: true }} placeholder='YYYY-MM-DD'
                          className={classnames('form-control', {
                      //      'is-invalid': data !== null && data.beginDate1 === null
                          })}
                          
                        />
                      )}
                    />
                  </div>
                </Col>} */}

<Col md='3' sm='12'>
          <div className='mb-1'>
            <Label className='form-label' for='beginDate1'>
              Begin Date
            </Label>
            <Controller
              name='beginDate1'
              control={control}
              defaultValue={formValues.beginSellDate ? [formValues.beginSellDate] : []}
              render={({ field }) => (
                <Flatpickr
                  {...field}
                  options={{
                    allowInput: true,
                    dateFormat: 'Y-m-d'
                  }}
                  value={formValues.beginSellDate}
                  className='form-control'
                  onChange={(dates) => {
                    field.onChange(dates)
                    handleDateChange('beginSellDate', dates)
                  }}
                />
              )}
            />
          </div>
        </Col>

        <Col md='3' sm='12'>
          <div className='mb-1'>
            <Label className='form-label' for='sellDate1'>
              Sell Date
            </Label>
            <Controller
              name='sellDate1'
              control={control}
              defaultValue={formValues.endSellDate ? [formValues.endSellDate] : []}
              render={({ field }) => (
                <Flatpickr
                  {...field}
                  options={{
                    allowInput: true,
                    dateFormat: 'Y-m-d'
                  }}
                  value={formValues.endSellDate}
                  className='form-control'
                  onChange={(dates) => {
                    field.onChange(dates)
                    handleDateChange('endSellDate', dates)
                  }}
                />
              )}
            />
          </div>
        </Col>


<Col md='3' sm='12'>
          <div className='mb-1'>
            <Label className='form-label' for='package1'>
              Package <span className="text-danger">*</span>
            </Label>
            <Controller
              name='package1'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                value={selectedOptions.package}
                options={options.packages}
                  isClearable
                  classNamePrefix='select'
                  theme={selectThemeColors}
                  onChange={(val) => {
                    field.onChange(val)
                    handleSelectChange('package', val)
                  }}
                />
              )}
            />
          </div>
        </Col>
                

                
<Col md='3' sm='12'>
          <div className='mb-1'>
            <Label className='form-label' for='pkgtransactionCode1'>
              Package Transaction Code<span className="text-danger">*</span>
            </Label>
            <Controller
              name='pkgtransactionCode1'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={selectedOptions.pkgtransactionCode}
                  options={options.transactionCodes}
                  isClearable
                  classNamePrefix='select'
                  theme={selectThemeColors}
                  onChange={(val) => {
                    field.onChange(val)
                    handleSelectChange('pkgtransactionCode', val)
                  }}
                />
              )}
            />
          </div>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2 mt-2">
        <Button color="primary" type="submit">
          Update
        </Button>
        <Button color="primary" onClick={() => stepper.next()}>
          Next
        </Button>
      </div>
    </Form>
  )
}

export default EditRateCodeDetails