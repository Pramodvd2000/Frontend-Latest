import { useState } from "react";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import {
  Input,
  Card,
  Form,
  Row,
  Col,
  Label,
  Button,
  Modal,
  InputGroup,
} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import { useRef, useEffect } from "react";
import API_URL from '../../../config';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "/node_modules/ag-grid-community/styles/ag-grid.css";
import "/node_modules/ag-grid-community/styles/ag-theme-alpine.css";
const MySwal = withReactContent(Swal);

const defaultValues = {
  password: "",
};

const editBlock = ({ data1 }) => {
  const {
    setError,
    formState: { errors },
  } = useForm();
  const [rowData, setRowData] = useState();
  const [data, setData] = useState(null);
  const { reset, handleSubmit, control } = useForm({ defaultValues });
  let navigate = useNavigate();
  const [flag, setflag] = useState(false);
  useEffect(() => {
    fetchx(API_URL + "/getRoomWifiDetails")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData["data"]));
  }, []);

  const onSubmit = (data) => {
    setData(data);
    let createmarketGroup = JSON.stringify({
      id: data1.id,
      password: data.password,
      userName: data1.userName,
    });
    let columnsToUpdate = createmarketGroup;
    let res = fetchx(
      API_URL + `/updatewifiPassword/${data1.id}/${data1.userName}`,

      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: columnsToUpdate,
      }
    )
      .then((result) => result.json())
      .then((resp) => {
        if (resp["statusCode"] == 200) {
          const swalInstance = MySwal.fire({
            text: "Password Updated Successfully!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Close",
            customClass: {
              confirmButton: "btn btn-danger",
            },
          });
          swalInstance.then((result) => {
            if (result.isConfirmed) {
              navigate("");
            }
          });
        } else {
          const swalInstance = MySwal.fire({
            text: "Password Details Not Updated!",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Close",
            customClass: {
              confirmButton: "btn btn-danger",
            },
          });
          swalInstance.then((result) => {
            if (result.isConfirmed) {
              navigate("");
            }
          });
        }
      })
      .catch((error) => {});
  };

  const handleCancel = () => {
    navigate("");
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Row>
            <Col md="4" sm="14">
              <div className="mb-1">
                <Label className="form-label" for="password">
                 Pasword <spam style={{ color: "red" }}>*</spam>
                </Label>
                <Controller
                  control={control}
                  id="password"
                  name="password"
                  render={({ field }) => (
                    <Input
		                    maxLength={10}
                        pattern="[A-Za-z0-9@#$%*]+"
                        title="Password must contain only alphabets, numbers, and the characters @#$%*"
                       required
                      placeholder="Password"
                      invalid={errors.block1 && true}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>
          </Row>
        </div>

        <div align="end" className="buttons">
          <Button
            className="me-1"
            color="primary"
            type="submit"
            onClick={() => setflag(true)}
          >
            Update
          </Button>
          <Button color="danger" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default editBlock;
