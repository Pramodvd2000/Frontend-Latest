import React, { useState, useRef, useEffect, useCallback } from 'react'
import API_URL from '../../../../config'
import { Col, Label, Input } from 'reactstrap'
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

const GroupModificationLogs = ({ reservationData }) => {
  const gridRef = useRef();
  const [logData, setLogData] = useState([]);
  const [filterText, setFilterText] = useState('');

  const fieldNameMap = {
    'reservationTypeID': 'Reservation Type',
    'paymentType': 'Payment Type',
    'companyID': 'Company Name',
    'sourceID': 'Source',
    'marketID': 'Market',
    'extraDesc': 'Extra',
    'preferences': 'Preferences',
    'origin': 'Origin',
    'ETA': 'ETA',
    'ETD': 'ETD',
    'travelAgentID': 'Agent',
    'accountManagerID': 'Account Manager',
    'bookerID': 'Booker',
    'comments': 'Comment',
    'billingInstruction': 'Billing Instructions'
  };

  useEffect(() => {
    const data = JSON.stringify({
      groupID: reservationData.id
    });

    fetch(API_URL + '/getModificationLogsForGroup', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: data,
    })
      .then((res) => res.json())
      .then(postres => {
        setLogData(postres['data'] || []);
      }).catch((err) => {
        console.log(err);
      });
  }, [reservationData.id]);

  function formatDate(date) {
    const dateString = date.toString();
    if (dateString.match(/^\w{3} \d{4}$/)) {
      return dateString;
    }
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  const [columnDefs1] = useState([
    {
      headerName: 'Modified Field',
      field: 'modificationLog',
      width: 200,
      cellRenderer: params => {
        let modLog = [];
        try {
          modLog = JSON.parse(params.data.modificationLog || '[]');
        } catch (error) {
          console.error('Error parsing modificationLog:', error);
          return '';
        }

        if (modLog[0]?.fieldName) {
          return 'Booking Information';
        }
        return modLog[0]?.modifiedFieldName || '';
      }
    },
    {
      headerName: 'Details',
      field: 'modificationLog',
      flex: 1,
      minWidth: 400,


    // cellRenderer: params => {
    //   let modLog = [];
    //   try {
    //     modLog = JSON.parse(params.data.modificationLog || '[]');
    //   } catch (error) {
    //     console.error('Error parsing modificationLog:', error);
    //     return '';
    //   }
    
    //   // Handle booking information modifications (existing case with fieldName)
    //   if (modLog[0]?.fieldName) {
    //     return (
    //       <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    //         {modLog.map((mod, index) => {
    //           const displayName = fieldNameMap[mod.fieldName] || mod.fieldName;
    //           const oldValue = mod.oldValue?.trim() || '[ ]';
    //           const newValue = mod.newValue?.trim() || '[ ]';
    
    //           if (oldValue || newValue) {
    //             return (
    //               <div key={index}>
    //                 <strong>{displayName}: </strong>
    //                 <span style={{ color: '#ff4444' }}>{oldValue}</span>
    //                 <span> → </span>
    //                 <span style={{ color: '#4caf50' }}>{newValue}</span>
    //               </div>
    //             );
    //           }
    //           return null;
    //         })}
    //       </div>
    //     );
    //   }
    
    //   // Handle multiple rate/package modifications
    //   return (
    //     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    //       {modLog.map((mod, index) => {
    //         const { modifiedFieldName, effect, groupDate, roomType } = mod;
            
    //         // Format the date
    //         const formattedDate = groupDate ? formatDate(new Date(groupDate)) : '';
            
    //         // For Rate modifications
    //         if (modifiedFieldName === 'Rate' && effect) {
    //           const priceTypes = {
    //             oneAdultPrice: '1 Adult Price',
    //             twoAdultPrice: '2 Adult Price',
    //             threeAdultPrice: '3 Adult Price',
    //             fourAdultPrice: '4 Adult Price',
    //             extraAdultPrice: 'Extra Adult Price',
    //             extraChildPrice: 'Extra Child Price'
    //           };
              
    //           return (
    //             <div key={index} style={{ 
    //               borderBottom: index < modLog.length - 1 ? '1px dashed #ccc' : 'none',
    //               paddingBottom: index < modLog.length - 1 ? '12px' : '0'
    //             }}>
    //               <div style={{ display: 'flex', marginBottom: '8px' }}>
    //                 <div style={{ flex: 1 }}><strong>Room Type: </strong>{roomType || ''}</div>
    //                 <div style={{ flex: 1 }}><strong>Date: </strong>{formattedDate}</div>
    //               </div>
                  
    //               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
    //                 {Object.entries(effect).map(([priceType, values], idx) => {
    //                   if (priceTypes[priceType] && values.oldValue !== undefined && values.newValue !== undefined) {
    //                     return (
    //                       <div key={`${index}-${priceType}`}>
    //                         <strong>{priceTypes[priceType]}: </strong>
    //                         <span style={{ color: '#ff4444' }}>₹{values.oldValue}</span>
    //                         <span> → </span>
    //                         <span style={{ color: '#4caf50' }}>₹{values.newValue}</span>
    //                       </div>
    //                     );
    //                   }
    //                   return null;
    //                 })}
    //               </div>
    //             </div>
    //           );
    //         } 
    //         // For Package modifications
    //         else if (modifiedFieldName === 'Package' && effect && effect.oldValue && effect.newValue) {
    //           const { packageCode: oldCode, packageRate: oldRate } = effect.oldValue;
    //           const { packageCode: newCode, packageRate: newRate } = effect.newValue;
              
    //           return (
    //             <div key={index} style={{ 
    //               borderBottom: index < modLog.length - 1 ? '1px dashed #ccc' : 'none',
    //               paddingBottom: index < modLog.length - 1 ? '12px' : '0'
    //             }}>
    //               <div style={{ display: 'flex', marginBottom: '8px' }}>
    //                 <div style={{ flex: 1 }}><strong>Room Type: </strong>{roomType || ''}</div>
    //                 <div style={{ flex: 1 }}><strong>Date: </strong>{formattedDate}</div>
    //               </div>
                  
    //               <div>
    //                 <strong>Package: </strong>
    //                 <span style={{ color: '#ff4444' }}>{oldCode} (Rate: ₹{oldRate})</span>
    //                 <span> → </span>
    //                 <span style={{ color: '#4caf50' }}>{newCode} (Rate: ₹{newRate})</span>
    //               </div>
    //             </div>
    //           );
    //         }
            
    //         return null;
    //       })}
    //     </div>
    //   );
    // }
    cellRenderer: params => {
      let modLog = [];
      try {
        modLog = JSON.parse(params.data.modificationLog || '[]');
      } catch (error) {
        console.error('Error parsing modificationLog:', error);
        return '';
      }
    
      // Handle booking information modifications (existing case with fieldName)
      if (modLog[0]?.fieldName) {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {modLog.map((mod, index) => {
              const displayName = fieldNameMap[mod.fieldName] || mod.fieldName;
              const oldValue = mod.oldValue?.trim() || '[ ]';
              const newValue = mod.newValue?.trim() || '[ ]';
    
              if (oldValue || newValue) {
                return (
                  <div key={index}>
                    <strong>{displayName}: </strong>
                    <span style={{ color: '#ff4444' }}>{oldValue}</span>
                    <span> → </span>
                    <span style={{ color: '#4caf50' }}>{newValue}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      }
    
      // Group modifications by roomType and date
      const groupedMods = {};
      modLog.forEach(mod => {
        const key = `${mod.roomType}-${mod.groupDate}`;
        if (!groupedMods[key]) {
          groupedMods[key] = {
            roomType: mod.roomType,
            groupDate: mod.groupDate,
            mods: []
          };
        }
        groupedMods[key].mods.push(mod);
      });
    
      // Render grouped modifications
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.values(groupedMods).map((group, groupIndex) => {
            const { roomType, groupDate, mods } = group;
            const formattedDate = groupDate ? formatDate(new Date(groupDate)) : '';
            
            return (
              <div key={groupIndex} style={{ 
                borderBottom: groupIndex < Object.values(groupedMods).length - 1 ? '1px dashed #ccc' : 'none',
                paddingBottom: groupIndex < Object.values(groupedMods).length - 1 ? '12px' : '0'
              }}>
                {/* Room Type and Date header - displayed only once per group */}
                <div style={{ display: 'flex', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}><strong>Room Type: </strong>{roomType || ''}</div>
                  <div style={{ flex: 1 }}><strong>Date: </strong>{formattedDate}</div>
                </div>
                
                {/* Display each modification in the group */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {mods.map((mod, modIndex) => {
                    const { modifiedFieldName, effect } = mod;
                    
                    // For Rate modifications
                    if (modifiedFieldName === 'Rate' && effect) {
                      const priceTypes = {
                        oneAdultPrice: '1 Adult Price',
                        twoAdultPrice: '2 Adult Price',
                        threeAdultPrice: '3 Adult Price',
                        fourAdultPrice: '4 Adult Price',
                        extraAdultPrice: 'Extra Adult Price',
                        extraChildPrice: 'Extra Child Price'
                      };
                      
                      return (
                        <div key={`${groupIndex}-rate-${modIndex}`}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {Object.entries(effect).map(([priceType, values], idx) => {
                              if (priceTypes[priceType] && values.oldValue !== undefined && values.newValue !== undefined) {
                                return (
                                  <div key={`${groupIndex}-${priceType}-${idx}`}>
                                    <strong>{priceTypes[priceType]}: </strong>
                                    <span style={{ color: '#ff4444' }}>₹{values.oldValue}</span>
                                    <span> → </span>
                                    <span style={{ color: '#4caf50' }}>₹{values.newValue}</span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      );
                    } 
                    // For Package modifications
                    else if (modifiedFieldName === 'Package' && effect && effect.oldValue && effect.newValue) {
                      const { packageCode: oldCode, packageRate: oldRate } = effect.oldValue;
                      const { packageCode: newCode, packageRate: newRate } = effect.newValue;
                      
                      return (
                        <div key={`${groupIndex}-package-${modIndex}`}>
                          <div>
                            <strong>Package: </strong>
                            <span style={{ color: '#ff4444' }}>{oldCode} (Rate: ₹{oldRate})</span>
                            <span> → </span>
                            <span style={{ color: '#4caf50' }}>{newCode} (Rate: ₹{newRate})</span>
                          </div>
                        </div>
                      );
                    }
                    
                    return null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  },
    {
      headerName: 'Modified At',
      field: 'createdAt',
      width: 180,
      cellRenderer: params => {
        if (!params.data.createdAt) return '';
        
        const [datePart, timePart] = params.data.createdAt.split(' ');
        const [year, month, day] = datePart.split('-');
        const [hours, minutes, seconds] = timePart.split(':');
        
        const date = new Date(year, month - 1, day, hours, minutes, seconds);
        
        const displayHours = date.getHours();
        const period = displayHours >= 12 ? 'PM' : 'AM';
        const hours12 = (displayHours % 12 || 12).toString().padStart(2, '0');
        const minutesStr = date.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours12}:${minutesStr} ${period}`;
      },
      sort: 'desc'
    },
    {
      headerName: 'Modified By',
      field: 'createdByFirstName',
      width: 200,
      cellRenderer: params => {
        return `${params.data.createdByFirstName} ${params.data.createdByLastName}`;
      }
    }
  ]);

  const onFilterTextBoxChanged = useCallback((event) => {
    setFilterText(event.target.value);
    gridRef.current.api.setQuickFilter(event.target.value);
  }, []);

  const gridOptions = {
    defaultColDef: {
      cellStyle: { whiteSpace: 'normal' },
      autoHeight: true,
      filterParams: {
        defaultOption: 'contains',
        caseSensitive: false
      }
    },
    quickFilterText: filterText
  };

  return (
    <div>
      <div>
        <h3>Group Modification Logs</h3>
        <br />
        <div>
          <Col md="3" sm="12" className="mb-1">
            <Label className="form-label" for="filter-text-box">
              Search
            </Label>
            <Input
              type="text"
              id="filter-text-box"
              value={filterText}
              onChange={onFilterTextBoxChanged}
              placeholder="Filter..."
            />
          </Col>
        </div>

        <div className="ag-theme-alpine" style={{ height: '693px', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={logData}
            columnDefs={columnDefs1}
            animateRows={true}
            rowSelection='multiple'
            pagination={true}
            paginationPageSize={10}
            gridOptions={gridOptions}
            headerColor="ddw-primary"
          />
        </div>
        <br />
      </div>
    </div>
  );
};

export default GroupModificationLogs;
