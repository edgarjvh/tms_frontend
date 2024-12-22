/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import axios from 'axios';
import Draggable from 'react-draggable';
import { useTransition, animated } from 'react-spring';
import './Divisions.css';
import MaskedInput from 'react-text-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCaretDown,
    faCaretRight,
    faCalendarAlt,
    faCheck,
    faPencilAlt,
    faTrashAlt,
    faCopy
} from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import Highlighter from "react-highlight-words";
import "react-datepicker/dist/react-datepicker.css";
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import moment from 'moment';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import ToPrint from './ToPrint.jsx';
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

    setSelectedCompany,
    setSelectedCompanyDriver as setSelectedDriver,
} from './../../../../actions';

import {
    Documents,
    Calendar,
    Contacts,
    Modal as DivisionModal,
    CustomerSearch, ContactSearch, RevenueInformation, OrderHistory
} from './../../../company/panels';
import { Dispatch } from "../../../company";
import { useReactToPrint } from "react-to-print";

const Divisions = (props) => {
    const refDivisionsContainer = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDivisionOrders, setIsLoadingDivisionOrders] = useState(false);
    const [selectedDivision, setSelectedDivision] = useState({});
    const [selectedContact, setSelectedContact] = useState({});
    const [selectedPrimaryContact, setSelectedPrimaryContact] = useState({});

    const [selectedNote, setSelectedNote] = useState({});

    const [isAddingDivision, setIsAddingDivision] = useState(false);
    const [isEditingDivision, setIsEditingDivision] = useState(false);

    const refDivisionCode = useRef();
    const refDivisionName = useRef();
    const refDivisionEmail = useRef();
    const refDivisionContactFirstName = useRef();
    const refDivisionContactPhone = useRef();
    const refDivisionMailingCode = useRef();
    const refPrintDivisionInformation = useRef();

    const [isSavingDivision, setIsSavingDivision] = useState(false);
    const [isSavingContact, setIsSavingContact] = useState(false);
    const [isSavingMailingAddress, setIsSavingMailingAddress] = useState(false);
    const [contactSearch, setContactSearch] = useState({});
    const [showingContactList, setShowingContactList] = useState(true);

    const [divisionContactPhoneItems, setDivisionContactPhoneItems] = useState([]);
    const [showDivisionContactPhones, setShowDivisionContactPhones] = useState(false);
    const refDivisionContactPhoneDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowDivisionContactPhones(false)
        }
    });
    const refDivisionContactPhonePopupItems = useRef([]);

    const refDivisionContactEmail = useRef();
    const [divisionContactEmailItems, setDivisionContactEmailItems] = useState([]);
    const [showDivisionContactEmails, setShowDivisionContactEmails] = useState(false);
    const refDivisionContactEmailDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowDivisionContactEmails(false)
        }
    });
    const refDivisionContactEmailPopupItems = useRef([]);

    const refMailingContactName = useRef();
    const [mailingContactNameItems, setMailingContactNameItems] = useState([]);
    const [showMailingContactNames, setShowMailingContactNames] = useState(false);
    const refMailingContactNameDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowMailingContactNames(false)
        }
    });
    const refMailingContactNamePopupItems = useRef([]);

    const refMailingContactPhone = useRef();
    const [mailingContactPhoneItems, setMailingContactPhoneItems] = useState([]);
    const [showMailingContactPhones, setShowMailingContactPhones] = useState(false);
    const refMailingContactPhoneDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowMailingContactPhones(false)
        }
    });
    const refMailingContactPhonePopupItems = useRef([]);

    const refMailingContactEmail = useRef();
    const [mailingContactEmailItems, setMailingContactEmailItems] = useState([]);
    const [showMailingContactEmails, setShowMailingContactEmails] = useState(false);
    const refMailingContactEmailDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowMailingContactEmails(false)
        }
    });
    const refMailingContactEmailPopupItems = useRef([]);

    const [showDivisionEmailCopyBtn, setShowDivisionEmailCopyBtn] = useState(false);
    const [showDivisionContactEmailCopyBtn, setShowDivisionContactEmailCopyBtn] = useState(false);
    const [showMailingContactEmailCopyBtn, setShowMailingContactEmailCopyBtn] = useState(false);

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: isLoading,
    });

    const divisionContactPhonesTransition = useTransition(showDivisionContactPhones, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showDivisionContactPhones
    });

    const divisionContactEmailsTransition = useTransition(showDivisionContactEmails, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showDivisionContactEmails
    });

    const noteTransition = useTransition(selectedNote?.id !== undefined, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: selectedNote?.id !== undefined,
        config: { duration: 100 }
    });

    const mailingContactNamesTransition = useTransition(showMailingContactNames, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showMailingContactNames
    });

    const mailingContactPhonesTransition = useTransition(showMailingContactPhones, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showMailingContactPhones
    });

    const mailingContactEmailsTransition = useTransition(showMailingContactEmails, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showMailingContactEmails
    });

    const loadingDivisionOrdersTransition = useTransition(isLoadingDivisionOrders, {
        from: { opacity: 0, display: 'block' },
        enter: { opacity: 1, display: 'block' },
        leave: { opacity: 0, display: 'none' },
        reverse: isLoadingDivisionOrders,
    });

    const handledPrintDivisionInformation = useReactToPrint({
        // pageStyle: () => {
        //     return `
        //     @media print {@page {size: 8.5in 11in !important; margin: 0} body {margin: 0;padding: 0;} .page-block {page-break-after: auto !important;page-break-beforer: auto !important; page-break-inside: avoid !important;} .no-print{display:none !important;} .container-sheet{box-shadow: initial !important;margin: 0 !important}}
        //     `
        // },
        pageStyle: () => {
            return `
                @media print {
                    @page {
                        size: 8.5in 11in !important; 
                        margin: 0;                        
                    }
                    .page-block {
                        page-break-after: auto !important;
                        page-break-beforer: auto !important; 
                        page-break-inside: avoid !important;
                    } 
                    .no-print{
                        display:none !important;
                    } 
                    .container-sheet{
                        box-shadow: initial !important;
                        margin: 0 !important
                    }
                }
            `
        },
        content: () => refPrintDivisionInformation.current
    });

    const disabledOnAddingEditing = classnames({
        'disabled': !isAddingDivision && !isEditingDivision,
        'input-box-container': true
    })

    const disabledDivisionCodeField = classnames({
        'disabled': isAddingDivision || isEditingDivision,
        'input-box-container': true,
        'input-code': true
    })

    const disabledDivisionContactFields = classnames({
        'disabled': !isEditingDivision
    })

    const disabledDivisionMailingAddressFields = classnames({
        'disabled': !isEditingDivision
    })

    const disabledDivisionHoursFields = classnames({
        'disabled': !isEditingDivision
    })

    useEffect(() => {
        refDivisionCode.current.focus({
            preventScroll: true
        });
    }, []);

    useEffect(() => {
        if ((selectedDivision?.contacts || []).length === 0) {
            setSelectedPrimaryContact({});
        } else {
            if (selectedDivision.contacts.find(c => c.is_primary === 1) === undefined) {
                setSelectedPrimaryContact(selectedDivision.contacts[0]);
            } else {
                setSelectedPrimaryContact(selectedDivision.contacts.find(c => c.is_primary === 1));
            }
        }
    }, [selectedDivision?.contacts])

    useEffect(() => {
        let phones = [];
        (selectedContact?.phone_work || '') !== '' && phones.push({
            id: 1,
            type: 'work',
            phone: selectedContact.phone_work
        });
        (selectedContact?.phone_work_fax || '') !== '' && phones.push({
            id: 2,
            type: 'fax',
            phone: selectedContact.phone_work_fax
        });
        (selectedContact?.phone_mobile || '') !== '' && phones.push({
            id: 3,
            type: 'mobile',
            phone: selectedContact.phone_mobile
        });
        (selectedContact?.phone_direct || '') !== '' && phones.push({
            id: 4,
            type: 'direct',
            phone: selectedContact.phone_direct
        });
        (selectedContact?.phone_other || '') !== '' && phones.push({
            id: 5,
            type: 'other',
            phone: selectedContact.phone_other
        });

        setDivisionContactPhoneItems(phones);
    }, [
        selectedContact?.phone_work,
        selectedContact?.phone_work_fax,
        selectedContact?.phone_mobile,
        selectedContact?.phone_direct,
        selectedContact?.phone_other,
        selectedContact?.primary_phone
    ]);

    useEffect(() => {
        let emails = [];
        (selectedContact?.email_work || '') !== '' && emails.push({
            id: 1,
            type: 'work',
            email: selectedContact.email_work
        });
        (selectedContact?.email_personal || '') !== '' && emails.push({
            id: 2,
            type: 'personal',
            email: selectedContact.email_personal
        });
        (selectedContact?.email_other || '') !== '' && emails.push({
            id: 3,
            type: 'other',
            email: selectedContact.email_other
        });

        setDivisionContactEmailItems(emails);
    }, [
        selectedContact?.email_work,
        selectedContact?.email_personal,
        selectedContact?.email_other,
        selectedContact?.primary_email
    ]);

    const saveDivision = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingDivision) {
                setIsSavingDivision(true);
            }
        }
    }

    const saveContact = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingContact) {
                setIsSavingContact(true);
            }
        }
    }

    useEffect(() => {
        if (isSavingDivision) {
            if (selectedDivision.id === undefined || selectedDivision.id === -1) {
                selectedDivision.id = 0;
                setSelectedDivision(selectedDivision => {
                    return { ...selectedDivision, id: 0 }
                });
            }

            if (
                (selectedDivision.name || '').trim().replace(/\s/g, "").replace("&", "A") !== "" &&
                (selectedDivision.city || '').trim().replace(/\s/g, "") !== "" &&
                (selectedDivision.state || '').trim().replace(/\s/g, "") !== "" &&
                (selectedDivision.address1 || '').trim() !== "" &&
                (selectedDivision.zip || '').trim() !== ""
            ) {
                let parseCity = selectedDivision.city.trim().replace(/\s/g, "").substring(0, 3);

                if (parseCity.toLowerCase() === "ft.") {
                    parseCity = "FO";
                }
                if (parseCity.toLowerCase() === "mt.") {
                    parseCity = "MO";
                }
                if (parseCity.toLowerCase() === "st.") {
                    parseCity = "SA";
                }

                let newCode = (selectedDivision.name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (selectedDivision.state || '').trim().replace(/\s/g, "").substring(0, 2);

                selectedDivision.code = newCode.toUpperCase();
                selectedDivision.state = (selectedDivision.state || '').toUpperCase();

                axios.post(props.serverUrl + '/saveDivision', {
                    ...selectedDivision,
                    contact_first_name: selectedPrimaryContact?.first_name || '',
                    contact_last_name: selectedPrimaryContact?.last_name || '',
                    contact_phone: selectedPrimaryContact?.phone_work || '',
                    contact_phone_ext: selectedPrimaryContact?.phone_ext || '',
                    email: selectedPrimaryContact?.email_work || ''
                }).then(res => {
                    if (res.data.result === 'OK') {
                        let division = JSON.parse(JSON.stringify(res.data.division));
                        if ((selectedDivision?.id || 0) === 0) {
                            setSelectedDivision(selectedDivision => {
                                return {
                                    ...selectedDivision,
                                    id: division.id,
                                    code: division.code,
                                    code_number: division.code_number,
                                    contacts: division.contacts || [],

                                }
                            });

                        } else {
                            setSelectedDivision({
                                ...selectedDivision,
                                contacts: division.contacts || []
                            });
                        }

                        if ((selectedContact?.id || 0) === 0) {
                            setSelectedContact((division?.contacts || []).find(c => c.is_primary === 1) || {})
                        }
                    }

                    if ((selectedDivision?.id || 0) > 0) {
                        setIsEditingDivision(true);
                        setIsAddingDivision(false)
                    }

                    setIsSavingDivision(false);
                }).catch(e => {
                    console.log('error saving division', e);
                    setIsSavingDivision(false);
                });
            } else {
                setIsSavingDivision(false);
            }
        }
    }, [isSavingDivision])

    useEffect(() => {
        if (isSavingContact) {
            if ((selectedDivision?.id || 0) === 0) {
                setIsSavingContact(false);
                return;
            }

            if (selectedContact.division_id === undefined || selectedContact.division_id === 0) {
                selectedContact.division_id = selectedDivision.id;
            }

            if ((selectedContact.first_name || '').trim() === '' ||
                (selectedContact.last_name || '').trim() === '' ||
                ((selectedContact.phone_work || '').trim() === '' &&
                    (selectedContact.phone_work_fax || '').trim() === '' &&
                    (selectedContact.phone_mobile || '').trim() === '' &&
                    (selectedContact.phone_direct || '').trim() === '' &&
                    (selectedContact.phone_other || '').trim() === '')) {
                setIsSavingContact(false);
                return;
            }

            if ((selectedContact.address1 || '').trim() === '' && (selectedContact.address2 || '').trim() === '') {
                selectedContact.address1 = selectedDivision?.address1;
                selectedContact.address2 = selectedDivision?.address2;
                selectedContact.city = selectedDivision?.city;
                selectedContact.state = selectedDivision?.state;
                selectedContact.zip_code = selectedDivision?.zip;
            }

            axios.post(props.serverUrl + '/saveDivisionContact', selectedContact).then(res => {
                if (res.data.result === 'OK') {
                    let mailing_contact = selectedDivision?.mailing_address?.mailing_contact || {};

                    if ((mailing_contact?.id || 0) === res.data.contact.id) {
                        mailing_contact = res.data.contact;
                    }
                    setSelectedDivision({
                        ...selectedDivision,
                        contacts: res.data.contacts,
                        mailing_address: {
                            ...selectedDivision.mailing_address,
                            mailing_contact: mailing_contact
                        }
                    });
                    setSelectedContact(res.data.contact);
                }

                setIsSavingContact(false);
            }).catch(e => {
                console.log('error saving division contact', e);
                setIsSavingContact(false);
            });
        }
    }, [isSavingContact])

    useEffect(() => {
        if (isSavingMailingAddress) {
            if ((selectedDivision.id || 0) > 0) {
                let mailing_address = selectedDivision.mailing_address || {};

                if (mailing_address.id === undefined) {
                    mailing_address.id = 0;
                }

                mailing_address.division_id = selectedDivision.id;

                if (
                    (mailing_address.name || '').trim().replace(/\s/g, "").replace("&", "A") !== "" &&
                    (mailing_address.city || '').trim().replace(/\s/g, "") !== "" &&
                    (mailing_address.state || '').trim().replace(/\s/g, "") !== "" &&
                    (mailing_address.address1 || '').trim() !== "" &&
                    (mailing_address.zip || '').trim() !== ""
                ) {
                    let parseCity = mailing_address.city.trim().replace(/\s/g, "").substring(0, 3);

                    if (parseCity.toLowerCase() === "ft.") {
                        parseCity = "FO";
                    }
                    if (parseCity.toLowerCase() === "mt.") {
                        parseCity = "MO";
                    }
                    if (parseCity.toLowerCase() === "st.") {
                        parseCity = "SA";
                    }

                    let newCode = (mailing_address.name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (mailing_address.state || '').trim().replace(/\s/g, "").substring(0, 2);

                    mailing_address.code = newCode.toUpperCase();
                }

                axios.post(props.serverUrl + '/saveDivisionMailingAddress', mailing_address).then(res => {
                    if (res.data.result === 'OK') {
                        setSelectedDivision({ ...selectedDivision, mailing_address: res.data.mailing_address });

                        props.setSelectedDivision({
                            ...selectedDivision,
                            mailing_address: res.data.mailing_address,
                            component_id: props.componentId
                        });
                    }

                    setIsSavingMailingAddress(false);
                }).catch(e => {
                    console.log('error on saving division mailing address', e);
                    setIsSavingMailingAddress(false);
                });
            } else {
                setIsSavingMailingAddress(false);
            }
        }
    }, [isSavingMailingAddress]);

    const printWindow = (data) => {
        let mywindow = window.open('', 'new div', 'height=400,width=600');
        mywindow.document.write('<html><head><title></title>');
        mywindow.document.write('<link rel="stylesheet" href="../../css/index.css" type="text/css" media="all" />');
        mywindow.document.write('</head><body >');
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');
        mywindow.document.close();
        mywindow.focus();
        setTimeout(function () {
            mywindow.print();
        }, 1000);

        return true;
    }

    const setInitialValues = (clearCode = true) => {
        setIsSavingDivision(false);
        setSelectedContact({});
        setSelectedNote({});
        setContactSearch({});
        setShowingContactList(true);
        setIsAddingDivision(false);
        setIsEditingDivision(false);

        refDivisionCode.current.focus();

        setSelectedDivision({ id: 0, code: clearCode ? '' : selectedDivision?.code });
    }

    const searchDivisionByCode = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (e.target.value.trim() !== '') {
                setIsLoading(true);

                axios.post(props.serverUrl + '/getDivisions', {
                    code: e.target.value.toLowerCase()
                }).then(res => {
                    if (res.data.result === 'OK') {
                        if (res.data.divisions.length > 0) {
                            setInitialValues();
                            setSelectedDivision(res.data.divisions[0]);
                            setSelectedContact((res.data.divisions[0].contacts || []).find(c => c.is_primary === 1) || {});

                            getDivisionOrders(res.data.divisions[0]);

                            setIsAddingDivision(false);
                            setIsEditingDivision(true);
                            refDivisionName.current.focus();
                        } else {
                            setInitialValues(false);
                        }
                    } else {
                        setInitialValues(false);
                    }

                    setIsLoading(false);
                }).catch(e => {
                    console.log('error getting divisions', e);
                    setIsLoading(false);
                });
            } else {
                setInitialValues(false);
            }
        }
    }

    const getDivisionOrders = (division) => {
        setIsLoadingDivisionOrders(true);
        axios.post(props.serverUrl + '/getDivisionOrders', {
            id: division.id
        }).then(res => {
            if (res.data.result === 'OK') {
                setSelectedDivision({
                    ...division,
                    orders: res.data.orders
                });
            }
        }).catch(e => {
            console.log('error getting division orders', e);
        }).finally(() => {
            setIsLoadingDivisionOrders(false);
        });
    }

    const searchDivisionBtnClick = () => {
        let divisionSearch = [
            {
                field: 'Code',
                data: (selectedDivision?.code || '').toLowerCase()
            },
            {
                field: 'Name',
                data: (selectedDivision?.name || '').toLowerCase()
            },
            {
                field: 'City',
                data: (selectedDivision?.city || '').toLowerCase()
            },
            {
                field: 'State',
                data: (selectedDivision?.state || '').toLowerCase()
            },
            {
                field: 'Postal Code',
                data: selectedDivision?.zip || ''
            },
            {
                field: 'Contact First Name',
                data: (selectedDivision?.contact_first_name || '').toLowerCase()
            },
            {
                field: 'Contact Last Name',
                data: (selectedDivision?.contact_last_name || '').toLowerCase()
            },
            {
                field: 'Contact Phone',
                data: selectedDivision?.contact_phone || ''
            },
            {
                field: 'E-Mail',
                data: (selectedDivision?.email || '').toLowerCase()
            }
        ]

        let panel = {
            panelName: `${props.panelName}-division-search`,
            component: <CustomerSearch
                title='Division Search Results'
                tabTimes={2000200 + props.tabTimes}
                panelName={`${props.panelName}-division-search`}
                origin={props.origin}
                suborigin='division'
                closingCallback={() => {
                    closePanel(`${props.panelName}-division-search`, props.origin);
                    refDivisionCode.current.focus({ preventScroll: true });
                }}

                componentId={moment().format('x')}
                customerSearch={divisionSearch}

                callback={(id) => {
                    new Promise((resolve, reject) => {
                        if ((id || 0) > 0) {
                            axios.post(props.serverUrl + '/getDivisionById', { id: id }).then(res => {
                                if (res.data.result === 'OK') {
                                    setSelectedDivision(res.data.division);
                                    setSelectedContact((res.data.division.contacts || []).find(c => c.is_primary === 1) || {});

                                    getDivisionOrders(res.data.division);

                                    resolve('OK');
                                } else {
                                    reject('no division');
                                }
                            });
                        }
                    }).then(response => {
                        closePanel(`${props.panelName}-division-search`, props.origin);
                        refDivisionName.current.focus();
                    }).catch(e => {
                        // closePanel(`${props.panelName}-division-search`, props.origin);
                        refDivisionCode.current.focus();
                    })

                }}
            />
        }

        // openPanel(panel, props.origin);
        openPanel(panel, props.origin);
    }

    const handleContactSearch = () => {
        let filters = [
            {
                field: 'Division Id',
                data: selectedDivision?.id || 0
            },
            {
                field: 'First Name',
                data: (contactSearch.first_name || '').toLowerCase()
            },
            {
                field: 'Last Name',
                data: (contactSearch.last_name || '').toLowerCase()
            },
            {
                field: 'Address 1',
                data: (contactSearch.address1 || '').toLowerCase()
            },
            {
                field: 'Address 2',
                data: (contactSearch.address2 || '').toLowerCase()
            },
            {
                field: 'City',
                data: (contactSearch.city || '').toLowerCase()
            },
            {
                field: 'State',
                data: (contactSearch.state || '').toLowerCase()
            },
            {
                field: 'Phone',
                data: contactSearch.phone || ''
            },
            {
                field: 'E-Mail',
                data: (contactSearch.email || '').toLowerCase()
            }
        ]

        let panel = {
            panelName: `${props.panelName}-contact-search`,
            component: <ContactSearch
                title='Contact Search Results'
                tabTimes={22000 + props.tabTimes}
                panelName={`${props.panelName}-contact-search`}
                owner='division'
                origin={props.origin}
                suborigin='division'
                closingCallback={() => {
                    closePanel(`${props.panelName}-contact-search`, props.origin);
                    refDivisionCode.current.focus({ preventScroll: true });
                }}

                componentId={moment().format('x')}
                contactSearch={{ search: filters }}

                callback={(contact) => {
                    new Promise((resolve, reject) => {
                        if (contact) {
                            setSelectedDivision(contact.division);
                            setSelectedContact(contact);
                            setShowingContactList(true);
                            setContactSearch({});
                            resolve('OK');
                        } else {
                            reject('no contact');
                        }
                    }).then(response => {
                        closePanel(`${props.panelName}-contact-search`, props.origin);
                        refDivisionName.current.focus();
                    }).catch(e => {
                        closePanel(`${props.panelName}-contact-search`, props.origin);
                        refDivisionCode.current.focus();
                    })
                }}
            />
        }

        openPanel(panel, props.origin);
    }

    const remitToAddressBtn = () => {
        if ((selectedDivision?.id || 0) === 0) {
            window.alert('You must select a division first');
            return;
        }

        let mailing_address = {};

        mailing_address.id = -1;
        mailing_address.division_id = selectedDivision.id;
        mailing_address.code = selectedDivision.code;
        mailing_address.code_number = selectedDivision.code_number;
        mailing_address.name = selectedDivision.name;
        mailing_address.address1 = selectedDivision.address1;
        mailing_address.address2 = selectedDivision.address2;
        mailing_address.city = selectedDivision.city;
        mailing_address.state = selectedDivision.state;
        mailing_address.zip = selectedDivision.zip;
        mailing_address.contact_first_name = selectedDivision.contact_first_name;
        mailing_address.contact_last_name = selectedDivision.contact_last_name;
        mailing_address.contact_phone = selectedDivision.contact_phone;
        mailing_address.ext = selectedDivision.ext;
        mailing_address.email = selectedDivision.email;

        if ((selectedContact?.id || 0) > 0) {
            mailing_address.mailing_contact_id = selectedContact.id;
            mailing_address.mailing_contact = selectedContact;

            mailing_address.mailing_contact_primary_phone = selectedContact.phone_work !== ''
                ? 'work'
                : selectedContact.phone_work_fax !== ''
                    ? 'fax'
                    : selectedContact.phone_mobile !== ''
                        ? 'mobile'
                        : selectedContact.phone_direct !== ''
                            ? 'direct'
                            : selectedContact.phone_other !== ''
                                ? 'other' : 'work';

            mailing_address.mailing_contact_primary_email = selectedContact.email_work !== ''
                ? 'work'
                : selectedContact.email_personal !== ''
                    ? 'personal'
                    : selectedContact.email_other !== ''
                        ? 'other' : 'work';

        } else if (selectedDivision.contacts.findIndex(x => x.is_primary === 1) > -1) {
            mailing_address.mailing_contact_id = selectedDivision.contacts[selectedDivision.contacts.findIndex(x => x.is_primary === 1)].id;
            mailing_address.mailing_contact = selectedDivision.contacts[selectedDivision.contacts.findIndex(x => x.is_primary === 1)];

            mailing_address.mailing_contact_primary_phone = selectedDivision.contacts[selectedDivision.contacts.findIndex(x => x.is_primary === 1)].phone_work !== ''
                ? 'work'
                : selectedDivision.contacts[selectedDivision.contacts.findIndex(x => x.is_primary === 1)].phone_work_fax !== ''
                    ? 'fax'
                    : selectedDivision.contacts[selectedDivision.contacts.findIndex(x => x.is_primary === 1)].phone_mobile !== ''
                        ? 'mobile'
                        : selectedDivision.contacts[selectedDivision.contacts.findIndex(x => x.is_primary === 1)].phone_direct !== ''
                            ? 'direct'
                            : selectedDivision.contacts[selectedDivision.contacts.findIndex(x => x.is_primary === 1)].phone_other !== ''
                                ? 'other' : 'work';

            mailing_address.mailing_contact_primary_email = selectedDivision.contacts[selectedDivision.contacts.findIndex(x => x.is_primary === 1)].email_work !== ''
                ? 'work'
                : selectedDivision.contacts[selectedDivision.contacts.findIndex(x => x.is_primary === 1)].email_personal !== ''
                    ? 'personal'
                    : selectedDivision.contacts[selectedDivision.contacts.findIndex(x => x.is_primary === 1)].email_other !== ''
                        ? 'other' : 'work';

        } else if (selectedDivision.contacts.length > 0) {
            mailing_address.mailing_contact_id = selectedDivision.contacts[0].id;
            mailing_address.mailing_contact = selectedDivision.contacts[0];

            mailing_address.mailing_contact_primary_phone = selectedDivision.contacts[0].phone_work !== ''
                ? 'work'
                : selectedDivision.contacts[0].phone_work_fax !== ''
                    ? 'fax'
                    : selectedDivision.contacts[0].phone_mobile !== ''
                        ? 'mobile'
                        : selectedDivision.contacts[0].phone_direct !== ''
                            ? 'direct'
                            : selectedDivision.contacts[0].phone_other !== ''
                                ? 'other' : 'work';

            mailing_address.mailing_contact_primary_email = selectedDivision.contacts[0].email_work !== ''
                ? 'work'
                : selectedDivision.contacts[0].email_personal !== ''
                    ? 'personal'
                    : selectedDivision.contacts[0].email_other !== ''
                        ? 'other' : 'work';

        } else {
            mailing_address.mailing_contact_id = null;
            mailing_address.mailing_contact = {};
            mailing_address.mailing_contact_primary_phone = 'work';
            mailing_address.mailing_contact_primary_email = 'work';
        }

        setSelectedDivision({ ...selectedDivision, mailing_address: mailing_address });

        saveMailingAddress({ keyCode: 9 });
    }

    const mailingAddressClearBtn = () => {
        setSelectedDivision({
            ...selectedDivision,
            mailing_address: {}
        });

        if ((selectedDivision?.id || 0) > 0) {
            axios.post(props.serverUrl + '/deleteDivisionMailingAddress', {
                division_id: selectedDivision.id
            }).then(res => {
                if (res.data.result === 'OK') {
                    console.log('divivion mailing address deleted')
                }
            })
        }
        refDivisionMailingCode.current.focus();
    }

    const saveMailingAddress = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingMailingAddress) {
                setIsSavingMailingAddress(true);
            }
        }
    }

    const saveHours = (e, name) => {
        let formatted = getFormattedHours(e.target.value);
        let hours = { ...selectedDivision?.hours || {}, division_id: selectedDivision?.id };

        if (name === 'hours open') {
            hours.hours_open = formatted;
        }
        if (name === 'hours close') {
            hours.hours_close = formatted;
        }
        if (name === 'delivery hours open') {
            hours.delivery_hours_open = formatted;
        }
        if (name === 'delivery hours close') {
            hours.delivery_hours_close = formatted;
        }

        if (name === 'hours open 2') {
            hours.hours_open2 = formatted;
        }
        if (name === 'hours close 2') {
            hours.hours_close2 = formatted;
        }
        if (name === 'delivery hours open 2') {
            hours.delivery_hours_open2 = formatted;
        }
        if (name === 'delivery hours close 2') {
            hours.delivery_hours_close2 = formatted;
        }

        axios.post(props.serverUrl + '/saveDivisionHours', hours).then(async res => {
            if (res.data.result === 'OK') {
                await setSelectedDivision({ ...selectedDivision, hours: res.data.hours });
            }
        }).catch(e => {
            console.log('error saving division hours', e);
        })
    }

    const getFormattedHours = (hour) => {
        let formattedHour = hour;

        try {

            if (moment(hour.trim(), 'HH:mm').format('HH:mm') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'HH:mm').format('HHmm');
            }

            if (moment(hour.trim(), 'H:mm').format('H:mm') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'H:mm').format('HHmm');
            }

            if (moment(hour.trim(), 'Hmm').format('Hmm') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'Hmm').format('HHmm');
            }

            if (moment(hour.trim(), 'hh:mm a').format('hh:mm a') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hh:mm a').format('HHmm');
            }

            if (moment(hour.trim(), 'h:mm a').format('h:mm a') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'h:mm a').format('HHmm');
            }

            if (moment(hour.trim(), 'hh:mma').format('hh:mma') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hh:mma').format('HHmm');
            }

            if (moment(hour.trim(), 'h:mma').format('h:mma') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'h:mma').format('HHmm');
            }

            if (moment(hour.trim(), 'hhmm a').format('hhmm a') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hhmm a').format('HHmm');
            }

            if (moment(hour.trim(), 'hmm a').format('hmm a') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hmm a').format('HHmm');
            }

            if (moment(hour.trim(), 'hhmma').format('hhmma') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hhmma').format('HHmm');
            }

            if (moment(hour.trim(), 'hmma').format('hmma') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hmma').format('HHmm');
            }

            if (moment(hour.trim(), 'H').format('H') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'H').format('HHmm');
            }

            if (moment(hour.trim(), 'HH').format('HH') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'HH').format('HHmm');
            }

            if (moment(hour.trim(), 'h a').format('h a') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'h a').format('HHmm');
            }

            if (moment(hour.trim(), 'hh a').format('hh a') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hh a').format('HHmm');
            }

            if (moment(hour.trim(), 'ha').format('ha') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'ha').format('HHmm');
            }

            if (moment(hour.trim(), 'hha').format('hha') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'hha').format('HHmm');
            }

            if (moment(hour.trim(), 'h:ma').format('h:ma') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'h:ma').format('HHmm');
            }

            if (moment(hour.trim(), 'H:m').format('H:m') === hour.trim()) {
                formattedHour = moment(hour.trim(), 'H:m').format('HHmm');
            }
        } catch (e) {

        }

        return formattedHour;
    }

    const revenueInformationBtnClick = () => {
        let panel = {
            panelName: `${props.panelName}-revenue-information`,
            component: <RevenueInformation
                title='Revenue Information'
                tabTimes={2300001 + props.tabTimes}
                panelName={`${props.panelName}-revenue-information`}
                origin={props.origin}
                suborigin={'division'}
                closingCallback={() => {
                    closePanel(`${props.panelName}-revenue-information`, props.origin);
                    refDivisionCode.current.focus({ preventScroll: true });
                }}

                componentId={moment().format('x')}
                isAdmin={props.isAdmin}
                selectedCustomer={selectedDivision}
            />
        }

        openPanel(panel, props.origin);
    }

    const orderHistoryBtnClick = () => {
        let panel = {
            panelName: `${props.panelName}-order-history`,
            component: <OrderHistory
                title='Order History'
                tabTimes={2400001 + props.tabTimes}
                panelName={`${props.panelName}-order-history`}
                origin={props.origin}
                suborigin={'division'}
                closingCallback={() => {
                    closePanel(`${props.panelName}-order-history`, props.origin);
                    refDivisionCode.current.focus({ preventScroll: true });
                }}

                componentId={moment().format('x')}
                isAdmin={props.isAdmin}
                selectedCustomer={selectedDivision}
            />
        }

        openPanel(panel, props.origin);
    }

    const documentsBtnClick = () => {
        if ((selectedDivision?.id || 0) > 0) {
            let panel = {
                panelName: `${props.panelName}-documents`,
                component: <Documents
                    title='Documents'
                    tabTimes={260000 + props.tabTimes}
                    panelName={`${props.panelName}-documents`}
                    origin={props.origin}
                    suborigin={'division'}
                    closingCallback={() => {
                        closePanel(`${props.panelName}-documents`, props.origin);
                        refDivisionCode.current.focus({ preventScroll: true });
                    }}

                    componentId={moment().format('x')}
                    selectedOwner={{ ...selectedDivision }}
                    isAdmin={props.isAdmin}
                    selectedOwnerDocument={{
                        id: 0,
                        user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                        date_entered: moment().format('MM/DD/YYYY')
                    }}
                    savingDocumentUrl='/saveDivisionDocument'
                    deletingDocumentUrl='/deleteDivisionDocument'
                    savingDocumentNoteUrl='/saveDivisionDocumentNote'
                    deletingDocumentNoteUrl='/deleteDivisionDocumentNote'
                    serverDocumentsFolder='/division-documents/'
                    setSelectedDivision={setSelectedDivision}
                />
            }

            openPanel(panel, props.origin);
        } else {
            window.alert('You must select a division first!');
        }
    }

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
        <div className="panel-content" tabIndex={0} ref={refDivisionsContainer} onKeyDown={(e) => {
            if (e.key === 'Escape'){
                e.stopPropagation();
                if ((selectedDivision?.id || 0) > 0) {
                    setInitialValues();
                }else{
                    props.closingCallback();
                }
            }
        }}>
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div>
            <div className="close-btn" title="Close" onClick={e => { props.closingCallback() }}><span className="fas fa-times"></span></div>
            <div className="side-title">
                <div>{props.title}</div>
            </div>

            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style}>
                        <div className="loading-container-wrapper" style={{
                            position: 'absolute',
                            flexDirection: 'column'
                        }}>
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                        </div>
                    </animated.div>
                )
            }

            {
                (selectedDivision?.id || 0) > 0 &&
                <div style={{ display: 'none' }}>
                    <ToPrint
                        ref={refPrintDivisionInformation}
                        selectedDivision={selectedDivision}
                    />
                </div>

            }

            <div className="divisions-main-content">
                <div className="fields-container-col">
                    <div className="fields-container-row">
                        {/*DIVISION FORM*/}
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Divisions</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    {
                                        (isAddingDivision || isEditingDivision) &&
                                        <div className="mochi-button" onClick={() => {
                                            saveDivision({ keyCode: 9 });
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Save</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }

                                    {
                                        (!isAddingDivision && !isEditingDivision && (selectedDivision?.id || 0) === 0) &&
                                        <div className="mochi-button" onClick={() => {
                                            setIsAddingDivision(true);
                                            setIsEditingDivision(false);
                                            refDivisionName.current.focus();
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Add New Division</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }

                                    {
                                        (!isAddingDivision && !isEditingDivision && (selectedDivision?.id || 0) > 0) &&
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingDivision(true);
                                            setIsAddingDivision(false);
                                            refDivisionName.current.focus();
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Edit Division</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }

                                    <div className="mochi-button" onClick={() => {
                                        searchDivisionBtnClick();
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Search</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className="mochi-button" onClick={() => {
                                        setInitialValues()
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Clear</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                </div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="form-row">
                                <div className={disabledDivisionCodeField}>
                                    <input tabIndex={1 + props.tabTimes} type="text" placeholder="Code" maxLength="8"
                                        id="txt-division-code"
                                        ref={refDivisionCode}
                                        readOnly={isAddingDivision || isEditingDivision}
                                        onKeyDown={(e) => {
                                            searchDivisionByCode(e)
                                        }}
                                        onInput={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                code: e.target.value,
                                                code_number: 0
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                code: e.target.value,
                                                code_number: 0
                                            })
                                        }}
                                        value={(selectedDivision.code_number || 0) === 0 ? (selectedDivision.code || '') : selectedDivision.code + selectedDivision.code_number} />
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledOnAddingEditing + ' grow'}>
                                    <input tabIndex={2 + props.tabTimes} type="text" placeholder="Name"
                                        readOnly={!isAddingDivision && !isEditingDivision}
                                        ref={refDivisionName}
                                        onChange={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                name: e.target.value
                                            })
                                        }}
                                        value={selectedDivision?.name || ''} />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledOnAddingEditing + ' grow'}>
                                    <input tabIndex={3 + props.tabTimes} type="text" placeholder="Address 1"
                                        readOnly={!isAddingDivision && !isEditingDivision}
                                        onChange={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                address1: e.target.value
                                            })
                                        }}
                                        value={selectedDivision?.address1 || ''} />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledOnAddingEditing + ' grow'}>
                                    <input tabIndex={4 + props.tabTimes} type="text" placeholder="Address 2"
                                        readOnly={!isAddingDivision && !isEditingDivision}
                                        onChange={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                address2: e.target.value
                                            })
                                        }}
                                        value={selectedDivision?.address2 || ''} />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledOnAddingEditing + ' grow'}>
                                    <input tabIndex={5 + props.tabTimes} type="text" placeholder="City"
                                        readOnly={!isAddingDivision && !isEditingDivision}
                                        onChange={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                city: e.target.value
                                            })
                                        }}
                                        value={selectedDivision?.city || ''} />
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledOnAddingEditing + ' input-state'}>
                                    <input tabIndex={6 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                        readOnly={!isAddingDivision && !isEditingDivision}
                                        onChange={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                state: e.target.value
                                            })
                                        }}
                                        value={selectedDivision?.state || ''} />
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledOnAddingEditing + ' input-zip-code'}>
                                    <input tabIndex={7 + props.tabTimes} type="text" placeholder="Postal Code"
                                        readOnly={!isAddingDivision && !isEditingDivision}
                                        onChange={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                zip: e.target.value
                                            })
                                        }}
                                        value={selectedDivision?.zip || ''} />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledOnAddingEditing + ' grow'}>
                                    <input tabIndex={8 + props.tabTimes} type="text" placeholder="Contact First Name"
                                        readOnly={!isAddingDivision && !isEditingDivision}
                                        onChange={e => {
                                            setSelectedPrimaryContact({
                                                ...selectedPrimaryContact,
                                                first_name: e.target.value
                                            })
                                        }}
                                        value={selectedPrimaryContact.first_name || ''} />
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledOnAddingEditing + ' grow'}>
                                    <input tabIndex={9 + props.tabTimes} type="text" placeholder="Contact Last Name"
                                        readOnly={!isAddingDivision && !isEditingDivision}
                                        onChange={e => {
                                            setSelectedPrimaryContact({
                                                ...selectedPrimaryContact,
                                                last_name: e.target.value
                                            })
                                        }}
                                        value={selectedPrimaryContact.last_name || ''} />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledOnAddingEditing + ' input-phone'}
                                    style={{ position: 'relative' }}>
                                    <MaskedInput
                                        readOnly={!isAddingDivision && !isEditingDivision}
                                        tabIndex={10 + props.tabTimes}
                                        mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                        guide={true}
                                        type="text" placeholder="Contact Phone"
                                        onInput={(e) => {
                                            setSelectedPrimaryContact(selectedPrimaryContact => {
                                                return {
                                                    ...selectedPrimaryContact,
                                                    primary_phone: (selectedPrimaryContact?.primary_phone || '') === '' ? 'work' : selectedPrimaryContact.primary_phone,
                                                    phone_work: ((selectedPrimaryContact?.primary_phone || '') === 'work' ||
                                                        (selectedPrimaryContact?.primary_phone || '') === '')
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.phone_work || ''),
                                                    phone_work_fax: (selectedPrimaryContact?.primary_phone || '') === 'fax'
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.phone_work_fax || ''),
                                                    phone_mobile: (selectedPrimaryContact?.primary_phone || '') === 'mobile'
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.phone_mobile || ''),
                                                    phone_direct: (selectedPrimaryContact?.primary_phone || '') === 'direct'
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.phone_direct || ''),
                                                    phone_other: (selectedPrimaryContact?.primary_phone || '') === 'other'
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.phone_other || '')
                                                }
                                            })
                                        }}
                                        onChange={(e) => {
                                            setSelectedPrimaryContact(selectedPrimaryContact => {
                                                return {
                                                    ...selectedPrimaryContact,
                                                    primary_phone: (selectedPrimaryContact?.primary_phone || '') === '' ? 'work' : selectedPrimaryContact.primary_phone,
                                                    phone_work: ((selectedPrimaryContact?.primary_phone || '') === 'work' ||
                                                        (selectedPrimaryContact?.primary_phone || '') === '')
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.phone_work || ''),
                                                    phone_work_fax: (selectedPrimaryContact?.primary_phone || '') === 'fax'
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.phone_work_fax || ''),
                                                    phone_mobile: (selectedPrimaryContact?.primary_phone || '') === 'mobile'
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.phone_mobile || ''),
                                                    phone_direct: (selectedPrimaryContact?.primary_phone || '') === 'direct'
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.phone_direct || ''),
                                                    phone_other: (selectedPrimaryContact?.primary_phone || '') === 'other'
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.phone_other || '')
                                                }
                                            })
                                        }}
                                        value={
                                            selectedPrimaryContact?.primary_phone === 'work'
                                                ? (selectedPrimaryContact?.phone_work || '')
                                                : selectedPrimaryContact?.primary_phone === 'fax'
                                                    ? (selectedPrimaryContact?.phone_work_fax || '')
                                                    : selectedPrimaryContact?.primary_phone === 'mobile'
                                                        ? (selectedPrimaryContact?.phone_mobile || '')
                                                        : selectedPrimaryContact?.primary_phone === 'direct'
                                                            ? (selectedPrimaryContact?.phone_direct || '')
                                                            : selectedPrimaryContact?.primary_phone === 'other'
                                                                ? (selectedPrimaryContact?.phone_other || '')
                                                                : ''
                                        }
                                    />

                                    {
                                        ((selectedPrimaryContact?.id || 0) > 0) &&
                                        <div
                                            className={classnames({
                                                'selected-division-contact-primary-phone': true,
                                                'pushed': false
                                            })}>
                                            {selectedPrimaryContact?.primary_phone || ''}
                                        </div>
                                    }
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledOnAddingEditing + ' input-phone-ext'}>
                                    <input tabIndex={11 + props.tabTimes} type="text" placeholder="Ext"
                                        readOnly={!isAddingDivision && !isEditingDivision}
                                        onInput={e => {
                                            setSelectedPrimaryContact(selectedPrimaryContact => {
                                                return {
                                                    ...selectedPrimaryContact,
                                                    phone_ext: e.target.value
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedPrimaryContact(selectedPrimaryContact => {
                                                return {
                                                    ...selectedPrimaryContact,
                                                    phone_ext: e.target.value
                                                }
                                            })
                                        }}
                                        value={selectedPrimaryContact?.phone_ext || ''}
                                    />
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledOnAddingEditing}
                                    style={{ position: 'relative', flexGrow: 1, minWidth: '50%' }}
                                    onMouseEnter={() => {
                                        if ((selectedPrimaryContact?.email_work || '') !== '' ||
                                            (selectedPrimaryContact?.email_personal || '') !== '' ||
                                            (selectedPrimaryContact?.email_other || '') !== '') {
                                            setShowDivisionEmailCopyBtn(true);
                                        }
                                    }}
                                    onFocus={() => {
                                        if ((selectedPrimaryContact?.email_work || '') !== '' ||
                                            (selectedPrimaryContact?.email_personal || '') !== '' ||
                                            (selectedPrimaryContact?.email_other || '') !== '') {
                                            setShowDivisionEmailCopyBtn(true);
                                        }
                                    }}
                                    onBlur={() => {
                                        window.setTimeout(() => {
                                            setShowDivisionEmailCopyBtn(false);
                                        }, 1000);
                                    }}
                                    onMouseLeave={() => {
                                        setShowDivisionEmailCopyBtn(false);
                                    }}
                                >
                                    <input tabIndex={12 + props.tabTimes}
                                        readOnly={!isAddingDivision && !isEditingDivision}
                                        ref={refDivisionEmail}
                                        type="text"
                                        placeholder="E-Mail"
                                        style={{ textTransform: 'lowercase' }}
                                        onInput={e => {
                                            setSelectedPrimaryContact(selectedPrimaryContact => {
                                                return {
                                                    ...selectedPrimaryContact,
                                                    primary_email: (selectedPrimaryContact?.primary_email || '') === '' ? 'work' : selectedPrimaryContact.primary_email,
                                                    email_work: ((selectedPrimaryContact?.primary_email || '') === 'work' ||
                                                        (selectedPrimaryContact?.primary_email || '') === '')
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.email_work || ''),
                                                    email_personal: (selectedPrimaryContact?.primary_email || '') === 'personal'
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.email_personal || ''),
                                                    email_other: (selectedPrimaryContact?.primary_email || '') === 'other'
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.email_other || '')
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedPrimaryContact(selectedPrimaryContact => {
                                                return {
                                                    ...selectedPrimaryContact,
                                                    primary_email: (selectedPrimaryContact?.primary_email || '') === '' ? 'work' : selectedPrimaryContact.primary_email,
                                                    email_work: ((selectedPrimaryContact?.primary_email || '') === 'work' ||
                                                        (selectedPrimaryContact?.primary_email || '') === '')
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.email_work || ''),
                                                    email_personal: (selectedPrimaryContact?.primary_email || '') === 'personal'
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.email_personal || ''),
                                                    email_other: (selectedPrimaryContact?.primary_email || '') === 'other'
                                                        ? e.target.value
                                                        : (selectedPrimaryContact?.email_other || '')
                                                }
                                            })
                                        }}
                                        value={
                                            selectedPrimaryContact?.primary_email === 'work'
                                                ? (selectedPrimaryContact?.email_work || '')
                                                : selectedPrimaryContact?.primary_email === 'personal'
                                                    ? (selectedPrimaryContact?.email_personal || '')
                                                    : selectedPrimaryContact?.primary_email === 'other'
                                                        ? (selectedPrimaryContact?.email_other || '')
                                                        : ''
                                        }
                                    />
                                    {
                                        ((selectedPrimaryContact?.id || 0) > 0) &&
                                        <div
                                            className={classnames({
                                                'selected-division-contact-primary-email': true,
                                                'pushed': false
                                            })}>
                                            {selectedPrimaryContact?.primary_email || ''}
                                        </div>
                                    }

                                    {
                                        showDivisionEmailCopyBtn &&
                                        <FontAwesomeIcon style={{
                                            position: 'absolute',
                                            top: '50%',
                                            right: 30,
                                            zIndex: 1,
                                            cursor: 'pointer',
                                            transform: 'translateY(-50%)',
                                            color: '#2bc1ff',
                                            margin: 0,
                                            transition: 'ease 0.2s',
                                            fontSize: '1rem'
                                        }} icon={faCopy} onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(refDivisionEmail.current.value);
                                        }} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fields-container-row">
                        {/*CONTACTS FORM*/}
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Contacts</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div className="mochi-button" onClick={async () => {
                                        if (selectedDivision?.id === undefined) {
                                            window.alert('You must select a division first!');
                                            return;
                                        }

                                        if (selectedContact.id === undefined) {
                                            window.alert('You must select a contact');
                                            return;
                                        }

                                        let panel = {
                                            panelName: `${props.panelName}-contacts`,
                                            component: <Contacts
                                                title='Contacts'
                                                tabTimes={22000 + props.tabTimes}
                                                panelName={`${props.panelName}-contacts`}
                                                savingContactUrl='/saveDivisionContact'
                                                deletingContactUrl='/deleteDivisionContact'
                                                uploadAvatarUrl='/uploadDivisionContactAvatar'
                                                removeAvatarUrl='/removeDivisioContactAvatar'
                                                origin={props.origin}
                                                owner='division'
                                                closingCallback={() => {
                                                    closePanel(`${props.panelName}-contacts`, props.origin);
                                                    refDivisionCode.current.focus({ preventScroll: true });
                                                }}

                                                componentId={moment().format('x')}

                                                contactSearchCustomer={{
                                                    ...selectedDivision,
                                                    selectedContact: {
                                                        ...selectedContact,
                                                        address1: (selectedDivision?.address1 || '').toLowerCase() === (selectedContact?.address1 || '').toLowerCase() ? (selectedDivision?.address1 || '') : (selectedContact?.address1 || ''),
                                                        address2: (selectedDivision?.address2 || '').toLowerCase() === (selectedContact?.address2 || '').toLowerCase() ? (selectedDivision?.address2 || '') : (selectedContact?.address2 || ''),
                                                        city: (selectedDivision?.city || '').toLowerCase() === (selectedContact?.city || '').toLowerCase() ? (selectedDivision?.city || '') : (selectedContact?.city || ''),
                                                        state: (selectedDivision?.state || '').toLowerCase() === (selectedContact?.state || '').toLowerCase() ? (selectedDivision?.state || '') : (selectedContact?.state || ''),
                                                        zip_code: (selectedDivision?.zip || '').toLowerCase() === (selectedContact?.zip_code || '').toLowerCase() ? (selectedDivision?.zip || '') : (selectedContact?.zip_code || ''),
                                                    }
                                                }}
                                                selectedDivision={selectedDivision}
                                                setSelectedDivision={setSelectedDivision}
                                                setSelectedDivisionContact={setSelectedContact}
                                            />
                                        }

                                        openPanel(panel, props.origin);
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">More</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className="mochi-button" onClick={() => {
                                        if ((selectedDivision?.id || 0) === 0) {
                                            window.alert('You must select a division first!');
                                            return;
                                        }

                                        let panel = {
                                            panelName: `${props.panelName}-contacts`,
                                            component: <Contacts
                                                title='Contacts'
                                                tabTimes={22000 + props.tabTimes}
                                                panelName={`${props.panelName}-contacts`}
                                                savingContactUrl='/saveDivisionContact'
                                                deletingContactUrl='/deleteDivisionContact'
                                                uploadAvatarUrl='/uploadDivisionContactAvatar'
                                                removeAvatarUrl='/removeDivisioContactAvatar'
                                                origin={props.origin}
                                                owner='division'
                                                closingCallback={() => {
                                                    closePanel(`${props.panelName}-contacts`, props.origin);
                                                    refDivisionCode.current.focus({ preventScroll: true });
                                                }}

                                                componentId={moment().format('x')}
                                                isEditingContact={true}

                                                contactSearchCustomer={{
                                                    ...selectedDivision,
                                                    selectedContact: { id: 0, division_id: selectedDivision?.id }
                                                }}

                                                selectedDivision={selectedDivision}
                                                setSelectedDivision={setSelectedDivision}
                                                setSelectedDivisionContact={setSelectedContact}
                                            />
                                        }

                                        openPanel(panel, props.origin);
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Add Contact</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className="mochi-button" onClick={() => {
                                        setSelectedContact({});
                                        refDivisionContactFirstName.current.focus();
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Clear</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                </div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="form-row">
                                <div className={disabledDivisionContactFields + ' input-box-container grow'}>
                                    <input tabIndex={13 + props.tabTimes} type="text" placeholder="First Name"
                                        ref={refDivisionContactFirstName}
                                        onChange={e => {
                                            setSelectedContact({ ...selectedContact, first_name: e.target.value })
                                        }}
                                        value={selectedContact?.first_name || ''} />
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledDivisionContactFields + ' input-box-container grow'}>
                                    <input tabIndex={14 + props.tabTimes} type="text" placeholder="Last Name"
                                        onChange={e => setSelectedContact({
                                            ...selectedContact,
                                            last_name: e.target.value
                                        })}
                                        value={selectedContact?.last_name || ''} />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledDivisionContactFields + ' select-box-container'}
                                    style={{ width: '50%' }}>
                                    <div className="select-box-wrapper">
                                        <MaskedInput tabIndex={15 + props.tabTimes}
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text"
                                            placeholder="Phone"
                                            ref={refDivisionContactPhone}
                                            onKeyDown={async (e) => {
                                                let key = e.keyCode || e.which;

                                                switch (key) {
                                                    case 37:
                                                    case 38: // arrow left | arrow up
                                                        e.preventDefault();
                                                        if (showDivisionContactPhones) {
                                                            let selectedIndex = divisionContactPhoneItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setDivisionContactPhoneItems(divisionContactPhoneItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setDivisionContactPhoneItems(divisionContactPhoneItems.map((item, index) => {
                                                                    if (selectedIndex === 0) {
                                                                        item.selected = index === (divisionContactPhoneItems.length - 1);
                                                                    } else {
                                                                        item.selected = index === (selectedIndex - 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refDivisionContactPhonePopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            if (divisionContactPhoneItems.length > 1) {
                                                                await setDivisionContactPhoneItems(divisionContactPhoneItems.map((item, index) => {
                                                                    item.selected = item.type === (selectedContact?.primary_phone || '')
                                                                    return item;
                                                                }))

                                                                setShowDivisionContactPhones(true);

                                                                refDivisionContactPhonePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }
                                                        break;

                                                    case 39:
                                                    case 40: // arrow right | arrow down
                                                        e.preventDefault();
                                                        if (showDivisionContactPhones) {
                                                            let selectedIndex = divisionContactPhoneItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setDivisionContactPhoneItems(divisionContactPhoneItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setDivisionContactPhoneItems(divisionContactPhoneItems.map((item, index) => {
                                                                    if (selectedIndex === (divisionContactPhoneItems.length - 1)) {
                                                                        item.selected = index === 0;
                                                                    } else {
                                                                        item.selected = index === (selectedIndex + 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refDivisionContactPhonePopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            if (divisionContactPhoneItems.length > 1) {
                                                                await setDivisionContactPhoneItems(divisionContactPhoneItems.map((item, index) => {
                                                                    item.selected = item.type === (selectedContact?.primary_phone || '')
                                                                    return item;
                                                                }))

                                                                setShowDivisionContactPhones(true);

                                                                refDivisionContactPhonePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }
                                                        break;

                                                    case 27: // escape
                                                        setShowDivisionContactPhones(false);
                                                        break;

                                                    case 13: // enter
                                                        if (showDivisionContactPhones && divisionContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                            await setSelectedContact({
                                                                ...selectedContact,
                                                                primary_phone: divisionContactPhoneItems[divisionContactPhoneItems.findIndex(item => item.selected)].type
                                                            });

                                                            // validateContactForSaving({ keyCode: 9 });
                                                            setShowDivisionContactPhones(false);
                                                            refDivisionContactPhone.current.inputElement.focus();
                                                        }
                                                        break;

                                                    case 9: // tab
                                                        if (showDivisionContactPhones) {
                                                            e.preventDefault();
                                                            await setSelectedContact({
                                                                ...selectedContact,
                                                                primary_phone: divisionContactPhoneItems[divisionContactPhoneItems.findIndex(item => item.selected)].type
                                                            });

                                                            // validateContactForSaving({ keyCode: 9 });
                                                            setShowDivisionContactPhones(false);
                                                            refDivisionContactPhone.current.inputElement.focus();
                                                        } else {
                                                            // validateContactForSaving({ keyCode: 9 });
                                                        }
                                                        break;

                                                    default:
                                                        break;
                                                }
                                            }}
                                            onInput={(e) => {
                                                if ((selectedContact?.id || 0) === 0) {
                                                    setSelectedContact({
                                                        ...selectedContact,
                                                        phone_work: e.target.value,
                                                        primary_phone: 'work'
                                                    });
                                                } else {
                                                    if ((selectedContact?.primary_phone || '') === '') {
                                                        setSelectedContact({
                                                            ...selectedContact,
                                                            phone_work: e.target.value,
                                                            primary_phone: 'work'
                                                        });
                                                    } else {
                                                        switch (selectedContact?.primary_phone) {
                                                            case 'work':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    phone_work: e.target.value
                                                                });
                                                                break;
                                                            case 'fax':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    phone_work_fax: e.target.value
                                                                });
                                                                break;
                                                            case 'mobile':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    phone_mobile: e.target.value
                                                                });
                                                                break;
                                                            case 'direct':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    phone_direct: e.target.value
                                                                });
                                                                break;
                                                            case 'other':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    phone_other: e.target.value
                                                                });
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    }
                                                }
                                            }}
                                            onChange={(e) => {
                                                if ((selectedContact?.id || 0) === 0) {
                                                    setSelectedContact({
                                                        ...selectedContact,
                                                        phone_work: e.target.value,
                                                        primary_phone: 'work'
                                                    });
                                                } else {
                                                    if ((selectedContact?.primary_phone || '') === '') {
                                                        setSelectedContact({
                                                            ...selectedContact,
                                                            phone_work: e.target.value,
                                                            primary_phone: 'work'
                                                        });
                                                    } else {
                                                        switch (selectedContact?.primary_phone) {
                                                            case 'work':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    phone_work: e.target.value
                                                                });
                                                                break;
                                                            case 'fax':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    phone_work_fax: e.target.value
                                                                });
                                                                break;
                                                            case 'mobile':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    phone_mobile: e.target.value
                                                                });
                                                                break;
                                                            case 'direct':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    phone_direct: e.target.value
                                                                });
                                                                break;
                                                            case 'other':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    phone_other: e.target.value
                                                                });
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    }
                                                }
                                            }}
                                            value={
                                                (selectedContact?.primary_phone || '') === 'work'
                                                    ? (selectedContact?.phone_work || '')
                                                    : (selectedContact?.primary_phone || '') === 'fax'
                                                        ? (selectedContact?.phone_work_fax || '')
                                                        : (selectedContact?.primary_phone || '') === 'mobile'
                                                            ? (selectedContact?.phone_mobile || '')
                                                            : (selectedContact?.primary_phone || '') === 'direct'
                                                                ? (selectedContact?.phone_direct || '')
                                                                : (selectedContact?.primary_phone || '') === 'other'
                                                                    ? (selectedContact?.phone_other || '')
                                                                    : ''
                                            }
                                        />

                                        {
                                            (selectedContact?.id || 0) > 0 &&
                                            <div
                                                className={classnames({
                                                    'selected-division-contact-primary-phone': true,
                                                    'pushed': (divisionContactPhoneItems.length > 1)
                                                })}>
                                                {selectedContact?.primary_phone || ''}
                                            </div>
                                        }

                                        {
                                            divisionContactPhoneItems.length > 1 &&
                                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                                onClick={async () => {
                                                    if (showDivisionContactPhones) {
                                                        setShowDivisionContactPhones(false);
                                                    } else {
                                                        if (divisionContactPhoneItems.length > 1) {
                                                            await setDivisionContactPhoneItems(divisionContactPhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedContact?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            window.setTimeout(async () => {
                                                                await setShowDivisionContactPhones(true);

                                                                refDivisionContactPhonePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }, 0)
                                                        }
                                                    }

                                                    refDivisionContactPhone.current.inputElement.focus();
                                                }} />
                                        }
                                    </div>
                                    {
                                        divisionContactPhonesTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-contact-phone"
                                                style={{
                                                    ...style,
                                                    left: '0',
                                                    display: 'block'
                                                }}
                                                ref={refDivisionContactPhoneDropDown}
                                            >
                                                <div className="mochi-contextual-popup vertical below right"
                                                    style={{ height: 150 }}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {
                                                                divisionContactPhoneItems.map((item, index) => {
                                                                    const mochiItemClasses = classnames({
                                                                        'mochi-item': true,
                                                                        'selected': item.selected
                                                                    });

                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={mochiItemClasses}
                                                                            id={item.id}
                                                                            onClick={async () => {
                                                                                await setSelectedContact({
                                                                                    ...selectedContact,
                                                                                    primary_phone: item.type
                                                                                });

                                                                                // validateContactForSaving({ keyCode: 9 });
                                                                                setShowDivisionContactPhones(false);
                                                                                refDivisionContactPhone.current.inputElement.focus();
                                                                            }}
                                                                            ref={ref => refDivisionContactPhonePopupItems.current.push(ref)}
                                                                        >
                                                                            {
                                                                                item.type === 'work' ? `Phone Work `
                                                                                    : item.type === 'fax' ? `Phone Work Fax `
                                                                                        : item.type === 'mobile' ? `Phone Mobile `
                                                                                            : item.type === 'direct' ? `Phone Direct `
                                                                                                : item.type === 'other' ? `Phone Other ` : ''
                                                                            }

                                                                            (<b>
                                                                                {
                                                                                    item.type === 'work' ? item.phone
                                                                                        : item.type === 'fax' ? item.phone
                                                                                            : item.type === 'mobile' ? item.phone
                                                                                                : item.type === 'direct' ? item.phone
                                                                                                    : item.type === 'other' ? item.phone : ''
                                                                                }
                                                                            </b>)

                                                                            {
                                                                                item.selected &&
                                                                                <FontAwesomeIcon
                                                                                    className="dropdown-selected"
                                                                                    icon={faCaretRight} />
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </animated.div>
                                        ))
                                    }
                                </div>
                                <div className="form-h-sep"></div>
                                <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div
                                        className={disabledDivisionContactFields + ' input-box-container input-phone-ext'}>
                                        <input tabIndex={16 + props.tabTimes} type="text" placeholder="Ext"
                                            // onKeyDown={validateContactForSaving}
                                            onChange={e => setSelectedContact({
                                                ...selectedContact,
                                                phone_ext: e.target.value
                                            })}
                                            value={selectedContact.phone_ext || ''} />
                                    </div>
                                    <div className={disabledDivisionContactFields + ' input-toggle-container'}>
                                        <input type="checkbox"
                                            id={props.panelName + '-cbox-division-contacts-primary-btn'}
                                            onChange={(e) => {
                                                setSelectedContact({
                                                    ...selectedContact,
                                                    is_primary: e.target.checked ? 1 : 0
                                                });

                                                saveContact({ keyCode: 9 });
                                            }}
                                            checked={(selectedContact.is_primary || 0) === 1} />
                                        <label htmlFor={props.panelName + '-cbox-division-contacts-primary-btn'}>
                                            <div className="label-text">Primary</div>
                                            <div className="input-toggle-btn"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledDivisionContactFields + ' select-box-container'}
                                    style={{ flexGrow: 1 }}
                                    onMouseEnter={() => {
                                        if ((selectedContact?.email_work || '') !== '' ||
                                            (selectedContact?.email_personal || '') !== '' ||
                                            (selectedContact?.email_other || '') !== '') {
                                            setShowDivisionContactEmailCopyBtn(true);
                                        }
                                    }}
                                    onFocus={() => {
                                        if ((selectedContact?.email_work || '') !== '' ||
                                            (selectedContact?.email_personal || '') !== '' ||
                                            (selectedContact?.email_other || '') !== '') {
                                            setShowDivisionContactEmailCopyBtn(true);
                                        }
                                    }}
                                    onBlur={() => {
                                        window.setTimeout(() => {
                                            setShowDivisionContactEmailCopyBtn(false);
                                        }, 1000);
                                    }}
                                    onMouseLeave={() => {
                                        setShowDivisionContactEmailCopyBtn(false);
                                    }}>
                                    <div className="select-box-wrapper">
                                        <input
                                            style={{
                                                width: 'calc(100% - 25px)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                            tabIndex={17 + props.tabTimes}
                                            type="text"
                                            placeholder="E-Mail"
                                            ref={refDivisionContactEmail}
                                            onKeyDown={async (e) => {
                                                let key = e.keyCode || e.which;

                                                switch (key) {
                                                    case 37:
                                                    case 38: // arrow left | arrow up
                                                        e.preventDefault();
                                                        if (showDivisionContactEmails) {
                                                            let selectedIndex = divisionContactEmailItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setDivisionContactEmailItems(divisionContactEmailItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setDivisionContactEmailItems(divisionContactEmailItems.map((item, index) => {
                                                                    if (selectedIndex === 0) {
                                                                        item.selected = index === (divisionContactEmailItems.length - 1);
                                                                    } else {
                                                                        item.selected = index === (selectedIndex - 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refDivisionContactEmailPopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            if (divisionContactEmailItems.length > 1) {
                                                                await setDivisionContactEmailItems(divisionContactEmailItems.map((item, index) => {
                                                                    item.selected = item.type === (selectedContact?.primary_email || '')
                                                                    return item;
                                                                }))

                                                                setShowDivisionContactEmails(true);

                                                                refDivisionContactEmailPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }
                                                        break;

                                                    case 39:
                                                    case 40: // arrow right | arrow down
                                                        e.preventDefault();
                                                        if (showDivisionContactEmails) {
                                                            let selectedIndex = divisionContactEmailItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setDivisionContactEmailItems(divisionContactEmailItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setDivisionContactEmailItems(divisionContactEmailItems.map((item, index) => {
                                                                    if (selectedIndex === (divisionContactEmailItems.length - 1)) {
                                                                        item.selected = index === 0;
                                                                    } else {
                                                                        item.selected = index === (selectedIndex + 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refDivisionContactEmailPopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            if (divisionContactEmailItems.length > 1) {
                                                                await setDivisionContactEmailItems(divisionContactEmailItems.map((item, index) => {
                                                                    item.selected = item.type === (selectedContact?.primary_email || '')
                                                                    return item;
                                                                }))

                                                                setShowDivisionContactEmails(true);

                                                                refDivisionContactEmailPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }
                                                        break;

                                                    case 27: // escape
                                                        setShowDivisionContactEmails(false);
                                                        break;

                                                    case 13: // enter
                                                        if (showDivisionContactEmails && divisionContactEmailItems.findIndex(item => item.selected) > -1) {
                                                            await setSelectedContact({
                                                                ...selectedContact,
                                                                primary_email: divisionContactEmailItems[divisionContactEmailItems.findIndex(item => item.selected)].type
                                                            });

                                                            // validateContactForSaving({ keyCode: 9 });
                                                            setShowDivisionContactEmails(false);
                                                            refDivisionContactEmail.current.focus();
                                                        }
                                                        break;

                                                    case 9: // tab
                                                        if (showDivisionContactEmails) {
                                                            e.preventDefault();
                                                            await setSelectedContact({
                                                                ...selectedContact,
                                                                primary_email: divisionContactEmailItems[divisionContactEmailItems.findIndex(item => item.selected)].type
                                                            });

                                                            // validateContactForSaving({ keyCode: 9 });
                                                            setShowDivisionContactEmails(false);
                                                            refDivisionContactEmail.current.focus();
                                                        } else {
                                                            // validateContactForSaving({ keyCode: 9 });
                                                        }
                                                        break;

                                                    default:
                                                        break;
                                                }
                                            }}
                                            onInput={(e) => {
                                                if ((selectedContact?.id || 0) === 0) {
                                                    setSelectedContact({
                                                        ...selectedContact,
                                                        email_work: e.target.value,
                                                        primary_email: 'work'
                                                    });
                                                } else {
                                                    if ((selectedContact?.primary_email || '') === '') {
                                                        setSelectedContact({
                                                            ...selectedContact,
                                                            email_work: e.target.value,
                                                            primary_email: 'work'
                                                        });
                                                    } else {
                                                        switch (selectedContact?.primary_email) {
                                                            case 'work':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    email_work: e.target.value
                                                                });
                                                                break;
                                                            case 'personal':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    email_personal: e.target.value
                                                                });
                                                                break;
                                                            case 'other':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    email_other: e.target.value
                                                                });
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    }
                                                }
                                            }}
                                            onChange={(e) => {
                                                if ((selectedContact?.id || 0) === 0) {
                                                    setSelectedContact({
                                                        ...selectedContact,
                                                        email_work: e.target.value,
                                                        primary_email: 'work'
                                                    });
                                                } else {
                                                    if ((selectedContact?.primary_email || '') === '') {
                                                        setSelectedContact({
                                                            ...selectedContact,
                                                            email_work: e.target.value,
                                                            primary_email: 'work'
                                                        });
                                                    } else {
                                                        switch (selectedContact?.primary_email) {
                                                            case 'work':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    email_work: e.target.value
                                                                });
                                                                break;
                                                            case 'personal':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    email_personal: e.target.value
                                                                });
                                                                break;
                                                            case 'other':
                                                                setSelectedContact({
                                                                    ...selectedContact,
                                                                    email_other: e.target.value
                                                                });
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    }
                                                }
                                            }}
                                            value={
                                                (selectedContact?.primary_email || '') === 'work'
                                                    ? (selectedContact?.email_work || '')
                                                    : (selectedContact?.primary_email || '') === 'personal'
                                                        ? (selectedContact?.email_personal || '')
                                                        : (selectedContact?.primary_email || '') === 'other'
                                                            ? (selectedContact?.email_other || '')
                                                            : ''
                                            }
                                        />

                                        {
                                            showDivisionContactEmailCopyBtn &&
                                            <FontAwesomeIcon style={{
                                                position: 'absolute',
                                                top: '50%',
                                                right: 30,
                                                zIndex: 1,
                                                cursor: 'pointer',
                                                transform: 'translateY(-50%)',
                                                color: '#2bc1ff',
                                                margin: 0,
                                                transition: 'ease 0.2s',
                                                fontSize: '1rem'
                                            }} icon={faCopy} onClick={(e) => {
                                                e.stopPropagation();
                                                navigator.clipboard.writeText(refDivisionContactEmail.current.value);
                                            }} />
                                        }

                                        {
                                            (selectedContact?.id || 0) > 0 &&
                                            <div
                                                className={classnames({
                                                    'selected-division-contact-primary-email': true,
                                                    'pushed': (divisionContactEmailItems.length > 1)
                                                })}>
                                                {selectedContact?.primary_email || ''}
                                            </div>
                                        }

                                        {
                                            divisionContactEmailItems.length > 1 &&
                                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                                onClick={async () => {
                                                    if (showDivisionContactEmails) {
                                                        setShowDivisionContactEmails(false);
                                                    } else {
                                                        if (divisionContactEmailItems.length > 1) {
                                                            await setDivisionContactEmailItems(divisionContactEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedContact?.primary_email || '')
                                                                return item;
                                                            }))

                                                            window.setTimeout(async () => {
                                                                await setShowDivisionContactEmails(true);

                                                                refDivisionContactEmailPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }, 0)
                                                        }
                                                    }

                                                    refDivisionContactEmail.current.focus();
                                                }} />
                                        }
                                    </div>
                                    {
                                        divisionContactEmailsTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-contact-email"
                                                style={{
                                                    ...style,
                                                    left: '0',
                                                    display: 'block'
                                                }}
                                                ref={refDivisionContactEmailDropDown}
                                            >
                                                <div className="mochi-contextual-popup vertical below right"
                                                    style={{ height: 150 }}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {
                                                                divisionContactEmailItems.map((item, index) => {
                                                                    const mochiItemClasses = classnames({
                                                                        'mochi-item': true,
                                                                        'selected': item.selected
                                                                    });

                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={mochiItemClasses}
                                                                            id={item.id}
                                                                            onClick={async () => {
                                                                                await setSelectedContact({
                                                                                    ...selectedContact,
                                                                                    primary_email: item.type
                                                                                });

                                                                                // validateContactForSaving({ keyCode: 9 });
                                                                                setShowDivisionContactEmails(false);
                                                                                refDivisionContactEmail.current.focus();
                                                                            }}
                                                                            ref={ref => refDivisionContactEmailPopupItems.current.push(ref)}
                                                                        >
                                                                            {
                                                                                item.type === 'work' ? `Email Work `
                                                                                    : item.type === 'personal' ? `Email Personal `
                                                                                        : item.type === 'other' ? `Email Other ` : ''
                                                                            }

                                                                            (<b>
                                                                                {
                                                                                    item.type === 'work' ? item.email
                                                                                        : item.type === 'personal' ? item.email
                                                                                            : item.type === 'other' ? item.email : ''
                                                                                }
                                                                            </b>)

                                                                            {
                                                                                item.selected &&
                                                                                <FontAwesomeIcon
                                                                                    className="dropdown-selected"
                                                                                    icon={faCaretRight} />
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </animated.div>
                                        ))
                                    }
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledDivisionContactFields + ' input-box-container grow'}>
                                    <input tabIndex={18 + props.tabTimes} type="text" placeholder="Notes"
                                        onKeyDown={(e) => {
                                            let key = e.keyCode || e.which;

                                            if (key === 9) {
                                                saveContact(e);
                                            }
                                        }}
                                        onChange={e => setSelectedContact({
                                            ...selectedContact,
                                            notes: e.target.value
                                        })}
                                        value={selectedContact.notes || ''}
                                    />
                                </div>
                            </div>
                        </div>

                        {/*CONTACT LIST*/}
                        <div className="form-bordered-box" style={{ height: 140 }}>
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    {
                                        showingContactList &&
                                        <div className="mochi-button" onClick={() => setShowingContactList(false)}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Search</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        !showingContactList &&
                                        <div className="mochi-button" onClick={() => setShowingContactList(true)}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Cancel</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }

                                    {
                                        !showingContactList &&
                                        <div className="mochi-button" onClick={() => {
                                            handleContactSearch()
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Send</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                </div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="form-slider">
                                <div className="form-slider-wrapper" style={{ left: showingContactList ? 0 : '-100%' }}>
                                    <div className="contact-list-box">
                                        {
                                            (selectedDivision?.contacts || []).length > 0 &&
                                            <div className="contact-list-header">
                                                <div className="contact-list-col tcol first-name">First Name</div>
                                                <div className="contact-list-col tcol last-name">Last Name</div>
                                                <div className="contact-list-col tcol phone-work">Phone</div>
                                                <div className="contact-list-col tcol email-work">E-Mail</div>
                                                <div className="contact-list-col tcol contact-selected"></div>
                                                <div className="contact-list-col tcol pri"></div>
                                            </div>
                                        }

                                        <div className="contact-list-wrapper">
                                            {
                                                (selectedDivision?.contacts || []).map((contact, index) => {
                                                    return (
                                                        <div className="contact-list-item" key={index}
                                                            onDoubleClick={async () => {
                                                                let panel = {
                                                                    panelName: `${props.panelName}-contacts`,
                                                                    component: <Contacts
                                                                        title='Contacts'
                                                                        tabTimes={22000 + props.tabTimes}
                                                                        panelName={`${props.panelName}-contacts`}
                                                                        savingContactUrl='/saveContact'
                                                                        deletingContactUrl='/deleteContact'
                                                                        uploadAvatarUrl='/uploadAvatar'
                                                                        removeAvatarUrl='/removeAvatar'
                                                                        origin={props.origin}
                                                                        owner='division'
                                                                        closingCallback={() => {
                                                                            closePanel(`${props.panelName}-contacts`, props.origin);
                                                                            refDivisionCode.current.focus({ preventScroll: true });
                                                                        }}

                                                                        componentId={moment().format('x')}

                                                                        contactSearchCustomer={{
                                                                            ...selectedDivision,
                                                                            selectedContact: contact
                                                                        }}
                                                                    />
                                                                }

                                                                openPanel(panel, props.origin);
                                                            }} onClick={() => setSelectedContact(contact)}>
                                                            <div
                                                                className="contact-list-col tcol first-name">{contact.first_name}</div>
                                                            <div
                                                                className="contact-list-col tcol last-name">{contact.last_name}</div>
                                                            <div className="contact-list-col tcol phone-work">{
                                                                contact.primary_phone === 'work' ? contact.phone_work
                                                                    : contact.primary_phone === 'fax' ? contact.phone_work_fax
                                                                        : contact.primary_phone === 'mobile' ? contact.phone_mobile
                                                                            : contact.primary_phone === 'direct' ? contact.phone_direct
                                                                                : contact.primary_phone === 'other' ? contact.phone_other
                                                                                    : ''
                                                            }</div>
                                                            <div className="contact-list-col tcol email-work">{
                                                                contact.primary_email === 'work' ? contact.email_work
                                                                    : contact.primary_email === 'personal' ? contact.email_personal
                                                                        : contact.primary_email === 'other' ? contact.email_other
                                                                            : ''
                                                            }</div>
                                                            {
                                                                (contact.id === (selectedContact?.id || 0)) &&
                                                                <div className="contact-list-col tcol contact-selected">
                                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                                </div>
                                                            }
                                                            {
                                                                (contact.is_primary === 1) &&
                                                                <div className="contact-list-col tcol pri">
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </div>
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>

                                    </div>
                                    <div className="contact-search-box">
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="First Name"
                                                    onChange={e => setContactSearch({
                                                        ...contactSearch,
                                                        first_name: e.target.value
                                                    })} value={contactSearch.first_name || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Last Name" onFocus={() => {
                                                    setShowingContactList(false)
                                                }} onChange={e => setContactSearch({
                                                    ...contactSearch,
                                                    last_name: e.target.value
                                                })} value={contactSearch.last_name || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Address 1" onFocus={() => {
                                                    setShowingContactList(false)
                                                }} onChange={e => setContactSearch({
                                                    ...contactSearch,
                                                    address1: e.target.value
                                                })} value={contactSearch.address1 || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Address 2" onFocus={() => {
                                                    setShowingContactList(false)
                                                }} onChange={e => setContactSearch({
                                                    ...contactSearch,
                                                    address2: e.target.value
                                                })} value={contactSearch.address2 || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="City" onFocus={() => {
                                                    setShowingContactList(false)
                                                }} onChange={e => setContactSearch({
                                                    ...contactSearch,
                                                    city: e.target.value
                                                })} value={contactSearch.city || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container input-state">
                                                <input type="text" placeholder="State" maxLength="2" onFocus={() => {
                                                    setShowingContactList(false)
                                                }} onChange={e => setContactSearch({
                                                    ...contactSearch,
                                                    state: e.target.value
                                                })} value={contactSearch.state || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <MaskedInput
                                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={true}
                                                    type="text" placeholder="Phone (Work/Mobile/Fax)" onFocus={() => {
                                                        setShowingContactList(false)
                                                    }} onChange={e => setContactSearch({
                                                        ...contactSearch,
                                                        phone: e.target.value
                                                    })} value={contactSearch.phone || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="E-Mail"
                                                    style={{ textTransform: 'lowercase' }}
                                                    onKeyDown={(e) => {
                                                        e.preventDefault();
                                                        let key = e.keyCode || e.which;

                                                        if (key === 9) {
                                                            let elems = document.getElementsByTagName('input');

                                                            for (var i = elems.length; i--;) {
                                                                if (elems[i].getAttribute('tabindex') && elems[i].getAttribute('tabindex') === '29') {
                                                                    elems[i].focus();
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }}
                                                    onFocus={() => {
                                                        setShowingContactList(false)
                                                    }}
                                                    onChange={e => setContactSearch({
                                                        ...contactSearch,
                                                        email: e.target.value
                                                    })}
                                                    value={contactSearch.email || ''} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fields-container-row grow">
                        {/*NOTES LIST*/}
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Notes</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div className="mochi-button" onClick={() => {
                                        if ((selectedDivision?.id || 0) === 0) {
                                            window.alert('You must select a division first!');
                                            return;
                                        }

                                        setSelectedNote({ id: 0, division_id: selectedDivision.id })
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Add Note</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className="mochi-button" onClick={() => {
                                        if (selectedDivision?.id === undefined || selectedDivision?.notes.length === 0) {
                                            window.alert('There is nothing to print!');
                                            return;
                                        }

                                        let html = ``;

                                        selectedDivision?.notes.map((note, index) => {
                                            html += `<div><b>${note.user_code?.code} : ${moment(note.date_time, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY : HHmm')}</b> : ${note.text}</div>`

                                            return true;
                                        })

                                        printWindow(html);
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Print</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                </div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="notes-list-container">
                                <div className="notes-list-wrapper">
                                    {
                                        (selectedDivision?.notes || []).map((note, index) => {
                                            return (
                                                <div className="notes-list-item" key={index}
                                                    onClick={() => setSelectedNote(note)}>
                                                    <div className="notes-list-col tcol note-text">{note.text}</div>
                                                    {
                                                        (note.id === (selectedNote?.id || 0)) &&
                                                        <div className="notes-list-col tcol notes-selected">
                                                            <FontAwesomeIcon icon={faPencilAlt} />
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="fields-container-col">
                    <div className="fields-container-row" style={{ display: 'flex', flexDirection: 'row' }}>
                        {/*MAILING ADDRESS FORM*/}
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Mailing Address</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div className="mochi-button" onClick={remitToAddressBtn}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Remit to address is the same</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className="mochi-button" onClick={mailingAddressClearBtn}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Clear</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                </div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="form-row">
                                <div className={disabledDivisionMailingAddressFields + ' input-box-container input-code'}>
                                    <input tabIndex={18 + props.tabTimes} type="text" placeholder="Code" maxLength="8"
                                        ref={refDivisionMailingCode}
                                        readOnly={true}
                                        onInput={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                mailing_address: {
                                                    ...selectedDivision?.mailing_address,
                                                    code: e.target.value
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                mailing_address: {
                                                    ...selectedDivision?.mailing_address,
                                                    code: e.target.value
                                                }
                                            })
                                        }}
                                        value={(selectedDivision?.mailing_address?.code || '') + ((selectedDivision?.mailing_address?.code_number || 0) === 0 ? '' : selectedDivision?.mailing_address?.code_number)} />
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledDivisionMailingAddressFields + ' input-box-container grow'}>
                                    <input tabIndex={19 + props.tabTimes} type="text" placeholder="Name"
                                        onInput={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                mailing_address: {
                                                    ...selectedDivision?.mailing_address,
                                                    name: e.target.value
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                mailing_address: {
                                                    ...selectedDivision?.mailing_address,
                                                    name: e.target.value
                                                }
                                            })
                                        }}
                                        value={selectedDivision?.mailing_address?.name || ''} />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledDivisionMailingAddressFields + ' input-box-container grow'}>
                                    <input tabIndex={20 + props.tabTimes} type="text" placeholder="Address 1"
                                        onInput={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                mailing_address: {
                                                    ...selectedDivision?.mailing_address,
                                                    address1: e.target.value
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                mailing_address: {
                                                    ...selectedDivision?.mailing_address,
                                                    address1: e.target.value
                                                }
                                            })
                                        }}
                                        value={selectedDivision?.mailing_address?.address1 || ''} />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledDivisionMailingAddressFields + ' input-box-container grow'}>
                                    <input tabIndex={21 + props.tabTimes} type="text" placeholder="Address 2"
                                        onInput={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                mailing_address: {
                                                    ...selectedDivision?.mailing_address,
                                                    address2: e.target.value
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                mailing_address: {
                                                    ...selectedDivision?.mailing_address,
                                                    address2: e.target.value
                                                }
                                            })
                                        }}
                                        value={selectedDivision?.mailing_address?.address2 || ''} />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledDivisionMailingAddressFields + ' input-box-container grow'}>
                                    <input tabIndex={22 + props.tabTimes} type="text" placeholder="City"
                                        onInput={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                mailing_address: {
                                                    ...selectedDivision?.mailing_address,
                                                    city: e.target.value
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                mailing_address: {
                                                    ...selectedDivision?.mailing_address,
                                                    city: e.target.value
                                                }
                                            })
                                        }}
                                        value={selectedDivision?.mailing_address?.city || ''} />
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledDivisionMailingAddressFields + ' input-box-container input-state'}>
                                    <input tabIndex={23 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                        onInput={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                mailing_address: {
                                                    ...selectedDivision?.mailing_address,
                                                    state: e.target.value
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                mailing_address: {
                                                    ...selectedDivision?.mailing_address,
                                                    state: e.target.value
                                                }
                                            })
                                        }}
                                        value={selectedDivision?.mailing_address?.state || ''} />
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledDivisionMailingAddressFields + ' input-box-container input-zip-code'}>
                                    <input tabIndex={24 + props.tabTimes} type="text" placeholder="Postal Code"
                                        onKeyDown={saveMailingAddress}
                                        onInput={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                mailing_address: {
                                                    ...selectedDivision?.mailing_address,
                                                    zip: e.target.value
                                                }
                                            })
                                        }}
                                        onChange={e => {
                                            setSelectedDivision({
                                                ...selectedDivision,
                                                mailing_address: {
                                                    ...selectedDivision?.mailing_address,
                                                    zip: e.target.value
                                                }
                                            })
                                        }}
                                        value={selectedDivision?.mailing_address?.zip || ''} />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledDivisionMailingAddressFields + ' select-box-container'} style={{ flexGrow: 1 }}>
                                    <div className="select-box-wrapper">
                                        <input
                                            tabIndex={25 + props.tabTimes}
                                            type="text"
                                            placeholder="Contact Name"
                                            ref={refMailingContactName}
                                            onKeyDown={async (e) => {
                                                let key = e.keyCode || e.which;

                                                switch (key) {
                                                    case 37:
                                                    case 38: // arrow left | arrow up
                                                        e.preventDefault();
                                                        if (showMailingContactNames) {
                                                            let selectedIndex = mailingContactNameItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setMailingContactNameItems(mailingContactNameItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setMailingContactNameItems(mailingContactNameItems.map((item, index) => {
                                                                    if (selectedIndex === 0) {
                                                                        item.selected = index === (mailingContactNameItems.length - 1);
                                                                    } else {
                                                                        item.selected = index === (selectedIndex - 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refMailingContactNamePopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            if (mailingContactNameItems.length > 1) {
                                                                await setMailingContactNameItems((selectedDivision?.contacts || []).map((item, index) => {
                                                                    item.selected = index === 0
                                                                    return item;
                                                                }))

                                                                setShowMailingContactNames(true);

                                                                refMailingContactNamePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }
                                                        break;

                                                    case 39:
                                                    case 40: // arrow right | arrow down
                                                        e.preventDefault();
                                                        if (showMailingContactNames) {
                                                            let selectedIndex = mailingContactNameItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setMailingContactNameItems(mailingContactNameItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setMailingContactNameItems(mailingContactNameItems.map((item, index) => {
                                                                    if (selectedIndex === (mailingContactNameItems.length - 1)) {
                                                                        item.selected = index === 0;
                                                                    } else {
                                                                        item.selected = index === (selectedIndex + 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refMailingContactNamePopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            if (mailingContactNameItems.length > 1) {
                                                                await setMailingContactNameItems((selectedDivision?.contacts || []).map((item, index) => {
                                                                    item.selected = index === 0
                                                                    return item;
                                                                }))

                                                                setShowMailingContactNames(true);

                                                                refMailingContactNamePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }
                                                        break;

                                                    case 27: // escape
                                                        setShowMailingContactNames(false);
                                                        break;

                                                    case 13: // enter
                                                        if (showMailingContactNames && mailingContactNameItems.findIndex(item => item.selected) > -1) {
                                                            await setSelectedDivision({
                                                                ...selectedDivision,
                                                                mailing_address: {
                                                                    ...selectedDivision?.mailing_address,
                                                                    mailing_contact: mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)],
                                                                    mailing_contact_id: mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].id,
                                                                    mailing_contact_primary_phone: (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_work || '') !== ''
                                                                        ? 'work'
                                                                        : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_work_fax || '') !== ''
                                                                            ? 'fax'
                                                                            : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_mobile || '') !== ''
                                                                                ? 'mobile'
                                                                                : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_direct || '') !== ''
                                                                                    ? 'direct'
                                                                                    : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_other || '') !== ''
                                                                                        ? 'other' :
                                                                                        ''
                                                                }
                                                            });

                                                            saveMailingAddress({ keyCode: 9 });
                                                            setShowMailingContactNames(false);
                                                            refMailingContactName.current.focus();
                                                        }
                                                        break;

                                                    case 9: // tab
                                                        if (showMailingContactNames) {
                                                            e.preventDefault();
                                                            await setSelectedDivision({
                                                                ...selectedDivision,
                                                                mailing_address: {
                                                                    ...selectedDivision?.mailing_address,
                                                                    mailing_contact: mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)],
                                                                    mailing_contact_id: mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].id,
                                                                    mailing_contact_primary_phone: (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_work || '') !== ''
                                                                        ? 'work'
                                                                        : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_work_fax || '') !== ''
                                                                            ? 'fax'
                                                                            : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_mobile || '') !== ''
                                                                                ? 'mobile'
                                                                                : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_direct || '') !== ''
                                                                                    ? 'direct'
                                                                                    : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_other || '') !== ''
                                                                                        ? 'other' :
                                                                                        ''
                                                                }
                                                            });

                                                            saveMailingAddress({ keyCode: 9 });
                                                            setShowMailingContactNames(false);
                                                            refMailingContactName.current.focus();
                                                        } else {
                                                            saveMailingAddress({ keyCode: 9 });
                                                        }
                                                        break;

                                                    default:
                                                        break;
                                                }
                                            }}
                                            onInput={(e) => {
                                                // setSelectedDivision({
                                                //     ...selectedDivision,
                                                //     mailing_contact_name: e.target.value
                                                // })
                                            }}
                                            onChange={(e) => {
                                                // setSelectedDivision({
                                                //     ...selectedDivision,
                                                //     mailing_contact_name: e.target.value
                                                // })
                                            }}
                                            value={
                                                (selectedDivision?.mailing_address?.mailing_contact?.first_name || '') +
                                                ((selectedDivision?.mailing_address?.mailing_contact?.last_name || '') === ''
                                                    ? ''
                                                    : ' ' + selectedDivision?.mailing_address?.mailing_contact?.last_name)
                                            }
                                        />

                                        {
                                            ((selectedDivision?.contacts || []).length > 1 && (selectedDivision?.mailing_address?.code || '') !== '') &&
                                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                                onClick={async () => {
                                                    if (showMailingContactNames) {
                                                        setShowMailingContactNames(false);
                                                    } else {
                                                        if ((selectedDivision?.contacts || []).length > 1) {
                                                            await setMailingContactNameItems((selectedDivision?.contacts || []).map((item, index) => {
                                                                item.selected = index === 0
                                                                return item;
                                                            }))

                                                            window.setTimeout(async () => {
                                                                await setShowMailingContactNames(true);

                                                                refMailingContactNamePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }, 0)
                                                        }
                                                    }

                                                    refMailingContactName.current.focus();
                                                }} />
                                        }
                                    </div>
                                    {
                                        mailingContactNamesTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-contact-names"
                                                style={{
                                                    ...style,
                                                    left: '0',
                                                    display: 'block'
                                                }}
                                                ref={refMailingContactNameDropDown}
                                            >
                                                <div className="mochi-contextual-popup vertical below right"
                                                    style={{ height: 150 }}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {
                                                                mailingContactNameItems.map((item, index) => {
                                                                    const mochiItemClasses = classnames({
                                                                        'mochi-item': true,
                                                                        'selected': item.selected
                                                                    });

                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={mochiItemClasses}
                                                                            id={item.id}
                                                                            onClick={async () => {
                                                                                await setSelectedDivision({
                                                                                    ...selectedDivision,
                                                                                    mailing_address: {
                                                                                        ...selectedDivision?.mailing_address,
                                                                                        mailing_contact: item,
                                                                                        mailing_contact_id: item.id,
                                                                                        mailing_contact_primary_phone: (item.phone_work || '') !== ''
                                                                                            ? 'work'
                                                                                            : (item.phone_work_fax || '') !== ''
                                                                                                ? 'fax'
                                                                                                : (item.phone_mobile || '') !== ''
                                                                                                    ? 'mobile'
                                                                                                    : (item.phone_direct || '') !== ''
                                                                                                        ? 'direct'
                                                                                                        : (item.phone_other || '') !== ''
                                                                                                            ? 'other' :
                                                                                                            ''
                                                                                    }
                                                                                });

                                                                                saveMailingAddress({ keyCode: 9 });
                                                                                setShowMailingContactNames(false);
                                                                                refMailingContactName.current.focus();
                                                                            }}
                                                                            ref={ref => refMailingContactNamePopupItems.current.push(ref)}
                                                                        >
                                                                            {
                                                                                item.first_name + ((item.last_name || '') === '' ? '' : ' ' + item.last_name)
                                                                            }

                                                                            {
                                                                                item.selected &&
                                                                                <FontAwesomeIcon
                                                                                    className="dropdown-selected"
                                                                                    icon={faCaretRight} />
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </animated.div>
                                        ))
                                    }
                                </div>

                                <div className="form-h-sep"></div>
                                <div className={disabledDivisionMailingAddressFields + ' select-box-container input-phone'}>
                                    <div className="select-box-wrapper">
                                        <MaskedInput tabIndex={26 + props.tabTimes}
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text"
                                            placeholder="Contact Phone"
                                            ref={refMailingContactPhone}
                                            onKeyDown={async (e) => {
                                                let key = e.keyCode || e.which;

                                                switch (key) {
                                                    case 37:
                                                    case 38: // arrow left | arrow up
                                                        e.preventDefault();
                                                        if (showMailingContactPhones) {
                                                            let selectedIndex = mailingContactPhoneItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setMailingContactPhoneItems(mailingContactPhoneItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setMailingContactPhoneItems(mailingContactPhoneItems.map((item, index) => {
                                                                    if (selectedIndex === 0) {
                                                                        item.selected = index === (mailingContactPhoneItems.length - 1);
                                                                    } else {
                                                                        item.selected = index === (selectedIndex - 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refMailingContactPhonePopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            if (mailingContactPhoneItems.length > 1) {
                                                                await setMailingContactPhoneItems(mailingContactPhoneItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))

                                                                setShowMailingContactPhones(true);

                                                                refMailingContactPhonePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }
                                                        break;

                                                    case 39:
                                                    case 40: // arrow right | arrow down
                                                        e.preventDefault();
                                                        if (showMailingContactPhones) {
                                                            let selectedIndex = mailingContactPhoneItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setMailingContactPhoneItems(mailingContactPhoneItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setMailingContactPhoneItems(mailingContactPhoneItems.map((item, index) => {
                                                                    if (selectedIndex === (mailingContactPhoneItems.length - 1)) {
                                                                        item.selected = index === 0;
                                                                    } else {
                                                                        item.selected = index === (selectedIndex + 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refMailingContactPhonePopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            if (mailingContactPhoneItems.length > 1) {
                                                                await setMailingContactPhoneItems(mailingContactPhoneItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))

                                                                setShowMailingContactPhones(true);

                                                                refMailingContactPhonePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }
                                                        break;

                                                    case 27: // escape
                                                        setShowMailingContactPhones(false);
                                                        break;

                                                    case 13: // enter
                                                        if (showMailingContactPhones && mailingContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                            await setSelectedDivision({
                                                                ...selectedDivision,
                                                                mailing_address: {
                                                                    ...selectedDivision.mailing_address,
                                                                    mailing_contact_primary_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].type
                                                                }
                                                            });

                                                            saveMailingAddress({ keyCode: 9 });
                                                            setShowMailingContactPhones(false);
                                                            refMailingContactPhone.current.inputElement.focus();
                                                        }
                                                        break;

                                                    case 9: // tab
                                                        if (showMailingContactPhones) {
                                                            e.preventDefault();
                                                            await setSelectedDivision({
                                                                ...selectedDivision,
                                                                mailing_address: {
                                                                    ...selectedDivision.mailing_address,
                                                                    mailing_contact_primary_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].type
                                                                }
                                                            });

                                                            saveMailingAddress({ keyCode: 9 });
                                                            setShowMailingContactPhones(false);
                                                            refMailingContactPhone.current.inputElement.focus();
                                                        } else {
                                                            saveMailingAddress({ keyCode: 9 });
                                                        }
                                                        break;

                                                    default:
                                                        break;
                                                }
                                            }}
                                            onInput={(e) => {
                                                // setSelectedDivision({
                                                //     ...selectedDivision,
                                                //     mailing_contact_phone: e.target.value
                                                // });
                                            }}
                                            onChange={(e) => {
                                                // setSelectedDivision({
                                                //     ...selectedDivision,
                                                //     mailing_contact_phone: e.target.value
                                                // });
                                            }}
                                            value={
                                                (selectedDivision?.mailing_address?.mailing_contact_primary_phone || '') === 'work'
                                                    ? (selectedDivision?.mailing_address?.mailing_contact?.phone_work || '')
                                                    : (selectedDivision?.mailing_address?.mailing_contact_primary_phone || '') === 'fax'
                                                        ? (selectedDivision?.mailing_address?.mailing_contact?.phone_work_fax || '')
                                                        : (selectedDivision?.mailing_address?.mailing_contact_primary_phone || '') === 'mobile'
                                                            ? (selectedDivision?.mailing_address?.mailing_contact?.phone_mobile || '')
                                                            : (selectedDivision?.mailing_address?.mailing_contact_primary_phone || '') === 'direct'
                                                                ? (selectedDivision?.mailing_address?.mailing_contact?.phone_direct || '')
                                                                : (selectedDivision?.mailing_address?.mailing_contact_primary_phone || '') === 'other'
                                                                    ? (selectedDivision?.mailing_address?.mailing_contact?.phone_other || '')
                                                                    : ''
                                            }
                                        />

                                        {
                                            ((selectedDivision?.id || 0) > 0 && (selectedDivision?.mailing_address?.code || '') !== '') &&
                                            <div
                                                className={classnames({
                                                    'selected-mailing-contact-primary-phone': true,
                                                    'pushed': (mailingContactPhoneItems.length > 1)
                                                })}>
                                                {selectedDivision?.mailing_address?.mailing_contact_primary_phone || ''}
                                            </div>
                                        }

                                        {
                                            mailingContactPhoneItems.length > 1 &&
                                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                                onClick={async () => {
                                                    if (showMailingContactPhones) {
                                                        setShowMailingContactPhones(false);
                                                    } else {
                                                        if (mailingContactPhoneItems.length > 1) {
                                                            await setMailingContactPhoneItems(mailingContactPhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))

                                                            window.setTimeout(async () => {
                                                                await setShowMailingContactPhones(true);

                                                                refMailingContactPhonePopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }, 0)
                                                        }
                                                    }

                                                    refMailingContactPhone.current.inputElement.focus();
                                                }} />
                                        }
                                    </div>
                                    {
                                        mailingContactPhonesTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-contact-phone"
                                                style={{
                                                    ...style,
                                                    left: '0',
                                                    display: 'block'
                                                }}
                                                ref={refMailingContactPhoneDropDown}
                                            >
                                                <div className="mochi-contextual-popup vertical below right"
                                                    style={{ height: 150 }}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {
                                                                mailingContactPhoneItems.map((item, index) => {
                                                                    const mochiItemClasses = classnames({
                                                                        'mochi-item': true,
                                                                        'selected': item.selected
                                                                    });

                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={mochiItemClasses}
                                                                            id={item.id}
                                                                            onClick={async () => {
                                                                                await setSelectedDivision({
                                                                                    ...selectedDivision,
                                                                                    mailing_address: {
                                                                                        ...selectedDivision?.mailing_address,
                                                                                        mailing_contact_primary_phone: item.type
                                                                                    }
                                                                                });

                                                                                saveMailingAddress({ keyCode: 9 });
                                                                                setShowMailingContactPhones(false);
                                                                                refMailingContactPhone.current.inputElement.focus();
                                                                            }}
                                                                            ref={ref => refMailingContactPhonePopupItems.current.push(ref)}
                                                                        >
                                                                            {
                                                                                item.type === 'work' ? `Phone Work `
                                                                                    : item.type === 'fax' ? `Phone Work Fax `
                                                                                        : item.type === 'mobile' ? `Phone Mobile `
                                                                                            : item.type === 'direct' ? `Phone Direct `
                                                                                                : item.type === 'other' ? `Phone Other ` : ''
                                                                            }

                                                                            (<b>
                                                                                {
                                                                                    item.type === 'work' ? item.phone
                                                                                        : item.type === 'fax' ? item.phone
                                                                                            : item.type === 'mobile' ? item.phone
                                                                                                : item.type === 'direct' ? item.phone
                                                                                                    : item.type === 'other' ? item.phone : ''
                                                                                }
                                                                            </b>)

                                                                            {
                                                                                item.selected &&
                                                                                <FontAwesomeIcon
                                                                                    className="dropdown-selected"
                                                                                    icon={faCaretRight} />
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </animated.div>
                                        ))
                                    }
                                </div>

                                <div className="form-h-sep"></div>
                                <div className={disabledDivisionMailingAddressFields + ' input-box-container input-phone-ext'}>
                                    <input tabIndex={27 + props.tabTimes} type="text" placeholder="Ext"
                                        onKeyDown={saveMailingAddress}
                                        onChange={e => {
                                            // setSelectedDivision({ ...selectedDivision, mailing_ext: e.target.value })
                                        }}
                                        value={selectedDivision?.mailing_address?.mailing_contact?.phone_ext || ''} />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledDivisionMailingAddressFields + ' select-box-container'} style={{ flexGrow: 1 }}
                                    onMouseEnter={() => {
                                        if ((selectedDivision?.mailing_address?.mailing_contact?.email_work || '') !== '' ||
                                            (selectedDivision?.mailing_address?.mailing_contact?.email_personal || '') !== '' ||
                                            (selectedDivision?.mailing_address?.mailing_contact?.email_other || '') !== '') {
                                            setShowMailingContactEmailCopyBtn(true);
                                        }
                                    }}
                                    onFocus={() => {
                                        if ((selectedDivision?.mailing_address?.mailing_contact?.email_work || '') !== '' ||
                                            (selectedDivision?.mailing_address?.mailing_contact?.email_personal || '') !== '' ||
                                            (selectedDivision?.mailing_address?.mailing_contact?.email_other || '') !== '') {
                                            setShowMailingContactEmailCopyBtn(true);
                                        }
                                    }}
                                    onBlur={() => {
                                        window.setTimeout(() => {
                                            setShowMailingContactEmailCopyBtn(false);
                                        }, 1000);
                                    }}
                                    onMouseLeave={() => {
                                        setShowMailingContactEmailCopyBtn(false);
                                    }}>

                                    <div className="select-box-wrapper">
                                        <input tabIndex={28 + props.tabTimes} type="text" placeholder="E-Mail"
                                            ref={refMailingContactEmail}
                                            onKeyDown={async (e) => {
                                                let key = e.keyCode || e.which;

                                                switch (key) {
                                                    case 37:
                                                    case 38: // arrow left | arrow up
                                                        e.preventDefault();
                                                        if (showMailingContactEmails) {
                                                            let selectedIndex = mailingContactEmailItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setMailingContactEmailItems(mailingContactEmailItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setMailingContactEmailItems(mailingContactEmailItems.map((item, index) => {
                                                                    if (selectedIndex === 0) {
                                                                        item.selected = index === (mailingContactEmailItems.length - 1);
                                                                    } else {
                                                                        item.selected = index === (selectedIndex - 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refMailingContactEmailPopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            if (mailingContactEmailItems.length > 1) {
                                                                await setMailingContactEmailItems(mailingContactEmailItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))

                                                                setShowMailingContactEmails(true);

                                                                refMailingContactEmailPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }
                                                        break;

                                                    case 39:
                                                    case 40: // arrow right | arrow down
                                                        e.preventDefault();
                                                        if (showMailingContactEmails) {
                                                            let selectedIndex = mailingContactEmailItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setMailingContactEmailItems(mailingContactEmailItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setMailingContactEmailItems(mailingContactEmailItems.map((item, index) => {
                                                                    if (selectedIndex === (mailingContactEmailItems.length - 1)) {
                                                                        item.selected = index === 0;
                                                                    } else {
                                                                        item.selected = index === (selectedIndex + 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refMailingContactEmailPopupItems.current.map((r, i) => {
                                                                if (r && r.classList.contains('selected')) {
                                                                    r.scrollIntoView({
                                                                        behavior: 'auto',
                                                                        block: 'center',
                                                                        inline: 'nearest'
                                                                    })
                                                                }
                                                                return true;
                                                            });
                                                        } else {
                                                            if (mailingContactEmailItems.length > 1) {
                                                                await setMailingContactEmailItems(mailingContactEmailItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))

                                                                setShowMailingContactEmails(true);

                                                                refMailingContactEmailPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }
                                                        }
                                                        break;

                                                    case 27: // escape
                                                        setShowMailingContactEmails(false);
                                                        break;

                                                    case 13: // enter
                                                        if (showMailingContactEmails && mailingContactEmailItems.findIndex(item => item.selected) > -1) {
                                                            await setSelectedDivision({
                                                                ...selectedDivision,
                                                                mailing_address: {
                                                                    ...selectedDivision?.mailing_address,
                                                                    mailing_contact_primary_email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].type
                                                                }
                                                            });

                                                            saveMailingAddress({ keyCode: 9 });
                                                            setShowMailingContactEmails(false);
                                                            refMailingContactEmail.current.focus();
                                                        }
                                                        break;

                                                    case 9: // tab
                                                        if (showMailingContactEmails) {
                                                            e.preventDefault();
                                                            await setSelectedDivision({
                                                                ...selectedDivision,
                                                                mailing_address: {
                                                                    ...selectedDivision?.mailing_address,
                                                                    mailing_contact_primary_email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].type
                                                                }
                                                            });

                                                            saveMailingAddress({ keyCode: 9 });
                                                            setShowMailingContactEmails(false);
                                                            refMailingContactEmail.current.focus();
                                                        } else {
                                                            saveMailingAddress({ keyCode: 9 });
                                                        }
                                                        break;

                                                    default:
                                                        break;
                                                }
                                            }}
                                            onChange={e => {
                                            }}
                                            value={
                                                (selectedDivision?.mailing_address?.mailing_contact_primary_email || '') === 'work'
                                                    ? (selectedDivision?.mailing_address?.mailing_contact?.email_work || '')
                                                    : (selectedDivision?.mailing_address?.mailing_contact_primary_email || '') === 'personal'
                                                        ? (selectedDivision?.mailing_address?.mailing_contact?.email_personal || '')
                                                        : (selectedDivision?.mailing_address?.mailing_contact_primary_email || '') === 'other'
                                                            ? (selectedDivision?.mailing_address?.mailing_contact?.email_other || '')
                                                            : ''
                                            }
                                        />

                                        {
                                            ((selectedDivision?.id || 0) > 0 && (selectedDivision?.mailing_address?.code || '') !== '') &&
                                            <div
                                                className={classnames({
                                                    'selected-mailing-contact-primary-email': true,
                                                    'pushed': (mailingContactEmailItems.length > 1)
                                                })}>
                                                {selectedDivision?.mailing_address?.mailing_contact_primary_email || ''}
                                            </div>
                                        }

                                        {
                                            showMailingContactEmailCopyBtn &&
                                            <FontAwesomeIcon style={{
                                                position: 'absolute',
                                                top: '50%',
                                                right: 30,
                                                zIndex: 1,
                                                cursor: 'pointer',
                                                transform: 'translateY(-50%)',
                                                color: '#2bc1ff',
                                                margin: 0,
                                                transition: 'ease 0.2s',
                                                fontSize: '1rem'
                                            }} icon={faCopy} onClick={(e) => {
                                                e.stopPropagation();
                                                navigator.clipboard.writeText(refMailingContactEmail.current.value);
                                            }} />
                                        }

                                        {
                                            mailingContactEmailItems.length > 1 &&
                                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                                onClick={async () => {
                                                    if (showMailingContactEmails) {
                                                        setShowMailingContactEmails(false);
                                                    } else {
                                                        if (mailingContactEmailItems.length > 1) {
                                                            await setMailingContactEmailItems(mailingContactEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))

                                                            window.setTimeout(async () => {
                                                                await setShowMailingContactEmails(true);

                                                                refMailingContactEmailPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains('selected')) {
                                                                        r.scrollIntoView({
                                                                            behavior: 'auto',
                                                                            block: 'center',
                                                                            inline: 'nearest'
                                                                        })
                                                                    }
                                                                    return true;
                                                                });
                                                            }, 0)
                                                        }
                                                    }

                                                    refMailingContactEmail.current.focus();
                                                }} />
                                        }
                                    </div>
                                    {
                                        mailingContactEmailsTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-contact-email"
                                                style={{
                                                    ...style,
                                                    left: '0',
                                                    display: 'block'
                                                }}
                                                ref={refMailingContactEmailDropDown}
                                            >
                                                <div className="mochi-contextual-popup vertical below right"
                                                    style={{ height: 150 }}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {
                                                                mailingContactEmailItems.map((item, index) => {
                                                                    const mochiItemClasses = classnames({
                                                                        'mochi-item': true,
                                                                        'selected': item.selected
                                                                    });

                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={mochiItemClasses}
                                                                            id={item.id}
                                                                            onClick={async () => {
                                                                                await setSelectedDivision({
                                                                                    ...selectedDivision,
                                                                                    mailing_address: {
                                                                                        ...selectedDivision?.mailing_address,
                                                                                        mailing_contact_primary_email: item.type
                                                                                    }
                                                                                });

                                                                                saveMailingAddress({ keyCode: 9 });
                                                                                setShowMailingContactEmails(false);
                                                                                refMailingContactEmail.current.focus();
                                                                            }}
                                                                            ref={ref => refMailingContactEmailPopupItems.current.push(ref)}
                                                                        >
                                                                            {
                                                                                item.type === 'work' ? `Email Work `
                                                                                    : item.type === 'personal' ? `Email Personal `
                                                                                        : item.type === 'other' ? `Email Other ` : ''
                                                                            }

                                                                            (<b>
                                                                                {
                                                                                    item.type === 'work' ? item.email
                                                                                        : item.type === 'personal' ? item.email
                                                                                            : item.type === 'other' ? item.email : ''
                                                                                }
                                                                            </b>)

                                                                            {
                                                                                item.selected &&
                                                                                <FontAwesomeIcon
                                                                                    className="dropdown-selected"
                                                                                    icon={faCaretRight} />
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </animated.div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        {/*HOURS FORM*/}
                        <div className="form-borderless-box" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            maxWidth: '190px',
                            justifyContent: 'space-between',
                            marginLeft: 10
                        }}>
                            <div className="form-bordered-box" style={{
                                maxHeight: 'calc(50% - 5px)',
                                minWidth: 'initial',
                                justifyContent: 'space-around'
                            }}>
                                <div className="form-header">
                                    <div className="top-border top-border-left"></div>
                                    <div className="form-title">Hours</div>
                                    <div className="top-border top-border-middle"></div>
                                    <div className="top-border top-border-right"></div>
                                </div>

                                <div className="form-row" style={{ justifyContent: 'space-around' }}>
                                    <div className={disabledDivisionHoursFields + ' input-box-container'}>
                                        <input tabIndex={39 + props.tabTimes} type="text" placeholder="Open"
                                            onBlur={(e) => saveHours(e, 'hours open')}
                                            onChange={e => {
                                                let hours = (selectedDivision?.hours || {});
                                                hours.hours_open = e.target.value;
                                                setSelectedDivision({ ...selectedDivision, hours: hours });
                                            }}
                                            value={(selectedDivision?.hours?.hours_open || '')} />
                                    </div>
                                    <div className="form-h-sep"></div>
                                    <div className={disabledDivisionHoursFields + ' input-box-container'}>
                                        <input tabIndex={40 + props.tabTimes} type="text" placeholder="Close"
                                            onBlur={(e) => saveHours(e, 'hours close')}
                                            onChange={e => {
                                                let hours = (selectedDivision?.hours || {});
                                                hours.hours_close = e.target.value;
                                                setSelectedDivision({ ...selectedDivision, hours: hours });
                                            }}
                                            value={(selectedDivision?.hours?.hours_close || '')} />
                                    </div>
                                </div>

                                <div className="form-row" style={{ justifyContent: 'space-around' }}>
                                    <div className={disabledDivisionHoursFields + ' input-box-container'}>
                                        <input tabIndex={41 + props.tabTimes} type="text" placeholder="Open"
                                            onBlur={(e) => saveHours(e, 'hours open 2')}
                                            onChange={e => {
                                                let hours = (selectedDivision?.hours || {});
                                                hours.hours_open2 = e.target.value;
                                                setSelectedDivision({ ...selectedDivision, hours: hours });
                                            }}
                                            value={(selectedDivision?.hours?.hours_open2 || '')} />
                                    </div>
                                    <div className="form-h-sep"></div>
                                    <div className={disabledDivisionHoursFields + ' input-box-container'}>
                                        <input tabIndex={42 + props.tabTimes} type="text" placeholder="Close"
                                            onBlur={(e) => saveHours(e, 'hours close 2')}
                                            onChange={e => {
                                                let hours = (selectedDivision?.hours || {});
                                                hours.hours_close2 = e.target.value;
                                                setSelectedDivision({ ...selectedDivision, hours: hours });
                                            }}
                                            value={(selectedDivision?.hours?.hours_close2 || '')} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-bordered-box" style={{
                                maxHeight: 'calc(50% - 5px)',
                                minWidth: 'initial',
                                justifyContent: 'space-around'
                            }}>
                                <div className="form-header">
                                    <div className="top-border top-border-left"></div>
                                    <div className="form-title">Delivery Hours</div>
                                    <div className="top-border top-border-middle"></div>
                                    <div className="top-border top-border-right"></div>
                                </div>

                                <div className="form-row" style={{ justifyContent: 'space-around' }}>
                                    <div className={disabledDivisionHoursFields + ' input-box-container'}>
                                        <input tabIndex={43 + props.tabTimes} type="text" placeholder="Open"
                                            onBlur={(e) => saveHours(e, 'delivery hours open')}
                                            onChange={e => {
                                                let hours = (selectedDivision?.hours || {});
                                                hours.delivery_hours_open = e.target.value;
                                                setSelectedDivision({ ...selectedDivision, hours: hours });
                                            }}
                                            value={(selectedDivision?.hours?.delivery_hours_open || '')} />
                                    </div>
                                    <div className="form-h-sep"></div>
                                    <div className={disabledDivisionHoursFields + ' input-box-container'}>
                                        <input tabIndex={44 + props.tabTimes} type="text" placeholder="Close"
                                            onBlur={(e) => saveHours(e, 'delivery hours close')}
                                            onChange={e => {
                                                let hours = (selectedDivision?.hours || {});
                                                hours.delivery_hours_close = e.target.value;
                                                setSelectedDivision({ ...selectedDivision, hours: hours });
                                            }}
                                            value={(selectedDivision?.hours?.delivery_hours_close || '')} />
                                    </div>
                                </div>

                                <div className="form-row" style={{ justifyContent: 'space-around' }}>
                                    <div className={disabledDivisionHoursFields + ' input-box-container'}>
                                        <input tabIndex={45 + props.tabTimes} type="text" placeholder="Open"
                                            onBlur={(e) => saveHours(e, 'delivery hours open 2')}
                                            onChange={e => {
                                                let hours = (selectedDivision?.hours || {});
                                                hours.delivery_hours_open2 = e.target.value;
                                                setSelectedDivision({ ...selectedDivision, hours: hours });
                                            }}
                                            value={(selectedDivision?.hours?.delivery_hours_open2 || '')} />
                                    </div>
                                    <div className="form-h-sep"></div>
                                    <div className={disabledDivisionHoursFields + ' input-box-container'}>
                                        <input tabIndex={46 + props.tabTimes} type="text" placeholder="Close"
                                            onKeyDown={(e) => {

                                                let key = e.keyCode || e.which;

                                                if (key === 9) {
                                                    e.preventDefault();
                                                    // let elems = document.getElementsByTagName('input');

                                                    // for (var i = elems.length; i--;) {
                                                    //     if (elems[i].getAttribute('tabindex') && elems[i].getAttribute('tabindex') === (1 + props.tabTimes).toString()) {
                                                    //         elems[i].focus();
                                                    //         break;
                                                    //     }
                                                    // }

                                                    refDivisionCode.current.focus();
                                                }
                                            }}
                                            onBlur={(e) => saveHours(e, 'delivery hours close 2')}
                                            onChange={e => {
                                                let hours = (selectedDivision?.hours || {});
                                                hours.delivery_hours_close2 = e.target.value;
                                                setSelectedDivision({ ...selectedDivision, hours: hours });
                                            }}
                                            value={(selectedDivision?.hours?.delivery_hours_close2 || '')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="fields-container-row grow">
                        {/*PAST ORDERS LIST*/}
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Past Orders</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="orders-list-container">
                                <div className="orders-list-wrapper">
                                    {
                                        (selectedDivision?.orders || []).map((order, index) => {
                                            return (
                                                <div className="orders-list-item" key={index} onClick={() => {
                                                    let panel = {
                                                        panelName: `${props.panelName}-dispatch`,
                                                        component: <Dispatch
                                                            title='Dispatch'
                                                            tabTimes={22000 + props.tabTimes}
                                                            panelName={`${props.panelName}-dispatch`}
                                                            origin={props.origin}
                                                            isOnPanel={true}
                                                            isAdmin={props.isAdmin}
                                                            closingCallback={() => {
                                                                closePanel(`${props.panelName}-dispatch`, props.origin);
                                                                refDivisionCode.current.focus({ preventScroll: true });
                                                            }}

                                                            componentId={moment().format('x')}

                                                            order_id={order.id}
                                                        />
                                                    }

                                                    openPanel(panel, props.origin);
                                                }}>
                                                    <span style={{
                                                        color: "#4682B4",
                                                        fontWeight: 'bold',
                                                        marginRight: 5
                                                    }}>{order.order_number}</span> {((order?.routing || []).length >= 2)
                                                        ? order.routing[0].type === 'pickup'
                                                            ? ((order.pickups.find(p => p.id === order.routing[0].pickup_id).customer?.city || '') + ', ' + (order.pickups.find(p => p.id === order.routing[0].pickup_id).customer?.state || '') +
                                                                ' - ' + (order.routing[order.routing.length - 1].type === 'pickup'
                                                                    ? (order.pickups.find(p => p.id === order.routing[order.routing.length - 1].pickup_id).customer?.city || '') + ', ' + (order.pickups.find(p => p.id === order.routing[order.routing.length - 1].pickup_id).customer?.state || '') :
                                                                    (order.deliveries.find(d => d.id === order.routing[order.routing.length - 1].delivery_id).customer?.city || '') + ', ' + (order.deliveries.find(d => d.id === order.routing[order.routing.length - 1].delivery_id).customer?.state || '')))

                                                            : ((order.deliveries.find(d => d.id === order.routing[0].delivery_id).customer?.city || '') + ', ' + (order.deliveries.find(d => d.id === order.routing[0].delivery_id).customer?.state || '') +
                                                                ' - ' + (order.routing[order.routing.length - 1].type === 'pickup'
                                                                    ? (order.pickups.find(p => p.id === order.routing[order.routing.length - 1].pickup_id).customer?.city || '') + ', ' + (order.pickups.find(p => p.id === order.routing[order.routing.length - 1].pickup_id).customer?.state || '') :
                                                                    (order.deliveries.find(d => d.id === order.routing[order.routing.length - 1].delivery_id).customer?.city || '') + ', ' + (order.deliveries.find(d => d.id === order.routing[order.routing.length - 1].delivery_id).customer?.state || '')))
                                                        : ''}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            {
                                loadingDivisionOrdersTransition((style, item) => item &&
                                    <animated.div className='loading-container' style={style}>
                                        <div className="loading-container-wrapper">
                                            <Loader type="Circles" color="#009bdd" height={40} width={40}
                                                visible={item} />
                                        </div>
                                    </animated.div>
                                )
                            }
                        </div>

                    </div>
                </div>


                <div className="fields-container-col" style={{ alignItems: 'flex-end' }}>
                    <div className="fields-container-row" style={{ display: 'flex', flexDirection: 'column' }}>
                        {/*BUTTONS SECTION*/}
                        <div className="buttons-container">
                            <div className="mochi-button wrap" onClick={revenueInformationBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Revenue Information</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>

                            <div className="mochi-button wrap" onClick={orderHistoryBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Order History</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>

                            <div className="mochi-button wrap" onClick={documentsBtnClick}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Documents</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>

                            <div className="mochi-button wrap" onClick={() => {
                                if ((selectedDivision?.id || 0) === 0) {
                                    window.alert('There is nothing to print!');
                                    return;
                                }

                                handledPrintDivisionInformation();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Print Division Information</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>

                            <div className={disabledDivisionContactFields + ' input-toggle-container'} style={{ width: '100%', maxWidth: '100%' }}>
                                <input type="checkbox"
                                    id={props.panelName + '-cbox-division-type-btn'}
                                    onChange={(e) => {
                                        setSelectedDivision(prev => {
                                            return {
                                                ...prev,
                                                type: e.target.checked ? 'company' : 'brokerage'
                                            }
                                        });

                                        saveDivision({ keyCode: 9 });
                                    }}
                                    checked={(selectedDivision?.type || 'company') === 'company'} />
                                <label htmlFor={props.panelName + '-cbox-division-type-btn'} style={{
                                    backgroundColor: (selectedDivision?.type || 'company') === 'company' ? '#ffb80d' : 'rgba(70,130,180,0.7)'
                                }}>
                                    <div className="label-text" style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>{(selectedDivision?.type || 'company')}</div>
                                    <div className="input-toggle-btn"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                noteTransition((style, item) => item && (
                    <animated.div style={{ ...style }}>
                        <DivisionModal
                            selectedData={selectedNote}
                            setSelectedData={setSelectedNote}
                            selectedParent={selectedDivision}
                            setSelectedParent={(data) => {
                                setSelectedDivision({ ...selectedDivision, notes: data.notes });
                            }}
                            savingDataUrl='/saveDivisionNote'
                            deletingDataUrl='/deleteDivisionNote'
                            type='note'
                            isEditable={props.isAdmin}
                            isDeletable={props.isAdmin}
                            isAdding={selectedNote.id === 0}
                        />
                    </animated.div>
                ))
            }

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

    setSelectedCompany,
    setSelectedDriver,
})(Divisions)