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
import Moment from 'moment'

import classnames from "classnames"
import Cleave from "cleave.js/react"
import { Check } from "react-feather"
import "cleave.js/dist/addons/cleave-phone.us"
import { useForm, Controller } from "react-hook-form"
import Flatpickr from 'react-flatpickr'

import '@styles/react/libs/flatpickr/flatpickr.scss'
// ** Custom Components
import Avatar from "@components/avatar"
import Houskeeping_URL from '../../../../housekeeping_config'
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


const colourOptions = [
  { value: 'Room Cleaning', label: 'Room Cleaning' },
  { value: 'Bathroom Cleaning', label: 'Bathroom Cleaning' },
  { value: 'Electric Amenities', label: 'Electric Amenities' }
]


const colourOptions2 = [
  { value: '1', label: 'Routine' },
  { value: '2', label: 'Priority' },
  { value: '3', label: 'Occupied' }
]


const colourOptions3 = [
  { value: 'true', label: '1' },
  { value: 'false', label: '0' }
]


let floorList = [
  fetch(Houskeeping_URL + '/getFloorList?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      floorList = resp['data']
      return floorList
    })
]


let Roomarr = []


function getCurrentDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed, so add 1 and pad with a leading zero if necessary
  const day = String(date.getDate()).padStart(2, '0') // Pad with a leading zero if necessary
  return `${year}-${month}-${day}`
}


const defaultValues = {
  taskType: null,
  floorNumber: null,
  roomNumber: null,
  startDate: "",
  dueDate: "",
  taskPriorityID: null,
  isHighPriority: null,
  description: "",
  createdTime: getCurrentDate(),
  createdBy: null
}


let managerNames = [
  fetch(Houskeeping_URL + '/getManagerListForUI?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      managerNames = resp['data']
      return managerNames
    })
]


