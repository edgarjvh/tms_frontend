/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CarrierImport.css';
import { useTransition, animated } from 'react-spring';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import {
    setAdminHomePanels,
    setCompanyHomePanels,
    setAdminCarrierPanels,
    setCompanyCarrierPanels,
    setAdminCompanySetupPanels,
    setCompanyCompanySetupPanels,
    setAdminCustomerPanels,
    setCompanyCustomerPanels,
    setAdminDispatchPanels,
    setCompanyDispatchPanels,
    setAdminInvoicePanels,
    setCompanyInvoicePanels,
    setAdminLoadBoardPanels,
    setCompanyLoadBoardPanels,
    setAdminReportPanels,
    setCompanyReportPanels,

} from './../../../../actions';

import * as XLSX from 'xlsx';
import classNames from 'classnames';

const CustomerImport = (props) => {
    const refCarrierImportContainer = useRef();
    const refInputFile = useRef();

    const [isLoading, setIsLoading] = useState(false);
    const [carrierList, setCarrierList] = useState([]);
    const [groupOrderList, setGroupOrderList] = useState([]);
    const [carrierTotalListLength, setCarrierTotalListLength] = useState(0);
    const [carrierCurrentListLength, setCarrierCurrentListLength] = useState(0);
    const [customersShown, setCustomersShown] = useState([]);
    const [currentCarriers, setCurrentCarriers] = useState([]);
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
                    axios.post(props.serverUrl + '/carriers', { with_relations: 0 }).then(carriers => {

                        setCurrentCarriers(carriers.data.carriers);
                        resolve(carriers.data.carriers);
                    }).catch(e => {
                        reject(e);
                    })
                }).then(carriers => {
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
                        let mcNumber = item[Object.keys(item).find(key => ['mcnumber', 'mc_number'].includes(key.toLowerCase()))] || '';
                        let dotNumber = item[Object.keys(item).find(key => ['dotnumber', 'dot_number'].includes(key.toLowerCase()))] || '';
                        let scac = item[Object.keys(item).find(key => key.toLowerCase() === 'scac')] || '';
                        let fid = item[Object.keys(item).find(key => ['fid', 'federalid'].includes(key.toLowerCase()))] || '';
                        let doNotUse = (item[Object.keys(item).find(key => ['donotuse', 'do_not_use'].includes(key.toLowerCase()))] || 0) === 'Y' ? 1 : 0;

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

                        if (contactNameSplitted.length > 0) {
                            for (let i = 1; i < contactNameSplitted.length; i++) {
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
                            mcNumber: mcNumber,
                            dotNumber: dotNumber,
                            scac: scac,
                            fid: fid,
                            doNotUse: doNotUse
                        }

                        return item;
                    })

                    setCarrierTotalListLength(list.length);
                    setCarrierList(list);
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

            if (carrierList.length > 0) {
                let listToSend = carrierList.map(item => {
                    return item;
                });

                const chunkSize = 500;

                setGroupOrderList(listToSend.map((e, i) => {
                    return i % chunkSize === 0 ? listToSend.slice(i, i + chunkSize) : null;
                }).filter(e => { return e; }));
            }
        }
    }

    const processSubmit = () => {
        if (groupOrderList.length) {
            axios.post(props.serverUrl + '/submitCarrierImport2', { list: groupOrderList[0] }).then(res => {
                console.log(res.data);
            }).catch(e => {

            }).finally(() => {
                groupOrderList.shift();
                processSubmit();
            })
        } else {
            setIsLoading(false);
            setCarrierList([]);
            refInputFile.current.value = "";
        }
    }

    useEffect(() => {
        refCarrierImportContainer.current.focus({
            preventScroll: true
        })
    }, []);

    useEffect(() => {
        if (groupOrderList.length > 0) {
            processSubmit();
        }
    }, [groupOrderList]);

    const submitBtnClasses = classNames({
        'mochi-button': true,
        'disabled': false
    })

    const openPanel = (panel, origin) => {
        if (origin === 'admin-home') {
            if (props.adminHomePanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminHomePanels([...props.adminHomePanels, panel]);
            }
        }

        if (origin === 'admin-carrier') {
            if (props.adminCarrierPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminCarrierPanels([...props.adminCarrierPanels, panel]);
            }
        }

        if (origin === 'admin-company-setup') {
            if (props.adminCompanySetupPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminCompanySetupPanels([...props.adminCompanySetupPanels, panel]);
            }
        }

        if (origin === 'admin-customer') {
            if (props.adminCustomerPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminCustomerPanels([...props.adminCustomerPanels, panel]);
            }
        }

        if (origin === 'admin-dispatch') {
            if (props.adminDispatchPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminDispatchPanels([...props.adminDispatchPanels, panel]);
            }
        }

        if (origin === 'admin-invoice') {
            if (props.adminInvoicePanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminInvoicePanels([...props.adminInvoicePanels, panel]);
            }
        }

        if (origin === 'admin-report') {
            if (props.adminReportPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminReportPanels([...props.adminReportPanels, panel]);
            }
        }

        if (origin === 'company-home') {
            if (props.companyHomePanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyHomePanels([...props.companyHomePanels, panel]);
            }
        }

        if (origin === 'company-carrier') {
            if (props.companyCarrierPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyCarrierPanels([...props.companyCarrierPanels, panel]);
            }
        }

        if (origin === 'company-customer') {
            if (props.companyCustomerPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyCustomerPanels([...props.companyCustomerPanels, panel]);
            }
        }

        if (origin === 'company-dispatch') {
            if (props.companyDispatchPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyDispatchPanels([...props.companyDispatchPanels, panel]);
            }
        }

        if (origin === 'company-invoice') {
            if (props.companyInvoicePanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyInvoicePanels([...props.companyInvoicePanels, panel]);
            }
        }

        if (origin === 'company-load-board') {
            if (props.companyLoadBoardPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyLoadBoardPanels([...props.companyLoadBoardPanels, panel]);
            }
        }

        if (origin === 'company-report') {
            if (props.companyReportPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyReportPanels([...props.companyReportPanels, panel]);
            }
        }
    }

    const closePanel = (panelName, origin) => {
        if (origin === 'admin-home') {
            props.setAdminHomePanels(props.adminHomePanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-carrier') {
            props.setAdminCarrierPanels(props.adminCarrierPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-company-setup') {
            props.setAdminCompanySetupPanels(props.adminCompanySetupPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-customer') {
            props.setAdminCustomerPanels(props.adminCustomerPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-dispatch') {
            props.setAdminDispatchPanels(props.adminDispatchPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-invoice') {
            props.setAdminInvoicePanels(props.adminInvoicePanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-report') {
            props.setAdminReportPanels(props.adminReportPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-home') {
            props.setCompanyHomePanels(props.companyHomePanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-carrier') {
            props.setCompanyCarrierPanels(props.companyCarrierPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-customer') {
            props.setCompanyCustomerPanels(props.companyCustomerPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-dispatch') {
            props.setCompanyDispatchPanels(props.companyDispatchPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-invoice') {
            props.setCompanyInvoicePanels(props.companyInvoicePanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-load-board') {
            props.setCompanyLoadBoardPanels(props.companyLoadBoardPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-report') {
            props.setCompanyReportPanels(props.companyReportPanels.filter(panel => panel.panelName !== panelName));
        }
    }

    return (
        <div className="panel-content" tabIndex={0} ref={refCarrierImportContainer}>
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>
            <div className="close-btn" title="Close" onClick={e => { props.closingCallback() }}><span className="fas fa-times"></span></div>
            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style} >
                        <div className="loading-container-wrapper" style={{ flexDirection: 'column' }}>
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                            
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
                        setCarrierList([]);
                        setCurrentCarriers([]);
                        refInputFile.current.value = "";
                    }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Clear</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
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
                        (carrierList || []).length === 0
                            ? (
                                <div className="import-body-wrapper">
                                    <div className="import-header" style={{ width: '170%' }}>
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
                                                <div className="tcol mcnumber">MC Number</div>
                                                <div className="tcol dotnumber">DOT Number</div>
                                                <div className="tcol scac">SCAC</div>
                                                <div className="tcol fid">FID</div>
                                                <div className="tcol donotuse">Do Not Use</div>
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
                                                <div className="tcol mcnumber">MC Number</div>
                                                <div className="tcol dotnumber">DOT Number</div>
                                                <div className="tcol scac">SCAC</div>
                                                <div className="tcol fid">FID</div>
                                                <div className="tcol donotuse">Do Not Use</div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        carrierList.map((carrier, index) => {

                                            const rowContainerClasses = classNames({
                                                'row-container': true,
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
                                                                value={carrier.code || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol name">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.name = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.name || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol address1">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.address1 = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.address1 || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol address2">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.address2 = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.address2 || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol city">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.city = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.city || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol state">
                                                            <input type="text"
                                                                maxLength={2}
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.state = e.target.value.toUpperCase();
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.state || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol zip">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.zip = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.zip || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol contact">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.contact = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.contact || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol phone">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.phone = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.phone || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol ext">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.ext = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.ext || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol email">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.email = e.target.value.toLowerCase();
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.email || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol mcnumber">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.mcNumber = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.mcNumber || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol dotnumber">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.dotNumber = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.dotNumber || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol scac">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.scac = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.scac || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol fid">
                                                            <input type="text"
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.fid = e.target.value;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.fid || ''}
                                                            />
                                                        </div>
                                                        <div className="tcol donotuse">
                                                            <input type="text"
                                                                maxLength={1}
                                                                onKeyDown={(e) => {
                                                                    let key = e.keyCode || e.which;

                                                                    if (key !== 78 && key !== 89) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.doNotUse = e.target.value.toUpperCase();
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }}
                                                                value={carrier.doNotUse === 0 ? 'N' : 'Y'}
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
        adminHomePanels: state.adminReducers.adminHomePanels,
        companyHomePanels: state.companyReducers.companyHomePanels,
        adminCompanySetupPanels: state.companySetupReducers.adminCompanySetupPanels,
        companyCompanySetupPanels: state.companySetupReducers.companyCompanySetupPanels,
        adminCarrierPanels: state.carrierReducers.adminCarrierPanels,
        companyCarrierPanels: state.carrierReducers.companyCarrierPanels,
        adminCustomerPanels: state.customerReducers.adminCustomerPanels,
        companyCustomerPanels: state.customerReducers.companyCustomerPanels,
        adminDispatchPanels: state.dispatchReducers.adminDispatchPanels,
        companyDispatchPanels: state.dispatchReducers.companyDispatchPanels,
        adminInvoicePanels: state.invoiceReducers.adminInvoicePanels,
        companyInvoicePanels: state.invoiceReducers.companyInvoicePanels,
        adminLoadBoardPanels: state.loadBoardReducers.adminLoadBoardPanels,
        companyLoadBoardPanels: state.loadBoardReducers.companyLoadBoardPanels,
        adminReportPanels: state.reportReducers.adminReportPanels,
        companyReportPanels: state.reportReducers.companyReportPanels,

    }
}

export default connect(mapStateToProps, {
    setAdminHomePanels,
    setCompanyHomePanels,
    setAdminCarrierPanels,
    setCompanyCarrierPanels,
    setAdminCompanySetupPanels,
    setCompanyCompanySetupPanels,
    setAdminCustomerPanels,
    setCompanyCustomerPanels,
    setAdminDispatchPanels,
    setCompanyDispatchPanels,
    setAdminInvoicePanels,
    setCompanyInvoicePanels,
    setAdminLoadBoardPanels,
    setCompanyLoadBoardPanels,
    setAdminReportPanels,
    setCompanyReportPanels,

})(CustomerImport)