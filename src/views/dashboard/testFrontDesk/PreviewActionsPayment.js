// ** React Imports
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import { Card, CardBody, Button } from 'reactstrap'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const PreviewActions = ({ id, setSendSidebarOpen, setAddPaymentOpen }) => {
  const divToPrint = document.getElementById('divId');
    
  // Create a canvas from the div element
  html2canvas(divToPrint).then((canvas) => {
    const divWidth = divToPrint.offsetWidth;
    const divHeight = divToPrint.offsetHeight;
    const ratio = divWidth / divHeight;
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const width = pdf.internal.pageSize.getWidth();
    const height = width / ratio;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('file.pdf');
  });
  return (
    <Card className='invoice-action-wrapper'>
      <CardBody>
        {/* <Button color='primary' block className='mb-75' onClick={() => setSendSidebarOpen(true)}>
          Send Invoice
        </Button> */}
        <Button color='secondary' block outline className='mb-75' >
          Download
        </Button>
        <Button color='secondary' tag={Link} to='/dashboard/invoice2/print' target='_blank' block outline className='mb-75'>
          Print
        </Button>
        {/* <Button tag={Link} to={`/apps/invoice/edit/${id}`} color='secondary' block outline className='mb-75'>
          Edit
        </Button> */}
        {/* <Button color='success' block onClick={() => setAddPaymentOpen(true)}>
          Add Payment
        </Button> */}
      </CardBody>
    </Card>
  )
}

export default PreviewActions
