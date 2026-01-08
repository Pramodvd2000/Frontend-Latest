import { Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Button, Label, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Collapse, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { Fragment, useState, useEffect } from 'react'

const ChangeRoomFloor = () =>{
    const [basicModal, setBasicModal] = useState(false)
    const [centeredModal, setCenteredModal] = useState(false)
     // ** State
  const [active, setActive] = useState('1')

 
  // ** States
  const [reload, setReload] = useState(false)
  const [collapse, setCollapse] = useState(true)
  const [visibility, setVisibility] = useState(true)
  const [selectedValue, setSelectedValue] = useState("");




  
  function handleDropdownChange(event) {
    setSelectedValue(event.target.value);
  }

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const [selectedOption, setSelectedOption] = useState("");

  function handleOptionChange(event) {
    setSelectedOption(event.target.value);
  }
  return(
    <div>
    <Fragment>
    <Nav tabs className='tab'>
      <NavItem>
        <NavLink
          active={active === '1'}
          onClick={() => {
            toggle('1')
          }}
        >
          Floor-1
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink
          active={active === '2'}
          onClick={() => {
            toggle('2')
          }}
        >
          Floor-2
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink
          active={active === '3'}
          onClick={() => {
            toggle('3')
          }}
        >
          Floor-3
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink
          active={active === '4'}
          onClick={() => {
            toggle('4')
          }}
        >
          Floor-4
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink
          active={active === '5'}
          onClick={() => {
            toggle('5')
          }}
        >
          Floor-5
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink
          active={active === '6'}
          onClick={() => {
            toggle('6')
          }}
        >
          Floor-6
        </NavLink>
      </NavItem>

    </Nav>
    <TabContent className='py-50' activeTab={active}>
      
      <TabPane tabId='1'>
        <div>
          <select value={selectedOption} onChange={handleOptionChange}>
          <option value="">Select an option</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
          </select>
          </div>
      <Col md='6' sm='12' className='mb-1'>
  <Label className='form-label' for='EmailMulti'>
   Choose Entire Room Status
</Label>
<Input type='select' id='Resevation Status Type'>
<option>---Select Room Status---</option>
    <option>Inspected</option>
    <option>Dirty</option>
    <option>Clean</option>
  </Input>              
</Col>

<Col sm='12'>
  <div className='button'>
    <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
      Submit
    </Button>
    <Button outline color='secondary' type='reset'>
      Change Multi Room Status
    </Button>
  </div>
  </Col>
  <br></br>

        {/* boxes */}
        <div>
           <Row>
            <Col>
            {selectedOption === "option1" && (
              <Card className='abc' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className='rectangle'>
                    <p>154</p>
                    <p>new</p>
                    <p>Occupied</p>
                    <p>{selectedValue}</p>
                    <p>Stayover</p>

                  </div>
                </CardBody>
              </Card>
              )}
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" onClick={() => setCenteredModal(!centeredModal)} >
                    <p>547</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" onClick={() => setCenteredModal(!centeredModal)} >
                    <p>638</p>
                    <p>DXBF</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='abc' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>214</p>
                    <p>DXBX</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>777</p>
                    <p>ST</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>111</p>
                    <p>DX</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Departed</p>
                  </div>
                </CardBody>
              </Card>

            </Col>
            <Col>
              <Card className='abc' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>305</p>
                    <p>PRST</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>

              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>140</p>
                    <p>DX</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>333</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>143</p>
                    <p>ST</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>

              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>286</p>
                    <p>PRST</p>
                    <p>Vacant</p>
                    <p>Inspected</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>296</p>
                    <p>DX</p>
                    <p>Vacant</p>
                    <p>Inspected</p>
                    <p>Departed</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>431</p>
                    <p>DX</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>372</p>
                    <p>ST</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>513</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

          </Row>
        </div>

      </TabPane>

      <TabPane tabId='2'>

      <Col md='6' sm='12' className='mb-1'>
  <Label className='form-label' for='EmailMulti'>
   Choose Entire Room Status
</Label>
<Input type='select' id='Resevation Status Type'>
<option>---Select Room Status---</option>
    <option>Inspected</option>
    <option>Dirty</option>
    <option>Clean</option>
  </Input>              
</Col>

<Col sm='12'>
  <div className='button'>
    <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
      Submit
    </Button>
    <Button outline color='secondary' type='reset'>
      Change Multi Room Status
    </Button>
  </div>
  </Col>
  <br></br>
  <div>
          <Row>
            <Col>
              <Card className='abc' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className='rectangle'>
                    <p>154</p>
                    <p>new</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Stayover</p>

                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" onClick={() => setCenteredModal(!centeredModal)} >
                    <p>547</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" onClick={() => setCenteredModal(!centeredModal)} >
                    <p>638</p>
                    <p>DXBF</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='dirty' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>214</p>
                    <p>DXBX</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>777</p>
                    <p>ST</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>111</p>
                    <p>DX</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Departed</p>
                  </div>
                </CardBody>
              </Card>

            </Col>
            <Col>
              <Card className='dirty' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>305</p>
                    <p>PRST</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>

              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>140</p>
                    <p>DX</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>333</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>143</p>
                    <p>ST</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>

              <Card className='inspected'>
                <CardBody>
                  <div className="rectangle" >
                    <p>286</p>
                    <p>PRST</p>
                    <p>Vacant</p>
                    <p>Inspected</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col>
              <Card className='inspected'>
                <CardBody>
                  <div className="rectangle" >
                    <p>296</p>
                    <p>DX</p>
                    <p>Vacant</p>
                    <p>Inspected</p>
                    <p>Departed</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>431</p>
                    <p>DX</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>372</p>
                    <p>ST</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>513</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

          </Row>
        </div>

      </TabPane>

      <TabPane tabId='3'>
      <Col md='6' sm='12' className='mb-1'>
  <Label className='form-label' for='EmailMulti'>
   Choose Entire Room Status
</Label>
<Input type='select' id='Resevation Status Type'>
<option>---Select Room Status---</option>
    <option>Inspected</option>
    <option>Dirty</option>
    <option>Clean</option>
  </Input>              
</Col>

<Col sm='12'>
  <div className='button'>
    <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
      Submit
    </Button>
    <Button outline color='secondary' type='reset'>
      Change Multi Room Status
    </Button>
  </div>
  </Col>
  <br></br>
  <div>
          <Row>
            <Col>
              <Card className='abc' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className='rectangle'>
                    <p>154</p>
                    <p>new</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Stayover</p>

                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" onClick={() => setCenteredModal(!centeredModal)} >
                    <p>547</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" onClick={() => setCenteredModal(!centeredModal)} >
                    <p>638</p>
                    <p>DXBF</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='dirty' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>214</p>
                    <p>DXBX</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='dirty' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>777</p>
                    <p>ST</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>111</p>
                    <p>DX</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Departed</p>
                  </div>
                </CardBody>
              </Card>

            </Col>
            <Col>
              <Card className='abc' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>305</p>
                    <p>PRST</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>

              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>140</p>
                    <p>DX</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='inspected' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>333</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>143</p>
                    <p>ST</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>

              <Card className='inspected'>
                <CardBody>
                  <div className="rectangle" >
                    <p>286</p>
                    <p>PRST</p>
                    <p>Vacant</p>
                    <p>Inspected</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col>
              <Card className='inspected'>
                <CardBody>
                  <div className="rectangle" >
                    <p>296</p>
                    <p>DX</p>
                    <p>Vacant</p>
                    <p>Inspected</p>
                    <p>Departed</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>431</p>
                    <p>DX</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>372</p>
                    <p>ST</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>513</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

          </Row>
        </div>
      </TabPane>

      <TabPane tabId='4'>

      <Col md='6' sm='12' className='mb-1'>
  <Label className='form-label' for='EmailMulti'>
   Choose Entire Room Status
</Label>
<Input type='select' id='Resevation Status Type'>
<option>---Select Room Status---</option>
    <option>Inspected</option>
    <option>Dirty</option>
    <option>Clean</option>
  </Input>              
</Col>

<Col sm='12'>
  <div className='button'>
    <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
      Submit
    </Button>
    <Button outline color='secondary' type='reset'>
      Change Multi Room Status
    </Button>
  </div>
  </Col>
  <br></br>
        {/* boxes */}

        <div>
          <Row>
            <Col>
              <Card className='abc' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className='rectangle'>
                    <p>154</p>
                    <p>new</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Stayover</p>

                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" onClick={() => setCenteredModal(!centeredModal)} >
                    <p>547</p>
                    <p>STBF</p>
                    <p> Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" onClick={() => setCenteredModal(!centeredModal)} >
                    <p>638</p>
                    <p>DXBF</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='dirty' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>214</p>
                    <p>DXBX</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='dirty' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>777</p>
                    <p>ST</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>111</p>
                    <p>DX</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Departed</p>
                  </div>
                </CardBody>
              </Card>

            </Col>
            <Col>
              <Card className='abc' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>305</p>
                    <p>PRST</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>

              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>140</p>
                    <p>DX</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>333</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>143</p>
                    <p>ST</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>

              <Card className='inspected'>
                <CardBody>
                  <div className="rectangle" >
                    <p>286</p>
                    <p>PRST</p>
                    <p>Vacant</p>
                    <p>Inspected</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col>
              <Card className='inspected'>
                <CardBody>
                  <div className="rectangle" >
                    <p>296</p>
                    <p>DX</p>
                    <p>Vacant</p>
                    <p>Inspected</p>
                    <p>Departed</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>431</p>
                    <p>DX</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>372</p>
                    <p>ST</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>513</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

          </Row>
        </div>
      </TabPane>

      <TabPane tabId='5'>

      <Col md='6' sm='12' className='mb-1'>
  <Label className='form-label' for='EmailMulti'>
   Choose Entire Room Status
</Label>
<Input type='select' id='Resevation Status Type'>
<option>---Select Room Status---</option>
    <option>Inspected</option>
    <option>Dirty</option>
    <option>Clean</option>
  </Input>              
</Col>

<Col sm='12'>
  <div className='button'>
    <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
      Submit
    </Button>
    <Button outline color='secondary' type='reset'>
      Change Multi Room Status
    </Button>
  </div>
  </Col>
  <br></br>
  <div>
          <Row>
            <Col>
              <Card className='abc' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className='rectangle'>
                    <p>154</p>
                    <p>new</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Stayover</p>

                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" onClick={() => setCenteredModal(!centeredModal)} >
                    <p>547</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" onClick={() => setCenteredModal(!centeredModal)} >
                    <p>638</p>
                    <p>DXBF</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='dirty' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>214</p>
                    <p>DXBX</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='dirty' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>777</p>
                    <p>ST</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>111</p>
                    <p>DX</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Departed</p>
                  </div>
                </CardBody>
              </Card>

            </Col>
            <Col>
              <Card className='abc' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>305</p>
                    <p>PRST</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>

              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>140</p>
                    <p>DX</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>333</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>143</p>
                    <p>ST</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>

              <Card className='inspected'>
                <CardBody>
                  <div className="rectangle" >
                    <p>286</p>
                    <p>PRST</p>
                    <p>Vacant</p>
                    <p>Inspected</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col>
              <Card className='inspected'>
                <CardBody>
                  <div className="rectangle" >
                    <p>296</p>
                    <p>DX</p>
                    <p>Vacant</p>
                    <p>Inspected</p>
                    <p>Departed</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>431</p>
                    <p>DX</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>372</p>
                    <p>ST</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>513</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

          </Row>
        </div>
      </TabPane>

      <TabPane tabId='6'>
      <Col md='6' sm='12' className='mb-1'>
  <Label className='form-label' for='EmailMulti'>
   Choose Entire Room Status
</Label>
<Input type='select' id='Resevation Status Type'>
<option>---Select Room Status---</option>
    <option>Inspected</option>
    <option>Dirty</option>
    <option>Clean</option>
  </Input>              
</Col>

<Col sm='12'>
  <div className='button'>
    <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
      Submit
    </Button>
    <Button outline color='secondary' type='reset'>
      Change Multi Room Status
    </Button>
  </div>
  </Col>
  <br></br>
  <div>
          <Row>
            <Col>
              <Card className='abc' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className='rectangle'>
                    <p>154</p>
                    <p>new</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Stayover</p>

                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" onClick={() => setCenteredModal(!centeredModal)} >
                    <p>547</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" onClick={() => setCenteredModal(!centeredModal)} >
                    <p>638</p>
                    <p>DXBF</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='dirty' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>214</p>
                    <p>DXBX</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='dirty' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>777</p>
                    <p>ST</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>111</p>
                    <p>DX</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Departed</p>
                  </div>
                </CardBody>
              </Card>

            </Col>
            <Col>
              <Card className='abc' onClick={() => setBasicModal(!basicModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>305</p>
                    <p>PRST</p>
                    <p>Occupied</p>
                    <p>Dirty</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>

              <Card className='abc' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>140</p>
                    <p>DX</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='inspected' onClick={() => setCenteredModal(!centeredModal)}>
                <CardBody>
                  <div className="rectangle" >
                    <p>333</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>143</p>
                    <p>ST</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Arrival</p>
                  </div>
                </CardBody>
              </Card>

              <Card className='inspected'>
                <CardBody>
                  <div className="rectangle" >
                    <p>286</p>
                    <p>PRST</p>
                    <p>Vacant</p>
                    <p>Inspected</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col>
              <Card className='inspected'>
                <CardBody>
                  <div className="rectangle" >
                    <p>296</p>
                    <p>DX</p>
                    <p>Vacant</p>
                    <p>Inspected</p>
                    <p>Departed</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>431</p>
                    <p>DX</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>372</p>
                    <p>ST</p>
                    <p>Occupied</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
              <Card className='abc'>
                <CardBody>
                  <div className="rectangle" >
                    <p>513</p>
                    <p>STBF</p>
                    <p>Vacant</p>
                    <p>Clean</p>
                    <p>Stayover</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

          </Row>
        </div>

      </TabPane>
    </TabContent>
  </Fragment>

{/* ModalBasic */}
  <div className='demo-inline-spacing'>
        <div className='basic-modal'>
          <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
            <ModalHeader toggle={() => setBasicModal(!basicModal)}>Change Room Status</ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <p> Guest Name: Mr. Rachesh</p>
                  <p> Room Number: 118</p>
                  <p> Front Office Status: Dirty</p>
                  <p> Reservation Status: Stay Over</p>
                  <p> Arrival: 22-FEB-2023</p>
                  <p> Departure: 01-MARCH-2023</p>
                  <p> Status: Checked In</p>
                  <p> Company Name: Continental Automotive</p>
                  <p> Extraslns: [object object]</p>
                  <p> Comments: 7600+CP Office Transfers inclusive in Rate</p>

                  <Col md='6' sm='12' className='mb-1'>
                    <Label className='form-label' for='EmailMulti'>
                      Choose Room Status
                    </Label>
                    {/* <Input type='select' id='Resevation Status Type'>
                      <option>---Select Status---</option>
                      <option>Inspected</option>
                      <option>Dirty</option>
                      <option>Clean</option>
                    </Input> */}
                     <select id="dropdown" value={selectedValue} onChange={handleDropdownChange}>
                      <option value="">Select Room Status</option>
                      <option value="inspected">Inspected</option>
                      <option value="dirty">Dirty</option>
                      <option value="clean">Clean</option>
                      </select>
                  </Col>
                  <Col sm='12'>

                  </Col>
                </Row>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color='primary' onClick={() => setBasicModal(!basicModal)}>
                OK
              </Button>
              <Button color='primary' onClick={() => setBasicModal(!basicModal)}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </div>

        <div className='vertically-centered-modal'>
          <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered'>
            <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Vertically Centered</ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <p> Room Number: 118</p>
                  <p> Front Office Status: Dirty</p>
                  <p> Housekeeping Status: Inspected</p>
                  <p> Reservation Status: Arrivals</p>
                  <Col md='6' sm='12' className='mb-1'>
                    <Label className='form-label' for='EmailMulti'>
                      Choose Room Status
                    </Label>
                    <Input type='select' id='Resevation Status Type'>
                      <option>---Select Status---</option>
                      <option>Inspected</option>
                      <option>Dirty</option>
                      <option>Clean</option>
                    </Input>
                  </Col>
                  <Col sm='12'>

                  </Col>
                </Row>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color='primary' onClick={() => setCenteredModal(!centeredModal)}>
                OK
              </Button>{' '}
              <Button outline color='primary' onClick={() => setCenteredModal(!centeredModal)}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
  </div>
)

 
}

export default ChangeRoomFloor