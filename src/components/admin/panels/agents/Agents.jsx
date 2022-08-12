// noinspection BadExpressionStatementJS

import React, {useState, useRef, useEffect} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import axios from 'axios';
import Draggable from 'react-draggable';
import {useTransition, animated} from 'react-spring';
import './Agents.css';
import MaskedInput from 'react-text-mask';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faCaretDown,
    faCaretRight,
    faCalendarAlt,
    faCheck,
    faPencilAlt,
    faTrashAlt,
    faCopy
} from '@fortawesome/free-solid-svg-icons';

import {useDetectClickOutside} from "react-detect-click-outside";
import Highlighter from "react-highlight-words";
import "react-datepicker/dist/react-datepicker.css";
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import moment from 'moment';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import ToPrint from './ToPrint.jsx';
import {
    setCompanyOpenedPanels,
    setDispatchOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCarrierOpenedPanels,
    setCompanySetupOpenedPanels,
    setSelectedCompany,
    setSelectedCompanyDriver as setSelectedDriver
} from './../../../../actions';

import {
    Documents,
    Calendar,
    Contacts,
    Modal as AgentModal,
    CustomerSearch, ContactSearch, RevenueInformation, OrderHistory
} from './../../../company/panels';
import {Dispatch} from "../../../company";
import {useReactToPrint} from "react-to-print";

