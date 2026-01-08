import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader,Input, InputGroup, InputGroupText } from 'reactstrap'
import { useState } from 'react'
import API_URL2 from '../../../../config2';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)


const UploadCSV = () => {

    const [file, setFile] = useState(null);
    let navigate = useNavigate();  
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };
    const [fileName, setFileName] = useState('');

 

    const handleDownload = async (filename) => {
      try {
        const response = await fetch(API_URL2 + '/downloadcsvfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ filename })
        });
    
        if (!response.ok) {
          throw new Error('Failed to download file');
        }
    
        // Convert the response to blob
        const blob = await response.blob();
    
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
    
        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename; // Set the desired filename
        document.body.appendChild(link);
    
        // Click the link to start the download
        link.click();
    
        // Cleanup: remove the anchor element and revoke the temporary URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        // Handle error
        console.error('Error downloading file:', error.message);
      }
    };

    
    const [rowData, setRowData] = useState();

    const handleSubmit = async (event) => {
      event.preventDefault(); // Prevent default form submission behavior
    
      if (!file) {
        // Show alert message if no file is uploaded
        Swal.fire({
          icon: 'warning',
          title: 'No file uploaded',
          text: 'Please choose a file to upload.',
        });
        return; // Exit the function
      }
    
      const formData = new FormData();
      formData.append('csv', file);
    
      try {
        const response = await fetchx(API_URL2 + '/uploadresturant', {
          method: 'POST',
          body: formData,
        });
    
        if (response.ok) {
          // File successfully uploaded
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'File successfully uploaded!',
          });
          // Fetch data from the API to update the UI
          fetchDataAndUpdateUI();
          fetchx(API_URL2 + "/getrestaurantlist?hotelID=1")
          .then((result) => result.json())
          .then((rowData) => {
            // Update the rowData state with the fetched data
            setRowData(rowData["data"]);
            navigate('')
          });
        } else {
          // Handle backend error
          const errorData = await response.json();
          const errorMessage = errorData.message || 'Unknown error occurred';

          // if (lineNumber !== null) {
          //   // Highlight error line in the UI
          //   // highlightErrorLine(lineNumber);
          // }
  
    
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
          });
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        // Show a generic error message for unexpected errors
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred. Please try again later.',
        });
      }
    };
    
    const fetchDataAndUpdateUI = () => {
      // Fetch data from the API to update the UI
      fetchx(API_URL2 + "/getrestaurantlist?hotelID=1")
        .then((result) => {
          if (!result.ok) {
            // Handle error in fetching data
            throw new Error('Failed to fetch data');
          }
          return result.json();
        })
        .then((rowData) => {
          // Update the rowData state with the fetched data
          setRowData(rowData["data"]);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          // Show a generic error message for data fetching errors
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch data. Please try again later.',
          });
        });
    };
    
      return (
      <div>
        <h5>Upload CSV File</h5>
        <Form onSubmit={handleSubmit}>
            <Row>
        <Col md='3' sm='12'>
          <Input type="file" accept="csv" onChange={handleFileChange} />
          </Col>
 
    <Col md='3' sm='12'>
{/* <div align="left" className="buttons"> */}
<Button className='me-1' color='primary' type='submit'> Upload</Button>
 <Button className='me-1' outline color='secondary' onClick={() => handleDownload('store.csv')}>Store File</Button>
</Col>
          {/* </Row> */}
          </Row>
        </Form>
      </div>
    );
  };
  export default UploadCSV;