
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import API_URL from '../../../config';

const Preferences = ({data1}) => {
  const [guestpreferencenotes, setguestpreferencenotes] = useState();
  const [guestnotes, setguestnotes] = useState();

  useEffect(() => {
    fetchx(API_URL + `/getAllGuestDetails?guestID=${data1.guestID} `)
    .then(result => result.json())
    .then((resp) => {
        setguestpreferencenotes(resp['data'][0]["guestpreferencenotes"])
        setguestnotes(resp['data'][0]["notes"])
      })
  }, []);

 
  return (
    <div>
        <h5 className="mb-3"><b> Guest Preferences:  </b>   {guestpreferencenotes} </h5>
        <h5 className="mb-3"><b> Guest Profile Notes: </b>  {guestnotes}</h5>     
    </div>
  );
}

export default Preferences;
