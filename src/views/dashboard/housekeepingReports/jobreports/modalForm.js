import {
  Row, Col, Form, Button, Label, InputGroup,
  InputGroupText, Input, Modal, ModalBody, ModalHeader
} from 'reactstrap'
// ** React Imports
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useNavigate } from "react-router-dom"

import classnames from "classnames"
import Cleave from "cleave.js/react"
import { Check } from "react-feather"
import "cleave.js/dist/addons/cleave-phone.us"
import { useForm, Controller } from "react-hook-form"

import Moment from 'moment'
import Flatpickr from 'react-flatpickr'

// ** Custom Components
import Avatar from "@components/avatar"
import Houskeeping_URL from '../../../../housekeeping_config'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const jobTypeOptions = [
  { value: 'Guest Request', label: 'Guest Request' }
]

const highPriorityOptions = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' }
]
function getCurrentDate() {
  const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatter = new Intl.DateTimeFormat('en-CA', options); // en-CA gives YYYY-MM-DD format
  return formatter.format(new Date());
}

const defaultValues = {
  jobType: null,
  jobDepartment: null,
  jobName: null,
  floorNumber: null,
  roomNumber: null,
  isHighPriority: null,
 // createdTime: getCurrentDate(),
  description: '',
  createdBy: null
}

const Modalform = () => {
  let navigate = useNavigate()
  const [show, actionButton] = useState(false)
  const [data, setData] = useState(null)
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [jobDepartmentOptions, setJobDepartmentOptions] = useState([])
  console.log("jobDepartmentOptions", jobDepartmentOptions)
  const [jobNameOptions, setJobNameOptions] = useState([])
  const [floorOptions, setFloorOptions] = useState([])
  const [roomOptions, setRoomOptions] = useState([])
  const [managerList, setManagerList] = useState([])

  const { reset, handleSubmit, control , setValue} = useForm({ defaultValues })

  const fetchsetManagerList = async () => {
    try {
      const response = await fetch(`${Houskeeping_URL}/getManagerListForUI?hotelID=1`)
      const result = await response.json()
      if (result.status === 'success') {
        console.log("result.data", result.data)

        const formattedManagerList = result.data.map(department => ({
          value: department.label, 
          label: department.label 
        }));
        setManagerList(formattedManagerList)
      }
    } catch (error) {
      console.error("Error fetching manager list:", error)
    }
  }



    // Fetch job departments - removed jobTypeID parameter
    const fetchJobDepartments = async () => {
      try {
        const response = await fetch(`${Houskeeping_URL}/getDepartmentOptions`)
        const result = await response.json()
        if (result.status === 'success') {
          //console.log("Job departments:", result.data)
          const formattedDepartments = result.data.map(department => ({
            value: department.departmentName, 
            label: department.departmentName 
          }));
    
          setJobDepartmentOptions(formattedDepartments)
        }
      } catch (error) {
        console.error("Error fetching job departments:", error)
      }
    }
  const fetchJobNames = async (departmentLabel) => {
    try {
      console.log(departmentLabel)
      const response = await fetch(`${Houskeeping_URL}/getGuestRequestList?departmentID=${encodeURIComponent(departmentLabel)}`)
      const result = await response.json()
      if (result.status === 'success') {
        console.log("result.data", result.data)

        const jobNames = result.data.map(room => ({
          value: room.request, 
          label: room.request 
        }));
        setJobNameOptions(jobNames)
      }
    } catch (error) {
      console.error("Error fetching job names:", error)
    }
  }

  // Fetch floor list
  const fetchFloors = async () => {
    try {
      const response = await fetch(`${Houskeeping_URL}/getFloorListForAttendant`)
      const result = await response.json()
      if (result.status === 'success') {

        console.log("result.data", result.data)
        const floorNum = result.data.map(room => ({
          value: room.value, 
          label: room.actualFloorNumber 
        }));


        setFloorOptions(floorNum)
      }
    } catch (error) {
      console.error("Error fetching floors:", error)
    }
  }

  const fetchRooms = async (floorNumber) => {
    try {
      const response = await fetch(`${Houskeeping_URL}/getRooms?floorNumber=${floorNumber}`);
      const result = await response.json();
  
      if (result.status === 'success') {
        // Ensure correct mapping from roomNumber
        const formattedRooms = result.data.map(room => ({
          value: room.roomNumber, 
          label: room.roomNumber 
        }));
  
        setRoomOptions(formattedRooms);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };
  
  // Load initial data when component mounts
  useEffect(() => {
    fetchFloors()
    fetchJobDepartments() // Fetch departments on load, not dependent on job type
    fetchsetManagerList()
  }, [])

 

  const handleDepartmentChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedDepartment(selectedOption.value);
      setJobNameOptions([]); // Reset job name options on department change
      setValue('jobName', null); 
      fetchJobNames(selectedOption.label);
    }
  };
  

  const handleFloorChange = (selectedOption) => {
    if (selectedOption) {
      console.log(selectedOption)
      setSelectedFloor(selectedOption.label)
      setRoomOptions([])
      setValue('roomNumber', null)
      fetchRooms(selectedOption.value)
    }
  }

  const onSubmit = (data) => {
    setData(data)
    actionButton(false)
    console.log(data.jobDepartment.value)
    const createJobPayload = JSON.stringify({
      taskID: "0", 
      jobType: jobTypeOptions[0].value,
       jobDepartment: String(data.jobDepartment.value),
      //jobDepartment: String("F&B Service"),
      jobName: data.jobName.value,
      floorNumber: selectedFloor,
      roomNumber: data.roomNumber.value,
      isHighPriority: data.isHighPriority.value,
      //createdTime: data.createdTime,
      createdTime:getCurrentDate(),
      createdBy: data.createdBy.value,
      description: data.description,
     // jobOrderStatus:"0"
    })

    console.log("createJobPayload", createJobPayload)

    fetch(Houskeeping_URL + "/createjob", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: createJobPayload
    }).then((res) => {
      if (res.status === 200) {
        handleSuccess("Successfully Created New Job")
      }
    }).catch(error => {
      //console.error("Error creating job:", error)
      handleError("Failed to create job")
      //toast.error("Failed to create job")
    })
  }

  const handleReset = () => {
    reset({
      jobType: null,
      jobDepartment: null,
      jobName: null,
      floorNumber: null,
      roomNumber: null,
      isHighPriority: null,
      //createdTime: getCurrentDate(),
      description: '',
      createdBy: null
    })
    setSelectedFloor(null)
    setSelectedDepartment(null)
    setRoomOptions([])
    setJobNameOptions([])
  }



    // Success card
    const handleSuccess = async (message) => {
      await MySwal.fire({
          title: 'Create Job !!',
          text: message,
          icon: 'success',
      });
      actionButton(false),
      setTimeout(() => { navigate('/dashboard/housekeepingreports/jobsReport') }, 200);
  }


      // error handling function
      const handleError = (message) => {
        return MySwal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            html: message.replace(/\n/g, '<br />'),
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            allowOutsideClick: false,
            confirmButtonText: 'Close',
            confirmButtonColor: 'danger',
            buttonsStyling: false
        })
    }
  // On submit modal open
  function Alert() {
    actionButton(true)
  }

  // Modal Close function
  const modalClose = () => {
    actionButton(false)
  }

  return (
    <div>
      {
        show &&
        <Modal isOpen={show} backdrop="static" toggle={() => actionButton(!show)} className='modal-dialog-centered {modal-sm}'>
          <ModalHeader className='modal-lg' toggle={() => actionButton(!show)} >
            Confirmation Page,
          </ModalHeader>
          <ModalBody>
            You are about to create new job. <br></br>
            <br></br>
            <Button color='primary' className='me-1' style={{ float: 'right' }} onClick={handleSubmit(onSubmit)}>
              Create Job
            </Button>
            <Button color='secondary' className='me-1' style={{ float: 'right' }} onClick={modalClose}>
              Cancel
            </Button>
          </ModalBody>
        </Modal>
      }

      <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            {/* Job type selection */}
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='jobType'>
                  Job Type <span style={{ color: 'red' }}>*</span>
                </Label>
                <Controller
                  id='jobType'
                  control={control}
                 
                 
                  name='jobType'
                  render={({ field }) => (
                    <Select
                      //required
                      isDisabled
                      defaultValue={jobTypeOptions[0]}
                      options={jobTypeOptions}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                     // className={classnames('react-select', { 'is-invalid': data !== null && data.jobType === null })}
                      // onChange={(option) => {
                      //   field.onChange(option)
                      //   handleJobTypeChange(option)
                      // }}
                     // value={field.value}
                    />
                  )}
                />
              </div>
            </Col>

            {/* Job department selection */}
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='jobDepartment'>
                  Job Department <span style={{ color: 'red' }}>*</span>
                </Label>
                <Controller
                  id='jobDepartment'
                  control={control}
                  name='jobDepartment'
                  render={({ field }) => (
                    <Select
                      isClearable
                      required
                      options={jobDepartmentOptions}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.jobDepartment === null })}
                      onChange={(option) => {
                        field.onChange(option)
                        handleDepartmentChange(option)
                      }}
                      value={field.value}
                    />
                  )}
                />
              </div>
            </Col>

            {/* Job Name select */}
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='jobName'>
                  Job Name <span style={{ color: 'red' }}>*</span>
                </Label>
                <Controller
                  id='jobName'
                  control={control}
                  name='jobName'
                  render={({ field }) => (
                    <Select
                      isClearable
                      required
                      options={jobNameOptions}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.jobName === null })}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>

            {/* Floor number select */}
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='floorNumber'>
                  Floor Number <span style={{ color: 'red' }}>*</span>
                </Label>
                <Controller
                  id='floorNumber'
                  control={control}
                  name='floorNumber'
                  render={({ field }) => (
                    <Select
                      isClearable
                      required
                      options={floorOptions}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.floorNumber === null })}
                      onChange={(option) => {
                        field.onChange(option)
                        handleFloorChange(option)
                      }}
                      value={field.value}
                    />
                  )}
                />
              </div>
            </Col>

            {/* Room number select */}
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='roomNumber'>
                  Room Number <span style={{ color: 'red' }}>*</span>
                </Label>
                <Controller
                  id='roomNumber'
                  control={control}
                  name='roomNumber'
                  render={({ field }) => (
                    <Select
                      isClearable
                      required
                      options={roomOptions}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.roomNumber === null })}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>

            {/* Is high priority field */}
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='isHighPriority'>
                High priority
                </Label>
                <Controller
                  id='isHighPriority'
                  control={control}
                  name='isHighPriority'
                  render={({ field }) => (
                    <Select
                      isClearable
                      options={highPriorityOptions}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.isHighPriority === null })}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>

            {/* Created Time flatpickr 
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='createdTime'>
                  Created Time
                </Label>
                <Controller
                  id='createdTime'
                  name='createdTime'
                  control={control}
                  render={({ field }) => (
                    <Flatpickr
                      className='form-control'
                      value={field.value}
                      onChange={date => field.onChange(Moment(date[0]).format('YYYY-MM-DD'))}
                      options={{
                        dateFormat: 'Y-m-d'
                      }}
                    />
                  )}
                />
              </div>
            </Col>
            */}

            {/* Remarks field (previously Description) */}
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='description'>
                  Remarks
                </Label>
                <InputGroup className='input-group-merge'>
                  <Controller
                    id='description'
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder='Enter job remarks'
                        {...field}
                        className={classnames('form-control')}
                      />
                    )}
                  />
                </InputGroup>
              </div>
            </Col>

            {/* Created by field */}
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='createdBy'>
                  Created By <span style={{ color: 'red' }}>*</span>
                </Label>
                <Controller
                  id='createdBy'
                  control={control}
                  name='createdBy'
                  render={({ field }) => (
                    <Select
                      required
                      isClearable
                      options={managerList}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.createdBy === null })}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>

            <div className="d-flex">
              {/* On submit button */}
              <Button className="me-1" color="primary" onClick={Alert}>
                Submit
              </Button>

              {/* Reset button */}
              <Button outline color="secondary" type="reset" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </Row>
        </Form>
      </div>
    </div>
  )
}

export default Modalform