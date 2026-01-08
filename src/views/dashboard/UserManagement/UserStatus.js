import { Fragment, useState, useEffect } from "react";
import Swal from "sweetalert2";
import API_URL from "../../../config";
import { useNavigate } from "react-router-dom";
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
  FormFeedback,
  Form,
} from "reactstrap";

import Select from "react-select";
import { User, Check, X } from "react-feather";
import { useForm, Controller } from "react-hook-form";

import { selectThemeColors } from "@utils";

import "@styles/react/libs/react-select/_react-select.scss";



const UpdateStatus = ({ userId, userStatus }) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(null);
  let navigate = useNavigate();
  const {
    control,
    setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset({ status: userStatus });
  }, [userStatus, reset]);

  const option = [
    { value: "Active", label: "Enable", isDisabled: userStatus === 'Active' },
    { value: "Inactive", label: "Disable", isDisabled: userStatus === 'Inactive' },
  ];

  console.log(userStatus);

  const onSubmit = async (data) => {
    setData(data);
    //console.log(data.status.value);
    try {
      const apiUrl = API_URL + `/updateUserStatus/${userId}`;
      const response = await fetchx(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status: data.status.value,
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Updated successfully!!",
        });
        navigate("");
        setShow(false);
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

          <CardTitle tag="h5">Enable/Disable User</CardTitle>
          <CardText></CardText>
          <br></br>
          <br></br>
          <Button color="primary" onClick={() => setShow(true)}>
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
            <h1 className="mb-1">Enable/Disable User</h1>
          </div>
          <div className="text-center mt-3">Current Status: {userStatus}</div>
          <br></br>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Col md="6" sm="12" className="mb-1  mx-auto">
              <div className="mb-1">
                <Label className="form-label" for="status">
                  Enable/Disable<span className="text-danger">*</span>
                </Label>
                <Controller
                  id="status"
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      required
                      options={option}
                      classNamePrefix="select"
                      theme={selectThemeColors}
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

export default UpdateStatus;
