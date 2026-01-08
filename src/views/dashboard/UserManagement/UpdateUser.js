import { useNavigate } from "react-router-dom";
import { Fragment, useState, useEffect } from "react";
import Swal from "sweetalert2";


import API_URL from "../../../config";


import {
  Card,
  Row,
  Col,
  Modal,
  Input,
  Label,
  Button,
  CardBody,
  CardText,
  CardTitle,
  ModalBody,
  ModalHeader,
  Form,
} from "reactstrap";

import { User } from "react-feather";
import { useForm, Controller } from "react-hook-form";



// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";

const UpdateUserInfo = ({ userId, email, phone , userStatus }) => {
  // ** States
  const [show, setShow] = useState(false);
  const [rowData, setRowData] = useState();
  let navigate = useNavigate();


  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset({ mailid: email, phonenumber: phone });
  }, [email, phone, reset]);


  const [data, setData] = useState(null);

  const onSubmit = async (data) => {
    setData(data);

    try {
      const apiUrl = API_URL + `/updateUserInformation/${userId}`;
      const response = await fetchx(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.mailid,
          contact: data.phonenumber,
        }),
      });

      if (response.ok) {
        
        await Swal.fire({
          icon: "success",
          title: "Updated successfully!!",
        }).then(() => {
          

          setShow(false);
          navigate("");

         
        });
      } else {
      
        const errorData = await response.json();
        setError("email", {
          type: "manual",
          message: errorData.message || "Failed to update user information.",
        });
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  return (
    <Fragment>
      <Card>
        <CardBody className="text-center">
          <User className="font-large-2 mb-1" />
          <CardTitle tag="h5">Update User Info</CardTitle>
          <CardText></CardText>
          <br></br>
          <br></br>
          <Button color="primary" onClick={() => setShow(true)} disabled={userStatus === 'Inactive'}>
            Update
          </Button>
        </CardBody>
      </Card>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <div className="text-center mb-2">
            <h1 className="mb-1">Update User Information</h1>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="5" sm="12" className="mb-1  mx-auto">
                <div className="mb-1">
                  <Label className="form-label" for="mailid">
                    Email
                  </Label>

                  <Controller
                    id="mailid"
                    name="mailid"
                    control={control}
                    placeholder="First Name"
                    render={({ field }) => (
                      <Input
                        placeholder="Enter email id"
                        type="email"
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="5" sm="12" className="mb-1  mx-auto">
                <div className="mb-1">
                  <Label className="form-label" for="phonenumber">
                    Phone Number
                  </Label>

                  <Controller
                    id="phonenumber"
                    name="phonenumber"
                    control={control}
                    placeholder="Phone Number"
                    render={({ field }) => (
                      <Input
                        placeholder="Enter Phone Number"
                        maxLength={10}
                        pattern="[0-9]*"
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col xs={12} className="text-center mt-2 pt-50">
                <Button type="submit" className="me-1" color="primary">
                  Submit
                </Button>
                <Button
                  type="reset"
                  color="secondary"
                  outline
                  onClick={() => setShow(false)}
                >
                  Discard
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default UpdateUserInfo;
