import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import axios from 'axios';
import Draggable from 'react-draggable';
import { useTransition, animated } from 'react-spring';
import './CompanyDrivers.css';
import MaskedInput from 'react-text-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCalendarAlt, faCheck, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import Highlighter from "react-highlight-words";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import {
    MainForm,
    MailingAddressForm,
    EmergencyContactForm,
    EmergencyContactList
} from './../../../company/forms'

import {
    SelectBox
} from './../../../controls';

const CompanyDrivers = (props) => {
    const refDriverInfoCode = useRef();
    const refDriverInfoName = useRef();
    const refDriverInfoEmail = useRef();

    const refMailingCode = useRef();
    const refMailingName = useRef();
    const refMailingContactName = useRef();
    const refMailingContactNameDropDown = useRef();
    const refMailingContactNamePopupItems = useRef();
    const refMailingContactPhone = useRef();
    const refMailingContactPhonePopupItems = useRef();
    const refMailingContactEmail = useRef();
    const refMailingContactEmailPopupItems = useRef();
    const refCustomerMailingName = useRef();
    const refEmergencyContactName = useRef();
    const refEmergencyContactEmail = useRef();
    const refEmergencyContactSearchFirstName = useRef();
    const refDriverLicenseNumber = useRef();
    const refEndorsements = useRef();
    const refEndorsementItems = useRef();
    const refEndorsementPopupItems = useRef();
    const refEndorsementDropdown = useRef();

    const [selectedDriver, setSelectedDriver] = useState({});
    const [selectedEmergencyContact, setSelectedEmergencyContact] = useState({});
    const [showingEmergencyContactList, setShowingEmergencyContactList] = useState(true);

    const [endorsementItems, setEndorsementItems] = useState([
        'P', 'H', 'N', 'T', 'X', 'S'
    ]);

    useEffect(() => {
        refDriverInfoCode.current.focus({
            preventScroll: true
        });
    }, [])

    const setInitialValues = () => {

    }

    const searchDriverInfoByCode = () => {

    }

    const validateDriverInfoForSaving = () => {

    }

    const validateMailingAddressForSaving = () => {

    }

    const remitToAddressBtn = () => {

    }

    const mailingAddressClearBtn = () => {

    }

    const validateEmergencyContactForSaving = () => {

    }

    const searchEmergencyContactBtnClick = () => {

    }

    const emergencyContactItemDoubleClick = () => {

    }

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div>
            <div className="side-title">
                <div>{props.title}</div>
            </div>

            <div className="company-driver-container">
                <MainForm
                    formTitle='Driver info'
                    formButtons={[
                        {
                            title: 'Search',
                            onClick: () => {

                            },
                            isEnabled: true
                        },
                        {
                            title: 'Clear',
                            onClick: () => {
                                setInitialValues();
                                refDriverInfoCode.current.focus();
                            },
                            isEnabled: true
                        },
                    ]}
                    refs={{
                        refCode: refDriverInfoCode,
                        refName: refDriverInfoName,
                        refEmail: refDriverInfoEmail
                    }}
                    tabTimesFrom={1}
                    tabTimes={props.tabTimes}
                    searchByCode={searchDriverInfoByCode}
                    validateForSaving={validateDriverInfoForSaving}
                    selectedParent={selectedDriver}
                    setSelectedParent={setSelectedDriver}

                    withEmail={0}
                />

                <div className='form-bordered-box drivers-license-info'>
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Driver's License Info</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className="mochi-button" onClick={() => {

                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Add Document</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className="form-col" style={{ flexGrow: 1 }}>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={props.tabTimesFrom + props.tabTimes + 1} type="text" placeholder="Driver License Number"
                                    style={{
                                        textTransform: 'capitalize'
                                    }}
                                    ref={refDriverLicenseNumber}
                                    onChange={e => {
                                        setSelectedDriver({
                                            ...selectedDriver,
                                            driverLicenseNumber: e.target.value
                                        })
                                    }}
                                    value={selectedDriver?.driverLicenseNumber || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container state">
                                <input tabIndex={props.tabTimesFrom + props.tabTimes + 2} type="text" placeholder="State" maxLength={2}
                                    style={{
                                        textTransform: 'uppercase'
                                    }}
                                    onChange={e => {
                                        setSelectedDriver({
                                            ...selectedDriver,
                                            state: e.target.value
                                        })
                                    }}
                                    value={selectedDriver?.state || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            {/* <SelectBox
                                placeholder='Endorsements'
                                tabIndex={3 + props.tabTimes}
                                refs={{
                                    refInput: refEndorsements,
                                    refItems: refEndorsementItems,
                                    refPopupItems: refEndorsementPopupItems,
                                    refDropdown: refEndorsementDropdown
                                }}
                                isAdmin={1}
                                getItems={() => { }}
                                setItems={setEndorsementItems}
                                items={endorsementItems}

                                onEnter={async () => {
                                    if (endorsementItems.length > 0 && endorsementItems.findIndex((item) => item.selected) > -1) {
                                        await setSelectedDriver(prev => {
                                            return {
                                                ...prev,
                                                endorsments: endorsementItems[endorsementItems.findIndex((item) => item.selected)]
                                            }
                                        })

                                        setEndorsementItems([]);
                                        refEndorsements.current.focus();
                                    }
                                }}

                                onTab={async () => {
                                    if (endorsementItems.length > 0 && endorsementItems.findIndex((item) => item.selected) > -1) {
                                        await setSelectedDriver(prev => {
                                            return {
                                                ...(prev) || {},
                                                endorsments: endorsementItems[endorsementItems.findIndex((item) => item.selected)]
                                            }
                                        })

                                        setEndorsementItems([]);
                                        refEndorsements.current.focus();
                                    }
                                }}

                                onBlur={async () => {
                                    if (!endorsementItems.includes(selectedDriver?.endorsments || '')) {
                                        await setSelectedDriver(prev => {
                                            return {
                                                ...(prev) || {},
                                                endorsments: null
                                            }
                                        })
                                    }
                                }}

                                onInput={async (e) => {
                                    await setSelectedDriver(prev => {
                                        return {
                                            ...(prev) || {},
                                            endorsments: e.target.value.trim()
                                        }
                                    })                                    

                                    // let division = selectedCustomer?.division || {};

                                    // division.id = 0;
                                    // division.name = e.target.value;

                                    // await setSelectedCustomer(selectedCustomer => {
                                    //     return {
                                    //         ...selectedCustomer,
                                    //         division: division,
                                    //         division_id: division.id
                                    //     }
                                    // })

                                    // if (e.target.value.trim() === "") {
                                    //     props.setItems([]);
                                    // } else {
                                    //     axios.post(props.serverUrl + "/getDivisions", { name: e.target.value.trim() }).then(async (res) => {
                                    //         if (res.data.result === "OK") {
                                    //             await props.setItems(
                                    //                 res.data.divisions.map((item, index) => {
                                    //                     item.selected = (selectedCustomer?.division?.id || 0) === 0
                                    //                         ? index === 0
                                    //                         : item.id === selectedCustomer.division.id;
                                    //                     return item;
                                    //                 })
                                    //             );
                                    //         }
                                    //     }).catch(async (e) => {
                                    //         console.log("error getting divisions", e);
                                    //     });
                                    // }
                                }}

                                onChange={async (e) => {
                                    await setSelectedDriver(prev => {
                                        return {
                                            ...(prev) || {},
                                            endorsments: e.target.value.trim()
                                        }
                                    })
                                }}

                                onDropdownClick={() => {


                                    // if (props.items.length > 0) {
                                    //     props.setItems([]);
                                    // } else {
                                    //     if ((selectedCustomer?.division?.id || 0) === 0 && (selectedCustomer?.division?.name || "") !== "") {
                                    //         axios.post(props.serverUrl + "/getDivisions", { name: selectedCustomer.division.name }).then(async (res) => {
                                    //             if (res.data.result === "OK") {
                                    //                 await props.setItems(res.data.divisions.map((item, index) => {
                                    //                     item.selected = (selectedCustomer?.division?.id || 0) === 0
                                    //                         ? index === 0
                                    //                         : item.id === selectedCustomer.division.id;
                                    //                     return item;
                                    //                 }));
        
                                    //                 refPopupItems.current.map((r, i) => {
                                    //                     if (r && r.classList.contains("selected")) {
                                    //                         r.scrollIntoView({
                                    //                             behavior: "auto",
                                    //                             block: "center",
                                    //                             inline: "nearest",
                                    //                         });
                                    //                     }
                                    //                     return true;
                                    //                 });
                                    //             }
                                    //         }).catch(async (e) => {
                                    //             console.log("error getting divisions", e);
                                    //         });
                                    //     } else {
                                    //         axios.post(props.serverUrl + "/getDivisions").then(async (res) => {
                                    //             if (res.data.result === "OK") {
                                    //                 await props.setItems(res.data.divisions.map((item, index) => {
                                    //                     item.selected = (selectedCustomer?.division?.id || 0) === 0
                                    //                         ? index === 0
                                    //                         : item.id === selectedCustomer.division.id;
                                    //                     return item;
                                    //                 }));
        
                                    //                 refPopupItems.current.map((r, i) => {
                                    //                     if (r && r.classList.contains("selected")) {
                                    //                         r.scrollIntoView({
                                    //                             behavior: "auto",
                                    //                             block: "center",
                                    //                             inline: "nearest",
                                    //                         });
                                    //                     }
                                    //                     return true;
                                    //                 });
                                    //             }
                                    //         }).catch(async (e) => {
                                    //             console.log("error getting divisions", e);
                                    //         });
                                    //     }
                                    // }
        
                                    // refInput.current.focus();
                                }}

                                value={selectedDriver?.endorsments || ''}

                                textTransform={'capitalize'}
                            /> */}
                        </div>
                    </div>



                    <div className="form-col">

                    </div>
                </div>

                <MailingAddressForm
                    formTitle='Mailing Address'
                    formButtons={[
                        {
                            title: 'Remit to address is the same',
                            onClick: () => {
                                remitToAddressBtn();
                            },
                            isEnabled: true
                        },
                        {
                            title: 'Clear',
                            onClick: () => {
                                mailingAddressClearBtn();
                            },
                            isEnabled: true
                        },
                    ]}
                    refs={{
                        refCode: refMailingCode,
                        refName: refMailingName,
                        refContactName: refMailingContactName,
                        refContactNameDropDown: refMailingContactNameDropDown,
                        refContactNamePopupItems: refMailingContactNamePopupItems,
                        refContactPhone: refMailingContactPhone,
                        refContactPhonePopupItems: refMailingContactPhonePopupItems,
                        refContactEmail: refMailingContactEmail,
                        refContactEmailPopupItems: refMailingContactEmailPopupItems,
                        refMailingName: refCustomerMailingName
                    }}
                    tabTimesFrom={12}
                    tabTimes={props.tabTimes}
                    validateForSaving={validateDriverInfoForSaving}
                    validateMailingAddressForSaving={validateMailingAddressForSaving}
                    selectedParent={selectedDriver}
                    setSelectedParent={setSelectedDriver}
                    remitToAddressBtn={remitToAddressBtn}
                    clearBtn={mailingAddressClearBtn}

                    withCode={0}
                    withName={0}
                    withEmail={1}
                />

                <div></div>

                <EmergencyContactForm
                    formTitle='Emergency Contact'
                    formButtons={[
                        {
                            title: 'More',
                            onClick: () => {

                            },
                            isEnabled: true
                        },
                        {
                            title: 'Add New Contact',
                            onClick: () => {

                            },
                            isEnabled: true
                        },
                        {
                            title: 'Clear',
                            onClick: () => {
                                setSelectedDriver(prev => {
                                    return {
                                        ...prev,
                                        emergencyContact: {}
                                    }
                                })
                                refEmergencyContactName.current.focus();
                            },
                            isEnabled: true
                        },
                    ]}
                    refs={{
                        refName: refEmergencyContactName,
                        refEmail: refEmergencyContactEmail
                    }}
                    tabTimesFrom={24}
                    tabTimes={props.tabTimes}
                    validateForSaving={validateEmergencyContactForSaving}
                    selectedParent={selectedDriver}
                    setSelectedParent={setSelectedDriver}
                    withEmail={1}
                />

                <div></div>

                <EmergencyContactList
                    formTitle=''
                    formButtons={[
                        {
                            title: 'Search',
                            onClick: () => {
                                setShowingEmergencyContactList(false);
                                refEmergencyContactSearchFirstName.current.focus();
                            },
                            isEnabled: true
                        },
                        {
                            title: 'Cancel',
                            onClick: () => {
                                setShowingEmergencyContactList(true);
                                refEmergencyContactEmail.current.focus();
                            },
                            isEnabled: !showingEmergencyContactList
                        },
                        {
                            title: 'Send',
                            onClick: () => {
                                searchEmergencyContactBtnClick();
                            },
                            isEnabled: !showingEmergencyContactList
                        }
                    ]}
                    refs={{
                        refContactSearchName: refEmergencyContactSearchFirstName,
                        refEmergencyContactEmail: refEmergencyContactEmail
                    }}
                    tabTimes={props.tabTimes}

                    selectedParent={selectedDriver}
                    selectedContact={selectedEmergencyContact}
                    setSelectedContact={setSelectedEmergencyContact}
                    showingContactList={showingEmergencyContactList}
                    setShowingContactList={setShowingEmergencyContactList}
                    contactListItemDoubleClick={emergencyContactItemDoubleClick}
                />
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

        selectedCompany: state.companySetupReducers.selectedCompany,
        selectedDriver: state.companySetupReducers.selectedDriver,
    }
}

export default connect(mapStateToProps, null)(CompanyDrivers)