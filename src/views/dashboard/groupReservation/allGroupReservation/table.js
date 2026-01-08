// ** Custom Components
import React, { Fragment, useState, useEffect } from 'react'
import "./frontDesk.scss"
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Input, Form, Label, CardText, CardFooter, Nav, TabPane, NavItem, NavLink, TabContent, Table
} from 'reactstrap'
import "./roomChange.scss"


import AllDefinite from './allDefinite'
import AllEnquire from './allEnquiries'
import AllTenative from './allTentative'
import AllGroupReservations from './allGroupReservations'


const TableWithData = () => {
    const [active, setActive] = useState(sessionStorage.getItem('activeTab') || '4');
    const [arrivalTab, setArrivalTab] = useState(sessionStorage.getItem('arrivalTab') || '6');

    useEffect(() => {
        sessionStorage.setItem('activeTab', active);
        sessionStorage.setItem('arrivalTab', arrivalTab);
    }, [active, arrivalTab]);


    const toggle = tab => {
        if (active !== tab) {
            setActive(tab)
            if (tab === '2') {
                setArrivalTab('6');

            }
            else if (tab === '3') {
                setArrivalTab('8');

            }
        }
    }


    return (
        <div>
            <Fragment>

                <Nav tabs filled>
                <NavItem>
                        <NavLink
                            active={active === '1'}
                            onClick={() => {
                                toggle('1')
                            }}
                        >
                            ALL GROUP RESERVATIONS
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            active={active === '4'}
                            onClick={() => {
                                toggle('4')
                            }}
                        >
                            DEFINITE
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            active={active === '2'}
                            onClick={() => {
                                toggle('2')
                            }}
                        >
                            TENTATIVE
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            active={active === '3'}
                            onClick={() => {
                                toggle('3')
                            }}
                        >
                            ENQUIRIES
                        </NavLink>
                    </NavItem>
                </Nav>
            </Fragment>



            {active === '1' && <TabContent activeTab={active}>
                <TabPane tabId='1'>
                    <AllGroupReservations />
                </TabPane>
            </TabContent>}


            {active === '3' && <AllEnquire />}


            {active === '4' && <TabContent activeTab={active}>
                <TabPane tabId='4'>
                    <AllDefinite />
                </TabPane>
            </TabContent>}

            {active === '2' && <AllTenative />}

            
        </div>
    )
}
export default TableWithData