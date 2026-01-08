// ** React Imports
import { Link } from 'react-router-dom'
import { useEffect ,useState} from 'react'

// ** Reactstrap Imports
import { Card, CardBody, Button ,Modal, ModalHeader, ModalBody, ModalFooter, Col} from 'reactstrap'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Compose from './regCompose'

const PDFDocument = () => {
  useEffect(() => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text('Hello World!', 10, 10);

    // Save the PDF
    doc.save('example.pdf');
  }, []);

  return <div>Generating PDF...</div>;
};



const PreviewActions = ({ id, setSendSidebarOpen, setAddPaymentOpen }) => {
  const divToPrint = document.getElementById('divId');
    
  // // Create a canvas from the div element
  // html2canvas(divToPrint).then((canvas) => {
  //   const divWidth = divToPrint.offsetWidth;
  //   const divHeight = divToPrint.offsetHeight;
  //   const ratio = divWidth / divHeight;
  //   const imgData = canvas.toDataURL('image/png');
  //   const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  //   const width = pdf.internal.pageSize.getWidth();
  //   const height = width / ratio;
  //   pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  //   pdf.save('file.pdf');
  // });
  const [mailNotification, setMailNotification] = useState();

  return (
    <div>
        <div>
      <Modal isOpen={mailNotification} toggle={() => setMailNotification(!mailNotification)} className='modal-lg'>
       <ModalHeader className='modal-lg' toggle={() => setMailNotification(!mailNotification)}>Confirmation Letter</ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>         
         <Compose/>        
        </ModalBody>
     </Modal>
    </div>


    <Card className='invoice-action-wrapper'>
      <CardBody>       
        {/* <Button color='secondary'  block outline className='mb-75' onClick={() =>{ PDFDocument()}}>
          Download
        </Button> */}
        <Button color='secondary' tag={Link} to='/dashboard/eregistrationcardinvoice/print' target='_blank' block outline className='mb-75'>
          Print
        </Button>
        {/* <Button color='secondary'  target='_blank' block outline className='mb-75' onClick={() =>{ setMailNotification(!mailNotification)}}>
          Email
        </Button>  */}
        {/* <Button tag={Link} to={`/apps/invoice/edit/${id}`} color='secondary' block outline className='mb-75'>
          Edit
        </Button> */}
        {/* <Button color='success' block onClick={() => setAddPaymentOpen(true)}>
          Add Payment
        </Button> */}
      </CardBody>
    </Card>
    </div>
  )
}

export default PreviewActions