const Agents = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAgentOrders, setIsLoadingAgentOrders] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState({});
    const [selectedContact, setSelectedContact] = useState({});
    const [selectedPrimaryContact, setSelectedPrimaryContact] = useState({});

    const [selectedNote, setSelectedNote] = useState({});

    const refAgentCode = useRef();
    const refAgentName = useRef();
    const refAgentEmail = useRef();
    const refAgentContactFirstName = useRef();
    const refAgentContactPhone = useRef();
    const refAgentMailingCode = useRef();
    const refPrintAgentInformation = useRef();

    const [isSavingAgent, setIsSavingAgent] = useState(false);
    const [isSavingContact, setIsSavingContact] = useState(false);
    const [isSavingMailingAddress, setIsSavingMailingAddress] = useState(false);
    const [contactSearch, setContactSearch] = useState({});
    const [showingContactList, setShowingContactList] = useState(true);

    const [agentContactPhoneItems, setAgentContactPhoneItems] = useState([]);
    const [showAgentContactPhones, setShowAgentContactPhones] = useState(false);
    const refAgentContactPhoneDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowAgentContactPhones(false)
        }
    });
    const refAgentContactPhonePopupItems = useRef([]);

    const refAgentContactEmail = useRef();
    const [agentContactEmailItems, setAgentContactEmailItems] = useState([]);
    const [showAgentContactEmails, setShowAgentContactEmails] = useState(false);
    const refAgentContactEmailDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowAgentContactEmails(false)
        }
    });
    const refAgentContactEmailPopupItems = useRef([]);

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

    const [showAgentEmailCopyBtn, setShowAgentEmailCopyBtn] = useState(false);
    const [showAgentContactEmailCopyBtn, setShowAgentContactEmailCopyBtn] = useState(false);
    const [showMailingContactEmailCopyBtn, setShowMailingContactEmailCopyBtn] = useState(false);

    const refAddedDate = useRef();
    const [preSelectedAddedDate, setPreSelectedAddedDate] = useState(moment());
    const [isAddedDateCalendarShown, setIsAddedDateCalendarShown] = useState(false);
    const refAddedDateCalendarDropDown = useDetectClickOutside({
        onTriggered: (e) => {
            let sameTarget = false;

            (e.path || []).map(el => {
                try {
                    if (el.matches('.added-date-calendar')) {
                        sameTarget = true;
                    }
                } catch (e) {

                }
            })

            if (!sameTarget) {
                setIsAddedDateCalendarShown(false)
            }
        }
    });

    const refTerminationDate = useRef();
    const [preSelectedTerminationDate, setPreSelectedTerminationDate] = useState(moment());
    const [isTerminationDateCalendarShown, setIsTerminationDateCalendarShown] = useState(false);
    const refTerminationDateCalendarDropDown = useDetectClickOutside({
        onTriggered: (e) => {
            let sameTarget = false;

            (e.path || []).map(el => {
                try {
                    if (el.matches('.termination-date-calendar')) {
                        sameTarget = true;
                    }
                } catch (e) {

                }
            })

            if (!sameTarget) {
                setIsTerminationDateCalendarShown(false)
            }
        }
    });

    const refDivision = useRef();
    const [divisionItems, setDivisionItems] = useState([]);
    const refDivisionDropDown = useDetectClickOutside({ onTriggered: async () => { await setDivisionItems([]); } });
    const refDivisionPopupItems = useRef([]);

    const loadingTransition = useTransition(isLoading, {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
        reverse: isLoading,
    });

    const agentContactPhonesTransition = useTransition(showAgentContactPhones, {
        from: {opacity: 0, top: 'calc(100% + 7px)'},
        enter: {opacity: 1, top: 'calc(100% + 12px)'},
        leave: {opacity: 0, top: 'calc(100% + 7px)'},
        config: {duration: 100},
        reverse: showAgentContactPhones
    });

    const agentContactEmailsTransition = useTransition(showAgentContactEmails, {
        from: {opacity: 0, top: 'calc(100% + 7px)'},
        enter: {opacity: 1, top: 'calc(100% + 12px)'},
        leave: {opacity: 0, top: 'calc(100% + 7px)'},
        config: {duration: 100},
        reverse: showAgentContactEmails
    });

    const noteTransition = useTransition(selectedNote?.id !== undefined, {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
        reverse: selectedNote?.id !== undefined,
        config: {duration: 100}
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

    const loadingAgentOrdersTransition = useTransition(isLoadingAgentOrders, {
        from: {opacity: 0, display: 'block'},
        enter: {opacity: 1, display: 'block'},
        leave: {opacity: 0, display: 'none'},
        reverse: isLoadingAgentOrders,
    });

    const addedDateTransition = useTransition(isAddedDateCalendarShown, {
        from: {opacity: 0, display: 'block', top: 'calc(100% + 7px)'},
        enter: {opacity: 1, display: 'block', top: 'calc(100% + 12px)'},
        leave: {opacity: 0, display: 'none', top: 'calc(100% + 7px)'},
        reverse: isAddedDateCalendarShown,
        config: {duration: 100}
    });

    const terminationDateTransition = useTransition(isTerminationDateCalendarShown, {
        from: {opacity: 0, display: 'block', top: 'calc(100% + 7px)'},
        enter: {opacity: 1, display: 'block', top: 'calc(100% + 12px)'},
        leave: {opacity: 0, display: 'none', top: 'calc(100% + 7px)'},
        reverse: isTerminationDateCalendarShown,
        config: {duration: 100}
    });

    const divisionTransition = useTransition(divisionItems.length > 0, {
        from: { opacity: 0, top: "calc(100% + 7px)" },
        enter: { opacity: 1, top: "calc(100% + 12px)" },
        leave: { opacity: 0, top: "calc(100% + 7px)" },
        config: { duration: 100 },
        reverse: divisionItems.length > 0
    });

    const handledPrintAgentInformation = useReactToPrint({
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
        content: () => refPrintAgentInformation.current
    });

    const disabledOnAddingEditing = classnames({
        'disabled': false,
        'input-box-container': true
    })

    const disabledAgentCodeField = classnames({
        'disabled': false,
        'input-box-container': true,
        'input-code': true
    })

    const disabledAgentContactFields = classnames({
        'disabled': false
    })

    const disabledAgentMailingAddressFields = classnames({
        'disabled': false
    })

    const disabledAgentHoursFields = classnames({
        'disabled': false
    })

    useEffect(() => {
        if ((props.selectedAgent?.id || 0) > 0) {
            setIsLoading(true);

            axios.post(props.serverUrl + '/getAgentById', {id: props.selectedAgent.id}).then(res => {
                setSelectedAgent({...(res.data.agent || {})});
                setSelectedContact({...((res.data.agent?.contacts || []).find(c => c.is_primary === 1) || {})});
                setIsLoading(false);
            }).catch(e => {
               console.log('error getting agent', e);
                setIsLoading(false);
            });
        }
    }, [])

    useEffect(() => {
        if ((selectedAgent?.contacts || []).length === 0) {
            setSelectedPrimaryContact({});
        } else {
            if (selectedAgent.contacts.find(c => c.is_primary === 1) === undefined) {
                setSelectedPrimaryContact(selectedAgent.contacts[0]);
            } else {
                setSelectedPrimaryContact(selectedAgent.contacts.find(c => c.is_primary === 1));
            }
        }
    }, [selectedAgent?.contacts])

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

        await setAgentContactPhoneItems(phones);
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

        await setAgentContactEmailItems(emails);
    }, [
        selectedContact?.email_work,
        selectedContact?.email_personal,
        selectedContact?.email_other,
        selectedContact?.primary_email
    ]);

    const saveAgent = (e, fromLast = null) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingAgent) {
                setIsSavingAgent(true);
            }

            if (fromLast){
                refAgentName.current.focus();
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
        if (isSavingAgent) {
            if (selectedAgent.id === undefined || selectedAgent.id === -1) {
                selectedAgent.id = 0;
                setSelectedAgent(selectedAgent => {
                    return {...selectedAgent, id: 0}
                });
            }

            if (
                (selectedAgent.name || '').trim().replace(/\s/g, "").replace("&", "A") !== "" &&
                (selectedAgent.city || '').trim().replace(/\s/g, "") !== "" &&
                (selectedAgent.state || '').trim().replace(/\s/g, "") !== "" &&
                (selectedAgent.address1 || '').trim() !== "" &&
                (selectedAgent.zip || '').trim() !== ""
            ) {
                selectedAgent.state = (selectedAgent.state || '').toUpperCase();

                axios.post(props.serverUrl + '/saveAgent', {
                    ...selectedAgent,
                    company_id: props.selectedCompany.id,
                    contact_first_name: selectedPrimaryContact?.first_name || '',
                    contact_last_name: selectedPrimaryContact?.last_name || '',
                    contact_phone: selectedPrimaryContact?.phone_work || '',
                    contact_phone_ext: selectedPrimaryContact?.phone_ext || '',
                    email: selectedPrimaryContact?.email_work || ''
                }).then(res => {
                    if (res.data.result === 'OK') {
                        let agent = JSON.parse(JSON.stringify(res.data.agent));
                        if ((selectedAgent?.id || 0) === 0) {
                            setSelectedAgent(selectedAgent => {
                                return {
                                    ...selectedAgent,
                                    id: agent.id,
                                    code: agent.code,
                                    contacts: agent.contacts || [],

                                }
                            });

                        } else {
                            setSelectedAgent({
                                ...selectedAgent,
                                contacts: agent.contacts || []
                            });
                        }

                        if ((selectedContact?.id || 0) === 0) {
                            setSelectedContact((agent?.contacts || []).find(c => c.is_primary === 1) || {})
                        }

                        props.setSelectedCompany({
                            ...props.selectedCompany,
                            agents: res.data.agents
                        })
                    }

                    setIsSavingAgent(false);
                }).catch(e => {
                    console.log('error saving agent', e);
                    setIsSavingAgent(false);
                });
            } else {
                setIsSavingAgent(false);
            }
        }
    }, [isSavingAgent])

    useEffect(() => {
        if (isSavingContact) {
            if ((selectedAgent?.id || 0) === 0) {
                setIsSavingContact(false);
                return;
            }

            if (selectedContact.agent_id === undefined || selectedContact.agent_id === 0) {
                selectedContact.agent_id = selectedAgent.id;
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
                selectedContact.address1 = selectedAgent?.address1;
                selectedContact.address2 = selectedAgent?.address2;
                selectedContact.city = selectedAgent?.city;
                selectedContact.state = selectedAgent?.state;
                selectedContact.zip_code = selectedAgent?.zip;
            }

            axios.post(props.serverUrl + '/saveAgentContact', selectedContact).then(res => {
                if (res.data.result === 'OK') {
                    let mailing_contact = selectedAgent?.mailing_address?.mailing_contact || {};

                    if ((mailing_contact?.id || 0) === res.data.contact.id) {
                        mailing_contact = res.data.contact;
                    }
                    setSelectedAgent({
                        ...selectedAgent,
                        contacts: res.data.contacts,
                        mailing_address: {
                            ...selectedAgent.mailing_address,
                            mailing_contact: mailing_contact
                        }
                    });
                    setSelectedContact(res.data.contact);
                }

                setIsSavingContact(false);
            }).catch(e => {
                console.log('error saving agent contact', e);
                setIsSavingContact(false);
            });
        }
    }, [isSavingContact])

    useEffect(() => {
        if (isSavingMailingAddress) {
            if ((selectedAgent.id || 0) > 0) {
                let mailing_address = selectedAgent.mailing_address || {};

                if (mailing_address.id === undefined) {
                    mailing_address.id = 0;
                }

                mailing_address.agent_id = selectedAgent.id;

                if (
                    (mailing_address.name || '').trim().replace(/\s/g, "").replace("&", "A") !== "" &&
                    (mailing_address.city || '').trim().replace(/\s/g, "") !== "" &&
                    (mailing_address.state || '').trim().replace(/\s/g, "") !== "" &&
                    (mailing_address.address1 || '').trim() !== "" &&
                    (mailing_address.zip || '').trim() !== ""
                ) {

                }

                axios.post(props.serverUrl + '/saveAgentMailingAddress', mailing_address).then(res => {
                    if (res.data.result === 'OK') {
                        setSelectedAgent({...selectedAgent, mailing_address: res.data.mailing_address});

                    }

                    setIsSavingMailingAddress(false);
                }).catch(e => {
                    console.log('error on saving agent mailing address', e);
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
        setIsSavingAgent(false);
        setSelectedContact({});
        setSelectedNote({});
        setContactSearch({});
        setShowingContactList(true);

        refAgentCode.current.focus();

        setSelectedAgent({id: 0, code: clearCode ? '' : selectedAgent?.code});
    }

    const searchAgentByCode = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (e.target.value.trim() !== '') {
                setIsLoading(true);

                axios.post(props.serverUrl + '/getAgents', {
                    code: e.target.value.toLowerCase()
                }).then(res => {
                    if (res.data.result === 'OK') {
                        if (res.data.agents.length > 0) {
                            setInitialValues();
                            setSelectedAgent(res.data.agents[0]);
                            setSelectedContact((res.data.agents[0].contacts || []).find(c => c.is_primary === 1) || {});

                            getAgentOrders(res.data.agents[0]);

                            refAgentName.current.focus();
                        } else {
                            setInitialValues(false);
                        }
                    } else {
                        setInitialValues(false);
                    }

                    setIsLoading(false);
                }).catch(e => {
                    console.log('error getting agents', e);
                    setIsLoading(false);
                });
            } else {
                setInitialValues(false);
            }
        }
    }

    const getAgentOrders = (agent) => {
        setIsLoadingAgentOrders(true);
        axios.post(props.serverUrl + '/getAgentOrders', {
            id: agent.id
        }).then(res => {
            if (res.data.result === 'OK') {
                setSelectedAgent({
                    ...agent,
                    orders: res.data.orders
                });
            }
        }).catch(e => {
            console.log('error getting agent orders', e);
        }).finally(() => {
            setIsLoadingAgentOrders(false);
        });
    }

    const searchAgentBtnClick = () => {
        let agentSearch = [
            {
                field: 'Code',
                data: (selectedAgent?.code || '').toLowerCase()
            },
            {
                field: 'Name',
                data: (selectedAgent?.name || '').toLowerCase()
            },
            {
                field: 'City',
                data: (selectedAgent?.city || '').toLowerCase()
            },
            {
                field: 'State',
                data: (selectedAgent?.state || '').toLowerCase()
            },
            {
                field: 'Postal Code',
                data: selectedAgent?.zip || ''
            },
            {
                field: 'Contact First Name',
                data: (selectedAgent?.contact_first_name || '').toLowerCase()
            },
            {
                field: 'Contact Last Name',
                data: (selectedAgent?.contact_last_name || '').toLowerCase()
            },
            {
                field: 'Contact Phone',
                data: selectedAgent?.contact_phone || ''
            },
            {
                field: 'E-Mail',
                data: (selectedAgent?.email || '').toLowerCase()
            }
        ]

        let panel = {
            panelName: `${props.panelName}-agent-search`,
            component: <CustomerSearch
                title='Agent Search Results'
                tabTimes={2000200 + props.tabTimes}
                panelName={`${props.panelName}-agent-search`}
                origin={props.origin}
                suborigin='agent'
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                customerSearch={agentSearch}

                callback={(id) => {
                    new Promise((resolve, reject) => {
                        if ((id || 0) > 0) {
                            axios.post(props.serverUrl + '/getAgentById', {id: id}).then(res => {
                                if (res.data.result === 'OK') {
                                    setSelectedAgent(res.data.agent);
                                    setSelectedContact((res.data.agent.contacts || []).find(c => c.is_primary === 1) || {});

                                    getAgentOrders(res.data.agent);

                                    resolve('OK');
                                } else {
                                    reject('no agent');
                                }
                            });
                        }
                    }).then(response => {
                        props.closePanel(`${props.panelName}-agent-search`, props.origin);
                        refAgentName.current.focus();
                    }).catch(e => {
                        props.closePanel(`${props.panelName}-agent-search`, props.origin);
                        refAgentCode.current.focus();
                    })

                }}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const handleContactSearch = () => {
        let filters = [
            {
                field: 'Agent Id',
                data: selectedAgent?.id || 0
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
                owner='agent'
                origin={props.origin}
                suborigin='agent'
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                contactSearch={{search: filters}}

                callback={(contact) => {
                    new Promise((resolve, reject) => {
                        if (contact) {
                            setSelectedAgent(contact.agent);
                            setSelectedContact(contact);
                            setShowingContactList(true);
                            setContactSearch({});
                            resolve('OK');
                        } else {
                            reject('no contact');
                        }
                    }).then(response => {
                        props.closePanel(`${props.panelName}-contact-search`, props.origin);
                        refAgentName.current.focus();
                    }).catch(e => {
                        props.closePanel(`${props.panelName}-contact-search`, props.origin);
                        refAgentCode.current.focus();
                    })
                }}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const remitToAddressBtn = () => {
        if ((selectedAgent?.id || 0) === 0) {
            window.alert('You must select a agent first');
            return;
        }

        let mailing_address = {};

        mailing_address.id = -1;
        mailing_address.agent_id = selectedAgent.id;
        mailing_address.code = selectedAgent.code;
        mailing_address.name = selectedAgent.name;
        mailing_address.address1 = selectedAgent.address1;
        mailing_address.address2 = selectedAgent.address2;
        mailing_address.city = selectedAgent.city;
        mailing_address.state = selectedAgent.state;
        mailing_address.zip = selectedAgent.zip;
        mailing_address.contact_first_name = selectedAgent.contact_first_name;
        mailing_address.contact_last_name = selectedAgent.contact_last_name;
        mailing_address.contact_phone = selectedAgent.contact_phone;
        mailing_address.ext = selectedAgent.ext;
        mailing_address.email = selectedAgent.email;

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

        } else if (selectedAgent.contacts.findIndex(x => x.is_primary === 1) > -1) {
            mailing_address.mailing_contact_id = selectedAgent.contacts[selectedAgent.contacts.findIndex(x => x.is_primary === 1)].id;
            mailing_address.mailing_contact = selectedAgent.contacts[selectedAgent.contacts.findIndex(x => x.is_primary === 1)];

            mailing_address.mailing_contact_primary_phone = selectedAgent.contacts[selectedAgent.contacts.findIndex(x => x.is_primary === 1)].phone_work !== ''
                ? 'work'
                : selectedAgent.contacts[selectedAgent.contacts.findIndex(x => x.is_primary === 1)].phone_work_fax !== ''
                    ? 'fax'
                    : selectedAgent.contacts[selectedAgent.contacts.findIndex(x => x.is_primary === 1)].phone_mobile !== ''
                        ? 'mobile'
                        : selectedAgent.contacts[selectedAgent.contacts.findIndex(x => x.is_primary === 1)].phone_direct !== ''
                            ? 'direct'
                            : selectedAgent.contacts[selectedAgent.contacts.findIndex(x => x.is_primary === 1)].phone_other !== ''
                                ? 'other' : 'work';

            mailing_address.mailing_contact_primary_email = selectedAgent.contacts[selectedAgent.contacts.findIndex(x => x.is_primary === 1)].email_work !== ''
                ? 'work'
                : selectedAgent.contacts[selectedAgent.contacts.findIndex(x => x.is_primary === 1)].email_personal !== ''
                    ? 'personal'
                    : selectedAgent.contacts[selectedAgent.contacts.findIndex(x => x.is_primary === 1)].email_other !== ''
                        ? 'other' : 'work';

        } else if (selectedAgent.contacts.length > 0) {
            mailing_address.mailing_contact_id = selectedAgent.contacts[0].id;
            mailing_address.mailing_contact = selectedAgent.contacts[0];

            mailing_address.mailing_contact_primary_phone = selectedAgent.contacts[0].phone_work !== ''
                ? 'work'
                : selectedAgent.contacts[0].phone_work_fax !== ''
                    ? 'fax'
                    : selectedAgent.contacts[0].phone_mobile !== ''
                        ? 'mobile'
                        : selectedAgent.contacts[0].phone_direct !== ''
                            ? 'direct'
                            : selectedAgent.contacts[0].phone_other !== ''
                                ? 'other' : 'work';

            mailing_address.mailing_contact_primary_email = selectedAgent.contacts[0].email_work !== ''
                ? 'work'
                : selectedAgent.contacts[0].email_personal !== ''
                    ? 'personal'
                    : selectedAgent.contacts[0].email_other !== ''
                        ? 'other' : 'work';

        } else {
            mailing_address.mailing_contact_id = null;
            mailing_address.mailing_contact = {};
            mailing_address.mailing_contact_primary_phone = 'work';
            mailing_address.mailing_contact_primary_email = 'work';
        }

        setSelectedAgent({...selectedAgent, mailing_address: mailing_address});

        saveMailingAddress({keyCode: 9});
    }

    const mailingAddressClearBtn = () => {
        setSelectedAgent({
            ...selectedAgent,
            mailing_address: {}
        });

        if ((selectedAgent?.id || 0) > 0) {
            axios.post(props.serverUrl + '/deleteAgentMailingAddress', {
                agent_id: selectedAgent.id
            }).then(res => {
                if (res.data.result === 'OK') {
                    console.log('divivion mailing address deleted')
                }
            })
        }
        refAgentMailingCode.current.focus();
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

        let hours = { ...selectedAgent?.hours || {}, agent_id: selectedAgent?.id };

        if (name === 'hours open') {
            hours.hours_open = formatted;
        }
        if (name === 'hours close') {
            hours.hours_close = formatted;
        }
        if (name === 'hours open 2') {
            hours.hours_open2 = formatted;
        }
        if (name === 'hours close 2') {
            hours.hours_close2 = formatted;
        }

        setSelectedAgent({ ...selectedAgent, hours: hours });

        if (name === 'hours close 2'){
            axios.post(props.serverUrl + '/saveAgentHours', hours).then(async res => {
                if (res.data.result === 'OK') {
                    await setSelectedAgent({ ...selectedAgent, hours: res.data.hours });
                }
            }).catch(e => {
                console.log('error saving agent hours', e);
            })
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

        }

        return formattedDate;
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
                suborigin={'agent'}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                isAdmin={props.isAdmin}
                selectedAgent={selectedAgent}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const orderHistoryBtnClick = () => {
        let panel = {
            panelName: `${props.panelName}-order-history`,
            component: <OrderHistory
                title='Order History'
                tabTimes={2400001 + props.tabTimes}
                panelName={`${props.panelName}-order-history`}
                origin={props.origin}
                suborigin={'agent'}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                componentId={moment().format('x')}
                isAdmin={props.isAdmin}
                selectedAgent={selectedAgent}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const documentsBtnClick = () => {
        if ((selectedAgent?.id || 0) > 0) {
            let panel = {
                panelName: `${props.panelName}-documents`,
                component: <Documents
                    title='Documents'
                    tabTimes={266000 + props.tabTimes}
                    panelName={`${props.panelName}-documents`}
                    origin={props.origin}
                    suborigin={'company-agent'}
                    openPanel={props.openPanel}
                    closePanel={props.closePanel}
                    componentId={moment().format('x')}
                    selectedOwner={{...selectedAgent}}
                    isAdmin={props.isAdmin}
                    selectedOwnerDocument={{
                        id: 0,
                        user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                        date_entered: moment().format('MM/DD/YYYY')
                    }}
                    savingDocumentUrl='/saveAgentDocument'
                    deletingDocumentUrl='/deleteAgentDocument'
                    savingDocumentNoteUrl='/saveAgentDocumentNote'
                    serverDocumentsFolder='/agent-documents/'
                    setSelectedAgent={setSelectedAgent}
                />
            }

            props.openPanel(panel, props.origin);
        } else {
            window.alert('You must select a agent first!');
        }
    }

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div>
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
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item}/>
                        </div>
                    </animated.div>
                )
            }

            {
                (selectedAgent?.id || 0) > 0 &&
                <div style={{display: 'none'}}>
                    <ToPrint
                        ref={refPrintAgentInformation}
                        selectedAgent={selectedAgent}
                    />
                </div>

            }

            <div className="agents-main-content">
                <div className="fields-container-col">
                    <div className="fields-container-row">
                        {/*AGENT FORM*/}
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Agents</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div className="mochi-button" onClick={() => {
                                        searchAgentBtnClick();
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
                                <div className={disabledAgentCodeField}>
                                    <input tabIndex={1 + props.tabTimes} type="text" placeholder="Code" maxLength="8"
                                           id="txt-agent-code"
                                           ref={refAgentCode}
                                           onKeyDown={(e) => {
                                               searchAgentByCode(e)
                                           }}
                                           onInput={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   code: e.target.value
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   code: e.target.value
                                               })
                                           }}
                                           value={selectedAgent?.code || ''}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledOnAddingEditing + ' grow'}>
                                    <input tabIndex={2 + props.tabTimes} type="text" placeholder="Name"
                                           ref={refAgentName}
                                           onChange={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   name: e.target.value
                                               })
                                           }}
                                           value={selectedAgent?.name || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledOnAddingEditing + ' grow'}>
                                    <input tabIndex={3 + props.tabTimes} type="text" placeholder="Address 1"
                                           onChange={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   address1: e.target.value
                                               })
                                           }}
                                           value={selectedAgent?.address1 || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledOnAddingEditing + ' grow'}>
                                    <input tabIndex={4 + props.tabTimes} type="text" placeholder="Address 2"
                                           onChange={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   address2: e.target.value
                                               })
                                           }}
                                           value={selectedAgent?.address2 || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledOnAddingEditing + ' grow'}>
                                    <input tabIndex={5 + props.tabTimes} type="text" placeholder="City"
                                           onChange={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   city: e.target.value
                                               })
                                           }}
                                           value={selectedAgent?.city || ''}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledOnAddingEditing + ' input-state'}>
                                    <input tabIndex={6 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                           onChange={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   state: e.target.value
                                               })
                                           }}
                                           value={selectedAgent?.state || ''}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledOnAddingEditing + ' input-zip-code'}>
                                    <input tabIndex={7 + props.tabTimes} type="text" placeholder="Postal Code"
                                           onChange={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   zip: e.target.value
                                               })
                                           }}
                                           value={selectedAgent?.zip || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledOnAddingEditing + ' grow'}>
                                    <input tabIndex={8 + props.tabTimes} type="text" placeholder="Contact First Name"
                                           onChange={e => {
                                               setSelectedPrimaryContact({
                                                   ...selectedPrimaryContact,
                                                   first_name: e.target.value
                                               })
                                           }}
                                           value={selectedPrimaryContact.first_name || ''}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledOnAddingEditing + ' grow'}>
                                    <input tabIndex={9 + props.tabTimes} type="text" placeholder="Contact Last Name"
                                           onChange={e => {
                                               setSelectedPrimaryContact({
                                                   ...selectedPrimaryContact,
                                                   last_name: e.target.value
                                               })
                                           }}
                                           value={selectedPrimaryContact.last_name || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledOnAddingEditing + ' input-phone'}
                                     style={{position: 'relative'}}>
                                    <MaskedInput
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
                                        (selectedPrimaryContact?.id || 0 > 0) &&
                                        <div
                                            className={classnames({
                                                'selected-agent-contact-primary-phone': true,
                                                'pushed': false
                                            })}>
                                            {selectedPrimaryContact?.primary_phone || ''}
                                        </div>
                                    }
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledOnAddingEditing + ' input-phone-ext'}>
                                    <input tabIndex={11 + props.tabTimes} type="text" placeholder="Ext"
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
                                     style={{position: 'relative', flexGrow: 1, minWidth: '50%'}}
                                     onMouseEnter={() => {
                                         if ((selectedPrimaryContact?.email_work || '') !== '' ||
                                             (selectedPrimaryContact?.email_personal || '') !== '' ||
                                             (selectedPrimaryContact?.email_other || '') !== '') {
                                             setShowAgentEmailCopyBtn(true);
                                         }
                                     }}
                                     onFocus={() => {
                                         if ((selectedPrimaryContact?.email_work || '') !== '' ||
                                             (selectedPrimaryContact?.email_personal || '') !== '' ||
                                             (selectedPrimaryContact?.email_other || '') !== '') {
                                             setShowAgentEmailCopyBtn(true);
                                         }
                                     }}
                                     onBlur={() => {
                                         window.setTimeout(() => {
                                             setShowAgentEmailCopyBtn(false);
                                         }, 1000);
                                     }}
                                     onMouseLeave={() => {
                                         setShowAgentEmailCopyBtn(false);
                                     }}
                                >
                                    <input tabIndex={12 + props.tabTimes}
                                           ref={refAgentEmail}
                                           type="text"
                                           placeholder="E-Mail"
                                           style={{textTransform: 'lowercase'}}
                                           onKeyDown={(e) => {
                                               let key = e.keyCode || e.which;

                                               if (key === 9){
                                                   saveAgent(e);
                                               }
                                           }}
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
                                        (selectedPrimaryContact?.id || 0 > 0) &&
                                        <div
                                            className={classnames({
                                                'selected-agent-contact-primary-email': true,
                                                'pushed': false
                                            })}>
                                            {selectedPrimaryContact?.primary_email || ''}
                                        </div>
                                    }

                                    {
                                        showAgentEmailCopyBtn &&
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
                                            navigator.clipboard.writeText(refAgentEmail.current.value);
                                        }}/>
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
                                        if (selectedAgent?.id === undefined) {
                                            window.alert('You must select a agent first!');
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
                                                savingContactUrl='/saveAgentContact'
                                                deletingContactUrl='/deleteAgentContact'
                                                uploadAvatarUrl='/uploadAgentContactAvatar'
                                                removeAvatarUrl='/removeDivisioContactAvatar'
                                                origin={props.origin}
                                                owner='agent'
                                                openPanel={props.openPanel}
                                                closePanel={props.closePanel}
                                                componentId={moment().format('x')}

                                                contactSearchCustomer={{
                                                    ...selectedAgent,
                                                    selectedContact: {
                                                        ...selectedContact,
                                                        address1: (selectedAgent?.address1 || '').toLowerCase() === (selectedContact?.address1 || '').toLowerCase() ? (selectedAgent?.address1 || '') : (selectedContact?.address1 || ''),
                                                        address2: (selectedAgent?.address2 || '').toLowerCase() === (selectedContact?.address2 || '').toLowerCase() ? (selectedAgent?.address2 || '') : (selectedContact?.address2 || ''),
                                                        city: (selectedAgent?.city || '').toLowerCase() === (selectedContact?.city || '').toLowerCase() ? (selectedAgent?.city || '') : (selectedContact?.city || ''),
                                                        state: (selectedAgent?.state || '').toLowerCase() === (selectedContact?.state || '').toLowerCase() ? (selectedAgent?.state || '') : (selectedContact?.state || ''),
                                                        zip_code: (selectedAgent?.zip || '').toLowerCase() === (selectedContact?.zip_code || '').toLowerCase() ? (selectedAgent?.zip || '') : (selectedContact?.zip_code || ''),
                                                    }
                                                }}
                                                selectedAgent={selectedAgent}
                                                setSelectedAgent={setSelectedAgent}
                                                setSelectedAgentContact={setSelectedContact}
                                            />
                                        }

                                        props.openPanel(panel, props.origin);
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">More</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className="mochi-button" onClick={() => {
                                        if ((selectedAgent?.id || 0) === 0) {
                                            window.alert('You must select a agent first!');
                                            return;
                                        }

                                        let panel = {
                                            panelName: `${props.panelName}-contacts`,
                                            component: <Contacts
                                                title='Contacts'
                                                tabTimes={22000 + props.tabTimes}
                                                panelName={`${props.panelName}-contacts`}
                                                savingContactUrl='/saveAgentContact'
                                                deletingContactUrl='/deleteAgentContact'
                                                uploadAvatarUrl='/uploadAgentContactAvatar'
                                                removeAvatarUrl='/removeDivisioContactAvatar'
                                                origin={props.origin}
                                                owner='agent'
                                                openPanel={props.openPanel}
                                                closePanel={props.closePanel}
                                                componentId={moment().format('x')}
                                                isEditingContact={true}

                                                contactSearchCustomer={{
                                                    ...selectedAgent,
                                                    selectedContact: {id: 0, agent_id: selectedAgent?.id}
                                                }}

                                                selectedAgent={selectedAgent}
                                                setSelectedAgent={setSelectedAgent}
                                                setSelectedAgentContact={setSelectedContact}
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
                                        refAgentContactFirstName.current.focus();
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Clear</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                </div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="form-row">
                                <div className={disabledAgentContactFields + ' input-box-container grow'}>
                                    <input tabIndex={13 + props.tabTimes} type="text" placeholder="First Name"
                                           ref={refAgentContactFirstName}
                                           onChange={e => {
                                               setSelectedContact({...selectedContact, first_name: e.target.value})
                                           }}
                                           value={selectedContact?.first_name || ''}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledAgentContactFields + ' input-box-container grow'}>
                                    <input tabIndex={14 + props.tabTimes} type="text" placeholder="Last Name"
                                           onChange={e => setSelectedContact({
                                               ...selectedContact,
                                               last_name: e.target.value
                                           })}
                                           value={selectedContact?.last_name || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledAgentContactFields + ' select-box-container'}
                                     style={{width: '50%'}}>
                                    <div className="select-box-wrapper">
                                        <MaskedInput tabIndex={15 + props.tabTimes}
                                                     mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                     guide={true}
                                                     type="text"
                                                     placeholder="Phone"
                                                     ref={refAgentContactPhone}
                                                     onKeyDown={async (e) => {
                                                         let key = e.keyCode || e.which;

                                                         switch (key) {
                                                             case 37:
                                                             case 38: // arrow left | arrow up
                                                                 e.preventDefault();
                                                                 if (showAgentContactPhones) {
                                                                     let selectedIndex = agentContactPhoneItems.findIndex(item => item.selected);

                                                                     if (selectedIndex === -1) {
                                                                         await setAgentContactPhoneItems(agentContactPhoneItems.map((item, index) => {
                                                                             item.selected = index === 0;
                                                                             return item;
                                                                         }))
                                                                     } else {
                                                                         await setAgentContactPhoneItems(agentContactPhoneItems.map((item, index) => {
                                                                             if (selectedIndex === 0) {
                                                                                 item.selected = index === (agentContactPhoneItems.length - 1);
                                                                             } else {
                                                                                 item.selected = index === (selectedIndex - 1)
                                                                             }
                                                                             return item;
                                                                         }))
                                                                     }

                                                                     refAgentContactPhonePopupItems.current.map((r, i) => {
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
                                                                     if (agentContactPhoneItems.length > 1) {
                                                                         await setAgentContactPhoneItems(agentContactPhoneItems.map((item, index) => {
                                                                             item.selected = item.type === (selectedContact?.primary_phone || '')
                                                                             return item;
                                                                         }))

                                                                         setShowAgentContactPhones(true);

                                                                         refAgentContactPhonePopupItems.current.map((r, i) => {
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
                                                                 if (showAgentContactPhones) {
                                                                     let selectedIndex = agentContactPhoneItems.findIndex(item => item.selected);

                                                                     if (selectedIndex === -1) {
                                                                         await setAgentContactPhoneItems(agentContactPhoneItems.map((item, index) => {
                                                                             item.selected = index === 0;
                                                                             return item;
                                                                         }))
                                                                     } else {
                                                                         await setAgentContactPhoneItems(agentContactPhoneItems.map((item, index) => {
                                                                             if (selectedIndex === (agentContactPhoneItems.length - 1)) {
                                                                                 item.selected = index === 0;
                                                                             } else {
                                                                                 item.selected = index === (selectedIndex + 1)
                                                                             }
                                                                             return item;
                                                                         }))
                                                                     }

                                                                     refAgentContactPhonePopupItems.current.map((r, i) => {
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
                                                                     if (agentContactPhoneItems.length > 1) {
                                                                         await setAgentContactPhoneItems(agentContactPhoneItems.map((item, index) => {
                                                                             item.selected = item.type === (selectedContact?.primary_phone || '')
                                                                             return item;
                                                                         }))

                                                                         setShowAgentContactPhones(true);

                                                                         refAgentContactPhonePopupItems.current.map((r, i) => {
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
                                                                 setShowAgentContactPhones(false);
                                                                 break;

                                                             case 13: // enter
                                                                 if (showAgentContactPhones && agentContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                                     await setSelectedContact({
                                                                         ...selectedContact,
                                                                         primary_phone: agentContactPhoneItems[agentContactPhoneItems.findIndex(item => item.selected)].type
                                                                     });

                                                                     // validateContactForSaving({ keyCode: 9 });
                                                                     setShowAgentContactPhones(false);
                                                                     refAgentContactPhone.current.inputElement.focus();
                                                                 }
                                                                 break;

                                                             case 9: // tab
                                                                 if (showAgentContactPhones) {
                                                                     e.preventDefault();
                                                                     await setSelectedContact({
                                                                         ...selectedContact,
                                                                         primary_phone: agentContactPhoneItems[agentContactPhoneItems.findIndex(item => item.selected)].type
                                                                     });

                                                                     // validateContactForSaving({ keyCode: 9 });
                                                                     setShowAgentContactPhones(false);
                                                                     refAgentContactPhone.current.inputElement.focus();
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
                                                    'selected-agent-contact-primary-phone': true,
                                                    'pushed': (agentContactPhoneItems.length > 1)
                                                })}>
                                                {selectedContact?.primary_phone || ''}
                                            </div>
                                        }

                                        {
                                            agentContactPhoneItems.length > 1 &&
                                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                                             onClick={async () => {
                                                                 if (showAgentContactPhones) {
                                                                     setShowAgentContactPhones(false);
                                                                 } else {
                                                                     if (agentContactPhoneItems.length > 1) {
                                                                         await setAgentContactPhoneItems(agentContactPhoneItems.map((item, index) => {
                                                                             item.selected = item.type === (selectedContact?.primary_phone || '')
                                                                             return item;
                                                                         }))

                                                                         window.setTimeout(async () => {
                                                                             await setShowAgentContactPhones(true);

                                                                             refAgentContactPhonePopupItems.current.map((r, i) => {
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

                                                                 refAgentContactPhone.current.inputElement.focus();
                                                             }}/>
                                        }
                                    </div>
                                    {
                                        agentContactPhonesTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-contact-phone"
                                                style={{
                                                    ...style,
                                                    left: '0',
                                                    display: 'block'
                                                }}
                                                ref={refAgentContactPhoneDropDown}
                                            >
                                                <div className="mochi-contextual-popup vertical below right"
                                                     style={{height: 150}}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {
                                                                agentContactPhoneItems.map((item, index) => {
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
                                                                                setShowAgentContactPhones(false);
                                                                                refAgentContactPhone.current.inputElement.focus();
                                                                            }}
                                                                            ref={ref => refAgentContactPhonePopupItems.current.push(ref)}
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
                                    <div
                                        className={disabledAgentContactFields + ' input-box-container input-phone-ext'}>
                                        <input tabIndex={16 + props.tabTimes} type="text" placeholder="Ext"
                                            // onKeyDown={validateContactForSaving}
                                               onChange={e => setSelectedContact({
                                                   ...selectedContact,
                                                   phone_ext: e.target.value
                                               })}
                                               value={selectedContact.phone_ext || ''}/>
                                    </div>
                                    <div className={disabledAgentContactFields + ' input-toggle-container'}>
                                        <input type="checkbox"
                                               id={props.panelName + '-cbox-agent-contacts-primary-btn'}
                                               onChange={(e) => {
                                                   setSelectedContact({
                                                       ...selectedContact,
                                                       is_primary: e.target.checked ? 1 : 0
                                                   });

                                                   saveContact({keyCode: 9});
                                               }}
                                               checked={(selectedContact.is_primary || 0) === 1}/>
                                        <label htmlFor={props.panelName + '-cbox-agent-contacts-primary-btn'}>
                                            <div className="label-text">Primary</div>
                                            <div className="input-toggle-btn"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledAgentContactFields + ' select-box-container'}
                                     style={{flexGrow: 1}}
                                     onMouseEnter={() => {
                                         if ((selectedContact?.email_work || '') !== '' ||
                                             (selectedContact?.email_personal || '') !== '' ||
                                             (selectedContact?.email_other || '') !== '') {
                                             setShowAgentContactEmailCopyBtn(true);
                                         }
                                     }}
                                     onFocus={() => {
                                         if ((selectedContact?.email_work || '') !== '' ||
                                             (selectedContact?.email_personal || '') !== '' ||
                                             (selectedContact?.email_other || '') !== '') {
                                             setShowAgentContactEmailCopyBtn(true);
                                         }
                                     }}
                                     onBlur={() => {
                                         window.setTimeout(() => {
                                             setShowAgentContactEmailCopyBtn(false);
                                         }, 1000);
                                     }}
                                     onMouseLeave={() => {
                                         setShowAgentContactEmailCopyBtn(false);
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
                                            ref={refAgentContactEmail}
                                            onKeyDown={async (e) => {
                                                let key = e.keyCode || e.which;

                                                switch (key) {
                                                    case 37:
                                                    case 38: // arrow left | arrow up
                                                        e.preventDefault();
                                                        if (showAgentContactEmails) {
                                                            let selectedIndex = agentContactEmailItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setAgentContactEmailItems(agentContactEmailItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setAgentContactEmailItems(agentContactEmailItems.map((item, index) => {
                                                                    if (selectedIndex === 0) {
                                                                        item.selected = index === (agentContactEmailItems.length - 1);
                                                                    } else {
                                                                        item.selected = index === (selectedIndex - 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refAgentContactEmailPopupItems.current.map((r, i) => {
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
                                                            if (agentContactEmailItems.length > 1) {
                                                                await setAgentContactEmailItems(agentContactEmailItems.map((item, index) => {
                                                                    item.selected = item.type === (selectedContact?.primary_email || '')
                                                                    return item;
                                                                }))

                                                                setShowAgentContactEmails(true);

                                                                refAgentContactEmailPopupItems.current.map((r, i) => {
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
                                                        if (showAgentContactEmails) {
                                                            let selectedIndex = agentContactEmailItems.findIndex(item => item.selected);

                                                            if (selectedIndex === -1) {
                                                                await setAgentContactEmailItems(agentContactEmailItems.map((item, index) => {
                                                                    item.selected = index === 0;
                                                                    return item;
                                                                }))
                                                            } else {
                                                                await setAgentContactEmailItems(agentContactEmailItems.map((item, index) => {
                                                                    if (selectedIndex === (agentContactEmailItems.length - 1)) {
                                                                        item.selected = index === 0;
                                                                    } else {
                                                                        item.selected = index === (selectedIndex + 1)
                                                                    }
                                                                    return item;
                                                                }))
                                                            }

                                                            refAgentContactEmailPopupItems.current.map((r, i) => {
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
                                                            if (agentContactEmailItems.length > 1) {
                                                                await setAgentContactEmailItems(agentContactEmailItems.map((item, index) => {
                                                                    item.selected = item.type === (selectedContact?.primary_email || '')
                                                                    return item;
                                                                }))

                                                                setShowAgentContactEmails(true);

                                                                refAgentContactEmailPopupItems.current.map((r, i) => {
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
                                                        setShowAgentContactEmails(false);
                                                        break;

                                                    case 13: // enter
                                                        if (showAgentContactEmails && agentContactEmailItems.findIndex(item => item.selected) > -1) {
                                                            await setSelectedContact({
                                                                ...selectedContact,
                                                                primary_email: agentContactEmailItems[agentContactEmailItems.findIndex(item => item.selected)].type
                                                            });

                                                            // validateContactForSaving({ keyCode: 9 });
                                                            setShowAgentContactEmails(false);
                                                            refAgentContactEmail.current.focus();
                                                        }
                                                        break;

                                                    case 9: // tab
                                                        if (showAgentContactEmails) {
                                                            e.preventDefault();
                                                            await setSelectedContact({
                                                                ...selectedContact,
                                                                primary_email: agentContactEmailItems[agentContactEmailItems.findIndex(item => item.selected)].type
                                                            });

                                                            // validateContactForSaving({ keyCode: 9 });
                                                            setShowAgentContactEmails(false);
                                                            refAgentContactEmail.current.focus();
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
                                            showAgentContactEmailCopyBtn &&
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
                                                navigator.clipboard.writeText(refAgentContactEmail.current.value);
                                            }}/>
                                        }

                                        {
                                            (selectedContact?.id || 0) > 0 &&
                                            <div
                                                className={classnames({
                                                    'selected-agent-contact-primary-email': true,
                                                    'pushed': (agentContactEmailItems.length > 1)
                                                })}>
                                                {selectedContact?.primary_email || ''}
                                            </div>
                                        }

                                        {
                                            agentContactEmailItems.length > 1 &&
                                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                                             onClick={async () => {
                                                                 if (showAgentContactEmails) {
                                                                     setShowAgentContactEmails(false);
                                                                 } else {
                                                                     if (agentContactEmailItems.length > 1) {
                                                                         await setAgentContactEmailItems(agentContactEmailItems.map((item, index) => {
                                                                             item.selected = item.type === (selectedContact?.primary_email || '')
                                                                             return item;
                                                                         }))

                                                                         window.setTimeout(async () => {
                                                                             await setShowAgentContactEmails(true);

                                                                             refAgentContactEmailPopupItems.current.map((r, i) => {
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

                                                                 refAgentContactEmail.current.focus();
                                                             }}/>
                                        }
                                    </div>
                                    {
                                        agentContactEmailsTransition((style, item) => item && (
                                            <animated.div
                                                className="mochi-contextual-container"
                                                id="mochi-contextual-container-contact-email"
                                                style={{
                                                    ...style,
                                                    left: '0',
                                                    display: 'block'
                                                }}
                                                ref={refAgentContactEmailDropDown}
                                            >
                                                <div className="mochi-contextual-popup vertical below right"
                                                     style={{height: 150}}>
                                                    <div className="mochi-contextual-popup-content">
                                                        <div className="mochi-contextual-popup-wrapper">
                                                            {
                                                                agentContactEmailItems.map((item, index) => {
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
                                                                                setShowAgentContactEmails(false);
                                                                                refAgentContactEmail.current.focus();
                                                                            }}
                                                                            ref={ref => refAgentContactEmailPopupItems.current.push(ref)}
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
                                <div className={disabledAgentContactFields + ' input-box-container grow'}>
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
                        <div className="form-bordered-box" style={{height: 140}}>
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
                                <div className="form-slider-wrapper" style={{left: showingContactList ? 0 : '-100%'}}>
                                    <div className="contact-list-box">
                                        {
                                            (selectedAgent?.contacts || []).length > 0 &&
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
                                                (selectedAgent?.contacts || []).map((contact, index) => {
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
                                                                         owner='agent'
                                                                         openPanel={props.openPanel}
                                                                         closePanel={props.closePanel}
                                                                         componentId={moment().format('x')}

                                                                         contactSearchCustomer={{
                                                                             ...selectedAgent,
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
                    <div className="fields-container-row grow">
                        {/*NOTES LIST*/}
                        <div className="form-bordered-box">
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="form-title">Notes</div>
                                <div className="top-border top-border-middle"></div>
                                <div className="form-buttons">
                                    <div className="mochi-button" onClick={() => {
                                        if ((selectedAgent?.id || 0) === 0) {
                                            window.alert('You must select a agent first!');
                                            return;
                                        }

                                        setSelectedNote({id: 0, agent_id: selectedAgent.id})
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Add Note</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                    <div className="mochi-button" onClick={() => {
                                        if (selectedAgent?.id === undefined || selectedAgent?.notes.length === 0) {
                                            window.alert('There is nothing to print!');
                                            return;
                                        }

                                        let html = ``;

                                        selectedAgent?.notes.map((note, index) => {
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
                                        (selectedAgent?.notes || []).map((note, index) => {
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
                </div>


                <div className="fields-container-col">
                    <div className="fields-container-row" style={{display: 'flex', flexDirection: 'row'}}>
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
                                <div className={disabledAgentMailingAddressFields + ' input-box-container input-code'}>
                                    <input tabIndex={19 + props.tabTimes} type="text" placeholder="Code" maxLength="8"
                                           ref={refAgentMailingCode}
                                           readOnly={true}
                                           onInput={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   mailing_address: {
                                                       ...selectedAgent?.mailing_address,
                                                       code: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   mailing_address: {
                                                       ...selectedAgent?.mailing_address,
                                                       code: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedAgent?.mailing_address?.code || ''}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledAgentMailingAddressFields + ' input-box-container grow'}>
                                    <input tabIndex={20 + props.tabTimes} type="text" placeholder="Name"
                                           onInput={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   mailing_address: {
                                                       ...selectedAgent?.mailing_address,
                                                       name: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   mailing_address: {
                                                       ...selectedAgent?.mailing_address,
                                                       name: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedAgent?.mailing_address?.name || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledAgentMailingAddressFields + ' input-box-container grow'}>
                                    <input tabIndex={21 + props.tabTimes} type="text" placeholder="Address 1"
                                           onInput={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   mailing_address: {
                                                       ...selectedAgent?.mailing_address,
                                                       address1: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   mailing_address: {
                                                       ...selectedAgent?.mailing_address,
                                                       address1: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedAgent?.mailing_address?.address1 || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledAgentMailingAddressFields + ' input-box-container grow'}>
                                    <input tabIndex={22 + props.tabTimes} type="text" placeholder="Address 2"
                                           onInput={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   mailing_address: {
                                                       ...selectedAgent?.mailing_address,
                                                       address2: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   mailing_address: {
                                                       ...selectedAgent?.mailing_address,
                                                       address2: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedAgent?.mailing_address?.address2 || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledAgentMailingAddressFields + ' input-box-container grow'}>
                                    <input tabIndex={23 + props.tabTimes} type="text" placeholder="City"
                                           onInput={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   mailing_address: {
                                                       ...selectedAgent?.mailing_address,
                                                       city: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   mailing_address: {
                                                       ...selectedAgent?.mailing_address,
                                                       city: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedAgent?.mailing_address?.city || ''}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div className={disabledAgentMailingAddressFields + ' input-box-container input-state'}>
                                    <input tabIndex={24 + props.tabTimes} type="text" placeholder="State" maxLength="2"
                                           onInput={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   mailing_address: {
                                                       ...selectedAgent?.mailing_address,
                                                       state: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   mailing_address: {
                                                       ...selectedAgent?.mailing_address,
                                                       state: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedAgent?.mailing_address?.state || ''}/>
                                </div>
                                <div className="form-h-sep"></div>
                                <div
                                    className={disabledAgentMailingAddressFields + ' input-box-container input-zip-code'}>
                                    <input tabIndex={25 + props.tabTimes} type="text" placeholder="Postal Code"
                                           onKeyDown={saveMailingAddress}
                                           onInput={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   mailing_address: {
                                                       ...selectedAgent?.mailing_address,
                                                       zip: e.target.value
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedAgent({
                                                   ...selectedAgent,
                                                   mailing_address: {
                                                       ...selectedAgent?.mailing_address,
                                                       zip: e.target.value
                                                   }
                                               })
                                           }}
                                           value={selectedAgent?.mailing_address?.zip || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledAgentMailingAddressFields + ' select-box-container'}
                                     style={{flexGrow: 1}}>
                                    <div className="select-box-wrapper">
                                        <input
                                            tabIndex={26 + props.tabTimes}
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
                                                                await setMailingContactNameItems((selectedAgent?.contacts || []).map((item, index) => {
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
                                                                await setMailingContactNameItems((selectedAgent?.contacts || []).map((item, index) => {
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
                                                            await setSelectedAgent({
                                                                ...selectedAgent,
                                                                mailing_address: {
                                                                    ...selectedAgent?.mailing_address,
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

                                                            saveMailingAddress({keyCode: 9});
                                                            setShowMailingContactNames(false);
                                                            refMailingContactName.current.focus();
                                                        }
                                                        break;

                                                    case 9: // tab
                                                        if (showMailingContactNames) {
                                                            e.preventDefault();
                                                            await setSelectedAgent({
                                                                ...selectedAgent,
                                                                mailing_address: {
                                                                    ...selectedAgent?.mailing_address,
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

                                                            saveMailingAddress({keyCode: 9});
                                                            setShowMailingContactNames(false);
                                                            refMailingContactName.current.focus();
                                                        } else {
                                                            saveMailingAddress({keyCode: 9});
                                                        }
                                                        break;

                                                    default:
                                                        break;
                                                }
                                            }}
                                            onInput={(e) => {
                                                // setSelectedAgent({
                                                //     ...selectedAgent,
                                                //     mailing_contact_name: e.target.value
                                                // })
                                            }}
                                            onChange={(e) => {
                                                // setSelectedAgent({
                                                //     ...selectedAgent,
                                                //     mailing_contact_name: e.target.value
                                                // })
                                            }}
                                            value={
                                                (selectedAgent?.mailing_address?.mailing_contact?.first_name || '') +
                                                ((selectedAgent?.mailing_address?.mailing_contact?.last_name || '') === ''
                                                    ? ''
                                                    : ' ' + selectedAgent?.mailing_address?.mailing_contact?.last_name)
                                            }
                                        />

                                        {
                                            ((selectedAgent?.contacts || []).length > 1 && (selectedAgent?.mailing_address?.code || '') !== '') &&
                                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                                             onClick={async () => {
                                                                 if (showMailingContactNames) {
                                                                     setShowMailingContactNames(false);
                                                                 } else {
                                                                     if ((selectedAgent?.contacts || []).length > 1) {
                                                                         await setMailingContactNameItems((selectedAgent?.contacts || []).map((item, index) => {
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
                                                                                await setSelectedAgent({
                                                                                    ...selectedAgent,
                                                                                    mailing_address: {
                                                                                        ...selectedAgent?.mailing_address,
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

                                                                                saveMailingAddress({keyCode: 9});
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
                                <div
                                    className={disabledAgentMailingAddressFields + ' select-box-container input-phone'}>
                                    <div className="select-box-wrapper">
                                        <MaskedInput tabIndex={27 + props.tabTimes}
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
                                                                     await setSelectedAgent({
                                                                         ...selectedAgent,
                                                                         mailing_address: {
                                                                             ...selectedAgent.mailing_address,
                                                                             mailing_contact_primary_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].type
                                                                         }
                                                                     });

                                                                     saveMailingAddress({keyCode: 9});
                                                                     setShowMailingContactPhones(false);
                                                                     refMailingContactPhone.current.inputElement.focus();
                                                                 }
                                                                 break;

                                                             case 9: // tab
                                                                 if (showMailingContactPhones) {
                                                                     e.preventDefault();
                                                                     await setSelectedAgent({
                                                                         ...selectedAgent,
                                                                         mailing_address: {
                                                                             ...selectedAgent.mailing_address,
                                                                             mailing_contact_primary_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].type
                                                                         }
                                                                     });

                                                                     saveMailingAddress({keyCode: 9});
                                                                     setShowMailingContactPhones(false);
                                                                     refMailingContactPhone.current.inputElement.focus();
                                                                 } else {
                                                                     saveMailingAddress({keyCode: 9});
                                                                 }
                                                                 break;

                                                             default:
                                                                 break;
                                                         }
                                                     }}
                                                     onInput={(e) => {
                                                         // setSelectedAgent({
                                                         //     ...selectedAgent,
                                                         //     mailing_contact_phone: e.target.value
                                                         // });
                                                     }}
                                                     onChange={(e) => {
                                                         // setSelectedAgent({
                                                         //     ...selectedAgent,
                                                         //     mailing_contact_phone: e.target.value
                                                         // });
                                                     }}
                                                     value={
                                                         (selectedAgent?.mailing_address?.mailing_contact_primary_phone || '') === 'work'
                                                             ? (selectedAgent?.mailing_address?.mailing_contact?.phone_work || '')
                                                             : (selectedAgent?.mailing_address?.mailing_contact_primary_phone || '') === 'fax'
                                                                 ? (selectedAgent?.mailing_address?.mailing_contact?.phone_work_fax || '')
                                                                 : (selectedAgent?.mailing_address?.mailing_contact_primary_phone || '') === 'mobile'
                                                                     ? (selectedAgent?.mailing_address?.mailing_contact?.phone_mobile || '')
                                                                     : (selectedAgent?.mailing_address?.mailing_contact_primary_phone || '') === 'direct'
                                                                         ? (selectedAgent?.mailing_address?.mailing_contact?.phone_direct || '')
                                                                         : (selectedAgent?.mailing_address?.mailing_contact_primary_phone || '') === 'other'
                                                                             ? (selectedAgent?.mailing_address?.mailing_contact?.phone_other || '')
                                                                             : ''
                                                     }
                                        />

                                        {
                                            ((selectedAgent?.id || 0) > 0 && (selectedAgent?.mailing_address?.code || '') !== '') &&
                                            <div
                                                className={classnames({
                                                    'selected-mailing-contact-primary-phone': true,
                                                    'pushed': (mailingContactPhoneItems.length > 1)
                                                })}>
                                                {selectedAgent?.mailing_address?.mailing_contact_primary_phone || ''}
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
                                                                                await setSelectedAgent({
                                                                                    ...selectedAgent,
                                                                                    mailing_address: {
                                                                                        ...selectedAgent?.mailing_address,
                                                                                        mailing_contact_primary_phone: item.type
                                                                                    }
                                                                                });

                                                                                saveMailingAddress({keyCode: 9});
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
                                <div
                                    className={disabledAgentMailingAddressFields + ' input-box-container input-phone-ext'}>
                                    <input tabIndex={28 + props.tabTimes} type="text" placeholder="Ext"
                                           onKeyDown={saveMailingAddress}
                                           onChange={e => {
                                               // setSelectedAgent({ ...selectedAgent, mailing_ext: e.target.value })
                                           }}
                                           value={selectedAgent?.mailing_address?.mailing_contact?.phone_ext || ''}/>
                                </div>
                            </div>
                            <div className="form-v-sep"></div>
                            <div className="form-row">
                                <div className={disabledAgentMailingAddressFields + ' select-box-container'}
                                     style={{flexGrow: 1}}
                                     onMouseEnter={() => {
                                         if ((selectedAgent?.mailing_address?.mailing_contact?.email_work || '') !== '' ||
                                             (selectedAgent?.mailing_address?.mailing_contact?.email_personal || '') !== '' ||
                                             (selectedAgent?.mailing_address?.mailing_contact?.email_other || '') !== '') {
                                             setShowMailingContactEmailCopyBtn(true);
                                         }
                                     }}
                                     onFocus={() => {
                                         if ((selectedAgent?.mailing_address?.mailing_contact?.email_work || '') !== '' ||
                                             (selectedAgent?.mailing_address?.mailing_contact?.email_personal || '') !== '' ||
                                             (selectedAgent?.mailing_address?.mailing_contact?.email_other || '') !== '') {
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
                                        <input tabIndex={29 + props.tabTimes} type="text" placeholder="E-Mail"
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
                                                               await setSelectedAgent({
                                                                   ...selectedAgent,
                                                                   mailing_address: {
                                                                       ...selectedAgent?.mailing_address,
                                                                       mailing_contact_primary_email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].type
                                                                   }
                                                               });

                                                               saveMailingAddress({keyCode: 9});
                                                               setShowMailingContactEmails(false);
                                                               refMailingContactEmail.current.focus();
                                                           }
                                                           break;

                                                       case 9: // tab
                                                           if (showMailingContactEmails) {
                                                               e.preventDefault();
                                                               await setSelectedAgent({
                                                                   ...selectedAgent,
                                                                   mailing_address: {
                                                                       ...selectedAgent?.mailing_address,
                                                                       mailing_contact_primary_email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].type
                                                                   }
                                                               });

                                                               saveMailingAddress({keyCode: 9});
                                                               setShowMailingContactEmails(false);
                                                               refMailingContactEmail.current.focus();
                                                           } else {
                                                               saveMailingAddress({keyCode: 9});
                                                           }
                                                           break;

                                                       default:
                                                           break;
                                                   }
                                               }}
                                               onChange={e => {
                                               }}
                                               value={
                                                   (selectedAgent?.mailing_address?.mailing_contact_primary_email || '') === 'work'
                                                       ? (selectedAgent?.mailing_address?.mailing_contact?.email_work || '')
                                                       : (selectedAgent?.mailing_address?.mailing_contact_primary_email || '') === 'personal'
                                                           ? (selectedAgent?.mailing_address?.mailing_contact?.email_personal || '')
                                                           : (selectedAgent?.mailing_address?.mailing_contact_primary_email || '') === 'other'
                                                               ? (selectedAgent?.mailing_address?.mailing_contact?.email_other || '')
                                                               : ''
                                               }
                                        />

                                        {
                                            ((selectedAgent?.id || 0) > 0 && (selectedAgent?.mailing_address?.code || '') !== '') &&
                                            <div
                                                className={classnames({
                                                    'selected-mailing-contact-primary-email': true,
                                                    'pushed': (mailingContactEmailItems.length > 1)
                                                })}>
                                                {selectedAgent?.mailing_address?.mailing_contact_primary_email || ''}
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
                                                                                await setSelectedAgent({
                                                                                    ...selectedAgent,
                                                                                    mailing_address: {
                                                                                        ...selectedAgent?.mailing_address,
                                                                                        mailing_contact_primary_email: item.type
                                                                                    }
                                                                                });

                                                                                saveMailingAddress({keyCode: 9});
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

                        {/*ADDED DATE*/}
                        <div className="form-bordered-box"
                             style={{width: '190px', flexGrow: 1, marginLeft: 10, justifyContent: 'space-between'}}>
                            <div className="form-header">
                                <div className="top-border top-border-left"></div>
                                <div className="top-border top-border-middle"></div>
                                <div className="top-border top-border-right"></div>
                            </div>

                            <div className="select-box-container">
                                <div className="select-box-wrapper">
                                    <MaskedInput tabIndex={30 + props.tabTimes}
                                                 mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                 guide={false}
                                                 type="text" placeholder="Added Date"
                                                 onKeyDown={async (e) => {
                                                     let key = e.keyCode || e.which;

                                                     if (key >= 37 && key <= 40) {
                                                         let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedAgent?.added_date || ''), 'MM/DD/YYYY');
                                                         await setPreSelectedAddedDate(event_date);

                                                         if (isAddedDateCalendarShown) {
                                                             e.preventDefault();

                                                             if (key === 37) { // left - minus 1
                                                                 setPreSelectedAddedDate(preSelectedAddedDate.clone().subtract(1, 'day'));
                                                             }

                                                             if (key === 38) { // up - minus 7
                                                                 setPreSelectedAddedDate(preSelectedAddedDate.clone().subtract(7, 'day'));
                                                             }

                                                             if (key === 39) { // right - plus 1
                                                                 setPreSelectedAddedDate(preSelectedAddedDate.clone().add(1, 'day'));
                                                             }

                                                             if (key === 40) { // down - plus 7
                                                                 setPreSelectedAddedDate(preSelectedAddedDate.clone().add(7, 'day'));
                                                             }
                                                         } else {
                                                             await setIsAddedDateCalendarShown(true);
                                                         }
                                                     }

                                                     if (key === 13) {
                                                         let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedAgent?.added_date || ''), 'MM/DD/YYYY');
                                                         await setPreSelectedAddedDate(event_date);

                                                         if (isAddedDateCalendarShown) {
                                                             event_date = preSelectedAddedDate.clone().format('MM/DD/YYYY');

                                                             await setSelectedAgent(selectedAgent => {
                                                                 return {
                                                                     ...selectedAgent,
                                                                     added_date: event_date
                                                                 }
                                                             })

                                                             // await saveAgent({keyCode: 9});

                                                             await setIsAddedDateCalendarShown(false);
                                                         }
                                                     }

                                                     if (key === 9) {
                                                         let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedAgent?.added_date || ''), 'MM/DD/YYYY');
                                                         await setPreSelectedAddedDate(event_date);

                                                         if (isAddedDateCalendarShown) {
                                                             event_date = preSelectedAddedDate.clone().format('MM/DD/YYYY');

                                                             await setSelectedAgent(selectedAgent => {
                                                                 return {
                                                                     ...selectedAgent,
                                                                     added_date: event_date
                                                                 }
                                                             })

                                                             // await saveAgent({keyCode: 9});

                                                             await setIsAddedDateCalendarShown(false);
                                                         } else {
                                                             if (e.target.value.trim() === '') {
                                                                 await setSelectedAgent(selectedAgent => {
                                                                     return {
                                                                         ...selectedAgent,
                                                                         added_date: null
                                                                     }
                                                                 })

                                                                 // await saveAgent({keyCode: 9});
                                                             }
                                                         }
                                                     }
                                                 }}
                                                 onBlur={e => {
                                                     setSelectedAgent(selectedAgent => {
                                                         return {
                                                             ...selectedAgent,
                                                             added_date: getFormattedDates(selectedAgent?.added_date)
                                                         }
                                                     })
                                                 }}
                                                 onInput={e => {
                                                     setSelectedAgent(selectedAgent => {
                                                         return {
                                                             ...selectedAgent,
                                                             added_date: e.target.value
                                                         }
                                                     })
                                                 }}
                                                 onChange={e => {
                                                     setSelectedAgent(selectedAgent => {
                                                         return {
                                                             ...selectedAgent,
                                                             added_date: e.target.value
                                                         }
                                                     })
                                                 }}
                                                 value={selectedAgent?.added_date || ''}
                                                 ref={refAddedDate}
                                    />

                                    <FontAwesomeIcon className="dropdown-button calendar added-date-calendar"
                                                     icon={faCalendarAlt} onClick={(e) => {
                                        if (isAddedDateCalendarShown) {
                                            setIsAddedDateCalendarShown(false);
                                        } else {
                                            // e.stopPropagation();


                                            new Promise((resolve, reject) => {
                                                if (moment((selectedAgent?.added_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (selectedAgent?.added_date || '').trim()) {
                                                    setPreSelectedAddedDate(moment(selectedAgent?.added_date, 'MM/DD/YYYY'));
                                                } else {
                                                    setPreSelectedAddedDate(moment());
                                                }

                                                resolve('OK');
                                            }).then(res => {
                                                setIsAddedDateCalendarShown(true);
                                                refAddedDate.current.inputElement.focus();
                                            }).catch(e => {

                                            });

                                        }
                                    }}/>
                                </div>
                                {
                                    addedDateTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-date-received"
                                            style={{
                                                ...style,
                                                left: '-150px',
                                                display: 'block'
                                            }}
                                            ref={refAddedDateCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below left"
                                                 style={{height: 275}}>
                                                <div className="mochi-contextual-popup-content">
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((selectedAgent?.added_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (selectedAgent?.added_date || '').trim()
                                                                ? moment(selectedAgent?.added_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                new Promise(async (resolve, reject) => {
                                                                    await setSelectedAgent(selectedAgent => {
                                                                        return {
                                                                            ...selectedAgent,
                                                                            added_date: day.format('MM/DD/YYYY')
                                                                        }
                                                                    })

                                                                    resolve('OK')
                                                                }).then(response => {
                                                                    // saveAgent({keyCode: 9});
                                                                })
                                                            }}
                                                            closeCalendar={() => {
                                                                setIsAddedDateCalendarShown(false);
                                                            }}
                                                            preDay={preSelectedAddedDate}
                                                            onChangePreDay={(preDay) => {
                                                                setPreSelectedAddedDate(preDay);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </animated.div>
                                    ))
                                }
                            </div>

                            <div className="select-box-container">
                                <div className="select-box-wrapper">
                                    <MaskedInput tabIndex={31 + props.tabTimes}
                                                 mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                 guide={false}
                                                 type="text" placeholder="Termination Date"
                                                 onKeyDown={async (e) => {
                                                     let key = e.keyCode || e.which;

                                                     if (key >= 37 && key <= 40) {
                                                         let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedAgent?.termination_date || ''), 'MM/DD/YYYY');
                                                         await setPreSelectedTerminationDate(event_date);

                                                         if (isTerminationDateCalendarShown) {
                                                             e.preventDefault();

                                                             if (key === 37) { // left - minus 1
                                                                 setPreSelectedTerminationDate(preSelectedTerminationDate.clone().subtract(1, 'day'));
                                                             }

                                                             if (key === 38) { // up - minus 7
                                                                 setPreSelectedTerminationDate(preSelectedTerminationDate.clone().subtract(7, 'day'));
                                                             }

                                                             if (key === 39) { // right - plus 1
                                                                 setPreSelectedTerminationDate(preSelectedTerminationDate.clone().add(1, 'day'));
                                                             }

                                                             if (key === 40) { // down - plus 7
                                                                 setPreSelectedTerminationDate(preSelectedTerminationDate.clone().add(7, 'day'));
                                                             }
                                                         } else {
                                                             await setIsTerminationDateCalendarShown(true);
                                                         }
                                                     }

                                                     if (key === 13) {
                                                         let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedAgent?.termination_date || ''), 'MM/DD/YYYY');
                                                         await setPreSelectedTerminationDate(event_date);

                                                         if (isTerminationDateCalendarShown) {
                                                             event_date = preSelectedTerminationDate.clone().format('MM/DD/YYYY');

                                                             await setSelectedAgent(selectedAgent => {
                                                                 return {
                                                                     ...selectedAgent,
                                                                     termination_date: event_date
                                                                 }
                                                             })

                                                             // await saveAgent({keyCode: 9});

                                                             await setIsTerminationDateCalendarShown(false);
                                                         }
                                                     }

                                                     if (key === 9) {
                                                         let event_date = e.target.value.trim() === '' ? moment() : moment(getFormattedDates(selectedAgent?.termination_date || ''), 'MM/DD/YYYY');
                                                         await setPreSelectedTerminationDate(event_date);

                                                         if (isTerminationDateCalendarShown) {
                                                             event_date = preSelectedTerminationDate.clone().format('MM/DD/YYYY');

                                                             await setSelectedAgent(selectedAgent => {
                                                                 return {
                                                                     ...selectedAgent,
                                                                     termination_date: event_date
                                                                 }
                                                             })

                                                             // await saveAgent({keyCode: 9});

                                                             await setIsTerminationDateCalendarShown(false);
                                                         } else {
                                                             if (e.target.value.trim() === '') {
                                                                 await setSelectedAgent(selectedAgent => {
                                                                     return {
                                                                         ...selectedAgent,
                                                                         termination_date: null
                                                                     }
                                                                 })

                                                                 // await saveAgent({keyCode: 9});
                                                             }
                                                         }
                                                     }
                                                 }}
                                                 onBlur={e => {
                                                     setSelectedAgent(selectedAgent => {
                                                         return {
                                                             ...selectedAgent,
                                                             termination_date: getFormattedDates(selectedAgent?.termination_date)
                                                         }
                                                     })
                                                 }}
                                                 onInput={e => {
                                                     setSelectedAgent(selectedAgent => {
                                                         return {
                                                             ...selectedAgent,
                                                             termination_date: e.target.value
                                                         }
                                                     })
                                                 }}
                                                 onChange={e => {
                                                     setSelectedAgent(selectedAgent => {
                                                         return {
                                                             ...selectedAgent,
                                                             termination_date: e.target.value
                                                         }
                                                     })
                                                 }}
                                                 value={selectedAgent?.termination_date || ''}
                                                 ref={refTerminationDate}
                                    />

                                    <FontAwesomeIcon className="dropdown-button calendar termination-date-calendar"
                                                     icon={faCalendarAlt} onClick={(e) => {
                                        if (isTerminationDateCalendarShown) {
                                            setIsTerminationDateCalendarShown(false);
                                        } else {
                                            // e.stopPropagation();


                                            new Promise((resolve, reject) => {
                                                if (moment((selectedAgent?.termination_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (selectedAgent?.termination_date || '').trim()) {
                                                    setPreSelectedTerminationDate(moment(selectedAgent?.termination_date, 'MM/DD/YYYY'));
                                                } else {
                                                    setPreSelectedTerminationDate(moment());
                                                }

                                                resolve('OK');
                                            }).then(res => {
                                                setIsTerminationDateCalendarShown(true);
                                                refTerminationDate.current.inputElement.focus();
                                            }).catch(e => {

                                            });

                                        }
                                    }}/>
                                </div>
                                {
                                    terminationDateTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-date-received"
                                            style={{
                                                ...style,
                                                left: '-150px',
                                                display: 'block'
                                            }}
                                            ref={refTerminationDateCalendarDropDown}
                                        >
                                            <div className="mochi-contextual-popup vertical below left"
                                                 style={{height: 275}}>
                                                <div className="mochi-contextual-popup-content">
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        <Calendar
                                                            value={moment((selectedAgent?.termination_date || '').trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') === (selectedAgent?.termination_date || '').trim()
                                                                ? moment(selectedAgent?.termination_date, 'MM/DD/YYYY')
                                                                : moment()}
                                                            onChange={(day) => {
                                                                new Promise(async (resolve, reject) => {
                                                                    await setSelectedAgent(selectedAgent => {
                                                                        return {
                                                                            ...selectedAgent,
                                                                            termination_date: day.format('MM/DD/YYYY')
                                                                        }
                                                                    })

                                                                    resolve('OK')
                                                                }).then(response => {
                                                                    // saveAgent({keyCode: 9});
                                                                })
                                                            }}
                                                            closeCalendar={() => {
                                                                setIsTerminationDateCalendarShown(false);
                                                            }}
                                                            preDay={preSelectedTerminationDate}
                                                            onChangePreDay={(preDay) => {
                                                                setPreSelectedTerminationDate(preDay);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </animated.div>
                                    ))
                                }
                            </div>

                            <div className="input-box-container">
                                <input tabIndex={32 + props.tabTimes} type="text" placeholder="Regional Manager"
                                       onInput={(e) => {
                                           setSelectedAgent(selectedAgent => {
                                               return {
                                                   ...selectedAgent,
                                                   regional_manager: e.target.value
                                               }
                                           })
                                       }}
                                       onChange={e => {
                                           setSelectedAgent(selectedAgent => {
                                               return {
                                                   ...selectedAgent,
                                                   regional_manager: e.target.value
                                               }
                                           })
                                       }}
                                       value={selectedAgent?.regional_manager || ''}/>
                            </div>

                            <div className="select-box-container">
                                <div className="select-box-wrapper">
                                    <input
                                        type="text"
                                        readOnly={!props.isAdmin}
                                        tabIndex={33 + props.tabTimes}
                                        placeholder="Division"
                                        ref={refDivision}
                                        onKeyDown={async (e) => {
                                            let key = e.keyCode || e.which;

                                            if (!props.isAdmin) {
                                                e.preventDefault();
                                            } else {
                                                switch (key) {
                                                    case 37: case 38: // arrow left | arrow up
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
                                                                            (selectedAgent?.division?.id ||
                                                                                0) === 0
                                                                                ? index === 0
                                                                                : item.id ===
                                                                                selectedAgent.division.id;
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

                                                    case 39: case 40: // arrow right | arrow down
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
                                                                                item.selected =
                                                                                    (selectedAgent?.division?.id ||
                                                                                        0) === 0
                                                                                        ? index === 0
                                                                                        : item.id ===
                                                                                        selectedAgent?.division.id;
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
                                                            await setSelectedAgent(selectedAgent => {
                                                                return {
                                                                    ...selectedAgent,
                                                                    division: divisionItems[divisionItems.findIndex((item) => item.selected)],
                                                                    division_id: divisionItems[divisionItems.findIndex((item) => item.selected)].id
                                                                }
                                                            })

                                                            // saveAgent({ keyCode: 9 });
                                                            setDivisionItems([]);
                                                            refDivision.current.focus();
                                                        }
                                                        break;

                                                    case 9: // tab
                                                        if (divisionItems.length > 0) {
                                                            e.preventDefault();
                                                            await setSelectedAgent(selectedAgent => {
                                                                return {
                                                                    ...selectedAgent,
                                                                    division: divisionItems[divisionItems.findIndex((item) => item.selected)],
                                                                    division_id: divisionItems[divisionItems.findIndex((item) => item.selected)].id
                                                                }
                                                            })

                                                            // saveAgent({ keyCode: 9 });
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
                                            if ((selectedAgent?.division?.id || 0) === 0) {
                                                await setSelectedAgent(selectedAgent => {
                                                    return {
                                                        ...selectedAgent,
                                                        division: {},
                                                        division_id: null
                                                    }
                                                })
                                            }
                                        }}
                                        onInput={async (e) => {
                                            let division = selectedAgent?.division || {};

                                            division.id = 0;
                                            division.name = e.target.value;

                                            await setSelectedAgent(selectedAgent => {
                                                return {
                                                    ...selectedAgent,
                                                    division: division,
                                                    division_id: division.id
                                                }
                                            })

                                            if (e.target.value.trim() === "") {
                                                setDivisionItems([]);
                                            } else {
                                                axios.post(props.serverUrl + "/getDivisions", { name: e.target.value.trim() }).then(async (res) => {
                                                    if (res.data.result === "OK") {
                                                        await setDivisionItems(
                                                            res.data.divisions.map((item, index) => {
                                                                item.selected = (selectedAgent?.division?.id || 0) === 0
                                                                    ? index === 0
                                                                    : item.id ===
                                                                    selectedAgent.division.id;
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
                                            let division = selectedAgent?.division || {};

                                            division.id = 0;
                                            division.name = e.target.value;

                                            await setSelectedAgent(selectedAgent => {
                                                return {
                                                    ...selectedAgent,
                                                    division: division,
                                                    division_id: division.id
                                                }
                                            })
                                        }}
                                        value={selectedAgent?.division?.name || ""}
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
                                                    if ((selectedAgent?.division?.id || 0) === 0 && (selectedAgent?.division?.name || "") !== "") {
                                                        axios.post(props.serverUrl + "/getDivisions", { name: selectedAgent.division.name }).then(async (res) => {
                                                            if (res.data.result === "OK") {
                                                                await setDivisionItems(res.data.divisions.map((item, index) => {
                                                                    item.selected = (selectedAgent?.division?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedAgent.division.id;
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
                                                                    item.selected = (selectedAgent?.division?.id || 0) === 0
                                                                        ? index === 0
                                                                        : item.id === selectedAgent.division.id;
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

                                            <div className="mochi-contextual-popup vertical below" style={{ height: 150 }}>
                                                <div className="mochi-contextual-popup-content">
                                                    <div className="mochi-contextual-popup-wrapper">
                                                        {divisionItems.map((item, index) => {
                                                            const mochiItemClasses = classnames({
                                                                "mochi-item": true,
                                                                selected: item.selected,
                                                            });

                                                            const searchValue = (selectedAgent?.division?.id || 0) === 0 && (selectedAgent?.division?.name || "") !== ""
                                                                ? selectedAgent?.division?.name
                                                                : undefined;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={mochiItemClasses}
                                                                    id={item.id}
                                                                    onClick={() => {
                                                                        setSelectedAgent(selectedAgent => {
                                                                            return {
                                                                                ...selectedAgent,
                                                                                division: item,
                                                                                division_id: item.id
                                                                            }
                                                                        })

                                                                        window.setTimeout(() => {
                                                                            // saveAgent({ keyCode: 9 });
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

                            <div className="input-box-container">
                                <input tabIndex={34 + props.tabTimes} type="text" placeholder="FID"
                                       onKeyDown={(e) => {
                                           let key = e.keyCode ||e.which;

                                           if (key === 9){
                                               saveAgent(e);
                                           }
                                       }}
                                       onInput={(e) => {
                                           setSelectedAgent(selectedAgent => {
                                               return {
                                                   ...selectedAgent,
                                                   fid: e.target.value
                                               }
                                           })
                                       }}
                                       onChange={e => {
                                           setSelectedAgent(selectedAgent => {
                                               return {
                                                   ...selectedAgent,
                                                   fid: e.target.value
                                               }
                                           })
                                       }}
                                       value={selectedAgent?.fid || ''}/>
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
                                        (selectedAgent?.orders || []).map((order, index) => {
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
                                                        ? ((order.pickups.find(p => p.id === order.routing[0].pickup_id).agent?.city || '') + ', ' + (order.pickups.find(p => p.id === order.routing[0].pickup_id).agent?.state || '') +
                                                            ' - ' + (order.routing[order.routing.length - 1].type === 'pickup'
                                                                ? (order.pickups.find(p => p.id === order.routing[order.routing.length - 1].pickup_id).agent?.city || '') + ', ' + (order.pickups.find(p => p.id === order.routing[order.routing.length - 1].pickup_id).agent?.state || '') :
                                                                (order.deliveries.find(d => d.id === order.routing[order.routing.length - 1].delivery_id).agent?.city || '') + ', ' + (order.deliveries.find(d => d.id === order.routing[order.routing.length - 1].delivery_id).agent?.state || '')))

                                                        : ((order.deliveries.find(d => d.id === order.routing[0].delivery_id).agent?.city || '') + ', ' + (order.deliveries.find(d => d.id === order.routing[0].delivery_id).agent?.state || '') +
                                                            ' - ' + (order.routing[order.routing.length - 1].type === 'pickup'
                                                                ? (order.pickups.find(p => p.id === order.routing[order.routing.length - 1].pickup_id).agent?.city || '') + ', ' + (order.pickups.find(p => p.id === order.routing[order.routing.length - 1].pickup_id).agent?.state || '') :
                                                                (order.deliveries.find(d => d.id === order.routing[order.routing.length - 1].delivery_id).agent?.city || '') + ', ' + (order.deliveries.find(d => d.id === order.routing[order.routing.length - 1].delivery_id).agent?.state || '')))
                                                    : ''}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            {
                                loadingAgentOrdersTransition((style, item) => item &&
                                    <animated.div className='loading-container' style={style}>
                                        <div className="loading-container-wrapper">
                                            <Loader type="Circles" color="#009bdd" height={40} width={40}
                                                    visible={item}/>
                                        </div>
                                    </animated.div>
                                )
                            }
                        </div>

                        <div className="fields-container-col" style={{marginTop: 0, marginLeft: 0}}>
                            {/*CREDIT FORM*/}
                            <div className="form-bordered-box" style={{
                                width: '190px',
                                flexGrow: 0,
                                marginLeft: 10,
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gridGap: '10px'
                            }}>
                                <div className="form-header">
                                    <div className="top-border top-border-left"></div>
                                    {/*<div className="form-title">Credit</div>*/}
                                    <div className="top-border top-border-middle"></div>
                                    <div className="top-border top-border-right"></div>
                                </div>

                                <div className="form-row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
                                    <label htmlFor="" style={{fontSize: '0.7rem'}}>Agent Pay Brokerage</label>

                                    <div className="input-toggle-container" style={{minWidth: '3rem', maxWidth: '3rem'}}>
                                        <input type="checkbox"
                                               id={props.panelName + '-cbox-agent-pay-brokerage-primary-btn'}
                                               onChange={(e) => {
                                                   setSelectedAgent(selectedAgent =>{
                                                       return {
                                                           ...selectedAgent,
                                                           agent_pay_brokerage: e.target.checked ? 1 : 0
                                                       }
                                                   });

                                                   saveAgent({keyCode: 9});
                                               }}
                                               checked={(selectedAgent?.agent_pay_brokerage || 0) === 1}/>
                                        <label htmlFor={props.panelName + '-cbox-agent-pay-brokerage-primary-btn'}>
                                            <div className="label-text">{(selectedAgent?.agent_pay_brokerage || 0) === 1 ? 'Yes' : 'No'}</div>
                                            <div className="input-toggle-btn"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="form-row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
                                    <label htmlFor="" style={{fontSize: '0.7rem'}}>Agent Pay Company Trucks</label>

                                    <div className="input-toggle-container" style={{minWidth: '3rem', maxWidth: '3rem'}}>
                                        <input type="checkbox"
                                               id={props.panelName + '-cbox-agent-pay-company-trucks-primary-btn'}
                                               onChange={(e) => {
                                                   setSelectedAgent(selectedAgent =>{
                                                       return {
                                                           ...selectedAgent,
                                                           agent_pay_company_trucks: e.target.checked ? 1 : 0
                                                       }
                                                   });

                                                   saveAgent({keyCode: 9});
                                               }}
                                               checked={(selectedAgent?.agent_pay_company_trucks || 0) === 1}/>
                                        <label htmlFor={props.panelName + '-cbox-agent-pay-company-trucks-primary-btn'}>
                                            <div className="label-text">{(selectedAgent?.agent_pay_company_trucks || 0) === 1 ? 'Yes' : 'No'}</div>
                                            <div className="input-toggle-btn"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="form-row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
                                    <label htmlFor="" style={{fontSize: '0.7rem'}}>Does Agent Own Units</label>

                                    <div className="input-toggle-container" style={{minWidth: '3rem', maxWidth: '3rem'}}>
                                        <input type="checkbox"
                                               id={props.panelName + '-cbox-does-agent-own-units-primary-btn'}
                                               onChange={(e) => {
                                                   setSelectedAgent(selectedAgent =>{
                                                       return {
                                                           ...selectedAgent,
                                                           agent_own_units: e.target.checked ? 1 : 0,
                                                           agent_pay_own_trucks: e.target.checked ? (selectedAgent?.agent_pay_own_trucks || 0) : 0
                                                       }
                                                   });

                                                   saveAgent({keyCode: 9});
                                               }}
                                               checked={(selectedAgent?.agent_own_units || 0) === 1}/>
                                        <label htmlFor={props.panelName + '-cbox-does-agent-own-units-primary-btn'}>
                                            <div className="label-text">{(selectedAgent?.agent_own_units || 0) === 1 ? 'Yes' : 'No'}</div>
                                            <div className="input-toggle-btn"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="form-row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
                                    <label htmlFor="" style={{fontSize: '0.7rem'}}>Agent Pay Own Trucks</label>

                                    <div className="input-toggle-container" style={{minWidth: '3rem', maxWidth: '3rem'}}>
                                        <input type="checkbox"
                                               id={props.panelName + '-cbox-agent-pay-own-trucks-primary-btn'}
                                               onChange={(e) => {
                                                   if ((selectedAgent?.agent_own_units || 0) === 1){
                                                       setSelectedAgent(selectedAgent =>{
                                                           return {
                                                               ...selectedAgent,
                                                               agent_pay_own_trucks: e.target.checked ? 1 : 0
                                                           }
                                                       });

                                                       saveAgent({keyCode: 9});
                                                   }
                                               }}
                                               checked={(selectedAgent?.agent_own_units || 0) === 1 && (selectedAgent?.agent_pay_own_trucks || 0) === 1}/>
                                        <label htmlFor={props.panelName + '-cbox-agent-pay-own-trucks-primary-btn'}>
                                            <div className="label-text">{(selectedAgent?.agent_pay_own_trucks || 0) === 1 ? 'Yes' : 'No'}</div>
                                            <div className="input-toggle-btn"></div>
                                        </label>
                                    </div>
                                </div>

                            </div>

                            {/*HOURS FORM*/}
                            <div className="form-bordered-box" style={{
                                width: '190px',
                                flexGrow: 0,
                                marginLeft: 10,
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gridGap: '10px'
                            }}>
                                <div className="form-header">
                                    <div className="top-border top-border-left"></div>
                                    <div className="form-title">Hours</div>
                                    <div className="top-border top-border-middle"></div>
                                    <div className="top-border top-border-right"></div>
                                </div>

                                <div className="input-box-container ">
                                    <input tabIndex={35 + props.tabTimes} type="text" placeholder="Open"
                                           onBlur={(e) => {
                                               saveHours(e, 'hours open')
                                           }}
                                           onChange={e => {
                                              setSelectedAgent(selectedAgent => {
                                                   return {
                                                       ...selectedAgent,
                                                       hours: {
                                                            ...(selectedAgent?.hours || {}),
                                                           hours_open: e.target.value
                                                       }
                                                   }
                                               })
                                           }}
                                           value={(selectedAgent?.hours?.hours_open || '')} />
                                </div>

                                <div className="input-box-container ">
                                    <input tabIndex={36 + props.tabTimes} type="text" placeholder="Close"
                                           onBlur={(e) => {
                                               saveHours(e, 'hours close')
                                           }}
                                           onChange={e => {
                                               setSelectedAgent(selectedAgent => {
                                                   return {
                                                       ...selectedAgent,
                                                       hours: {
                                                           ...(selectedAgent?.hours || {}),
                                                           hours_close: e.target.value
                                                       }
                                                   }
                                               })
                                           }}
                                           value={(selectedAgent?.hours?.hours_close || '')} />
                                </div>

                                <div className="input-box-container ">
                                    <input tabIndex={37 + props.tabTimes} type="text" placeholder="Open"
                                           onBlur={(e) => {
                                               saveHours(e, 'hours open 2')
                                           }}
                                           onChange={e => {
                                               setSelectedAgent(selectedAgent => {
                                                   return {
                                                       ...selectedAgent,
                                                       hours: {
                                                           ...(selectedAgent?.hours || {}),
                                                           hours_open2: e.target.value
                                                       }
                                                   }
                                               })
                                           }}
                                           value={(selectedAgent?.hours?.hours_open2 || '')} />
                                </div>

                                <div className="input-box-container ">
                                    <input tabIndex={38 + props.tabTimes} type="text" placeholder="Close"
                                           onKeyDown={(e) => {
                                               let key = e.keyCode || e.which;

                                               if (key === 9){
                                                   e.preventDefault();

                                                   saveAgent(e, true);
                                               }
                                           }}
                                           onBlur={(e) => {
                                               saveHours(e, 'hours close 2')
                                           }}
                                           onChange={e => {
                                               setSelectedAgent(selectedAgent => {
                                                   return {
                                                       ...selectedAgent,
                                                       hours: {
                                                           ...(selectedAgent?.hours || {}),
                                                           hours_close2: e.target.value
                                                       }
                                                   }
                                               })
                                           }}
                                           value={(selectedAgent?.hours?.hours_close2 || '')} />
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                <div className="fields-container-col" style={{alignItems: 'flex-end'}}>
                    <div className="fields-container-row" style={{display: 'flex', flexDirection: 'column'}}>
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
                                if ((selectedAgent?.id || 0) === 0) {
                                    window.alert('There is nothing to print!');
                                    return;
                                }

                                handledPrintAgentInformation();
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Print Agent Information</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                noteTransition((style, item) => item && (
                    <animated.div style={{...style}}>
                        <AgentModal
                            selectedData={selectedNote}
                            setSelectedData={setSelectedNote}
                            selectedParent={selectedAgent}
                            setSelectedParent={(data) => {
                                setSelectedAgent({...selectedAgent, notes: data.notes});
                            }}
                            savingDataUrl='/saveAgentNote'
                            deletingDataUrl='/deleteAgentNote'
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
        serverUrl: state.systemReducers.serverUrl
    }
}

export default connect(mapStateToProps, {
    setCompanyOpenedPanels,
    setDispatchOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCarrierOpenedPanels,
    setCompanySetupOpenedPanels,
    setSelectedCompany,
    setSelectedDriver
})(Agents)