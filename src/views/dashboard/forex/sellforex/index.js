import React, { useState, Fragment } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'; // You might need to import these components
import SellForex from './sellforex'
import CancelForexTab from "./cancelForexTab"

const TableWithData = () => {
  const [active, setActive] = useState('sellForex'); // Set the initial active tab to 'sellForex'

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  return (
    <div>
      <Fragment>
        <Nav tabs filled>
          <NavItem>
            <NavLink
              active={active === 'sellForex'}
              onClick={() => {
                toggle('sellForex');
              }}
            >
              Sell Forex
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === 'cancelForex'}
              onClick={() => {
                toggle('cancelForex');
              }}
            >
              Forex Cancellation Certificate
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={active}>
          <TabPane tabId='sellForex'>
            {/* Content for the 'Sell Forex' tab */}
            <SellForex />
          </TabPane>
          <TabPane tabId='cancelForex'>
            {/* Content for the 'Cancel Forex' tab */}
            <CancelForexTab />
          </TabPane>
        </TabContent>
      </Fragment>
    </div>
  );
};

export default TableWithData;
