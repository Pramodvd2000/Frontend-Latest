<Col md='6' sm='12' className='select'>
              <p>ALL YEAR all the package</p>
              <p>DX</p>
              <p>5000</p>
              
            </Col> 


// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Button, Label } from 'reactstrap'

import avatar1 from '@src/assets/images/portrait/small/avatar-s-5.jpg'
import avatar2 from '@src/assets/images/portrait/small/avatar-s-6.jpg'
import avatar3 from '@src/assets/images/portrait/small/avatar-s-7.jpg'
import { MoreVertical, Edit, Trash } from 'react-feather'
import { Table, Badge,  DropdownToggle } from 'reactstrap'
// import Search from "./inventory"
const MultipleColumnForm = () => {
    const avatarGroupData1 = [
        {
          title: 'Lilian',
          img: avatar1,
          imgHeight: 26,
          imgWidth: 26
        },
        {
          title: 'Alberto',
          img: avatar2,
          imgHeight: 26,
          imgWidth: 26
        },
        {
          title: 'Bruce',
          img: avatar3,
          imgHeight: 26,
          imgWidth: 26
        }
      ]
      
      const avatarGroupData2 = [
        {
          title: 'Diana',
          img: avatar1,
          imgHeight: 26,
          imgWidth: 26
        },
        {
          title: 'Rey',
          img: avatar2,
          imgHeight: 26,
          imgWidth: 26
        },
        {
          title: 'James',
          img: avatar3,
          imgHeight: 26,
          imgWidth: 26
        }
      ]
      
      const avatarGroupData3 = [
        {
          title: 'Lee',
          img: avatar1,
          imgHeight: 26,
          imgWidth: 26
        },
        {
          title: 'Mario',
          img: avatar2,
          imgHeight: 26,
          imgWidth: 26
        },
        {
          title: 'Oswald',
          img: avatar3,
          imgHeight: 26,
          imgWidth: 26
        }
      ]
      
      const avatarGroupData4 = [
        {
          title: 'Christie',
          img: avatar1,
          imgHeight: 26,
          imgWidth: 26
        },
        {
          title: 'Barnes',
          img: avatar2,
          imgHeight: 26,
          imgWidth: 26
        },
        {
          title: 'Arthur',
          img: avatar3,
          imgHeight: 26,
          imgWidth: 26
        }
      ]

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Available Package</CardTitle>
        <CardTitle tag='h4'>Select Package</CardTitle>
      </CardHeader>
      <div className='form-check form-check-inline'> &nbsp; 
              <Input type='checkbox' id='basic-cb-checked' />
              <Label for='basic-cb-checked' className='form-check-label'>
                Show Selected Only
              </Label>&nbsp;
            </div>
      <CardBody>
        <Form>
            {/* <b><hr width="70%"></hr></b> */}
          <Row>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='nameMulti'>
                Package Search
              </Label>
              <Input  type='text' name='Package' id='nameMulti' placeholder='Select Package' /> 
            </Col>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
             <Table responsive>
      <thead>
        <tr>
          <th>Code</th>
          <th>Description</th>
          <th>Calculation Rule</th>
          <th>Rhythm</th>
          <th>Price</th>
          <th>In Rate</th>
          <th>Item</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            
            <span className='align-middle fw-bold'>ALLYEAR</span>
          </td>
          <td>All Year Package</td>
          <td> Per Adult </td>
          <td>Post Every Night</td>
          <td>5000</td>
          <td>
          <div className='form-check form-check-inline'> &nbsp; 
              <Input type='checkbox' id='basic-cb-checked' />
              <Label for='basic-cb-checked' className='form-check-label'>
                
              </Label>
            </div>
          </td>
          <td>
          <div className='form-check form-check-inline'> &nbsp; 
              <Input type='checkbox' id='basic-cb-checked' />
              <Label for='basic-cb-checked' className='form-check-label'>
                
              </Label>
            </div>
          </td>
          <td>
            <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
              Add
            </Button>
          </td>         
        </tr>
     </tbody>
    </Table>
    <br></br>
            <Col sm='12'>
              <div className='button'>
                <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
                  Registration Card
                </Button>
                <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
                Advanced CheckIn
                </Button>                
                <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
                  Next
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}
export default MultipleColumnForm
