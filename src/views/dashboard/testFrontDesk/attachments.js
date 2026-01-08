import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Label,
  Col,
  Input,
  Row
} from "reactstrap";
import { useForm, Controller } from 'react-hook-form'
import API_URL from '../../../config';

function FileDisplay(data1) {
  const { handleSubmit, control } = useForm({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);

  // Function to fetch image URLs
  const fetchImageUrls = async () => {
    try {
      const response = await fetchx(API_URL + `/getS3ImageID?hotelID=1&source=4&documentTypeID=13&docReferenceID=res_${data1.data1.tempReservationID}`);
      const data = await response.json();
      const imageIDs = data['data'];

      // Fetch each image URL separately
      const imageUrls = await Promise.all(imageIDs.map(async (imageID) => {
        const imageResponse = await fetchx(API_URL + `/images/${imageID['documentID']}`);
        const clonedImageResponse = imageResponse.clone(); // Clone the response
        const blob = await clonedImageResponse.blob()
        if (blob.type !== 'text/html') {
          // Create a URL for the blob data
          const fileUrl = URL.createObjectURL(blob);
          return fileUrl;
        }
        return null; // Skip non-image data
      }));

      // Filter out null values (non-image data)
      const filteredImageUrls = imageUrls.filter(url => url !== null);

      // Set the images state with the filtered image URLs
      setImages(filteredImageUrls);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    // Fetch image URLs when the component mounts
    fetchImageUrls();
  }, []);

  // Function to handle form submission
  const onSubmit = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('hotelID', 1);
    formData.append('source', 4);
    formData.append('doctype', 13);
    formData.append('docrefno', ("res_" + data1.data1.tempReservationID));

    // Upload the file
    // fetchx('http://13.234.187.190:14700/v4/imgupload', {
    fetchx(API_URL + '/imgupload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        fetchImageUrls();
        //console.log(result)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // view attachment part
  const handleViewImageClick = (fileData, index) => {
    window.open(fileData, '_blank', 'width=1000,height=800');
  };


  return (
    <div>

      <br></br>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h5><strong>Booking ID:</strong> {data1.data1.bookingID}</h5>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <h5><strong>Guest Name:</strong> {data1.data1.guestName}</h5>
      </div>


      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h4>&nbsp;&nbsp;&nbsp;&nbsp; Add attachment :- </h4>&nbsp;
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Col md='8' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='attachments'>
                  {/* Attachment */}
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='attachments'
                  name='attachments'
                  render={({ field }) => (
                    <Input type='file' placeholder='attachments' onChange={handleFileChange} />
                  )}
                />
              </div>
            </Col>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type='submit' color='primary'> Upload </Button>
          </div>
        </Form>
      </div>

      <br />
      <h1> &nbsp;&nbsp;List of reservation attachments, </h1>
      <br />

      {images.map((imageData, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reservation Attachment {index + 1}:- &nbsp;&nbsp;</h4>
          <br />
          <Button onClick={() => handleViewImageClick(imageData)} color='primary'>View Attachment {index + 1}</Button>
          <br></br><br></br><br></br>
        </div>
      ))}
      <br></br>
    </div>
  );
}

export default FileDisplay;