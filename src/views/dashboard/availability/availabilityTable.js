// ** Custom Components
import AvatarGroup from '@components/avatar-group'
import { Fragment, useState, useEffect } from 'react'
import { format } from "date-fns";

// ** Images
import react from '@src/assets/images/icons/react.svg'
import vuejs from '@src/assets/images/icons/vuejs.svg'
import angular from '@src/assets/images/icons/angular.svg'
import bootstrap from '@src/assets/images/icons/bootstrap.svg'
import avatar1 from '@src/assets/images/portrait/small/avatar-s-5.jpg'
import avatar2 from '@src/assets/images/portrait/small/avatar-s-6.jpg'
import avatar3 from '@src/assets/images/portrait/small/avatar-s-7.jpg'

// ** Icons Imports
import { MoreVertical, Edit, Trash, Circle } from 'react-feather'

// ** Reactstrap Imports
import { Table, Badge, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'


var blk1 = format(new Date(), 'MM/dd/yy')
let yesterday = new Date(blk1)
yesterday.setDate(yesterday.getDate() + 1)
var blk2 = format(new Date(yesterday), 'MM/dd/yy')
yesterday = new Date(blk2)
yesterday.setDate(yesterday.getDate() + 1)
var blk3 = format(new Date(yesterday), 'MM/dd/yy')
yesterday = new Date(blk3)
yesterday.setDate(yesterday.getDate() + 1)
var blk4 = format(new Date(yesterday), 'MM/dd/yy')
yesterday = new Date(blk4)
yesterday.setDate(yesterday.getDate() + 1)
var blk5 = format(new Date(yesterday), 'MM/dd/yy')

  console.log(blk5)
  console.log(blk4)
  console.log(blk3)
  console.log(blk2)
  console.log(blk1)


const avatarGroupData1 = [
  {
    title: 'Griffith',
    img: avatar1,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Hu',
    img: avatar2,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Felicia',
    img: avatar3,
    imgHeight: 26,
    imgWidth: 26
  }
]

const avatarGroupData2 = [
  {
    title: 'Quinlan',
    img: avatar1,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Patrick',
    img: avatar2,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Castor',
    img: avatar3,
    imgHeight: 26,
    imgWidth: 26
  }
]

const avatarGroupData3 = [
  {
    title: 'Mohammad',
    img: avatar1,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Isabella',
    img: avatar2,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Michael',
    img: avatar3,
    imgHeight: 26,
    imgWidth: 26
  }
]

const avatarGroupData4 = [
  {
    title: 'Lavinia',
    img: avatar1,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Nelle',
    img: avatar2,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Virginia',
    img: avatar3,
    imgHeight: 26,
    imgWidth: 26
  }
]

const AvailabilityTable = () => {

         // ** State
  const [active, setActive] = useState('1')

    const [selectedOption, setSelectedOption] = useState("");

  function handleOptionChange(event) {
    setSelectedOption(event.target.value);
  }
  return (
    <Table hover responsive>
      <thead>
        <tr>
          <th>All Room Types</th>
          <th>Mon 21</th>
          <th>Tue 22</th>
          <th>Wed 23</th>
          <th>Thu 24</th>
          <th>Fri 25</th>
          <th>Sat 26</th>
          <th>Sun 27</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {/* <img className='me-75' src={angular} alt='angular' height='20' width='20' /> */}
            <span className='align-middle fw-bold'>Angular Project</span>
          </td>
          
          <td>Deluxe Rooms</td>
          <td>
            <AvatarGroup data={avatarGroupData1} />
          </td>
          {/* <td>
            <Badge pill color='light-primary' className='me-1'>
              Active
            </Badge>
          </td> */}
          {/* <td>
            <UncontrolledDropdown>
              <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href='/' onClick={e => e.preventDefault()}>
                  <Edit className='me-50' size={15} /> <span className='align-middle'>Edit</span>
                </DropdownItem>
                <DropdownItem href='/' onClick={e => e.preventDefault()}>
                  <Trash className='me-50' size={15} /> <span className='align-middle'>Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td> */}
          {selectedOption === "option1" && (
             <td>Ronald Frest</td>
             

        )}

        </tr>
        <tr>
          <td>
            {/* <img className='me-75' src={react} alt='react' height='20' width='20' /> */}
            <span className='align-middle fw-bold'>React Project</span>
          </td>
          <td>Ronald Frest</td>
          <td>
            <AvatarGroup data={avatarGroupData2} />
          </td>
          <td>
            <Badge pill color='light-success' className='me-1'>
              Completed
            </Badge>
          </td>
          <td>
            <UncontrolledDropdown>
              <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href='/' onClick={e => e.preventDefault()}>
                  <Edit className='me-50' size={15} /> <span className='align-middle'>Edit</span>
                </DropdownItem>
                <DropdownItem href='/' onClick={e => e.preventDefault()}>
                  <Trash className='me-50' size={15} /> <span className='align-middle'>Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
        <tr>
          <td>
            {/* <img className='me-75' src={vuejs} alt='vuejs' height='20' width='20' /> */}
            <span className='align-middle fw-bold'>Vuejs Project</span>
          </td>
          <td>Jack Obes</td>
          <td>
            <AvatarGroup data={avatarGroupData3} />
          </td>
          <td>
            <Badge pill color='light-info' className='me-1'>
              Scheduled
            </Badge>
          </td>
          <td>
            <UncontrolledDropdown>
              <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href='/' onClick={e => e.preventDefault()}>
                  <Edit className='me-50' size={15} /> <span className='align-middle'>Edit</span>
                </DropdownItem>
                <DropdownItem href='/' onClick={e => e.preventDefault()}>
                  <Trash className='me-50' size={15} /> <span className='align-middle'>Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
        <tr>
          <td>
            {/* <img className='me-75' src={bootstrap} alt='bootstrap' height='20' width='20' /> */}
            <span className='align-middle fw-bold'>Bootstrap Project</span>
          </td>
          <td>Jerry Milton</td>
          <td>
            <AvatarGroup data={avatarGroupData4} />
          </td>
          <td>
            <Badge pill color='light-warning' className='me-1'>
              Pending
            </Badge>
          </td>
          <td>
            <UncontrolledDropdown>
              <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href='/' onClick={e => e.preventDefault()}>
                  <Edit className='me-50' size={15} /> <span className='align-middle'>Edit</span>
                </DropdownItem>
                <DropdownItem href='/' onClick={e => e.preventDefault()}>
                  <Trash className='me-50' size={15} /> <span className='align-middle'>Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
      </tbody>
    </Table>
  )
}

export default AvailabilityTable
