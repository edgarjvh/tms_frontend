import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CustomerImport.css';
import { useTransition, animated } from 'react-spring';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import {
    setCompanyOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
} from './../../../../actions';
import moment from 'moment';
import * as XLSX from 'xlsx';
import classNames from 'classnames';

const CarrierImport = (props) => {
    const refInputFile = useRef();

    const [isLoading, setIsLoading] = useState(false);
    const [customerList, setCustomerList] = useState([]);
    const [customerTotalListLength, setCustomerTotalListLength] = useState(0);
    const [customerCurrentListLength, setCustomerCurrentListLength] = useState(0);
    const [customersShown, setCustomersShown] = useState([]);
    const [currentCustomers, setCurrentCustomers] = useState([]);
    const [duplicatesShown, setDuplicatesShown] = useState(false);

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: isLoading,
    });

    const inputFileChange = (e) => {
        let file = e.target.files[0];
        const maxSize = 104857600;

        if (FileReader && file) {
            if (file.size > maxSize) {
                window.alert("Selected file is too large, please select a file below 100mb");
                refInputFile.current.value = '';
                return;
            }

            const promise = new Promise((resolve, reject) => {
                setIsLoading(false);
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);

                fileReader.onload = (e) => {
                    const bufferArray = e.target.result;

                    const wb = XLSX.read(bufferArray, { type: 'buffer' });

                    const wsname = wb.SheetNames[0];

                    const ws = wb.Sheets[wsname];

                    const data = XLSX.utils.sheet_to_json(ws);

                    resolve(data);
                }

                fileReader.onerror = (error) => {
                    reject(error);
                }
            });

            promise.then(res => {
                new Promise((resolve, reject) => {
                    axios.post(props.serverUrl + '/customers', { with_relations: 0 }).then(customers => {

                        setCurrentCustomers(customers.data.customers);
                        resolve(customers.data.customers);
                    }).catch(e => {
                        reject(e);
                    })
                }).then(customers => {
                    let list = (res || []).map((item) => {
                        let code = item[Object.keys(item).find(key => key.toLowerCase() === 'code')] || '';
                        let codeNumber = 0;

                        if (code !== '') {
                            codeNumber = code.length > 7 ? code.substring(7) : 0;
                            code = code.substring(0, 7);
                        }

                        let name = item[Object.keys(item).find(key => key.toLowerCase() === 'name')] || '';
                        let address1 = item[Object.keys(item).find(key => key.toLowerCase() === 'address1')] || '';
                        let address2 = item[Object.keys(item).find(key => key.toLowerCase() === 'address2')] || '';
                        let city = item[Object.keys(item).find(key => key.toLowerCase() === 'city')] || '';
                        let state = (item[Object.keys(item).find(key => key.toLowerCase() === 'state')] || '').toUpperCase();
                        let zip = item[Object.keys(item).find(key => key.toLowerCase() === 'zip')] || '';
                        let contact = item[Object.keys(item).find(key => key.toLowerCase() === 'contact')] || '';
                        let phone = ((item[Object.keys(item).find(key => key.toLowerCase() === 'phone')] || '').match(/\d+/g) || []).join('');
                        let ext = '';
                        let email = (item[Object.keys(item).find(key => key.toLowerCase() === 'email')] || '').toLowerCase();

                        let hours = (item[Object.keys(item).find(key => key.toLowerCase() === 'hours')] || '').toString();

                        let hoursOpen = '';
                        let hoursClose = '';

                        if (hours.trim().length === 4){
                            hoursOpen = hours.trim();
                        }else if(hours.trim().length === 9){
                            hoursOpen = hours.trim().substring(0,4);
                            hoursClose = hours.trim().substring(5);
                        }

                        let billToCode = (item[Object.keys(item).find(key => key.toLowerCase() === 'bill_to_code')] || '').toUpperCase();
                        let billToCodeNumber = 0;

                        if (billToCode !== '') {
                            billToCodeNumber = billToCode.length > 7 ? billToCode.substring(7) : 0;
                            billToCode = billToCode.substring(0, 7);
                        }

                        let zipLengthMissing = 5 - zip.length;

                        if (zipLengthMissing > 0 && zipLengthMissing < 5) {
                            let padZeros = '';

                            for (let i = 0; i < zipLengthMissing; i++) {
                                padZeros += '0';
                            }

                            zip = padZeros + zip;
                        }

                        if (phone.length > 10) {
                            ext = phone.slice(10);
                            phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6, 10);
                        } else if (phone.length > 6) {
                            phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                        } else if (phone.length > 3) {
                            phone = phone.slice(0, 3) + '-' + phone.slice(3);
                        }

                        let contactNameSplitted = contact.split(' ');
                        let contactFirstName = contactNameSplitted[0];
                        let contactLastName = '';

                        if (contactNameSplitted.length > 0){
                            for(let i = 1; i < contactNameSplitted.length; i++){
                                contactLastName += contactNameSplitted[i] + ' ';
                            }
                        }

                        contactLastName = contactLastName.trim();

                        item = {
                            code: code,
                            codeNumber: codeNumber,
                            name: name,
                            address1: address1,
                            address2: address2,
                            city: city,
                            state: state,
                            zip: zip,
                            contact: contact,
                            contactFirstName: contactFirstName,
                            contactLastName: contactLastName,
                            phone: phone,
                            ext: ext,
                            email: email,
                            hoursOpen: hoursOpen,
                            hoursClose: hoursClose,
                            billToCode: billToCode,
                            billToCodeNumber: billToCodeNumber                          
                        }

                        return item;
                    })
                    
                    setCustomerTotalListLength(list.length);
                    setCustomerList(list);
                    console.log(list);
                    refInputFile.current.value = '';
                    setIsLoading(false);
                }).catch(err => {
                    console.log(err);
                    setIsLoading(false);
                })
            });

            promise.catch(err => {
                console.log('error reading file', err);
                setIsLoading(false);
                refInputFile.current.value = '';
            });
        }
    }

    const submitImport = () => {
        if (window.confirm('Are you sure you want to proceed?')) {            
            setIsLoading(true);
            processSubmit();            
        }
    }

    const processSubmit = () => {
        if (customerList.length) {
            axios.post(props.serverUrl + '/submitCustomerImport2', {list: customerList}).then(res => {
                console.log(customerTotalListLength, customerList.length, res.data)
            }).catch(e => {
                console.log(customerList.length, e)
            }).finally(() => {
                setIsLoading(false);
                setCustomerList([]);
                refInputFile.current.value = "";
            })
        } else {
            setIsLoading(false);
        }
    }

    const submitBtnClasses = classNames({
        'mochi-button': true,
        'disabled': false
    })

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style} >
                        <div className="loading-container-wrapper" style={{ flexDirection: 'column' }}>
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                            {/* <div style={{
                                position: 'relative',
                                width: '90%',
                                maxWidth: '600px',
                                height: 15,
                                borderRadius: 10,
                                overflow: 'hidden',
                                marginTop: 15,
                                display: 'flex',
                                backgroundColor: 'lightgray',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <div style={{fontSize: '12px', zIndex: 1}}>{customerCurrentListLength} of {customerTotalListLength} | {Math.floor((customerCurrentListLength / customerTotalListLength) * 100)}%</div>
                                <div style={{
                                    background: 'linear-gradient(to bottom, rgba(122,188,255,1) 0%,rgba(96,171,248,1) 50%,rgba(64,150,238,1) 100%)',
                                    position: 'absolute',
                                    height: '100%',
                                    top: 0,
                                    left: 0,
                                    width: (Math.floor((customerCurrentListLength / customerTotalListLength) * 100)) + '%'
                                }}></div>
                            </div> */}
                        </div>
                    </animated.div>
                )
            }

            <div className="import-buttons">
                <form encType='multipart/form-data' style={{ display: 'none' }}>
                    <input type="file" ref={refInputFile} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={inputFileChange} />
                </form>

                <div>
                    <div className="mochi-button" onClick={() => {
                        refInputFile.current.click();
                    }} style={{ marginRight: 10 }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Select File</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>

                    <div className="mochi-button" onClick={() => {
                        setCustomerList([]);
                        setCurrentCustomers([]);
                        refInputFile.current.value = "";
                    }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Clear</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>

                    {/* <div className="input-checkbox">
                        <input type="checkbox" id='cbox-duplicates-shown' onChange={(e) => {
                            setDuplicatesShown(e.target.checked);
                        }} checked={duplicatesShown}/>
                        <label htmlFor="cbox-duplicates-shown">Show duplicates only</label>
                    </div> */}
                </div>

                <div>
                    <div className={submitBtnClasses} onClick={() => {
                        submitImport();
                    }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Submit</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                </div>
            </div>

            <div className="form-bordered-box import" style={{
                marginTop: 10,
                marginBottom: 10
            }}>
                <div className="form-header">
                    <div className="top-border top-border-left"></div>
                    <div className="top-border top-border-middle"></div>
                    <div className="top-border top-border-right"></div>
                </div>

                <div className="import-body">
                    {
                        (customerList || []).length === 0
                            ? (
                                <div className="import-body-wrapper">
                                    <div className="import-header" style={{ width: '130%' }}>
                                        <div className="import-header-wrapper">
                                            <div className="trow">                                               
                                                <div className="tcol code">Code</div>
                                                <div className="tcol name">Name</div>
                                                <div className="tcol address1">Address 1</div>
                                                <div className="tcol address2">Address 2</div>
                                                <div className="tcol city">City</div>
                                                <div className="tcol state">State</div>
                                                <div className="tcol zip">Zip</div>
                                                <div className="tcol contact">Contact</div>
                                                <div className="tcol phone">Phone</div>
                                                <div className="tcol ext">Ext</div>
                                                <div className="tcol email">Email</div>                                                
                                                <div className="tcol code">Bill To</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )

                            : (
                                <div className="import-body-wrapper">
                                    <div className="import-header" style={{ display: 'table-row' }}>
                                        <div className="import-header-wrapper">
                                            <div className="trow">                                                
                                                <div className="tcol code">Code</div>
                                                <div className="tcol name">Name</div>
                                                <div className="tcol address1">Address 1</div>
                                                <div className="tcol address2">Address 2</div>
                                                <div className="tcol city">City</div>
                                                <div className="tcol state">State</div>
                                                <div className="tcol zip">Zip</div>
                                                <div className="tcol contact">Contact</div>
                                                <div className="tcol phone">Phone</div>
                                                <div className="tcol ext">Ext</div>
                                                <div className="tcol email">Email</div>                                                
                                                <div className="tcol code">Bill To</div>
                                                
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        customerList.map((customer, index) => {

                                            // let parseCity = customer.city.toLowerCase().trim().replace(/\s/g, "").substring(0, 3);

                                            // if (parseCity.toLowerCase() === "ft.") {
                                            //     parseCity = "FO";
                                            // }
                                            // if (parseCity.toLowerCase() === "mt.") {
                                            //     parseCity = "MO";
                                            // }
                                            // if (parseCity.toLowerCase() === "st.") {
                                            //     parseCity = "SA";
                                            // }

                                            // const code = ((customer.name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (customer.state || '').trim().replace(/\s/g, "").substring(0, 2)).toUpperCase();

                                            // customer.matches = currentCustomers.filter(cus => cus.code.toUpperCase() === code);

                                            const rowContainerClasses = classNames({
                                                'row-container': true,
                                                'hidden': false,
                                                'hidden': false
                                            });

                                            const rowClasses = classNames({
                                                'trow': true,
                                                'save': true
                                            })

                                            const matchesContainerClasses = classNames({
                                                'matches-container': true,
                                                'shown': false
                                            })

                                            return (
                                                <div className={rowContainerClasses} key={index}>
                                                    <div className={rowClasses}>
                                                        <div className="tcol code">
                                                            <input type="text"
                                                                onChange={(e) => { }}
                                                                value={(customer.code + (customer.codeNumber === 0 ? '' : customer.codeNumber)) || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol name">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCustomerList(customerList => {
                                                                        return customerList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.name = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={customer.name || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol address1">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCustomerList(customerList => {
                                                                        return customerList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.address1 = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={customer.address1 || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol address2">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCustomerList(customerList => {
                                                                        return customerList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.address2 = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={customer.address2 || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol city">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCustomerList(customerList => {
                                                                        return customerList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.city = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={customer.city || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol state">
                                                            <input type="text"
                                                                maxLength={2}
                                                                onChange={(e) => {
                                                                    setCustomerList(customerList => {
                                                                        return customerList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.state = e.target.value.toUpperCase();
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={customer.state || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol zip">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCustomerList(customerList => {
                                                                        return customerList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.zip = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={customer.zip || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol contact">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCustomerList(customerList => {
                                                                        return customerList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.contact = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={customer.contact || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol phone">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCustomerList(customerList => {
                                                                        return customerList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.phone = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={customer.phone || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol ext">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCustomerList(customerList => {
                                                                        return customerList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.ext = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={customer.ext || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol email">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCustomerList(customerList => {
                                                                        return customerList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.email = e.target.value.toLowerCase();
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={customer.email || ''}
                                                            />
                                                        </div>

                                                        <div className="tcol code">
                                                            <input type="text" data-value={(customer.billToCode || '') + (customer.billToCodeNumber > 0 ? customer.billToCodeNumber : '')}
                                                                onChange={(e) => { }}
                                                                value={(customer.billToCode || '') + (customer.billToCodeNumber > 0 ? customer.billToCodeNumber : '')}
                                                            />
                                                        </div>

                                                        
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        companyOpenedPanels: state.companyReducers.companyOpenedPanels,
        adminOpenedPanels: state.adminReducers.adminOpenedPanels,
        dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
        customerOpenedPanels: state.customerReducers.customerOpenedPanels,
        adminCustomerOpenedPanels: state.customerReducers.adminCustomerOpenedPanels,
        adminCarrierOpenedPanels: state.carrierReducers.adminCarrierOpenedPanels,
        loadBoardOpenedPanels: state.loadBoardReducers.loadBoardOpenedPanels,
        invoiceOpenedPanels: state.invoiceReducers.invoiceOpenedPanels,
    }
}

export default connect(mapStateToProps, {
    setCompanyOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
})(CarrierImport)