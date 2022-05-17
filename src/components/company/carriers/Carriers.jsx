import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import './Carriers.css';
import { useTransition, animated } from 'react-spring';
import moment from 'moment';
import MaskedInput from 'react-text-mask';
import PanelContainer from './panels/panel-container/PanelContainer.jsx';
// import CarrierModal from './modal/Modal.jsx';
import accounting from 'accounting';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCalendarAlt, faPencilAlt, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import Highlighter from "react-highlight-words";
import "react-datepicker/dist/react-datepicker.css";
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';
import ToPrint from './ToPrint.jsx';
import { useReactToPrint } from 'react-to-print';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import {
    setCompanyOpenedPanels,
    setAdminOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
    setSelectedCarrier,
    setSelectedCarrierContact,
    setSelectedDriver,
    setSelectedInsurance
} from './../../../actions';

import {
    CarrierImport,
    Calendar,
    Contacts,
    CustomerSearch,
    ContactSearch,
    Documents,
    RevenueInformation,
    OrderHistory,
    FactoringCompany,
    EquipmentInformation,
    Modal as CarrierModal
} from './../panels';

const Carriers = (props) => {
    // DECLARATIONS
    const [selectedCarrier, setSelectedCarrier] = useState({});
    const [selectedContact, setSelectedContact] = useState({});
    const [selectedDocument, setSelectedDocument] = useState({});
    const [selectedDriver, setSelectedDriver] = useState({});
    const [selectedInsurance, setSelectedInsurance] = useState({});
    const [selectedNote, setSelectedNote] = useState({});
    const [contactSearch, setContactSearch] = useState({});
    const [showingContactList, setShowingContactList] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const refPrintCarrierInformation = useRef();
    const refCarrierCode = useRef();
    const refFactoringCompanyCode = useRef();
    const refCarrierName = useRef();
    const refFactoringCompanyName = useRef();
    const refCarrierContactPhone = useRef();
    const refCarrierContactFirstName = useRef();
    const refCarrierDriverFirstName = useRef();
    const refInsurancesListWrapper = useRef();
    const [insurancesScrollBarVisible, setInsurancesScrollBarVisible] = useState(false);
    const [carrierContactPhoneItems, setCarrierContactPhoneItems] = useState([]);
    const [showCarrierContactPhones, setShowCarrierContactPhones] = useState(false);
    const refCarrierContactPhoneDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowCarrierContactPhones(false) } });
    const refCarrierContactPhonePopupItems = useRef([]);

    const refCarrierContactEmail = useRef();
    const [carrierContactEmailItems, setCarrierContactEmailItems] = useState([]);
    const [showCarrierContactEmails, setShowCarrierContactEmails] = useState(false);
    const refCarrierContactEmailDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowCarrierContactEmails(false) } });
    const refCarrierContactEmailPopupItems = useRef([]);

    const refMailingContactName = useRef();
    const [mailingContactNameItems, setMailingContactNameItems] = useState([]);
    const [showMailingContactNames, setShowMailingContactNames] = useState(false);
    const refMailingContactNameDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowMailingContactNames(false) } });
    const refMailingContactNamePopupItems = useRef([]);

    const refMailingContactPhone = useRef();
    const [mailingContactPhoneItems, setMailingContactPhoneItems] = useState([]);
    const [showMailingContactPhones, setShowMailingContactPhones] = useState(false);
    const refMailingContactPhoneDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowMailingContactPhones(false) } });
    const refMailingContactPhonePopupItems = useRef([]);

    const refMailingContactEmail = useRef();
    const [mailingContactEmailItems, setMailingContactEmailItems] = useState([]);
    const [showMailingContactEmails, setShowMailingContactEmails] = useState(false);
    const refMailingContactEmailDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowMailingContactEmails(false) } });
    const refMailingContactEmailPopupItems = useRef([]);

    const [preSelectedExpirationDate, setPreSelectedExpirationDate] = useState(moment());
    const [insuranceTypeDropdownItems, setInsuranceTypeDropdownItems] = useState([]);
    const refInsuranceTypeDropDown = useDetectClickOutside({ onTriggered: async () => { await setInsuranceTypeDropdownItems([]) } });
    const refInsuranceTypePopupItems = useRef([]);

    const [insuranceCompanyDropdownItems, setInsuranceCompanyDropdownItems] = useState([]);
    const refInsuranceCompanyDropDown = useDetectClickOutside({ onTriggered: async () => { await setInsuranceCompanyDropdownItems([]) } });
    const refInsuranceCompanyPopupItems = useRef([]);

    const [driverEquipmentDropdownItems, setDriverEquipmentDropdownItems] = useState([]);
    const refDriverEquipmentDropDown = useDetectClickOutside({ onTriggered: async () => { await setDriverEquipmentDropdownItems([]) } });
    const refDriverEquipmentPopupItems = useRef([]);

    const [isCalendarShown, setIsCalendarShown] = useState(false);
    const refInsuranceCalendarDropDown = useDetectClickOutside({ onTriggered: async () => { await setIsCalendarShown(false) } });

    const [isSavingCarrier, setIsSavingCarrier] = useState(false);
    const [isSavingContact, setIsSavingContact] = useState(false);
    const [isSavingMailingAddress, setIsSavingMailingAddress] = useState(false);
    const [isSavingFactoringCompany, setIsSavingFactoringCompany] = useState(false);
    const [isSavingDriver, setIsSavingDriver] = useState(false);
    const [isSavingInsurance, setIsSavingInsurance] = useState(false);
    const refEquipment = useRef();
    const refInsuranceType = useRef();
    const refExpirationDate = useRef();
    const refInsuranceCompany = useRef();

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0, display: 'block' },
        enter: { opacity: 1, display: 'block' },
        leave: { opacity: 0, display: 'none' },
        reverse: isLoading,
    });


    const carrierContactPhonesTransition = useTransition(showCarrierContactPhones, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showCarrierContactPhones
    });

    const carrierContactEmailsTransition = useTransition(showCarrierContactEmails, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showCarrierContactEmails
    });

    const equipmentTransition = useTransition(driverEquipmentDropdownItems.length > 0, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: driverEquipmentDropdownItems.length > 0
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

    const insuranceTypeTransition = useTransition(insuranceTypeDropdownItems.length > 0, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: insuranceTypeDropdownItems.length > 0
    });

    const insuranceCompanyTransition = useTransition(insuranceCompanyDropdownItems.length > 0, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: insuranceCompanyDropdownItems.length > 0
    });

    const calendarTransition = useTransition(isCalendarShown, {
        from: { opacity: 0, display: 'block', top: 'calc(100% + 7px)' },
        enter: { opacity: 1, display: 'block', top: 'calc(100% + 12px)' },
        leave: { opacity: 0, display: 'none', top: 'calc(100% + 7px)' },
        reverse: isCalendarShown,
        config: { duration: 100 }
    });

    const noteTransition = useTransition(selectedNote?.id !== undefined, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: selectedNote?.id !== undefined,
        config: { duration: 100 }
    });


    const handledPrintCarrierInformation = useReactToPrint({
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
        content: () => refPrintCarrierInformation.current
    });

    useEffect(() => {
        setInsurancesScrollBarVisible($(`#${props.panelName}-insurances-list-wrapper`).hasScrollBar());
    }, [selectedCarrier?.insurances?.length])

    useEffect(() => {
        if (isSavingCarrier) {
            let newSelectedCarrier = { ...selectedCarrier };

            if (newSelectedCarrier.id === undefined || newSelectedCarrier.id === -1) {
                newSelectedCarrier.id = 0;
            }

            if (
                (newSelectedCarrier.name || '').trim().replace(/\s/g, "").replace("&", "A") !== "" &&
                (newSelectedCarrier.city || '').trim().replace(/\s/g, "") !== "" &&
                (newSelectedCarrier.state || '').trim().replace(/\s/g, "") !== "" &&
                (newSelectedCarrier.address1 || '').trim() !== "" &&
                (newSelectedCarrier.zip || '').trim() !== ""
            ) {
                let parseCity = newSelectedCarrier.city.trim().replace(/\s/g, "").substring(0, 3);

                if (parseCity.toLowerCase() === "ft.") {
                    parseCity = "FO";
                }
                if (parseCity.toLowerCase() === "mt.") {
                    parseCity = "MO";
                }
                if (parseCity.toLowerCase() === "st.") {
                    parseCity = "SA";
                }

                let newCode = (newSelectedCarrier.name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (newSelectedCarrier.state || '').trim().replace(/\s/g, "").substring(0, 2);

                newSelectedCarrier.code = newCode.toUpperCase();

                axios.post(props.serverUrl + '/saveCarrier', newSelectedCarrier)
                    .then(res => {
                        if (res.data.result === 'OK') {
                            let carrier = JSON.parse(JSON.stringify(res.data.carrier));

                            if ((selectedCarrier?.id || 0) === 0) {
                                setSelectedCarrier(selectedCarrier => {
                                    return {
                                        ...selectedCarrier,
                                        id: carrier.id,
                                        code: carrier.code,
                                        code_number: carrier.code_number,
                                        contacts: carrier.contacts || []
                                    }
                                });
                            } else {
                                setSelectedCarrier(selectedCarrier => {
                                    return {
                                        ...selectedCarrier,
                                        contacts: carrier.contacts || []
                                    }
                                });
                            }

                            (res.data.carrier.contacts || []).map(async (contact, index) => {

                                if (contact.is_primary === 1) {
                                    if ((selectedContact?.id || 0) === 0 || selectedContact?.id === contact.id) {
                                        setSelectedContact(contact);
                                    }
                                }

                                return true;
                            });

                            props.setSelectedCarrier({
                                ...carrier,
                                component_id: props.componentId
                            })
                        }

                        setIsSavingCarrier(false);
                    })
                    .catch(e => {
                        console.log('error on saving carrier', e);
                        setIsSavingCarrier(false);
                    });
            } else {
                setIsSavingCarrier(false);
            }
        }
    }, [isSavingCarrier]);

    useEffect(() => {
        if (isSavingContact) {
            if ((selectedCarrier?.id || 0) === 0) {
                setIsSavingContact(false);
                return;
            }

            let contact = JSON.parse(JSON.stringify(selectedContact));
            contact.carrier = null;

            if (contact.carrier_id === undefined || contact.carrier_id === 0) {
                contact.carrier_id = selectedCarrier.id;
            }

            if ((contact.first_name || '').trim() === '' ||
                (contact.last_name || '').trim() === '' ||
                ((contact.phone_work || '').trim() === '' &&
                    (contact.phone_work_fax || '').trim() === '' &&
                    (contact.phone_mobile || '').trim() === '' &&
                    (contact.phone_direct || '').trim() === '' &&
                    (contact.phone_other || '').trim() === '')) {
                setIsSavingContact(false);
                return;
            }

            if ((contact.address1 || '').trim() === '' && (contact.address2 || '').trim() === '') {
                contact.address1 = selectedCarrier.address1;
                contact.address2 = selectedCarrier.address2;
                contact.city = selectedCarrier.city;
                contact.state = selectedCarrier.state;
                contact.zip_code = selectedCarrier.zip;
            }

            let contacts = [];

            axios.post(props.serverUrl + '/saveCarrierContact', contact)
                .then(res => {
                    if (res.data.result === 'OK') {
                        let mailing_contact = selectedCarrier?.mailing_address?.mailing_contact || {};

                        if ((mailing_contact?.id || 0) === res.data.contact.id) {
                            mailing_contact = res.data.contact;
                        }

                        setSelectedCarrier(selectedCarrier => {
                            return {
                                ...selectedCarrier,
                                contacts: res.data.contacts,
                                mailing_address: {
                                    ...selectedCarrier.mailing_address,
                                    mailing_contact: mailing_contact
                                }
                            }
                        });
                        setSelectedContact({ ...res.data.contact });

                        contacts = res.data.contacts;

                        props.setSelectedCarrier({
                            id: selectedCarrier.id,
                            contacts: res.data.contacts,
                            mailing_address: {
                                ...selectedCarrier.mailing_address,
                                mailing_contact: mailing_contact
                            },
                            component_id: props.componentId
                        })

                        props.setSelectedCarrierContact({
                            ...res.data.contact,
                            component_id: props.componentId
                        })
                    }

                    setIsSavingContact(false);
                }).catch(e => {
                    console.log('error on saving carrier contact', e);
                    setIsSavingContact(false);
                });
        }
    }, [isSavingContact]);

    useEffect(() => {
        if (isSavingMailingAddress) {
            if ((selectedCarrier.id || 0) > 0) {
                let mailing_address = selectedCarrier.mailing_address || {};

                if (mailing_address.id === undefined) {
                    mailing_address.id = 0;
                }
                mailing_address.carrier_id = selectedCarrier.id;

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

                    axios.post(props.serverUrl + '/saveCarrierMailingAddress', mailing_address)
                        .then(res => {
                            if (res.data.result === 'OK') {
                                setSelectedCarrier(selectedCarrier => {
                                    return {
                                        ...selectedCarrier,
                                        mailing_address: res.data.mailing_address
                                    }
                                });

                                props.setSelectedCarrier({
                                    id: selectedCarrier.id,
                                    mailing_address: res.data.mailing_address,
                                    component_id: props.componentId
                                })
                            }

                            setIsSavingMailingAddress(false);
                        })
                        .catch(e => {
                            console.log('error on saving carrier mailing address', e);
                            setIsSavingMailingAddress(false);
                        });
                } else {
                    setIsSavingMailingAddress(false);
                }
            }
        }
    }, [isSavingMailingAddress]);

    useEffect(() => {
        if (isSavingFactoringCompany) {
            let factoring_company = selectedCarrier?.factoring_company || {};

            if (factoring_company.id === undefined) {
                factoring_company.id = 0;
            }

            factoring_company.carrier_id = selectedCarrier.id;

            if (
                (factoring_company.name || '').trim().replace(/\s/g, "").replace("&", "A") !== "" &&
                (factoring_company.city || '').trim().replace(/\s/g, "") !== "" &&
                (factoring_company.state || '').trim().replace(/\s/g, "") !== "" &&
                (factoring_company.address1 || '').trim() !== "" &&
                (factoring_company.zip || '').trim() !== ""
            ) {
                let parseCity = factoring_company.city.trim().replace(/\s/g, "").substring(0, 3);

                if (parseCity.toLowerCase() === "ft.") {
                    parseCity = "FO";
                }
                if (parseCity.toLowerCase() === "mt.") {
                    parseCity = "MO";
                }
                if (parseCity.toLowerCase() === "st.") {
                    parseCity = "SA";
                }

                let newCode = (factoring_company.name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (factoring_company.state || '').trim().replace(/\s/g, "").substring(0, 2);

                factoring_company.code = newCode.toUpperCase();

                axios.post(props.serverUrl + '/saveFactoringCompany', { ...factoring_company, carrier_id: (selectedCarrier?.id || null) })
                    .then(async res => {
                        if (res.data.result === 'OK') {
                            await setSelectedCarrier({ ...selectedCarrier, factoring_company: res.data.factoring_company });
                        }
                        setIsSavingFactoringCompany(false);
                    })
                    .catch(e => {
                        console.log('error saving factoring company on carrier', e);
                        setIsSavingFactoringCompany(false);
                    });
            } else {
                setIsSavingFactoringCompany(false);
            }
        }
    }, [isSavingFactoringCompany]);

    useEffect(() => {
        if ((props.carrier_id || 0) > 0) {
            setIsLoading(true);

            axios.post(props.serverUrl + '/getCarrierById', { id: props.carrier_id }).then(res => {
                if (res.data.result === 'OK') {
                    setSelectedCarrier({ ...res.data.carrier });
                    setSelectedContact({ ...(res.data.carrier.contact || []).find(c => c.is_primary === 1) });
                    setSelectedDriver({});
                    setSelectedInsurance({});
                }

                setIsLoading(false);
                refCarrierCode.current.focus({
                    preventScroll: true
                });
            }).catch(e => {
                setIsLoading(false);
                console.log('error getting carrier by id', e);
            })
        } else {
            refCarrierCode.current.focus({
                preventScroll: true
            });
        }
    }, [])

    useEffect(() => {
        if ((props.selectedCarrier?.change_carrier || false)) {
            setSelectedCarrier({
                ...props.selectedCarrier
            })
        } else {
            if ((props.selectedCarrier?.component_id || '') !== props.componentId) {
                if (((selectedCarrier?.id || 0) > 0 && (props.selectedCarrier?.id || 0) > 0) && selectedCarrier.id === props.selectedCarrier.id) {
                    setSelectedCarrier(selectedCarrier => {
                        return {
                            ...selectedCarrier,
                            ...props.selectedCarrier
                        }
                    })
                }
            }
        }
    }, [props.selectedCarrier])

    useEffect(() => {
        if ((props.selectedCarrierContact?.change_carrier || false)) {
            setSelectedContact({
                ...props.selectedCarrierContact
            })
        } else {
            if ((props.selectedCarrierContact?.component_id || '') !== props.componentId) {
                if (((selectedContact?.id || 0) > 0 && (props.selectedCarrierContact?.id || 0) > 0) && selectedContact.id === props.selectedCarrierContact.id) {
                    setSelectedContact(selectedContact => {
                        return {
                            ...selectedContact,
                            ...props.selectedCarrierContact
                        }
                    })
                }
            }
        }
    }, [props.selectedCarrierContact])

    useEffect(() => {
        if ((props.selectedCarrierInsurance?.change_carrier || false)) {
            setSelectedInsurance({
                ...props.selectedCarrierInsurance
            })
        } else {
            if ((props.selectedCarrierInsurance?.component_id || '') !== props.componentId) {
                if (((selectedInsurance?.id || 0) > 0 && (props.selectedCarrierInsurance?.id || 0) > 0) && selectedInsurance.id === props.selectedCarrierInsurance.id) {
                    setSelectedInsurance(selectedInsurance => {
                        return {
                            ...selectedInsurance,
                            ...props.selectedCarrierInsurance
                        }
                    })
                }
            }
        }
    }, [props.selectedCarrierInsurance])

    useEffect(() => {
        if ((props.selectedCarrierDriver?.change_carrier || false)) {
            setSelectedDriver({
                ...props.selectedCarrierDriver
            })
        } else {
            if ((props.selectedCarrierDriver?.component_id || '') !== props.componentId) {
                if (((selectedDriver?.id || 0) > 0 && (props.selectedCarrierDriver?.id || 0) > 0) && selectedDriver.id === props.selectedCarrierDriver.id) {
                    setSelectedDriver(selectedDriver => {
                        return {
                            ...selectedDriver,
                            ...props.selectedCarrierDriver
                        }
                    })
                }
            }
        }
    }, [props.selectedCarrierDriver])

    useEffect(() => {
        if (props.screenFocused) {
            refCarrierCode.current.focus({
                preventScroll: true
            });
        }
    }, [props.screenFocused])

    useEffect(() => {

    }, []);

    useEffect(() => {
        if (isCalendarShown) {
            setInsuranceCompanyDropdownItems([]);
            setDriverEquipmentDropdownItems([]);
        }
    }, [isCalendarShown])

    useEffect(async () => {
        let emails = [];
        (selectedCarrier?.mailing_address?.mailing_contact?.email_work || '') !== '' && emails.push({ id: 1, type: 'work', email: selectedCarrier?.mailing_address?.mailing_contact.email_work });
        (selectedCarrier?.mailing_address?.mailing_contact?.email_personal || '') !== '' && emails.push({ id: 2, type: 'personal', email: selectedCarrier?.mailing_address?.mailing_contact.email_personal });
        (selectedCarrier?.mailing_address?.mailing_contact?.email_other || '') !== '' && emails.push({ id: 3, type: 'other', email: selectedCarrier?.mailing_address?.mailing_contact.email_other });

        await setMailingContactEmailItems(emails);
    }, [
        selectedCarrier?.mailing_address?.mailing_contact?.email_work,
        selectedCarrier?.mailing_address?.mailing_contact?.email_personal,
        selectedCarrier?.mailing_address?.mailing_contact?.email_other,
        selectedCarrier?.mailing_address?.mailing_contact?.primary_email
    ]);

    useEffect(async () => {
        let phones = [];
        (selectedContact?.phone_work || '') !== '' && phones.push({ id: 1, type: 'work', phone: selectedContact.phone_work });
        (selectedContact?.phone_work_fax || '') !== '' && phones.push({ id: 2, type: 'fax', phone: selectedContact.phone_work_fax });
        (selectedContact?.phone_mobile || '') !== '' && phones.push({ id: 3, type: 'mobile', phone: selectedContact.phone_mobile });
        (selectedContact?.phone_direct || '') !== '' && phones.push({ id: 4, type: 'direct', phone: selectedContact.phone_direct });
        (selectedContact?.phone_other || '') !== '' && phones.push({ id: 5, type: 'other', phone: selectedContact.phone_other });

        await setCarrierContactPhoneItems(phones);
    }, [
        selectedContact?.phone_work,
        selectedContact?.phone_work_fax,
        selectedContact?.phone_mobile,
        selectedContact?.phone_direct,
        selectedContact?.phone_other,
        selectedContact?.primary_phone
    ]);

    useEffect(async () => {
        let emails = [];
        (selectedContact?.email_work || '') !== '' && emails.push({ id: 1, type: 'work', email: selectedContact.email_work });
        (selectedContact?.email_personal || '') !== '' && emails.push({ id: 2, type: 'personal', email: selectedContact.email_personal });
        (selectedContact?.email_other || '') !== '' && emails.push({ id: 3, type: 'other', email: selectedContact.email_other });

        await setCarrierContactEmailItems(emails);
    }, [
        selectedContact?.email_work,
        selectedContact?.email_personal,
        selectedContact?.email_other,
        selectedContact?.primary_email
    ]);

    useEffect(async () => {
        let phones = [];
        (selectedCarrier?.mailing_address?.mailing_contact?.phone_work || '') !== '' && phones.push({ id: 1, type: 'work', phone: selectedCarrier?.mailing_address?.mailing_contact.phone_work });
        (selectedCarrier?.mailing_address?.mailing_contact?.phone_work_fax || '') !== '' && phones.push({ id: 2, type: 'fax', phone: selectedCarrier?.mailing_address?.mailing_contact.phone_work_fax });
        (selectedCarrier?.mailing_address?.mailing_contact?.phone_mobile || '') !== '' && phones.push({ id: 3, type: 'mobile', phone: selectedCarrier?.mailing_address?.mailing_contact.phone_mobile });
        (selectedCarrier?.mailing_address?.mailing_contact?.phone_direct || '') !== '' && phones.push({ id: 4, type: 'direct', phone: selectedCarrier?.mailing_address?.mailing_contact.phone_direct });
        (selectedCarrier?.mailing_address?.mailing_contact?.phone_other || '') !== '' && phones.push({ id: 5, type: 'other', phone: selectedCarrier?.mailing_address?.mailing_contact.phone_other });

        await setMailingContactPhoneItems(phones);
    }, [
        selectedCarrier?.mailing_address?.mailing_contact?.phone_work,
        selectedCarrier?.mailing_address?.mailing_contact?.phone_work_fax,
        selectedCarrier?.mailing_address?.mailing_contact?.phone_mobile,
        selectedCarrier?.mailing_address?.mailing_contact?.phone_direct,
        selectedCarrier?.mailing_address?.mailing_contact?.phone_other,
        selectedCarrier?.mailing_address?.mailing_contact?.primary_phone
    ]);

    const setInitialValues = (clearCode = true) => {
        setIsSavingCarrier(false);
        setIsSavingDriver(false);
        setSelectedContact({});
        setSelectedNote({});
        setContactSearch({});
        setShowingContactList(true);
        setSelectedDriver({});
        setSelectedInsurance({})
        setSelectedCarrier({ id: 0, code: clearCode ? '' : selectedCarrier.code });

        // refCarrierCode.current.focus();
    }

    const searchCarrierBtnClick = () => {
        let carrierSearch = [
            {
                field: 'Code',
                data: (selectedCarrier.code || '').toLowerCase()
            },
            {
                field: 'Name',
                data: (selectedCarrier.name || '').toLowerCase()
            },
            {
                field: 'City',
                data: (selectedCarrier.city || '').toLowerCase()
            },
            {
                field: 'State',
                data: (selectedCarrier.state || '').toLowerCase()
            },
            {
                field: 'Postal Code',
                data: selectedCarrier.zip || ''
            },
            {
                field: 'Contact Name',
                data: (selectedCarrier.contact_name || '').toLowerCase()
            },
            {
                field: 'Contact Phone',
                data: selectedCarrier.contact_phone || ''
            },
            {
                field: 'E-Mail',
                data: (selectedCarrier.email || '').toLowerCase()
            }
        ]

        let panel = {
            panelName: `${props.panelName}-carrier-search`,
            component: <CustomerSearch
                title='Carrier Search Results'
                tabTimes={6000 + props.tabTimes}
                panelName={`${props.panelName}-carrier-search`}
                origin={props.origin}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                suborigin={'carrier'}
                componentId={moment().format('x')}
                customerSearch={carrierSearch}

                callback={(carrier) => {
                    new Promise((resolve, reject) => {
                        if (carrier) {
                            setSelectedCarrier({ ...carrier });
                            setSelectedContact((carrier.contacts || []).find(c => c.is_primary === 1) || {});
                            setSelectedInsurance({});
                            setSelectedDriver({});

                            if ((props.selectedCarrier?.id || 0) === 0) {
                                props.setSelectedCarrier({
                                    ...carrier,
                                    component_id: props.componentId
                                });
                                props.setSelectedCarrierContact({
                                    ...((carrier.contacts || []).find(c => c.is_primary === 1) || {}),
                                    component_id: props.componentId
                                });
                            }

                            resolve('OK');
                        } else {
                            reject('no carrier');
                        }
                    }).then(response => {
                        props.closePanel(`${props.panelName}-carrier-search`, props.origin);
                        refCarrierName.current.focus();
                    }).catch(e => {
                        props.closePanel(`${props.panelName}-carrier-search`, props.origin);
                        refCarrierCode.current.focus();
                    });
                }}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const searchCarrierByCode = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (e.target.value.trim() !== '') {
                setIsLoading(true);
                axios.post(props.serverUrl + '/carriers', {
                    code: e.target.value.toLowerCase()
                }).then(async res => {
                    if (res.data.result === 'OK') {
                        if (res.data.carriers.length > 0) {
                            let carrier = res.data.carriers[0];
                            setInitialValues();

                            setSelectedCarrier({ ...carrier });
                            setSelectedContact((carrier.contacts || []).find(c => c.is_primary === 1) || {});
                            setSelectedInsurance({});
                            setSelectedDriver({});

                            if ((props.selectedCarrier?.id || 0) === 0) {
                                props.setSelectedCarrier({
                                    ...carrier,
                                    component_id: props.componentId
                                });
                                props.setSelectedCarrierContact({
                                    ...((carrier.contacts || []).find(c => c.is_primary === 1) || {}),
                                    component_id: props.componentId
                                });
                            }
                        } else {
                            setInitialValues(false);
                        }
                    } else {
                        setInitialValues(false);
                    }

                    setIsLoading(false);
                }).catch(e => {
                    console.log('error getting carriers', e);
                    setIsLoading(false);
                });
            } else {
                setInitialValues(false);
            }
        }
    }

    const getFactoringCompanyByCode = (e) => {
        let key = e.keyCode || e.which;
        let selectedCarrier = { ...selectedCarrier };

        if (key === 9) {
            if (e.target.value.trim() === '') {
                selectedCarrier.factoring_company_id = null;
                selectedCarrier.factoring_company = {};

                setSelectedCarrier(selectedCarrier);

                validateCarrierForSaving(e);
            } else {
                axios.post(props.serverUrl + '/factoringCompanies', { code: e.target.value.trim().toLowerCase() }).then(async res => {
                    if (res.data.result === 'OK') {
                        if (res.data.factoring_companies.length > 0) {
                            setSelectedCarrier(selectedCarrier => {
                                return {
                                    ...selectedCarrier,
                                    factoring_company: res.data.factoring_companies[0],
                                    factoring_company_id: res.data.factoring_companies[0].id
                                }
                            });

                            validateCarrierForSaving(e);
                        } else {
                            setSelectedCarrier(selectedCarrier => {
                                return {
                                    ...selectedCarrier,
                                    factoring_company: {},
                                    factoring_company_id: null
                                }
                            });

                            validateCarrierForSaving(e);
                        }
                    }
                }).catch(e => {
                    console.log('error getting factoring companies', e);

                    setSelectedCarrier(selectedCarrier => {
                        return {
                            ...selectedCarrier,
                            factoring_company: {},
                            factoring_company_id: null
                        }
                    });

                    validateCarrierForSaving(e);
                });
            }
        }
    }

    const validateCarrierForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingCarrier) {
                setIsSavingCarrier(true);
            }
        }
    }

    const validateContactForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingContact) {
                setIsSavingContact(true);
            }
        }
    }

    const searchContactBtnClick = () => {
        let filters = [
            {
                field: 'Carrier Id',
                data: selectedCarrier.id || 0
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
                owner='carrier'
                origin={props.origin}
                suborigin='carrier'
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                contactSearch={{ search: filters }}

                callback={(contact) => {
                    new Promise((resolve, reject) => {
                        if (contact) {
                            setSelectedCarrier({ ...contact.carrier });
                            setSelectedContact({ ...(contact.carrier.contacts || []).find(c => c.is_primary === 1) });

                            setShowingContactList(true);
                            setContactSearch({});

                            resolve('OK');
                        } else {
                            reject('no contact');
                        }
                    }).then(response => {
                        props.closePanel(`${props.panelName}-contact-search`, props.origin);
                        refCarrierName.current.focus();
                    }).catch(e => {
                        props.closePanel(`${props.panelName}-contact-search`, props.origin);
                        refCarrierCode.current.focus();
                    });
                }}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const validateMailingAddressToSave = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingMailingAddress) {
                setIsSavingMailingAddress(true);
            }
        }
    }

    const clearMailingAddressBtn = async () => {
        await setSelectedCarrier({ ...selectedCarrier, mailing_address: {} });

        if (selectedCarrier.id || 0 > 0) {
            await axios.post(props.serverUrl + '/deleteCarrierMailingAddress', { carrier_id: (selectedCarrier.id || 0) }).then(async res => {
                if (res.data.result === 'OK') {
                    await setSelectedCarrier({ ...selectedCarrier, mailing_address: {} });
                }
            }).catch(e => {
                console.log('error removing carrier mailing address', e);
            });
        }
    }

    const remitToAddressBtn = (e) => {
        if (selectedCarrier.id === undefined) {
            window.alert('You must select a carrier first!');
            return;
        }

        if (selectedCarrier.id === 0) {
            window.alert('You must save the carrier first!');
            return;
        }

        let mailing_address = {};

        mailing_address.id = -1;
        mailing_address.carrier_id = selectedCarrier.id;
        mailing_address.code = selectedCarrier.code;
        mailing_address.code_number = selectedCarrier.code_number;
        mailing_address.name = selectedCarrier.name;
        mailing_address.address1 = selectedCarrier.address1;
        mailing_address.address2 = selectedCarrier.address2;
        mailing_address.city = selectedCarrier.city;
        mailing_address.state = selectedCarrier.state;
        mailing_address.zip = selectedCarrier.zip;
        mailing_address.contact_name = selectedCarrier.contact_name;
        mailing_address.contact_phone = selectedCarrier.contact_phone;
        mailing_address.ext = selectedCarrier.ext;
        mailing_address.email = selectedCarrier.email;

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

        } else if (selectedCarrier.contacts.findIndex(x => x.is_primary === 1) > -1) {
            mailing_address.mailing_contact_id = selectedCarrier.contacts[selectedCarrier.contacts.findIndex(x => x.is_primary === 1)].id;
            mailing_address.mailing_contact = selectedCarrier.contacts[selectedCarrier.contacts.findIndex(x => x.is_primary === 1)];

            mailing_address.mailing_contact_primary_phone = selectedCarrier.contacts[selectedCarrier.contacts.findIndex(x => x.is_primary === 1)].phone_work !== ''
                ? 'work'
                : selectedCarrier.contacts[selectedCarrier.contacts.findIndex(x => x.is_primary === 1)].phone_work_fax !== ''
                    ? 'fax'
                    : selectedCarrier.contacts[selectedCarrier.contacts.findIndex(x => x.is_primary === 1)].phone_mobile !== ''
                        ? 'mobile'
                        : selectedCarrier.contacts[selectedCarrier.contacts.findIndex(x => x.is_primary === 1)].phone_direct !== ''
                            ? 'direct'
                            : selectedCarrier.contacts[selectedCarrier.contacts.findIndex(x => x.is_primary === 1)].phone_other !== ''
                                ? 'other' : 'work';

            mailing_address.mailing_contact_primary_email = selectedCarrier.contacts[selectedCarrier.contacts.findIndex(x => x.is_primary === 1)].email_work !== ''
                ? 'work'
                : selectedCarrier.contacts[selectedCarrier.contacts.findIndex(x => x.is_primary === 1)].email_personal !== ''
                    ? 'personal'
                    : selectedCarrier.contacts[selectedCarrier.contacts.findIndex(x => x.is_primary === 1)].email_other !== ''
                        ? 'other' : 'work';

        } else if (selectedCarrier.contacts.length > 0) {
            mailing_address.mailing_contact_id = selectedCarrier.contacts[0].id;
            mailing_address.mailing_contact = selectedCarrier.contacts[0];

            mailing_address.mailing_contact_primary_phone = selectedCarrier.contacts[0].phone_work !== ''
                ? 'work'
                : selectedCarrier.contacts[0].phone_work_fax !== ''
                    ? 'fax'
                    : selectedCarrier.contacts[0].phone_mobile !== ''
                        ? 'mobile'
                        : selectedCarrier.contacts[0].phone_direct !== ''
                            ? 'direct'
                            : selectedCarrier.contacts[0].phone_other !== ''
                                ? 'other' : 'work';

            mailing_address.mailing_contact_primary_email = selectedCarrier.contacts[0].email_work !== ''
                ? 'work'
                : selectedCarrier.contacts[0].email_personal !== ''
                    ? 'personal'
                    : selectedCarrier.contacts[0].email_other !== ''
                        ? 'other' : 'work';

        } else {
            mailing_address.mailing_contact_id = null;
            mailing_address.mailing_contact = {};
            mailing_address.mailing_contact_primary_phone = 'work';
            mailing_address.mailing_contact_primary_email = 'work';
        }

        setSelectedCarrier({ ...selectedCarrier, mailing_address: mailing_address });

        validateMailingAddressToSave({ keyCode: 9 });
    }

    const validateFactoringCompanyToSave = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if ((selectedCarrier.id || 0) > 0) {
                if (!isSavingFactoringCompany) {
                    setIsSavingFactoringCompany(true);
                }
            }
        }
    }

    const searchFactoringCompanyBtnClick = () => {

        if ((selectedCarrier.id || 0) === 0) {
            window.alert('You must select a carrier first!');
            return;
        }

        let factoringCompanySearch = [
            {
                field: 'Name',
                data: (selectedCarrier.factoring_company?.name || '').toLowerCase()
            },
            {
                field: 'Address 1',
                data: (selectedCarrier.factoring_company?.address1 || '').toLowerCase()
            },
            {
                field: 'Address 2',
                data: (selectedCarrier.factoring_company?.address2 || '').toLowerCase()
            },
            {
                field: 'City',
                data: (selectedCarrier.factoring_company?.city || '').toLowerCase()
            },
            {
                field: 'State',
                data: (selectedCarrier.factoring_company?.state || '').toLowerCase()
            },
            {
                field: 'Postal Code',
                data: (selectedCarrier.factoring_company?.zip || '').toLowerCase()
            },
            {
                field: 'E-Mail',
                data: (selectedCarrier.factoring_company?.email || '').toLowerCase()
            }
        ]

        let panel = {
            panelName: `${props.panelName}-factoring-company-search`,
            component: <CustomerSearch
                title='Factoring Company Search Results'
                tabTimes={6000 + props.tabTimes}
                panelName={`${props.panelName}-factoring-company-search`}
                origin={props.origin}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                suborigin={'factoring-company'}
                componentId={moment().format('x')}
                customerSearch={factoringCompanySearch}

                callback={(factoringCompany) => {
                    new Promise((resolve, reject) => {
                        if (factoringCompany) {
                            setSelectedCarrier(selectedCarrier => {
                                return {
                                    ...selectedCarrier,
                                    factoring_company: factoringCompany,
                                    factoring_company_id: factoringCompany.id
                                }
                            });

                            validateCarrierForSaving({ keyCode: 9 });

                            resolve('OK');
                        } else {
                            reject('no factoring company');
                        }
                    }).then(response => {
                        props.closePanel(`${props.panelName}-factoring-company-search`, props.origin);
                        refFactoringCompanyName.current.focus();
                    }).catch(e => {
                        props.closePanel(`${props.panelName}-factoring-company-search`, props.origin);
                        refFactoringCompanyCode.current.focus();
                    });
                }}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const moreFactoringCompanyBtnClick = () => {
        if ((selectedCarrier.id || 0) === 0) {
            window.alert('You must select a carrier first!');
            return;
        }

        if ((selectedCarrier.factoring_company?.id || 0) === 0) {
            window.alert('You must select a factoring company first!');
            return;
        }

        let panel = {
            panelName: `${props.panelName}-factoring-company`,
            fixedWidthPercentage: 70,
            component: <FactoringCompany
                panelName={`${props.panelName}-factoring-company`}
                title='Factoring Company'
                tabTimes={11000 + props.tabTimes}
                origin={props.origin}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}

                factoringCompanyId={selectedCarrier.factoring_company.id}
                selectedCarrier={selectedCarrier}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const clearFactoringCompanyBtnClick = () => {
        let selectedCarrier = { ...selectedCarrier };
        selectedCarrier.factoring_company_id = null;
        setSelectedCarrier(selectedCarrier => {
            return {
                ...selectedCarrier,
                factoring_company: {}
            }
        });


        if (selectedCarrier.id || 0 > 0) {
            axios.post(props.serverUrl + '/saveCarrier', selectedCarrier).then(res => {
                if (res.data.result === 'OK') {
                    setSelectedCarrier(selectedCarrier => {
                        return {
                            ...selectedCarrier,
                            factoring_company: {}
                        }
                    });

                    props.setSelectedCarrier({
                        id: selectedCarrier.id,
                        factoring_company: {},
                        component_id: props.componentId
                    })
                }
            }).catch(e => {
                console.log('error saving carrier', e);
            });
        }
    }

    const printWindow = (data) => {
        let mywindow = window.open('', 'new div', 'height=400,width=600');
        mywindow.document.write('<html><head><title></title>');
        mywindow.document.write('<link rel="stylesheet" href="../../css/index.css" type="text/css" media="all" />');
        mywindow.document.write('</head><body >');
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');
        mywindow.document.close();
        mywindow.focus();
        setTimeout(function () { mywindow.print(); }, 1000);

        return true;
    }

    useEffect(() => {
        if (isSavingDriver) {
            if ((selectedCarrier?.id || 0) > 0) {
                let driver = { ...selectedDriver, carrier_id: selectedCarrier.id };

                if ((driver?.first_name || '').trim() !== '') {

                    axios.post(props.serverUrl + '/saveCarrierDriver', driver).then(res => {
                        if (res.data.result === 'OK') {
                            setSelectedCarrier(selectedCarrier => {
                                return {
                                    ...selectedCarrier,
                                    drivers: res.data.drivers
                                }
                            });

                            setSelectedDriver(selectedDriver => {
                                return {
                                    ...selectedDriver,
                                    id: res.data.driver.id
                                }
                            });

                            props.setSelectedCarrier({
                                id: selectedCarrier.id,
                                drivers: res.data.drivers,
                                component_id: props.componentId
                            });

                            props.setSelectedDriver({
                                ...res.data.driver,
                                component_id: props.componentId
                            });
                        }

                        setIsSavingDriver(false);
                    }).catch(e => {
                        console.log('error on saving carrier driver', e);
                        setIsSavingDriver(false);
                    });
                } else {
                    setIsSavingDriver(false);
                }
            }
        }
    }, [isSavingDriver])

    const validateDriverForSaving = (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            if (!isSavingDriver) {
                setIsSavingDriver(true);
            }
        }
    }

    useEffect(() => {
        if (isSavingInsurance) {
            let insurance = { ...selectedInsurance, carrier_id: (selectedCarrier?.id || 0) };

            if ((insurance.insurance_type_id || 0) > 0 &&
                (insurance.company || '') !== '' &&
                (insurance.expiration_date || '') !== '' &&
                (insurance.amount || '') !== '') {

                insurance.expiration_date = getFormattedDates(insurance.expiration_date);
                insurance.amount = accounting.unformat(insurance.amount);
                insurance.deductible = accounting.unformat(insurance.deductible);

                axios.post(props.serverUrl + '/saveInsurance', insurance).then(res => {
                    if (res.data.result === 'OK') {
                        setSelectedCarrier(selectedCarrier => {
                            return {
                                ...selectedCarrier,
                                insurances: res.data.insurances
                            }
                        });
                        setSelectedInsurance({
                            ...insurance,
                            id: res.data.insurance.id,
                            amount: res.data.insurance.amount ? accounting.formatNumber(res.data.insurance.amount, 2, ',', '.') : res.data.insurance.amount,
                            deductible: res.data.insurance.deductible ? accounting.formatNumber(res.data.insurance.deductible, 2, ',', '.') : res.data.insurance.deductible
                        });

                        props.setSelectedCarrier({
                            id: selectedCarrier.id,
                            insurances: res.data.insurances,
                            component_id: props.componentId
                        });

                        props.setSelectedInsurance({
                            ...insurance,
                            component_id: props.componentId
                        });
                    }

                }).then(() => {
                    setIsSavingInsurance(false);
                }).catch(e => {
                    console.log('error on saving carrier insurance', e);
                    setIsSavingInsurance(false);
                });
            } else {
                setIsSavingInsurance(false);
            }
        }
    }, [isSavingInsurance])

    const validateInsuranceForSaving = async (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            if (!isSavingInsurance) {
                setIsSavingInsurance(true);
            }
        }

        if (key === 13) {
            let expiration_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedInsurance?.expiration_date || ''), 'MM/DD/YYYY');
            await setPreSelectedExpirationDate(expiration_date);

            if (isCalendarShown) {
                expiration_date = preSelectedExpirationDate.clone().format('MM/DD/YYYY');

                let insurance = { ...selectedInsurance, carrier_id: selectedCarrier.id };
                insurance.expiration_date = expiration_date;

                await setSelectedInsurance(insurance);

                if (!isSavingInsurance) {
                    setIsSavingInsurance(true);
                }
                await setIsCalendarShown(false);
            }
        }

        if (key >= 37 && key <= 40) {
            let expiration_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedInsurance?.expiration_date || ''), 'MM/DD/YYYY');
            await setPreSelectedExpirationDate(expiration_date);

            if (isCalendarShown) {
                e.preventDefault();

                if (key === 37) { // left - minus 1
                    setPreSelectedExpirationDate(preSelectedExpirationDate.clone().subtract(1, 'day'));
                }

                if (key === 38) { // up - minus 7
                    setPreSelectedExpirationDate(preSelectedExpirationDate.clone().subtract(7, 'day'));
                }

                if (key === 39) { // right - plus 1
                    setPreSelectedExpirationDate(preSelectedExpirationDate.clone().add(1, 'day'));
                }

                if (key === 40) { // down - plus 7
                    setPreSelectedExpirationDate(preSelectedExpirationDate.clone().add(7, 'day'));
                }
            } else {
                if (key === 38 || key === 40) {
                    setIsCalendarShown(true);
                }
            }
        }
    }

    const insuranceStatusClasses = () => {
        let classes = 'input-box-container insurance-status';
        let curDate = moment().startOf('day');
        let curDate2 = moment();
        let futureMonth = curDate2.add(1, 'M');
        let statusClass = '';

        (selectedCarrier.insurances || []).map((insurance, index) => {
            let expDate = moment(insurance.expiration_date, 'MM/DD/YYYY');

            if (expDate < curDate) {
                statusClass = 'expired';
            } else if (expDate >= curDate && expDate <= futureMonth) {
                if (statusClass !== 'expired') {
                    statusClass = 'warning';
                }
            } else {
                if (statusClass !== 'expired' && statusClass !== 'warning') {
                    statusClass = 'active';
                }
            }
        })

        return classes + ' ' + statusClass;
    }

    const documentsBtnClick = () => {
        if ((selectedCarrier?.id || 0) > 0) {
            let panel = {
                panelName: `${props.panelName}-documents`,
                component: <Documents
                    title='Documents'
                    tabTimes={26000 + props.tabTimes}
                    panelName={`${props.panelName}-documents`}
                    origin={props.origin}
                    suborigin={'carrier'}
                    openPanel={props.openPanel}
                    closePanel={props.closePanel}
                    componentId={moment().format('x')}
                    selectedOwner={{ ...selectedCarrier }}
                    selectedOwnerDocument={{
                        id: 0,
                        user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                        date_entered: moment().format('MM/DD/YYYY')
                    }}
                    savingDocumentUrl='/saveCarrierDocument'
                    deletingDocumentUrl='/deleteCarrierDocument'
                    savingDocumentNoteUrl='/saveCarrierDocumentNote'
                    serverDocumentsFolder='/carrier-documents/'
                />
            }

            props.openPanel(panel, props.origin);
        } else {
            window.alert('You must select a customer first!');
        }
    }

    const revenueInformationBtnClick = () => {
        let panel = {
            panelName: `${props.panelName}-revenue-information`,
            component: <RevenueInformation
                title='Revenue Information'
                tabTimes={23000 + props.tabTimes}
                panelName={`${props.panelName}-revenue-information`}
                origin={props.origin}
                suborigin={'carrier'}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                selectedCustomer={selectedCarrier}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const equipmentInformationBtnClick = () => {
        let panel = {
            panelName: `${props.panelName}-equipment-information`,
            fixedWidthPercentage: 40,
            component: <EquipmentInformation
                panelName={`${props.panelName}-equipment-information`}
                tabTimes={15000 + props.tabTimes}
                title={'Equipment Information'}
                origin={props.origin}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                carrier={selectedCarrier}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const orderHistoryBtnClick = () => {
        let panel = {
            panelName: `${props.panelName}-order-history`,
            component: <OrderHistory
                title='Order History'
                tabTimes={24000 + props.tabTimes}
                panelName={`${props.panelName}-order-history`}
                origin={props.origin}
                suborigin={'carrier'}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                selectedCustomer={selectedCarrier}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const goToTabindex = (index) => {
        let elems = document.getElementsByTagName('input');

        for (var i = elems.length; i--;) {
            if (elems[i].getAttribute('tabindex') && elems[i].getAttribute('tabindex') === index) {
                elems[i].focus();
                break;
            }
        }
    }

    const getFormattedDates = (date) => {
        let formattedDate = date;

        try {
            if (moment(date.trim(), 'MM/DD/YY').format('MM/DD/YY') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/DD/YY').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/DD/').format('MM/DD/') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/DD/').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/DD').format('MM/DD') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/DD').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/').format('MM/') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM').format('MM') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M/D/Y').format('M/D/Y') === date.trim()) {
                formattedDate = moment(date.trim(), 'M/D/Y').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/D/Y').format('MM/D/Y') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/D/Y').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/DD/Y').format('MM/DD/Y') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/DD/Y').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M/DD/Y').format('M/DD/Y') === date.trim()) {
                formattedDate = moment(date.trim(), 'M/DD/Y').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M/D/YY').format('M/D/YY') === date.trim()) {
                formattedDate = moment(date.trim(), 'M/D/YY').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M/D/YYYY').format('M/D/YYYY') === date.trim()) {
                formattedDate = moment(date.trim(), 'M/D/YYYY').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/D/YYYY').format('MM/D/YYYY') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/D/YYYY').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/DD/YYYY').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M/DD/YYYY').format('M/DD/YYYY') === date.trim()) {
                formattedDate = moment(date.trim(), 'M/DD/YYYY').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M/D/').format('M/D/') === date.trim()) {
                formattedDate = moment(date.trim(), 'M/D/').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M/D').format('M/D') === date.trim()) {
                formattedDate = moment(date.trim(), 'M/D').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'MM/D').format('MM/D') === date.trim()) {
                formattedDate = moment(date.trim(), 'MM/D').format('MM/DD/YYYY');
            }

            if (moment(date.trim(), 'M').format('M') === date.trim()) {
                formattedDate = moment(date.trim(), 'M').format('MM/DD/YYYY');
            }
        } catch (e) {
            console.log(e);
        }

        return formattedDate;
    }

    const importCarrierBtnClick = () => {
        let panel = {
            panelName: `${props.panelName}-carrier-import`,
            component: <CarrierImport
                title='Import Carriers'
                tabTimes={20000 + props.tabTimes}
                panelName={`${props.panelName}-carrier-import`}
                origin={props.origin}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
            />
        }

        props.openPanel(panel, props.origin);
    }

    return (
        <div className="carriers-main-container" style={{
            borderRadius: props.scale === 1 ? 0 : '20px',
            background: props.isOnPanel ? 'transparent' : 'rgb(250, 250, 250)',
            background: props.isOnPanel ? 'transparent' : '-moz-radial-gradient(center, ellipse cover, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)',
            background: props.isOnPanel ? 'transparent' : '-webkit-radial-gradient(center, ellipse cover, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)',
            background: props.isOnPanel ? 'transparent' : 'radial-gradient(ellipse at center, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)',
            padding: props.isOnPanel ? '10px 0' : 10,
            position: props.isOnPanel ? 'unset' : 'relative'
        }}>

            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style} >
                        <div className="loading-container-wrapper">
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                        </div>
                    </animated.div>
                )
            }

            {
                (selectedCarrier?.id || 0) > 0 &&
                <div style={{ display: 'none' }}>
                    <ToPrint
                        ref={refPrintCarrierInformation}
                        selectedCarrier={selectedCarrier}
                    />
                </div>

            }

            <div className="fields-container-row">
                <div className="fields-container-col">
                    <div className="form-bordered-box" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '15px 10px'
                    }}>
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Carrier</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                {
                                    (props.isAdmin || false) &&
                                    <div className="mochi-button" onClick={importCarrierBtnClick}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Import</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }
                                <div className="mochi-button" onClick={searchCarrierBtnClick}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Search</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={() => {
                                    setInitialValues(true);
                                    refCarrierCode.current.focus();
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Clear</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-row">
                            <div className="input-box-container input-code">
                                <input tabIndex={43 + props.tabTimes} type="text" placeholder="Code" maxLength="8"
                                    ref={refCarrierCode}
                                    onKeyDown={searchCarrierByCode}
                                    onInput={e => {
                                        setSelectedCarrier({
                                            ...selectedCarrier,
                                            code: e.target.value,
                                            code_number: 0
                                        })
                                    }}
                                    onChange={e => {
                                        setSelectedCarrier({
                                            ...selectedCarrier,
                                            code: e.target.value,
                                            code_number: 0
                                        })
                                    }}
                                    value={(selectedCarrier.code_number || 0) === 0 ? (selectedCarrier.code || '') : selectedCarrier.code + selectedCarrier.code_number}
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={44 + props.tabTimes} type="text" placeholder="Name"
                                    ref={refCarrierName}
                                    // onKeyDown={validateCarrierForSaving} 
                                    onChange={e => setSelectedCarrier({ ...selectedCarrier, name: e.target.value })}
                                    value={selectedCarrier.name || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={45 + props.tabTimes} type="text" placeholder="Address 1"
                                    // onKeyDown={validateCarrierForSaving} 
                                    onChange={e => setSelectedCarrier({ ...selectedCarrier, address1: e.target.value })}
                                    value={selectedCarrier.address1 || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={46 + props.tabTimes} type="text" placeholder="Address 2"
                                    // onKeyDown={validateCarrierForSaving} 
                                    onChange={e => setSelectedCarrier({ ...selectedCarrier, address2: e.target.value })}
                                    value={selectedCarrier.address2 || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={47 + props.tabTimes} type="text" placeholder="City"
                                    // onKeyDown={validateCarrierForSaving} 
                                    onChange={e => setSelectedCarrier({ ...selectedCarrier, city: e.target.value })}
                                    value={selectedCarrier.city || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-state">
                                <input tabIndex={48 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                    // onKeyDown={validateCarrierForSaving} 
                                    onChange={e => setSelectedCarrier({ ...selectedCarrier, state: e.target.value })}
                                    value={selectedCarrier.state || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-zip-code">
                                <input tabIndex={49 + props.tabTimes} type="text" placeholder="Postal Code"
                                    onKeyDown={validateCarrierForSaving}
                                    onChange={e => setSelectedCarrier({ ...selectedCarrier, zip: e.target.value })}
                                    value={selectedCarrier.zip || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={50 + props.tabTimes} type="text" placeholder="Contact Name"
                                    onInput={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({ ...selectedCarrier, contact_name: e.target.value })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({ ...selectedCarrier, contact_name: e.target.value })
                                        }
                                    }}
                                    value={
                                        (selectedCarrier?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedCarrier?.contact_name || '')
                                            : selectedCarrier?.contacts.find(c => c.is_primary === 1).first_name + ' ' + selectedCarrier?.contacts.find(c => c.is_primary === 1).last_name
                                    }
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-phone" style={{ position: 'relative' }}>
                                <MaskedInput tabIndex={51 + props.tabTimes}
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Contact Phone"
                                    onInput={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({ ...selectedCarrier, contact_phone: e.target.value })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({ ...selectedCarrier, contact_phone: e.target.value })
                                        }
                                    }}
                                    value={
                                        (selectedCarrier?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedCarrier?.contact_phone || '')
                                            : selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'work'
                                                ? selectedCarrier?.contacts.find(c => c.is_primary === 1).phone_work
                                                : selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'fax'
                                                    ? selectedCarrier?.contacts.find(c => c.is_primary === 1).phone_work_fax
                                                    : selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'mobile'
                                                        ? selectedCarrier?.contacts.find(c => c.is_primary === 1).phone_mobile
                                                        : selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'direct'
                                                            ? selectedCarrier?.contacts.find(c => c.is_primary === 1).phone_direct
                                                            : selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'other'
                                                                ? selectedCarrier?.contacts.find(c => c.is_primary === 1).phone_other
                                                                : ''
                                    }
                                />

                                {
                                    ((selectedCarrier?.contacts || []).find(c => c.is_primary === 1) !== undefined) &&
                                    <div
                                        className={classnames({
                                            'selected-carrier-contact-primary-phone': true,
                                            'pushed': false
                                        })}>
                                        {selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_phone}
                                    </div>
                                }
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-phone-ext">
                                <input tabIndex={52 + props.tabTimes} type="text" placeholder="Ext"
                                    onInput={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({ ...selectedCarrier, ext: e.target.value })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({ ...selectedCarrier, ext: e.target.value })
                                        }
                                    }}
                                    value={
                                        (selectedCarrier?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedCarrier?.ext || '')
                                            : selectedCarrier?.contacts.find(c => c.is_primary === 1).phone_ext
                                    }
                                />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container" style={{ position: 'relative', flexGrow: 1 }}>
                                <input tabIndex={53 + props.tabTimes} type="text" placeholder="E-Mail" style={{ textTransform: 'lowercase' }}
                                    onKeyDown={validateCarrierForSaving}
                                    onInput={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({ ...selectedCarrier, email: e.target.value })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedCarrier?.contacts || []).length === 0) {
                                            setSelectedCarrier({ ...selectedCarrier, email: e.target.value })
                                        }
                                    }}
                                    value={
                                        (selectedCarrier?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedCarrier?.email || '')
                                            : selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_email === 'work'
                                                ? selectedCarrier?.contacts.find(c => c.is_primary === 1).email_work
                                                : selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_email === 'personal'
                                                    ? selectedCarrier?.contacts.find(c => c.is_primary === 1).email_personal
                                                    : selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_email === 'other'
                                                        ? selectedCarrier?.contacts.find(c => c.is_primary === 1).email_other
                                                        : ''
                                    }
                                />
                                {
                                    ((selectedCarrier?.contacts || []).find(c => c.is_primary === 1) !== undefined) &&
                                    <div
                                        className={classnames({
                                            'selected-carrier-contact-primary-email': true,
                                            'pushed': false
                                        })}>
                                        {selectedCarrier?.contacts.find(c => c.is_primary === 1).primary_email}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fields-container-col grow">
                    <div className="form-borderless-box" style={{
                        alignItems: 'center',
                        padding: '15px 5px'
                    }}>
                        <div className="input-toggle-container">
                            <input type="checkbox" id={props.panelName + 'cbox-carrier-do-not-use-btn'} onChange={(e) => {
                                setSelectedCarrier({ ...selectedCarrier, do_not_use: e.target.checked ? 1 : 0 });
                                validateCarrierForSaving({ keyCode: 9 });
                            }} checked={(selectedCarrier.do_not_use || 0) === 1} />
                            <label htmlFor={props.panelName + 'cbox-carrier-do-not-use-btn'}>
                                <div className="label-text">DO NOT USE</div>
                                <div className="input-toggle-btn"></div>
                            </label>
                        </div>

                        {/* <ReactStars {...carrierStars} /> */}
                        <Rating
                            name="simple-controlled"
                            value={selectedCarrier?.rating || 0}
                            onChange={(e, newValue) => {
                                setSelectedCarrier({
                                    ...selectedCarrier,
                                    rating: newValue
                                });

                                validateCarrierForSaving({ keyCode: 9 });
                            }}
                        />

                        <div className="input-box-container" style={{ width: '100%' }}>
                            <input tabIndex={76 + props.tabTimes} type="text" placeholder='MC Number'
                                onKeyDown={validateCarrierForSaving}
                                onChange={(e) => {
                                    setSelectedCarrier({ ...selectedCarrier, mc_number: e.target.value })
                                }}
                                value={selectedCarrier.mc_number || ''} />
                        </div>
                        <div className="input-box-container" style={{ width: '100%' }}>
                            <input tabIndex={77 + props.tabTimes} type="text" placeholder='DOT Number'
                                onKeyDown={validateCarrierForSaving}
                                onChange={(e) => {
                                    setSelectedCarrier({ ...selectedCarrier, dot_number: e.target.value })
                                }}
                                value={selectedCarrier.dot_number || ''} />
                        </div>
                        <div className="input-box-container" style={{ width: '100%' }}>
                            <input tabIndex={78 + props.tabTimes} type="text" placeholder='SCAC' style={{ textTransform: 'uppercase' }}
                                onKeyDown={validateCarrierForSaving}
                                onChange={(e) => {
                                    setSelectedCarrier({ ...selectedCarrier, scac: e.target.value })
                                }}
                                value={selectedCarrier.scac || ''} />
                        </div>
                        <div className="input-box-container" style={{ width: '100%' }}>
                            <input tabIndex={79 + props.tabTimes} type="text" placeholder='FID'
                                onKeyDown={validateCarrierForSaving}
                                onChange={(e) => {
                                    setSelectedCarrier({ ...selectedCarrier, fid: e.target.value })
                                }}
                                value={selectedCarrier.fid || ''} />
                        </div>
                        <div className={insuranceStatusClasses()} style={{ width: '100%' }}>
                            <input type="text" placeholder='Insurance' readOnly={true} />
                        </div>
                    </div>
                </div>

                <div className="fields-container-col" style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>

                    <div className="form-bordered-box" style={{
                        flexGrow: 0,
                        marginBottom: 10
                    }}>
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Contacts</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button" onClick={async () => {
                                    if (selectedCarrier.id === undefined) {
                                        window.alert('You must select a contact first!');
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
                                            savingContactUrl='/saveCarrierContact'
                                            deletingContactUrl='/deleteCarrierContact'
                                            uploadAvatarUrl='/uploadCarrierAvatar'
                                            removeAvatarUrl='/removeCarrierAvatar'
                                            origin={props.origin}
                                            owner='carrier'
                                            openPanel={props.openPanel}
                                            closePanel={props.closePanel}
                                            componentId={moment().format('x')}

                                            contactSearchCustomer={{
                                                ...selectedCarrier,
                                                selectedContact: selectedContact
                                            }}
                                        />
                                    }

                                    props.openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">More</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={() => {
                                    if (selectedCarrier.id === undefined || selectedCarrier.id <= 0) {
                                        window.alert('You must select a carrier');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-contacts`,
                                        component: <Contacts
                                            title='Contacts'
                                            tabTimes={22000 + props.tabTimes}
                                            panelName={`${props.panelName}-contacts`}
                                            savingContactUrl='/saveCarrierContact'
                                            deletingContactUrl='/deleteCarrierContact'
                                            uploadAvatarUrl='/uploadCarrierAvatar'
                                            removeAvatarUrl='/removeCarrierAvatar'
                                            origin={props.origin}
                                            owner='carrier'
                                            isEditingContact={true}
                                            openPanel={props.openPanel}
                                            closePanel={props.closePanel}
                                            componentId={moment().format('x')}

                                            contactSearchCustomer={{
                                                ...selectedCarrier,
                                                selectedContact: { id: 0, carrier_id: selectedCarrier?.id }
                                            }}
                                        />
                                    }

                                    props.openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Add contact</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={() => setSelectedContact({})}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Clear</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={80 + props.tabTimes} type="text" placeholder="First Name"
                                    ref={refCarrierContactFirstName}
                                    // onKeyDown={validateContactForSaving} 
                                    onChange={e => { setSelectedContact({ ...selectedContact, first_name: e.target.value }) }}
                                    value={selectedContact.first_name || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={81 + props.tabTimes} type="text" placeholder="Last Name"
                                    // onKeyDown={validateContactForSaving}
                                    onChange={e => setSelectedContact({ ...selectedContact, last_name: e.target.value })}
                                    value={selectedContact.last_name || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ width: '50%' }}>
                                <div className="select-box-wrapper">
                                    <MaskedInput tabIndex={82 + props.tabTimes}
                                        ref={refCarrierContactPhone}
                                        mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                        guide={true}
                                        type="text" placeholder="Phone"
                                        onKeyDown={async (e) => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (showCarrierContactPhones) {
                                                        let selectedIndex = carrierContactPhoneItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setCarrierContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setCarrierContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (carrierContactPhoneItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refCarrierContactPhonePopupItems.current.map((r, i) => {
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
                                                        if (carrierContactPhoneItems.length > 1) {
                                                            await setCarrierContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedContact?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            setShowCarrierContactPhones(true);

                                                            refCarrierContactPhonePopupItems.current.map((r, i) => {
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

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (showCarrierContactPhones) {
                                                        let selectedIndex = carrierContactPhoneItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setCarrierContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setCarrierContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                                if (selectedIndex === (carrierContactPhoneItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refCarrierContactPhonePopupItems.current.map((r, i) => {
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
                                                        if (carrierContactPhoneItems.length > 1) {
                                                            await setCarrierContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedContact?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            setShowCarrierContactPhones(true);

                                                            refCarrierContactPhonePopupItems.current.map((r, i) => {
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
                                                    setShowCarrierContactPhones(false);
                                                    break;

                                                case 13: // enter
                                                    if (showCarrierContactPhones && carrierContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedContact({
                                                            ...selectedContact,
                                                            primary_phone: carrierContactPhoneItems[carrierContactPhoneItems.findIndex(item => item.selected)].type
                                                        });

                                                        validateContactForSaving({ keyCode: 9 });
                                                        setShowCarrierContactPhones(false);
                                                        refCarrierContactPhone.current.inputElement.focus();
                                                    }
                                                    break;
                                                case 9: // tab
                                                    if (showCarrierContactPhones) {
                                                        e.preventDefault();
                                                        await setSelectedContact({
                                                            ...selectedContact,
                                                            primary_phone: carrierContactPhoneItems[carrierContactPhoneItems.findIndex(item => item.selected)].type
                                                        });

                                                        validateContactForSaving({ keyCode: 9 });
                                                        setShowCarrierContactPhones(false);
                                                        refCarrierContactPhone.current.inputElement.focus();
                                                    } else {
                                                        validateContactForSaving({ keyCode: 9 });
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
                                                'selected-carrier-contact-primary-phone': true,
                                                'pushed': (carrierContactPhoneItems.length > 1)
                                            })}>
                                            {selectedContact?.primary_phone || ''}
                                        </div>
                                    }

                                    {
                                        carrierContactPhoneItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
                                            if (showCarrierContactPhones) {
                                                setShowCarrierContactPhones(false);
                                            } else {
                                                if (carrierContactPhoneItems.length > 1) {
                                                    await setCarrierContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                        item.selected = item.type === (selectedContact?.primary_phone || '')
                                                        return item;
                                                    }))

                                                    window.setTimeout(async () => {
                                                        await setShowCarrierContactPhones(true);

                                                        refCarrierContactPhonePopupItems.current.map((r, i) => {
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

                                            refCarrierContactPhone.current.inputElement.focus();
                                        }} />
                                    }
                                </div>
                                {
                                    carrierContactPhonesTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-contact-phone"
                                            style={{
                                                ...style,
                                                left: '0',
                                                display: 'block'
                                            }}
                                            ref={refCarrierContactPhoneDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            carrierContactPhoneItems.map((item, index) => {
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
                                                                            await setSelectedContact(selectedContact => {
                                                                                return {
                                                                                    ...selectedContact,
                                                                                    primary_phone: item.type
                                                                                }
                                                                            });

                                                                            validateContactForSaving({ keyCode: 9 });
                                                                            setShowCarrierContactPhones(false);
                                                                            refCarrierContactPhone.current.inputElement.focus();
                                                                        }}
                                                                        ref={ref => refCarrierContactPhonePopupItems.current.push(ref)}
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
                                                                            <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                                <div className="input-box-container input-phone-ext">
                                    <input tabIndex={83 + props.tabTimes} type="text" placeholder="Ext"
                                        // onKeyDown={validateContactForSaving}
                                        onChange={e => setSelectedContact({ ...selectedContact, phone_ext: e.target.value })}
                                        value={selectedContact.phone_ext || ''}
                                    />
                                </div>
                                <div className="input-toggle-container">
                                    <input type="checkbox" id={props.panelName + 'cbox-carrier-contacts-primary-btn'}
                                        onChange={(e) => {
                                            setSelectedContact({ ...selectedContact, is_primary: e.target.checked ? 1 : 0 });
                                            validateContactForSaving({ keyCode: 9 });
                                        }}
                                        checked={(selectedContact.is_primary || 0) === 1} />
                                    <label htmlFor={props.panelName + 'cbox-carrier-contacts-primary-btn'}>
                                        <div className="label-text">Primary</div>
                                        <div className="input-toggle-btn"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ flexGrow: 1 }}>
                                <div className="select-box-wrapper">
                                    <input tabIndex={84 + props.tabTimes} type="text" placeholder="E-Mail"
                                        style={{
                                            width: 'calc(100% - 25px)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        ref={refCarrierContactEmail}
                                        onKeyDown={async (e) => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (showCarrierContactEmails) {
                                                        let selectedIndex = carrierContactEmailItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setCarrierContactEmailItems(carrierContactEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setCarrierContactEmailItems(carrierContactEmailItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (carrierContactEmailItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refCarrierContactEmailPopupItems.current.map((r, i) => {
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
                                                        if (carrierContactEmailItems.length > 1) {
                                                            await setCarrierContactEmailItems(carrierContactEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedContact?.primary_email || '')
                                                                return item;
                                                            }))

                                                            setShowCarrierContactEmails(true);

                                                            refCarrierContactEmailPopupItems.current.map((r, i) => {
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

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (showCarrierContactEmails) {
                                                        let selectedIndex = carrierContactEmailItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setCarrierContactEmailItems(carrierContactEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setCarrierContactEmailItems(carrierContactEmailItems.map((item, index) => {
                                                                if (selectedIndex === (carrierContactEmailItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refCarrierContactEmailPopupItems.current.map((r, i) => {
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
                                                        if (carrierContactEmailItems.length > 1) {
                                                            await setCarrierContactEmailItems(carrierContactEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedContact?.primary_email || '')
                                                                return item;
                                                            }))

                                                            setShowCarrierContactEmails(true);

                                                            refCarrierContactEmailPopupItems.current.map((r, i) => {
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
                                                    setShowCarrierContactEmails(false);
                                                    break;

                                                case 13: // enter
                                                    if (showCarrierContactEmails && carrierContactEmailItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedContact({
                                                            ...selectedContact,
                                                            primary_email: carrierContactEmailItems[carrierContactEmailItems.findIndex(item => item.selected)].type
                                                        });

                                                        validateContactForSaving({ keyCode: 9 });
                                                        setShowCarrierContactEmails(false);
                                                        refCarrierContactEmail.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showCarrierContactEmails) {
                                                        e.preventDefault();
                                                        await setSelectedContact({
                                                            ...selectedContact,
                                                            primary_email: carrierContactEmailItems[carrierContactEmailItems.findIndex(item => item.selected)].type
                                                        });

                                                        validateContactForSaving({ keyCode: 9 });
                                                        setShowCarrierContactEmails(false);
                                                        refCarrierContactEmail.current.focus();
                                                    } else {
                                                        validateContactForSaving({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={(e) => {
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
                                            }
                                        }}
                                        onChange={(e) => {
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
                                        (selectedContact?.id || 0) > 0 &&
                                        <div
                                            className={classnames({
                                                'selected-carrier-contact-primary-email': true,
                                                'pushed': (carrierContactEmailItems.length > 1)
                                            })}>
                                            {selectedContact?.primary_email || ''}
                                        </div>
                                    }

                                    {
                                        carrierContactEmailItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
                                            if (showCarrierContactEmails) {
                                                setShowCarrierContactEmails(false);
                                            } else {
                                                if (carrierContactEmailItems.length > 1) {
                                                    await setCarrierContactEmailItems(carrierContactEmailItems.map((item, index) => {
                                                        item.selected = item.type === (selectedContact?.primary_email || '')
                                                        return item;
                                                    }))

                                                    window.setTimeout(async () => {
                                                        await setShowCarrierContactEmails(true);

                                                        refCarrierContactEmailPopupItems.current.map((r, i) => {
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

                                            refCarrierContactEmail.current.focus();
                                        }} />
                                    }
                                </div>
                                {
                                    carrierContactEmailsTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-contact-email"
                                            style={{
                                                ...style,
                                                left: '0',
                                                display: 'block'
                                            }}
                                            ref={refCarrierContactEmailDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            carrierContactEmailItems.map((item, index) => {
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

                                                                            validateContactForSaving({ keyCode: 9 });
                                                                            setShowCarrierContactEmails(false);
                                                                            refCarrierContactEmail.current.focus();
                                                                        }}
                                                                        ref={ref => refCarrierContactEmailPopupItems.current.push(ref)}
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
                                                                            <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            <div className="input-box-container grow">
                                <input tabIndex={85 + props.tabTimes} type="text" placeholder="Notes" onKeyDown={validateContactForSaving} onChange={e => setSelectedContact({ ...selectedContact, notes: e.target.value })} value={selectedContact.notes || ''} />
                            </div>
                        </div>
                    </div>

                    <div className="form-bordered-box" style={{
                        flexGrow: 1
                    }}>
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
                                    <div className="mochi-button" onClick={searchContactBtnClick}>
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
                                        (selectedCarrier.contacts || []).length > 0 &&
                                        <div className="contact-list-header">
                                            <div className="contact-list-col tcol first-name">First Name</div>
                                            <div className="contact-list-col tcol last-name">Last Name</div>
                                            <div className="contact-list-col tcol phone-work">Phone</div>
                                            <div className="contact-list-col tcol email-work">E-Mail</div>
                                            <div className="contact-list-col tcol pri"></div>
                                        </div>
                                    }

                                    <div className="contact-list-wrapper">
                                        {
                                            (selectedCarrier.contacts || []).map((contact, index) => {
                                                return (
                                                    <div className="contact-list-item" key={index} onDoubleClick={async () => {
                                                        let panel = {
                                                            panelName: `${props.panelName}-contacts`,
                                                            component: <Contacts
                                                                title='Contacts'
                                                                tabTimes={22000 + props.tabTimes}
                                                                panelName={`${props.panelName}-contacts`}
                                                                savingContactUrl='/saveCarrierContact'
                                                                deletingContactUrl='/deleteCarrierContact'
                                                                uploadAvatarUrl='/uploadCarrierAvatar'
                                                                removeAvatarUrl='/removeCarrierAvatar'
                                                                origin={props.origin}
                                                                owner='carrier'
                                                                openPanel={props.openPanel}
                                                                closePanel={props.closePanel}
                                                                componentId={moment().format('x')}

                                                                contactSearchCustomer={{
                                                                    ...selectedCarrier,
                                                                    selectedContact: contact
                                                                }}
                                                            />
                                                        }

                                                        props.openPanel(panel, props.origin);
                                                    }} onClick={() => {
                                                        setSelectedContact(contact);
                                                        refCarrierContactFirstName.current.focus();
                                                    }}>
                                                        <div className="contact-list-col tcol first-name">{contact.first_name}</div>
                                                        <div className="contact-list-col tcol last-name">{contact.last_name}</div>
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
                                            <input type="text" placeholder="First Name" onChange={e => setContactSearch({ ...contactSearch, first_name: e.target.value })} value={contactSearch.first_name || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Last Name" onFocus={() => { setShowingContactList(false) }} onChange={e => setContactSearch({ ...contactSearch, last_name: e.target.value })} value={contactSearch.last_name || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Address 1" onFocus={() => { setShowingContactList(false) }} onChange={e => setContactSearch({ ...contactSearch, address1: e.target.value })} value={contactSearch.address1 || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="Address 2" onFocus={() => { setShowingContactList(false) }} onChange={e => setContactSearch({ ...contactSearch, address2: e.target.value })} value={contactSearch.address2 || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="City" onFocus={() => { setShowingContactList(false) }} onChange={e => setContactSearch({ ...contactSearch, city: e.target.value })} value={contactSearch.city || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container input-state">
                                            <input type="text" placeholder="State" maxLength="2" onFocus={() => { setShowingContactList(false) }} onChange={e => setContactSearch({ ...contactSearch, state: e.target.value })} value={contactSearch.state || ''} />
                                        </div>
                                        <div className="form-h-sep"></div>
                                        <div className="input-box-container grow">
                                            <MaskedInput
                                                mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                guide={true}
                                                type="text" placeholder="Phone (Work/Mobile/Fax)" onFocus={() => { setShowingContactList(false) }} onChange={e => setContactSearch({ ...contactSearch, phone: e.target.value })} value={contactSearch.phone || ''} />
                                        </div>
                                    </div>
                                    <div className="form-v-sep"></div>
                                    <div className="form-row">
                                        <div className="input-box-container grow">
                                            <input type="text" placeholder="E-Mail" style={{ textTransform: 'lowercase' }} onFocus={() => { setShowingContactList(false) }} onChange={e => setContactSearch({ ...contactSearch, email: e.target.value })} value={contactSearch.email || ''} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fields-container-col" style={{ minWidth: '28%', maxWidth: '28%' }}>
                    <div className="form-bordered-box">
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Driver Information</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button" onClick={() => {
                                    if ((selectedCarrier.id || 0) === 0) {
                                        window.alert('You must selecte a carrier first!');
                                        return;
                                    }

                                    if ((selectedDriver?.id || 0) === 0) {
                                        window.alert('You must selecte a driver first!');
                                        return;
                                    }

                                    if (window.confirm('Are you sure to delete this driver?')) {
                                        axios.post(props.serverUrl + '/deleteCarrierDriver', selectedDriver).then(res => {
                                            if (res.data.result === 'OK') {
                                                setSelectedCarrier({ ...selectedCarrier, drivers: res.data.drivers });
                                                setSelectedDriver({});
                                            }
                                        }).catch(e => {
                                            console.log('error deleting carrier driver', e);
                                        });
                                    }
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Delete</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>

                                <div className="mochi-button" onClick={() => {
                                    setSelectedDriver({});
                                    refCarrierDriverFirstName.current.focus();
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Clear</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={92 + props.tabTimes} type="text" placeholder="First Name"
                                    ref={refCarrierDriverFirstName}
                                    onKeyDown={validateDriverForSaving}
                                    onInput={e => {
                                        setSelectedDriver({ ...selectedDriver, first_name: e.target.value })
                                    }}
                                    onChange={e => {
                                        setSelectedDriver({ ...selectedDriver, first_name: e.target.value })
                                    }}
                                    value={selectedDriver?.first_name || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={93 + props.tabTimes} type="text" placeholder="Last Name"
                                    onKeyDown={validateDriverForSaving}
                                    onInput={e => {
                                        setSelectedDriver({ ...selectedDriver, last_name: e.target.value })
                                    }}
                                    onChange={e => {
                                        setSelectedDriver({ ...selectedDriver, last_name: e.target.value })
                                    }}
                                    value={selectedDriver?.last_name || ''} />
                            </div>
                        </div>

                        <div className="form-v-sep"></div>

                        <div className="form-row">
                            <div className="input-box-container" style={{ width: '40%' }}>
                                <MaskedInput tabIndex={94 + props.tabTimes}
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Phone"
                                    onKeyDown={validateDriverForSaving}
                                    onInput={e => {
                                        setSelectedDriver({ ...selectedDriver, phone: e.target.value })
                                    }}
                                    onChange={e => {
                                        setSelectedDriver({ ...selectedDriver, phone: e.target.value })
                                    }}
                                    value={selectedDriver?.phone || ''} />
                            </div>

                            <div className="form-h-sep"></div>

                            <div className="input-box-container" style={{ flexGrow: 1 }}>
                                <input tabIndex={95 + props.tabTimes} type="text" placeholder="E-mail" style={{ textTransform: 'lowercase' }}
                                    onKeyDown={validateDriverForSaving}
                                    onInput={e => {
                                        setSelectedDriver({ ...selectedDriver, email: e.target.value })
                                    }}
                                    onChange={e => {
                                        setSelectedDriver({ ...selectedDriver, email: e.target.value })
                                    }}
                                    value={selectedDriver?.email || ''} />
                            </div>

                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ flexGrow: 1 }}>
                                <div className="select-box-wrapper">
                                    <input type="text"
                                        tabIndex={96 + props.tabTimes}
                                        placeholder="Equipment"
                                        ref={refEquipment}
                                        onKeyDown={async (e) => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (driverEquipmentDropdownItems.length > 0) {
                                                        let selectedIndex = driverEquipmentDropdownItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setDriverEquipmentDropdownItems(driverEquipmentDropdownItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setDriverEquipmentDropdownItems(driverEquipmentDropdownItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (driverEquipmentDropdownItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refDriverEquipmentPopupItems.current.map((r, i) => {
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
                                                        axios.post(props.serverUrl + '/getEquipments').then(async res => {
                                                            if (res.data.result === 'OK') {
                                                                await setDriverEquipmentDropdownItems(res.data.equipments.map((item, index) => {
                                                                    item.selected = (selectedDriver?.equipment?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedDriver?.equipment.id
                                                                    return item;
                                                                }))

                                                                refDriverEquipmentPopupItems.current.map((r, i) => {
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
                                                        }).catch(async e => {
                                                            console.log('error getting driver equipments', e);
                                                        })
                                                    }
                                                    break;

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (driverEquipmentDropdownItems.length > 0) {
                                                        let selectedIndex = driverEquipmentDropdownItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setDriverEquipmentDropdownItems(driverEquipmentDropdownItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setDriverEquipmentDropdownItems(driverEquipmentDropdownItems.map((item, index) => {
                                                                if (selectedIndex === (driverEquipmentDropdownItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refDriverEquipmentPopupItems.current.map((r, i) => {
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
                                                        axios.post(props.serverUrl + '/getEquipments').then(async res => {
                                                            if (res.data.result === 'OK') {
                                                                await setDriverEquipmentDropdownItems(res.data.equipments.map((item, index) => {
                                                                    item.selected = (selectedDriver?.equipment?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedDriver?.equipment.id
                                                                    return item;
                                                                }))

                                                                refDriverEquipmentPopupItems.current.map((r, i) => {
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
                                                        }).catch(async e => {
                                                            console.log('error getting driver equipments', e);
                                                        })
                                                    }
                                                    break;

                                                case 27: // escape
                                                    setDriverEquipmentDropdownItems([]);
                                                    break;

                                                case 13: // enter
                                                    if (driverEquipmentDropdownItems.length > 0 && driverEquipmentDropdownItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedDriver({
                                                            ...selectedDriver,
                                                            equipment: driverEquipmentDropdownItems[driverEquipmentDropdownItems.findIndex(item => item.selected)],
                                                            equipment_id: driverEquipmentDropdownItems[driverEquipmentDropdownItems.findIndex(item => item.selected)].id
                                                        });
                                                        validateDriverForSaving({ keyCode: 9 });
                                                        setDriverEquipmentDropdownItems([]);
                                                        refEquipment.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (driverEquipmentDropdownItems.length > 0) {
                                                        e.preventDefault();
                                                        await setSelectedDriver({
                                                            ...selectedDriver,
                                                            equipment: driverEquipmentDropdownItems[driverEquipmentDropdownItems.findIndex(item => item.selected)],
                                                            equipment_id: driverEquipmentDropdownItems[driverEquipmentDropdownItems.findIndex(item => item.selected)].id
                                                        });
                                                        validateDriverForSaving({ keyCode: 9 });
                                                        setDriverEquipmentDropdownItems([]);
                                                        refEquipment.current.focus();
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onBlur={async () => {
                                            if ((selectedDriver?.equipment?.id || 0) === 0) {
                                                await setSelectedDriver({ ...selectedDriver, equipment: {} });
                                            }
                                        }}
                                        onInput={async (e) => {
                                            let equipment = selectedDriver?.equipment || {};
                                            equipment.id = 0;
                                            equipment.name = e.target.value;
                                            await setSelectedDriver({ ...selectedDriver, equipment: equipment });

                                            if (e.target.value.trim() === '') {
                                                setDriverEquipmentDropdownItems([]);
                                            } else {
                                                axios.post(props.serverUrl + '/getEquipments', {
                                                    name: e.target.value.trim()
                                                }).then(async res => {
                                                    if (res.data.result === 'OK') {
                                                        await setDriverEquipmentDropdownItems(res.data.equipments.map((item, index) => {
                                                            item.selected = (selectedDriver?.equipment?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedDriver?.equipment.id
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(async e => {
                                                    console.log('error getting driver equipments', e);
                                                })
                                            }
                                        }}
                                        onChange={async (e) => {
                                            let equipment = selectedDriver?.equipment || {};
                                            equipment.id = 0;
                                            equipment.name = e.target.value;
                                            await setSelectedDriver({ ...selectedDriver, equipment: equipment });
                                        }}
                                        value={selectedDriver?.equipment?.name || ''}
                                    />
                                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                        if (driverEquipmentDropdownItems.length > 0) {
                                            setDriverEquipmentDropdownItems([]);
                                        } else {
                                            if ((selectedDriver?.equipment?.id || 0) === 0 && (selectedDriver?.equipment?.name || '') !== '') {
                                                axios.post(props.serverUrl + '/getEquipments', {
                                                    name: selectedDriver?.equipment.name
                                                }).then(async res => {
                                                    if (res.data.result === 'OK') {
                                                        await setDriverEquipmentDropdownItems(res.data.equipments.map((item, index) => {
                                                            item.selected = (selectedDriver?.equipment?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedDriver?.equipment.id
                                                            return item;
                                                        }))

                                                        refDriverEquipmentPopupItems.current.map((r, i) => {
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
                                                }).catch(async e => {
                                                    console.log('error getting driver equipments', e);
                                                })
                                            } else {
                                                axios.post(props.serverUrl + '/getEquipments').then(async res => {
                                                    if (res.data.result === 'OK') {
                                                        await setDriverEquipmentDropdownItems(res.data.equipments.map((item, index) => {
                                                            item.selected = (selectedDriver?.equipment?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedDriver?.equipment.id
                                                            return item;
                                                        }))

                                                        refDriverEquipmentPopupItems.current.map((r, i) => {
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
                                                }).catch(async e => {
                                                    console.log('error getting driver equipments', e);
                                                })
                                            }
                                        }

                                        refEquipment.current.focus();
                                    }} />
                                </div>
                                {
                                    equipmentTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-driver-equipment"
                                            style={{
                                                ...style,
                                                left: '-50%',
                                                display: 'block'
                                            }}
                                            ref={refDriverEquipmentDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below left">
                                                <div className="mochi-contextual-popup-content">
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            driverEquipmentDropdownItems.map((item, index) => {
                                                                const mochiItemClasses = classnames({
                                                                    'mochi-item': true,
                                                                    'selected': item.selected
                                                                });

                                                                const searchValue = (selectedDriver?.equipment?.id || 0) === 0 && (selectedDriver?.equipment?.name || '') !== ''
                                                                    ? selectedDriver?.equipment?.name : undefined;

                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className={mochiItemClasses}
                                                                        id={item.id}
                                                                        onClick={async () => {
                                                                            await setSelectedDriver({
                                                                                ...selectedDriver,
                                                                                equipment: item,
                                                                                equipment_id: item.id
                                                                            });
                                                                            validateDriverForSaving({ keyCode: 9 });
                                                                            setDriverEquipmentDropdownItems([]);
                                                                            refEquipment.current.focus();
                                                                        }}
                                                                        ref={ref => refDriverEquipmentPopupItems.current.push(ref)}
                                                                    >
                                                                        {
                                                                            searchValue === undefined
                                                                                ? item.name
                                                                                : <Highlighter
                                                                                    highlightClassName="mochi-item-highlight-text"
                                                                                    searchWords={[searchValue]}
                                                                                    autoEscape={true}
                                                                                    textToHighlight={item.name}
                                                                                />
                                                                        }
                                                                        {
                                                                            item.selected &&
                                                                            <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={97 + props.tabTimes} type="text" placeholder="Truck"
                                    onKeyDown={validateDriverForSaving}
                                    onInput={e => {
                                        setSelectedDriver({ ...selectedDriver, truck: e.target.value })
                                    }}
                                    onChange={e => {
                                        setSelectedDriver({ ...selectedDriver, truck: e.target.value })
                                    }}
                                    value={selectedDriver?.truck || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input tabIndex={98 + props.tabTimes} type="text" placeholder="Trailer"
                                    onKeyDown={validateDriverForSaving}
                                    onInput={e => {
                                        setSelectedDriver({ ...selectedDriver, trailer: e.target.value })
                                    }}
                                    onChange={e => {
                                        setSelectedDriver({ ...selectedDriver, trailer: e.target.value })
                                    }}
                                    value={selectedDriver?.trailer || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={99 + props.tabTimes} type="text" placeholder="Notes"
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if (key === 9) {
                                            if (selectedCarrier?.id || 0 > 0) {
                                                let driver = { ...selectedDriver, carrier_id: selectedCarrier.id };

                                                if ((driver.first_name || '').trim() !== '') {
                                                    e.preventDefault();

                                                    axios.post(props.serverUrl + '/saveCarrierDriver', driver).then(res => {
                                                        if (res.data.result === 'OK') {
                                                            setSelectedCarrier(selectedCarrier => {
                                                                return {
                                                                    ...selectedCarrier,
                                                                    drivers: res.data.drivers
                                                                }
                                                            });
                                                            setSelectedDriver({});

                                                            props.setSelectedCarrier({
                                                                id: selectedCarrier.id,
                                                                drivers: res.data.drivers,
                                                                component_id: props.componentId
                                                            })

                                                            refCarrierDriverFirstName.current.focus();
                                                        }

                                                        setIsSavingDriver(false);
                                                    }).catch(e => {
                                                        console.log('error on saving carrier driver', e);
                                                        setIsSavingDriver(false);
                                                    });
                                                } else {
                                                    e.preventDefault();
                                                    setIsSavingDriver(false);
                                                    refCarrierCode.current.focus();
                                                }
                                            } else {
                                                e.preventDefault();
                                                setIsSavingDriver(false);
                                                refCarrierCode.current.focus();
                                            }
                                        }
                                    }}
                                    onInput={e => {
                                        setSelectedDriver({ ...selectedDriver, notes: e.target.value })
                                    }}
                                    onChange={e => {
                                        setSelectedDriver({ ...selectedDriver, notes: e.target.value })
                                    }}
                                    value={selectedDriver?.notes || ''} />
                            </div>
                        </div>

                        <div className="form-row" style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            flexGrow: 1,
                            paddingBottom: 10
                        }}>
                            <div className="mochi-button">
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">E-mail Driver</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fields-container-row" style={{ marginTop: 10 }}>
                <div className="fields-container-col">
                    <div className="form-bordered-box" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '15px 10px'
                    }}>
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
                                <div className="mochi-button" onClick={clearMailingAddressBtn}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Clear</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-row">
                            <div className="input-box-container input-code">
                                <input tabIndex={54 + props.tabTimes} type="text" placeholder="Code" maxLength="8" readOnly={true}
                                    value={(selectedCarrier?.mailing_address?.code_number || 0) === 0 ? (selectedCarrier?.mailing_address?.code || '') : selectedCarrier?.mailing_address?.code + selectedCarrier?.mailing_address?.code_number}
                                />
                            </div>

                            <div className="form-h-sep"></div>

                            <div className="input-box-container grow">
                                <input tabIndex={55 + props.tabTimes} type="text" placeholder="Name"
                                    // onKeyDown={validateMailingAddressToSave} 
                                    onChange={e => {
                                        let mailing_address = selectedCarrier.mailing_address || {};
                                        mailing_address.name = e.target.value;
                                        setSelectedCarrier({ ...selectedCarrier, mailing_address: mailing_address });
                                    }}
                                    value={selectedCarrier.mailing_address?.name || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={56 + props.tabTimes} type="text" placeholder="Address 1"
                                    // onKeyDown={validateMailingAddressToSave} 
                                    onChange={e => {
                                        let mailing_address = selectedCarrier.mailing_address || {};
                                        mailing_address.address1 = e.target.value;
                                        setSelectedCarrier({ ...selectedCarrier, mailing_address: mailing_address });
                                    }}
                                    value={selectedCarrier.mailing_address?.address1 || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={57 + props.tabTimes} type="text" placeholder="Address 2"
                                    // onKeyDown={validateMailingAddressToSave} 
                                    onChange={e => {
                                        let mailing_address = selectedCarrier.mailing_address || {};
                                        mailing_address.address2 = e.target.value;
                                        setSelectedCarrier({ ...selectedCarrier, mailing_address: mailing_address });
                                    }}
                                    value={selectedCarrier.mailing_address?.address2 || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={58 + props.tabTimes} type="text" placeholder="City"
                                    // onKeyDown={validateMailingAddressToSave} 
                                    onChange={e => {
                                        let mailing_address = selectedCarrier.mailing_address || {};
                                        mailing_address.city = e.target.value;
                                        setSelectedCarrier({ ...selectedCarrier, mailing_address: mailing_address });
                                    }}
                                    value={selectedCarrier.mailing_address?.city || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-state">
                                <input tabIndex={59 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                    // onKeyDown={validateMailingAddressToSave} 
                                    onChange={e => {
                                        let mailing_address = selectedCarrier.mailing_address || {};
                                        mailing_address.state = e.target.value;
                                        setSelectedCarrier({ ...selectedCarrier, mailing_address: mailing_address });
                                    }}
                                    value={selectedCarrier.mailing_address?.state || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-zip-code">
                                <input tabIndex={60 + props.tabTimes} type="text" placeholder="Postal Code"
                                    onKeyDown={validateMailingAddressToSave}
                                    onChange={e => {
                                        let mailing_address = selectedCarrier.mailing_address || {};
                                        mailing_address.zip = e.target.value;
                                        setSelectedCarrier({ ...selectedCarrier, mailing_address: mailing_address });
                                    }}
                                    value={selectedCarrier.mailing_address?.zip || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ flexGrow: 1 }}>
                                <div className="select-box-wrapper">
                                    <input
                                        tabIndex={61 + props.tabTimes}
                                        type="text" placeholder="Contact Name"
                                        ref={refMailingContactName}
                                        onKeyDown={async (e) => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
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
                                                            await setMailingContactNameItems((selectedCarrier?.contacts || []).map((item, index) => {
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

                                                case 39: case 40: // arrow right | arrow down
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
                                                            await setMailingContactNameItems((selectedCarrier?.contacts || []).map((item, index) => {
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
                                                        await setSelectedCarrier({
                                                            ...selectedCarrier,
                                                            mailing_address: {
                                                                ...selectedCarrier.mailing_address,
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

                                                        validateMailingAddressToSave({ keyCode: 9 });
                                                        setShowMailingContactNames(false);
                                                        refMailingContactName.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showMailingContactNames) {
                                                        e.preventDefault();
                                                        await setSelectedCarrier({
                                                            ...selectedCarrier,
                                                            mailing_address: {
                                                                ...selectedCarrier.mailing_address,
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

                                                        validateMailingAddressToSave({ keyCode: 9 });
                                                        setShowMailingContactNames(false);
                                                        refMailingContactName.current.focus();
                                                    } else {
                                                        validateMailingAddressToSave({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={e => {
                                            // let mailing_address = selectedCarrier.mailing_address || {};
                                            // mailing_address.contact_name = e.target.value;
                                            // setSelectedCarrier({ ...selectedCarrier, mailing_address: mailing_address });
                                        }}
                                        onChange={e => {
                                            // let mailing_address = selectedCarrier.mailing_address || {};
                                            // mailing_address.contact_name = e.target.value;
                                            // setSelectedCarrier({ ...selectedCarrier, mailing_address: mailing_address });
                                        }}
                                        value={
                                            (selectedCarrier?.mailing_address?.mailing_contact?.first_name || '') +
                                            ((selectedCarrier?.mailing_address?.mailing_contact?.last_name || '') === ''
                                                ? ''
                                                : ' ' + selectedCarrier?.mailing_address?.mailing_contact?.last_name)
                                        }
                                    />

                                    {
                                        ((selectedCarrier?.contacts || []).length > 1 && (selectedCarrier?.mailing_address?.id !== undefined)) &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
                                            if (showMailingContactNames) {
                                                setShowMailingContactNames(false);
                                            } else {
                                                if ((selectedCarrier?.contacts || []).length > 1) {
                                                    await setMailingContactNameItems((selectedCarrier?.contacts || []).map((item, index) => {
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
                                            <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
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
                                                                            await setSelectedCarrier({
                                                                                ...selectedCarrier,
                                                                                mailing_address: {
                                                                                    ...selectedCarrier.mailing_address,
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

                                                                            validateMailingAddressToSave({ keyCode: 9 });
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
                                                                            <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            <div className="select-box-container input-phone">
                                <div className="select-box-wrapper">
                                    <MaskedInput tabIndex={62 + props.tabTimes}
                                        mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                        guide={true}
                                        type="text" placeholder="Contact Phone"
                                        ref={refMailingContactPhone}
                                        onKeyDown={async (e) => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
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

                                                case 39: case 40: // arrow right | arrow down
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
                                                        await setSelectedCarrier({
                                                            ...selectedCarrier,
                                                            mailing_address: {
                                                                ...selectedCarrier.mailing_address,
                                                                mailing_contact_primary_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateMailingAddressToSave({ keyCode: 9 });
                                                        setShowMailingContactPhones(false);
                                                        refMailingContactPhone.current.inputElement.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showMailingContactPhones) {
                                                        e.preventDefault();
                                                        await setSelectedCarrier({
                                                            ...selectedCarrier,
                                                            mailing_address: {
                                                                ...selectedCarrier.mailing_address,
                                                                mailing_contact_primary_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateMailingAddressToSave({ keyCode: 9 });
                                                        setShowMailingContactPhones(false);
                                                        refMailingContactPhone.current.inputElement.focus();
                                                    } else {
                                                        validateMailingAddressToSave({ keyCode: 9 });
                                                    }
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={(e) => {

                                        }}
                                        onChange={(e) => {

                                        }}
                                        value={
                                            (selectedCarrier?.mailing_address?.mailing_contact_primary_phone || '') === 'work'
                                                ? (selectedCarrier?.mailing_address?.mailing_contact?.phone_work || '')
                                                : (selectedCarrier?.mailing_address?.mailing_contact_primary_phone || '') === 'fax'
                                                    ? (selectedCarrier?.mailing_address?.mailing_contact?.phone_work_fax || '')
                                                    : (selectedCarrier?.mailing_address?.mailing_contact_primary_phone || '') === 'mobile'
                                                        ? (selectedCarrier?.mailing_address?.mailing_contact?.phone_mobile || '')
                                                        : (selectedCarrier?.mailing_address?.mailing_contact_primary_phone || '') === 'direct'
                                                            ? (selectedCarrier?.mailing_address?.mailing_contact?.phone_direct || '')
                                                            : (selectedCarrier?.mailing_address?.mailing_contact_primary_phone || '') === 'other'
                                                                ? (selectedCarrier?.mailing_address?.mailing_contact?.phone_other || '')
                                                                : ''
                                        }
                                    />

                                    {
                                        ((selectedCarrier?.id || 0) > 0 && (selectedCarrier?.mailing_address?.id !== undefined)) &&
                                        <div
                                            className={classnames({
                                                'selected-mailing-contact-primary-phone': true,
                                                'pushed': (mailingContactPhoneItems.length > 1)
                                            })}>
                                            {selectedCarrier?.mailing_address?.mailing_contact_primary_phone || ''}
                                        </div>
                                    }

                                    {
                                        mailingContactPhoneItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
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
                                            <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
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
                                                                            await setSelectedCarrier({
                                                                                ...selectedCarrier,
                                                                                mailing_address: {
                                                                                    ...selectedCarrier.mailing_address,
                                                                                    mailing_contact_primary_phone: item.type
                                                                                }
                                                                            });

                                                                            validateMailingAddressToSave({ keyCode: 9 });
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
                                                                            <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            <div className="input-box-container input-phone-ext">
                                <input tabIndex={63 + props.tabTimes} type="text" placeholder="Ext"
                                    onKeyDown={validateMailingAddressToSave}
                                    onChange={e => {
                                        // let mailing_address = selectedCarrier.mailing_address || {};
                                        // mailing_address.ext = e.target.value;
                                        // setSelectedCarrier({ ...selectedCarrier, mailing_address: mailing_address });
                                    }}
                                    value={selectedCarrier?.mailing_address?.mailing_contact?.phone_ext || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ flexGrow: 1 }}>
                                <div className="select-box-wrapper">
                                    <input tabIndex={64 + props.tabTimes} type="text" placeholder="E-Mail" style={{ textTransform: 'lowercase' }}
                                        ref={refMailingContactEmail}
                                        onKeyDown={async (e) => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
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

                                                case 39: case 40: // arrow right | arrow down
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
                                                        await setSelectedCarrier({
                                                            ...selectedCarrier,
                                                            mailing_address: {
                                                                ...selectedCarrier.mailing_address,
                                                                mailing_contact_primary_email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateMailingAddressToSave({ keyCode: 9 });
                                                        setShowMailingContactEmails(false);
                                                        refMailingContactEmail.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showMailingContactEmails) {
                                                        e.preventDefault();
                                                        await setSelectedCarrier({
                                                            ...selectedCarrier,
                                                            mailing_address: {
                                                                ...selectedCarrier.mailing_address,
                                                                mailing_contact_primary_email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].type
                                                            }
                                                        });

                                                        validateMailingAddressToSave({ keyCode: 9 });
                                                        setShowMailingContactEmails(false);
                                                        refMailingContactEmail.current.focus();
                                                    } else {
                                                        validateMailingAddressToSave({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onChange={e => {
                                            // let mailing_address = selectedCarrier.mailing_address || {};
                                            // mailing_address.email = e.target.value;
                                            // setSelectedCarrier({ ...selectedCarrier, mailing_address: mailing_address });
                                        }}
                                        value={
                                            (selectedCarrier?.mailing_address?.mailing_contact_primary_email || '') === 'work'
                                                ? (selectedCarrier?.mailing_address?.mailing_contact?.email_work || '')
                                                : (selectedCarrier?.mailing_address?.mailing_contact_primary_email || '') === 'personal'
                                                    ? (selectedCarrier?.mailing_address?.mailing_contact?.email_personal || '')
                                                    : (selectedCarrier?.mailing_address?.mailing_contact_primary_email || '') === 'other'
                                                        ? (selectedCarrier?.mailing_address?.mailing_contact?.email_other || '')
                                                        : ''
                                        }
                                    />

                                    {
                                        ((selectedCarrier?.id || 0) > 0 && (selectedCarrier?.mailing_address?.id !== undefined)) &&
                                        <div
                                            className={classnames({
                                                'selected-mailing-contact-primary-email': true,
                                                'pushed': (mailingContactEmailItems.length > 1)
                                            })}>
                                            {selectedCarrier?.mailing_address?.mailing_contact_primary_email || ''}
                                        </div>
                                    }

                                    {
                                        mailingContactEmailItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
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
                                            <div className="mochi-contextual-popup vertical below right" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
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
                                                                            await setSelectedCarrier({
                                                                                ...selectedCarrier,
                                                                                mailing_address: {
                                                                                    ...selectedCarrier.mailing_address,
                                                                                    mailing_contact_primary_email: item.type
                                                                                }
                                                                            });

                                                                            validateMailingAddressToSave({ keyCode: 9 });
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
                                                                            <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                </div>

                <div className="fields-container-col grow">
                    <div className="form-borderless-box" style={{
                        alignItems: 'center',
                        padding: '15px 5px'
                    }}>
                        <div className="mochi-button" onClick={() => {
                            if ((selectedCarrier.id || 0) === 0) {
                                window.alert('There is nothing to print!');
                                return;
                            }

                            handledPrintCarrierInformation();
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Print Carrier Information</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>

                        <div className="mochi-button" onClick={equipmentInformationBtnClick}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Equipment Information</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>

                        <div className="mochi-button" onClick={revenueInformationBtnClick}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Revenue Information</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>

                        <div className="mochi-button" onClick={orderHistoryBtnClick}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Order History</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>

                        <div className="mochi-button" onClick={documentsBtnClick}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Documents</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                    </div>
                </div>

                <div className="fields-container-col" style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>

                    <div className="form-bordered-box" style={{
                        flexGrow: 0,
                        marginBottom: 10
                    }}>
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Insurances</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button" onClick={() => {
                                    setSelectedInsurance({});
                                    refInsuranceType.current.focus();
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Clear</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-row">
                            <div className="select-box-container" style={{ width: '10rem' }}>
                                <div className="select-box-wrapper">
                                    <input type="text"
                                        tabIndex={86 + props.tabTimes}
                                        placeholder="Type"
                                        ref={refInsuranceType}
                                        onKeyDown={async (e) => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (insuranceTypeDropdownItems.length > 0) {
                                                        let selectedIndex = insuranceTypeDropdownItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setInsuranceTypeDropdownItems(insuranceTypeDropdownItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setInsuranceTypeDropdownItems(insuranceTypeDropdownItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (insuranceTypeDropdownItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refInsuranceTypePopupItems.current.map((r, i) => {
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
                                                        axios.post(props.serverUrl + '/getInsuranceTypes').then(async res => {
                                                            if (res.data.result === 'OK') {
                                                                await setInsuranceTypeDropdownItems(res.data.types.map((item, index) => {
                                                                    item.selected = (selectedInsurance?.insurance_type?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedInsurance.insurance_type.id
                                                                    return item;
                                                                }))

                                                                refInsuranceTypePopupItems.current.map((r, i) => {
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
                                                        }).catch(async e => {
                                                            console.log('error getting insurance types', e);
                                                        })
                                                    }
                                                    break;

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (insuranceTypeDropdownItems.length > 0) {
                                                        let selectedIndex = insuranceTypeDropdownItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setInsuranceTypeDropdownItems(insuranceTypeDropdownItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setInsuranceTypeDropdownItems(insuranceTypeDropdownItems.map((item, index) => {
                                                                if (selectedIndex === (insuranceTypeDropdownItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refInsuranceTypePopupItems.current.map((r, i) => {
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
                                                        axios.post(props.serverUrl + '/getInsuranceTypes').then(async res => {
                                                            if (res.data.result === 'OK') {
                                                                await setInsuranceTypeDropdownItems(res.data.types.map((item, index) => {
                                                                    item.selected = (selectedInsurance?.insurance_type?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedInsurance.insurance_type.id
                                                                    return item;
                                                                }))

                                                                refInsuranceTypePopupItems.current.map((r, i) => {
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
                                                        }).catch(async e => {
                                                            console.log('error getting insurance types', e);
                                                        })
                                                    }
                                                    break;

                                                case 27: // escape
                                                    setInsuranceTypeDropdownItems([]);
                                                    break;

                                                case 13: // enter
                                                    if (insuranceTypeDropdownItems.length > 0 && insuranceTypeDropdownItems.findIndex(item => item.selected) > -1) {
                                                        let item = insuranceTypeDropdownItems[insuranceTypeDropdownItems.findIndex(item => item.selected)];
                                                        await setSelectedInsurance({
                                                            ...selectedInsurance,
                                                            insurance_type: item,
                                                            insurance_type_id: item.id,
                                                            amount: (item.name || '').toLowerCase() === 'cargo'
                                                                ? accounting.formatNumber(100000, 2, ',', '.')
                                                                : (item.name || '').toLowerCase() === 'liability'
                                                                    ? accounting.formatNumber(1000000, 2, ',', '.')
                                                                    : ''
                                                        });
                                                        validateInsuranceForSaving({ keyCode: 9 });
                                                        setInsuranceTypeDropdownItems([]);
                                                        refInsuranceCompany.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (insuranceTypeDropdownItems.length > 0) {
                                                        e.preventDefault();
                                                        let item = insuranceTypeDropdownItems[insuranceTypeDropdownItems.findIndex(item => item.selected)];
                                                        await setSelectedInsurance({
                                                            ...selectedInsurance,
                                                            insurance_type: item,
                                                            insurance_type_id: item.id,
                                                            amount: (item.name || '').toLowerCase() === 'cargo'
                                                                ? accounting.formatNumber(100000, 2, ',', '.')
                                                                : (item.name || '').toLowerCase() === 'liability'
                                                                    ? accounting.formatNumber(1000000, 2, ',', '.')
                                                                    : ''
                                                        });
                                                        validateInsuranceForSaving({ keyCode: 9 });
                                                        setInsuranceTypeDropdownItems([]);
                                                        refInsuranceCompany.current.focus();
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onBlur={() => {
                                            if ((selectedInsurance?.insurance_type?.id || 0) === 0) {
                                                setSelectedInsurance(selectedInsurance => {
                                                    return { ...selectedInsurance, insurance_type: {} }
                                                });
                                            }
                                        }}
                                        onInput={(e) => {
                                            let insurance_type = selectedInsurance?.insurance_type || {};
                                            insurance_type.id = 0;
                                            insurance_type.name = e.target.value;
                                            setSelectedInsurance(selectedInsurance => {
                                                return { ...selectedInsurance, insurance_type: insurance_type }
                                            });

                                            if (e.target.value.trim() === '') {
                                                setInsuranceTypeDropdownItems([]);
                                            } else {
                                                axios.post(props.serverUrl + '/getInsuranceTypes', {
                                                    name: e.target.value.trim()
                                                }).then(res => {
                                                    if (res.data.result === 'OK') {
                                                        setInsuranceTypeDropdownItems(res.data.types.map((item, index) => {
                                                            item.selected = (selectedInsurance?.insurance_type?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedInsurance.insurance_type.id
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(async e => {
                                                    console.log('error getting insurance types', e);
                                                })
                                            }
                                        }}
                                        onChange={(e) => {
                                            let insurance_type = selectedInsurance?.insurance_type || {};
                                            insurance_type.id = 0;
                                            insurance_type.name = e.target.value;
                                            setSelectedInsurance(selectedInsurance => {
                                                return { ...selectedInsurance, insurance_type: insurance_type }
                                            });
                                        }}
                                        value={selectedInsurance?.insurance_type?.name || ''}
                                    />
                                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                                        if (insuranceTypeDropdownItems.length > 0) {
                                            setInsuranceTypeDropdownItems([]);
                                        } else {
                                            if ((selectedInsurance?.insurance_type?.id || 0) === 0 && (selectedInsurance?.insurance_type?.name || '') !== '') {
                                                axios.post(props.serverUrl + '/getInsuranceTypes', {
                                                    name: selectedInsurance?.insurance_type.name
                                                }).then(res => {
                                                    if (res.data.result === 'OK') {
                                                        setInsuranceTypeDropdownItems(res.data.types.map((item, index) => {
                                                            item.selected = (selectedInsurance?.insurance_type?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedInsurance.insurance_type.id
                                                            return item;
                                                        }))

                                                        refInsuranceTypePopupItems.current.map((r, i) => {
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
                                                }).catch(e => {
                                                    console.log('error getting insurance types', e);
                                                })
                                            } else {
                                                axios.post(props.serverUrl + '/getInsuranceTypes').then(res => {
                                                    if (res.data.result === 'OK') {
                                                        setInsuranceTypeDropdownItems(res.data.types.map((item, index) => {
                                                            item.selected = (selectedInsurance?.insurance_type?.id || 0) === 0
                                                                ? index === 0
                                                                : item.id === selectedInsurance.insurance_type.id
                                                            return item;
                                                        }))

                                                        refInsuranceTypePopupItems.current.map((r, i) => {
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
                                                }).catch(e => {
                                                    console.log('error getting insurance types', e);
                                                })
                                            }
                                        }

                                        refInsuranceType.current.focus();
                                    }} />
                                </div>
                                {
                                    insuranceTypeTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-insurance-type"
                                            style={{
                                                ...style,
                                                left: '-50%',
                                                display: 'block'
                                            }}
                                            ref={refInsuranceTypeDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            insuranceTypeDropdownItems.map((item, index) => {
                                                                const mochiItemClasses = classnames({
                                                                    'mochi-item': true,
                                                                    'selected': item.selected
                                                                });

                                                                const searchValue = (selectedInsurance?.insurance_type?.id || 0) === 0 && (selectedInsurance?.insurance_type?.name || '') !== ''
                                                                    ? selectedInsurance?.insurance_type?.name : undefined;

                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className={mochiItemClasses}
                                                                        id={item.id}
                                                                        onClick={() => {
                                                                            setSelectedInsurance({
                                                                                ...selectedInsurance,
                                                                                insurance_type: item,
                                                                                insurance_type_id: item.id,
                                                                                amount: (item.name || '').toLowerCase() === 'cargo'
                                                                                    ? accounting.formatNumber(100000, 2, ',', '.')
                                                                                    : (item.name || '').toLowerCase() === 'liability'
                                                                                        ? accounting.formatNumber(1000000, 2, ',', '.')
                                                                                        : ''
                                                                            });
                                                                            validateInsuranceForSaving({ keyCode: 9 });
                                                                            setInsuranceTypeDropdownItems([]);
                                                                            refInsuranceCompany.current.focus();
                                                                        }}
                                                                        ref={ref => refInsuranceTypePopupItems.current.push(ref)}
                                                                    >
                                                                        {
                                                                            searchValue === undefined
                                                                                ? item.name
                                                                                : <Highlighter
                                                                                    highlightClassName="mochi-item-highlight-text"
                                                                                    searchWords={[searchValue]}
                                                                                    autoEscape={true}
                                                                                    textToHighlight={item.name}
                                                                                />
                                                                        }
                                                                        {
                                                                            item.selected &&
                                                                            <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                            <div className="select-box-container" style={{ flexGrow: 1 }}>
                                <div className="select-box-wrapper">
                                    <input type="text"
                                        tabIndex={87 + props.tabTimes}
                                        placeholder="Company"
                                        ref={refInsuranceCompany}
                                        onKeyDown={async (e) => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (insuranceCompanyDropdownItems.length > 0) {
                                                        let selectedIndex = insuranceCompanyDropdownItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setInsuranceCompanyDropdownItems(insuranceCompanyDropdownItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setInsuranceCompanyDropdownItems(insuranceCompanyDropdownItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (insuranceCompanyDropdownItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refInsuranceCompanyPopupItems.current.map((r, i) => {
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
                                                        axios.post(props.serverUrl + '/getInsuranceCompanies').then(async res => {
                                                            if (res.data.result === 'OK') {
                                                                await setInsuranceCompanyDropdownItems(res.data.companies.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))

                                                                refInsuranceCompanyPopupItems.current.map((r, i) => {
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
                                                        }).catch(async e => {
                                                            console.log('error getting insurance companies', e);
                                                        })
                                                    }
                                                    break;

                                                case 39: case 40: // arrow right | arrow down
                                                    e.preventDefault();
                                                    if (insuranceCompanyDropdownItems.length > 0) {
                                                        let selectedIndex = insuranceCompanyDropdownItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setInsuranceCompanyDropdownItems(insuranceCompanyDropdownItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setInsuranceCompanyDropdownItems(insuranceCompanyDropdownItems.map((item, index) => {
                                                                if (selectedIndex === (insuranceCompanyDropdownItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refInsuranceCompanyPopupItems.current.map((r, i) => {
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
                                                        axios.post(props.serverUrl + '/getInsuranceCompanies').then(async res => {
                                                            if (res.data.result === 'OK') {
                                                                await setInsuranceCompanyDropdownItems(res.data.companies.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))

                                                                refInsuranceCompanyPopupItems.current.map((r, i) => {
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
                                                        }).catch(async e => {
                                                            console.log('error getting insurance companies', e);
                                                        })
                                                    }
                                                    break;

                                                case 27: // escape
                                                    setInsuranceCompanyDropdownItems([]);
                                                    break;

                                                case 13: // enter
                                                    if (insuranceCompanyDropdownItems.length > 0 && insuranceCompanyDropdownItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedInsurance({
                                                            ...selectedInsurance,
                                                            company: insuranceCompanyDropdownItems[insuranceCompanyDropdownItems.findIndex(item => item.selected)].company
                                                        });
                                                        validateInsuranceForSaving({ keyCode: 9 });
                                                        setInsuranceCompanyDropdownItems([]);
                                                        refInsuranceCompany.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (insuranceCompanyDropdownItems.length > 0) {
                                                        e.preventDefault();
                                                        await setSelectedInsurance({
                                                            ...selectedInsurance,
                                                            company: insuranceCompanyDropdownItems[insuranceCompanyDropdownItems.findIndex(item => item.selected)].company
                                                        });
                                                        validateInsuranceForSaving({ keyCode: 9 });
                                                        setInsuranceCompanyDropdownItems([]);
                                                        refInsuranceCompany.current.focus();
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={async (e) => {
                                            await setSelectedInsurance({ ...selectedInsurance, company: e.target.value });

                                            if (e.target.value.trim() === '') {
                                                setInsuranceCompanyDropdownItems([]);
                                            } else {
                                                axios.post(props.serverUrl + '/getInsuranceCompanies', {
                                                    company: e.target.value.trim()
                                                }).then(async res => {
                                                    if (res.data.result === 'OK') {
                                                        await setInsuranceCompanyDropdownItems(res.data.companies.map((item, index) => {
                                                            item.selected = index === 0;
                                                            return item;
                                                        }))
                                                    }
                                                }).catch(async e => {
                                                    console.log('error getting insurance companies', e);
                                                })
                                            }
                                        }}
                                        onChange={async (e) => {
                                            await setSelectedInsurance({ ...selectedInsurance, company: e.target.value });
                                        }}
                                        value={selectedInsurance?.company || ''}
                                    />
                                </div>
                                {
                                    insuranceCompanyTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-insurance-company"
                                            style={{
                                                ...style,
                                                left: '-50%',
                                                display: 'block'
                                            }}
                                            ref={refInsuranceCompanyDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content"  >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {
                                                            insuranceCompanyDropdownItems.map((item, index) => {
                                                                const mochiItemClasses = classnames({
                                                                    'mochi-item': true,
                                                                    'selected': item.selected
                                                                });

                                                                const searchValue = (selectedInsurance?.company || '') !== ''
                                                                    ? selectedInsurance?.company : undefined;

                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className={mochiItemClasses}
                                                                        id={item.id}
                                                                        onClick={async () => {
                                                                            await setSelectedInsurance({ ...selectedInsurance, company: item.company });
                                                                            validateInsuranceForSaving({ keyCode: 9 });
                                                                            setInsuranceCompanyDropdownItems([]);
                                                                            refInsuranceCompany.current.focus();
                                                                        }}
                                                                        ref={ref => refInsuranceCompanyPopupItems.current.push(ref)}
                                                                    >
                                                                        {
                                                                            searchValue === undefined
                                                                                ? item.company
                                                                                : <Highlighter
                                                                                    highlightClassName="mochi-item-highlight-text"
                                                                                    searchWords={[searchValue]}
                                                                                    autoEscape={true}
                                                                                    textToHighlight={item.company}
                                                                                />
                                                                        }
                                                                        {
                                                                            item.selected &&
                                                                            <FontAwesomeIcon className="dropdown-selected" icon={faCaretRight} />
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
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ width: '8rem' }}>
                                <div className="select-box-wrapper">
                                    <MaskedInput tabIndex={88 + props.tabTimes}
                                        mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                        guide={false}
                                        type="text" placeholder="Expiration Date"
                                        onKeyDown={validateInsuranceForSaving}
                                        onBlur={e => setSelectedInsurance({ ...selectedInsurance, expiration_date: getFormattedDates(selectedInsurance?.expiration_date) })}
                                        onInput={e => setSelectedInsurance({ ...selectedInsurance, expiration_date: e.target.value })}
                                        onChange={e => setSelectedInsurance({ ...selectedInsurance, expiration_date: e.target.value })}
                                        value={selectedInsurance.expiration_date || ''}
                                        ref={refExpirationDate}
                                    />

                                    <FontAwesomeIcon className="dropdown-button calendar" icon={faCalendarAlt} onClick={(e) => {
                                        e.stopPropagation();
                                        setIsCalendarShown(true)

                                        if (moment((selectedInsurance?.expiration_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (selectedInsurance?.expiration_date || '').trim()) {
                                            setPreSelectedExpirationDate(moment(selectedInsurance?.expiration_date, 'MM/DD/YYYY'));
                                        } else {
                                            setPreSelectedExpirationDate(moment());
                                        }

                                        refExpirationDate.current.inputElement.focus();
                                    }} />
                                </div>
                                {
                                    calendarTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-insurance-expiration-date"
                                            style={{
                                                ...style,
                                                left: '-100px',
                                                display: 'block'
                                            }}
                                            ref={refInsuranceCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below" style={{ height: 275 }}>
                                                <div className="mochi-contextual-popup-content" >
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((selectedInsurance?.expiration_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (selectedInsurance?.expiration_date || '').trim()
                                                                ? moment(selectedInsurance?.expiration_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                setSelectedInsurance({ ...selectedInsurance, expiration_date: day.format('MM/DD/YYYY') });
                                                                validateInsuranceForSaving({ keyCode: 9 });
                                                            }}
                                                            closeCalendar={() => { setIsCalendarShown(false); }}
                                                            preDay={preSelectedExpirationDate}
                                                            onChangePreDay={(preDay) => {
                                                                setPreSelectedExpirationDate(preDay);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </animated.div>
                                    ))
                                }
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <span className="currency-symbol">{(selectedInsurance.amount || '') === '' ? '' : '$'}</span>

                                <input tabIndex={89 + props.tabTimes}
                                    className="currency"
                                    type="text"
                                    placeholder="Amount"
                                    // onKeyDown={validateInsuranceForSaving}
                                    onBlur={async (e) => { await setSelectedInsurance({ ...selectedInsurance, amount: accounting.formatNumber(e.target.value, 2, ',', '.') }) }}
                                    onChange={e => setSelectedInsurance({ ...selectedInsurance, amount: e.target.value })}
                                    value={(selectedInsurance?.amount || '')} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <span className="currency-symbol">{(selectedInsurance.deductible || '') === '' ? '' : '$'}</span>

                                <input tabIndex={90 + props.tabTimes}
                                    className="currency"
                                    type="text"
                                    placeholder="Deductible"
                                    // onKeyDown={validateInsuranceForSaving}
                                    onBlur={async (e) => { await setSelectedInsurance({ ...selectedInsurance, deductible: accounting.formatNumber(e.target.value, 2, ',', '.') }) }}
                                    onChange={e => setSelectedInsurance({ ...selectedInsurance, deductible: e.target.value })}
                                    value={(selectedInsurance?.deductible || '')} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={91 + props.tabTimes} type="text" placeholder="Notes"
                                    onKeyDown={(e) => {
                                        let key = e.keyCode || e.which;

                                        if (key === 9) {
                                            let insurance = { ...selectedInsurance, carrier_id: (selectedCarrier?.id || 0) };

                                            if ((insurance.insurance_type_id || 0) > 0 &&
                                                (insurance.company || '') !== '' &&
                                                (insurance.expiration_date || '') !== '' &&
                                                (insurance.amount || '') !== '') {

                                                insurance.expiration_date = getFormattedDates(insurance.expiration_date);
                                                insurance.amount = accounting.unformat(insurance.amount);
                                                insurance.deductible = accounting.unformat(insurance.deductible);

                                                e.preventDefault();

                                                axios.post(props.serverUrl + '/saveInsurance', insurance).then(res => {
                                                    if (res.data.result === 'OK') {
                                                        setSelectedCarrier(selectedCarrier => {
                                                            return {
                                                                ...selectedCarrier,
                                                                insurances: res.data.insurances
                                                            }
                                                        });

                                                        setSelectedInsurance({});

                                                        props.setSelectedCarrier({
                                                            id: selectedCarrier.id,
                                                            insurances: res.data.insurances,
                                                            component_id: props.componentId
                                                        });

                                                        refInsuranceType.current.focus();
                                                    } else {
                                                        console.log(res.data.result);
                                                    }

                                                    setIsSavingInsurance(false);
                                                }).catch(e => {
                                                    console.log('error on saving carrier insurance', e);
                                                    setIsSavingInsurance(false);
                                                });
                                            } else {
                                                setIsSavingInsurance(false);
                                            }
                                        }
                                    }}
                                    onChange={e => setSelectedInsurance({ ...selectedInsurance, notes: e.target.value })}
                                    value={selectedInsurance.notes || ''} />
                            </div>
                        </div>
                    </div>

                    <div className="form-bordered-box" style={{
                        flexGrow: 1
                    }}>
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="top-border top-border-middle"></div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="insurances-list-container">
                            {
                                (selectedCarrier.insurances || []).length > 0 &&
                                <div className={`insurances-list-header ${insurancesScrollBarVisible ? 'scrolling' : ''}`}>
                                    <div className="contact-list-col tcol type">Type</div>
                                    <div className="contact-list-col tcol company">Company</div>
                                    <div className="contact-list-col tcol expiration-date">Exp. Date</div>
                                    <div className="contact-list-col tcol amount">Amount</div>
                                </div>
                            }

                            <div className="insurances-list-wrapper" id={props.panelName + '-insurances-list-wrapper'} ref={refInsurancesListWrapper}>
                                {
                                    (selectedCarrier.insurances || []).map((insurance, index) => {
                                        const itemClasses = classnames({
                                            'insurances-list-item': true,
                                            'selected': insurance.id === selectedInsurance.id
                                        })
                                        return (
                                            <div className={itemClasses} key={index} onClick={() => {
                                                setSelectedInsurance({ ...insurance });
                                            }}>
                                                <div className="insurances-list-col tcol type">{insurance.insurance_type.name}</div>
                                                <div className="insurances-list-col tcol company">{insurance.company}</div>
                                                <div className="insurances-list-col tcol expiration-date">{insurance.expiration_date}</div>
                                                <div className="insurances-list-col tcol amount">{accounting.formatMoney(insurance.amount)}</div>
                                                {
                                                    (insurance.id === (selectedInsurance?.id || 0)) &&
                                                    <div className="insurances-list-col tcol insurances-selected">
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

                <div className="fields-container-col" style={{ minWidth: '28%', maxWidth: '28%' }}>
                    <div className="form-bordered-box" style={{
                        flexGrow: 1
                    }}>
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Drivers</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button" onClick={() => {
                                    if ((selectedCarrier.id || 0) === 0 || selectedCarrier.drivers.length === 0) {
                                        window.alert('There is nothing to print!');
                                        return;
                                    }

                                    let html = `<h2>Carrier Drivers</h2></br></br>`;

                                    html += `
                                        <div style="display:flex;align-items:center;font-size: 0.9rem;font-weight:bold;margin-bottom:10px;color: rgba(0,0,0,0.8)">
                                            <div style="min-width:25%;max-width:25%;text-decoration:underline">First Name</div>
                                            <div style="min-width:25%;max-width:25%;text-decoration:underline">Last Name</div>
                                            <div style="min-width:25%;max-width:25%;text-decoration:underline">Phone</div>
                                            <div style="min-width:25%;max-width:25%;text-decoration:underline">E-Mail</div>
                                        </div>
                                        `;

                                    selectedCarrier.drivers.map((driver, index) => {
                                        html += `
                                        <div style="padding: 5px 0;display:flex;align-items:center;font-size: 0.7rem;font-weight:normal;margin-bottom:15px;color: rgba(0,0,0,1); borderTop:1px solid rgba(0,0,0,0.1);border-bottom:1px solid rgba(0,0,0,0.1)">
                                            <div style="min-width:25%;max-width:25%">${driver.first_name}</div>
                                            <div style="min-width:25%;max-width:25%">${driver.last_name}</div>
                                            <div style="min-width:25%;max-width:25%">${driver.phone}</div>
                                            <div style="min-width:25%;max-width:25%">${driver.email}</div>
                                        </div>
                                        `;
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

                        <div className="drivers-list-container">
                            {
                                (selectedCarrier.drivers || []).length > 0 &&
                                <div className="drivers-list-header">
                                    <div className="driver-list-col tcol first-name">First Name</div>
                                    <div className="driver-list-col tcol last-name">Last Name</div>
                                    <div className="driver-list-col tcol phone">Phone</div>
                                    <div className="driver-list-col tcol email">E-Mail</div>
                                </div>
                            }

                            <div className="drivers-list-wrapper">
                                {
                                    (selectedCarrier.drivers || []).map((driver, index) => {
                                        return (
                                            <div className="drivers-list-item" key={index} onClick={() => {
                                                setSelectedDriver({ ...driver });
                                                refCarrierDriverFirstName.current.focus();
                                            }}>
                                                <div className="driver-list-col tcol first-name">{driver.first_name}</div>
                                                <div className="driver-list-col tcol last-name">{driver.last_name}</div>
                                                <div className="driver-list-col tcol phone">{driver.phone}</div>
                                                <div className="driver-list-col tcol email">{driver.email}</div>
                                                {
                                                    (driver.id === (selectedDriver?.id || 0)) &&
                                                    <div className="driver-list-col tcol driver-selected">
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


            <div className="fields-container-row" style={{ marginTop: 10 }}>
                <div className="fields-container-col">
                    <div className="form-bordered-box" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '15px 10px'
                    }}>
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Factoring Company</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button" onClick={searchFactoringCompanyBtnClick}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Search</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={moreFactoringCompanyBtnClick}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">More</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={clearFactoringCompanyBtnClick}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Clear</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-row">
                            <div className="input-box-container input-code">
                                <input tabIndex={65 + props.tabTimes} type="text" placeholder="Code" maxLength="8"
                                    ref={refFactoringCompanyCode}
                                    onKeyDown={getFactoringCompanyByCode}
                                    onInput={(e) => {
                                        setSelectedCarrier({
                                            ...selectedCarrier,
                                            factoring_company: {
                                                ...selectedCarrier.factoring_company,
                                                code_number: 0,
                                                code: e.target.value
                                            }
                                        })
                                    }}
                                    onChange={(e) => {
                                        setSelectedCarrier({
                                            ...selectedCarrier,
                                            factoring_company: {
                                                ...selectedCarrier.factoring_company,
                                                code: e.target.value
                                            }
                                        })
                                    }}
                                    value={(selectedCarrier?.factoring_company?.code_number || 0) === 0 ? (selectedCarrier?.factoring_company?.code || '') : selectedCarrier?.factoring_company?.code + selectedCarrier?.factoring_company?.code_number}
                                />
                            </div>

                            <div className="form-h-sep"></div>

                            <div className="input-box-container grow">
                                <input tabIndex={66 + props.tabTimes} type="text" placeholder="Name"
                                    ref={refFactoringCompanyName}
                                    // onKeyDown={validateFactoringCompanyToSave} 
                                    onChange={e => {
                                        let factoring_company = selectedCarrier.factoring_company || {};
                                        factoring_company.name = e.target.value;
                                        setSelectedCarrier({ ...selectedCarrier, factoring_company: factoring_company });
                                    }} value={selectedCarrier.factoring_company?.name || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={67 + props.tabTimes} type="text" placeholder="Address 1"
                                    // onKeyDown={validateFactoringCompanyToSave} 
                                    onChange={e => {
                                        let factoring_company = selectedCarrier.factoring_company || {};
                                        factoring_company.address1 = e.target.value;
                                        setSelectedCarrier({ ...selectedCarrier, factoring_company: factoring_company });
                                    }} value={selectedCarrier.factoring_company?.address1 || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={68 + props.tabTimes} type="text" placeholder="Address 2"
                                    // onKeyDown={validateFactoringCompanyToSave} 
                                    onChange={e => {
                                        let factoring_company = selectedCarrier.factoring_company || {};
                                        factoring_company.address2 = e.target.value;
                                        setSelectedCarrier({ ...selectedCarrier, factoring_company: factoring_company });
                                    }} value={selectedCarrier.factoring_company?.address2 || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={69 + props.tabTimes} type="text" placeholder="City"
                                    // onKeyDown={validateFactoringCompanyToSave} 
                                    onChange={e => {
                                        let factoring_company = selectedCarrier.factoring_company || {};
                                        factoring_company.city = e.target.value;
                                        setSelectedCarrier({ ...selectedCarrier, factoring_company: factoring_company });
                                    }} value={selectedCarrier.factoring_company?.city || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-state">
                                <input tabIndex={70 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                    // onKeyDown={validateFactoringCompanyToSave} 
                                    onChange={e => {
                                        let factoring_company = selectedCarrier.factoring_company || {};
                                        factoring_company.state = e.target.value;
                                        setSelectedCarrier({ ...selectedCarrier, factoring_company: factoring_company });
                                    }} value={selectedCarrier.factoring_company?.state || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-zip-code">
                                <input tabIndex={71 + props.tabTimes} type="text" placeholder="Postal Code" onKeyDown={validateFactoringCompanyToSave} onChange={e => {
                                    let factoring_company = selectedCarrier.factoring_company || {};
                                    factoring_company.zip = e.target.value;
                                    setSelectedCarrier({ ...selectedCarrier, factoring_company: factoring_company });
                                }} value={selectedCarrier.factoring_company?.zip || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input tabIndex={72 + props.tabTimes} type="text" placeholder="Contact Name"
                                    onInput={(e) => {
                                        if ((selectedCarrier?.factoring_company?.contacts || []).length === 0) {
                                            setSelectedCarrier({
                                                ...selectedCarrier,
                                                factoring_company: {
                                                    ...selectedCarrier?.factoring_company || {},
                                                    contact_name: e.target.value
                                                }
                                            })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedCarrier?.factoring_company?.contacts || []).length === 0) {
                                            setSelectedCarrier({
                                                ...selectedCarrier,
                                                factoring_company: {
                                                    ...selectedCarrier?.factoring_company || {},
                                                    contact_name: e.target.value
                                                }
                                            })
                                        }
                                    }}
                                    value={
                                        (selectedCarrier?.factoring_company?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedCarrier?.factoring_company?.contact_name || '')
                                            : selectedCarrier?.factoring_company.contacts.find(c => c.is_primary === 1).first_name + ' ' + selectedCarrier?.factoring_company.contacts.find(c => c.is_primary === 1).last_name
                                    }
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-phone" style={{ position: 'relative' }}>
                                <MaskedInput tabIndex={73 + props.tabTimes}
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Contact Phone"
                                    onInput={(e) => {
                                        if ((selectedCarrier?.factoring_company?.contacts || []).length === 0) {
                                            setSelectedCarrier({
                                                ...selectedCarrier,
                                                factoring_company: {
                                                    ...selectedCarrier?.factoring_company || {},
                                                    contact_phone: e.target.value
                                                }
                                            })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedCarrier?.factoring_company?.contacts || []).length === 0) {
                                            setSelectedCarrier({
                                                ...selectedCarrier,
                                                factoring_company: {
                                                    ...selectedCarrier?.factoring_company || {},
                                                    contact_phone: e.target.value
                                                }
                                            })
                                        }
                                    }}
                                    value={
                                        (selectedCarrier?.factoring_company?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedCarrier?.factoring_company?.contact_phone || '')
                                            : selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).primary_phone === 'work'
                                                ? selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).phone_work
                                                : selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).primary_phone === 'fax'
                                                    ? selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).phone_work_fax
                                                    : selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).primary_phone === 'mobile'
                                                        ? selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).phone_mobile
                                                        : selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).primary_phone === 'direct'
                                                            ? selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).phone_direct
                                                            : selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).primary_phone === 'other'
                                                                ? selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).phone_other
                                                                : ''
                                    }
                                />

                                {
                                    ((selectedCarrier?.factoring_company?.contacts || []).find(c => c.is_primary === 1) !== undefined) &&
                                    <div
                                        className={classnames({
                                            'selected-factoring-company-contact-primary-phone': true,
                                            'pushed': false
                                        })}>
                                        {selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).primary_phone}
                                    </div>
                                }
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-phone-ext">
                                <input tabIndex={74 + props.tabTimes} type="text" placeholder="Ext"
                                    onInput={(e) => {
                                        if ((selectedCarrier?.factoring_company?.contacts || []).length === 0) {
                                            setSelectedCarrier({
                                                ...selectedCarrier,
                                                factoring_company: {
                                                    ...selectedCarrier?.factoring_company || {},
                                                    ext: e.target.value
                                                }
                                            })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedCarrier?.factoring_company?.contacts || []).length === 0) {
                                            setSelectedCarrier({
                                                ...selectedCarrier,
                                                factoring_company: {
                                                    ...selectedCarrier?.factoring_company || {},
                                                    ext: e.target.value
                                                }
                                            })
                                        }
                                    }}
                                    value={
                                        (selectedCarrier?.factoring_company?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedCarrier?.factoring_company?.ext || '')
                                            : selectedCarrier?.factoring_company.contacts.find(c => c.is_primary === 1).phone_ext
                                    }
                                />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container" style={{ position: 'relative', flexGrow: 1 }}>
                                <input tabIndex={75 + props.tabTimes} type="text" placeholder="E-Mail" style={{ textTransform: 'lowercase' }}
                                    onKeyDown={validateFactoringCompanyToSave}
                                    onInput={(e) => {
                                        if ((selectedCarrier?.factoring_company?.contacts || []).length === 0) {
                                            setSelectedCarrier({
                                                ...selectedCarrier,
                                                factoring_company: {
                                                    ...selectedCarrier?.factoring_company || {},
                                                    email: e.target.value
                                                }
                                            })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedCarrier?.factoring_company?.contacts || []).length === 0) {
                                            setSelectedCarrier({
                                                ...selectedCarrier,
                                                factoring_company: {
                                                    ...selectedCarrier?.factoring_company || {},
                                                    email: e.target.value
                                                }
                                            })
                                        }
                                    }}
                                    value={
                                        (selectedCarrier?.factoring_company?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedCarrier?.factoring_company?.email || '')
                                            : selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).primary_email === 'work'
                                                ? selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).email_work
                                                : selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).primary_email === 'personal'
                                                    ? selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).email_personal
                                                    : selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).primary_email === 'other'
                                                        ? selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).email_other
                                                        : ''
                                    }
                                />

                                {
                                    ((selectedCarrier?.factoring_company?.contacts || []).find(c => c.is_primary === 1) !== undefined) &&
                                    <div
                                        className={classnames({
                                            'selected-factoring-company-contact-primary-email': true,
                                            'pushed': false
                                        })}>
                                        {selectedCarrier?.factoring_company?.contacts.find(c => c.is_primary === 1).primary_email}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="fields-container-col grow">

                </div>
                <div className="fields-container-col">
                    <div className="form-bordered-box" >
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Notes</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button" onClick={() => {
                                    if ((selectedCarrier.id || 0) === 0) {
                                        window.alert('You must select a carrier first!');
                                        return;
                                    }

                                    setSelectedNote({ id: 0, carrier_id: selectedCarrier.id })
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Add note</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={() => {
                                    if (selectedCarrier.id === undefined || selectedCarrier.notes.length === 0) {
                                        window.alert('There is nothing to print!');
                                        return;
                                    }

                                    let html = ``;

                                    selectedCarrier.notes.map((note, index) => {
                                        html += `<div><b>${note.user}:${moment(note.date_time, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY:HHmm')}</b> ${note.text}</div>`

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
                                    (selectedCarrier.notes || []).map((note, index) => {
                                        return (
                                            <div className="notes-list-item" key={index} onClick={() => setSelectedNote(note)}>
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
                <div className="fields-container-col" style={{ minWidth: '28%', maxWidth: '28%' }}>
                    <div className="form-bordered-box" >
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Past Orders</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button">
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Search</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={() => {
                                    if (selectedCarrier.id === undefined || (selectedCarrier.past_orders || []).length === 0) {
                                        window.alert('There is nothing to print!');
                                        return;
                                    }

                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Print</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>


                    </div>
                </div>
            </div>

            {
                noteTransition((style, item) => item && (
                    <animated.div style={style}>
                        <CarrierModal
                            selectedData={selectedNote}
                            setSelectedData={setSelectedNote}
                            selectedParent={selectedCarrier}
                            setSelectedParent={(notes) => {
                                setSelectedCarrier({ ...selectedCarrier, notes: notes });
                            }}
                            savingDataUrl='/saveCarrierNote'
                            deletingDataUrl=''
                            type='note'
                            isEditable={false}
                            isDeletable={false}
                            isPrintable={true}
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
        companyOpenedPanels: state.companyReducers.companyOpenedPanels,
        adminOpenedPanels: state.adminReducers.adminOpenedPanels,
        dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
        customerOpenedPanels: state.customerReducers.customerOpenedPanels,
        adminCustomerOpenedPanels: state.customerReducers.adminCustomerOpenedPanels,
        adminCarrierOpenedPanels: state.carrierReducers.adminCarrierOpenedPanels,
        loadBoardOpenedPanels: state.loadBoardReducers.loadBoardOpenedPanels,
        invoiceOpenedPanels: state.invoiceReducers.invoiceOpenedPanels,
        selectedCarrier: state.carrierReducers.selectedCarrier,
        selectedCarrierContact: state.carrierReducers.selectedContact,
        selectedDriver: state.carrierReducers.selectedDriver,
        selectedInsurance: state.carrierReducers.selectedInsurance,
    }
}

export default connect(mapStateToProps, {
    setCompanyOpenedPanels,
    setAdminOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
    setSelectedCarrier,
    setSelectedCarrierContact,
    setSelectedDriver,
    setSelectedInsurance
})(Carriers)