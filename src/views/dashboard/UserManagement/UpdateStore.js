import { Fragment, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../config";

import {
  Card,
  Row,
  Col,
  Modal,
  InputGroup,
  Dropdown,
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
import { Home } from "react-feather";
import { useForm, Controller } from "react-hook-form";

import { selectThemeColors } from "@utils";

import "@styles/react/libs/react-select/_react-select.scss";

const UpdateStoreid = ({ userId,userStatus }) => {
  const [restaurantOptions, setRestaurantOptions] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [formData, setFormData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  
  let navigate = useNavigate();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchx(API_URL + "/getUserMappedStoreDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: userId,
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        setSelectedRestaurants(
          resp["data"].map((restaurant) => ({
            value: restaurant.storeID,
            label: restaurant.restaurantName,
          }))
        );
      });
  }, [userId]);

  useEffect(() => {
    const fetchxRestaurantData = async () => {
      try {
        const response = await fetchx(API_URL + "/getstoreid");
        const responseData = await response.json();

        if (
          responseData.status === "success" &&
          Array.isArray(responseData.data)
        ) {
          setRestaurantOptions(
            responseData["data"].map((restaurant) => ({
              value: restaurant.storeID,
              label: restaurant.restaurantName,
            }))
          );
        } else {
          console.error("Invalid or unsuccessful response: ", responseData);
        }
      } catch (error) {
        console.error("Error fetchxing restaurant data:", error);
      }
    };

    fetchxRestaurantData();
  }, []);

  const [show, setShow] = useState(false);

  const onSubmit = async (data) => {
    setFormData(data);

    const isSameStores =
      JSON.stringify(selectedRestaurants) === JSON.stringify(data.storeid);

    if (isSameStores) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "The restaurant is already mapped to the user.",
      });
      return;
    }

    try {
      const apiUrl = API_URL + `/updateMappedStoreIdList/${userId}`;
      const response = await fetchx(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeIdList: String(
            Array.isArray(data.storeid)
              ? data.storeid.map((item) => item.value)
              : []
          ),
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

  const handleStoreChange = (value) => {
    setIsDirty(true);
  };

  return (
    <Fragment>
      <Card>
        <CardBody className="text-center">
          <Home className="font-large-2 mb-1" />
          <CardTitle tag="h5">Update Store Access</CardTitle>
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
            <h1 className="mb-1">Update Store Access</h1>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Col md="6" sm="12" className="mb-1  mx-auto">
              <div className="mb-1">
                <Label className="form-label" for="storeid">
                  Map Store<span className="text-danger">*</span>
                </Label>
                <Controller
                  id="storeid"
                  control={control}
                  name="storeid"
                  render={({ field }) => (
                    <Select
                      required
                      isMulti
                      isClearable
                      options={restaurantOptions}
                      classNamePrefix="select"
                      theme={selectThemeColors}
                      defaultValue={selectedRestaurants}
                      {...field}
                      onChange={(value) => {
                        field.onChange(value);
                        handleStoreChange(value);
                      }}
                    />
                  )}
                />
              </div>
            </Col>

            <Col xs={12} className="text-center mt-2 pt-50">
              <Button
                type="submit"
                className="me-1"
                color="primary"
                disabled={!isDirty}
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

export default UpdateStoreid;

