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
    setCompanyOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
} from './../../../../actions';

import * as XLSX from 'xlsx';
import classNames from 'classnames';

const CustomerImport = (props) => {
    const refInputFile = useRef();

    const [isLoading, setIsLoading] = useState(false);
    const [carrierList, setCarrierList] = useState([]);
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
                        let fid = item[Object.keys(item).find(key => ['fid', 'federalid'].includes(key.toLowerCase()) )] || '';
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

                        // let parseCity = city.toLowerCase().trim().replace(/\s/g, "").substring(0, 3);

                        // if (parseCity.toLowerCase() === "ft.") {
                        //     parseCity = "FO";
                        // }
                        // if (parseCity.toLowerCase() === "mt.") {
                        //     parseCity = "MO";
                        // }
                        // if (parseCity.toLowerCase() === "st.") {
                        //     parseCity = "SA";
                        // }

                        // code = ((name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (state || '').trim().replace(/\s/g, "").substring(0, 2)).toUpperCase();

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
                            phone: phone,
                            ext: ext,
                            email: email,
                            mcNumber: mcNumber,
                            dotNumber: dotNumber,
                            scac: scac,
                            fid: fid,
                            doNotUse: doNotUse,
                            showMatches: false,
                            save: carriers.filter(car => car.code.toUpperCase() === code).length === 0,
                            matches: []
                        }

                        return item;
                    })

                    setCarrierTotalListLength(list.length);
                    setCarrierList(list);
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
        if (carrierList.length) {
            axios.post(props.serverUrl + '/submitCarrierImport', {
                code: carrierList[0].code,
                codeNumber: carrierList[0].codeNumber,
                name: carrierList[0].name,
                address1: carrierList[0].address1,
                address2: carrierList[0].address2,
                city: carrierList[0].city,
                state: carrierList[0].state,
                zip: carrierList[0].zip,
                contact: carrierList[0].contact,
                phone: carrierList[0].phone,
                ext: carrierList[0].ext,
                email: carrierList[0].email,
                mcNumber: carrierList[0].mcNumber,
                dotNumber: carrierList[0].dotNumber,
                scac: carrierList[0].scac,
                fid: carrierList[0].fid,
                doNotUse: carrierList[0].doNotUse
            }).then(res => {
                console.log(carrierList.length, res.data)
            }).catch(e => {
                console.log(carrierList.length, e)
            }).finally(() => {
                carrierList.shift();
                setCarrierCurrentListLength(carrierTotalListLength - carrierList.length);
                processSubmit();
            })
        } else {
            setIsLoading(false);
        }
    }

    const submitBtnClasses = classNames({
        'mochi-button': true,
        'disabled': carrierList.length === 0 || carrierList.filter(c => c.save).length === 0
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
                            <div style={{
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
                                <div style={{fontSize: '12px', zIndex: 1}}>{carrierCurrentListLength} of {carrierTotalListLength} | {Math.floor((carrierCurrentListLength / carrierTotalListLength) * 100)}%</div>
                                <div style={{
                                    background: 'linear-gradient(to bottom, rgba(122,188,255,1) 0%,rgba(96,171,248,1) 50%,rgba(64,150,238,1) 100%)',
                                    position: 'absolute',
                                    height: '100%',
                                    top: 0,
                                    left: 0,
                                    width: (Math.floor((carrierCurrentListLength / carrierTotalListLength) * 100)) + '%'
                                }}></div>
                            </div>
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
                        (carrierList || []).length === 0
                            ? (
                                <div className="import-body-wrapper">
                                    <div className="import-header" style={{ width: '170%' }}>
                                        <div className="import-header-wrapper">
                                            <div className="trow">
                                                <div className="tcol status">Status</div>
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
                                                <div className="tcol status">Status</div>
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

                                            // let parseCity = carrier.city.toLowerCase().trim().replace(/\s/g, "").substring(0, 3);

                                            // if (parseCity.toLowerCase() === "ft.") {
                                            //     parseCity = "FO";
                                            // }
                                            // if (parseCity.toLowerCase() === "mt.") {
                                            //     parseCity = "MO";
                                            // }
                                            // if (parseCity.toLowerCase() === "st.") {
                                            //     parseCity = "SA";
                                            // }

                                            // const code = ((carrier.name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (carrier.state || '').trim().replace(/\s/g, "").substring(0, 2)).toUpperCase();

                                            // carrier.matches = currentCarriers.filter(cus => cus.code.toUpperCase() === code);

                                            const rowContainerClasses = classNames({
                                                'row-container': true,
                                                'hidden': false,
                                                'hidden': duplicatesShown && (carrier.matches || []).length === 0
                                            });

                                            const rowClasses = classNames({
                                                'trow': true,
                                                'save': carrier.save
                                            })

                                            const matchesContainerClasses = classNames({
                                                'matches-container': true,
                                                'shown': carrier.showMatches
                                            })

                                            return (
                                                <div className={rowContainerClasses} key={index}>
                                                    <div className={rowClasses}>
                                                        <div className="tcol status" onClick={() => {

                                                        }}>
                                                            <span><label htmlFor={'cbox-' + index}>Save</label></span>


                                                            <input
                                                                id={'cbox-' + index}
                                                                name={'cbox-' + index}
                                                                value={'Save'}
                                                                type="checkbox"
                                                                checked={carrier.save}
                                                                onChange={(e) => {
                                                                    setCarrierList(carrierList.map((item, i) => {
                                                                        if (i === index) {
                                                                            item.save = e.target.checked
                                                                        }

                                                                        return item;
                                                                    }))
                                                                }} />
                                                            <div className="separator"></div>

                                                            {
                                                                carrier.matches.length > 0 &&
                                                                <FontAwesomeIcon className='show-matches-btn' icon={carrier.showMatches ? faCaretUp : faCaretDown} onClick={() => {
                                                                    setCarrierList(carrierList => {
                                                                        return carrierList.map((item, i) => {
                                                                            if (i === index) {
                                                                                item.showMatches = !item.showMatches;
                                                                            }

                                                                            return item;
                                                                        })
                                                                    })
                                                                }} />
                                                            }
                                                        </div>

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

                                                    {
                                                        carrier.matches.length > 0 &&
                                                        <div className={matchesContainerClasses}>
                                                            {
                                                                (carrier.matches || []).map((item, index) => {
                                                                    const contact = (item.contacts || []).find(c => c.is_primary === 1) || {}

                                                                    const contactPhone = contact.primary_phone === 'work'
                                                                        ? contact.phone_work
                                                                        : contact.primary_phone === 'fax'
                                                                            ? contact.phone_work_fax
                                                                            : contact.primary_phone === 'mobile'
                                                                                ? contact.phone_mobile
                                                                                : contact.primary_phone === 'direct'
                                                                                    ? contact.phone_direct
                                                                                    : contact.primary_phone === 'other'
                                                                                        ? contact.phone_other
                                                                                        : ''

                                                                    const contactEmail = contact.primary_email === 'work'
                                                                        ? contact.email_work
                                                                        : contact.primary_email === 'personal'
                                                                            ? contact.email_personal
                                                                            : contact.primary_email === 'other'
                                                                                ? contact.email_other
                                                                                : ''

                                                                    return (
                                                                        <div className="trow" key={index}>
                                                                            <div className="tcol status"></div>
                                                                            <div className="tcol code">{item.code}{item.code_number > 0 ? item.code_number : ''}</div>
                                                                            <div className="tcol name">{item.name}</div>
                                                                            <div className="tcol address1">{item.address1}</div>
                                                                            <div className="tcol address2">{item.address2}</div>
                                                                            <div className="tcol city">{item.city}</div>
                                                                            <div className="tcol state">{item.state}</div>
                                                                            <div className="tcol zip">{item.zip}</div>
                                                                            <div className="tcol contact">{contact.first_name || ''} {contact.last_name || ''}</div>
                                                                            <div className="tcol phone">{contactPhone || ''}</div>
                                                                            <div className="tcol ext">{contact.phone_ext}</div>
                                                                            <div className="tcol email">{contactEmail}</div>
                                                                            <div className="tcol mcnumber">{item.mc_number}</div>
                                                                            <div className="tcol dotnumber">{item.dot_number}</div>
                                                                            <div className="tcol scac">{item.scac}</div>
                                                                            <div className="tcol fid">{item.fid}</div>
                                                                            <div className="tcol donotuse">{item.do_not_use > 0 ? 'Y' : 'N'}</div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    }

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
})(CustomerImport)