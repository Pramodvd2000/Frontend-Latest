import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '@components/avatar'
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { FaWhatsapp } from 'react-icons/fa'
import { Button, Badge, Input, DropdownMenu, DropdownItem, DropdownToggle, Dropdown } from 'reactstrap'
import toast from 'react-hot-toast'
import { X } from 'react-feather'
import API_URL from '../../../../config'
import { WEBSOCKET_PORT } from '../../../../config'
import moment from 'moment'

const NotificationDropdown = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hotelID, setHotelID] = useState(null) // Add state for hotelID

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState)

  const handleNavigateToRequests = () => {
    setDropdownOpen(false) // Close dropdown
    navigate('/apps/WhatsappRequests')
  }

  const showNotificationToast = (departmentName) => {
    const avatarContent = departmentName ? departmentName.substring(0, 2).toUpperCase() : 'NA'
    
    toast(
      t => (
        <div 
          className='w-100 d-flex align-items-center justify-content-between'
          onClick={() => {
            //handleNavigateToRequests()
            toast.dismiss(t.id)
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className='d-flex align-items-center'>
            <Avatar 
              content={avatarContent}
              color="light-primary"
              className='me-1'
            />
            <div>
              <p className='mb-0'><strong>New Service Request</strong></p>
              <small>Request for {departmentName}</small>
            </div>
          </div>
          <X 
            size='14' 
            onClick={(e) => {
              e.stopPropagation()
              toast.dismiss(t.id)
            }} 
          />
        </div>
      ),
     
      {
        duration: 600000,
        style: {
          minWidth: '300px',
          marginTop: '25px'
        },
        position: 'top-right',
      }
    )
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch(API_URL + '/getWhatsappServiceRequests')
      const data = await response.json()

      if (data.status === 'Success') {
        const filteredNotifications = data.data
          .filter((item) => item.status === 'Open')
          .map((item) => {
            // Convert UTC to IST using .utcOffset("+05:30")
            const istDate =  moment(item.createdAt).add(5, 'hours').add(30, 'minutes').format('YYYY-MM-DD hh:mm:ss A');

            return {
              avatarContent: item.departmentName
                ? item.departmentName.substring(0, 2).toUpperCase()
                : istDate.substring(0, 2).toUpperCase(),
              color: 'light-primary',
              subtitle: `Request for ${item.departmentName} from Room number : ${item.roomNumber} requested at ${istDate}`,
              title: (
                <p className='media-heading'>
                  <span className='fw-bolder'>Request for {item.departmentName}</span>
                </p>
              ),
            }
          });

        setNotifications(filteredNotifications)
        setUnreadCount(filteredNotifications.length)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const fetchBusinessDate = async () => {
    try {
      const response = await fetch(API_URL + '/getBusinessDate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const postres = await response.json()
      setHotelID(postres.data[0].id)
    } catch (error) {
      console.error('Error fetching business date:', error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    fetchBusinessDate() // Fetch business date to get hotelID

    const ws = new WebSocket(WEBSOCKET_PORT)
    ws.onopen = () => {
      console.log(`WebSocket is running on port ${WEBSOCKET_PORT}`)
    }
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data)

      if (notification.type === 'newRequest') {
        // Only show toast if hotelID matches
        if (notification.hotelID === hotelID) {
          showNotificationToast(notification.department)
        }
        fetchNotifications()
      } else if (notification.type === 'statusUpdate') {
        fetchNotifications()
      }
    }

    return () => {
      ws.close()
    }
  }, [hotelID]) // Add hotelID as a dependency

  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar component='li' className='media-list scrollable-container' options={{ wheelPropagation: false }}>
        {notifications.map((item, index) => {
          return (
            <a 
              key={index} 
              className='d-flex' 
              href='#'
              onClick={(e) => {
                e.preventDefault()
                handleNavigateToRequests()
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className='list-item d-flex align-items-start'>
                <div className='me-1'>
                  <Avatar
                    {...(item.avatarContent
                      ? {
                          content: item.avatarContent,
                          color: item.color,
                        }
                      : null)}
                  />
                </div>
                <div className='list-item-body flex-grow-1'>
                  {item.title}
                  <small className='notification-text'>{item.subtitle}</small>
                </div>
              </div>
            </a>
          )
        })}
      </PerfectScrollbar>
    )
  }

  return (
    <Dropdown 
      isOpen={dropdownOpen} 
      toggle={toggleDropdown} 
      tag='li' 
      className='dropdown-notification nav-item me-25'
    >
      <DropdownToggle tag='a' className='nav-link' href='#' onClick={e => e.preventDefault()}>
        <FaWhatsapp size={24} color='green' />
        <Badge pill color='danger' className='badge-up'>
          {unreadCount}
        </Badge>
      </DropdownToggle>

      <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 me-auto'>Whatsapp service notifications</h4>
            <Badge tag='div' color='light-primary' pill>
              {unreadCount} New
            </Badge>
          </DropdownItem>
        </li>
        {renderNotificationItems()}
      
      </DropdownMenu>
    </Dropdown>
  )
}

export default NotificationDropdown
