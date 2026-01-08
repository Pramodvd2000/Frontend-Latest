import React, { Fragment, useState, useEffect } from "react";
import { AlertCircle } from "react-feather";
import API_URL from "../../../config";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "react-feather";

import Swal from "sweetalert2";

import {
  Card,
  Row,
  Col,
  Alert,
  Modal,
  Input,
  Label,
  InputGroup,
  InputGroupText,
  Button,
  CardBody,
  CardText,
  CardTitle,
  ModalBody,
  ModalHeader,
  FormFeedback,
  Form,
} from "reactstrap";

import { Lock } from "react-feather";
import { useForm, Controller } from "react-hook-form";

import "@styles/react/pages/modal-create-app.scss";
const defaultValues = {};

const UpdatePassword = ({ userId, userStatus }) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(null);
  let navigate = useNavigate();
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordInput = (e) => {
    const inputValue = e.target.value;
    const isValidInput = /^[a-zA-Z0-9$@#*]+$/.test(inputValue);
  
    if (isValidInput || inputValue === "") {
      setPassword(inputValue);
    }
  };

  useEffect(() => {
    checkPasswordConditions();
  }, [password]);
  const checkPasswordConditions = () => {
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password) ||
      !/[$@#*]/.test(password)
    ) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const onSubmit = async (data) => {
    setData(data);
    console.log(password);
    try {
      const apiUrl = API_URL + `/updateUserPassword/${userId}`;
      const response = await fetchx(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          password: password,
        }),
      });

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: `Password Updated successfully!!`,
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
          <Lock className="font-large-2 mb-1" />

          <CardTitle tag="h5">Update Password</CardTitle>
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
            <h1 className="mb-1">Update Password</h1>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Col md="5" sm="12" className="mb-1 mx-auto">
              <div className="mb-1">
                <Label className="form-label" for="password">
                  Password<span className="text-danger">*</span>
                </Label>
                <InputGroup className="input-group-merge">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter Password"
                    value={password}
                    maxLength={15}
                    required
                    onChange={(e) => {
                      handlePasswordInput(e);
                    }}
                  />
                  <InputGroupText
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </InputGroupText>
                </InputGroup>
              </div>
              <Alert color="danger" isOpen={visible}>
                <div className="alert-body">
                  <AlertCircle size={15} />{" "}
                  <span className="ms-1">
                  <p>Password must contain : </p>
                            <p>At least 8 characters</p>
                            <p>One Upper case letter</p>
                            <p>One Lower case letter</p>
                            <p>One Number</p>
                            <p>One Special character(Only $, @, #, * are allowed)</p>
                  </span>
                </div>
              </Alert>
            </Col>

            <Col xs={12} className="text-center mt-2 pt-50">
              <Button
                type="submit"
                className="me-1"
                color="primary"
                disabled={visible}
              >
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

export default UpdatePassword;
