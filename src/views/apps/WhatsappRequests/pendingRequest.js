import React, { useState, useEffect } from "react";
import { Label, Input, Button, Row, Col, ModalHeader } from "reactstrap";
import Select from "react-select";
import classnames from "classnames";
import { useForm, Controller } from "react-hook-form";
import API_URL from "../../../config";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import { useNavigate } from 'react-router-dom'

const ServiceStatusModal = ({ data1, currentStatus, onCancel, onUpdateSuccess }) => {
  const [stewards, setStewards] = useState([]);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const typeOptions = [
   // { value: "Open", label: "Open" },
    { value: "In Progress", label: "In Progress" },
   { value: "Completed", label: "Completed" },
  ];

  // Filter out redundant statuses
  const availableStatuses = typeOptions.filter(
    (option) => !(currentStatus === "Open" && option.value === "Open")
  );

  const handleSuccess = (message) => {
    return MySwal.fire({
        title: 'Update Succesful!!',
        text: message,
        icon: 'success',
    },
        setTimeout(() => { navigate('') }, 1000)
    )
}

  useEffect(() => {
    const fetchStewards = async () => {
      try {
        const response = await fetch(`${API_URL}/getallstewardlist`);
        const data = await response.json();
        if (data.data) {
          const stewardOptions = data.data.map((steward) => ({
            value: steward.user_id,
            label: steward.stewardName,
          }));
          setStewards(stewardOptions);
        }
      } catch (error) {
        console.error("Error fetching stewards:", error);
      }
    };

    fetchStewards();
  }, []);

  const onSubmit = async (formData) => {
    try {
      const requestBody = {
        id: data1,
        status: formData.status?.value,
        comments: formData.comment || "",
      };

   
      if (formData.status?.value === 'In Progress') {
        requestBody.attended_by = formData.stewardID.value;
      }

      if (formData.status?.value === 'Completed') {
        requestBody.completed_by = formData.stewardID.value;
      }


      console.log("requestBody for api",requestBody)
      const response = await fetch(`${API_URL}/updateWhatsappServiceStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        handleSuccess("Status Updated")
        onUpdateSuccess();
      } else {
        console.error("Failed to update status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <>
      <ModalHeader style={{ fontSize: "20px", fontWeight: "bold" }}>
        Update Service Status
      </ModalHeader>

      <div className="px-4 py-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="8" sm="8" className="mb-1">
              <Label className="form-label" for="status">
                Status<span className="text-danger">*</span>
              </Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    isClearable
                    options={availableStatuses}
                    classNamePrefix="select"
                    className={classnames("react-select", {
                      "is-invalid": errors.status,
                    })}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption);
                      if (selectedOption?.value === "Completed") {
                        setValue("stewardID", null);
                      }
                    }}
                  />
                )}
              />
              {errors.status && <p className="text-danger">{errors.status.message}</p>}
            </Col>

            <Col md="8" sm="8" className="mb-1">
              <Label className="form-label" for="stewardID">
                Attended By<span className="text-danger">*</span>
              </Label>
              <Controller
                name="stewardID"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isClearable
                    required
                    options={stewards}
                    classNamePrefix="select"
                    className={classnames("react-select", {
                      "is-invalid": errors.stewardID,
                    })}
                    isDisabled={control._defaultValues.status?.value === "Completed"}
                  />
                )}
              />
            </Col>
          </Row>

          <Row>
            <Col md="8" sm="8">
              <Label className="form-label" for="comment">
                Comment
              </Label>
              <Controller
                name="comment"
                control={control}
                defaultValue={data1?.data1?.comments || ""}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="textarea"
                    placeholder="Add a comment"
                    className={classnames({ "is-invalid": errors.comment })}
                  />
                )}
              />
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button color="secondary" outline onClick={onCancel}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Update
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ServiceStatusModal;
