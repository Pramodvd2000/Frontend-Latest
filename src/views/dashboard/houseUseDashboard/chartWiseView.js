// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Components
import axios from 'axios'
import Chart from 'react-apexcharts'
import { HelpCircle } from 'react-feather'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col } from 'reactstrap'

const GoalOverview = props => {
  console.log(props)
  let room=props.room[0]


  // ** State
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('/card/card-analytics/goal-overview').then(res => setData(res.data))
    return () => setData(null)
  }, [])

  const options = {
      chart: {
        sparkline: {
          enabled: true
        },
        dropShadow: {
          enabled: true,
          blur: 3,
          left: 1,
          top: 1,
          opacity: 0.1
        }
      },
      colors: ['#51e5a8'],
      plotOptions: {
        radialBar: {
          offsetY: 10,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: '70%'
          },
          track: {
            background: '#ebe9f1',
            strokeWidth: '50%'
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              color: '#5e5873',
              fontFamily: 'Montserrat',
              fontSize: '2rem',
              fontWeight: '600'
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [props.success],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: 'round'
      },
      grid: {
        padding: {
          bottom: 30
        }
      }
    },
    series = [room.occupiedRoomsPercentage.toFixed(2)]

    return data !== null ? (
      <Card className='h-40'> {/* Adjust the height value, e.g., 'h-40' */}
        <CardHeader style={{ background: '#7367f0', color: '#20B2E3', padding: '10px'  }}>
          <CardTitle className='mb-0' style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#FFF' }}>
            Occupancy
          </CardTitle>
        </CardHeader>
        <CardBody className='p-0' style={{ height: '78px' }}> {/* Adjust the height value */}
          <Chart options={options} series={series} type='radialBar' height={180} />
        </CardBody>
        <Row className=' text-center mx-0'>
          <Col xs='6' className=' py-1'>
            <CardText className='smaller-text'><strong>Total Rooms</strong></CardText>
            <h3 className='fw-bolder mb-0 smaller-text'>{room.totalRooms}</h3>
          </Col>
          <Col xs='6' className='py-1'>
            <CardText className='smaller-text'><strong>Occupied</strong></CardText>
            <h3 className='fw-bolder mb-0 smaller-text'>{room.occupiedRooms}</h3>
          </Col>
        </Row>
      </Card>
    ) : null;
  

}
export default GoalOverview