const Modalform = () => {

  const navigate = useNavigate()
  const [show, actionButton] = useState(false)
  const [SelectedValue, setSelectedValue] = useState(null)
  const [RoomData, setRoomData] = useState("")
  const [data, setData] = useState(null)
  const { reset, handleSubmit, control } = useForm({ defaultValues })


  useEffect(() => {
    fetch(Houskeeping_URL + '/getroomNumber')
      .then(result => result.json())
      .then(resp => {
        setRoomData(resp['data'])
      })
  }, [])


  const handleSelectChange = (event) => {
    Roomarr = []
    if (event) {
      setSelectedValue(event.value)
      for (let i = 0; i < 1; i++) {
        for (let j = 0; j < JSON.parse(RoomData[event.value]).length; j++) {
          const RoomNumber = { value: JSON.parse(RoomData[event.value])[j], label: JSON.parse(RoomData[event.value])[j] }
          Roomarr.push(RoomNumber)
        }
      }
    }
  }


  //on submit function 
  const onSubmit = (data) => {
    setData(data)
    const createasset = JSON.stringify({
      taskType: data.taskType.label,
      floorNumber: SelectedValue,
      roomNumber: data.roomNumber.value,
      startDate: data.startDate,
      dueDate: data.dueDate,
      taskPriorityID: data.taskPriorityID.value,
      isHighPriority: data.isHighPriority.value,
      description: data.description,
      createdTime: data.createdTime,
      createdBy: data.createdBy.label
    })

    console.log(createasset)
    fetch(Houskeeping_URL + "/createTasksForUI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: createasset
    }).then((res) => {
      if (res.status == 200) {
        handleSuccess()
      }
    })
  }


  // reset button function
  const handleReset = () => {
    reset({
      taskType: null,
      floorNumber: null,
      roomNumber: null,
      startDate: "",
      dueDate: "",
      taskPriorityID: null,
      isHighPriority: null,
      description: "",
      createdTime: "",
      createdBy: null
    })
  }


  //Success card
  const handleSuccess = () => {
    return MySwal.fire({
      title: 'Create Task !!',
      text: 'Successfully Created New Task',
      icon: 'success',
    },
      actionButton(false),
      setTimeout(() => { navigate('/reports/taskreport') }, 2000)
    )
  }


  // On submit modal open
  function Alert() {
    actionButton(true)
  }


  //Modal Close function
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
            You are about to create new task. <br></br>
            <br></br>
            <Button color='primary' className='me-1' style={{ float: 'right' }} onClick={handleSubmit(onSubmit)}>
              Create Task
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
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='taskType'>
                  Task Type
                </Label>
                <Controller
                  id='taskType'
                  control={control}
                  name='taskType'
                  render={({ field }) => (
                    <Select
                      isClearable
                      options={colourOptions}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.taskType === null })}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='floorNumber'>
                  Floor Number
                </Label>
                <Controller
                  id='floorNumber'
                  control={control}
                  name='floorNumber'
                  render={({ }) => (
                    <Select
                      isClearable
                      onChange={handleSelectChange}
                      options={floorList}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.floorNumber === null })}
                    />
                  )}
                />
              </div>
            </Col>
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='roomNumber'>
                  Room  Number
                </Label>
                <Controller
                  id='roomNumber'
                  control={control}
                  name='roomNumber'
                  render={({ field }) => (
                    <Select
                      isClearable
                      options={Roomarr}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.roomNumber === null })}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='isHighPriority'>
                  High Priority
                </Label>
                <Controller
                  id='isHighPriority'
                  control={control}
                  name='isHighPriority'
                  render={({ field }) => (
                    <Select
                      isClearable
                      options={colourOptions3}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.isHighPriority === null })}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='taskPriorityID'>
                  Task Priority
                </Label>
                <Controller
                  id='taskPriorityID'
                  control={control}
                  name='taskPriorityID'
                  render={({ field }) => (
                    <Select
                      isClearable
                      options={colourOptions2}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.taskPriorityID === null })}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>
            <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='createdTime'>
                  created Time
                </Label>
                <InputGroup className='input-group-merge'>
                  <InputGroupText
                    className={classnames({
                      'is-invalid': data !== null && (data.createdTime === null || !data.createdTime.length)
                    })}
                  >
                  </InputGroupText>
                  <Controller
                    id='createdTime'
                    name='createdTime'
                    control={control}
                    render={({ field }) => (
                      <Cleave
                        disabled
                        placeholder='createdTime'
                        {...field}
                        className={classnames('form-control', {
                          'is-invalid': data !== null && (data.createdTime === null || !data.createdTime.length)
                        })}
                      />
                    )}
                  />
                </InputGroup>
              </div>
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='description'>
                  Description
                </Label>
                <InputGroup className='input-group-merge'>
                  <InputGroupText
                    className={classnames({
                      'is-invalid': data !== null && (data.description === null || !data.description.length)
                    })}
                  >
                  </InputGroupText>
                  <Controller
                    id='description'
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <Cleave
                        placeholder='description'
                        {...field}
                        className={classnames('form-control', {
                          'is-invalid': data !== null && (data.description === null || !data.description.length)
                        })}
                      />
                    )}
                  />
                </InputGroup>
              </div>
            </Col>

            <Col md='6' sm='12'>
              <div className='mb-1'>
                <Label className='form-label' for='startDate'>
                  Start Date
                </Label>
                <Controller
                  control={control}
                  id='startDate'
                  name='startDate'
                  render={({ field }) => (
                    <Flatpickr
                      {...field}
                      options={{ allowInput: true }} placeholder='YYYY-MM-DD '
                      className={classnames('form-control', {
                        'is-invalid': data !== null && data.startDate === null
                      })}
                    />
                  )}
                />
              </div>
            </Col>

            <Col md='6' sm='12'>
              <div className='mb-1'>
                <Label className='form-label' for='dueDate'>
                  Due Date
                </Label>
                <Controller
                  control={control}
                  id='dueDate'
                  name='dueDate'
                  render={({ field }) => (
                    <Flatpickr
                      {...field}
                      options={{ allowInput: true }} placeholder='YYYY-MM-DD '
                      className={classnames('form-control', {
                        'is-invalid': data !== null && data.dueDate === null
                      })}
                    />
                  )}
                />
              </div>
            </Col>

            <Col md='6' sm='12'>
              <div className='mb-1'>
                <Label className='form-label' for='createdBy'>
                  Created By
                </Label>
                <Controller
                  id='createdBy'
                  control={control}
                  name='createdBy'
                  render={({ field }) => (
                    <Select
                      isClearable
                      options={managerNames}
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
              <Button className="me-1" color="primary" type="submit" onClick={alert}>
                Submit
              </Button>
              <Button
                outline
                color="secondary"
                type="reset"
                onClick={handleReset}
              >
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