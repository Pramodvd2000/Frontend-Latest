import { Fragment, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import API_URL from "../../../config";

import {
  Card,
  Row,
  Col,
  Alert,
  Modal,
  Input,
  Label,
  InputGroup,
  Button,
  CardBody,
  CardText,
  CardTitle,
  ModalBody,
  ModalHeader,
  FormFeedback,
  Form,
} from "reactstrap";

import { Key, Check, X } from "react-feather";
import { useForm, Controller } from "react-hook-form";

import "@styles/react/libs/react-select/_react-select.scss";

const UpdatePasscode = ({ userId, userStatus }) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(null);
  let navigate = useNavigate();

  const { control, setError, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    console.log(data.passcode);
    setData(data);

    try {
      const apiUrl = API_URL + `/updateStewardPasscode/${userId}`;
      const response = await fetchx(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passcode: data.passcode,
        }),
      });

      if (response.ok) {
       await Swal.fire({
          icon: "success",
          title: "Updated successfully!!",
        });

        setShow(false);
        navigate("");
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
          <Key className="font-large-2 mb-1" />

          <CardTitle tag="h5">Update Passcode</CardTitle>
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
            <h1 className="mb-1">Update Passcode</h1>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Col md="5" sm="12" className="mb-1  mx-auto">
              <div className="mb-1">
                <Label className="form-label" for="passcode">
                  Passcode<span className="text-danger">*</span>
                </Label>

                <Controller
                  id="passcode"
                  name="passcode"
                  control={control}
                  placeholder="Passcode"
                  render={({ field }) => (
                    <Input
                      pattern="[0-9]*"
                      title="Only Numbers Allowed"
                      required
                      placeholder="Enter Passcode"
                      maxLength={5}
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
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default UpdatePasscode;
