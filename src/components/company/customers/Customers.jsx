import React, {useState, useRef, useEffect} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import './Customers.css';
import moment from 'moment';
import MaskedInput from 'react-text-mask';
// import CustomerModal from './modal/Modal.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretDown, faCaretRight, faCheck, faPencilAlt, faTrashAlt, faCopy} from '@fortawesome/free-solid-svg-icons';
import {useDetectClickOutside} from "react-detect-click-outside";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.css';
import axios from 'axios';
import {useTransition, animated} from 'react-spring';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Highlighter from "react-highlight-words";
import ToPrint from './ToPrint.jsx';
import {useReactToPrint} from 'react-to-print';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

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
    setSelectedCustomer,
    setSelectedContact,
} from './../../../actions';

import {
    CustomerImport,
    CustomerSearch,
    RevenueInformation,
    OrderHistory,
    LaneHistory,
    Documents,
    ContactSearch,
    Contacts,
    Modal as CustomerModal
} from './../panels';

import {
    Dispatch
} from './../../company';
import NumberFormat from "react-number-format";

const Customers = (props) => {
    // DECLARATIONS    
    const [selectedCustomer, setSelectedCustomer] = useState({});
    const [selectedContact, setSelectedContact] = useState({});
    const [selectedNote, setSelectedNote] = useState({});
    const [selectedDirection, setSelectedDirection] = useState({});
    const [automaticEmailsTo, setAutomaticEmailsTo] = useState('');
    const [automaticEmailsCc, setAutomaticEmailsCc] = useState('');
    const [automaticEmailsBcc, setAutomaticEmailsBcc] = useState('');
    const [contactSearch, setContactSearch] = useState({});
    const [showingContactList, setShowingContactList] = useState(true);
    const [isFromItself, setIsFromItself] = useState(false);
    const [term, setTerm] = useState({});

    const refCustomerEmail = useRef();
    const [showCustomerEmailCopyBtn, setShowCustomerEmailCopyBtn] = useState(false);
    const [showCustomerContactEmailCopyBtn, setShowCustomerContactEmailCopyBtn] = useState(false);
    const [showMailingContactEmailCopyBtn, setShowMailingContactEmailCopyBtn] = useState(false);
    const [showAutomaticEmailToCopyBtn, setShowAutomaticEmailToEmailCopyBtn] = useState(false);
    const [showAutomaticEmailCcCopyBtn, setShowAutomaticEmailCcEmailCopyBtn] = useState(false);
    const [showAutomaticEmailBccCopyBtn, setShowAutomaticEmailBccEmailCopyBtn] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCustomerOrders, setIsLoadingCustomerOrders] = useState(false);

    const refPrintCustomerInformation = useRef();
    const refCustomerCode = useRef();
    const refCustomerName = useRef();
    const refCustomerMailingCode = useRef();
    const refCustomerContactFirstName = useRef();
    const [isSavingCustomer, setIsSavingCustomer] = useState(false);
    const [isSavingContact, setIsSavingContact] = useState(false);
    const [isSavingMailingAddress, setIsSavingMailingAddress] = useState(false);

    const refCustomerContactPhone = useRef();

    const [customerContactPhoneItems, setCustomerContactPhoneItems] = useState([]);
    const [showCustomerContactPhones, setShowCustomerContactPhones] = useState(false);
    const refCustomerContactPhoneDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowCustomerContactPhones(false)
        }
    });
    const refCustomerContactPhonePopupItems = useRef([]);

    const refCustomerContactEmail = useRef();
    const [customerContactEmailItems, setCustomerContactEmailItems] = useState([]);
    const [showCustomerContactEmails, setShowCustomerContactEmails] = useState(false);
    const refCustomerContactEmailDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowCustomerContactEmails(false)
        }
    });
    const refCustomerContactEmailPopupItems = useRef([]);

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

    const [emailToDropdownItems, setEmailToDropdownItems] = useState([]);
    const refEmailToDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setEmailToDropdownItems([])
        }
    });
    const refEmailToPopupItems = useRef([]);

    const [emailCcDropdownItems, setEmailCcDropdownItems] = useState([]);
    const refEmailCcDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setEmailCcDropdownItems([])
        }
    });
    const refEmailCcPopupItems = useRef([]);

    const [emailBccDropdownItems, setEmailBccDropdownItems] = useState([]);
    const refEmailBccDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setEmailBccDropdownItems([])
        }
    });
    const refEmailBccPopupItems = useRef([]);

    const refAutomaticEmailsTo = useRef();
    const refAutomaticEmailsCc = useRef();
    const refAutomaticEmailsBcc = useRef();

    const [tempAutomaticEmails, setTempAutomaticEmails] = useState([]);
    const [tempBookedLoad, setTempBookedLoad] = useState(false);
    const [tempCheckCalls, setTempCheckCalls] = useState(false);
    const [tempCarrierArrivalShipper, setTempCarrierArrivalShipper] = useState(false);
    const [tempCarrierArrivalConsignee, setTempCarrierArrivalConsignee] = useState(false);
    const [tempLoaded, setTempLoaded] = useState(false);
    const [tempEmpty, setTempEmpty] = useState(false);

    const refDivision = useRef();
    const [divisionItems, setDivisionItems] = useState([]);
    const refDivisionDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setDivisionItems([]);
        }
    });
    const refDivisionPopupItems = useRef([]);

    const refSalesman = useRef();
    const [salesmanItems, setSalesmanItems] = useState([]);
    const refSalesmanDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setSalesmanItems([]);
        }
    });
    const refSalesmanPopupItems = useRef([]);

    const refTerms = useRef();
    const [termsItems, setTermsItems] = useState([]);
    const refTermsDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setTermsItems([]);
        }
    });
    const refTermsPopupItems = useRef([]);


    const loadingTransition = useTransition(isLoading, {
        from: {opacity: 0, display: 'block'},
        enter: {opacity: 1, display: 'block'},
        leave: {opacity: 0, display: 'none'},
        reverse: isLoading,
    });

    const loadingCustomerOrdersTransition = useTransition(isLoadingCustomerOrders, {
        from: {opacity: 0, display: 'block'},
        enter: {opacity: 1, display: 'block'},
        leave: {opacity: 0, display: 'none'},
        reverse: isLoadingCustomerOrders,
    });

    const mailingContactNamesTransition = useTransition(showMailingContactNames, {
        from: {opacity: 0, top: 'calc(100% + 7px)'},
        enter: {opacity: 1, top: 'calc(100% + 12px)'},
        leave: {opacity: 0, top: 'calc(100% + 7px)'},
        config: {duration: 100},
        reverse: showMailingContactNames
    });

    const mailingContactPhonesTransition = useTransition(showMailingContactPhones, {
        from: {opacity: 0, top: 'calc(100% + 7px)'},
        enter: {opacity: 1, top: 'calc(100% + 12px)'},
        leave: {opacity: 0, top: 'calc(100% + 7px)'},
        config: {duration: 100},
        reverse: showMailingContactPhones
    });

    const mailingContactEmailsTransition = useTransition(showMailingContactEmails, {
        from: {opacity: 0, top: 'calc(100% + 7px)'},
        enter: {opacity: 1, top: 'calc(100% + 12px)'},
        leave: {opacity: 0, top: 'calc(100% + 7px)'},
        config: {duration: 100},
        reverse: showMailingContactEmails
    });

    const divisionTransition = useTransition(divisionItems.length > 0, {
        from: {opacity: 0, top: "calc(100% + 7px)"},
        enter: {opacity: 1, top: "calc(100% + 12px)"},
        leave: {opacity: 0, top: "calc(100% + 7px)"},
        config: {duration: 100},
        reverse: divisionItems.length > 0
    });

    const salesmanTransition = useTransition(salesmanItems.length > 0, {
        from: {opacity: 0, top: "calc(100% + 7px)"},
        enter: {opacity: 1, top: "calc(100% + 12px)"},
        leave: {opacity: 0, top: "calc(100% + 7px)"},
        config: {duration: 100},
        reverse: salesmanItems.length > 0
    });

    const customerContactPhonesTransition = useTransition(showCustomerContactPhones, {
        from: {opacity: 0, top: 'calc(100% + 7px)'},
        enter: {opacity: 1, top: 'calc(100% + 12px)'},
        leave: {opacity: 0, top: 'calc(100% + 7px)'},
        config: {duration: 100},
        reverse: showCustomerContactPhones
    });

    const customerContactEmailsTransition = useTransition(showCustomerContactEmails, {
        from: {opacity: 0, top: 'calc(100% + 7px)'},
        enter: {opacity: 1, top: 'calc(100% + 12px)'},
        leave: {opacity: 0, top: 'calc(100% + 7px)'},
        config: {duration: 100},
        reverse: showCustomerContactEmails
    });

    const emailToTransition = useTransition(emailToDropdownItems.length > 0, {
        from: {opacity: 0, top: 0},
        enter: {opacity: 1, top: 5},
        leave: {opacity: 0, top: 0},
        config: {duration: 100},
        reverse: emailToDropdownItems.length > 0
    });

    const emailCcTransition = useTransition(emailCcDropdownItems.length > 0, {
        from: {opacity: 0, top: 0},
        enter: {opacity: 1, top: 5},
        leave: {opacity: 0, top: 0},
        config: {duration: 100},
        reverse: emailCcDropdownItems.length > 0
    });

    const emailBccTransition = useTransition(emailBccDropdownItems.length > 0, {
        from: {opacity: 0, top: 0},
        enter: {opacity: 1, top: 5},
        leave: {opacity: 0, top: 0},
        config: {duration: 100},
        reverse: emailBccDropdownItems.length > 0
    });

    const noteTransition = useTransition(selectedNote?.id !== undefined, {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
        reverse: selectedNote?.id !== undefined,
        config: {duration: 100}
    });

    const directionTransition = useTransition(selectedDirection?.id !== undefined, {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
        reverse: selectedDirection?.id !== undefined,
        config: {duration: 100}
    });

    const termsTransition = useTransition(termsItems.length > 0, {
        from: {opacity: 0, top: "calc(100% + 7px)"},
        enter: {opacity: 1, top: "calc(100% + 12px)"},
        leave: {opacity: 0, top: "calc(100% + 7px)"},
        config: {duration: 100},
        reverse: termsItems.length > 0
    });

    const numberMask = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 2,
        integerLimit: 15,
        allowNegative: true,
        allowLeadingZeroes: false,
    })

    const handledPrintCustomerInformation = useReactToPrint({
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
        content: () => refPrintCustomerInformation.current
    });

    useEffect(() => {
        if ((props.selectedCustomer?.component_id || '') !== props.componentId) {
            if (((selectedCustomer?.id || 0) > 0 && (props.selectedCustomer?.id || 0) > 0) && selectedCustomer.id === props.selectedCustomer.id) {
                setSelectedCustomer(selectedCustomer => {
                    return {
                        ...selectedCustomer,
                        ...props.selectedCustomer
                    }
                })
            }
        }
    }, [props.selectedCustomer])

    useEffect(() => {
        if ((props.selectedContact?.component_id || '') !== props.componentId) {
            if (((selectedContact?.id || 0) > 0 && (props.selectedContact?.id || 0) > 0) && selectedContact.id === props.selectedContact.id) {
                setSelectedContact(selectedContact => {
                    return {
                        ...selectedContact,
                        ...props.selectedContact
                    }
                })
            }
        }
    }, [props.selectedContact])

    useEffect(() => {
        if (isSavingCustomer) {
            if ((props.user?.is_admin || 0) === 0) {
                if ((selectedCustomer?.id || 0) > 0) {
                    if (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.edit || 0) === 0) {
                        setIsSavingCustomer(false);
                        return;
                    }
                } else {
                    if (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.save || 0) === 0) {
                        setIsSavingCustomer(false);
                        return;
                    }
                }
            }

            if (selectedCustomer.id === undefined || selectedCustomer.id === -1) {
                selectedCustomer.id = 0;
                setSelectedCustomer(selectedCustomer => {
                    return {...selectedCustomer, id: 0}
                });
            }

            if (
                (selectedCustomer.name || '').trim().replace(/\s/g, "").replace("&", "A") !== "" &&
                (selectedCustomer.city || '').trim().replace(/\s/g, "") !== "" &&
                (selectedCustomer.state || '').trim().replace(/\s/g, "") !== "" &&
                (selectedCustomer.address1 || '').trim() !== "" &&
                (selectedCustomer.zip || '').trim() !== ""
            ) {
                let parseCity = selectedCustomer.city.trim().replace(/\s/g, "").substring(0, 3);

                if (parseCity.toLowerCase() === "ft.") {
                    parseCity = "FO";
                }
                if (parseCity.toLowerCase() === "mt.") {
                    parseCity = "MO";
                }
                if (parseCity.toLowerCase() === "st.") {
                    parseCity = "SA";
                }

                let newCode = (selectedCustomer.name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (selectedCustomer.state || '').trim().replace(/\s/g, "").substring(0, 2);

                selectedCustomer.code = newCode.toUpperCase();

                selectedCustomer.credit_limit_total = Number((selectedCustomer?.credit_limit_total || '').toString().replace(',', ''));

                if (props.user?.user_code?.type === 'agent'){
                    selectedCustomer.agent_code = props.user?.user_code?.code || '';
                }

                axios.post(props.serverUrl + '/saveCustomer', {
                    ...selectedCustomer,
                    user_code: props.user.user_code.type === 'agent' ? props.user.user_code.code : ''
                }).then(res => {
                    if (res.data.result === 'OK') {
                        let customer = JSON.parse(JSON.stringify(res.data.customer));
                        if ((selectedCustomer?.id || 0) === 0) {
                            setSelectedCustomer(selectedCustomer => {
                                return {
                                    ...selectedCustomer,
                                    id: customer.id,
                                    code: customer.code,
                                    code_number: customer.code_number,
                                    contacts: customer.contacts || [],

                                }
                            });

                            props.setSelectedCustomer({
                                ...customer,
                                component_id: props.componentId
                            })

                        } else {
                            setSelectedCustomer({
                                ...selectedCustomer,
                                contacts: customer.contacts || []
                            });

                            props.setSelectedCustomer({
                                ...selectedCustomer,
                                contacts: customer.contacts || [],
                                component_id: props.componentId
                            });
                        }
                    }

                    setIsSavingCustomer(false);
                }).catch(e => {
                    console.log('error saving customer', e);
                    setIsSavingCustomer(false);
                });
            } else {
                setIsSavingCustomer(false);
            }
        }
    }, [isSavingCustomer])

    useEffect(() => {
        if (isSavingContact) {
            if ((props.user?.is_admin || 0) === 0) {
                if ((selectedContact?.id || 0) > 0) {
                    if (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.edit || 0) === 0) {
                        setIsSavingContact(false);
                        return;
                    }
                } else {
                    if (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.save || 0) === 0) {
                        setIsSavingContact(false);
                        return;
                    }
                }
            }

            if ((selectedCustomer?.id || 0) === 0) {
                setIsSavingContact(false);
                return;
            }

            if (selectedContact.customer_id === undefined || selectedContact.customer_id === 0) {
                selectedContact.customer_id = selectedCustomer.id;
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
                selectedContact.address1 = selectedCustomer?.address1;
                selectedContact.address2 = selectedCustomer?.address2;
                selectedContact.city = selectedCustomer?.city;
                selectedContact.state = selectedCustomer?.state;
                selectedContact.zip_code = selectedCustomer?.zip;
            }

            axios.post(props.serverUrl + '/saveContact', selectedContact).then(res => {
                if (res.data.result === 'OK') {
                    let mailing_contact = selectedCustomer?.mailing_address?.mailing_contact || {};

                    if ((mailing_contact?.id || 0) === res.data.contact.id) {
                        mailing_contact = res.data.contact;
                    }
                    setSelectedCustomer({
                        ...selectedCustomer,
                        contacts: res.data.contacts,
                        mailing_address: {
                            ...selectedCustomer.mailing_address,
                            mailing_contact: mailing_contact
                        }
                    });
                    setSelectedContact(res.data.contact);

                    props.setSelectedCustomer({
                        ...selectedCustomer,
                        contacts: res.data.contacts,
                        mailing_address: {
                            ...selectedCustomer.mailing_address,
                            mailing_contact: mailing_contact
                        },
                        component_id: props.componentId
                    });

                    props.setSelectedContact({
                        ...res.data.contact,
                        component_id: props.componentId
                    });
                }

                setIsSavingContact(false);
            }).catch(e => {
                console.log('error saving customer contact', e);
                setIsSavingContact(false);
            });
        }
    }, [isSavingContact])

    useEffect(() => {
        if (isSavingMailingAddress) {
            if ((props.user?.is_admin || 0) === 0) {
                if ((selectedCustomer?.mailing_address?.id || 0) > 0) {
                    if (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 0) {
                        setIsSavingMailingAddress(false);
                        return;
                    }
                } else {
                    if (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 0) {
                        setIsSavingMailingAddress(false);
                        return;
                    }
                }
            }

            if ((selectedCustomer.id || 0) > 0) {
                let mailing_address = selectedCustomer.mailing_address || {};

                if (mailing_address.id === undefined) {
                    mailing_address.id = 0;
                }

                console.log(mailing_address);

                mailing_address.customer_id = selectedCustomer.id;

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

                axios.post(props.serverUrl + '/saveCustomerMailingAddress', mailing_address).then(res => {
                    if (res.data.result === 'OK') {
                        setSelectedCustomer({...selectedCustomer, mailing_address: res.data.mailing_address});

                        props.setSelectedCustomer({
                            ...selectedCustomer,
                            mailing_address: res.data.mailing_address,
                            component_id: props.componentId
                        });
                    }

                    setIsSavingMailingAddress(false);
                }).catch(e => {
                    console.log('error on saving customer mailing address', e);
                    setIsSavingMailingAddress(false);
                });
            } else {
                setIsSavingMailingAddress(false);
            }
        }
    }, [isSavingMailingAddress]);

    useEffect(() => {
        if ((props.customer_id || 0) > 0) {
            setIsLoading(true);

            axios.post(props.serverUrl + '/getCustomerById', {
                id: props.customer_id
            }).then(res => {
                if (res.data.result === 'OK') {
                    setSelectedCustomer(res.data.customer);
                    setSelectedContact((res.data.customer.contacts || []).find(c => c.is_primary === 1) || {});

                    refCustomerName.current.focus({
                        preventScroll: true
                    });
                }
                setIsLoading(false);
            }).catch(e => {
                console.log('error getting customer by id')
                setIsLoading(false);
            });
        } else {
            refCustomerCode.current.focus({
                preventScroll: true
            });
        }
    }, [])

    useEffect(() => {
        if (props.screenFocused) {
            refCustomerCode.current.focus({
                preventScroll: true
            });
        }
    }, [props.screenFocused])

    useEffect(async () => {
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

        await setCustomerContactPhoneItems(phones);
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

        await setCustomerContactEmailItems(emails);
    }, [
        selectedContact?.email_work,
        selectedContact?.email_personal,
        selectedContact?.email_other,
        selectedContact?.primary_email
    ]);

    useEffect(async () => {
        let phones = [];
        (selectedCustomer?.mailing_address?.mailing_contact?.phone_work || '') !== '' && phones.push({
            id: 1,
            type: 'work',
            phone: selectedCustomer?.mailing_address?.mailing_contact.phone_work
        });
        (selectedCustomer?.mailing_address?.mailing_contact?.phone_work_fax || '') !== '' && phones.push({
            id: 2,
            type: 'fax',
            phone: selectedCustomer?.mailing_address?.mailing_contact.phone_work_fax
        });
        (selectedCustomer?.mailing_address?.mailing_contact?.phone_mobile || '') !== '' && phones.push({
            id: 3,
            type: 'mobile',
            phone: selectedCustomer?.mailing_address?.mailing_contact.phone_mobile
        });
        (selectedCustomer?.mailing_address?.mailing_contact?.phone_direct || '') !== '' && phones.push({
            id: 4,
            type: 'direct',
            phone: selectedCustomer?.mailing_address?.mailing_contact.phone_direct
        });
        (selectedCustomer?.mailing_address?.mailing_contact?.phone_other || '') !== '' && phones.push({
            id: 5,
            type: 'other',
            phone: selectedCustomer?.mailing_address?.mailing_contact.phone_other
        });

        await setMailingContactPhoneItems(phones);
    }, [
        selectedCustomer?.mailing_address?.mailing_contact?.phone_work,
        selectedCustomer?.mailing_address?.mailing_contact?.phone_work_fax,
        selectedCustomer?.mailing_address?.mailing_contact?.phone_mobile,
        selectedCustomer?.mailing_address?.mailing_contact?.phone_direct,
        selectedCustomer?.mailing_address?.mailing_contact?.phone_other,
        selectedCustomer?.mailing_address?.mailing_contact?.primary_phone
    ]);

    useEffect(async () => {
        let emails = [];
        (selectedCustomer?.mailing_address?.mailing_contact?.email_work || '') !== '' && emails.push({
            id: 1,
            type: 'work',
            email: selectedCustomer?.mailing_address?.mailing_contact.email_work
        });
        (selectedCustomer?.mailing_address?.mailing_contact?.email_personal || '') !== '' && emails.push({
            id: 2,
            type: 'personal',
            email: selectedCustomer?.mailing_address?.mailing_contact.email_personal
        });
        (selectedCustomer?.mailing_address?.mailing_contact?.email_other || '') !== '' && emails.push({
            id: 3,
            type: 'other',
            email: selectedCustomer?.mailing_address?.mailing_contact.email_other
        });

        await setMailingContactEmailItems(emails);
    }, [
        selectedCustomer?.mailing_address?.mailing_contact?.email_work,
        selectedCustomer?.mailing_address?.mailing_contact?.email_personal,
        selectedCustomer?.mailing_address?.mailing_contact?.email_other,
        selectedCustomer?.mailing_address?.mailing_contact?.primary_email
    ]);

    const setInitialValues = (clearCode = true) => {
        setIsSavingCustomer(false);
        setTempAutomaticEmails([]);
        setTempBookedLoad(false);
        setTempCheckCalls(false);
        setTempCarrierArrivalShipper(false);
        setTempCarrierArrivalConsignee(false);
        setTempLoaded(false);
        setTempEmpty(false);
        setSelectedContact({});
        setSelectedNote({});
        setSelectedDirection({});
        setContactSearch({});

        setShowingContactList(true);
        setAutomaticEmailsTo('');
        setAutomaticEmailsCc('');
        setAutomaticEmailsBcc('');
        setSelectedCustomer({id: 0, code: clearCode ? '' : selectedCustomer?.code});
    }

    const searchCustomerByCode = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (e.target.value.trim() !== '') {
                setIsLoading(true);

                axios.post(props.serverUrl + '/customers', {
                    code: e.target.value.toLowerCase(),
                    user_code: props.user.user_code.type === 'agent' ? props.user.user_code.code : ''
                }).then(res => {
                    if (res.data.result === 'OK') {
                        if (res.data.customers.length > 0) {
                            setInitialValues();
                            setSelectedCustomer(res.data.customers[0]);
                            setSelectedContact((res.data.customers[0].contacts || []).find(c => c.is_primary === 1) || {});

                            getCustomerOrders(res.data.customers[0]);
                        } else {
                            setInitialValues(false);
                        }
                    } else {
                        setInitialValues(false);
                    }

                    setIsLoading(false);
                }).catch(e => {
                    console.log('error getting customers', e);
                    setIsLoading(false);
                });
            } else {
                setInitialValues(false);
            }
        }
    }

    const getCustomerOrders = (customer) => {
        setIsLoadingCustomerOrders(true);
        axios.post(props.serverUrl + '/getCustomerOrders', {
            id: customer.id
        }).then(res => {
            if (res.data.result === 'OK') {
                setSelectedCustomer({
                    ...customer,
                    orders: res.data.orders
                });
            }
        }).catch(e => {
            console.log('error getting customer orders', e);
        }).finally(() => {
            setIsLoadingCustomerOrders(false);
        });
    }

    const importCustomerBtnClick = () => {
        let panel = {
            panelName: `${props.panelName}-customer-import`,
            component: <CustomerImport
                title='Import Customers'
                tabTimes={19000 + props.tabTimes}
                panelName={`${props.panelName}-customer-import`}
                origin={props.origin}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const searchCustomerBtnClick = () => {
        let customerSearch = [
            {
                field: 'Code',
                data: (selectedCustomer?.code || '').toLowerCase()
            },
            {
                field: 'Name',
                data: (selectedCustomer?.name || '').toLowerCase()
            },
            {
                field: 'City',
                data: (selectedCustomer?.city || '').toLowerCase()
            },
            {
                field: 'State',
                data: (selectedCustomer?.state || '').toLowerCase()
            },
            {
                field: 'Postal Code',
                data: selectedCustomer?.zip || ''
            },
            {
                field: 'Contact Name',
                data: (selectedCustomer?.contact_name || '').toLowerCase()
            },
            {
                field: 'Contact Phone',
                data: selectedCustomer?.contact_phone || ''
            },
            {
                field: 'E-Mail',
                data: (selectedCustomer?.email || '').toLowerCase()
            },
            {
                field: 'User Code',
                data: props.user.user_code.type === 'agent' ? props.user.user_code.code : ''
            }
        ]

        let panel = {
            panelName: `${props.panelName}-customer-search`,
            component: <CustomerSearch
                title='Customer Search Results'
                tabTimes={20000 + props.tabTimes}
                panelName={`${props.panelName}-customer-search`}
                origin={props.origin}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                customerSearch={customerSearch}

                callback={(id) => {
                    new Promise((resolve, reject) => {
                        if ((id || 0) > 0) {
                            axios.post(props.serverUrl + '/getCustomerById', {id: id}).then(res => {
                                if (res.data.result === 'OK') {
                                    setSelectedCustomer(res.data.customer);
                                    setSelectedContact((res.data.customer.contacts || []).find(c => c.is_primary === 1) || {});

                                    if ((props.selectedCustomer?.id || 0) === 0) {
                                        props.setSelectedCustomer({
                                            ...res.data.customer,
                                            component_id: props.componentId
                                        });
                                        props.setSelectedContact({
                                            ...((res.data.customer.contacts || []).find(c => c.is_primary === 1) || {}),
                                            component_id: props.componentId
                                        });
                                    }

                                    setAutomaticEmailsTo('');
                                    setAutomaticEmailsCc('');
                                    setAutomaticEmailsBcc('');

                                    getCustomerOrders(res.data.customer);

                                    resolve('OK');
                                } else {
                                    reject('no customer');
                                }
                            });
                        }

                        // if (customer) {
                        //     setSelectedCustomer(customer);
                        //     setSelectedContact((customer.contacts || []).find(c => c.is_primary === 1) || {});

                        //     if ((props.selectedCustomer?.id || 0) === 0) {
                        //         props.setSelectedCustomer({
                        //             ...customer,
                        //             component_id: props.componentId
                        //         });
                        //         props.setSelectedContact({
                        //             ...((customer.contacts || []).find(c => c.is_primary === 1) || {}),
                        //             component_id: props.componentId
                        //         });
                        //     }

                        //     setAutomaticEmailsTo('');
                        //     setAutomaticEmailsCc('');
                        //     setAutomaticEmailsBcc('');

                        //     resolve('OK');
                        // } else {
                        //     reject('no customer');
                        // }
                    }).then(response => {
                        props.closePanel(`${props.panelName}-customer-search`, props.origin);
                        refCustomerName.current.focus();
                    }).catch(e => {
                        props.closePanel(`${props.panelName}-customer-search`, props.origin);
                        refCustomerCode.current.focus();
                    })

                }}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const searchContactBtnClick = () => {
        let filters = [
            {
                field: 'Customer Id',
                data: selectedCustomer?.id || 0
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
                owner='customer'
                origin={props.origin}
                suborigin='customer'
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                contactSearch={{search: filters}}

                callback={(contact) => {
                    new Promise((resolve, reject) => {
                        if (contact) {
                            setSelectedCustomer(contact.customer);
                            setSelectedContact(contact);
                            setAutomaticEmailsTo('');
                            setAutomaticEmailsCc('');
                            setAutomaticEmailsBcc('');
                            setShowingContactList(true);
                            setContactSearch({});
                            resolve('OK');
                        } else {
                            reject('no contact');
                        }
                    }).then(response => {
                        props.closePanel(`${props.panelName}-contact-search`, props.origin);
                        refCustomerName.current.focus();
                    }).catch(e => {
                        props.closePanel(`${props.panelName}-contact-search`, props.origin);
                        refCustomerCode.current.focus();
                    })

                }}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const revenueInformationBtnClick = () => {
        let panel = {
            panelName: `${props.panelName}-revenue-information`,
            component: <RevenueInformation
                title='Revenue Information'
                tabTimes={23000 + props.tabTimes}
                panelName={`${props.panelName}-revenue-information`}
                origin={props.origin}
                suborigin={'customer'}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                isAdmin={props.isAdmin}
                selectedCustomer={selectedCustomer}
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
                suborigin={'customer'}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                isAdmin={props.isAdmin}
                selectedCustomer={selectedCustomer}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const documentsBtnClick = () => {
        if ((selectedCustomer?.id || 0) > 0) {
            let panel = {
                panelName: `${props.panelName}-documents`,
                component: <Documents
                    title='Documents'
                    tabTimes={26000 + props.tabTimes}
                    panelName={`${props.panelName}-documents`}
                    origin={props.origin}
                    suborigin={'customer'}
                    openPanel={props.openPanel}
                    closePanel={props.closePanel}
                    componentId={moment().format('x')}
                    selectedOwner={{...selectedCustomer}}
                    selectedOwnerDocument={{
                        id: 0,
                        user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                        date_entered: moment().format('MM/DD/YYYY')
                    }}
                    savingDocumentUrl='/saveCustomerDocument'
                    deletingDocumentUrl='/deleteCustomerDocument'
                    savingDocumentNoteUrl='/saveCustomerDocumentNote'
                    serverDocumentsFolder='/customer-documents/'
                    permissionName='customer documents'
                />
            }

            props.openPanel(panel, props.origin);
        } else {
            window.alert('You must select a customer first!');
        }
    }

    const validateCustomerForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingCustomer) {
                setIsSavingCustomer(true);
            }
        }
    }

    const validateMailingAddressForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingMailingAddress) {
                setIsSavingMailingAddress(true);
            }
        }
    }

    const remitToAddressBtn = () => {
        if ((selectedCustomer?.id || 0) === 0) {
            window.alert('You must select a customer first');
            return;
        }

        let mailing_address = {};

        mailing_address.id = -1;
        mailing_address.customer_id = selectedCustomer.id;
        mailing_address.code = selectedCustomer.code;
        mailing_address.code_number = selectedCustomer.code_number;
        mailing_address.name = selectedCustomer.name;
        mailing_address.address1 = selectedCustomer.address1;
        mailing_address.address2 = selectedCustomer.address2;
        mailing_address.city = selectedCustomer.city;
        mailing_address.state = selectedCustomer.state;
        mailing_address.zip = selectedCustomer.zip;
        mailing_address.contact_name = selectedCustomer.contact_name;
        mailing_address.contact_phone = selectedCustomer.contact_phone;
        mailing_address.ext = selectedCustomer.ext;
        mailing_address.email = selectedCustomer.email;

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

        } else if (selectedCustomer.contacts.findIndex(x => x.is_primary === 1) > -1) {
            mailing_address.mailing_contact_id = selectedCustomer.contacts[selectedCustomer.contacts.findIndex(x => x.is_primary === 1)].id;
            mailing_address.mailing_contact = selectedCustomer.contacts[selectedCustomer.contacts.findIndex(x => x.is_primary === 1)];

            mailing_address.mailing_contact_primary_phone = selectedCustomer.contacts[selectedCustomer.contacts.findIndex(x => x.is_primary === 1)].phone_work !== ''
                ? 'work'
                : selectedCustomer.contacts[selectedCustomer.contacts.findIndex(x => x.is_primary === 1)].phone_work_fax !== ''
                    ? 'fax'
                    : selectedCustomer.contacts[selectedCustomer.contacts.findIndex(x => x.is_primary === 1)].phone_mobile !== ''
                        ? 'mobile'
                        : selectedCustomer.contacts[selectedCustomer.contacts.findIndex(x => x.is_primary === 1)].phone_direct !== ''
                            ? 'direct'
                            : selectedCustomer.contacts[selectedCustomer.contacts.findIndex(x => x.is_primary === 1)].phone_other !== ''
                                ? 'other' : 'work';

            mailing_address.mailing_contact_primary_email = selectedCustomer.contacts[selectedCustomer.contacts.findIndex(x => x.is_primary === 1)].email_work !== ''
                ? 'work'
                : selectedCustomer.contacts[selectedCustomer.contacts.findIndex(x => x.is_primary === 1)].email_personal !== ''
                    ? 'personal'
                    : selectedCustomer.contacts[selectedCustomer.contacts.findIndex(x => x.is_primary === 1)].email_other !== ''
                        ? 'other' : 'work';

        } else if (selectedCustomer.contacts.length > 0) {
            mailing_address.mailing_contact_id = selectedCustomer.contacts[0].id;
            mailing_address.mailing_contact = selectedCustomer.contacts[0];

            mailing_address.mailing_contact_primary_phone = selectedCustomer.contacts[0].phone_work !== ''
                ? 'work'
                : selectedCustomer.contacts[0].phone_work_fax !== ''
                    ? 'fax'
                    : selectedCustomer.contacts[0].phone_mobile !== ''
                        ? 'mobile'
                        : selectedCustomer.contacts[0].phone_direct !== ''
                            ? 'direct'
                            : selectedCustomer.contacts[0].phone_other !== ''
                                ? 'other' : 'work';

            mailing_address.mailing_contact_primary_email = selectedCustomer.contacts[0].email_work !== ''
                ? 'work'
                : selectedCustomer.contacts[0].email_personal !== ''
                    ? 'personal'
                    : selectedCustomer.contacts[0].email_other !== ''
                        ? 'other' : 'work';

        } else {
            mailing_address.mailing_contact_id = null;
            mailing_address.mailing_contact = {};
            mailing_address.mailing_contact_primary_phone = 'work';
            mailing_address.mailing_contact_primary_email = 'work';
        }

        setSelectedCustomer({...selectedCustomer, mailing_address: mailing_address});

        validateMailingAddressForSaving({keyCode: 9});
    }

    const mailingAddressClearBtn = () => {
        setSelectedCustomer({
            ...selectedCustomer,
            mailing_address: {}
        });

        if ((selectedCustomer?.id || 0) > 0) {
            axios.post(props.serverUrl + '/deleteCustomerMailingAddress', {
                customer_id: selectedCustomer.id
            }).then(res => {
                if (res.data.result === 'OK') {
                    console.log('customer mailing address deleted')
                }
            })
        }
        refCustomerMailingCode.current.focus();
    }

    const mailingAddressBillToBtn = () => {
        if ((selectedCustomer?.id || 0) === 0) {
            window.alert('You must select a customer first');
            return;
        }

        let customer = selectedCustomer || {};

        if ((customer.mailing_address?.bill_to_code || '') !== '') {
            customer.mailing_address = {
                ...customer.mailing_address,
                bill_to_code: '',
                bill_to_code_number: 0,
            }
        } else {
            if ((customer.mailing_address?.code || '') !== '') {
                customer.mailing_address = {
                    ...customer.mailing_address,
                    bill_to_code: (customer.mailing_address?.code || ''),
                    bill_to_code_number: (customer.mailing_address?.code_number || 0)
                }
            }
        }

        setSelectedCustomer(customer);

        validateMailingAddressForSaving({keyCode: 9});
    }

    const validateContactForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingContact) {
                setIsSavingContact(true);
            }
        }
    }

    const isEmailValid = (email) => {
        let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return email.match(mailformat);
    }

    const validateHoursForSaving = (e, name) => {
        let formatted = getFormattedHours(e.target.value);
        let hours = {...selectedCustomer?.hours || {}, customer_id: selectedCustomer?.id};

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

        axios.post(props.serverUrl + '/saveCustomerHours', hours).then(async res => {
            if (res.data.result === 'OK') {
                await setSelectedCustomer({...selectedCustomer, hours: res.data.customer_hours});
            }
        }).catch(e => {
            console.log('error saving customer hours', e);
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

    return (
        <div className="customers-main-container" style={{
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
                    <animated.div className='loading-container' style={style}>
                        <div className="loading-container-wrapper">
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item}/>
                        </div>
                    </animated.div>
                )
            }

            {
                (selectedCustomer?.id || 0) > 0 &&
                <div style={{display: 'none'}}>
                    <ToPrint
                        ref={refPrintCustomerInformation}
                        selectedCustomer={selectedCustomer}
                    />
                </div>

            }

            <div className="fields-container">
                <div className="fields-container-row">
                    <div className="fields-container-col">
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Customer</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    {
                                        ((props.user?.user_code?.is_admin || 0) === 1) &&
                                        <div className="mochi-button" onClick={importCustomerBtnClick}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Import</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    <div className="mochi-button" onClick={searchCustomerBtnClick}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Search</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className="mochi-button" onClick={() => {
                                        setInitialValues();
                                        refCustomerCode.current.focus();
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
                                    <input tabIndex={1 + props.tabTimes} type="text" placeholder="Code" maxLength="8"
                                           id="txt-customer-code"
                                           ref={refCustomerCode}
                                           onKeyDown={searchCustomerByCode}
                                           onInput={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   code: e.target.value,
                                                   code_number: 0
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   code: e.target.value,
                                                   code_number: 0
                                               })
                                           }}
                                           value={(selectedCustomer.code_number || 0) === 0 ? (selectedCustomer.code || '') : selectedCustomer.code + selectedCustomer.code_number}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-box-container grow">
                                    <input tabIndex={2 + props.tabTimes} type="text" placeholder="Name"
                                           ref={refCustomerName}
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.edit || 0) === 0
                                           }
                                           onChange={e => setSelectedCustomer({
                                               ...selectedCustomer,
                                               name: e.target.value
                                           })}
                                           value={selectedCustomer?.name || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="input-box-container grow">
                                    <input tabIndex={3 + props.tabTimes} type="text" placeholder="Address 1"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.edit || 0) === 0
                                           }
                                           onChange={e => setSelectedCustomer({
                                               ...selectedCustomer,
                                               address1: e.target.value
                                           })}
                                           value={selectedCustomer?.address1 || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="input-box-container grow">
                                    <input tabIndex={4 + props.tabTimes} type="text" placeholder="Address 2"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.edit || 0) === 0
                                           }
                                           onChange={e => setSelectedCustomer({
                                               ...selectedCustomer,
                                               address2: e.target.value
                                           })}
                                           value={selectedCustomer?.address2 || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="input-box-container grow">
                                    <input tabIndex={5 + props.tabTimes} type="text" placeholder="City"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.edit || 0) === 0
                                           }
                                           onChange={e => setSelectedCustomer({
                                               ...selectedCustomer,
                                               city: e.target.value
                                           })}
                                           value={selectedCustomer?.city || ''}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-box-container input-state">
                                    <input tabIndex={6 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.edit || 0) === 0
                                           }
                                           onChange={e => setSelectedCustomer({
                                               ...selectedCustomer,
                                               state: e.target.value
                                           })}
                                           value={selectedCustomer?.state || ''}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-box-container input-zip-code">
                                    <input tabIndex={7 + props.tabTimes} type="text" placeholder="Postal Code"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.edit || 0) === 0
                                           }
                                           onKeyDown={validateCustomerForSaving}
                                           onChange={e => setSelectedCustomer({
                                               ...selectedCustomer,
                                               zip: e.target.value
                                           })}
                                           value={selectedCustomer?.zip || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="input-box-container grow">
                                    <input tabIndex={8 + props.tabTimes} type="text" placeholder="Contact Name"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.edit || 0) === 0
                                           }
                                           onInput={(e) => {
                                               if ((selectedCustomer?.contacts || []).length === 0) {
                                                   setSelectedCustomer({
                                                       ...selectedCustomer,
                                                       contact_name: e.target.value
                                                   })
                                               }
                                           }}
                                           onChange={(e) => {
                                               if ((selectedCustomer?.contacts || []).length === 0) {
                                                   setSelectedCustomer({
                                                       ...selectedCustomer,
                                                       contact_name: e.target.value
                                                   })
                                               }
                                           }}
                                           value={
                                               (selectedCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                   ? (selectedCustomer?.contact_name || '')
                                                   // ? ''
                                                   : selectedCustomer?.contacts.find(c => c.is_primary === 1).first_name + ' ' + selectedCustomer?.contacts.find(c => c.is_primary === 1).last_name
                                           }
                                    />
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-box-container input-phone" style={{position: 'relative'}}>
                                    <MaskedInput
                                        tabIndex={9 + props.tabTimes}
                                        mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                        guide={true}
                                        type="text" placeholder="Contact Phone"
                                        readOnly={
                                            (props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.edit || 0) === 0
                                        }
                                        onInput={(e) => {
                                            if ((selectedCustomer?.contacts || []).length === 0) {
                                                setSelectedCustomer({
                                                    ...selectedCustomer,
                                                    contact_phone: e.target.value
                                                })
                                            }
                                        }}
                                        onChange={(e) => {
                                            if ((selectedCustomer?.contacts || []).length === 0) {
                                                setSelectedCustomer({
                                                    ...selectedCustomer,
                                                    contact_phone: e.target.value
                                                })
                                            }
                                        }}
                                        value={
                                            (selectedCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                ? (selectedCustomer?.contact_phone || '')
                                                // ? ''
                                                : selectedCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'work'
                                                    ? selectedCustomer?.contacts.find(c => c.is_primary === 1).phone_work
                                                    : selectedCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'fax'
                                                        ? selectedCustomer?.contacts.find(c => c.is_primary === 1).phone_work_fax
                                                        : selectedCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'mobile'
                                                            ? selectedCustomer?.contacts.find(c => c.is_primary === 1).phone_mobile
                                                            : selectedCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'direct'
                                                                ? selectedCustomer?.contacts.find(c => c.is_primary === 1).phone_direct
                                                                : selectedCustomer?.contacts.find(c => c.is_primary === 1).primary_phone === 'other'
                                                                    ? selectedCustomer?.contacts.find(c => c.is_primary === 1).phone_other
                                                                    : ''
                                        }
                                    />

                                    {
                                        ((selectedCustomer?.contacts || []).find(c => c.is_primary === 1) !== undefined) &&
                                        <div
                                            className={classnames({
                                                'selected-customer-contact-primary-phone': true,
                                                'pushed': false
                                            })}>
                                            {selectedCustomer?.contacts.find(c => c.is_primary === 1).primary_phone}
                                        </div>
                                    }
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-box-container input-phone-ext">
                                    <input tabIndex={10 + props.tabTimes} type="text" placeholder="Ext"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.edit || 0) === 0
                                           }
                                           onInput={(e) => {
                                               if ((selectedCustomer?.contacts || []).length === 0) {
                                                   setSelectedCustomer({...selectedCustomer, ext: e.target.value})
                                               }
                                           }}
                                           onChange={(e) => {
                                               if ((selectedCustomer?.contacts || []).length === 0) {
                                                   setSelectedCustomer({...selectedCustomer, ext: e.target.value})
                                               }
                                           }}
                                           value={
                                               (selectedCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                   ? (selectedCustomer?.ext || '')
                                                   // ? ''
                                                   : selectedCustomer?.contacts.find(c => c.is_primary === 1).phone_ext
                                           }
                                    />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="input-box-container" style={{position: 'relative', flexGrow: 1}}
                                     onMouseEnter={() => {
                                         if ((selectedCustomer?.email || '') !== '') {
                                             setShowCustomerEmailCopyBtn(true);
                                         }
                                     }}
                                     onFocus={() => {
                                         if ((selectedCustomer?.email || '') !== '') {
                                             setShowCustomerEmailCopyBtn(true);
                                         }
                                     }}
                                     onBlur={() => {
                                         window.setTimeout(() => {
                                             setShowCustomerEmailCopyBtn(false);
                                         }, 1000);
                                     }}
                                     onMouseLeave={() => {
                                         setShowCustomerEmailCopyBtn(false);
                                     }}
                                >
                                    <input tabIndex={11 + props.tabTimes}
                                           ref={refCustomerEmail}
                                           type="text"
                                           placeholder="E-Mail"
                                           style={{textTransform: 'lowercase'}}
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer info')?.pivot?.edit || 0) === 0
                                           }
                                           onKeyDown={validateCustomerForSaving}
                                           onInput={(e) => {
                                               if ((selectedCustomer?.contacts || []).length === 0) {
                                                   setSelectedCustomer({...selectedCustomer, email: e.target.value})
                                               }
                                           }}
                                           onChange={(e) => {
                                               if ((selectedCustomer?.contacts || []).length === 0) {
                                                   setSelectedCustomer({...selectedCustomer, email: e.target.value})
                                               }
                                           }}
                                           value={
                                               (selectedCustomer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                   ? (selectedCustomer?.email || '')
                                                   // ? ''
                                                   : selectedCustomer?.contacts.find(c => c.is_primary === 1).primary_email === 'work'
                                                       ? selectedCustomer?.contacts.find(c => c.is_primary === 1).email_work
                                                       : selectedCustomer?.contacts.find(c => c.is_primary === 1).primary_email === 'personal'
                                                           ? selectedCustomer?.contacts.find(c => c.is_primary === 1).email_personal
                                                           : selectedCustomer?.contacts.find(c => c.is_primary === 1).primary_email === 'other'
                                                               ? selectedCustomer?.contacts.find(c => c.is_primary === 1).email_other
                                                               : ''
                                           }
                                    />
                                    {
                                        ((selectedCustomer?.contacts || []).find(c => c.is_primary === 1) !== undefined) &&
                                        <div
                                            className={classnames({
                                                'selected-customer-contact-primary-email': true,
                                                'pushed': false
                                            })}>
                                            {selectedCustomer?.contacts.find(c => c.is_primary === 1).primary_email}
                                        </div>
                                    }

                                    {
                                        showCustomerEmailCopyBtn &&
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
                                            navigator.clipboard.writeText(refCustomerEmail.current.value);
                                        }}/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fields-container-col" style={{display: 'flex', flexDirection: 'row'}}>
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Mailing Address</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div className={
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer bill to')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer bill to')?.pivot?.edit || 0) === 0)
                                            ? 'mochi-button disabled' : 'mochi-button'
                                    } onClick={mailingAddressBillToBtn}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Bill to</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className={
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 0)
                                            ? 'mochi-button disabled' : 'mochi-button'
                                    } onClick={remitToAddressBtn}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Remit to address is the same</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className={
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 0)
                                            ? 'mochi-button disabled' : 'mochi-button'
                                    } onClick={mailingAddressClearBtn}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Clear</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                </div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="form-row">
                                <div className="input-box-container input-code">
                                    <input tabIndex={18 + props.tabTimes} type="text" placeholder="Code" maxLength="8"
                                           ref={refCustomerMailingCode}
                                           readOnly={true}
                                           onInput={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   mailing_address: {
                                                       ...selectedCustomer?.mailing_address,
                                                       code: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   mailing_address: {
                                                       ...selectedCustomer?.mailing_address,
                                                       code: e.target.value
                                                   }
                                               })
                                           }}
                                           value={(selectedCustomer?.mailing_address?.code || '') + ((selectedCustomer?.mailing_address?.code_number || 0) === 0 ? '' : selectedCustomer?.mailing_address?.code_number)}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-box-container grow">
                                    <input tabIndex={19 + props.tabTimes} type="text" placeholder="Name"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 0
                                           }
                                           onInput={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   mailing_address: {
                                                       ...selectedCustomer?.mailing_address,
                                                       name: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   mailing_address: {
                                                       ...selectedCustomer?.mailing_address,
                                                       name: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedCustomer?.mailing_address?.name || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="input-box-container grow">
                                    <input tabIndex={20 + props.tabTimes} type="text" placeholder="Address 1"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 0
                                           }
                                           onInput={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   mailing_address: {
                                                       ...selectedCustomer?.mailing_address,
                                                       address1: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   mailing_address: {
                                                       ...selectedCustomer?.mailing_address,
                                                       address1: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedCustomer?.mailing_address?.address1 || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="input-box-container grow">
                                    <input tabIndex={21 + props.tabTimes} type="text" placeholder="Address 2"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 0
                                           }
                                           onInput={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   mailing_address: {
                                                       ...selectedCustomer?.mailing_address,
                                                       address2: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   mailing_address: {
                                                       ...selectedCustomer?.mailing_address,
                                                       address2: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedCustomer?.mailing_address?.address2 || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="input-box-container grow">
                                    <input tabIndex={22 + props.tabTimes} type="text" placeholder="City"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 0
                                           }
                                           onInput={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   mailing_address: {
                                                       ...selectedCustomer?.mailing_address,
                                                       city: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   mailing_address: {
                                                       ...selectedCustomer?.mailing_address,
                                                       city: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedCustomer?.mailing_address?.city || ''}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-box-container input-state">
                                    <input tabIndex={23 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 0
                                           }
                                           onInput={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   mailing_address: {
                                                       ...selectedCustomer?.mailing_address,
                                                       state: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   mailing_address: {
                                                       ...selectedCustomer?.mailing_address,
                                                       state: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedCustomer?.mailing_address?.state || ''}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-box-container input-zip-code">
                                    <input tabIndex={24 + props.tabTimes} type="text" placeholder="Postal Code"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 0
                                           }
                                           onKeyDown={validateMailingAddressForSaving}
                                           onInput={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   mailing_address: {
                                                       ...selectedCustomer?.mailing_address,
                                                       zip: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   mailing_address: {
                                                       ...selectedCustomer?.mailing_address,
                                                       zip: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedCustomer?.mailing_address?.zip || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="select-box-container" style={{flexGrow: 1}}>
                                    <div className="select-box-wrapper">
                                        <input
                                            readOnly={
                                                (props.user?.user_code?.is_admin || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 0
                                            }
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
                                                                await setMailingContactNameItems((selectedCustomer?.contacts || []).map((item, index) => {
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
                                                                await setMailingContactNameItems((selectedCustomer?.contacts || []).map((item, index) => {
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
                                                            await setSelectedCustomer({
                                                                ...selectedCustomer,
                                                                mailing_address: {
                                                                    ...(selectedCustomer?.mailing_address || {}),
                                                                    contact_name: ((mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].first_name || '')
                                                                        + ' '
                                                                        + (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].last_name || '')).trim(),
                                                                    contact_phone: (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_phone || '') === 'work'
                                                                        ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_work || '')
                                                                        : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_phone || '') === 'fax'
                                                                            ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_work_fax || '')
                                                                            : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_phone || '') === 'mobile'
                                                                                ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_mobile || '')
                                                                                : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_phone || '') === 'direct'
                                                                                    ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_direct || '')
                                                                                    : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_phone || '') === 'other'
                                                                                        ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_other || '')
                                                                                        : '',
                                                                    ext: (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_ext || ''),
                                                                    email: (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_email || '') === 'work'
                                                                        ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].email_work || '')
                                                                        : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_email || '') === 'personal'
                                                                            ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].email_personal || '')
                                                                            : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_email || '') === 'other'
                                                                                ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].email_other || '')
                                                                                : '',
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

                                                            // validateMailingAddressForSaving({keyCode: 9});
                                                            setShowMailingContactNames(false);
                                                            refMailingContactName.current.focus();
                                                        }
                                                        break;

                                                    case 9: // tab
                                                        if (showMailingContactNames) {
                                                            e.preventDefault();
                                                            await setSelectedCustomer({
                                                                ...selectedCustomer,
                                                                mailing_address: {
                                                                    ...(selectedCustomer?.mailing_address || {}),
                                                                    contact_name: ((mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].first_name || '')
                                                                        + ' '
                                                                        + (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].last_name || '')).trim(),
                                                                    contact_phone: (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_phone || '') === 'work'
                                                                        ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_work || '')
                                                                        : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_phone || '') === 'fax'
                                                                            ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_work_fax || '')
                                                                            : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_phone || '') === 'mobile'
                                                                                ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_mobile || '')
                                                                                : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_phone || '') === 'direct'
                                                                                    ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_direct || '')
                                                                                    : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_phone || '') === 'other'
                                                                                        ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_other || '')
                                                                                        : '',
                                                                    ext: (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].phone_ext || ''),
                                                                    email: (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_email || '') === 'work'
                                                                        ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].email_work || '')
                                                                        : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_email || '') === 'personal'
                                                                            ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].email_personal || '')
                                                                            : (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].primary_email || '') === 'other'
                                                                                ? (mailingContactNameItems[mailingContactNameItems.findIndex(item => item.selected)].email_other || '')
                                                                                : '',
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

                                                            // validateMailingAddressForSaving({keyCode: 9});
                                                            setShowMailingContactNames(false);
                                                            refMailingContactName.current.focus();
                                                        } else {
                                                            // validateMailingAddressForSaving({keyCode: 9});
                                                        }
                                                        break;

                                                    default:
                                                        break;
                                                }
                                            }}
                                            onBlur={e => {
                                                let contact = (selectedCustomer?.contacts || []).find(x => (x.first_name + ' ' + x.last_name).toLowerCase() === e.target.value.toLowerCase());

                                                if (contact) {
                                                    setSelectedCustomer(selectedCustomer => {
                                                        return {
                                                            ...selectedCustomer,
                                                            mailing_address: {
                                                                ...(selectedCustomer?.mailing_address || {}),
                                                                contact_phone: (contact.primary_phone || '') === 'work'
                                                                    ? (contact.phone_work || '')
                                                                    : (contact.primary_phone || '') === 'fax'
                                                                        ? (contact.phone_work_fax || '')
                                                                        : (contact.primary_phone || '') === 'mobile'
                                                                            ? (contact.phone_mobile || '')
                                                                            : (contact.primary_phone || '') === 'direct'
                                                                                ? (contact.phone_direct || '')
                                                                                : (contact.primary_phone || '') === 'other'
                                                                                    ? (contact.phone_other || '')
                                                                                    : '',
                                                                ext: (contact.phone_ext || ''),
                                                                email: (contact.primary_email || '') === 'work'
                                                                    ? (contact.email_work || '')
                                                                    : (contact.primary_email || '') === 'personal'
                                                                        ? (contact.email_personal || '')
                                                                        : (contact.primary_email || '') === 'other'
                                                                            ? (contact.email_other || '')
                                                                            : '',
                                                                mailing_contact_id: contact.id
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    setSelectedCustomer(selectedCustomer => {
                                                        return {
                                                            ...selectedCustomer,
                                                            mailing_address: {
                                                                ...(selectedCustomer?.mailing_address || {}),
                                                                mailing_contact_id: null,
                                                            }
                                                        }
                                                    })
                                                }
                                            }}
                                            onInput={e => {
                                                setSelectedCustomer(selectedCustomer => {
                                                    return {
                                                        ...selectedCustomer,
                                                        mailing_address: {
                                                            ...(selectedCustomer?.mailing_address || {}),
                                                            contact_name: e.target.value
                                                        }
                                                    }
                                                })
                                            }}
                                            onChange={e => {
                                                setSelectedCustomer(selectedCustomer => {
                                                    return {
                                                        ...selectedCustomer,
                                                        mailing_address: {
                                                            ...(selectedCustomer?.mailing_address || {}),
                                                            contact_name: e.target.value
                                                        }
                                                    }
                                                })
                                            }}
                                            value={selectedCustomer?.mailing_address?.contact_name || ''}
                                        />

                                        {
                                            ((selectedCustomer?.contacts || []).length > 0 && ((selectedCustomer?.mailing_address?.id || 0) > 0)) &&
                                            ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 1 &&
                                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 1)) &&
                                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                                             onClick={async () => {
                                                                 if (showMailingContactNames) {
                                                                     setShowMailingContactNames(false);
                                                                 } else {
                                                                     if ((selectedCustomer?.contacts || []).length > 0) {
                                                                         await setMailingContactNameItems((selectedCustomer?.contacts || []).map((item, index) => {
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
                                                             }}/>
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
                                                     style={{height: 150}}>
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
                                                                                await setSelectedCustomer(selectedCustomer => {
                                                                                    return {
                                                                                        ...selectedCustomer,
                                                                                        mailing_address: {
                                                                                            ...(selectedCustomer?.mailing_address || {}),
                                                                                            contact_name: (item.first_name + ' ' + item.last_name).trim(),
                                                                                            contact_phone: (item.primary_phone || '') === 'work'
                                                                                                ? (item.phone_work || '')
                                                                                                : (item.primary_phone || '') === 'fax'
                                                                                                    ? (item.phone_work_fax || '')
                                                                                                    : (item.primary_phone || '') === 'mobile'
                                                                                                        ? (item.phone_mobile || '')
                                                                                                        : (item.primary_phone || '') === 'direct'
                                                                                                            ? (item.phone_direct || '')
                                                                                                            : (item.primary_phone || '') === 'other'
                                                                                                                ? (item.phone_other || '')
                                                                                                                : '',
                                                                                            ext: (item.phone_ext || ''),
                                                                                            email: (item.primary_email || '') === 'work'
                                                                                                ? (item.email_work || '')
                                                                                                : (item.primary_email || '') === 'personal'
                                                                                                    ? (item.email_personal || '')
                                                                                                    : (item.primary_email || '') === 'other'
                                                                                                        ? (item.email_other || '')
                                                                                                        : '',
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
                                                                                    }
                                                                                });

                                                                                // validateMailingAddressForSaving({keyCode: 9});
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
                                                                                    icon={faCaretRight}/>
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
                                        <MaskedInput tabIndex={26 + props.tabTimes}
                                                     readOnly={
                                                         (props.user?.user_code?.is_admin || 0) === 0 &&
                                                         ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 0 &&
                                                         ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 0
                                                     }
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
                                                                     await setSelectedCustomer({
                                                                         ...selectedCustomer,
                                                                         mailing_address: {
                                                                             ...(selectedCustomer?.mailing_address || {}),
                                                                             contact_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].phone,
                                                                             mailing_contact_primary_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].type
                                                                         }
                                                                     });

                                                                     // validateMailingAddressForSaving({keyCode: 9});
                                                                     setShowMailingContactPhones(false);
                                                                     refMailingContactPhone.current.inputElement.focus();
                                                                 }
                                                                 break;

                                                             case 9: // tab
                                                                 if (showMailingContactPhones) {
                                                                     e.preventDefault();
                                                                     await setSelectedCustomer({
                                                                         ...selectedCustomer,
                                                                         mailing_address: {
                                                                             ...(selectedCustomer?.mailing_address || {}),
                                                                             contact_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].phone,
                                                                             mailing_contact_primary_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].type
                                                                         }
                                                                     });

                                                                     // validateMailingAddressForSaving({keyCode: 9});
                                                                     setShowMailingContactPhones(false);
                                                                     refMailingContactPhone.current.inputElement.focus();
                                                                 } else {
                                                                     // validateMailingAddressForSaving({keyCode: 9});
                                                                 }
                                                                 break;
                                                             default:
                                                                 break;
                                                         }
                                                     }}
                                                     onInput={(e) => {
                                                         setSelectedCustomer(selectedCustomer => {
                                                             return {
                                                                 ...selectedCustomer,
                                                                 mailing_address: {
                                                                     ...(selectedCustomer?.mailing_address || {}),
                                                                     contact_phone: e.target.value
                                                                 }
                                                             }
                                                         })
                                                     }}
                                                     onChange={(e) => {
                                                         setSelectedCustomer(selectedCustomer => {
                                                             return {
                                                                 ...selectedCustomer,
                                                                 mailing_address: {
                                                                     ...(selectedCustomer?.mailing_address || {}),
                                                                     contact_phone: e.target.value
                                                                 }
                                                             }
                                                         })
                                                     }}
                                                     value={selectedCustomer?.mailing_address?.contact_phone}
                                        />

                                        {
                                            ((selectedCustomer?.id || 0) > 0 && (selectedCustomer?.mailing_address?.id !== undefined)) &&
                                            <div
                                                className={classnames({
                                                    'selected-mailing-contact-primary-phone': true,
                                                    'pushed': (mailingContactPhoneItems.length > 1)
                                                })}>
                                                {selectedCustomer?.mailing_address?.mailing_contact_id ? (selectedCustomer?.mailing_address?.mailing_contact_primary_phone || '') : ''}
                                            </div>
                                        }

                                        {
                                            (mailingContactPhoneItems.length > 1 && ((selectedCustomer?.mailing_address?.mailing_contact_id || 0) > 0)) &&
                                            ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 1 &&
                                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 1)) &&
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
                                                             }}/>
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
                                                     style={{height: 150}}>
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
                                                                                await setSelectedCustomer({
                                                                                    ...selectedCustomer,
                                                                                    mailing_address: {
                                                                                        ...(selectedCustomer?.mailing_address || {}),
                                                                                        contact_phone: item.phone,
                                                                                        mailing_contact_primary_phone: item.type
                                                                                    }
                                                                                });

                                                                                // validateMailingAddressForSaving({keyCode: 9});
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
                                                                                    icon={faCaretRight}/>
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
                                    <input tabIndex={27 + props.tabTimes} type="text" placeholder="Ext"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 0
                                           }
                                           onInput={e => {
                                               setSelectedCustomer(selectedCustomer => {
                                                   return {
                                                       ...selectedCustomer,
                                                       mailing_address: {
                                                           ...(selectedCustomer?.mailing_address || {}),
                                                           ext: e.target.value
                                                       }
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedCustomer(selectedCustomer => {
                                                   return {
                                                       ...selectedCustomer,
                                                       mailing_address: {
                                                           ...(selectedCustomer?.mailing_address || {}),
                                                           ext: e.target.value
                                                       }
                                                   }
                                               })
                                           }}
                                           value={selectedCustomer?.mailing_address?.ext || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="select-box-container" style={{flexGrow: 1}}
                                     onMouseEnter={() => {
                                         if ((selectedCustomer?.mailing_address?.email || '') !== '') {
                                             setShowMailingContactEmailCopyBtn(true);
                                         }
                                     }}
                                     onFocus={() => {
                                         if ((selectedCustomer?.mailing_address?.email || '') !== '') {
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
                                               readOnly={
                                                   (props.user?.user_code?.is_admin || 0) === 0 &&
                                                   ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 0 &&
                                                   ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 0
                                               }
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
                                                               await setSelectedCustomer({
                                                                   ...selectedCustomer,
                                                                   mailing_address: {
                                                                       ...(selectedCustomer?.mailing_address || {}),
                                                                       email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].email,
                                                                       mailing_contact_primary_email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].type
                                                                   }
                                                               });

                                                               // validateMailingAddressForSaving({keyCode: 9});
                                                               setShowMailingContactEmails(false);
                                                               refMailingContactEmail.current.focus();
                                                           }
                                                           break;

                                                       case 9: // tab
                                                           if (showMailingContactEmails) {
                                                               e.preventDefault();
                                                               await setSelectedCustomer({
                                                                   ...selectedCustomer,
                                                                   mailing_address: {
                                                                       ...(selectedCustomer?.mailing_address || {}),
                                                                       email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].email,
                                                                       mailing_contact_primary_email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].type
                                                                   }
                                                               });

                                                               validateMailingAddressForSaving({keyCode: 9});
                                                               setShowMailingContactEmails(false);
                                                               refMailingContactEmail.current.focus();
                                                           } else {
                                                               validateMailingAddressForSaving({keyCode: 9});
                                                           }
                                                           break;

                                                       default:
                                                           break;
                                                   }
                                               }}
                                               onInput={e => {
                                                   setSelectedCustomer(selectedCustomer => {
                                                       return {
                                                           ...selectedCustomer,
                                                           mailing_address: {
                                                               ...(selectedCustomer?.mailing_address || {}),
                                                               email: e.target.value
                                                           }
                                                       }
                                                   })
                                               }}
                                               onChange={e => {
                                                   setSelectedCustomer(selectedCustomer => {
                                                       return {
                                                           ...selectedCustomer,
                                                           mailing_address: {
                                                               ...(selectedCustomer?.mailing_address || {}),
                                                               email: e.target.value
                                                           }
                                                       }
                                                   })
                                               }}
                                               value={selectedCustomer?.mailing_address?.email || ''}
                                        />

                                        {
                                            ((selectedCustomer?.id || 0) > 0 && (selectedCustomer?.mailing_address?.id !== undefined)) &&
                                            <div
                                                className={classnames({
                                                    'selected-mailing-contact-primary-email': true,
                                                    'pushed': (mailingContactEmailItems.length > 1)
                                                })}>
                                                {(selectedCustomer?.mailing_address?.mailing_contact_id || 0) > 0 ? (selectedCustomer?.mailing_address?.mailing_contact_primary_email || '') : ''}
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
                                            }}/>
                                        }

                                        {
                                            (mailingContactEmailItems.length > 1 && ((selectedCustomer?.mailing_address?.mailing_contact_id || 0) > 0)) &&
                                            ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.save || 0) === 1 &&
                                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer mailing address')?.pivot?.edit || 0) === 1)) &&
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
                                                             }}/>
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
                                                     style={{height: 150}}>
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
                                                                                await setSelectedCustomer(selectedCustomer => {
                                                                                    return {
                                                                                        ...selectedCustomer,
                                                                                        mailing_address: {
                                                                                            ...(selectedCustomer?.mailing_address || {}),
                                                                                            email: item.email,
                                                                                            mailing_contact_primary_email: item.type
                                                                                        }
                                                                                    }
                                                                                });

                                                                                validateMailingAddressForSaving({keyCode: 9});
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
                                                                                    icon={faCaretRight}/>
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

                        <div className="form-borderless-box" style={{width: '170px', marginLeft: '10px',}}>
                            <div className="form-row">
                                <div className="input-box-container grow">
                                    <input tabIndex={32 + props.tabTimes} type="text"
                                           style={{textTransform: 'uppercase'}} placeholder="Bill To"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer bill to')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer bill to')?.pivot?.edit || 0) === 0
                                           }
                                           onInput={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   bill_to_code: e.target.value
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedCustomer({
                                                   ...selectedCustomer,
                                                   bill_to_code: e.target.value
                                               })
                                           }}
                                           value={selectedCustomer?.bill_to_code || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="select-box-container grow">
                                    <div className="select-box-wrapper">
                                        <input
                                            type="text"
                                            tabIndex={33 + props.tabTimes}
                                            placeholder="Division"
                                            ref={refDivision}
                                            readOnly={
                                                (props.user?.user_code?.is_admin || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer division')?.pivot?.save || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer division')?.pivot?.edit || 0) === 0
                                            }
                                            onKeyDown={async (e) => {
                                                let key = e.keyCode || e.which;

                                                if (!props.isAdmin) {
                                                    e.preventDefault();
                                                } else {
                                                    switch (key) {
                                                        case 37:
                                                        case 38: // arrow left | arrow up
                                                            e.preventDefault();
                                                            if (divisionItems.length > 0) {
                                                                let selectedIndex = divisionItems.findIndex((item) => item.selected);

                                                                if (selectedIndex === -1) {
                                                                    await setDivisionItems(
                                                                        divisionItems.map((item, index) => {
                                                                            item.selected = index === 0;
                                                                            return item;
                                                                        })
                                                                    );
                                                                } else {
                                                                    await setDivisionItems(
                                                                        divisionItems.map((item, index) => {
                                                                            if (selectedIndex === 0) {
                                                                                item.selected =
                                                                                    index === divisionItems.length - 1;
                                                                            } else {
                                                                                item.selected =
                                                                                    index === selectedIndex - 1;
                                                                            }
                                                                            return item;
                                                                        })
                                                                    );
                                                                }

                                                                refDivisionPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains("selected")) {
                                                                        r.scrollIntoView({
                                                                            behavior: "auto",
                                                                            block: "center",
                                                                            inline: "nearest",
                                                                        });
                                                                    }
                                                                    return true;
                                                                });
                                                            } else {
                                                                axios.post(props.serverUrl + "/getDivisions").then(async (res) => {
                                                                    if (res.data.result === "OK") {
                                                                        await setDivisionItems(res.data.divisions.map((item, index) => {
                                                                            item.selected =
                                                                                (selectedCustomer?.division?.id ||
                                                                                    0) === 0
                                                                                    ? index === 0
                                                                                    : item.id ===
                                                                                    selectedCustomer.division.id;
                                                                            return item;
                                                                        }));

                                                                        refDivisionPopupItems.current.map((r, i) => {
                                                                            if (r && r.classList.contains("selected")) {
                                                                                r.scrollIntoView({
                                                                                    behavior: "auto",
                                                                                    block: "center",
                                                                                    inline: "nearest",
                                                                                });
                                                                            }
                                                                            return true;
                                                                        });
                                                                    }
                                                                }).catch(async (e) => {
                                                                    console.log("error getting divisions", e);
                                                                });
                                                            }
                                                            break;

                                                        case 39:
                                                        case 40: // arrow right | arrow down
                                                            e.preventDefault();
                                                            if (divisionItems.length > 0) {
                                                                let selectedIndex = divisionItems.findIndex((item) => item.selected);

                                                                if (selectedIndex === -1) {
                                                                    await setDivisionItems(divisionItems.map((item, index) => {
                                                                        item.selected = index === 0;
                                                                        return item;
                                                                    }));
                                                                } else {
                                                                    await setDivisionItems(divisionItems.map((item, index) => {
                                                                        if (selectedIndex === divisionItems.length - 1) {
                                                                            item.selected = index === 0;
                                                                        } else {
                                                                            item.selected = index === selectedIndex + 1;
                                                                        }
                                                                        return item;
                                                                    }));
                                                                }

                                                                refDivisionPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains("selected")) {
                                                                        r.scrollIntoView({
                                                                            behavior: "auto",
                                                                            block: "center",
                                                                            inline: "nearest",
                                                                        });
                                                                    }
                                                                    return true;
                                                                });
                                                            } else {
                                                                axios.post(props.serverUrl + "/getDivisions").then(async (res) => {
                                                                    if (res.data.result === "OK") {
                                                                        await setDivisionItems(res.data.divisions.map(
                                                                                (item, index) => {
                                                                                    item.selected = (selectedCustomer?.division?.id || 0) === 0
                                                                                            ? index === 0
                                                                                            : item.id === selectedCustomer.division.id;
                                                                                    return item;
                                                                                }
                                                                            )
                                                                        );

                                                                        refDivisionPopupItems.current.map((r, i) => {
                                                                            if (r && r.classList.contains("selected")) {
                                                                                r.scrollIntoView({
                                                                                    behavior: "auto",
                                                                                    block: "center",
                                                                                    inline: "nearest",
                                                                                });
                                                                            }
                                                                            return true;
                                                                        });
                                                                    }
                                                                }).catch(async (e) => {
                                                                    console.log("error getting divisions", e);
                                                                });
                                                            }
                                                            break;

                                                        case 27: // escape
                                                            setDivisionItems([]);
                                                            break;

                                                        case 13: // enter
                                                            if (divisionItems.length > 0 && divisionItems.findIndex((item) => item.selected) > -1) {
                                                                await setSelectedCustomer(selectedCustomer => {
                                                                    return {
                                                                        ...selectedCustomer,
                                                                        division: divisionItems[divisionItems.findIndex((item) => item.selected)],
                                                                        division_id: divisionItems[divisionItems.findIndex((item) => item.selected)].id
                                                                    }
                                                                })

                                                                validateCustomerForSaving({keyCode: 9});
                                                                setDivisionItems([]);
                                                                refDivision.current.focus();
                                                            }
                                                            break;

                                                        case 9: // tab
                                                            if (divisionItems.length > 0) {
                                                                e.preventDefault();
                                                                await setSelectedCustomer(selectedCustomer => {
                                                                    return {
                                                                        ...selectedCustomer,
                                                                        division: divisionItems[divisionItems.findIndex((item) => item.selected)],
                                                                        division_id: divisionItems[divisionItems.findIndex((item) => item.selected)].id
                                                                    }
                                                                })

                                                                validateCustomerForSaving({keyCode: 9});
                                                                setDivisionItems([]);
                                                                refDivision.current.focus();
                                                            }
                                                            break;

                                                        default:
                                                            break;
                                                    }
                                                }
                                            }}
                                            onBlur={async () => {
                                                if ((selectedCustomer?.division?.id || 0) === 0) {
                                                    await setSelectedCustomer(selectedCustomer => {
                                                        return {
                                                            ...selectedCustomer,
                                                            division: {},
                                                            division_id: null
                                                        }
                                                    })
                                                }
                                            }}
                                            onInput={async (e) => {
                                                let division = selectedCustomer?.division || {};

                                                division.id = 0;
                                                division.name = e.target.value;

                                                await setSelectedCustomer(selectedCustomer => {
                                                    return {
                                                        ...selectedCustomer,
                                                        division: division,
                                                        division_id: division.id
                                                    }
                                                })

                                                if (e.target.value.trim() === "") {
                                                    setDivisionItems([]);
                                                } else {
                                                    axios.post(props.serverUrl + "/getDivisions", {name: e.target.value.trim()}).then(async (res) => {
                                                        if (res.data.result === "OK") {
                                                            await setDivisionItems(
                                                                res.data.divisions.map((item, index) => {
                                                                    item.selected = (selectedCustomer?.division?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedCustomer.division.id;
                                                                    return item;
                                                                })
                                                            );
                                                        }
                                                    }).catch(async (e) => {
                                                        console.log("error getting divisions", e);
                                                    });
                                                }
                                            }}
                                            onChange={async (e) => {
                                                let division = selectedCustomer?.division || {};

                                                division.id = 0;
                                                division.name = e.target.value;

                                                await setSelectedCustomer(selectedCustomer => {
                                                    return {
                                                        ...selectedCustomer,
                                                        division: division,
                                                        division_id: division.id
                                                    }
                                                })
                                            }}
                                            value={selectedCustomer?.division?.name || ""}
                                        />
                                        {
                                            props.isAdmin &&
                                            <FontAwesomeIcon
                                                className="dropdown-button"
                                                icon={faCaretDown}
                                                style={{
                                                    pointerEvents: props.isAdmin ? 'all' : 'none'
                                                }}
                                                onClick={() => {
                                                    if (divisionItems.length > 0) {
                                                        setDivisionItems([]);
                                                    } else {
                                                        if ((selectedCustomer?.division?.id || 0) === 0 && (selectedCustomer?.division?.name || "") !== "") {
                                                            axios.post(props.serverUrl + "/getDivisions", {name: selectedCustomer.division.name}).then(async (res) => {
                                                                if (res.data.result === "OK") {
                                                                    await setDivisionItems(res.data.divisions.map((item, index) => {
                                                                        item.selected = (selectedCustomer?.division?.id || 0) === 0
                                                                            ? index === 0
                                                                            : item.id === selectedCustomer.division.id;
                                                                        return item;
                                                                    }));

                                                                    refDivisionPopupItems.current.map((r, i) => {
                                                                        if (r && r.classList.contains("selected")) {
                                                                            r.scrollIntoView({
                                                                                behavior: "auto",
                                                                                block: "center",
                                                                                inline: "nearest",
                                                                            });
                                                                        }
                                                                        return true;
                                                                    });
                                                                }
                                                            }).catch(async (e) => {
                                                                console.log("error getting divisions", e);
                                                            });
                                                        } else {
                                                            axios.post(props.serverUrl + "/getDivisions").then(async (res) => {
                                                                if (res.data.result === "OK") {
                                                                    await setDivisionItems(res.data.divisions.map((item, index) => {
                                                                        item.selected = (selectedCustomer?.division?.id || 0) === 0
                                                                            ? index === 0
                                                                            : item.id === selectedCustomer.division.id;
                                                                        return item;
                                                                    }));

                                                                    refDivisionPopupItems.current.map((r, i) => {
                                                                        if (r && r.classList.contains("selected")) {
                                                                            r.scrollIntoView({
                                                                                behavior: "auto",
                                                                                block: "center",
                                                                                inline: "nearest",
                                                                            });
                                                                        }
                                                                        return true;
                                                                    });
                                                                }
                                                            }).catch(async (e) => {
                                                                console.log("error getting divisions", e);
                                                            });
                                                        }
                                                    }

                                                    refDivision.current.focus();
                                                }}
                                            />
                                        }
                                    </div>

                                    {
                                        divisionTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-division"
                                                style={{
                                                    ...style,
                                                    left: "-50%",
                                                    display: "block",
                                                }}
                                                ref={refDivisionDropDown}>

                                                <div className="mochi-contextual-popup vertical below"
                                                     style={{height: 150}}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {divisionItems.map((item, index) => {
                                                                const mochiItemClasses = classnames({
                                                                    "mochi-item": true,
                                                                    selected: item.selected,
                                                                });

                                                                const searchValue = (selectedCustomer?.division?.id || 0) === 0 && (selectedCustomer?.division?.name || "") !== ""
                                                                    ? selectedCustomer?.division?.name
                                                                    : undefined;

                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className={mochiItemClasses}
                                                                        id={item.id}
                                                                        onClick={() => {
                                                                            setSelectedCustomer(selectedCustomer => {
                                                                                return {
                                                                                    ...selectedCustomer,
                                                                                    division: item,
                                                                                    division_id: item.id
                                                                                }
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                validateCustomerForSaving({keyCode: 9});
                                                                                setDivisionItems([]);
                                                                                refDivision.current.focus();
                                                                            }, 0);
                                                                        }}
                                                                        ref={(ref) => refDivisionPopupItems.current.push(ref)}
                                                                    >
                                                                        {searchValue === undefined ? (item.name) : (
                                                                            <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                        )}
                                                                        {item.selected && (
                                                                            <FontAwesomeIcon
                                                                                className="dropdown-selected"
                                                                                icon={faCaretRight}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
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
                                    <input tabIndex={34 + props.tabTimes} type="text" placeholder="Agent Code"
                                           style={{textTransform: 'uppercase'}}
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer agent code')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer agent code')?.pivot?.edit || 0) === 0
                                           }
                                           onKeyDown={e => {
                                               if (props.isAdmin){
                                                   validateCustomerForSaving(e);
                                               }
                                           }}
                                           onInput={e => {
                                               setSelectedCustomer(selectedCustomer => {
                                                   return {
                                                       ...selectedCustomer,
                                                       agent_code: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedCustomer(selectedCustomer => {
                                                   return {
                                                       ...selectedCustomer,
                                                       agent_code: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedCustomer?.agent_code || ''}
                                    />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="select-box-container grow">
                                    <div className="select-box-wrapper">
                                        <input
                                            type="text"
                                            readOnly={
                                                (props.user?.user_code?.is_admin || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer salesman')?.pivot?.save || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer salesman')?.pivot?.edit || 0) === 0
                                            }
                                            tabIndex={35 + props.tabTimes}
                                            placeholder="Salesman"
                                            ref={refSalesman}
                                            onKeyDown={async (e) => {
                                                let key = e.keyCode || e.which;

                                                if (!props.isAdmin) {
                                                    e.preventDefault();
                                                } else {
                                                    switch (key) {
                                                        case 37:
                                                        case 38: // arrow left | arrow up
                                                            e.preventDefault();
                                                            if (salesmanItems.length > 0) {
                                                                let selectedIndex = salesmanItems.findIndex((item) => item.selected);

                                                                if (selectedIndex === -1) {
                                                                    await setSalesmanItems(
                                                                        salesmanItems.map((item, index) => {
                                                                            item.selected = index === 0;
                                                                            return item;
                                                                        })
                                                                    );
                                                                } else {
                                                                    await setSalesmanItems(
                                                                        salesmanItems.map((item, index) => {
                                                                            if (selectedIndex === 0) {
                                                                                item.selected =
                                                                                    index === salesmanItems.length - 1;
                                                                            } else {
                                                                                item.selected =
                                                                                    index === selectedIndex - 1;
                                                                            }
                                                                            return item;
                                                                        })
                                                                    );
                                                                }

                                                                refSalesmanPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains("selected")) {
                                                                        r.scrollIntoView({
                                                                            behavior: "auto",
                                                                            block: "center",
                                                                            inline: "nearest",
                                                                        });
                                                                    }
                                                                    return true;
                                                                });
                                                            } else {
                                                                axios.post(props.serverUrl + "/getSalesmen").then(async (res) => {
                                                                    if (res.data.result === "OK") {
                                                                        await setSalesmanItems(res.data.salesmen.map((item, index) => {
                                                                            item.selected =
                                                                                (selectedCustomer?.salesman?.id ||
                                                                                    0) === 0
                                                                                    ? index === 0
                                                                                    : item.id ===
                                                                                    selectedCustomer.salesman.id;
                                                                            return item;
                                                                        }));

                                                                        refSalesmanPopupItems.current.map((r, i) => {
                                                                            if (r && r.classList.contains("selected")) {
                                                                                r.scrollIntoView({
                                                                                    behavior: "auto",
                                                                                    block: "center",
                                                                                    inline: "nearest",
                                                                                });
                                                                            }
                                                                            return true;
                                                                        });
                                                                    }
                                                                }).catch(async (e) => {
                                                                    console.log("error getting salesmen", e);
                                                                });
                                                            }
                                                            break;

                                                        case 39:
                                                        case 40: // arrow right | arrow down
                                                            e.preventDefault();
                                                            if (salesmanItems.length > 0) {
                                                                let selectedIndex = salesmanItems.findIndex((item) => item.selected);

                                                                if (selectedIndex === -1) {
                                                                    await setSalesmanItems(salesmanItems.map((item, index) => {
                                                                        item.selected = index === 0;
                                                                        return item;
                                                                    }));
                                                                } else {
                                                                    await setSalesmanItems(salesmanItems.map((item, index) => {
                                                                        if (selectedIndex === salesmanItems.length - 1) {
                                                                            item.selected = index === 0;
                                                                        } else {
                                                                            item.selected = index === selectedIndex + 1;
                                                                        }
                                                                        return item;
                                                                    }));
                                                                }

                                                                refSalesmanPopupItems.current.map((r, i) => {
                                                                    if (r && r.classList.contains("selected")) {
                                                                        r.scrollIntoView({
                                                                            behavior: "auto",
                                                                            block: "center",
                                                                            inline: "nearest",
                                                                        });
                                                                    }
                                                                    return true;
                                                                });
                                                            } else {
                                                                axios.post(props.serverUrl + "/getSalesmen").then(async (res) => {
                                                                    if (res.data.result === "OK") {
                                                                        await setSalesmanItems(res.data.salesmen.map(
                                                                                (item, index) => {
                                                                                    item.selected = (selectedCustomer?.salesman?.id || 0) === 0
                                                                                        ? index === 0
                                                                                        : item.id === selectedCustomer.salesman.id;
                                                                                    return item;
                                                                                }
                                                                            )
                                                                        );

                                                                        refSalesmanPopupItems.current.map((r, i) => {
                                                                            if (r && r.classList.contains("selected")) {
                                                                                r.scrollIntoView({
                                                                                    behavior: "auto",
                                                                                    block: "center",
                                                                                    inline: "nearest",
                                                                                });
                                                                            }
                                                                            return true;
                                                                        });
                                                                    }
                                                                }).catch(async (e) => {
                                                                    console.log("error getting salesmen", e);
                                                                });
                                                            }
                                                            break;

                                                        case 27: // escape
                                                            setSalesmanItems([]);
                                                            break;

                                                        case 13: // enter
                                                            if (salesmanItems.length > 0 && salesmanItems.findIndex((item) => item.selected) > -1) {
                                                                await setSelectedCustomer(selectedCustomer => {
                                                                    return {
                                                                        ...selectedCustomer,
                                                                        salesman: salesmanItems[salesmanItems.findIndex((item) => item.selected)],
                                                                        salesman_id: salesmanItems[salesmanItems.findIndex((item) => item.selected)].id
                                                                    }
                                                                })

                                                                validateCustomerForSaving({keyCode: 9});
                                                                setSalesmanItems([]);
                                                                refSalesman.current.focus();
                                                            }
                                                            break;

                                                        case 9: // tab
                                                            if (salesmanItems.length > 0) {
                                                                e.preventDefault();
                                                                await setSelectedCustomer(selectedCustomer => {
                                                                    return {
                                                                        ...selectedCustomer,
                                                                        salesman: salesmanItems[salesmanItems.findIndex((item) => item.selected)],
                                                                        salesman_id: salesmanItems[salesmanItems.findIndex((item) => item.selected)].id
                                                                    }
                                                                })

                                                                validateCustomerForSaving({keyCode: 9});
                                                                setSalesmanItems([]);
                                                                refSalesman.current.focus();
                                                            }
                                                            break;

                                                        default:
                                                            break;
                                                    }
                                                }
                                            }}
                                            onBlur={async () => {
                                                if ((selectedCustomer?.salesman?.id || 0) === 0) {
                                                    await setSelectedCustomer(selectedCustomer => {
                                                        return {
                                                            ...selectedCustomer,
                                                            salesman: {},
                                                            salesman_id: null
                                                        }
                                                    })
                                                }
                                            }}
                                            onInput={async (e) => {
                                                let salesman = selectedCustomer?.salesman || {};

                                                salesman.id = 0;
                                                salesman.name = e.target.value;

                                                await setSelectedCustomer(selectedCustomer => {
                                                    return {
                                                        ...selectedCustomer,
                                                        salesman: salesman,
                                                        salesman_id: salesman.id
                                                    }
                                                })

                                                if (e.target.value.trim() === "") {
                                                    setSalesmanItems([]);
                                                } else {
                                                    axios.post(props.serverUrl + "/getSalesmen", {name: e.target.value.trim()}).then(async (res) => {
                                                        if (res.data.result === "OK") {
                                                            await setSalesmanItems(
                                                                res.data.salesmen.map((item, index) => {
                                                                    item.selected = (selectedCustomer?.salesman?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedCustomer.salesman.id;
                                                                    return item;
                                                                })
                                                            );
                                                        }
                                                    }).catch(async (e) => {
                                                        console.log("error getting salesmen", e);
                                                    });
                                                }
                                            }}
                                            onChange={async (e) => {
                                                let salesman = selectedCustomer?.salesman || {};

                                                salesman.id = 0;
                                                salesman.name = e.target.value;

                                                await setSelectedCustomer(selectedCustomer => {
                                                    return {
                                                        ...selectedCustomer,
                                                        salesman: salesman,
                                                        salesman_id: salesman.id
                                                    }
                                                })
                                            }}
                                            value={selectedCustomer?.salesman?.name || ""}
                                        />
                                        {
                                            props.isAdmin &&
                                            <FontAwesomeIcon
                                                className="dropdown-button"
                                                icon={faCaretDown}
                                                style={{
                                                    pointerEvents: props.isAdmin ? 'all' : 'none'
                                                }}
                                                onClick={() => {
                                                    if (salesmanItems.length > 0) {
                                                        setSalesmanItems([]);
                                                    } else {
                                                        if ((selectedCustomer?.salesman?.id || 0) === 0 && (selectedCustomer?.salesman?.name || "") !== "") {
                                                            axios.post(props.serverUrl + "/getSalesmen", {name: selectedCustomer.salesman.name}).then(async (res) => {
                                                                if (res.data.result === "OK") {
                                                                    await setSalesmanItems(res.data.salesmen.map((item, index) => {
                                                                        item.selected = (selectedCustomer?.salesman?.id || 0) === 0
                                                                            ? index === 0
                                                                            : item.id === selectedCustomer.salesman.id;
                                                                        return item;
                                                                    }));

                                                                    refSalesmanPopupItems.current.map((r, i) => {
                                                                        if (r && r.classList.contains("selected")) {
                                                                            r.scrollIntoView({
                                                                                behavior: "auto",
                                                                                block: "center",
                                                                                inline: "nearest",
                                                                            });
                                                                        }
                                                                        return true;
                                                                    });
                                                                }
                                                            }).catch(async (e) => {
                                                                console.log("error getting salesmen", e);
                                                            });
                                                        } else {
                                                            axios.post(props.serverUrl + "/getSalesmen").then(async (res) => {
                                                                if (res.data.result === "OK") {
                                                                    await setSalesmanItems(res.data.salesmen.map((item, index) => {
                                                                        item.selected = (selectedCustomer?.salesman?.id || 0) === 0
                                                                            ? index === 0
                                                                            : item.id === selectedCustomer.salesman.id;
                                                                        return item;
                                                                    }));

                                                                    refSalesmanPopupItems.current.map((r, i) => {
                                                                        if (r && r.classList.contains("selected")) {
                                                                            r.scrollIntoView({
                                                                                behavior: "auto",
                                                                                block: "center",
                                                                                inline: "nearest",
                                                                            });
                                                                        }
                                                                        return true;
                                                                    });
                                                                }
                                                            }).catch(async (e) => {
                                                                console.log("error getting salesmen", e);
                                                            });
                                                        }
                                                    }

                                                    refSalesman.current.focus();
                                                }}
                                            />
                                        }
                                    </div>

                                    {
                                        salesmanTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-salesman"
                                                style={{
                                                    ...style,
                                                    left: "-50%",
                                                    display: "block",
                                                }}
                                                ref={refSalesmanDropDown}>

                                                <div className="mochi-contextual-popup vertical below"
                                                     style={{height: 150}}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {salesmanItems.map((item, index) => {
                                                                const mochiItemClasses = classnames({
                                                                    "mochi-item": true,
                                                                    selected: item.selected,
                                                                });

                                                                const searchValue = (selectedCustomer?.salesman?.id || 0) === 0 && (selectedCustomer?.salesman?.name || "") !== ""
                                                                    ? selectedCustomer?.salesman?.name
                                                                    : undefined;

                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className={mochiItemClasses}
                                                                        id={item.id}
                                                                        onClick={() => {
                                                                            setSelectedCustomer(selectedCustomer => {
                                                                                return {
                                                                                    ...selectedCustomer,
                                                                                    salesman: item,
                                                                                    salesman_id: item.id
                                                                                }
                                                                            })

                                                                            window.setTimeout(() => {
                                                                                validateCustomerForSaving({keyCode: 9});
                                                                                setSalesmanItems([]);
                                                                                refSalesman.current.focus();
                                                                            }, 0);
                                                                        }}
                                                                        ref={(ref) => refSalesmanPopupItems.current.push(ref)}
                                                                    >
                                                                        {searchValue === undefined ? (item.name) : (
                                                                            <Highlighter
                                                                                highlightClassName="mochi-item-highlight-text"
                                                                                searchWords={[searchValue]}
                                                                                autoEscape={true}
                                                                                textToHighlight={item.name}
                                                                            />
                                                                        )}
                                                                        {item.selected && (
                                                                            <FontAwesomeIcon
                                                                                className="dropdown-selected"
                                                                                icon={faCaretRight}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
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
                                    <input tabIndex={36 + props.tabTimes} type="text" placeholder="FID"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer fid')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer fid')?.pivot?.edit || 0) === 0
                                           }
                                           onKeyDown={validateCustomerForSaving}
                                           onInput={e => {
                                               setSelectedCustomer(selectedCustomer => {
                                                   return {
                                                       ...selectedCustomer,
                                                       fid: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedCustomer(selectedCustomer => {
                                                   return {
                                                       ...selectedCustomer,
                                                       fid: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedCustomer?.fid || ''}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fields-container-col">
                        <div className="form-bordered-box" style={{justifyContent: 'space-between'}}>
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Credit</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="form-row">
                                <div className="select-box-container" style={{position: 'relative', flexGrow: 1}}>
                                    <div className="select-box-wrapper">
                                        <input type="text" placeholder="Invoicing Terms"
                                               readOnly={
                                                   (props.user?.user_code?.is_admin || 0) === 0 &&
                                                   ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer credit')?.pivot?.save || 0) === 0 &&
                                                   ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer credit')?.pivot?.edit || 0) === 0
                                               }
                                               tabIndex={37 + props.tabTimes}
                                               ref={refTerms}
                                               onKeyDown={async (e) => {
                                                   let key = e.keyCode || e.which;
                                                   if (!props.isAdmin) {
                                                       e.preventDefault();
                                                   } else {
                                                       switch (key) {
                                                           case 37:
                                                           case 38: // arrow left | arrow up
                                                               e.preventDefault();
                                                               if (termsItems.length > 0) {
                                                                   let selectedIndex = termsItems.findIndex(item => item.selected);

                                                                   if (selectedIndex === -1) {
                                                                       await setTermsItems(termsItems.map((item, index) => {
                                                                           item.selected = index === 0;
                                                                           return item;
                                                                       }))
                                                                   } else {
                                                                       await setTermsItems(termsItems.map((item, index) => {
                                                                           if (selectedIndex === 0) {
                                                                               item.selected = index === (termsItems.length - 1);
                                                                           } else {
                                                                               item.selected = index === (selectedIndex - 1)
                                                                           }
                                                                           return item;
                                                                       }))
                                                                   }

                                                                   refTermsPopupItems.current.map((r, i) => {
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
                                                                   axios.post(props.serverUrl + '/getTerms').then(async res => {
                                                                       if (res.data.result === 'OK') {
                                                                           await setTermsItems(res.data.terms.map((item, index) => {
                                                                               item.selected = (selectedCustomer?.term?.id || 0) === 0
                                                                                   ? index === 0
                                                                                   : item.id === selectedCustomer?.term?.id
                                                                               return item;
                                                                           }))

                                                                           refTermsPopupItems.current.map((r, i) => {
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
                                                                       console.log('error getting terms', e);
                                                                   })
                                                               }
                                                               break;

                                                           case 39:
                                                           case 40: // arrow right | arrow down
                                                               e.preventDefault();
                                                               if (termsItems.length > 0) {
                                                                   let selectedIndex = termsItems.findIndex(item => item.selected);

                                                                   if (selectedIndex === -1) {
                                                                       await setTermsItems(termsItems.map((item, index) => {
                                                                           item.selected = index === 0;
                                                                           return item;
                                                                       }))
                                                                   } else {
                                                                       await setTermsItems(termsItems.map((item, index) => {
                                                                           if (selectedIndex === (termsItems.length - 1)) {
                                                                               item.selected = index === 0;
                                                                           } else {
                                                                               item.selected = index === (selectedIndex + 1)
                                                                           }
                                                                           return item;
                                                                       }))
                                                                   }

                                                                   refTermsPopupItems.current.map((r, i) => {
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
                                                                   axios.post(props.serverUrl + '/getTerms').then(async res => {
                                                                       if (res.data.result === 'OK') {
                                                                           await setTermsItems(res.data.terms.map((item, index) => {
                                                                               item.selected = (selectedCustomer?.term?.id || 0) === 0
                                                                                   ? index === 0
                                                                                   : item.id === selectedCustomer?.term?.id
                                                                               return item;
                                                                           }))

                                                                           refTermsPopupItems.current.map((r, i) => {
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
                                                                       console.log('error getting terms', e);
                                                                   })
                                                               }
                                                               break;

                                                           case 27: // escape
                                                               setTermsItems([]);
                                                               break;

                                                           case 13: // enter
                                                               if (termsItems.length > 0 && termsItems.findIndex(item => item.selected) > -1) {
                                                                   setSelectedCustomer(selectedCustomer => {
                                                                       return {
                                                                           ...selectedCustomer,
                                                                           term: termsItems[termsItems.findIndex(item => item.selected)],
                                                                           term_id: termsItems[termsItems.findIndex(item => item.selected)].id
                                                                       }
                                                                   })

                                                                   validateCustomerForSaving({keyCode: 9});
                                                                   setTermsItems([]);
                                                                   refTerms.current.focus();
                                                               }
                                                               break;

                                                           case 9: // tab
                                                               if (termsItems.length > 0) {
                                                                   e.preventDefault();
                                                                   setSelectedCustomer(selectedCustomer => {
                                                                       return {
                                                                           ...selectedCustomer,
                                                                           term: termsItems[termsItems.findIndex(item => item.selected)],
                                                                           term_id: termsItems[termsItems.findIndex(item => item.selected)].id
                                                                       }
                                                                   })

                                                                   validateCustomerForSaving({keyCode: 9});
                                                                   setTermsItems([]);
                                                                   refTerms.current.focus();
                                                               }
                                                               break;

                                                           default:
                                                               break;
                                                       }
                                                   }
                                               }}
                                               onBlur={async () => {
                                                   if ((selectedCustomer?.term?.id || 0) === 0) {
                                                       await setSelectedCustomer(selectedCustomer => {
                                                           return {
                                                               ...selectedCustomer,
                                                               term: {},
                                                               term_id: null
                                                           }
                                                       })
                                                   }
                                               }}
                                               onInput={async (e) => {
                                                   let term = selectedCustomer?.division || {};

                                                   term.id = 0;
                                                   term.name = e.target.value;

                                                   await setSelectedCustomer(selectedCustomer => {
                                                       return {
                                                           ...selectedCustomer,
                                                           term: term,
                                                           term_id: term.id
                                                       }
                                                   })

                                                   if (e.target.value.trim() === '') {
                                                       setTermsItems([]);
                                                   } else {
                                                       axios.post(props.serverUrl + '/getTerms', {name: e.target.value.trim()}).then(async res => {
                                                           if (res.data.result === 'OK') {
                                                               await setTermsItems(res.data.terms.map((item, index) => {
                                                                   item.selected = (selectedCustomer?.term?.id || 0) === 0
                                                                       ? index === 0
                                                                       : item.id === selectedCustomer?.term?.id
                                                                   return item;
                                                               }))
                                                           }
                                                       }).catch(async e => {
                                                           console.log('error getting terms', e);
                                                       })
                                                   }
                                               }}
                                               onChange={async (e) => {
                                                   let term = selectedCustomer?.division || {};

                                                   term.id = 0;
                                                   term.name = e.target.value;

                                                   await setSelectedCustomer(selectedCustomer => {
                                                       return {
                                                           ...selectedCustomer,
                                                           term: term,
                                                           term_id: term.id
                                                       }
                                                   })
                                               }}
                                               value={selectedCustomer?.term?.name || ''}
                                        />
                                        {
                                            props.isAdmin &&
                                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                                             onClick={(e) => {
                                                                 if (termsItems.length > 0) {
                                                                     setTermsItems([]);
                                                                 } else {
                                                                     if ((selectedCustomer?.term?.id || 0) === 0 && (selectedCustomer?.term?.name || '') !== '') {
                                                                         axios.post(props.serverUrl + '/getTerms', {
                                                                             name: selectedCustomer?.term?.name
                                                                         }).then(async res => {
                                                                             if (res.data.result === 'OK') {
                                                                                 await setTermsItems(res.data.terms.map((item, index) => {
                                                                                     item.selected = (selectedCustomer?.term?.id || 0) === 0
                                                                                         ? index === 0
                                                                                         : item.id === selectedCustomer?.term?.id
                                                                                     return item;
                                                                                 }))

                                                                                 refTermsPopupItems.current.map((r, i) => {
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
                                                                             console.log('error getting terms', e);
                                                                         })
                                                                     } else {
                                                                         axios.post(props.serverUrl + '/getTerms').then(async res => {
                                                                             if (res.data.result === 'OK') {
                                                                                 await setTermsItems(res.data.terms.map((item, index) => {
                                                                                     item.selected = (selectedCustomer?.term?.id || 0) === 0
                                                                                         ? index === 0
                                                                                         : item.id === selectedCustomer?.term?.id
                                                                                     return item;
                                                                                 }))

                                                                                 refTermsPopupItems.current.map((r, i) => {
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
                                                                             console.log('error getting terms', e);
                                                                         })
                                                                     }
                                                                 }

                                                                 refTerms.current.focus();
                                                             }}/>
                                        }
                                    </div>
                                    {
                                        termsTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-terms"
                                                style={{
                                                    ...style,
                                                    left: "-50%",
                                                    display: "block",
                                                }}
                                                ref={refTermsDropDown}
                                            >
                                                <div className="mochi-contextual-popup vertical below"
                                                     style={{height: 150}}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {
                                                                termsItems.map((item, index) => {
                                                                    const mochiItemClasses = classnames({
                                                                        'mochi-item': true,
                                                                        'selected': item.selected
                                                                    });

                                                                    const searchValue = (selectedCustomer?.term?.id || 0) === 0 && (selectedCustomer?.term?.name || '') !== ''
                                                                        ? selectedCustomer?.term?.name : undefined;

                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={mochiItemClasses}
                                                                            id={item.id}
                                                                            onClick={() => {
                                                                                setSelectedCustomer(selectedCustomer => {
                                                                                    return {
                                                                                        ...selectedCustomer,
                                                                                        term: item,
                                                                                        term_id: item.id
                                                                                    }
                                                                                })

                                                                                window.setTimeout(() => {
                                                                                    validateCustomerForSaving({keyCode: 9});
                                                                                    setTermsItems([]);
                                                                                    refTerms.current.focus();
                                                                                }, 0);
                                                                            }}
                                                                            ref={ref => refTermsPopupItems.current.push(ref)}
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
                                                                                <FontAwesomeIcon
                                                                                    className="dropdown-selected"
                                                                                    icon={faCaretRight}/>
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
                                <div className="input-box-container grow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Credit Limit $</div>
                                    <MaskedInput
                                        className={classnames({
                                            'disabled': !props.isAdmin
                                        })}
                                        readOnly={
                                            (props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer division')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer division')?.pivot?.edit || 0) === 0
                                        }
                                        style={{ textAlign: 'right', fontWeight: 'bold' }}
                                        mask={numberMask}
                                        type="text"
                                        guide={false}
                                        value={selectedCustomer?.credit_limit_total || 0}
                                        onKeyDown={(e) => {
                                            if (props.isAdmin){
                                                validateCustomerForSaving(e)
                                            }
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === '.') {
                                                if (e.target.value.includes('.')) {
                                                    e.preventDefault();
                                                }
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (e.target.value.toString() !== '') {
                                                setSelectedCustomer({
                                                    ...selectedCustomer,
                                                    credit_limit_total: e.target.value
                                                    // total_charges: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(e.target.value.toString().replace(',', '')))
                                                })
                                            }
                                        }}
                                        onInput={(e) => {
                                            setSelectedCustomer({
                                                ...selectedCustomer,
                                                credit_limit_total: e.target.value
                                            })
                                        }}
                                        onChange={(e) => {
                                            setSelectedCustomer({
                                                ...selectedCustomer,
                                                credit_limit_total: e.target.value
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="input-box-container grow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Credit Ordered $</div>
                                    <MaskedInput
                                        className={classnames({
                                            'disabled': true
                                        })}
                                        readOnly={true}
                                        style={{ textAlign: 'right', fontWeight: 'bold' }}
                                        mask={numberMask}
                                        type="text"
                                        guide={false}
                                        value={selectedCustomer?.credit_ordered || 0}
                                    />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="input-box-container grow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Credit Invoiced $</div>
                                    <MaskedInput
                                        className={classnames({
                                            'disabled': true
                                        })}
                                        readOnly={true}
                                        style={{ textAlign: 'right', fontWeight: 'bold' }}
                                        mask={numberMask}
                                        type="text"
                                        guide={false}
                                        value={selectedCustomer?.credit_invoiced || 0}
                                    />
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="input-box-container grow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>Available Credit $</div>
                                    <MaskedInput
                                        className={classnames({
                                            'disabled': true
                                        })}
                                        readOnly={true}
                                        style={{ textAlign: 'right', fontWeight: 'bold' }}
                                        mask={numberMask}
                                        type="text"
                                        guide={false}
                                        value={Number((selectedCustomer?.credit_limit_total || '').toString().replace(',','')) - (selectedCustomer?.credit_ordered || 0) - (selectedCustomer?.credit_invoiced || 0)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="fields-container-row">
                    <div className="fields-container-col">
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Contacts</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div className={
                                       ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.edit || 0) === 0)
                                        ? 'mochi-button disabled' : 'mochi-button'
                                    } onClick={async () => {
                                        if (selectedCustomer?.id === undefined) {
                                            window.alert('You must select a customer first!');
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
                                                savingContactUrl='/saveContact'
                                                deletingContactUrl='/deleteContact'
                                                uploadAvatarUrl='/uploadAvatar'
                                                removeAvatarUrl='/removeAvatar'
                                                permissionName='customer contacts'
                                                origin={props.origin}
                                                owner='customer'
                                                openPanel={props.openPanel}
                                                closePanel={props.closePanel}
                                                componentId={moment().format('x')}

                                                contactSearchCustomer={{
                                                    ...selectedCustomer,
                                                    selectedContact: {
                                                        ...selectedContact,
                                                        address1: (selectedCustomer?.address1 || '').toLowerCase() === (selectedContact?.address1 || '').toLowerCase() ? (selectedCustomer?.address1 || '') : (selectedContact?.address1 || ''),
                                                        address2: (selectedCustomer?.address2 || '').toLowerCase() === (selectedContact?.address2 || '').toLowerCase() ? (selectedCustomer?.address2 || '') : (selectedContact?.address2 || ''),
                                                        city: (selectedCustomer?.city || '').toLowerCase() === (selectedContact?.city || '').toLowerCase() ? (selectedCustomer?.city || '') : (selectedContact?.city || ''),
                                                        state: (selectedCustomer?.state || '').toLowerCase() === (selectedContact?.state || '').toLowerCase() ? (selectedCustomer?.state || '') : (selectedContact?.state || ''),
                                                        zip_code: (selectedCustomer?.zip || '').toLowerCase() === (selectedContact?.zip_code || '').toLowerCase() ? (selectedCustomer?.zip || '') : (selectedContact?.zip_code || ''),
                                                    }
                                                }}
                                            />
                                        }

                                        props.openPanel(panel, props.origin);
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">More</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className={
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.save || 0) === 0)
                                            ? 'mochi-button disabled' : 'mochi-button'
                                    } onClick={() => {
                                        if (selectedCustomer?.id === undefined) {
                                            window.alert('You must select a customer first!');
                                            return;
                                        }

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
                                                permissionName='customer contacts'
                                                origin={props.origin}
                                                owner='customer'
                                                isEditingContact={true}
                                                openPanel={props.openPanel}
                                                closePanel={props.closePanel}
                                                componentId={moment().format('x')}

                                                contactSearchCustomer={{
                                                    ...selectedCustomer,
                                                    selectedContact: {id: 0, customer_id: selectedCustomer?.id}
                                                }}
                                            />
                                        }

                                        props.openPanel(panel, props.origin);
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Add Contact</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className="mochi-button" onClick={() => {
                                        setSelectedContact({});
                                        refCustomerContactFirstName.current.focus();
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
                                    <input tabIndex={12 + props.tabTimes} type="text" placeholder="First Name"
                                           ref={refCustomerContactFirstName}
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.edit || 0) === 0
                                           }
                                           onChange={e => {
                                               setSelectedContact({...selectedContact, first_name: e.target.value})
                                           }}
                                           value={selectedContact.first_name || ''}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-box-container grow">
                                    <input tabIndex={13 + props.tabTimes} type="text" placeholder="Last Name"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.edit || 0) === 0
                                           }
                                           onChange={e => setSelectedContact({
                                               ...selectedContact,
                                               last_name: e.target.value
                                           })}
                                           value={selectedContact.last_name || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="select-box-container" style={{width: '50%'}}>
                                    <div className="select-box-wrapper">
                                        <MaskedInput tabIndex={14 + props.tabTimes}
                                                     readOnly={
                                                         (props.user?.user_code?.is_admin || 0) === 0 &&
                                                         ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.save || 0) === 0 &&
                                                         ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.edit || 0) === 0
                                                     }
                                                     mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                     guide={true}
                                                     type="text"
                                                     placeholder="Phone"
                                                     ref={refCustomerContactPhone}
                                                     onKeyDown={async (e) => {
                                                         let key = e.keyCode || e.which;

                                                         switch (key) {
                                                             case 37:
                                                             case 38: // arrow left | arrow up
                                                                 e.preventDefault();
                                                                 if (showCustomerContactPhones) {
                                                                     let selectedIndex = customerContactPhoneItems.findIndex(item => item.selected);

                                                                     if (selectedIndex === -1) {
                                                                         await setCustomerContactPhoneItems(customerContactPhoneItems.map((item, index) => {
                                                                             item.selected = index === 0;
                                                                             return item;
                                                                         }))
                                                                     } else {
                                                                         await setCustomerContactPhoneItems(customerContactPhoneItems.map((item, index) => {
                                                                             if (selectedIndex === 0) {
                                                                                 item.selected = index === (customerContactPhoneItems.length - 1);
                                                                             } else {
                                                                                 item.selected = index === (selectedIndex - 1)
                                                                             }
                                                                             return item;
                                                                         }))
                                                                     }

                                                                     refCustomerContactPhonePopupItems.current.map((r, i) => {
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
                                                                     if (customerContactPhoneItems.length > 1) {
                                                                         await setCustomerContactPhoneItems(customerContactPhoneItems.map((item, index) => {
                                                                             item.selected = item.type === (selectedContact?.primary_phone || '')
                                                                             return item;
                                                                         }))

                                                                         setShowCustomerContactPhones(true);

                                                                         refCustomerContactPhonePopupItems.current.map((r, i) => {
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
                                                                 if (showCustomerContactPhones) {
                                                                     let selectedIndex = customerContactPhoneItems.findIndex(item => item.selected);

                                                                     if (selectedIndex === -1) {
                                                                         await setCustomerContactPhoneItems(customerContactPhoneItems.map((item, index) => {
                                                                             item.selected = index === 0;
                                                                             return item;
                                                                         }))
                                                                     } else {
                                                                         await setCustomerContactPhoneItems(customerContactPhoneItems.map((item, index) => {
                                                                             if (selectedIndex === (customerContactPhoneItems.length - 1)) {
                                                                                 item.selected = index === 0;
                                                                             } else {
                                                                                 item.selected = index === (selectedIndex + 1)
                                                                             }
                                                                             return item;
                                                                         }))
                                                                     }

                                                                     refCustomerContactPhonePopupItems.current.map((r, i) => {
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
                                                                     if (customerContactPhoneItems.length > 1) {
                                                                         await setCustomerContactPhoneItems(customerContactPhoneItems.map((item, index) => {
                                                                             item.selected = item.type === (selectedContact?.primary_phone || '')
                                                                             return item;
                                                                         }))

                                                                         setShowCustomerContactPhones(true);

                                                                         refCustomerContactPhonePopupItems.current.map((r, i) => {
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
                                                                 setShowCustomerContactPhones(false);
                                                                 break;

                                                             case 13: // enter
                                                                 if (showCustomerContactPhones && customerContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                                     await setSelectedContact({
                                                                         ...selectedContact,
                                                                         primary_phone: customerContactPhoneItems[customerContactPhoneItems.findIndex(item => item.selected)].type
                                                                     });

                                                                     validateContactForSaving({keyCode: 9});
                                                                     setShowCustomerContactPhones(false);
                                                                     refCustomerContactPhone.current.inputElement.focus();
                                                                 }
                                                                 break;

                                                             case 9: // tab
                                                                 if (showCustomerContactPhones) {
                                                                     e.preventDefault();
                                                                     await setSelectedContact({
                                                                         ...selectedContact,
                                                                         primary_phone: customerContactPhoneItems[customerContactPhoneItems.findIndex(item => item.selected)].type
                                                                     });

                                                                     validateContactForSaving({keyCode: 9});
                                                                     setShowCustomerContactPhones(false);
                                                                     refCustomerContactPhone.current.inputElement.focus();
                                                                 } else {
                                                                     validateContactForSaving({keyCode: 9});
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
                                                    'selected-customer-contact-primary-phone': true,
                                                    'pushed': (customerContactPhoneItems.length > 1)
                                                })}>
                                                {selectedContact?.primary_phone || ''}
                                            </div>
                                        }

                                        {
                                            customerContactPhoneItems.length > 1 &&
                                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                                             onClick={async () => {
                                                                 if (showCustomerContactPhones) {
                                                                     setShowCustomerContactPhones(false);
                                                                 } else {
                                                                     if (customerContactPhoneItems.length > 1) {
                                                                         await setCustomerContactPhoneItems(customerContactPhoneItems.map((item, index) => {
                                                                             item.selected = item.type === (selectedContact?.primary_phone || '')
                                                                             return item;
                                                                         }))

                                                                         window.setTimeout(async () => {
                                                                             await setShowCustomerContactPhones(true);

                                                                             refCustomerContactPhonePopupItems.current.map((r, i) => {
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

                                                                 refCustomerContactPhone.current.inputElement.focus();
                                                             }}/>
                                        }
                                    </div>
                                    {
                                        customerContactPhonesTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-contact-phone"
                                                style={{
                                                    ...style,
                                                    left: '0',
                                                    display: 'block'
                                                }}
                                                ref={refCustomerContactPhoneDropDown}
                                            >
                                                <div className="mochi-contextual-popup vertical below right"
                                                     style={{height: 150}}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {
                                                                customerContactPhoneItems.map((item, index) => {
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

                                                                                validateContactForSaving({keyCode: 9});
                                                                                setShowCustomerContactPhones(false);
                                                                                refCustomerContactPhone.current.inputElement.focus();
                                                                            }}
                                                                            ref={ref => refCustomerContactPhonePopupItems.current.push(ref)}
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
                                                                                    icon={faCaretRight}/>
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
                                <div style={{width: '50%', display: 'flex', justifyContent: 'space-between'}}>
                                    <div className="input-box-container input-phone-ext">
                                        <input tabIndex={15 + props.tabTimes} type="text" placeholder="Ext"
                                               readOnly={
                                                   (props.user?.user_code?.is_admin || 0) === 0 &&
                                                   ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.save || 0) === 0 &&
                                                   ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.edit || 0) === 0
                                               }
                                               // onKeyDown={validateContactForSaving}
                                               onChange={e => setSelectedContact({
                                                   ...selectedContact,
                                                   phone_ext: e.target.value
                                               })}
                                               value={selectedContact.phone_ext || ''}/>
                                    </div>
                                    <div className="input-toggle-container">
                                        <input type="checkbox"
                                               disabled={
                                                   (props.user?.user_code?.is_admin || 0) === 0 &&
                                                   ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.save || 0) === 0 &&
                                                   ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.edit || 0) === 0
                                               }
                                               id={props.panelName + '-cbox-customer-contacts-primary-btn'}
                                               onChange={(e) => {
                                                   setSelectedContact({
                                                       ...selectedContact,
                                                       is_primary: e.target.checked ? 1 : 0
                                                   });
                                                   validateContactForSaving({keyCode: 9});
                                               }}
                                               checked={(selectedContact.is_primary || 0) === 1}/>
                                        <label htmlFor={props.panelName + '-cbox-customer-contacts-primary-btn'}>
                                            <div className="label-text">Primary</div>
                                            <div className="input-toggle-btn"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className="select-box-container" style={{flexGrow: 1}}
                                     onMouseEnter={() => {
                                         if ((selectedContact?.email_work || '') !== '' ||
                                             (selectedContact?.email_personal || '') !== '' ||
                                             (selectedContact?.email_other || '') !== '') {
                                             setShowCustomerContactEmailCopyBtn(true);
                                         }
                                     }}
                                     onFocus={() => {
                                         if ((selectedContact?.email_work || '') !== '' ||
                                             (selectedContact?.email_personal || '') !== '' ||
                                             (selectedContact?.email_other || '') !== '') {
                                             setShowCustomerContactEmailCopyBtn(true);
                                         }
                                     }}
                                     onBlur={() => {
                                         window.setTimeout(() => {
                                             setShowCustomerContactEmailCopyBtn(false);
                                         }, 1000);
                                     }}
                                     onMouseLeave={() => {
                                         setShowCustomerContactEmailCopyBtn(false);
                                     }}>
                                    <div className="select-box-wrapper">
                                        <input
                                            style={{
                                                width: 'calc(100% - 25px)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                            readOnly={
                                                (props.user?.user_code?.is_admin || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.save || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.edit || 0) === 0
                                            }
                                            tabIndex={16 + props.tabTimes}
                                            type="text"
                                            placeholder="E-Mail"
                                            ref={refCustomerContactEmail}
                                            onKeyDown={async (e) => {
                                                let key = e.keyCode || e.which;

                                                switch (key) {
                                                    case 37:
                                                    case 38: // arrow left | arrow up
                                                        e.preventDefault();
                                                        if (showCustomerContactEmails) {
                                                            let selectedIndex = customerContactEmailItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setCustomerContactEmailItems(customerContactEmailItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setCustomerContactEmailItems(customerContactEmailItems.map((item, index) => {
                                                                    if (selectedIndex === 0) {
                                                                        item.selected = index === (customerContactEmailItems.length - 1);
                                                                    } else {
                                                                        item.selected = index === (selectedIndex - 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refCustomerContactEmailPopupItems.current.map((r, i) => {
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
                                                            if (customerContactEmailItems.length > 1) {
                                                                await setCustomerContactEmailItems(customerContactEmailItems.map((item, index) => {
                                                                    item.selected = item.type === (selectedContact?.primary_email || '')
                                                                    return item;
                                                                }))

                                                                setShowCustomerContactEmails(true);

                                                                refCustomerContactEmailPopupItems.current.map((r, i) => {
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
                                                        if (showCustomerContactEmails) {
                                                            let selectedIndex = customerContactEmailItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setCustomerContactEmailItems(customerContactEmailItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setCustomerContactEmailItems(customerContactEmailItems.map((item, index) => {
                                                                    if (selectedIndex === (customerContactEmailItems.length - 1)) {
                                                                        item.selected = index === 0;
                                                                    } else {
                                                                        item.selected = index === (selectedIndex + 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refCustomerContactEmailPopupItems.current.map((r, i) => {
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
                                                            if (customerContactEmailItems.length > 1) {
                                                                await setCustomerContactEmailItems(customerContactEmailItems.map((item, index) => {
                                                                    item.selected = item.type === (selectedContact?.primary_email || '')
                                                                    return item;
                                                                }))

                                                                setShowCustomerContactEmails(true);

                                                                refCustomerContactEmailPopupItems.current.map((r, i) => {
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
                                                        setShowCustomerContactEmails(false);
                                                        break;

                                                    case 13: // enter
                                                        if (showCustomerContactEmails && customerContactEmailItems.findIndex(item => item.selected) > -1) {
                                                            await setSelectedContact({
                                                                ...selectedContact,
                                                                primary_email: customerContactEmailItems[customerContactEmailItems.findIndex(item => item.selected)].type
                                                            });

                                                            validateContactForSaving({keyCode: 9});
                                                            setShowCustomerContactEmails(false);
                                                            refCustomerContactEmail.current.focus();
                                                        }
                                                        break;

                                                    case 9: // tab
                                                        if (showCustomerContactEmails) {
                                                            e.preventDefault();
                                                            await setSelectedContact({
                                                                ...selectedContact,
                                                                primary_email: customerContactEmailItems[customerContactEmailItems.findIndex(item => item.selected)].type
                                                            });

                                                            validateContactForSaving({keyCode: 9});
                                                            setShowCustomerContactEmails(false);
                                                            refCustomerContactEmail.current.focus();
                                                        } else {
                                                            validateContactForSaving({keyCode: 9});
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
                                            showCustomerContactEmailCopyBtn &&
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
                                                navigator.clipboard.writeText(refCustomerContactEmail.current.value);
                                            }}/>
                                        }

                                        {
                                            (selectedContact?.id || 0) > 0 &&
                                            <div
                                                className={classnames({
                                                    'selected-customer-contact-primary-email': true,
                                                    'pushed': (customerContactEmailItems.length > 1)
                                                })}>
                                                {selectedContact?.primary_email || ''}
                                            </div>
                                        }

                                        {
                                            customerContactEmailItems.length > 1 &&
                                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                                             onClick={async () => {
                                                                 if (showCustomerContactEmails) {
                                                                     setShowCustomerContactEmails(false);
                                                                 } else {
                                                                     if (customerContactEmailItems.length > 1) {
                                                                         await setCustomerContactEmailItems(customerContactEmailItems.map((item, index) => {
                                                                             item.selected = item.type === (selectedContact?.primary_email || '')
                                                                             return item;
                                                                         }))

                                                                         window.setTimeout(async () => {
                                                                             await setShowCustomerContactEmails(true);

                                                                             refCustomerContactEmailPopupItems.current.map((r, i) => {
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

                                                                 refCustomerContactEmail.current.focus();
                                                             }}/>
                                        }
                                    </div>
                                    {
                                        customerContactEmailsTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-contact-email"
                                                style={{
                                                    ...style,
                                                    left: '0',
                                                    display: 'block'
                                                }}
                                                ref={refCustomerContactEmailDropDown}
                                            >
                                                <div className="mochi-contextual-popup vertical below right"
                                                     style={{height: 150}}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {
                                                                customerContactEmailItems.map((item, index) => {
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

                                                                                validateContactForSaving({keyCode: 9});
                                                                                setShowCustomerContactEmails(false);
                                                                                refCustomerContactEmail.current.focus();
                                                                            }}
                                                                            ref={ref => refCustomerContactEmailPopupItems.current.push(ref)}
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
                                                                                    icon={faCaretRight}/>
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
                                    <input tabIndex={17 + props.tabTimes} type="text" placeholder="Notes"
                                           readOnly={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.edit || 0) === 0
                                           }
                                           onKeyDown={validateContactForSaving}
                                           onChange={e => setSelectedContact({
                                               ...selectedContact,
                                               notes: e.target.value
                                           })}
                                           value={selectedContact.notes || ''}
                                    />
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className="fields-container-col">
                        <div className="form-bordered-box" style={{width: '100%'}}>
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Automatic E-Mails</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div className={
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.edit || 0) === 0)
                                        ? 'mochi-button disabled' : 'mochi-button'
                                    } onClick={() => {
                                        if ((selectedCustomer?.id || 0) === 0) {
                                            window.alert('You must select a customer first!');
                                            return;
                                        }

                                        if (tempAutomaticEmails.length === 0) {
                                            window.alert('Nothing to save!');
                                            return;
                                        }

                                        let temp = [...tempAutomaticEmails];
                                        let automatic_emails = [...selectedCustomer?.automatic_emails];

                                        temp.map(item => {
                                            let tempIndex = automatic_emails.findIndex(t => t.email === item.email && t.type === item.type);

                                            if (tempIndex > -1) {
                                                automatic_emails[tempIndex].email = item.email;
                                                automatic_emails[tempIndex].name = item.name;
                                                automatic_emails[tempIndex].type = item.type;
                                                automatic_emails[tempIndex].booked_load = tempBookedLoad ? 1 : 0;
                                                automatic_emails[tempIndex].check_calls = tempCheckCalls ? 1 : 0;
                                                automatic_emails[tempIndex].carrier_arrival_shipper = tempCarrierArrivalShipper ? 1 : 0;
                                                automatic_emails[tempIndex].carrier_arrival_consignee = tempCarrierArrivalConsignee ? 1 : 0;
                                                automatic_emails[tempIndex].loaded = tempLoaded ? 1 : 0;
                                                automatic_emails[tempIndex].empty = tempEmpty ? 1 : 0;
                                            } else {
                                                item.booked_load = tempBookedLoad ? 1 : 0;
                                                item.check_calls = tempCheckCalls ? 1 : 0;
                                                item.carrier_arrival_shipper = tempCarrierArrivalShipper ? 1 : 0;
                                                item.carrier_arrival_consignee = tempCarrierArrivalConsignee ? 1 : 0;
                                                item.loaded = tempLoaded ? 1 : 0;
                                                item.empty = tempEmpty ? 1 : 0;

                                                automatic_emails.push(item);
                                            }

                                            return false;
                                        })

                                        axios.post(props.serverUrl + '/saveAutomaticEmails', {
                                            customer_id: selectedCustomer.id,
                                            automatic_emails: automatic_emails
                                        }).then(res => {
                                            if (res.data.result === 'OK') {
                                                setSelectedCustomer({
                                                    ...selectedCustomer,
                                                    automatic_emails: res.data.automatic_emails
                                                });
                                            }

                                            setTempAutomaticEmails([]);
                                            setTempBookedLoad(false);
                                            setTempCheckCalls(false);
                                            setTempCarrierArrivalShipper(false);
                                            setTempCarrierArrivalConsignee(false);
                                            setTempLoaded(false);
                                            setTempEmpty(false);

                                            refAutomaticEmailsTo.current.focus();
                                        }).catch(e => {
                                            console.log('error saving automatic emails', e);
                                        })

                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Save</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>

                                    <div className={
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.edit || 0) === 0)
                                            ? 'mochi-button disabled' : 'mochi-button'
                                    } onClick={() => {
                                        setTempAutomaticEmails([]);
                                        setTempBookedLoad(false);
                                        setTempCheckCalls(false);
                                        setTempCarrierArrivalShipper(false);
                                        setTempCarrierArrivalConsignee(false);
                                        setTempLoaded(false);
                                        setTempEmpty(false);
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Clear</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                </div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="form-row" style={{width: '100%'}}>
                                <div className="select-box-container" style={{width: 'calc(100% - 11.6rem - 5px)'}}>
                                    <div className="select-box-wrapper">
                                        <Swiper slidesPerView={1}>
                                            {
                                                tempAutomaticEmails.map((item, index) => {
                                                    if (item.type === 'to') {
                                                        return (
                                                            <SwiperSlide>
                                                                <div key={index} style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    fontSize: '0.7rem',
                                                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                                                    padding: '2px 10px',
                                                                    borderRadius: '10px',
                                                                    marginRight: '2px',
                                                                    cursor: 'default',
                                                                    width: 'auto'
                                                                }} title={item}>
                                                                    <span className="fas fa-trash-alt" style={{
                                                                        marginRight: '5px',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                          onClick={() => {
                                                                              setTempAutomaticEmails(tempAutomaticEmails.filter((x, i) => i !== index));
                                                                              refAutomaticEmailsTo.current.focus();
                                                                          }}></span>
                                                                    <span className="automatic-email-inputted"
                                                                          style={{whiteSpace: 'nowrap'}}>{
                                                                        item.name !== ''
                                                                            ? item.name
                                                                            : item.email
                                                                    }</span>
                                                                </div>
                                                            </SwiperSlide>
                                                        )
                                                    } else {
                                                        return false;
                                                    }
                                                })
                                            }
                                            <SwiperSlide>
                                                <input type="text"
                                                       readOnly={
                                                           (props.user?.user_code?.is_admin || 0) === 0 &&
                                                           ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.save || 0) === 0 &&
                                                           ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.edit || 0) === 0
                                                       }
                                                       tabIndex={29 + props.tabTimes}
                                                       placeholder="E-Mail To"
                                                       ref={refAutomaticEmailsTo}
                                                       onKeyDown={async (e) => {
                                                           let key = e.keyCode || e.which;

                                                           switch (key) {
                                                               case 37:
                                                               case 38: // arrow left | arrow up
                                                                   e.preventDefault();
                                                                   if (emailToDropdownItems.length > 0) {
                                                                       let selectedIndex = emailToDropdownItems.findIndex(item => item.selected);

                                                                       if (selectedIndex === -1) {
                                                                           await setEmailToDropdownItems(emailToDropdownItems.map((item, index) => {
                                                                               item.selected = index === 0;
                                                                               return item;
                                                                           }))
                                                                       } else {
                                                                           await setEmailToDropdownItems(emailToDropdownItems.map((item, index) => {
                                                                               if (selectedIndex === 0) {
                                                                                   item.selected = index === (emailToDropdownItems.length - 1);
                                                                               } else {
                                                                                   item.selected = index === (selectedIndex - 1)
                                                                               }
                                                                               return item;
                                                                           }))
                                                                       }

                                                                       refEmailToPopupItems.current.map((r, i) => {
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
                                                                   break;

                                                               case 39:
                                                               case 40: // arrow right | arrow down
                                                                   e.preventDefault();
                                                                   if (emailToDropdownItems.length > 0) {
                                                                       let selectedIndex = emailToDropdownItems.findIndex(item => item.selected);

                                                                       if (selectedIndex === -1) {
                                                                           await setEmailToDropdownItems(emailToDropdownItems.map((item, index) => {
                                                                               item.selected = index === 0;
                                                                               return item;
                                                                           }))
                                                                       } else {
                                                                           await setEmailToDropdownItems(emailToDropdownItems.map((item, index) => {
                                                                               if (selectedIndex === (emailToDropdownItems.length - 1)) {
                                                                                   item.selected = index === 0;
                                                                               } else {
                                                                                   item.selected = index === (selectedIndex + 1)
                                                                               }
                                                                               return item;
                                                                           }))
                                                                       }

                                                                       refEmailToPopupItems.current.map((r, i) => {
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
                                                                   break;

                                                               case 27: // escape
                                                                   setEmailToDropdownItems([]);
                                                                   break;

                                                               case 13: // enter
                                                                   if (emailToDropdownItems.length > 0 && emailToDropdownItems.findIndex(item => item.selected) > -1) {
                                                                       let item = emailToDropdownItems.find(el => el.selected);

                                                                       if (item.email !== '' && isEmailValid(item.email)) {
                                                                           if (tempAutomaticEmails.find(t => t.email === item.email && t.type === 'to') === undefined) {
                                                                               setTempAutomaticEmails([
                                                                                   ...tempAutomaticEmails,
                                                                                   {
                                                                                       id: 0,
                                                                                       name: item.name,
                                                                                       email: item.email,
                                                                                       type: 'to'
                                                                                   }
                                                                               ])
                                                                           }

                                                                           await setAutomaticEmailsTo('');

                                                                           setEmailToDropdownItems([]);
                                                                           refAutomaticEmailsTo.current.focus();
                                                                       }
                                                                   } else if (emailToDropdownItems.length === 0) {
                                                                       if (isEmailValid((automaticEmailsTo || ''))) {
                                                                           if (tempAutomaticEmails.find(t => t.email === automaticEmailsTo && t.type === 'to') === undefined) {
                                                                               setTempAutomaticEmails([
                                                                                   ...tempAutomaticEmails,
                                                                                   {
                                                                                       id: 0,
                                                                                       name: '',
                                                                                       email: automaticEmailsTo,
                                                                                       type: 'to'
                                                                                   }
                                                                               ])
                                                                           }
                                                                           await setAutomaticEmailsTo('');
                                                                           setEmailToDropdownItems([]);
                                                                           refAutomaticEmailsTo.current.focus();
                                                                       }
                                                                   }
                                                                   break;

                                                               case 9: // tab
                                                                   if (emailToDropdownItems.length > 0) {
                                                                       let item = emailToDropdownItems.find(el => el.selected);

                                                                       if (item.email !== '' && isEmailValid(item.email)) {
                                                                           e.preventDefault();

                                                                           if (tempAutomaticEmails.find(t => t.email === item.email && t.type === 'to') === undefined) {
                                                                               setTempAutomaticEmails([
                                                                                   ...tempAutomaticEmails,
                                                                                   {
                                                                                       id: 0,
                                                                                       name: item.name,
                                                                                       email: item.email,
                                                                                       type: 'to'
                                                                                   }
                                                                               ])
                                                                           }
                                                                           await setAutomaticEmailsTo('');

                                                                           setEmailToDropdownItems([]);
                                                                           refAutomaticEmailsTo.current.focus();
                                                                       }
                                                                   } else if (emailToDropdownItems.length === 0) {
                                                                       if (isEmailValid((automaticEmailsTo || ''))) {
                                                                           e.preventDefault();

                                                                           if (tempAutomaticEmails.find(t => t.email === automaticEmailsTo && t.type === 'to') === undefined) {
                                                                               setTempAutomaticEmails([
                                                                                   ...tempAutomaticEmails,
                                                                                   {
                                                                                       id: 0,
                                                                                       name: '',
                                                                                       email: automaticEmailsTo,
                                                                                       type: 'to'
                                                                                   }
                                                                               ])
                                                                           }
                                                                           await setAutomaticEmailsTo('');
                                                                           setEmailToDropdownItems([]);
                                                                           refAutomaticEmailsTo.current.focus();
                                                                       }
                                                                   }
                                                                   break;

                                                               default:
                                                                   break;
                                                           }
                                                       }}
                                                       onInput={async (e) => {
                                                           await setAutomaticEmailsTo(e.target.value);

                                                           if ((selectedCustomer?.id || 0) > 0) {
                                                               if (e.target.value.trim() === '') {
                                                                   setEmailToDropdownItems([]);
                                                               } else {
                                                                   axios.post(props.serverUrl + '/getContactsByEmailOrName', {
                                                                       email: e.target.value.trim(),
                                                                       customer_id: selectedCustomer?.id
                                                                   }).then(async res => {
                                                                       if (res.data.result === 'OK') {
                                                                           let items = []
                                                                           res.data.contacts.map((c, i) => {
                                                                               let emailWork = c.email_work;
                                                                               let emailPersonal = c.email_personal;
                                                                               let emailOther = c.email_other;
                                                                               let firstName = c.first_name;
                                                                               let lastName = c.last_name;

                                                                               let name = firstName + ' ' + lastName;

                                                                               let email = emailWork.indexOf(e.target.value.trim()) > -1 ? emailWork :
                                                                                   emailPersonal.indexOf(e.target.value.trim()) ? emailPersonal : emailOther

                                                                               if (email === '') {
                                                                                   email = emailWork !== '' ? emailWork :
                                                                                       emailPersonal !== '' ? emailPersonal : emailOther;
                                                                               }

                                                                               if (emailWork.trim() !== '' || emailPersonal.trim() !== '' || emailOther !== '') {
                                                                                   items.push({
                                                                                       name: name,
                                                                                       email: email,
                                                                                       selected: i === 0
                                                                                   });
                                                                               }

                                                                               return true;
                                                                           });


                                                                           await setEmailToDropdownItems(e.target.value.trim() === '' ? [] : items);
                                                                       }
                                                                   }).catch(async e => {
                                                                       console.log('error getting emails', e);
                                                                   })
                                                               }
                                                           }
                                                       }}
                                                       onChange={async (e) => {
                                                           await setAutomaticEmailsTo(e.target.value)
                                                       }}
                                                       value={automaticEmailsTo || ''}
                                                />
                                            </SwiperSlide>
                                        </Swiper>
                                    </div>
                                    {
                                        emailToTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-email-to"
                                                style={{
                                                    ...style,
                                                    left: 'calc(100%)',
                                                    display: 'block'
                                                }}
                                                ref={refEmailToDropDown}
                                            >
                                                <div className="mochi-contextual-popup left high corner"
                                                     style={{height: 200}}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {
                                                                emailToDropdownItems.map((item, index) => {
                                                                    const mochiItemClasses = classnames({
                                                                        'mochi-item': true,
                                                                        'selected': item.selected
                                                                    });

                                                                    const searchValue = automaticEmailsTo || '';

                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={mochiItemClasses}
                                                                            id={item.id}
                                                                            onClick={async () => {
                                                                                if (item.email !== '' && isEmailValid(item.email)) {
                                                                                    if (tempAutomaticEmails.find(t => t.email === item.email && t.type === 'to') === undefined) {
                                                                                        setTempAutomaticEmails([
                                                                                            ...tempAutomaticEmails,
                                                                                            {
                                                                                                id: 0,
                                                                                                name: item.name,
                                                                                                email: item.email,
                                                                                                type: 'to'
                                                                                            }
                                                                                        ])
                                                                                    }
                                                                                    await setAutomaticEmailsTo('');

                                                                                    setEmailToDropdownItems([]);
                                                                                    refAutomaticEmailsTo.current.focus();
                                                                                }
                                                                            }}
                                                                            ref={ref => refEmailToPopupItems.current.push(ref)}
                                                                        >
                                                                            {item.name} (<b>{item.email}</b>)
                                                                            {
                                                                                item.selected &&
                                                                                <FontAwesomeIcon
                                                                                    className="dropdown-selected"
                                                                                    icon={faCaretRight}/>
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
                                <div className="input-toggle-container">
                                    <input type="checkbox"
                                           disabled={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.edit || 0) === 0
                                           }
                                           id={props.panelName + '-cbox-automatic-emails-booked-load-btn'}
                                           onChange={e => {
                                               setTempAutomaticEmails(tempAutomaticEmails.map((t, i) => {
                                                   t.booked_load = e.target.checked ? 1 : 0;
                                                   return t;
                                               }))

                                               setTempBookedLoad(e.target.checked);
                                           }}
                                           checked={tempBookedLoad}/>
                                    <label htmlFor={props.panelName + '-cbox-automatic-emails-booked-load-btn'}>
                                        <div className="label-text">Booked Load</div>
                                        <div className="input-toggle-btn"></div>
                                    </label>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-toggle-container">
                                    <input type="checkbox"
                                           id={props.panelName + '-cbox-automatic-emails-check-calls-btn'}
                                           disabled={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.edit || 0) === 0
                                           }
                                           onChange={e => {
                                               setTempAutomaticEmails(tempAutomaticEmails.map((t, i) => {
                                                   t.check_calls = e.target.checked ? 1 : 0;
                                                   return t;
                                               }))

                                               setTempCheckCalls(e.target.checked);
                                           }}
                                           checked={tempCheckCalls}/>
                                    <label htmlFor={props.panelName + '-cbox-automatic-emails-check-calls-btn'}>
                                        <div className="label-text">Check Calls</div>
                                        <div className="input-toggle-btn"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row" style={{width: '100%'}}>
                                <div className="select-box-container" style={{width: 'calc(100% - 11.6rem - 5px)'}}>
                                    <div className="select-box-wrapper">
                                        <Swiper slidesPerView={1}>
                                            {
                                                tempAutomaticEmails.map((item, index) => {
                                                    if (item.type === 'cc') {
                                                        return (
                                                            <SwiperSlide>
                                                                <div key={index} style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    fontSize: '0.7rem',
                                                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                                                    padding: '2px 10px',
                                                                    borderRadius: '10px',
                                                                    marginRight: '2px',
                                                                    cursor: 'default'
                                                                }} title={item}>
                                                                    <span className="fas fa-trash-alt" style={{
                                                                        marginRight: '5px',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                          onClick={() => {
                                                                              setTempAutomaticEmails(tempAutomaticEmails.filter((x, i) => i !== index));
                                                                              refAutomaticEmailsCc.current.focus();
                                                                          }}></span>
                                                                    <span className="automatic-email-inputted"
                                                                          style={{whiteSpace: 'nowrap'}}>{
                                                                        item.name !== ''
                                                                            ? item.name
                                                                            : item.email
                                                                    }</span>
                                                                </div>
                                                            </SwiperSlide>
                                                        )
                                                    } else {
                                                        return false;
                                                    }
                                                })
                                            }
                                            <SwiperSlide>
                                                <input type="text"
                                                       tabIndex={30 + props.tabTimes}
                                                       readOnly={
                                                           (props.user?.user_code?.is_admin || 0) === 0 &&
                                                           ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.save || 0) === 0 &&
                                                           ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.edit || 0) === 0
                                                       }
                                                       placeholder="E-Mail Cc"
                                                       ref={refAutomaticEmailsCc}
                                                       onKeyDown={async (e) => {
                                                           let key = e.keyCode || e.which;
                                                           switch (key) {
                                                               case 37:
                                                               case 38: // arrow left | arrow up
                                                                   e.preventDefault();
                                                                   if (emailCcDropdownItems.length > 0) {
                                                                       let selectedIndex = emailCcDropdownItems.findIndex(item => item.selected);

                                                                       if (selectedIndex === -1) {
                                                                           await setEmailCcDropdownItems(emailCcDropdownItems.map((item, index) => {
                                                                               item.selected = index === 0;
                                                                               return item;
                                                                           }))
                                                                       } else {
                                                                           await setEmailCcDropdownItems(emailCcDropdownItems.map((item, index) => {
                                                                               if (selectedIndex === 0) {
                                                                                   item.selected = index === (emailCcDropdownItems.length - 1);
                                                                               } else {
                                                                                   item.selected = index === (selectedIndex - 1)
                                                                               }
                                                                               return item;
                                                                           }))
                                                                       }

                                                                       refEmailCcPopupItems.current.map((r, i) => {
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
                                                                   break;

                                                               case 39:
                                                               case 40: // arrow right | arrow down
                                                                   e.preventDefault();
                                                                   if (emailCcDropdownItems.length > 0) {
                                                                       let selectedIndex = emailCcDropdownItems.findIndex(item => item.selected);

                                                                       if (selectedIndex === -1) {
                                                                           await setEmailCcDropdownItems(emailCcDropdownItems.map((item, index) => {
                                                                               item.selected = index === 0;
                                                                               return item;
                                                                           }))
                                                                       } else {
                                                                           await setEmailCcDropdownItems(emailCcDropdownItems.map((item, index) => {
                                                                               if (selectedIndex === (emailCcDropdownItems.length - 1)) {
                                                                                   item.selected = index === 0;
                                                                               } else {
                                                                                   item.selected = index === (selectedIndex + 1)
                                                                               }
                                                                               return item;
                                                                           }))
                                                                       }

                                                                       refEmailCcPopupItems.current.map((r, i) => {
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
                                                                   break;

                                                               case 27: // escape
                                                                   setEmailCcDropdownItems([]);
                                                                   break;

                                                               case 13: // enter
                                                                   // automaticEmails = selectedCustomer?.automatic_emails || { customer_id: selectedCustomer?.id };

                                                                   if (emailCcDropdownItems.length > 0 && emailCcDropdownItems.findIndex(item => item.selected) > -1) {
                                                                       let item = emailCcDropdownItems.find(el => el.selected);

                                                                       if (item.email !== '' && isEmailValid(item.email)) {
                                                                           if (tempAutomaticEmails.find(t => t.email === item.email && t.type === 'cc') === undefined) {
                                                                               setTempAutomaticEmails([
                                                                                   ...tempAutomaticEmails,
                                                                                   {
                                                                                       id: 0,
                                                                                       name: item.name,
                                                                                       email: item.email,
                                                                                       type: 'cc'
                                                                                   }
                                                                               ])
                                                                           }
                                                                           await setAutomaticEmailsCc('');

                                                                           setEmailCcDropdownItems([]);
                                                                           refAutomaticEmailsCc.current.focus();
                                                                       }
                                                                   } else if (emailToDropdownItems.length === 0) {
                                                                       if (isEmailValid((automaticEmailsCc || ''))) {
                                                                           if (tempAutomaticEmails.find(t => t.email === automaticEmailsCc && t.type === 'cc') === undefined) {
                                                                               setTempAutomaticEmails([
                                                                                   ...tempAutomaticEmails,
                                                                                   {
                                                                                       id: 0,
                                                                                       name: '',
                                                                                       email: automaticEmailsCc,
                                                                                       type: 'cc'
                                                                                   }
                                                                               ])
                                                                           }
                                                                           await setAutomaticEmailsCc('');

                                                                           setEmailCcDropdownItems([]);
                                                                           refAutomaticEmailsCc.current.focus();
                                                                       }
                                                                   }
                                                                   break;

                                                               case 9: // tab
                                                                   // automaticEmails = selectedCustomer?.automatic_emails || { customer_id: selectedCustomer?.id };

                                                                   if (emailCcDropdownItems.length > 0) {
                                                                       let item = emailCcDropdownItems.find(el => el.selected);

                                                                       if (item.email !== '' && isEmailValid(item.email)) {
                                                                           e.preventDefault();

                                                                           if (tempAutomaticEmails.find(t => t.email === item.email && t.type === 'cc') === undefined) {
                                                                               setTempAutomaticEmails([
                                                                                   ...tempAutomaticEmails,
                                                                                   {
                                                                                       id: 0,
                                                                                       name: item.name,
                                                                                       email: item.email,
                                                                                       type: 'cc'
                                                                                   }
                                                                               ])
                                                                           }
                                                                           await setAutomaticEmailsCc('');

                                                                           setEmailCcDropdownItems([]);
                                                                           refAutomaticEmailsCc.current.focus();
                                                                       }
                                                                   } else if (emailToDropdownItems.length === 0) {
                                                                       if (isEmailValid((automaticEmailsCc || ''))) {
                                                                           e.preventDefault();

                                                                           if (tempAutomaticEmails.find(t => t.email === automaticEmailsCc && t.type === 'cc') === undefined) {
                                                                               setTempAutomaticEmails([
                                                                                   ...tempAutomaticEmails,
                                                                                   {
                                                                                       id: 0,
                                                                                       name: '',
                                                                                       email: automaticEmailsCc,
                                                                                       type: 'cc'
                                                                                   }
                                                                               ])
                                                                           }
                                                                           await setAutomaticEmailsCc('');

                                                                           setEmailCcDropdownItems([]);
                                                                           refAutomaticEmailsCc.current.focus();
                                                                       }
                                                                   }
                                                                   break;

                                                               default:
                                                                   break;
                                                           }
                                                       }}
                                                       onInput={async (e) => {
                                                           await setAutomaticEmailsCc(e.target.value);

                                                           if ((selectedCustomer?.id || 0) > 0) {
                                                               if (e.target.value.trim() === '') {
                                                                   setEmailCcDropdownItems([]);
                                                               } else {
                                                                   axios.post(props.serverUrl + '/getContactsByEmailOrName', {
                                                                       email: e.target.value.trim(),
                                                                       customer_id: selectedCustomer?.id
                                                                   }).then(async res => {
                                                                       if (res.data.result === 'OK') {
                                                                           let items = []
                                                                           res.data.contacts.map((c, i) => {
                                                                               let emailWork = c.email_work;
                                                                               let emailPersonal = c.email_personal;
                                                                               let emailOther = c.email_other;
                                                                               let firstName = c.first_name;
                                                                               let lastName = c.last_name;

                                                                               let name = firstName + ' ' + lastName;

                                                                               let email = emailWork.indexOf(e.target.value.trim()) > -1 ? emailWork :
                                                                                   emailPersonal.indexOf(e.target.value.trim()) ? emailPersonal : emailOther

                                                                               if (email === '') {
                                                                                   email = emailWork !== '' ? emailWork :
                                                                                       emailPersonal !== '' ? emailPersonal : emailOther;
                                                                               }

                                                                               if (emailWork.trim() !== '' || emailPersonal.trim() !== '' || emailOther !== '') {
                                                                                   items.push({
                                                                                       name: name,
                                                                                       email: email,
                                                                                       selected: i === 0
                                                                                   });
                                                                               }

                                                                               return true;
                                                                           });


                                                                           await setEmailCcDropdownItems(e.target.value.trim() === '' ? [] : items);
                                                                       }
                                                                   }).catch(async e => {
                                                                       console.log('error getting emails', e);
                                                                   })
                                                               }
                                                           }
                                                       }}
                                                       onChange={async (e) => {
                                                           await setAutomaticEmailsCc(e.target.value)
                                                       }}
                                                       value={automaticEmailsCc || ''}
                                                />
                                            </SwiperSlide>
                                        </Swiper>
                                    </div>
                                    {
                                        emailCcTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-email-cc"
                                                style={{
                                                    ...style,
                                                    left: 'calc(100%)',
                                                    display: 'block'
                                                }}
                                                ref={refEmailCcDropDown}
                                            >
                                                <div className="mochi-contextual-popup left high corner"
                                                     style={{height: 200}}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {
                                                                emailCcDropdownItems.map((item, index) => {
                                                                    const mochiItemClasses = classnames({
                                                                        'mochi-item': true,
                                                                        'selected': item.selected
                                                                    });

                                                                    const searchValue = automaticEmailsCc || '';

                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={mochiItemClasses}
                                                                            id={item.id}
                                                                            onClick={async () => {
                                                                                if (item.email !== '' && isEmailValid(item.email)) {
                                                                                    if (tempAutomaticEmails.find(t => t.email === item.email && t.type === 'cc') === undefined) {
                                                                                        setTempAutomaticEmails([
                                                                                            ...tempAutomaticEmails,
                                                                                            {
                                                                                                id: 0,
                                                                                                name: item.name,
                                                                                                email: item.email,
                                                                                                type: 'cc'
                                                                                            }
                                                                                        ])
                                                                                    }
                                                                                    await setAutomaticEmailsCc('');

                                                                                    setEmailCcDropdownItems([]);
                                                                                    refAutomaticEmailsCc.current.focus();
                                                                                }
                                                                            }}
                                                                            ref={ref => refEmailCcPopupItems.current.push(ref)}
                                                                        >
                                                                            {item.name} (<b>{item.email}</b>)
                                                                            {
                                                                                item.selected &&
                                                                                <FontAwesomeIcon
                                                                                    className="dropdown-selected"
                                                                                    icon={faCaretRight}/>
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
                                <div className="input-toggle-container">
                                    <input type="checkbox"
                                           id={props.panelName + '-cbox-automatic-emails-carrier-arrival-shipper-btn'}
                                           disabled={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.edit || 0) === 0
                                           }
                                           onChange={e => {
                                               setTempAutomaticEmails(tempAutomaticEmails.map((t, i) => {
                                                   t.carrier_arrival_shipper = e.target.checked ? 1 : 0;
                                                   return t;
                                               }))

                                               setTempCarrierArrivalShipper(e.target.checked);
                                           }}
                                           checked={tempCarrierArrivalShipper}/>
                                    <label
                                        htmlFor={props.panelName + '-cbox-automatic-emails-carrier-arrival-shipper-btn'}>
                                        <div className="label-text">Carrier Arrival Shipper</div>
                                        <div className="input-toggle-btn"></div>
                                    </label>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-toggle-container">
                                    <input type="checkbox"
                                           id={props.panelName + '-cbox-automatic-emails-carrier-arrival-consignee-btn'}
                                           disabled={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.edit || 0) === 0
                                           }
                                           onChange={e => {
                                               setTempAutomaticEmails(tempAutomaticEmails.map((t, i) => {
                                                   t.carrier_arrival_consignee = e.target.checked ? 1 : 0;
                                                   return t;
                                               }))

                                               setTempCarrierArrivalConsignee(e.target.checked);
                                           }}
                                           checked={tempCarrierArrivalConsignee}/>
                                    <label
                                        htmlFor={props.panelName + '-cbox-automatic-emails-carrier-arrival-consignee-btn'}>
                                        <div className="label-text">Carrier Arrival Consignee</div>
                                        <div className="input-toggle-btn"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row" style={{width: '100%'}}>
                                <div className="select-box-container" style={{width: 'calc(100% - 11.6rem - 5px)'}}>

                                    <div className="select-box-wrapper">
                                        <Swiper slidesPerView={1}>
                                            {
                                                tempAutomaticEmails.map((item, index) => {
                                                    if (item.type === 'bcc') {
                                                        return (
                                                            <SwiperSlide>
                                                                <div key={index} style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    fontSize: '0.7rem',
                                                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                                                    padding: '2px 10px',
                                                                    borderRadius: '10px',
                                                                    marginRight: '2px',
                                                                    cursor: 'default'
                                                                }} title={item}>
                                                                    <span className="fas fa-trash-alt" style={{
                                                                        marginRight: '5px',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                          onClick={() => {
                                                                              setTempAutomaticEmails(tempAutomaticEmails.filter((x, i) => i !== index));
                                                                              refAutomaticEmailsBcc.current.focus();
                                                                          }}></span>
                                                                    <span className="automatic-email-inputted"
                                                                          style={{whiteSpace: 'nowrap'}}>{
                                                                        item.name !== ''
                                                                            ? item.name
                                                                            : item.email
                                                                    }</span>
                                                                </div>
                                                            </SwiperSlide>
                                                        )
                                                    } else {
                                                        return false;
                                                    }
                                                })
                                            }
                                            <SwiperSlide>
                                                <input type="text"
                                                       tabIndex={31 + props.tabTimes}
                                                       readOnly={
                                                           (props.user?.user_code?.is_admin || 0) === 0 &&
                                                           ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.save || 0) === 0 &&
                                                           ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.edit || 0) === 0
                                                       }
                                                       placeholder="E-Mail Bcc"
                                                       ref={refAutomaticEmailsBcc}
                                                       onKeyDown={async (e) => {
                                                           let key = e.keyCode || e.which;
                                                           let automaticEmails = selectedCustomer?.automatic_emails || {customer_id: selectedCustomer?.id};
                                                           switch (key) {
                                                               case 37:
                                                               case 38: // arrow left | arrow up
                                                                   e.preventDefault();
                                                                   if (emailBccDropdownItems.length > 0) {
                                                                       let selectedIndex = emailBccDropdownItems.findIndex(item => item.selected);

                                                                       if (selectedIndex === -1) {
                                                                           await setEmailBccDropdownItems(emailBccDropdownItems.map((item, index) => {
                                                                               item.selected = index === 0;
                                                                               return item;
                                                                           }))
                                                                       } else {
                                                                           await setEmailBccDropdownItems(emailBccDropdownItems.map((item, index) => {
                                                                               if (selectedIndex === 0) {
                                                                                   item.selected = index === (emailBccDropdownItems.length - 1);
                                                                               } else {
                                                                                   item.selected = index === (selectedIndex - 1)
                                                                               }
                                                                               return item;
                                                                           }))
                                                                       }

                                                                       refEmailBccPopupItems.current.map((r, i) => {
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
                                                                   break;

                                                               case 39:
                                                               case 40: // arrow right | arrow down
                                                                   e.preventDefault();
                                                                   if (emailBccDropdownItems.length > 0) {
                                                                       let selectedIndex = emailBccDropdownItems.findIndex(item => item.selected);

                                                                       if (selectedIndex === -1) {
                                                                           await setEmailBccDropdownItems(emailBccDropdownItems.map((item, index) => {
                                                                               item.selected = index === 0;
                                                                               return item;
                                                                           }))
                                                                       } else {
                                                                           await setEmailBccDropdownItems(emailBccDropdownItems.map((item, index) => {
                                                                               if (selectedIndex === (emailBccDropdownItems.length - 1)) {
                                                                                   item.selected = index === 0;
                                                                               } else {
                                                                                   item.selected = index === (selectedIndex + 1)
                                                                               }
                                                                               return item;
                                                                           }))
                                                                       }

                                                                       refEmailBccPopupItems.current.map((r, i) => {
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
                                                                   break;

                                                               case 27: // escape
                                                                   setEmailBccDropdownItems([]);
                                                                   break;

                                                               case 13: // enter
                                                                   if (emailBccDropdownItems.length > 0 && emailBccDropdownItems.findIndex(item => item.selected) > -1) {
                                                                       let item = emailBccDropdownItems.find(el => el.selected);

                                                                       if (item.email !== '' && isEmailValid(item.email)) {
                                                                           if (tempAutomaticEmails.find(t => t.email === item.email && t.type === 'bcc') === undefined) {
                                                                               setTempAutomaticEmails([
                                                                                   ...tempAutomaticEmails,
                                                                                   {
                                                                                       id: 0,
                                                                                       name: item.name,
                                                                                       email: item.email,
                                                                                       type: 'bcc'
                                                                                   }
                                                                               ])
                                                                           }
                                                                           await setAutomaticEmailsBcc('');

                                                                           setEmailBccDropdownItems([]);
                                                                           refAutomaticEmailsBcc.current.focus();
                                                                       }
                                                                   } else if (emailBccDropdownItems.length === 0) {
                                                                       if (isEmailValid((automaticEmailsBcc || ''))) {
                                                                           if (tempAutomaticEmails.find(t => t.email === automaticEmailsBcc && t.type === 'bcc') === undefined) {
                                                                               setTempAutomaticEmails([
                                                                                   ...tempAutomaticEmails,
                                                                                   {
                                                                                       id: 0,
                                                                                       name: '',
                                                                                       email: automaticEmailsBcc,
                                                                                       type: 'bcc'
                                                                                   }
                                                                               ])
                                                                           }
                                                                           await setAutomaticEmailsBcc('');

                                                                           setEmailBccDropdownItems([]);
                                                                           refAutomaticEmailsBcc.current.focus();
                                                                       }
                                                                   }
                                                                   break;

                                                               case 9: // tab
                                                                   if (emailBccDropdownItems.length > 0) {
                                                                       let item = emailBccDropdownItems.find(el => el.selected);

                                                                       if (item.email !== '' && isEmailValid(item.email)) {
                                                                           e.preventDefault();

                                                                           if (tempAutomaticEmails.find(t => t.email === item.email && t.type === 'bcc') === undefined) {
                                                                               setTempAutomaticEmails([
                                                                                   ...tempAutomaticEmails,
                                                                                   {
                                                                                       id: 0,
                                                                                       name: item.name,
                                                                                       email: item.email,
                                                                                       type: 'bcc'
                                                                                   }
                                                                               ])
                                                                           }
                                                                           await setAutomaticEmailsBcc('');

                                                                           setEmailBccDropdownItems([]);
                                                                           refAutomaticEmailsBcc.current.focus();
                                                                       }
                                                                   } else if (emailBccDropdownItems.length === 0) {
                                                                       if (isEmailValid((automaticEmailsBcc || ''))) {
                                                                           e.preventDefault();

                                                                           if (tempAutomaticEmails.find(t => t.email === automaticEmailsBcc && t.type === 'bcc') === undefined) {
                                                                               setTempAutomaticEmails([
                                                                                   ...tempAutomaticEmails,
                                                                                   {
                                                                                       id: 0,
                                                                                       name: '',
                                                                                       email: automaticEmailsBcc,
                                                                                       type: 'bcc'
                                                                                   }
                                                                               ])
                                                                           }
                                                                           await setAutomaticEmailsBcc('');

                                                                           setEmailBccDropdownItems([]);
                                                                           refAutomaticEmailsBcc.current.focus();
                                                                       }
                                                                   }
                                                                   break;

                                                               default:
                                                                   break;
                                                           }
                                                       }}
                                                       onInput={async (e) => {
                                                           await setAutomaticEmailsBcc(e.target.value);

                                                           if ((selectedCustomer?.id || 0) > 0) {
                                                               if (e.target.value.trim() === '') {
                                                                   setEmailBccDropdownItems([]);
                                                               } else {
                                                                   axios.post(props.serverUrl + '/getContactsByEmailOrName', {
                                                                       email: e.target.value.trim(),
                                                                       customer_id: selectedCustomer?.id
                                                                   }).then(async res => {
                                                                       if (res.data.result === 'OK') {
                                                                           let items = []
                                                                           res.data.contacts.map((c, i) => {
                                                                               let emailWork = c.email_work;
                                                                               let emailPersonal = c.email_personal;
                                                                               let emailOther = c.email_other;
                                                                               let firstName = c.first_name;
                                                                               let lastName = c.last_name;

                                                                               let name = firstName + ' ' + lastName;

                                                                               let email = emailWork.indexOf(e.target.value.trim()) > -1 ? emailWork :
                                                                                   emailPersonal.indexOf(e.target.value.trim()) ? emailPersonal : emailOther

                                                                               if (email === '') {
                                                                                   email = emailWork !== '' ? emailWork :
                                                                                       emailPersonal !== '' ? emailPersonal : emailOther;
                                                                               }

                                                                               if (emailWork.trim() !== '' || emailPersonal.trim() !== '' || emailOther !== '') {
                                                                                   items.push({
                                                                                       name: name,
                                                                                       email: email,
                                                                                       selected: i === 0
                                                                                   });
                                                                               }

                                                                               return true;
                                                                           });


                                                                           await setEmailBccDropdownItems(e.target.value.trim() === '' ? [] : items);
                                                                       }
                                                                   }).catch(async e => {
                                                                       console.log('error getting emails', e);
                                                                   })
                                                               }
                                                           }
                                                       }}
                                                       onChange={async (e) => {
                                                           await setAutomaticEmailsBcc(e.target.value)
                                                       }}
                                                       value={automaticEmailsBcc || ''}
                                                />
                                            </SwiperSlide>
                                        </Swiper>
                                    </div>
                                    {
                                        emailBccTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-email-bcc"
                                                style={{
                                                    ...style,
                                                    left: 'calc(100%)',
                                                    display: 'block'
                                                }}
                                                ref={refEmailBccDropDown}
                                            >
                                                <div className="mochi-contextual-popup left high corner"
                                                     style={{height: 200}}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {
                                                                emailBccDropdownItems.map((item, index) => {
                                                                    const mochiItemClasses = classnames({
                                                                        'mochi-item': true,
                                                                        'selected': item.selected
                                                                    });

                                                                    const searchValue = automaticEmailsBcc || '';

                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={mochiItemClasses}
                                                                            id={item.id}
                                                                            onClick={async () => {
                                                                                if (item.email !== '' && isEmailValid(item.email)) {
                                                                                    if (tempAutomaticEmails.find(t => t.email === item.email && t.type === 'bcc') === undefined) {
                                                                                        setTempAutomaticEmails([
                                                                                            ...tempAutomaticEmails,
                                                                                            {
                                                                                                id: 0,
                                                                                                name: item.name,
                                                                                                email: item.email,
                                                                                                type: 'bcc'
                                                                                            }
                                                                                        ])
                                                                                    }
                                                                                    await setAutomaticEmailsBcc('');

                                                                                    setEmailBccDropdownItems([]);
                                                                                    refAutomaticEmailsBcc.current.focus();
                                                                                }
                                                                            }}
                                                                            ref={ref => refEmailBccPopupItems.current.push(ref)}
                                                                        >
                                                                            {item.name} (<b>{item.email}</b>)
                                                                            {
                                                                                item.selected &&
                                                                                <FontAwesomeIcon
                                                                                    className="dropdown-selected"
                                                                                    icon={faCaretRight}/>
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
                                <div className="input-toggle-container">
                                    <input type="checkbox" id={props.panelName + '-cbox-automatic-emails-loaded-btn'}
                                           disabled={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.edit || 0) === 0
                                           }
                                           onChange={e => {
                                               setTempAutomaticEmails(tempAutomaticEmails.map((t, i) => {
                                                   t.loaded = e.target.checked ? 1 : 0;
                                                   return t;
                                               }))

                                               setTempLoaded(e.target.checked);
                                           }}
                                           checked={tempLoaded}/>
                                    <label htmlFor={props.panelName + '-cbox-automatic-emails-loaded-btn'}>
                                        <div className="label-text">Loaded</div>
                                        <div className="input-toggle-btn"></div>
                                    </label>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className="input-toggle-container">
                                    <input type="checkbox" id={props.panelName + '-cbox-automatic-emails-empty-btn'}
                                           disabled={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.edit || 0) === 0
                                           }
                                           onChange={e => {
                                               setTempAutomaticEmails(tempAutomaticEmails.map((t, i) => {
                                                   t.empty = e.target.checked ? 1 : 0;
                                                   return t;
                                               }))

                                               setTempEmpty(e.target.checked);
                                           }}
                                           checked={tempEmpty}/>
                                    <label htmlFor={props.panelName + '-cbox-automatic-emails-empty-btn'}>
                                        <div className="label-text">Empty</div>
                                        <div className="input-toggle-btn"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="fields-container-col">
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Aditional Documents Required</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="form-row">
                                <div className="input-toggle-container">
                                    <input type="checkbox" id="cbox-aditional-documents-pod-btn"
                                           disabled={
                                               (props.user?.user_code?.is_admin || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer aditional documents required')?.pivot?.save || 0) === 0 &&
                                               ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer aditional documents required')?.pivot?.edit || 0) === 0
                                           }
                                    />
                                    <label htmlFor="cbox-aditional-documents-pod-btn">
                                        <div className="label-text">POD</div>
                                        <div className="input-toggle-btn"></div>
                                    </label>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                <div className="fields-container-row grow" style={{minHeight: '10.3rem', maxHeight: '10.3rem'}}>
                    <div className="fields-container-col">
                        <div className="form-bordered-box">
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
                                <div className="form-slider-wrapper" style={{left: showingContactList ? 0 : '-100%'}}>
                                    <div className="contact-list-box">
                                        {
                                            (selectedCustomer?.contacts || []).length > 0 &&
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
                                                (selectedCustomer?.contacts || []).map((contact, index) => {
                                                    return (
                                                        <div className="contact-list-item" key={index}
                                                             onDoubleClick={async () => {
                                                                 if (((props.user?.user_code?.is_admin || 0) === 0 &&
                                                                     ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.edit || 0) === 0)){
                                                                     return;
                                                                 }

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
                                                                         permissionName='customer contacts'
                                                                         origin={props.origin}
                                                                         owner='customer'
                                                                         openPanel={props.openPanel}
                                                                         closePanel={props.closePanel}
                                                                         componentId={moment().format('x')}

                                                                         contactSearchCustomer={{
                                                                             ...selectedCustomer,
                                                                             selectedContact: contact
                                                                         }}
                                                                     />
                                                                 }

                                                                 props.openPanel(panel, props.origin);
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
                                                                    <FontAwesomeIcon icon={faPencilAlt}/>
                                                                </div>
                                                            }
                                                            {
                                                                (contact.is_primary === 1) &&
                                                                <div className="contact-list-col tcol pri">
                                                                    <FontAwesomeIcon icon={faCheck}/>
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
                                                       })} value={contactSearch.first_name || ''}/>
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Last Name" onFocus={() => {
                                                    setShowingContactList(false)
                                                }} onChange={e => setContactSearch({
                                                    ...contactSearch,
                                                    last_name: e.target.value
                                                })} value={contactSearch.last_name || ''}/>
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
                                                })} value={contactSearch.address1 || ''}/>
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
                                                })} value={contactSearch.address2 || ''}/>
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
                                                })} value={contactSearch.city || ''}/>
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container input-state">
                                                <input type="text" placeholder="State" maxLength="2" onFocus={() => {
                                                    setShowingContactList(false)
                                                }} onChange={e => setContactSearch({
                                                    ...contactSearch,
                                                    state: e.target.value
                                                })} value={contactSearch.state || ''}/>
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
                                                })} value={contactSearch.phone || ''}/>
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="E-Mail"
                                                       style={{textTransform: 'lowercase'}}
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
                                                       value={contactSearch.email || ''}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="fields-container-col">
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="top-border top-border-middle"></div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="automatic-email-container">
                                <div className="automatic-email-wrapper">
                                    {
                                        (selectedCustomer?.automatic_emails || []).map((item, index) => {
                                            return <div className="automatic-email-item" key={index} onClick={() => {
                                                if ((props.user?.user_code?.is_admin || 0) === 0 &&
                                                    (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.save || 0) === 0 &&
                                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.edit || 0) === 0)){
                                                    return;
                                                }

                                                let itemIndex = tempAutomaticEmails.findIndex(t => t.email === item.email && t.type === item.type);
                                                let temp = [...tempAutomaticEmails];

                                                if (temp.length === 0 || (temp.length === 1 && temp[0].email === item.email)) {
                                                    setTempBookedLoad(item.booked_load === 1);
                                                    setTempCheckCalls(item.check_calls === 1);
                                                    setTempCarrierArrivalShipper(item.carrier_arrival_shipper === 1);
                                                    setTempCarrierArrivalConsignee(item.carrier_arrival_consignee === 1);
                                                    setTempLoaded(item.loaded === 1);
                                                    setTempEmpty(item.empty === 1);
                                                }

                                                if (itemIndex > -1) {
                                                    temp[itemIndex] = {...item};
                                                    setTempAutomaticEmails(temp);
                                                } else {
                                                    setTempAutomaticEmails([
                                                        ...tempAutomaticEmails,
                                                        {...item}
                                                    ])
                                                }


                                            }}>
                                                <div className="automatic-email-data">
                                                    <div className="automatic-email-info">
                                                        <div className="automatic-email-type">{item.type}</div>
                                                        <div className="automatic-email-name">
                                                            <b>{item.name !== '' ? item.name : item.email}</b> {item.name !== '' ? '(' + item.email + ')' : ''}
                                                        </div>
                                                    </div>
                                                    <div className="automatic-email-options">
                                                        {(item.booked_load === 1) && <span>Booked Load</span>}
                                                        {(item.check_calls === 1) && <span>Check Calls</span>}
                                                        {(item.carrier_arrival_shipper === 1) &&
                                                            <span>Carrier Arrival Shipper</span>}
                                                        {(item.carrier_arrival_consignee === 1) &&
                                                            <span>Carrier Arrival Consignee</span>}
                                                        {(item.loaded === 1) && <span>Loaded</span>}
                                                        {(item.empty === 1) && <span>Empty</span>}
                                                    </div>
                                                </div>
                                                {
                                                    tempAutomaticEmails.find(e => e.id === item.id && e.type === item.type) !== undefined &&
                                                    <FontAwesomeIcon icon={faPencilAlt}/>
                                                }

                                                {
                                                    ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                    ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer automatic emails')?.pivot?.delete || 1) === 0) &&
                                                    <FontAwesomeIcon icon={faTrashAlt} style={{marginLeft: '0.3rem'}}
                                                                     onClick={(e) => {
                                                                         e.stopPropagation();

                                                                         axios.post(props.serverUrl + '/removeAutomaticEmail', {
                                                                             customer_id: selectedCustomer.id,
                                                                             id: item.id
                                                                         }).then(res => {
                                                                             if (res.data.result === 'OK') {
                                                                                 setSelectedCustomer({
                                                                                     ...selectedCustomer,
                                                                                     automatic_emails: res.data.automatic_emails
                                                                                 });

                                                                                 setTempAutomaticEmails(tempAutomaticEmails.filter(t => (t.email !== item.email && t.type === item.type) || (t.type !== item.type)))
                                                                             }
                                                                         }).catch(e => {
                                                                             console.log('error saving automatic emails', e);
                                                                         })
                                                                     }}/>
                                                }
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="fields-container-col">
                        <div className="form-borderless-box" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            justifyContent: 'space-between',
                            flexGrow: 1
                        }}>
                            <div className="form-bordered-box" style={{maxHeight: 'calc(50% - 5px)', justifyContent: 'space-around'}}>
                                <div className="form-header">
                                    <div className="top-border top-border-left"></div>
                                    <div className="form-title">Hours</div>
                                    <div className="top-border top-border-middle"></div>
                                    <div className="top-border top-border-right"></div>
                                </div>

                                <div className="form-row" style={{justifyContent: 'space-around'}}>
                                    <div className="input-box-container ">
                                        <input tabIndex={39 + props.tabTimes} type="text" placeholder="Open"
                                               readOnly={
                                                   (props.user?.user_code?.is_admin || 0) === 0 &&
                                                   (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer hours')?.pivot?.save || 0) === 0 &&
                                                       ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer hours')?.pivot?.edit || 0) === 0)
                                               }
                                               onBlur={(e) => validateHoursForSaving(e, 'hours open')}
                                               onChange={e => {
                                                   let hours = (selectedCustomer?.hours || {});
                                                   hours.hours_open = e.target.value;
                                                   setSelectedCustomer({...selectedCustomer, hours: hours});
                                               }}
                                               value={(selectedCustomer?.hours?.hours_open || '')}/>
                                    </div>
                                    <div className="form-h-sep"></div>
                                    <div className="input-box-container ">
                                        <input tabIndex={40 + props.tabTimes} type="text" placeholder="Close"
                                               readOnly={
                                                   (props.user?.user_code?.is_admin || 0) === 0 &&
                                                   (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer hours')?.pivot?.save || 0) === 0 &&
                                                       ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer hours')?.pivot?.edit || 0) === 0)
                                               }
                                               onBlur={(e) => validateHoursForSaving(e, 'hours close')}
                                               onChange={e => {
                                                   let hours = (selectedCustomer?.hours || {});
                                                   hours.hours_close = e.target.value;
                                                   setSelectedCustomer({...selectedCustomer, hours: hours});
                                               }}
                                               value={(selectedCustomer?.hours?.hours_close || '')}/>
                                    </div>
                                </div>

                                <div className="form-row" style={{justifyContent: 'space-around'}}>
                                    <div className="input-box-container ">
                                        <input tabIndex={41 + props.tabTimes} type="text" placeholder="Open"
                                               readOnly={
                                                   (props.user?.user_code?.is_admin || 0) === 0 &&
                                                   (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer hours')?.pivot?.save || 0) === 0 &&
                                                       ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer hours')?.pivot?.edit || 0) === 0)
                                               }
                                               onBlur={(e) => validateHoursForSaving(e, 'hours open 2')}
                                               onChange={e => {
                                                   let hours = (selectedCustomer?.hours || {});
                                                   hours.hours_open2 = e.target.value;
                                                   setSelectedCustomer({...selectedCustomer, hours: hours});
                                               }}
                                               value={(selectedCustomer?.hours?.hours_open2 || '')}/>
                                    </div>
                                    <div className="form-h-sep"></div>
                                    <div className="input-box-container ">
                                        <input tabIndex={42 + props.tabTimes} type="text" placeholder="Close"
                                               readOnly={
                                                   (props.user?.user_code?.is_admin || 0) === 0 &&
                                                   (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer hours')?.pivot?.save || 0) === 0 &&
                                                       ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer hours')?.pivot?.edit || 0) === 0)
                                               }
                                               onBlur={(e) => validateHoursForSaving(e, 'hours close 2')}
                                               onChange={e => {
                                                   let hours = (selectedCustomer?.hours || {});
                                                   hours.hours_close2 = e.target.value;
                                                   setSelectedCustomer({...selectedCustomer, hours: hours});
                                               }}
                                               value={(selectedCustomer?.hours?.hours_close2 || '')}/>
                                    </div>
                                </div>
                            </div>

                            <div className="form-bordered-box" style={{maxHeight: 'calc(50% - 5px)', justifyContent: 'space-around'}}>
                                <div className="form-header">
                                    <div className="top-border top-border-left"></div>
                                    <div className="form-title">Delivery Hours</div>
                                    <div className="top-border top-border-middle"></div>
                                    <div className="top-border top-border-right"></div>
                                </div>

                                <div className="form-row" style={{justifyContent: 'space-around'}}>
                                    <div className="input-box-container ">
                                        <input tabIndex={43 + props.tabTimes} type="text" placeholder="Open"
                                               readOnly={
                                                   (props.user?.user_code?.is_admin || 0) === 0 &&
                                                   (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer delivery hours')?.pivot?.save || 0) === 0 &&
                                                       ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer delivery hours')?.pivot?.edit || 0) === 0)
                                               }
                                               onBlur={(e) => validateHoursForSaving(e, 'delivery hours open')}
                                               onChange={e => {
                                                   let hours = (selectedCustomer?.hours || {});
                                                   hours.delivery_hours_open = e.target.value;
                                                   setSelectedCustomer({...selectedCustomer, hours: hours});
                                               }}
                                               value={(selectedCustomer?.hours?.delivery_hours_open || '')}/>
                                    </div>
                                    <div className="form-h-sep"></div>
                                    <div className="input-box-container ">
                                        <input tabIndex={44 + props.tabTimes} type="text" placeholder="Close"
                                               readOnly={
                                                   (props.user?.user_code?.is_admin || 0) === 0 &&
                                                   (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer delivery hours')?.pivot?.save || 0) === 0 &&
                                                       ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer delivery hours')?.pivot?.edit || 0) === 0)
                                               }
                                               onBlur={(e) => validateHoursForSaving(e, 'delivery hours close')}
                                               onChange={e => {
                                                   let hours = (selectedCustomer?.hours || {});
                                                   hours.delivery_hours_close = e.target.value;
                                                   setSelectedCustomer({...selectedCustomer, hours: hours});
                                               }}
                                               value={(selectedCustomer?.hours?.delivery_hours_close || '')}/>
                                    </div>
                                </div>

                                <div className="form-row" style={{justifyContent: 'space-around'}}>
                                    <div className="input-box-container ">
                                        <input tabIndex={45 + props.tabTimes} type="text" placeholder="Open"
                                               readOnly={
                                                   (props.user?.user_code?.is_admin || 0) === 0 &&
                                                   (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer delivery hours')?.pivot?.save || 0) === 0 &&
                                                       ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer delivery hours')?.pivot?.edit || 0) === 0)
                                               }
                                               onBlur={(e) => validateHoursForSaving(e, 'delivery hours open 2')}
                                               onChange={e => {
                                                   let hours = (selectedCustomer?.hours || {});
                                                   hours.delivery_hours_open2 = e.target.value;
                                                   setSelectedCustomer({...selectedCustomer, hours: hours});
                                               }}
                                               value={(selectedCustomer?.hours?.delivery_hours_open2 || '')}/>
                                    </div>
                                    <div className="form-h-sep"></div>
                                    <div className="input-box-container ">
                                        <input tabIndex={46 + props.tabTimes} type="text" placeholder="Close"
                                               readOnly={
                                                   (props.user?.user_code?.is_admin || 0) === 0 &&
                                                   (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer delivery hours')?.pivot?.save || 0) === 0 &&
                                                       ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer delivery hours')?.pivot?.edit || 0) === 0)
                                               }
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

                                                       refCustomerCode.current.focus();
                                                   }
                                               }}
                                               onBlur={(e) => validateHoursForSaving(e, 'delivery hours close 2')}
                                               onChange={e => {
                                                   let hours = (selectedCustomer?.hours || {});
                                                   hours.delivery_hours_close2 = e.target.value;
                                                   setSelectedCustomer({...selectedCustomer, hours: hours});
                                               }}
                                               value={(selectedCustomer?.hours?.delivery_hours_close2 || '')}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fields-container-row grow">
                    <div className="fields-container-col">
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Notes</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div className={
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer notes')?.pivot?.edit || 0) === 0))
                                        ? 'mochi-button disabled' : 'mochi-button'
                                    } onClick={() => {
                                        if ((selectedCustomer?.id || 0) === 0) {
                                            window.alert('You must select a customer first!');
                                            return;
                                        }

                                        setSelectedNote({id: 0, customer_id: selectedCustomer.id})
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Add Note</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className="mochi-button" onClick={() => {
                                        if (selectedCustomer?.id === undefined || selectedCustomer?.notes.length === 0) {
                                            window.alert('There is nothing to print!');
                                            return;
                                        }

                                        let html = ``;

                                        selectedCustomer?.notes.map((note, index) => {
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
                                        (selectedCustomer?.notes || []).map((note, index) => {
                                            return (
                                                <div className="notes-list-item" key={index}
                                                     onClick={() => setSelectedNote(note)}>
                                                    <div className="notes-list-col tcol note-text">{note.text}</div>
                                                    {
                                                        (note.id === (selectedNote?.id || 0)) &&
                                                        <div className="notes-list-col tcol notes-selected">
                                                            <FontAwesomeIcon icon={faPencilAlt}/>
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
                    <div className="fields-container-col">
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Directions</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div className={
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer directions')?.pivot?.edit || 0) === 0))
                                            ? 'mochi-button disabled' : 'mochi-button'
                                    } onClick={() => {
                                        if ((selectedCustomer?.id || 0) === 0) {
                                            window.alert('You must select a customer first!');
                                            return;
                                        }

                                        setSelectedDirection({id: 0, customer_id: selectedCustomer?.id})
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Add direction</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>

                                    <div className="mochi-button" onClick={() => {
                                        if (selectedCustomer?.id === undefined || selectedCustomer?.directions.length === 0) {
                                            window.alert('There is nothing to print!');
                                            return;
                                        }

                                        let html = ``;

                                        selectedCustomer?.directions.map((direction, index) => {
                                            html += `<div> ${direction.text}</div>`

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

                            <div className="directions-list-container">
                                <div className="directions-list-wrapper">
                                    {
                                        (selectedCustomer?.directions || []).map((direction, index) => {
                                            return (
                                                <div className="directions-list-item" key={index}
                                                     onClick={() => setSelectedDirection(direction)}>
                                                    <div
                                                        className="directions-list-col tcol note-text">{direction.text}</div>
                                                    {
                                                        (direction.id === (selectedDirection?.id || 0)) &&
                                                        <div className="directions-list-col tcol directions-selected">
                                                            <FontAwesomeIcon icon={faPencilAlt}/>
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

                    <div className="fields-container-col">
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
                                        (selectedCustomer?.orders || []).map((order, index) => {
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
                                                            openPanel={props.openPanel}
                                                            closePanel={props.closePanel}
                                                            componentId={moment().format('x')}

                                                            order_id={order.id}
                                                        />
                                                    }

                                                    props.openPanel(panel, props.origin);
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
                                loadingCustomerOrdersTransition((style, item) => item &&
                                    <animated.div className='loading-container' style={style}>
                                        <div className="loading-container-wrapper">
                                            <Loader type="Circles" color="#009bdd" height={40} width={40}
                                                    visible={item}/>
                                        </div>
                                    </animated.div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

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

                <div className={
                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                        (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer print customer info')?.pivot?.edit || 0) === 0))
                        ? 'mochi-button disabled wrap' : 'mochi-button wrap'
                } onClick={() => {
                    if ((selectedCustomer?.id || 0) === 0) {
                        window.alert('There is nothing to print!');
                        return;
                    }

                    handledPrintCustomerInformation();
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Print Customer Information</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className={
                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                        (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer email customer')?.pivot?.edit || 0) === 0))
                        ? 'mochi-button disabled wrap' : 'mochi-button wrap'
                }>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">E-Mail Customer</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className={
                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                        (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer crm')?.pivot?.edit || 0) === 0))
                        ? 'mochi-button disabled wrap' : 'mochi-button wrap'
                }>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">CRM</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>
            </div>

            {
                noteTransition((style, item) => item && (
                    <animated.div style={{...style}}>
                        <CustomerModal
                            selectedData={selectedNote}
                            setSelectedData={setSelectedNote}
                            selectedParent={selectedCustomer}
                            setSelectedParent={(data) => {
                                setSelectedCustomer({...selectedCustomer, notes: data.notes});
                                props.setSelectedCustomer({...selectedCustomer, notes: data.notes})
                            }}
                            savingDataUrl='/saveCustomerNote'
                            deletingDataUrl='/deleteCustomerNote'
                            type='note'
                            isEditable={
                                ((props.user?.user_code?.is_admin || 0) === 1 ||
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer notes')?.pivot?.edit || 0) === 1))
                            }
                            isDeletable={
                                ((props.user?.user_code?.is_admin || 0) === 1 ||
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer notes')?.pivot?.delete || 0) === 1))
                            }
                            isAdding={selectedNote.id === 0}
                        />
                    </animated.div>
                ))
            }

            {
                directionTransition((style, item) => item && (
                    <animated.div style={{...style}}>
                        <CustomerModal
                            selectedData={selectedDirection}
                            setSelectedData={setSelectedDirection}
                            selectedParent={selectedCustomer}
                            setSelectedParent={(data) => {
                                setSelectedCustomer({...selectedCustomer, directions: data.notes});
                                props.setSelectedCustomer({...selectedCustomer, directions: data.notes})
                            }}
                            savingDataUrl='/saveCustomerDirection'
                            deletingDataUrl='/deleteCustomerDirection'
                            type='direction'
                            isEditable={
                                ((props.user?.user_code?.is_admin || 0) === 1 ||
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer directions')?.pivot?.edit || 0) === 1))
                            }
                            isDeletable={
                                ((props.user?.user_code?.is_admin || 0) === 1 ||
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === 'customer directions')?.pivot?.delete || 0) === 1))
                            }
                            isAdding={selectedDirection.id === 0}/>
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
        user: state.systemReducers.user,
        companyOpenedPanels: state.companyReducers.companyOpenedPanels,
        adminOpenedPanels: state.adminReducers.adminOpenedPanels,
        dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
        customerOpenedPanels: state.customerReducers.customerOpenedPanels,
        adminCustomerOpenedPanels: state.customerReducers.adminCustomerOpenedPanels,
        adminCarrierOpenedPanels: state.carrierReducers.adminCarrierOpenedPanels,
        loadBoardOpenedPanels: state.loadBoardReducers.loadBoardOpenedPanels,
        invoiceOpenedPanels: state.invoiceReducers.invoiceOpenedPanels,
        selectedCustomer: state.customerReducers.selectedCustomer,
        selectedContact: state.customerReducers.selectedContact,
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
    setSelectedCustomer,
    setSelectedContact,
})(Customers)