
import { Fragment } from "react";
import { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";

import UpdateUserInfo from "./UpdateUser";
import UpdatePassword from "./UpdatePassword";
import UpdateStatus from "./UserStatus";
import UpdateStoreid from "./UpdateStore";
import UpdatePasscode from "./UserPasscode";

const UpdateButtons = ({ data1, data6, data2, data3, data4, data5 }) => {
  const [showModal, setShowModal] = useState(false);
  const [showCodeModal, setCodeModal] = useState(false);
  const [showStatus, setStatus] = useState(false);
  const [showstore, setStore] = useState(false);

  const stringData6 = data6.toString();

  useEffect(() => {
    if (data1 === "1" && stringData6 === "1") {
      setShowModal(true);
      setCodeModal(false);
      setStatus(true);
      setStore(false);
    } else if (data1 === "2" && stringData6 === "1") {
      setShowModal(true);
      setCodeModal(false);
      setStatus(true);
      setStore(false);
    } else if (data1 === "2" && stringData6 === "2") {
      setShowModal(true);
      setCodeModal(true);
      setStatus(true);
      setStore(true);
    } else if (data1 === "1" && stringData6 === "2") {
      setShowModal(false);
      setCodeModal(true);
      setStatus(true);
      setStore(true);
    }
    else{
      setShowModal(true);
      setCodeModal(false);
      setStatus(true);
      setStore(false);
    }
  }, [data1, stringData6]);

  return (
    <Fragment>
      <Row className="match-height">
        <Col md="4">
          <UpdateUserInfo userId={data2} email={data3} phone={data4} userStatus={data5} />
        </Col>
        {showModal && (
          <Col md="4">
            <UpdatePassword userId={data2} userStatus={data5}/>
          </Col>
        )}

        {showCodeModal && (
          <Col md="4">
            <UpdatePasscode userId={data2} userStatus={data5}/>
          </Col>
        )}
        {showStatus && (
          <Col md="4">
            <UpdateStatus userId={data2} userStatus={data5} />
          </Col>
        )}

        {showstore && (
          <Col md="4">
            <UpdateStoreid userId={data2} userStatus={data5}/>
          </Col>
        )}
      </Row>
    </Fragment>
  );
};

export default UpdateButtons;
