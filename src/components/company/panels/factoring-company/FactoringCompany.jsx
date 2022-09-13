import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import axios from 'axios';
import './FactoringCompany.css';
import MaskedInput from 'react-text-mask';
import { Modal } from './../../panels';
import { useTransition, animated, Transition } from 'react-spring';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faPencilAlt, faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import NumberFormat from "react-number-format";
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
} from './../../../../actions';
import {
    CustomerSearch,
    Contacts,
    Documents,
    ContactSearch,
    FactoringCompanyInvoiceSearch,
    FactoringCompanyPanelSearch,
    ACHWiringInfo
} from './../../panels';

import {
    Invoice
} from './../../../company';

const FactoringCompany = (props) => {
    const [selectedFactoringCompany, setSelectedFactoringCompany] = useState({});
    const [selectedFactoringCompanyContact, setSelectedFactoringCompanyContact] = useState({});
    const [selectedFactoringCompanyNote, setSelectedFactoringCompanyNote] = useState({});
    const [selectedFactoringCompanyIsShowingContactList, setSelectedFactoringCompanyIsShowingContactList] = useState(true);
    const [selectedFactoringCompanyIsShowingInvoiceList, setSelectedFactoringCompanyIsShowingInvoiceList] = useState(true);
    const [selectedFactoringCompanyInvoiceSearch, setSelectedFactoringCompanyInvoiceSearch] = useState([]);
    const [selectedFactoringCompanyInvoices, setSelectedFactoringCompanyInvoices] = useState([]);
    const [selectedFactoringCompanyDocument, setSelectedFactoringCompanyDocument] = useState({});
    const [selectedFactoringCompanyContactSearch, setSelectedFactoringCompanyContactSearch] = useState({});

    const refFactoringCompanyCode = useRef();
    const refFactoringCompanyName = useRef();
    const refFactoringCompanyEmail = useRef();
    const [showFactoringCompanyEmailCopyBtn, setShowFactoringCompanyEmailCopyBtn] = useState(false);
    const [showFactoringCompanyContactEmailCopyBtn, setShowFactoringCompanyContactEmailCopyBtn] = useState(false);
    const [showMailingContactEmailCopyBtn, setShowMailingContactEmailCopyBtn] = useState(false);

    const refFactoringCompanyContactPhone = useRef();
    const [carrierContactPhoneItems, setFactoringCompanyContactPhoneItems] = useState([]);
    const [showFactoringCompanyContactPhones, setShowFactoringCompanyContactPhones] = useState(false);
    const refFactoringCompanyContactPhoneDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowFactoringCompanyContactPhones(false) } });
    const refFactoringCompanyContactPhonePopupItems = useRef([]);

    const refFactoringCompanyContactEmail = useRef();
    const [carrierContactEmailItems, setFactoringCompanyContactEmailItems] = useState([]);
    const [showFactoringCompanyContactEmails, setShowFactoringCompanyContactEmails] = useState(false);
    const refFactoringCompanyContactEmailDropDown = useDetectClickOutside({ onTriggered: async () => { await setShowFactoringCompanyContactEmails(false) } });
    const refFactoringCompanyContactEmailPopupItems = useRef([]);

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

    const [isSavingFactoringCompany, setIsSavingFactoringCompany] = useState(false);
    const [isSavingFactoringCompanyContact, setIsSavingFactoringCompanyContact] = useState(false);
    const [isSavingFactoringCompanyMailingAddress, setIsSavingFactoringCompanyMailingAddress] = useState(false);

    const [showingACHWiringInfo, setShowingACHWiringInfo] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0, display: 'block' },
        enter: { opacity: 1, display: 'block' },
        leave: { opacity: 0, display: 'none' },
        reverse: isLoading,
    });

    const loadingOrdersTransition = useTransition(isLoadingOrders, {
        from: { opacity: 0, display: 'block' },
        enter: { opacity: 1, display: 'block' },
        leave: { opacity: 0, display: 'none' },
        reverse: isLoadingOrders,
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

    const contactPhonesTransition = useTransition(showFactoringCompanyContactPhones, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showFactoringCompanyContactPhones
    });

    const contactEmailsTransition = useTransition(showFactoringCompanyContactEmails, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showFactoringCompanyContactEmails
    });

    const noteTransition = useTransition(selectedFactoringCompanyNote.id !== undefined, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: selectedFactoringCompanyNote.id !== undefined,
        config: { duration: 100 }
    });

    const factoringContactsFirstPageTransition = useTransition(selectedFactoringCompanyIsShowingContactList, {
        from: { opacity: 0, left: '0%', width: '0%', display: 'block' },
        enter: { opacity: 1, left: '0%', width: '100%', display: 'block' },
        leave: { opacity: 0, left: '0%', width: '0%', display: 'none' },
        config: { duration: 300 },
        reverse: selectedFactoringCompanyIsShowingContactList
    });

    const factoringContactsSecondPageTransition = useTransition(!selectedFactoringCompanyIsShowingContactList, {
        from: { opacity: 0, left: '100%', width: '0%', display: 'block' },
        enter: { opacity: 1, left: '0%', width: '100%', display: 'block' },
        leave: { opacity: 0, left: '100%', width: '0%', display: 'none' },
        config: { duration: 300 },
        reverse: !selectedFactoringCompanyIsShowingContactList
    });

    const factoringInvoiceFirstPageTransition = useTransition(selectedFactoringCompanyIsShowingInvoiceList, {
        from: { opacity: 0, left: '0%', width: '0%', display: 'block' },
        enter: { opacity: 1, left: '0%', width: '100%', display: 'block' },
        leave: { opacity: 0, left: '0%', width: '0%', display: 'none' },
        config: { duration: 300 },
        reverse: selectedFactoringCompanyIsShowingInvoiceList
    });

    const factoringInvoiceSecondPageTransition = useTransition(!selectedFactoringCompanyIsShowingInvoiceList, {
        from: { opacity: 0, left: '100%', width: '0%', display: 'block' },
        enter: { opacity: 1, left: '0%', width: '100%', display: 'block' },
        leave: { opacity: 0, left: '100%', width: '0%', display: 'none' },
        config: { duration: 300 },
        reverse: !selectedFactoringCompanyIsShowingInvoiceList
    });

    const achWiringInfoTransition = useTransition(showingACHWiringInfo, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: showingACHWiringInfo,
        config: { duration: 100 },
    });

    useEffect(() => {
        if ((props.factoringCompanyId || 0) > 0) {
            setIsLoading(true);

            axios.post(props.serverUrl + '/getFactoringCompanyById', { id: props.factoringCompanyId }).then(res => {
                if (res.data.result === 'OK') {
                    setSelectedFactoringCompany({ ...res.data.factoring_company })
                    setSelectedFactoringCompanyContact({ ...((res.data.factoring_company.contacts || []).find(c => c.is_primary === 1) || {}) })

                    axios.post(props.serverUrl + '/getFactoringCompanyOutstandingInvoices', {
                        factoring_company_id: props.factoringCompanyId
                    }).then(res => {
                        if (res.data.result === 'OK') {
                            setSelectedFactoringCompany(selectedFactoringCompany => {
                                return {
                                    ...selectedFactoringCompany,
                                    orders: res.data.orders
                                }
                            })
                        }
                    }).catch(e => {
                        console.log('error getting factoring company invoices');
                    }).finally(() => {
                        setIsLoading(false);
                    });
                }

            }).catch(e => {
                console.log('error getting factoring company by id', e);
            })
        }
    }, [])

    useEffect(() => {
        if (isSavingFactoringCompany) {
            if ((props.user?.is_admin || 0) === 0) {
                if ((selectedFactoringCompany?.id || 0) > 0) {
                    if (((props.user?.user_code?.permissions || []).find(x => x.name === 'factoring_company')?.pivot?.edit || 0) === 0) {
                        setIsSavingFactoringCompany(false);
                        return;
                    }
                } else {
                    if (((props.user?.user_code?.permissions || []).find(x => x.name === 'factoring_company')?.pivot?.save || 0) === 0) {
                        setIsSavingFactoringCompany(false);
                        return;
                    }
                }
            }
            
            let company = selectedFactoringCompany || {};

            if (company.id === undefined) {
                company.id = 0;
            }

            if ((company.name || '').trim() !== '' &&
                (company.address1 || '').trim() !== '' &&
                (company.city || '').trim() !== '' &&
                (company.state || '').trim() !== '' &&
                (company.zip || '').trim() !== '') {

                let parseCity = company.city.trim().replace(/\s/g, "").substring(0, 3);

                if (parseCity.toLowerCase() === "ft.") {
                    parseCity = "FO";
                }
                if (parseCity.toLowerCase() === "mt.") {
                    parseCity = "MO";
                }
                if (parseCity.toLowerCase() === "st.") {
                    parseCity = "SA";
                }

                let newCode = (company.name || '').trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + (company.state || '').trim().replace(/\s/g, "").substring(0, 2);

                company.code = newCode.toUpperCase();

                axios.post(props.serverUrl + '/saveFactoringCompany', company).then(res => {
                    if (res.data.result === 'OK') {
                        let factoring_company = JSON.parse(JSON.stringify(res.data.factoring_company));

                        if (selectedFactoringCompany?.id === undefined || (selectedFactoringCompany?.id || 0) === 0) {
                            setSelectedFactoringCompany(selectedFactoringCompany => {
                                return {
                                    ...selectedFactoringCompany,
                                    id: factoring_company.id,
                                    code: factoring_company.code,
                                    code_number: factoring_company.code_number,
                                    contacts: factoring_company.contacts || []
                                }
                            });
                        } else {
                            setSelectedFactoringCompany(selectedFactoringCompany => {
                                return {
                                    ...selectedFactoringCompany,
                                    contacts: factoring_company.contacts || []
                                }
                            });
                        }

                        (res.data.factoring_company.contacts || []).map((contact, index) => {
                            if (contact.is_primary === 1) {
                                if ((selectedFactoringCompanyContact?.id || 0) === 0 || selectedFactoringCompanyContact?.id === contact.id) {
                                    setSelectedFactoringCompanyContact(contact);
                                }
                            }
                            return true;
                        });

                        if ((props.selectedCarrier?.factoring_company?.id || 0) === res.data.factoring_company.id) {
                            props.setSelectedCarrier({
                                id: props.selectedCarrier.id,
                                factoring_company: { ...res.data.factoring_company },
                                factoring_company_id: res.data.factoring_company.id,
                                component_id: props.componentId
                            });
                        }
                    }

                    setIsSavingFactoringCompany(false);
                }).catch(e => {
                    console.log('error on saving factoring company', e);
                    setIsSavingFactoringCompany(false);
                });
            } else {
                setIsSavingFactoringCompany(false);
            }
        }
    }, [isSavingFactoringCompany]);

    useEffect(() => {
        if (isSavingFactoringCompanyContact) {
            if ((props.user?.is_admin || 0) === 0) {
                if ((selectedFactoringCompany?.id || 0) > 0) {
                    if (((props.user?.user_code?.permissions || []).find(x => x.name === 'factoring company')?.pivot?.edit || 0) === 0) {
                        setIsSavingFactoringCompanyContact(false);
                        return;
                    }
                } else {
                    if (((props.user?.user_code?.permissions || []).find(x => x.name === 'factoring company')?.pivot?.save || 0) === 0) {
                        setIsSavingFactoringCompanyContact(false);
                        return;
                    }
                }
            }
            
            if ((selectedFactoringCompany.id || 0) === 0) {
                setIsSavingFactoringCompanyContact(false);
                return;
            }

            let contact = selectedFactoringCompanyContact;

            if (contact.factoring_company_id === undefined || contact.factoring_company_id === 0) {
                contact.factoring_company_id = selectedFactoringCompany.id;
            }

            if ((contact.first_name || '').trim() === '' ||
                (contact.last_name || '').trim() === '' ||
                ((contact.phone_work || '').trim() === '' &&
                    (contact.phone_work_fax || '').trim() === '' &&
                    (contact.phone_mobile || '').trim() === '' &&
                    (contact.phone_direct || '').trim() === '' &&
                    (contact.phone_other || '').trim() === '')) {
                setIsSavingFactoringCompanyContact(false);
                return;
            }

            if ((contact.address1 || '').trim() === '' && (contact.address2 || '').trim() === '') {
                contact.address1 = selectedFactoringCompany.address1;
                contact.address2 = selectedFactoringCompany.address2;
                contact.city = selectedFactoringCompany.city;
                contact.state = selectedFactoringCompany.state;
                contact.zip_code = selectedFactoringCompany.zip;
            }

            axios.post(props.serverUrl + '/saveFactoringCompanyContact', contact).then(res => {
                if (res.data.result === 'OK') {
                    let mailing_contact = selectedFactoringCompany?.mailing_address?.mailing_contact || {};

                    if ((mailing_contact?.id || 0) === res.data.contact.id) {
                        mailing_contact = res.data.contact;
                    }

                    setSelectedFactoringCompany(selectedFactoringCompany => {
                        return {
                            ...selectedFactoringCompany,
                            contacts: res.data.contacts,
                            mailing_address: {
                                ...selectedFactoringCompany.mailing_address,
                                mailing_contact: mailing_contact
                            }
                        }
                    });
                    setSelectedFactoringCompanyContact(res.data.contact);

                    if ((selectedFactoringCompany?.id || 0) > 0 && (selectedFactoringCompany.id === (props.selectedCarrier?.factoring_company?.id || 0))) {
                        props.setSelectedCarrier({
                            id: props.selectedCarrier.id,
                            factoring_company: {
                                ...selectedFactoringCompany,
                                contacts: res.data.contacts,
                                mailing_address: {
                                    ...selectedFactoringCompany.mailing_address,
                                    mailing_contact: mailing_contact
                                }
                            },
                            component_id: props.componentId
                        });
                    }
                }
                setIsSavingFactoringCompanyContact(false);
            }).catch(e => {
                console.log('error on saving factoring company contact', e);
                setIsSavingFactoringCompanyContact(false);
            });
        }
    }, [isSavingFactoringCompanyContact]);

    useEffect(() => {
        if (isSavingFactoringCompanyMailingAddress) {
            if ((props.user?.is_admin || 0) === 0) {
                if ((selectedFactoringCompany?.id || 0) > 0) {
                    if (((props.user?.user_code?.permissions || []).find(x => x.name === 'factoring_company')?.pivot?.edit || 0) === 0) {
                        setIsSavingFactoringCompanyMailingAddress(false);
                        return;
                    }
                } else {
                    if (((props.user?.user_code?.permissions || []).find(x => x.name === 'factoring_company')?.pivot?.save || 0) === 0) {
                        setIsSavingFactoringCompanyMailingAddress(false);
                        return;
                    }
                }
            }
            
            if ((selectedFactoringCompany.id || 0) > 0) {
                let mailing_address = selectedFactoringCompany.mailing_address || {};

                if (mailing_address.id === undefined) {
                    mailing_address.id = 0;
                }
                mailing_address.factoring_company_id = selectedFactoringCompany.id;

                if ((mailing_address.name || '').trim() !== '' &&
                    (mailing_address.address1 || '').trim() !== '' &&
                    (mailing_address.city || '').trim() !== '' &&
                    (mailing_address.state || '').trim() !== '' &&
                    (mailing_address.zip || '').trim() !== '') {

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

                    axios.post(props.serverUrl + '/saveFactoringCompanyMailingAddress', mailing_address).then(res => {
                        if (res.data.result === 'OK') {
                            setSelectedFactoringCompany(selectedFactoringCompany => {
                                return {
                                    ...selectedFactoringCompany,
                                    mailing_address: res.data.mailing_address
                                }
                            });

                            if ((selectedFactoringCompany?.id || 0) > 0 && (selectedFactoringCompany.id === (props.selectedCarrier?.factoring_company?.id || 0))) {
                                props.setSelectedCarrier({
                                    id: props.selectedCarrier.id,
                                    factoring_company: {
                                        ...selectedFactoringCompany,
                                        mailing_address: { ...res.data.mailing_address }
                                    },
                                    component_id: props.componentId
                                });
                            }
                        }
                        setIsSavingFactoringCompanyMailingAddress(false);
                    }).catch(e => {
                        console.log('error on saving factoring company mailing address', e);
                        setIsSavingFactoringCompanyMailingAddress(false);
                    });
                } else {
                    setIsSavingFactoringCompanyMailingAddress(false);
                }
            } else {
                setIsSavingFactoringCompanyMailingAddress(false);
            }
        }
    }, [isSavingFactoringCompanyMailingAddress]);

    useEffect(async () => {
        let emails = [];
        (selectedFactoringCompany?.mailing_address?.mailing_contact?.email_work || '') !== '' && emails.push({ id: 1, type: 'work', email: selectedFactoringCompany?.mailing_address?.mailing_contact.email_work });
        (selectedFactoringCompany?.mailing_address?.mailing_contact?.email_personal || '') !== '' && emails.push({ id: 2, type: 'personal', email: selectedFactoringCompany?.mailing_address?.mailing_contact.email_personal });
        (selectedFactoringCompany?.mailing_address?.mailing_contact?.email_other || '') !== '' && emails.push({ id: 3, type: 'other', email: selectedFactoringCompany?.mailing_address?.mailing_contact.email_other });

        await setMailingContactEmailItems(emails);
    }, [
        selectedFactoringCompany?.mailing_address?.mailing_contact?.email_work,
        selectedFactoringCompany?.mailing_address?.mailing_contact?.email_personal,
        selectedFactoringCompany?.mailing_address?.mailing_contact?.email_other,
        selectedFactoringCompany?.mailing_address?.mailing_contact?.primary_email
    ]);

    useEffect(async () => {
        let phones = [];
        (selectedFactoringCompanyContact?.phone_work || '') !== '' && phones.push({ id: 1, type: 'work', phone: selectedFactoringCompanyContact.phone_work });
        (selectedFactoringCompanyContact?.phone_work_fax || '') !== '' && phones.push({ id: 2, type: 'fax', phone: selectedFactoringCompanyContact.phone_work_fax });
        (selectedFactoringCompanyContact?.phone_mobile || '') !== '' && phones.push({ id: 3, type: 'mobile', phone: selectedFactoringCompanyContact.phone_mobile });
        (selectedFactoringCompanyContact?.phone_direct || '') !== '' && phones.push({ id: 4, type: 'direct', phone: selectedFactoringCompanyContact.phone_direct });
        (selectedFactoringCompanyContact?.phone_other || '') !== '' && phones.push({ id: 5, type: 'other', phone: selectedFactoringCompanyContact.phone_other });

        await setFactoringCompanyContactPhoneItems(phones);
    }, [
        selectedFactoringCompanyContact?.phone_work,
        selectedFactoringCompanyContact?.phone_work_fax,
        selectedFactoringCompanyContact?.phone_mobile,
        selectedFactoringCompanyContact?.phone_direct,
        selectedFactoringCompanyContact?.phone_other,
        selectedFactoringCompanyContact?.primary_phone
    ]);

    useEffect(async () => {
        let emails = [];
        (selectedFactoringCompanyContact?.email_work || '') !== '' && emails.push({ id: 1, type: 'work', email: selectedFactoringCompanyContact.email_work });
        (selectedFactoringCompanyContact?.email_personal || '') !== '' && emails.push({ id: 2, type: 'personal', email: selectedFactoringCompanyContact.email_personal });
        (selectedFactoringCompanyContact?.email_other || '') !== '' && emails.push({ id: 3, type: 'other', email: selectedFactoringCompanyContact.email_other });

        await setFactoringCompanyContactEmailItems(emails);
    }, [
        selectedFactoringCompanyContact?.email_work,
        selectedFactoringCompanyContact?.email_personal,
        selectedFactoringCompanyContact?.email_other,
        selectedFactoringCompanyContact?.primary_email
    ]);

    useEffect(async () => {
        let phones = [];
        (selectedFactoringCompany?.mailing_address?.mailing_contact?.phone_work || '') !== '' && phones.push({ id: 1, type: 'work', phone: selectedFactoringCompany?.mailing_address?.mailing_contact.phone_work });
        (selectedFactoringCompany?.mailing_address?.mailing_contact?.phone_work_fax || '') !== '' && phones.push({ id: 2, type: 'fax', phone: selectedFactoringCompany?.mailing_address?.mailing_contact.phone_work_fax });
        (selectedFactoringCompany?.mailing_address?.mailing_contact?.phone_mobile || '') !== '' && phones.push({ id: 3, type: 'mobile', phone: selectedFactoringCompany?.mailing_address?.mailing_contact.phone_mobile });
        (selectedFactoringCompany?.mailing_address?.mailing_contact?.phone_direct || '') !== '' && phones.push({ id: 4, type: 'direct', phone: selectedFactoringCompany?.mailing_address?.mailing_contact.phone_direct });
        (selectedFactoringCompany?.mailing_address?.mailing_contact?.phone_other || '') !== '' && phones.push({ id: 5, type: 'other', phone: selectedFactoringCompany?.mailing_address?.mailing_contact.phone_other });

        await setMailingContactPhoneItems(phones);
    }, [
        selectedFactoringCompany?.mailing_address?.mailing_contact?.phone_work,
        selectedFactoringCompany?.mailing_address?.mailing_contact?.phone_work_fax,
        selectedFactoringCompany?.mailing_address?.mailing_contact?.phone_mobile,
        selectedFactoringCompany?.mailing_address?.mailing_contact?.phone_direct,
        selectedFactoringCompany?.mailing_address?.mailing_contact?.phone_other,
        selectedFactoringCompany?.mailing_address?.mailing_contact?.primary_phone
    ]);


    const setInitialValues = (clearCode = true) => {
        setSelectedFactoringCompany({ id: 0, code: clearCode ? '' : selectedFactoringCompany.code });
        setSelectedFactoringCompanyContact({});
        setSelectedFactoringCompanyIsShowingContactList(true);
        setSelectedFactoringCompanyNote({});
        setSelectedFactoringCompanyInvoices([]);
        setSelectedFactoringCompanyInvoiceSearch([]);
    }


    const searchFactoringCompanyBtnClick = () => {

        let factoringCompanySearch = [
            {
                field: 'Name',
                data: (selectedFactoringCompany.name || '').toLowerCase()
            },
            {
                field: 'Address 1',
                data: (selectedFactoringCompany.address1 || '').toLowerCase()
            },
            {
                field: 'Address 2',
                data: (selectedFactoringCompany.address2 || '').toLowerCase()
            },
            {
                field: 'City',
                data: (selectedFactoringCompany.city || '').toLowerCase()
            },
            {
                field: 'State',
                data: (selectedFactoringCompany.state || '').toLowerCase()
            },
            {
                field: 'Postal Code',
                data: (selectedFactoringCompany.zip || '').toLowerCase()
            },
            {
                field: 'E-Mail',
                data: (selectedFactoringCompany.email || '').toLowerCase()
            }
        ]

        let panel = {
            panelName: `${props.panelName}-factoring-company-search`,
            component: <CustomerSearch
                title='Factoring Company Search Results'
                tabTimes={20000 + props.tabTimes}
                panelName={`${props.panelName}-factoring-company-search`}
                origin={props.origin}
                suborigin={'factoring-company'}
                openPanel={props.openPanel}
                closePanel={props.closePanel}

                customerSearch={factoringCompanySearch}

                callback={async (factoringCompany) => {
                    if (factoringCompany) {
                        await setSelectedFactoringCompany(factoringCompany);
                        await setSelectedFactoringCompanyContact((factoringCompany.contacts || []).find(c => c.is_primary === 1) || {});
                        await props.closePanel(`${props.panelName}-factoring-company-search`, props.origin);
                        refFactoringCompanyName.current.focus();
                    } else {
                        refFactoringCompanyCode.current.focus();
                    }
                }}
            />
        }

        props.openPanel(panel, props.origin);
    }

    const getFactoringCompanyByCode = (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            if (e.target.value.trim() === '') {
                setInitialValues();
            } else {
                setIsLoading(true);
                axios.post(props.serverUrl + '/factoringCompanies', { code: e.target.value.trim().toLowerCase() }).then(async res => {
                    if (res.data.result === 'OK') {
                        if (res.data.factoring_companies.length > 0) {
                            setSelectedFactoringCompany({ ...res.data.factoring_companies[0] });

                            if (res.data.factoring_companies[0].contacts.length > 0) {
                                res.data.factoring_companies[0].contacts.map((contact, index) => {
                                    if (contact.is_primary === 1) {
                                        setSelectedFactoringCompanyContact(contact);
                                    }

                                    return true;
                                });
                            }

                            axios.post(props.serverUrl + '/getFactoringCompanyOutstandingInvoices', {
                                factoring_company_id: res.data.factoring_companies[0].id
                            }).then(res => {
                                if (res.data.result === 'OK') {
                                    setSelectedFactoringCompany(selectedFactoringCompany => {
                                        return {
                                            ...selectedFactoringCompany,
                                            orders: res.data.orders
                                        }
                                    })
                                }
                            }).catch(e => {
                                console.log('error getting factoring company invoices');
                            }).finally(() => {
                                setIsLoading(false);
                            });
                        } else {
                            setInitialValues(false);
                        }
                    }
                }).catch(e => {
                    console.log('error getting factoring companies');
                });
            }
        }
    }

    const validateFactoringCompanyToSave = (e) => {
        let key = e.keyCode || e.which;

        if (key === 9) {
            if (!isSavingFactoringCompany) {
                setIsSavingFactoringCompany(true);
            }
        }
    }

    const validateContactForSaving = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            if (!isSavingFactoringCompanyContact) {
                setIsSavingFactoringCompanyContact(true);
            }
        }
    }

    const validateMailingAddressToSave = (e) => {
        let key = e.keyCode || e.which;

        if ((selectedFactoringCompany.id || 0) > 0) {
            if (key === 9) {
                if (!isSavingFactoringCompanyMailingAddress) {
                    setIsSavingFactoringCompanyMailingAddress(true);
                }
            }
        }
    }

    const searchContactBtnClick = () => {
        let filters = [
            {
                field: 'Factoring Company Id',
                data: selectedFactoringCompany.id || 0
            },
            {
                field: 'First Name',
                data: (selectedFactoringCompanyContactSearch.first_name || '').toLowerCase()
            },
            {
                field: 'Last Name',
                data: (selectedFactoringCompanyContactSearch.last_name || '').toLowerCase()
            },
            {
                field: 'Address 1',
                data: (selectedFactoringCompanyContactSearch.address1 || '').toLowerCase()
            },
            {
                field: 'Address 2',
                data: (selectedFactoringCompanyContactSearch.address2 || '').toLowerCase()
            },
            {
                field: 'City',
                data: (selectedFactoringCompanyContactSearch.city || '').toLowerCase()
            },
            {
                field: 'State',
                data: (selectedFactoringCompanyContactSearch.state || '').toLowerCase()
            },
            {
                field: 'Phone',
                data: selectedFactoringCompanyContactSearch.phone || ''
            },
            {
                field: 'E-Mail',
                data: (selectedFactoringCompanyContactSearch.email || '').toLowerCase()
            }
        ]

        let panel = {
            panelName: `${props.panelName}-contact-search`,
            component: <ContactSearch
                title='Contact Search Results'
                tabTimes={22000 + props.tabTimes}
                panelName={`${props.panelName}-contact-search`}
                owner='factoring-company'
                origin={props.origin}
                suborigin='factoring-company'
                openPanel={props.openPanel}
                closePanel={props.closePanel}

                contactSearch={{ search: filters }}

                callback={(contact) => {
                    if (contact) {
                        setSelectedFactoringCompany(contact.factoring_company);
                        setSelectedFactoringCompanyContact((contact.factoring_company.contacts || []).find(c => c.is_primary === 1) || {});

                        setSelectedFactoringCompanyIsShowingContactList(true);
                        setSelectedFactoringCompanyContactSearch({});
                        refFactoringCompanyName.current.focus();
                    } else {
                        refFactoringCompanyCode.current.focus();
                    }
                }}
            />
        }

        props.openPanel(panel, props.origin);
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

    const searchInvoiceBtnClick = async () => {
        let filters = [
            {
                field: 'Factoring Company Id',
                data: selectedFactoringCompany.id || 0
            },
            {
                field: 'Invoice Date',
                data: (selectedFactoringCompanyInvoiceSearch.invoice_date || '').toLowerCase()
            },
            {
                field: 'Pick Up Location',
                data: (selectedFactoringCompanyInvoiceSearch.pickup_location || '').toLowerCase()
            },
            {
                field: 'Delivery Location',
                data: (selectedFactoringCompanyInvoiceSearch.delivery_location || '').toLowerCase()
            },
            {
                field: 'Invoice Number',
                data: (selectedFactoringCompanyInvoiceSearch.invoice_number || '').toLowerCase()
            },
            {
                field: 'Order Number',
                data: (selectedFactoringCompanyInvoiceSearch.order_number || '').toLowerCase()
            },
            {
                field: 'Trip Number',
                data: (selectedFactoringCompanyInvoiceSearch.trip_number || '').toLowerCase()
            },
            {
                field: 'Invoice Amount',
                data: selectedFactoringCompanyInvoiceSearch.invoice_amount || ''
            },
            {
                field: 'Customer Code',
                data: (selectedFactoringCompanyInvoiceSearch.customer_code || '').toLowerCase()
            },
            {
                field: 'Customer Name',
                data: (selectedFactoringCompanyInvoiceSearch.customer_name || '').toLowerCase()
            }
            ,
            {
                field: 'Carrier Code',
                data: (selectedFactoringCompanyInvoiceSearch.carrier_code || '').toLowerCase()
            },
            {
                field: 'Carrier Name',
                data: (selectedFactoringCompanyInvoiceSearch.carrier_name || '').toLowerCase()
            }
        ]

    }

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>

            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style} >
                        <div className="loading-container-wrapper">
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                        </div>
                    </animated.div>
                )
            }

            <div className="factoring-company-container">
                <div className="fields-container-col">
                    <div className="form-bordered-box">
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Customers</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button" onClick={searchFactoringCompanyBtnClick}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Search</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={() => {
                                    setInitialValues();
                                    refFactoringCompanyCode.current.focus();
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
                                <input type="text" placeholder="Code" maxLength="8" style={{ textTransform: 'uppercase' }}
                                    ref={refFactoringCompanyCode}
                                    onKeyDown={getFactoringCompanyByCode}
                                    onChange={e => setSelectedFactoringCompany({ ...selectedFactoringCompany, code: e.target.value })}
                                    value={(selectedFactoringCompany.code_number || 0) === 0 ? (selectedFactoringCompany.code || '') : selectedFactoringCompany.code + selectedFactoringCompany.code_number} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input type="text" placeholder="Name"
                                    ref={refFactoringCompanyName}
                                    // onKeyDown={validateFactoringCompanyToSave}
                                    onChange={e => setSelectedFactoringCompany({ ...selectedFactoringCompany, name: e.target.value })}
                                    value={selectedFactoringCompany.name || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input type="text" placeholder="Address 1"
                                    // onKeyDown={validateFactoringCompanyToSave}
                                    onChange={e => setSelectedFactoringCompany({ ...selectedFactoringCompany, address1: e.target.value })}
                                    value={selectedFactoringCompany.address1 || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input type="text" placeholder="Address 2"
                                    // onKeyDown={validateFactoringCompanyToSave}
                                    onChange={e => setSelectedFactoringCompany({ ...selectedFactoringCompany, address2: e.target.value })}
                                    value={selectedFactoringCompany.address2 || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input type="text" placeholder="City"
                                    // onKeyDown={validateFactoringCompanyToSave}
                                    onChange={e => setSelectedFactoringCompany({ ...selectedFactoringCompany, city: e.target.value })}
                                    value={selectedFactoringCompany.city || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-state">
                                <input type="text" placeholder="State" maxLength="2"
                                    // onKeyDown={validateFactoringCompanyToSave}
                                    onChange={e => setSelectedFactoringCompany({ ...selectedFactoringCompany, state: e.target.value })}
                                    value={selectedFactoringCompany.state || ''} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-zip-code">
                                <input type="text" placeholder="Postal Code"
                                    onKeyDown={validateFactoringCompanyToSave}
                                    onChange={e => setSelectedFactoringCompany({ ...selectedFactoringCompany, zip: e.target.value })}
                                    value={selectedFactoringCompany.zip || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input type="text" placeholder="Contact Name"
                                    onInput={(e) => {
                                        if ((selectedFactoringCompany?.contacts || []).length === 0) {
                                            setSelectedFactoringCompany({ ...selectedFactoringCompany, contact_name: e.target.value })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedFactoringCompany?.contacts || []).length === 0) {
                                            setSelectedFactoringCompany({ ...selectedFactoringCompany, contact_name: e.target.value })
                                        }
                                    }}
                                    value={
                                        (selectedFactoringCompany?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedFactoringCompany?.contact_name || '')
                                            // ? ''
                                            : selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).first_name + ' ' + selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).last_name
                                    }
                                />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-phone" style={{ position: 'relative' }}>
                                <MaskedInput
                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    guide={true}
                                    type="text" placeholder="Contact Phone"
                                    onInput={(e) => {
                                        if ((selectedFactoringCompany?.contacts || []).length === 0) {
                                            setSelectedFactoringCompany({ ...selectedFactoringCompany, contact_phone: e.target.value })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedFactoringCompany?.contacts || []).length === 0) {
                                            setSelectedFactoringCompany({ ...selectedFactoringCompany, contact_phone: e.target.value })
                                        }
                                    }}
                                    value={
                                        (selectedFactoringCompany?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedFactoringCompany?.contact_phone || '')
                                            // ? ''
                                            : selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).primary_phone === 'work'
                                                ? selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).phone_work
                                                : selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).primary_phone === 'fax'
                                                    ? selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).phone_work_fax
                                                    : selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).primary_phone === 'mobile'
                                                        ? selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).phone_mobile
                                                        : selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).primary_phone === 'direct'
                                                            ? selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).phone_direct
                                                            : selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).primary_phone === 'other'
                                                                ? selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).phone_other
                                                                : ''
                                    }
                                />

                                {
                                    ((selectedFactoringCompany?.contacts || []).find(c => c.is_primary === 1) !== undefined) &&
                                    <div
                                        className={classnames({
                                            'selected-factoring-company-contact-primary-phone': true,
                                            'pushed': false
                                        })}>
                                        {selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).primary_phone}
                                    </div>
                                }
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-phone-ext">
                                <input type="text" placeholder="Ext"
                                    onInput={(e) => {
                                        if ((selectedFactoringCompany?.contacts || []).length === 0) {
                                            setSelectedFactoringCompany({ ...selectedFactoringCompany, ext: e.target.value })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedFactoringCompany?.contacts || []).length === 0) {
                                            setSelectedFactoringCompany({ ...selectedFactoringCompany, ext: e.target.value })
                                        }
                                    }}
                                    value={
                                        (selectedFactoringCompany?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedFactoringCompany?.ext || '')
                                            // ? ''
                                            : selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).phone_ext
                                    }
                                />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container" style={{ position: 'relative', flexGrow: 1 }}
                                onMouseEnter={() => {
                                    if ((selectedFactoringCompany?.email || '') !== '') {
                                        setShowFactoringCompanyEmailCopyBtn(true);
                                    }
                                }}
                                onFocus={() => {
                                    if ((selectedFactoringCompany?.email || '') !== '') {
                                        setShowFactoringCompanyEmailCopyBtn(true);
                                    }
                                }}
                                onBlur={() => {
                                    window.setTimeout(() => {
                                        setShowFactoringCompanyEmailCopyBtn(false);
                                    }, 1000);
                                }}
                                onMouseLeave={() => {
                                    setShowFactoringCompanyEmailCopyBtn(false);
                                }}
                            >
                                <input type="text" placeholder="E-Mail" style={{ textTransform: 'lowercase' }}
                                    ref={refFactoringCompanyEmail}
                                    onKeyDown={validateFactoringCompanyToSave}
                                    onInput={(e) => {
                                        if ((selectedFactoringCompany?.contacts || []).length === 0) {
                                            setSelectedFactoringCompany({ ...selectedFactoringCompany, email: e.target.value })
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((selectedFactoringCompany?.contacts || []).length === 0) {
                                            setSelectedFactoringCompany({ ...selectedFactoringCompany, email: e.target.value })
                                        }
                                    }}
                                    value={
                                        (selectedFactoringCompany?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (selectedFactoringCompany?.email || '')
                                            // ? ''
                                            : selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).primary_email === 'work'
                                                ? selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).email_work
                                                : selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).primary_email === 'personal'
                                                    ? selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).email_personal
                                                    : selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).primary_email === 'other'
                                                        ? selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).email_other
                                                        : ''
                                    }
                                />
                                {
                                    ((selectedFactoringCompany?.contacts || []).find(c => c.is_primary === 1) !== undefined) &&
                                    <div
                                        className={classnames({
                                            'selected-factoring-company-contact-primary-email': true,
                                            'pushed': false
                                        })}>
                                        {selectedFactoringCompany?.contacts.find(c => c.is_primary === 1).primary_email}
                                    </div>
                                }

                                {
                                    showFactoringCompanyEmailCopyBtn &&
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
                                        navigator.clipboard.writeText(refFactoringCompanyEmail.current.value);
                                    }} />
                                }
                            </div>
                        </div>
                    </div>

                    {/* ================================================================================================ */}

                    <div className="form-bordered-box">
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Mailing Address</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button" onClick={async () => {
                                    if ((selectedFactoringCompany.id || 0) === 0) {
                                        window.alert('You must select a factoring company first!');
                                        return;
                                    }

                                    let mailing_address = {};

                                    mailing_address.id = 0;
                                    mailing_address.factoring_company_id = selectedFactoringCompany.id;
                                    mailing_address.code = selectedFactoringCompany.code;
                                    mailing_address.code_number = selectedFactoringCompany.code_number;
                                    mailing_address.name = selectedFactoringCompany.name;
                                    mailing_address.address1 = selectedFactoringCompany.address1;
                                    mailing_address.address2 = selectedFactoringCompany.address2;
                                    mailing_address.city = selectedFactoringCompany.city;
                                    mailing_address.state = selectedFactoringCompany.state;
                                    mailing_address.zip = selectedFactoringCompany.zip;
                                    mailing_address.contact_name = selectedFactoringCompany.contact_name;
                                    mailing_address.contact_phone = selectedFactoringCompany.contact_phone;
                                    mailing_address.ext = selectedFactoringCompany.ext;
                                    mailing_address.email = selectedFactoringCompany.email;

                                    if ((selectedFactoringCompanyContact?.id || 0) > 0) {
                                        mailing_address.mailing_contact_id = selectedFactoringCompanyContact.id;
                                        mailing_address.mailing_contact = selectedFactoringCompanyContact;

                                        mailing_address.mailing_contact_primary_phone = selectedFactoringCompanyContact.phone_work !== ''
                                            ? 'work'
                                            : selectedFactoringCompanyContact.phone_work_fax !== ''
                                                ? 'fax'
                                                : selectedFactoringCompanyContact.phone_mobile !== ''
                                                    ? 'mobile'
                                                    : selectedFactoringCompanyContact.phone_direct !== ''
                                                        ? 'direct'
                                                        : selectedFactoringCompanyContact.phone_other !== ''
                                                            ? 'other' : 'work';

                                        mailing_address.mailing_contact_primary_email = selectedFactoringCompanyContact.email_work !== ''
                                            ? 'work'
                                            : selectedFactoringCompanyContact.email_personal !== ''
                                                ? 'personal'
                                                : selectedFactoringCompanyContact.email_other !== ''
                                                    ? 'other' : 'work';

                                    } else if (selectedFactoringCompany.contacts.findIndex(x => x.is_primary === 1) > -1) {
                                        mailing_address.mailing_contact_id = selectedFactoringCompany.contacts[selectedFactoringCompany.contacts.findIndex(x => x.is_primary === 1)].id;
                                        mailing_address.mailing_contact = selectedFactoringCompany.contacts[selectedFactoringCompany.contacts.findIndex(x => x.is_primary === 1)];

                                        mailing_address.mailing_contact_primary_phone = selectedFactoringCompany.contacts[selectedFactoringCompany.contacts.findIndex(x => x.is_primary === 1)].phone_work !== ''
                                            ? 'work'
                                            : selectedFactoringCompany.contacts[selectedFactoringCompany.contacts.findIndex(x => x.is_primary === 1)].phone_work_fax !== ''
                                                ? 'fax'
                                                : selectedFactoringCompany.contacts[selectedFactoringCompany.contacts.findIndex(x => x.is_primary === 1)].phone_mobile !== ''
                                                    ? 'mobile'
                                                    : selectedFactoringCompany.contacts[selectedFactoringCompany.contacts.findIndex(x => x.is_primary === 1)].phone_direct !== ''
                                                        ? 'direct'
                                                        : selectedFactoringCompany.contacts[selectedFactoringCompany.contacts.findIndex(x => x.is_primary === 1)].phone_other !== ''
                                                            ? 'other' : 'work';

                                        mailing_address.mailing_contact_primary_email = selectedFactoringCompany.contacts[selectedFactoringCompany.contacts.findIndex(x => x.is_primary === 1)].email_work !== ''
                                            ? 'work'
                                            : selectedFactoringCompany.contacts[selectedFactoringCompany.contacts.findIndex(x => x.is_primary === 1)].email_personal !== ''
                                                ? 'personal'
                                                : selectedFactoringCompany.contacts[selectedFactoringCompany.contacts.findIndex(x => x.is_primary === 1)].email_other !== ''
                                                    ? 'other' : 'work';

                                    } else if (selectedFactoringCompany.contacts.length > 0) {
                                        mailing_address.mailing_contact_id = selectedFactoringCompany.contacts[0].id;
                                        mailing_address.mailing_contact = selectedFactoringCompany.contacts[0];

                                        mailing_address.mailing_contact_primary_phone = selectedFactoringCompany.contacts[0].phone_work !== ''
                                            ? 'work'
                                            : selectedFactoringCompany.contacts[0].phone_work_fax !== ''
                                                ? 'fax'
                                                : selectedFactoringCompany.contacts[0].phone_mobile !== ''
                                                    ? 'mobile'
                                                    : selectedFactoringCompany.contacts[0].phone_direct !== ''
                                                        ? 'direct'
                                                        : selectedFactoringCompany.contacts[0].phone_other !== ''
                                                            ? 'other' : 'work';

                                        mailing_address.mailing_contact_primary_email = selectedFactoringCompany.contacts[0].email_work !== ''
                                            ? 'work'
                                            : selectedFactoringCompany.contacts[0].email_personal !== ''
                                                ? 'personal'
                                                : selectedFactoringCompany.contacts[0].email_other !== ''
                                                    ? 'other' : 'work';

                                    } else {
                                        mailing_address.mailing_contact_id = null;
                                        mailing_address.mailing_contact = {};
                                        mailing_address.mailing_contact_primary_phone = 'work';
                                        mailing_address.mailing_contact_primary_email = 'work';
                                    }

                                    await setSelectedFactoringCompany({ ...selectedFactoringCompany, mailing_address: mailing_address });

                                    validateMailingAddressToSave({ keyCode: 9 });
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Remit to address is the same</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={() => {
                                    if ((selectedFactoringCompany.id || 0) === 0) {
                                        return;
                                    }

                                    setSelectedFactoringCompany({ ...selectedFactoringCompany, mailing_address: {} })

                                    axios.post(props.serverUrl + '/deleteFactoringCompanyMailingAddress', { factoring_company_id: selectedFactoringCompany.id }).then(res => {
                                        if (res.data.result === 'OK') {

                                        }
                                    }).catch(e => {
                                        console.log('error deleting factoring company mailing address');
                                    });
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
                                <input type="text" placeholder="Code" maxLength="8" readOnly={true} style={{ textTransform: 'uppercase' }}
                                    onChange={e => {
                                        let mailing_address = selectedFactoringCompany.mailing_address || {};
                                        mailing_address.code = e.target.value;
                                        setSelectedFactoringCompany({ ...selectedFactoringCompany, mailing_address: mailing_address });
                                    }}
                                    value={(selectedFactoringCompany.mailing_address?.code || '') + ((selectedFactoringCompany.mailing_address?.code_number || 0) === 0 ? '' : selectedFactoringCompany.mailing_address.code_number)} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input type="text" placeholder="Name"
                                    // onKeyDown={validateMailingAddressToSave}
                                    onChange={e => {
                                        let mailing_address = selectedFactoringCompany.mailing_address || {};
                                        mailing_address.name = e.target.value;
                                        setSelectedFactoringCompany({ ...selectedFactoringCompany, mailing_address: mailing_address });
                                    }}
                                    value={(selectedFactoringCompany.mailing_address?.name || '')} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input type="text" placeholder="Address 1"
                                    // onKeyDown={validateMailingAddressToSave}
                                    onChange={e => {
                                        let mailing_address = selectedFactoringCompany.mailing_address || {};
                                        mailing_address.address1 = e.target.value;
                                        setSelectedFactoringCompany({ ...selectedFactoringCompany, mailing_address: mailing_address });
                                    }}
                                    value={(selectedFactoringCompany.mailing_address?.address1 || '')} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input type="text" placeholder="Address 2"
                                    // onKeyDown={validateMailingAddressToSave}
                                    onChange={e => {
                                        let mailing_address = selectedFactoringCompany.mailing_address || {};
                                        mailing_address.address2 = e.target.value;
                                        setSelectedFactoringCompany({ ...selectedFactoringCompany, mailing_address: mailing_address });
                                    }}
                                    value={(selectedFactoringCompany.mailing_address?.address2 || '')} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input type="text" placeholder="City"
                                    // onKeyDown={validateMailingAddressToSave}
                                    onChange={e => {
                                        let mailing_address = selectedFactoringCompany.mailing_address || {};
                                        mailing_address.city = e.target.value;
                                        setSelectedFactoringCompany({ ...selectedFactoringCompany, mailing_address: mailing_address });
                                    }}
                                    value={(selectedFactoringCompany.mailing_address?.city || '')} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-state">
                                <input type="text" placeholder="State" maxLength="2"
                                    // onKeyDown={validateMailingAddressToSave}
                                    onChange={e => {
                                        let mailing_address = selectedFactoringCompany.mailing_address || {};
                                        mailing_address.state = e.target.value;
                                        setSelectedFactoringCompany({ ...selectedFactoringCompany, mailing_address: mailing_address });
                                    }}
                                    value={(selectedFactoringCompany.mailing_address?.state || '')} />
                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container input-zip-code">
                                <input type="text" placeholder="Postal Code"
                                    onKeyDown={validateMailingAddressToSave}
                                    onChange={e => {
                                        let mailing_address = selectedFactoringCompany.mailing_address || {};
                                        mailing_address.zip = e.target.value;
                                        setSelectedFactoringCompany({ ...selectedFactoringCompany, mailing_address: mailing_address });
                                    }}
                                    value={(selectedFactoringCompany.mailing_address?.zip || '')} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ flexGrow: 1 }}>
                                <div className="select-box-wrapper">
                                    <input type="text" placeholder="Contact Name"
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
                                                            await setMailingContactNameItems((selectedFactoringCompany?.contacts || []).map((item, index) => {
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
                                                            await setMailingContactNameItems((selectedFactoringCompany?.contacts || []).map((item, index) => {
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
                                                        await setSelectedFactoringCompany({
                                                            ...selectedFactoringCompany,
                                                            mailing_address: {
                                                                ...(selectedFactoringCompany?.mailing_address || {}),
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

                                                        // validateMailingAddressToSave({ keyCode: 9 });
                                                        setShowMailingContactNames(false);
                                                        refMailingContactName.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showMailingContactNames) {
                                                        e.preventDefault();
                                                        await setSelectedFactoringCompany({
                                                            ...selectedFactoringCompany,
                                                            mailing_address: {
                                                                ...(selectedFactoringCompany?.mailing_address || {}),
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

                                                        // validateMailingAddressToSave({ keyCode: 9 });
                                                        setShowMailingContactNames(false);
                                                        refMailingContactName.current.focus();
                                                    } else {
                                                        // validateMailingAddressToSave({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                           onBlur={e => {
                                               let contact = (selectedFactoringCompany?.contacts || []).find(x => (x.first_name + ' ' + x.last_name).toLowerCase() === e.target.value.toLowerCase());

                                               if (contact) {
                                                   setSelectedFactoringCompany(selectedFactoringCompany => {
                                                       return {
                                                           ...selectedFactoringCompany,
                                                           mailing_address: {
                                                               ...(selectedFactoringCompany?.mailing_address || {}),
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
                                                   setSelectedFactoringCompany(selectedFactoringCompany => {
                                                       return {
                                                           ...selectedFactoringCompany,
                                                           mailing_address: {
                                                               ...(selectedFactoringCompany?.mailing_address || {}),
                                                               mailing_contact_id: null,
                                                           }
                                                       }
                                                   })
                                               }
                                           }}
                                           onInput={e => {
                                               setSelectedFactoringCompany(selectedFactoringCompany => {
                                                   return {
                                                       ...selectedFactoringCompany,
                                                       mailing_address: {
                                                           ...(selectedFactoringCompany?.mailing_address || {}),
                                                           contact_name: e.target.value
                                                       }
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedFactoringCompany(selectedFactoringCompany => {
                                                   return {
                                                       ...selectedFactoringCompany,
                                                       mailing_address: {
                                                           ...(selectedFactoringCompany?.mailing_address || {}),
                                                           contact_name: e.target.value
                                                       }
                                                   }
                                               })
                                           }}
                                           value={selectedFactoringCompany?.mailing_address?.contact_name || ''}
                                    />

                                    {
                                        ((selectedFactoringCompany?.contacts || []).length > 0 && (selectedFactoringCompany?.mailing_address?.id !== undefined)) &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
                                            if (showMailingContactNames) {
                                                setShowMailingContactNames(false);
                                            } else {
                                                if ((selectedFactoringCompany?.contacts || []).length > 0) {
                                                    await setMailingContactNameItems((selectedFactoringCompany?.contacts || []).map((item, index) => {
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
                                                                            await setSelectedFactoringCompany(selectedFactoringCompany => {
                                                                                return {
                                                                                    ...selectedFactoringCompany,
                                                                                    mailing_address: {
                                                                                        ...(selectedFactoringCompany?.mailing_address || {}),
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

                                                                            // validateMailingAddressToSave({ keyCode: 9 });
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
                                    <MaskedInput
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
                                                        await setSelectedFactoringCompany(selectedFactoringCompany => {
                                                            return {
                                                                ...selectedFactoringCompany,
                                                                mailing_address: {
                                                                    ...(selectedFactoringCompany?.mailing_address || {}),
                                                                    contact_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].phone,
                                                                    mailing_contact_primary_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].type
                                                                }
                                                            }
                                                        });

                                                        // validateMailingAddressToSave({ keyCode: 9 });
                                                        setShowMailingContactPhones(false);
                                                        refMailingContactPhone.current.inputElement.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showMailingContactPhones) {
                                                        e.preventDefault();
                                                        await setSelectedFactoringCompany(selectedFactoringCompany => {
                                                            return {
                                                                ...selectedFactoringCompany,
                                                                mailing_address: {
                                                                    ...(selectedFactoringCompany?.mailing_address || {}),
                                                                    contact_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].phone,
                                                                    mailing_contact_primary_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].type
                                                                }
                                                            }
                                                        });

                                                        // validateMailingAddressToSave({ keyCode: 9 });
                                                        setShowMailingContactPhones(false);
                                                        refMailingContactPhone.current.inputElement.focus();
                                                    } else {
                                                        // validateMailingAddressToSave({ keyCode: 9 });
                                                    }
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={(e) => {
                                            setSelectedFactoringCompany(selectedFactoringCompany => {
                                                return {
                                                    ...selectedFactoringCompany,
                                                    mailing_address: {
                                                        ...(selectedFactoringCompany?.mailing_address || {}),
                                                        contact_phone: e.target.value
                                                    }
                                                }
                                            })
                                        }}
                                        onChange={(e) => {
                                            setSelectedFactoringCompany(selectedFactoringCompany => {
                                                return {
                                                    ...selectedFactoringCompany,
                                                    mailing_address: {
                                                        ...(selectedFactoringCompany?.mailing_address || {}),
                                                        contact_phone: e.target.value
                                                    }
                                                }
                                            })
                                        }}
                                        value={selectedFactoringCompany?.mailing_address?.contact_phone}
                                    />

                                    {
                                        ((selectedFactoringCompany?.id || 0) > 0 && (selectedFactoringCompany?.mailing_address?.id !== undefined)) &&
                                        <div
                                            className={classnames({
                                                'selected-mailing-contact-primary-phone': true,
                                                'pushed': (mailingContactPhoneItems.length > 1)
                                            })}>
                                            {selectedFactoringCompany?.mailing_address?.mailing_contact_id ? (selectedFactoringCompany?.mailing_address?.mailing_contact_primary_phone || '') : ''}
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
                                                                            await setSelectedFactoringCompany(selectedFactoringCompany => {
                                                                                return {
                                                                                    ...selectedFactoringCompany,
                                                                                    mailing_address: {
                                                                                        ...(selectedFactoringCompany?.mailing_address || {}),
                                                                                        contact_phone: item.phone,
                                                                                        mailing_contact_primary_phone: item.type
                                                                                    }
                                                                                }
                                                                            });

                                                                            // validateMailingAddressToSave({ keyCode: 9 });
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
                                <input type="text" placeholder="Ext"
                                       onInput={e => {
                                           setSelectedFactoringCompany(selectedFactoringCompany => {
                                               return {
                                                   ...selectedFactoringCompany,
                                                   mailing_address: {
                                                       ...(selectedFactoringCompany?.mailing_address || {}),
                                                       ext: e.target.value
                                                   }
                                               }
                                           })
                                       }}
                                       onChange={e => {
                                           setSelectedFactoringCompany(selectedFactoringCompany => {
                                               return {
                                                   ...selectedFactoringCompany,
                                                   mailing_address: {
                                                       ...(selectedFactoringCompany?.mailing_address || {}),
                                                       ext: e.target.value
                                                   }
                                               }
                                           })
                                       }}
                                       value={selectedFactoringCompany?.mailing_address?.ext || ''}/>
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ flexGrow: 1 }}
                                 onMouseEnter={() => {
                                     if ((selectedFactoringCompany?.mailing_address?.email || '') !== '') {
                                         setShowMailingContactEmailCopyBtn(true);
                                     }
                                 }}
                                 onFocus={() => {
                                     if ((selectedFactoringCompany?.mailing_address?.email || '') !== '') {
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
                                    <input type="text" placeholder="E-Mail"
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
                                                        await setSelectedFactoringCompany(selectedFactoringCompany => {
                                                            return {
                                                                ...selectedFactoringCompany,
                                                                mailing_address: {
                                                                    ...(selectedFactoringCompany?.mailing_address || {}),
                                                                    email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].email,
                                                                    mailing_contact_primary_email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].type
                                                                }
                                                            }
                                                        });

                                                        // validateMailingAddressToSave({ keyCode: 9 });
                                                        setShowMailingContactEmails(false);
                                                        refMailingContactEmail.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showMailingContactEmails) {
                                                        e.preventDefault();
                                                        await setSelectedFactoringCompany(selectedFactoringCompany => {
                                                            return {
                                                                ...selectedFactoringCompany,
                                                                mailing_address: {
                                                                    ...(selectedFactoringCompany?.mailing_address || {}),
                                                                    email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].email,
                                                                    mailing_contact_primary_email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].type
                                                                }
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
                                           onInput={e => {
                                               setSelectedFactoringCompany(selectedFactoringCompany => {
                                                   return {
                                                       ...selectedFactoringCompany,
                                                       mailing_address: {
                                                           ...(selectedFactoringCompany?.mailing_address || {}),
                                                           email: e.target.value
                                                       }
                                                   }
                                               })
                                           }}
                                           onChange={e => {
                                               setSelectedFactoringCompany(selectedFactoringCompany => {
                                                   return {
                                                       ...selectedFactoringCompany,
                                                       mailing_address: {
                                                           ...(selectedFactoringCompany?.mailing_address || {}),
                                                           email: e.target.value
                                                       }
                                                   }
                                               })
                                           }}
                                           value={selectedFactoringCompany?.mailing_address?.email || ''}
                                    />

                                    {
                                        ((selectedFactoringCompany?.id || 0) > 0 && (selectedFactoringCompany?.mailing_address?.id !== undefined)) &&
                                        <div
                                            className={classnames({
                                                'selected-mailing-contact-primary-email': true,
                                                'pushed': (mailingContactEmailItems.length > 1)
                                            })}>
                                            {(selectedFactoringCompany?.mailing_address?.mailing_contact_id || 0) > 0 ? (selectedFactoringCompany?.mailing_address?.mailing_contact_primary_email || '') : ''}
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
                                                                            await setSelectedFactoringCompany(selectedFactoringCompany => {
                                                                                return {
                                                                                    ...selectedFactoringCompany,
                                                                                    mailing_address: {
                                                                                        ...(selectedFactoringCompany?.mailing_address || {}),
                                                                                        email: item.email,
                                                                                        mailing_contact_primary_email: item.type
                                                                                    }
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

                    {/* ======================================================================================= */}

                    <div className="form-bordered-box">
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="form-title">Contacts</div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                <div className="mochi-button" onClick={async () => {
                                    if ((selectedFactoringCompany.id || 0) === 0) {
                                        window.alert('You must select a factoring company first!');
                                        return;
                                    }

                                    if (selectedFactoringCompanyContact.id === undefined) {
                                        window.alert('You must select a contact');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-contacts`,
                                        component: <Contacts
                                            title='Contacts'
                                            tabTimes={22000 + props.tabTimes}
                                            panelName={`${props.panelName}-contacts`}
                                            savingContactUrl='/saveFactoringCompanyContact'
                                            deletingContactUrl='/deleteFactoringCompanyContact'
                                            uploadAvatarUrl='/uploadFactoringCompanyAvatar'
                                            removeAvatarUrl='/removeFactoringCompanyAvatar'
                                            origin={props.origin}
                                            owner='factoring-company'
                                            openPanel={props.openPanel}
                                            closePanel={props.closePanel}

                                            contactSearchCustomer={{
                                                ...selectedFactoringCompany,
                                                selectedContact: {
                                                    ...selectedFactoringCompanyContact,
                                                    address1: (selectedFactoringCompany?.address1 || '').toLowerCase() === (selectedFactoringCompanyContact?.address1 || '').toLowerCase() ? (selectedFactoringCompany?.address1 || '') : (selectedFactoringCompanyContact?.address1 || ''),
                                                    address2: (selectedFactoringCompany?.address2 || '').toLowerCase() === (selectedFactoringCompanyContact?.address2 || '').toLowerCase() ? (selectedFactoringCompany?.address2 || '') : (selectedFactoringCompanyContact?.address2 || ''),
                                                    city: (selectedFactoringCompany?.city || '').toLowerCase() === (selectedFactoringCompanyContact?.city || '').toLowerCase() ? (selectedFactoringCompany?.city || '') : (selectedFactoringCompanyContact?.city || ''),
                                                    state: (selectedFactoringCompany?.state || '').toLowerCase() === (selectedFactoringCompanyContact?.state || '').toLowerCase() ? (selectedFactoringCompany?.state || '') : (selectedFactoringCompanyContact?.state || ''),
                                                    zip_code: (selectedFactoringCompany?.zip || '').toLowerCase() === (selectedFactoringCompanyContact?.zip_code || '').toLowerCase() ? (selectedFactoringCompany?.zip || '') : (selectedFactoringCompanyContact?.zip_code || ''),
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
                                <div className="mochi-button" onClick={() => {
                                    if ((selectedFactoringCompany.id || 0) === 0) {
                                        window.alert('You must select a factoring company first!');
                                        return;
                                    }

                                    let panel = {
                                        panelName: `${props.panelName}-contacts`,
                                        component: <Contacts
                                            title='Contacts'
                                            tabTimes={22000 + props.tabTimes}
                                            panelName={`${props.panelName}-contacts`}
                                            savingContactUrl='/saveFactoringCompanyContact'
                                            deletingContactUrl='/deleteFactoringCompanyContact'
                                            uploadAvatarUrl='/uploadFactoringCompanyAvatar'
                                            removeAvatarUrl='/removeFactoringCompanyAvatar'
                                            origin={props.origin}
                                            owner='factoring-company'
                                            openPanel={props.openPanel}
                                            closePanel={props.closePanel}
                                            isEditingContact={true}

                                            contactSearchCustomer={{
                                                ...selectedFactoringCompany,
                                                selectedContact: { id: 0, factoring_company_id: selectedFactoringCompany?.id }
                                            }}
                                        />
                                    }

                                    props.openPanel(panel, props.origin);
                                }}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Add Contact</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                                <div className="mochi-button" onClick={() => setSelectedFactoringCompanyContact({})}>
                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                    <div className="mochi-button-base">Clear</div>
                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                </div>
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-row">
                            <div className="input-box-container grow">
                                <input type="text" placeholder="First Name"
                                    // onKeyDown={validateContactForSaving}
                                    onChange={e => {
                                        setSelectedFactoringCompanyContact({ ...selectedFactoringCompanyContact, first_name: e.target.value })
                                    }}
                                    value={selectedFactoringCompanyContact.first_name || ''} />

                            </div>
                            <div className="form-h-sep"></div>
                            <div className="input-box-container grow">
                                <input type="text" placeholder="Last Name"
                                    // onKeyDown={validateContactForSaving}
                                    onChange={e => setSelectedFactoringCompanyContact({ ...selectedFactoringCompanyContact, last_name: e.target.value })}
                                    value={selectedFactoringCompanyContact.last_name || ''} />
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ width: '50%' }}>
                                <div className="select-box-wrapper">
                                    <MaskedInput
                                        ref={refFactoringCompanyContactPhone}
                                        mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                        guide={true}
                                        type="text" placeholder="Phone"
                                        onKeyDown={async (e) => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (showFactoringCompanyContactPhones) {
                                                        let selectedIndex = carrierContactPhoneItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setFactoringCompanyContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setFactoringCompanyContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (carrierContactPhoneItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refFactoringCompanyContactPhonePopupItems.current.map((r, i) => {
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
                                                            await setFactoringCompanyContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedFactoringCompanyContact?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            setShowFactoringCompanyContactPhones(true);

                                                            refFactoringCompanyContactPhonePopupItems.current.map((r, i) => {
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
                                                    if (showFactoringCompanyContactPhones) {
                                                        let selectedIndex = carrierContactPhoneItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setFactoringCompanyContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setFactoringCompanyContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                                if (selectedIndex === (carrierContactPhoneItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refFactoringCompanyContactPhonePopupItems.current.map((r, i) => {
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
                                                            await setFactoringCompanyContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                                item.selected = item.type === (selectedFactoringCompanyContact?.primary_phone || '')
                                                                return item;
                                                            }))

                                                            setShowFactoringCompanyContactPhones(true);

                                                            refFactoringCompanyContactPhonePopupItems.current.map((r, i) => {
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
                                                    setShowFactoringCompanyContactPhones(false);
                                                    break;

                                                case 13: // enter
                                                    if (showFactoringCompanyContactPhones && carrierContactPhoneItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedFactoringCompanyContact({
                                                            ...selectedFactoringCompanyContact,
                                                            primary_phone: carrierContactPhoneItems[carrierContactPhoneItems.findIndex(item => item.selected)].type
                                                        });

                                                        validateContactForSaving({ keyCode: 9 });
                                                        setShowFactoringCompanyContactPhones(false);
                                                        refFactoringCompanyContactPhone.current.inputElement.focus();
                                                    }
                                                    break;
                                                case 9: // tab
                                                    if (showFactoringCompanyContactPhones) {
                                                        e.preventDefault();
                                                        await setSelectedFactoringCompanyContact({
                                                            ...selectedFactoringCompanyContact,
                                                            primary_phone: carrierContactPhoneItems[carrierContactPhoneItems.findIndex(item => item.selected)].type
                                                        });

                                                        validateContactForSaving({ keyCode: 9 });
                                                        setShowFactoringCompanyContactPhones(false);
                                                        refFactoringCompanyContactPhone.current.inputElement.focus();
                                                    } else {
                                                        validateContactForSaving({ keyCode: 9 });
                                                    }
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={(e) => {
                                            if ((selectedFactoringCompanyContact?.id || 0) === 0) {
                                                setSelectedFactoringCompanyContact({
                                                    ...selectedFactoringCompanyContact,
                                                    phone_work: e.target.value,
                                                    primary_phone: 'work'
                                                });
                                            } else {
                                                if ((selectedFactoringCompanyContact?.primary_phone || '') === '') {
                                                    setSelectedFactoringCompanyContact({
                                                        ...selectedFactoringCompanyContact,
                                                        phone_work: e.target.value,
                                                        primary_phone: 'work'
                                                    });
                                                } else {
                                                    switch (selectedFactoringCompanyContact?.primary_phone) {
                                                        case 'work':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                phone_work: e.target.value
                                                            });
                                                            break;
                                                        case 'fax':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                phone_work_fax: e.target.value
                                                            });
                                                            break;
                                                        case 'mobile':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                phone_mobile: e.target.value
                                                            });
                                                            break;
                                                        case 'direct':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                phone_direct: e.target.value
                                                            });
                                                            break;
                                                        case 'other':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                phone_other: e.target.value
                                                            });
                                                            break;
                                                    }
                                                }
                                            }
                                        }}
                                        onChange={(e) => {
                                            if ((selectedFactoringCompanyContact?.id || 0) === 0) {
                                                setSelectedFactoringCompanyContact({
                                                    ...selectedFactoringCompanyContact,
                                                    phone_work: e.target.value,
                                                    primary_phone: 'work'
                                                });
                                            } else {
                                                if ((selectedFactoringCompanyContact?.primary_phone || '') === '') {
                                                    setSelectedFactoringCompanyContact({
                                                        ...selectedFactoringCompanyContact,
                                                        phone_work: e.target.value,
                                                        primary_phone: 'work'
                                                    });
                                                } else {
                                                    switch (selectedFactoringCompanyContact?.primary_phone) {
                                                        case 'work':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                phone_work: e.target.value
                                                            });
                                                            break;
                                                        case 'fax':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                phone_work_fax: e.target.value
                                                            });
                                                            break;
                                                        case 'mobile':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                phone_mobile: e.target.value
                                                            });
                                                            break;
                                                        case 'direct':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                phone_direct: e.target.value
                                                            });
                                                            break;
                                                        case 'other':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                phone_other: e.target.value
                                                            });
                                                            break;
                                                    }
                                                }
                                            }
                                        }}
                                        value={
                                            (selectedFactoringCompanyContact?.primary_phone || '') === 'work'
                                                ? (selectedFactoringCompanyContact?.phone_work || '')
                                                : (selectedFactoringCompanyContact?.primary_phone || '') === 'fax'
                                                    ? (selectedFactoringCompanyContact?.phone_work_fax || '')
                                                    : (selectedFactoringCompanyContact?.primary_phone || '') === 'mobile'
                                                        ? (selectedFactoringCompanyContact?.phone_mobile || '')
                                                        : (selectedFactoringCompanyContact?.primary_phone || '') === 'direct'
                                                            ? (selectedFactoringCompanyContact?.phone_direct || '')
                                                            : (selectedFactoringCompanyContact?.primary_phone || '') === 'other'
                                                                ? (selectedFactoringCompanyContact?.phone_other || '')
                                                                : ''
                                        }
                                    />

                                    {
                                        (selectedFactoringCompanyContact?.id || 0) > 0 &&
                                        <div
                                            className={classnames({
                                                'selected-carrier-contact-primary-phone': true,
                                                'pushed': (carrierContactPhoneItems.length > 1)
                                            })}>
                                            {selectedFactoringCompanyContact?.primary_phone || ''}
                                        </div>
                                    }

                                    {
                                        carrierContactPhoneItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
                                            if (showFactoringCompanyContactPhones) {
                                                setShowFactoringCompanyContactPhones(false);
                                            } else {
                                                if (carrierContactPhoneItems.length > 1) {
                                                    await setFactoringCompanyContactPhoneItems(carrierContactPhoneItems.map((item, index) => {
                                                        item.selected = item.type === (selectedFactoringCompanyContact?.primary_phone || '')
                                                        return item;
                                                    }))

                                                    window.setTimeout(async () => {
                                                        await setShowFactoringCompanyContactPhones(true);

                                                        refFactoringCompanyContactPhonePopupItems.current.map((r, i) => {
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

                                            refFactoringCompanyContactPhone.current.inputElement.focus();
                                        }} />
                                    }
                                </div>
                                {
                                    contactPhonesTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-contact-phone"
                                            style={{
                                                ...style,
                                                left: '0',
                                                display: 'block'
                                            }}
                                            ref={refFactoringCompanyContactPhoneDropDown}
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
                                                                            await setSelectedFactoringCompanyContact({
                                                                                ...selectedFactoringCompanyContact,
                                                                                primary_phone: item.type
                                                                            });

                                                                            // validateContactForSaving({ keyCode: 9 });
                                                                            setShowFactoringCompanyContactPhones(false);
                                                                            refFactoringCompanyContactPhone.current.inputElement.focus();
                                                                        }}
                                                                        ref={ref => refFactoringCompanyContactPhonePopupItems.current.push(ref)}
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
                                    <input type="text" placeholder="Ext"
                                        // onKeyDown={validateContactForSaving}
                                        onChange={e => setSelectedFactoringCompanyContact({ ...selectedFactoringCompanyContact, phone_ext: e.target.value })}
                                        value={selectedFactoringCompanyContact.phone_ext || ''} />
                                </div>
                                <div className="input-toggle-container">
                                    <input type="checkbox" id={props.panelName + 'cbox-factoring-company-contacts-primary-btn'}
                                        onChange={async (e) => {
                                            await setSelectedFactoringCompanyContact({ ...selectedFactoringCompanyContact, is_primary: e.target.checked ? 1 : 0 });

                                            validateContactForSaving({ keyCode: 9 });
                                        }}
                                        checked={(selectedFactoringCompanyContact.is_primary || 0) === 1} />
                                    <label htmlFor={props.panelName + 'cbox-factoring-company-contacts-primary-btn'}>
                                        <div className="label-text">Primary</div>
                                        <div className="input-toggle-btn"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-v-sep"></div>
                        <div className="form-row">
                            <div className="select-box-container" style={{ flexGrow: 1 }}
                                onMouseEnter={() => {
                                    if ((selectedFactoringCompanyContact?.email_work || '') !== '' ||
                                        (selectedFactoringCompanyContact?.email_personal || '') !== '' ||
                                        (selectedFactoringCompanyContact?.email_other || '') !== '') {
                                        setShowFactoringCompanyContactEmailCopyBtn(true);
                                    }
                                }}
                                onFocus={() => {
                                    if ((selectedFactoringCompanyContact?.email_work || '') !== '' ||
                                        (selectedFactoringCompanyContact?.email_personal || '') !== '' ||
                                        (selectedFactoringCompanyContact?.email_other || '') !== '') {
                                        setShowFactoringCompanyContactEmailCopyBtn(true);
                                    }
                                }}
                                onBlur={() => {
                                    window.setTimeout(() => {
                                        setShowFactoringCompanyContactEmailCopyBtn(false);
                                    }, 1000);
                                }}
                                onMouseLeave={() => {
                                    setShowFactoringCompanyContactEmailCopyBtn(false);
                                }}>
                                <div className="select-box-wrapper">
                                    <input
                                        style={{
                                            width: 'calc(100% - 25px)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        ref={refFactoringCompanyContactEmail}
                                        type="text"
                                        placeholder="E-Mail"
                                        onKeyDown={async (e) => {
                                            let key = e.keyCode || e.which;

                                            switch (key) {
                                                case 37: case 38: // arrow left | arrow up
                                                    e.preventDefault();
                                                    if (showFactoringCompanyContactEmails) {
                                                        let selectedIndex = carrierContactEmailItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setFactoringCompanyContactEmailItems(carrierContactEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setFactoringCompanyContactEmailItems(carrierContactEmailItems.map((item, index) => {
                                                                if (selectedIndex === 0) {
                                                                    item.selected = index === (carrierContactEmailItems.length - 1);
                                                                } else {
                                                                    item.selected = index === (selectedIndex - 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refFactoringCompanyContactEmailPopupItems.current.map((r, i) => {
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
                                                            await setFactoringCompanyContactEmailItems(carrierContactEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedFactoringCompanyContact?.primary_email || '')
                                                                return item;
                                                            }))

                                                            setShowFactoringCompanyContactEmails(true);

                                                            refFactoringCompanyContactEmailPopupItems.current.map((r, i) => {
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
                                                    if (showFactoringCompanyContactEmails) {
                                                        let selectedIndex = carrierContactEmailItems.findIndex(item => item.selected);

                                                        if (selectedIndex === -1) {
                                                            await setFactoringCompanyContactEmailItems(carrierContactEmailItems.map((item, index) => {
                                                                item.selected = index === 0;
                                                                return item;
                                                            }))
                                                        } else {
                                                            await setFactoringCompanyContactEmailItems(carrierContactEmailItems.map((item, index) => {
                                                                if (selectedIndex === (carrierContactEmailItems.length - 1)) {
                                                                    item.selected = index === 0;
                                                                } else {
                                                                    item.selected = index === (selectedIndex + 1)
                                                                }
                                                                return item;
                                                            }))
                                                        }

                                                        refFactoringCompanyContactEmailPopupItems.current.map((r, i) => {
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
                                                            await setFactoringCompanyContactEmailItems(carrierContactEmailItems.map((item, index) => {
                                                                item.selected = item.type === (selectedFactoringCompanyContact?.primary_email || '')
                                                                return item;
                                                            }))

                                                            setShowFactoringCompanyContactEmails(true);

                                                            refFactoringCompanyContactEmailPopupItems.current.map((r, i) => {
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
                                                    setShowFactoringCompanyContactEmails(false);
                                                    break;

                                                case 13: // enter
                                                    if (showFactoringCompanyContactEmails && carrierContactEmailItems.findIndex(item => item.selected) > -1) {
                                                        await setSelectedFactoringCompanyContact({
                                                            ...selectedFactoringCompanyContact,
                                                            primary_email: carrierContactEmailItems[carrierContactEmailItems.findIndex(item => item.selected)].type
                                                        });

                                                        validateContactForSaving({ keyCode: 9 });
                                                        setShowFactoringCompanyContactEmails(false);
                                                        refFactoringCompanyContactEmail.current.focus();
                                                    }
                                                    break;

                                                case 9: // tab
                                                    if (showFactoringCompanyContactEmails) {
                                                        e.preventDefault();
                                                        await setSelectedFactoringCompanyContact({
                                                            ...selectedFactoringCompanyContact,
                                                            primary_email: carrierContactEmailItems[carrierContactEmailItems.findIndex(item => item.selected)].type
                                                        });

                                                        validateContactForSaving({ keyCode: 9 });
                                                        setShowFactoringCompanyContactEmails(false);
                                                        refFactoringCompanyContactEmail.current.focus();
                                                    } else {
                                                        validateContactForSaving({ keyCode: 9 });
                                                    }
                                                    break;

                                                default:
                                                    break;
                                            }
                                        }}
                                        onInput={(e) => {
                                            if ((selectedFactoringCompanyContact?.id || 0) === 0) {
                                                setSelectedFactoringCompanyContact({
                                                    ...selectedFactoringCompanyContact,
                                                    email_work: e.target.value,
                                                    primary_email: 'work'
                                                });
                                            } else {
                                                if ((selectedFactoringCompanyContact?.primary_email || '') === '') {
                                                    setSelectedFactoringCompanyContact({
                                                        ...selectedFactoringCompanyContact,
                                                        email_work: e.target.value,
                                                        primary_email: 'work'
                                                    });
                                                } else {
                                                    switch (selectedFactoringCompanyContact?.primary_email) {
                                                        case 'work':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                email_work: e.target.value
                                                            });
                                                            break;
                                                        case 'personal':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                email_personal: e.target.value
                                                            });
                                                            break;
                                                        case 'other':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                email_other: e.target.value
                                                            });
                                                            break;
                                                    }
                                                }
                                            }
                                        }}
                                        onChange={(e) => {
                                            if ((selectedFactoringCompanyContact?.id || 0) === 0) {
                                                setSelectedFactoringCompanyContact({
                                                    ...selectedFactoringCompanyContact,
                                                    email_work: e.target.value,
                                                    primary_email: 'work'
                                                });
                                            } else {
                                                if ((selectedFactoringCompanyContact?.primary_email || '') === '') {
                                                    setSelectedFactoringCompanyContact({
                                                        ...selectedFactoringCompanyContact,
                                                        email_work: e.target.value,
                                                        primary_email: 'work'
                                                    });
                                                } else {
                                                    switch (selectedFactoringCompanyContact?.primary_email) {
                                                        case 'work':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                email_work: e.target.value
                                                            });
                                                            break;
                                                        case 'personal':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                email_personal: e.target.value
                                                            });
                                                            break;
                                                        case 'other':
                                                            setSelectedFactoringCompanyContact({
                                                                ...selectedFactoringCompanyContact,
                                                                email_other: e.target.value
                                                            });
                                                            break;
                                                    }
                                                }
                                            }
                                        }}
                                        value={
                                            (selectedFactoringCompanyContact?.primary_email || '') === 'work'
                                                ? (selectedFactoringCompanyContact?.email_work || '')
                                                : (selectedFactoringCompanyContact?.primary_email || '') === 'personal'
                                                    ? (selectedFactoringCompanyContact?.email_personal || '')
                                                    : (selectedFactoringCompanyContact?.primary_email || '') === 'other'
                                                        ? (selectedFactoringCompanyContact?.email_other || '')
                                                        : ''
                                        }
                                    />

                                    {
                                        showFactoringCompanyContactEmailCopyBtn &&
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
                                            navigator.clipboard.writeText(refFactoringCompanyContactEmail.current.value);
                                        }} />
                                    }

                                    {
                                        (selectedFactoringCompanyContact?.id || 0) > 0 &&
                                        <div
                                            className={classnames({
                                                'selected-carrier-contact-primary-email': true,
                                                'pushed': (carrierContactEmailItems.length > 1)
                                            })}>
                                            {selectedFactoringCompanyContact?.primary_email || ''}
                                        </div>
                                    }

                                    {
                                        carrierContactEmailItems.length > 1 &&
                                        <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={async () => {
                                            if (showFactoringCompanyContactEmails) {
                                                setShowFactoringCompanyContactEmails(false);
                                            } else {
                                                if (carrierContactEmailItems.length > 1) {
                                                    await setFactoringCompanyContactEmailItems(carrierContactEmailItems.map((item, index) => {
                                                        item.selected = item.type === (selectedFactoringCompanyContact?.primary_email || '')
                                                        return item;
                                                    }))

                                                    window.setTimeout(async () => {
                                                        await setShowFactoringCompanyContactEmails(true);

                                                        refFactoringCompanyContactEmailPopupItems.current.map((r, i) => {
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

                                            refFactoringCompanyContactEmail.current.focus();
                                        }} />
                                    }
                                </div>
                                {
                                    contactEmailsTransition((style, item) => item && (
                                        <animated.div
                                            className="mochi-contextual-container"
                                            id="mochi-contextual-container-contact-email"
                                            style={{
                                                ...style,
                                                left: '0',
                                                display: 'block'
                                            }}
                                            ref={refFactoringCompanyContactEmailDropDown}
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
                                                                            await setSelectedFactoringCompanyContact({
                                                                                ...selectedFactoringCompanyContact,
                                                                                primary_email: item.type
                                                                            });

                                                                            validateContactForSaving({ keyCode: 9 });
                                                                            setShowFactoringCompanyContactEmails(false);
                                                                            refFactoringCompanyContactEmail.current.focus();
                                                                        }}
                                                                        ref={ref => refFactoringCompanyContactEmailPopupItems.current.push(ref)}
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
                                <input type="text" placeholder="Notes"
                                    onKeyDown={(e) => {
                                        validateContactForSaving(e);

                                        let key = e.keyCode || e.which;

                                        if (key === 9){
                                            e.preventDefault();
                                            refFactoringCompanyCode.current.focus();
                                        }
                                    }}
                                    onChange={e => setSelectedFactoringCompanyContact({ ...selectedFactoringCompanyContact, notes: e.target.value })}
                                    value={selectedFactoringCompanyContact.notes || ''} />
                            </div>
                        </div>
                    </div>

                    {/* ================================================================================= */}

                    <div className="form-bordered-box" style={{ position: 'relative' }}>
                        <div className="form-header">
                            <div className="top-border top-border-left"></div>
                            <div className="top-border top-border-middle"></div>
                            <div className="form-buttons">
                                {
                                    selectedFactoringCompanyIsShowingContactList &&
                                    <div className="mochi-button" onClick={() => setSelectedFactoringCompanyIsShowingContactList(false)}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Search</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }
                                {
                                    !selectedFactoringCompanyIsShowingContactList &&
                                    <div className="mochi-button" onClick={() => setSelectedFactoringCompanyIsShowingContactList(true)}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Cancel</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }

                                {
                                    !selectedFactoringCompanyIsShowingContactList &&
                                    <div className="mochi-button" onClick={searchContactBtnClick}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Send</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }
                            </div>
                            <div className="top-border top-border-right"></div>
                        </div>

                        <div className="form-wrapper">

                            {
                                factoringContactsFirstPageTransition((style, item) => item && (
                                    <animated.div style={{ ...style }} className="contact-list-box">
                                        {
                                            (selectedFactoringCompany.contacts || []).length > 0 &&
                                            <div className="contact-list-header">
                                                <div className="contact-list-col tcol first-name">First Name</div>
                                                <div className="contact-list-col tcol last-name">Last Name</div>
                                                <div className="contact-list-col tcol phone">Phone</div>
                                                <div className="contact-list-col tcol email">E-Mail</div>
                                                <div className="contact-list-col tcol pri"></div>
                                            </div>
                                        }

                                        <div className="contact-list-wrapper">

                                            {
                                                (selectedFactoringCompany.contacts || []).map((contact, index) => {
                                                    return (
                                                        <div className="contact-list-item" key={index} onDoubleClick={async () => {
                                                            let panel = {
                                                                panelName: `${props.panelName}-contacts`,
                                                                component: <Contacts
                                                                    title='Contacts'
                                                                    tabTimes={22000 + props.tabTimes}
                                                                    panelName={`${props.panelName}-contacts`}
                                                                    savingContactUrl='/saveFactoringCompanyContact'
                                                                    deletingContactUrl='/deleteFactoringCompanyContact'
                                                                    uploadAvatarUrl='/uploadFactoringCompanyAvatar'
                                                                    removeAvatarUrl='/removeFactoringCompanyAvatar'
                                                                    origin={props.origin}
                                                                    owner='factoring-company'
                                                                    openPanel={props.openPanel}
                                                                    closePanel={props.closePanel}

                                                                    contactSearchCustomer={{
                                                                        ...selectedFactoringCompany,
                                                                        selectedContact: contact
                                                                    }}
                                                                />
                                                            }

                                                            props.openPanel(panel, props.origin);
                                                        }} onClick={() => setSelectedFactoringCompanyContact(contact)}>
                                                            <div className="contact-list-col tcol first-name">{contact.first_name}</div>
                                                            <div className="contact-list-col tcol last-name">{contact.last_name}</div>
                                                            <div className="contact-list-col tcol phone">{
                                                                contact.primary_phone === 'work' ? contact.phone_work
                                                                    : contact.primary_phone === 'fax' ? contact.phone_work_fax
                                                                        : contact.primary_phone === 'mobile' ? contact.phone_mobile
                                                                            : contact.primary_phone === 'direct' ? contact.phone_direct
                                                                                : contact.primary_phone === 'other' ? contact.phone_other
                                                                                    : ''
                                                            }</div>
                                                            <div className="contact-list-col tcol email">{
                                                                contact.primary_email === 'work' ? contact.email_work
                                                                    : contact.primary_email === 'personal' ? contact.email_personal
                                                                        : contact.primary_email === 'other' ? contact.email_other
                                                                            : ''
                                                            }</div>

                                                            {
                                                                (contact.id === (selectedFactoringCompanyContact?.id || 0)) &&
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

                                    </animated.div>
                                ))
                            }

                            {
                                factoringContactsSecondPageTransition((style, item) => item && (
                                    <animated.div style={{ ...style }} className="contact-search-box">
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="First Name"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingContactList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyContactSearch({ ...selectedFactoringCompanyContactSearch, first_name: e.target.value })}
                                                    value={selectedFactoringCompanyContactSearch.first_name || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Last Name"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingContactList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyContactSearch({ ...selectedFactoringCompanyContactSearch, last_name: e.target.value })}
                                                    value={selectedFactoringCompanyContactSearch.last_name || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Address 1"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingContactList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyContactSearch({ ...selectedFactoringCompanyContactSearch, address1: e.target.value })}
                                                    value={selectedFactoringCompanyContactSearch.address1 || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Address 2"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingContactList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyContactSearch({ ...selectedFactoringCompanyContactSearch, address2: e.target.value })}
                                                    value={selectedFactoringCompanyContactSearch.address2 || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="City"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingContactList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyContactSearch({ ...selectedFactoringCompanyContactSearch, city: e.target.value })}
                                                    value={selectedFactoringCompanyContactSearch.city || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container input-state">
                                                <input type="text" placeholder="State" maxLength="2"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingContactList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyContactSearch({ ...selectedFactoringCompanyContactSearch, state: e.target.value })}
                                                    value={selectedFactoringCompanyContactSearch.state || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <MaskedInput
                                                    mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={true}
                                                    type="text" placeholder="Phone (Work/Mobile/Fax)"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingContactList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyContactSearch({ ...selectedFactoringCompanyContactSearch, phone: e.target.value })}
                                                    value={selectedFactoringCompanyContactSearch.phone || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="E-Mail" style={{ textTransform: 'lowercase' }}
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingContactList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyContactSearch({ ...selectedFactoringCompanyContactSearch, email: e.target.value })}
                                                    value={selectedFactoringCompanyContactSearch.email || ''} />
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>
                    </div>

                </div>

                <div className="fields-container-col">

                    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <div className='mochi-button' onClick={() => {
                            if ((selectedFactoringCompany.id || 0) > 0) {
                                setShowingACHWiringInfo(true);
                            } else {
                                window.alert('You must select a factoring company first!');
                            }
                        }}>
                            <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                            <div className='mochi-button-base'>ACH/Wiring Info</div>
                            <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                        </div>

                        <div className='mochi-button' onClick={() => {
                            if ((selectedFactoringCompany.id || 0) > 0) {
                                let panel = {
                                    panelName: `${props.panelName}-documents`,
                                    component: <Documents
                                        title='Documents'
                                        tabTimes={26000}
                                        panelName={`${props.panelName}-documents`}
                                        origin={props.origin}
                                        suborigin={'factoring-company'}
                                        openPanel={props.openPanel}
                                        closePanel={props.closePanel}

                                        selectedOwner={{ ...selectedFactoringCompany }}
                                        selectedOwnerDocument={{
                                            id: 0,
                                            user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                            date_entered: moment().format('MM/DD/YYYY')
                                        }}
                                        savingDocumentUrl='/saveFactoringCompanyDocument'
                                        deletingDocumentUrl='/deleteFactoringCompanyDocument'
                                        savingDocumentNoteUrl='/saveFactoringCompanyDocumentNote'
                                        serverDocumentsFolder='/factoring-company-documents/'
                                    />
                                }

                                props.openPanel(panel, props.origin);
                            } else {
                                window.alert('You must select a factoring company first!');
                            }
                        }}>
                            <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                            <div className='mochi-button-base'>Documents</div>
                            <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                        </div>

                        <div className='mochi-button' onClick={() => {
                            if ((selectedFactoringCompany.id || 0) === 0) {
                                window.alert('There is nothing to print!');
                                return;
                            }

                            let factoringCompany = { ...selectedFactoringCompany };

                            let html = ``;

                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">Code</span>: ${factoringCompany.code.toUpperCase() + (factoringCompany.code_number === 0 ? '' : factoringCompany.code_number)}</div>`;
                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">Name</span>: ${factoringCompany.name}</div>`;
                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">Address 1</span>: ${factoringCompany.address1}</div>`;
                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">Address 2</span>: ${factoringCompany.address2}</div>`;
                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">City</span>: ${factoringCompany.city}</div>`;
                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">State</span>: ${factoringCompany.state.toUpperCase()}</div>`;
                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">Postal Code</span>: ${factoringCompany.zip}</div>`;
                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">Contact Name</span>: ${factoringCompany.contact_name}</div>`;
                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">Contact Phone</span>: ${factoringCompany.contact_phone}</div>`;
                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">Contact Phone Ext</span>: ${factoringCompany.ext}</div>`;
                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">E-Mail</span>: ${factoringCompany.email}</div>`;
                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">MC Number</span>: ${factoringCompany.mc_number}</div>`;
                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">DOT Number</span>: ${factoringCompany.dot_number}</div>`;
                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">SCAC</span>: ${factoringCompany.scac}</div>`;
                            html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">FID</span>: ${factoringCompany.fid}</div>`;

                            printWindow(html);
                        }}>
                            <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                            <div className='mochi-button-base'>Print Company Information</div>
                            <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                        </div>
                    </div>

                    <div className='form-bordered-box'>
                        <div className='form-header'>
                            <div className='top-border top-border-left'></div>
                            <div className='form-title'>Notes</div>
                            <div className='top-border top-border-middle'></div>
                            <div className='form-buttons'>
                                <div className='mochi-button' onClick={() => {
                                    if ((selectedFactoringCompany.id || 0) === 0) {
                                        window.alert('You must select a factoring company first!');
                                        return;
                                    }

                                    setSelectedFactoringCompanyNote({ id: 0, factoring_company_id: selectedFactoringCompany.id })
                                }}>
                                    <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                    <div className='mochi-button-base'>Add note</div>
                                    <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                </div>
                                <div className='mochi-button' onClick={() => {
                                    if (selectedFactoringCompany.id === undefined || (selectedFactoringCompany.notes || []).length === 0) {
                                        window.alert('There is nothing to print!');
                                        return;
                                    }

                                    let html = ``;

                                    selectedFactoringCompany.notes.map((note, index) => {
                                        html += `<div><b>${note.user}:${moment(note.date_time, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY:HHmm')}</b> ${note.text}</div>`

                                        return true;
                                    })

                                    printWindow(html);
                                }}>
                                    <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                    <div className='mochi-button-base'>Print</div>
                                    <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                </div>
                            </div>
                            <div className='top-border top-border-right'></div>
                        </div>

                        <div className="factoring-company-list-container">
                            <div className="factoring-company-list-wrapper">
                                {
                                    (selectedFactoringCompany.notes || []).map((note, index) => {
                                        return (
                                            <div className="factoring-company-list-item" key={index} onClick={() => setSelectedFactoringCompanyNote(note)}>
                                                <div className="factoring-company-list-col tcol note-text">{note.text}</div>
                                                {
                                                    (note.id === (selectedFactoringCompanyNote?.id || 0)) &&
                                                    <div className="factoring-company-list-col tcol factoring-company-selected">
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

                    <div className='form-bordered-box'>
                        <div className='form-header'>
                            <div className='top-border top-border-left'></div>
                            <div className='form-title'>Outstanding Invoices</div>
                            <div className='top-border top-border-middle'></div>
                            <div className='form-buttons'>
                                {
                                    selectedFactoringCompanyIsShowingInvoiceList &&
                                    <div className='mochi-button' onClick={() => { setSelectedFactoringCompanyIsShowingInvoiceList(false) }}>
                                        <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                        <div className='mochi-button-base'>Search</div>
                                        <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                    </div>
                                }
                                {
                                    selectedFactoringCompanyIsShowingInvoiceList &&
                                    <div className='mochi-button' onClick={() => {
                                        let html = `<h2>Factoring Company Invoices</h2></br></br>`;
                                        html += `
                                        <div style="display:flex;align-items:center;font-size: 0.9rem;font-weight:bold;margin-bottom:10px;color: rgba(0,0,0,0.8)">
                                            <div style="min-width:25%;max-width:25%;text-decoration:underline">Invoice Date</div>
                                            <div style="min-width:25%;max-width:25%;text-decoration:underline">Invoice Number</div>
                                            <div style="min-width:25%;max-width:25%;flex-grow:1;text-decoration:underline">Order Number</div>
                                            <div style="min-width:25%;max-width:25%;text-decoration:underline;text-align:right">Amount</div>
                                        </div>
                                        `;

                                        html += `
                                        <div style="padding: 5px 0;display:flex;align-items:center;font-size: 0.7rem;font-weight:normal;margin-bottom:15px;color: rgba(0,0,0,1); borderTop:1px solid rgba(0,0,0,0.1);border-bottom:1px solid rgba(0,0,0,0.1)">
                                            <div style="min-width:25%;max-width:25%">03/09/2021</div>
                                            <div style="min-width:25%;max-width:25%">12345</div>
                                            <div style="min-width:25%;max-width:25%;flex-grow:1">54321</div>
                                            <div style="min-width:25%;max-width:25%;text-align:right">$25,000.00</div>
                                        </div>
                                        `;

                                        printWindow(html);

                                    }}>
                                        <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                        <div className='mochi-button-base'>Print</div>
                                        <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                    </div>
                                }
                                {
                                    !selectedFactoringCompanyIsShowingInvoiceList &&
                                    <div className='mochi-button' onClick={() => { setSelectedFactoringCompanyIsShowingInvoiceList(true) }}>
                                        <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                        <div className='mochi-button-base'>Cancel</div>
                                        <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                    </div>
                                }
                                {
                                    !selectedFactoringCompanyIsShowingInvoiceList &&
                                    <div className='mochi-button' onClick={searchInvoiceBtnClick}>
                                        <div className='mochi-button-decorator mochi-button-decorator-left'>(</div>
                                        <div className='mochi-button-base'>Send</div>
                                        <div className='mochi-button-decorator mochi-button-decorator-right'>)</div>
                                    </div>
                                }

                            </div>
                            <div className='top-border top-border-right'></div>
                        </div>

                        <div className="form-wrapper">
                            {
                                factoringInvoiceFirstPageTransition((style, item) => item && (
                                    <animated.div style={{ ...style }} className="factoring-company-invoice-list-container">
                                        <div className="factoring-company-invoice-list-wrapper">
                                            {
                                                (selectedFactoringCompany?.orders || []).length > 0 &&
                                                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: 5, color: 'rgba(0,0,0,1)' }}>
                                                    <div style={{ width: '6rem', textDecoration: 'underline' }}>Invoice Date</div>
                                                    <div style={{ width: '6rem', textDecoration: 'underline' }}>Invoice Number</div>
                                                    <div style={{ flexGrow: 1, textDecoration: 'underline' }}>Order Number</div>
                                                    <div style={{ width: '6rem', textAlign: 'right', textDecoration: 'underline' }}>Amount</div>
                                                </div>
                                            }

                                            {
                                                (selectedFactoringCompany?.orders || []).map((order, index) => {
                                                    return (
                                                        <div className="factoring-company-invoice-list-item" key={index} onDoubleClick={() => {
                                                            let panel = {
                                                                panelName: `${props.panelName}-invoice`,
                                                                component: <Invoice
                                                                    pageName={'Invoice'}
                                                                    title={'Invoice'}
                                                                    panelName={'invoice'}
                                                                    tabTimes={15000 + props.tabTimes}
                                                                    screenFocused={props.invoiceScreenFocused}
                                                                    componentId={moment().format('x')}
                                                                    isOnPanel={true}
                                                                    origin={props.origin}
                                                                    openPanel={props.openPanel}
                                                                    closePanel={props.closePanel}
                                                                    order_id={order.id}
                                                                />
                                                            }

                                                            props.openPanel(panel, props.origin);
                                                        }}>
                                                            <div style={{ width: '6rem' }}>{order.invoice_received_date || ''}</div>
                                                            <div style={{ width: '6rem' }}>{order.invoice_number || ''}</div>
                                                            <div style={{ flexGrow: 1 }}>{order.order_number || ''}</div>
                                                            <div style={{ width: '6rem', textAlign: 'right' }}>
                                                                <NumberFormat
                                                                    className={classnames({
                                                                        "negative-number":
                                                                            (order.total_carrier_rating || 0) < 0,
                                                                    })}
                                                                    style={{ fontSize: "0.7rem", textAlign: "center" }}
                                                                    value={new Intl.NumberFormat("en-US", {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    }).format(order.total_carrier_rating || 0)}
                                                                    thousandsGroupStyle="thousand"
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    fixedDecimalScale={true}
                                                                    prefix={"$ "}
                                                                    type="text"
                                                                    onValueChange={(values) => { }}
                                                                    displayType={"text"}
                                                                    readOnly={true}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>

                                    </animated.div>
                                ))
                            }

                            {
                                factoringInvoiceSecondPageTransition((style, item) => item && (
                                    <animated.div style={{ ...style }} className="form-borderless-box">
                                        <div className="form-row">
                                            <div className="input-box-container" style={{ width: '7.7rem' }}>
                                                <MaskedInput
                                                    mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                    guide={true}
                                                    type="text" placeholder="Date (MM/DD/YYYY)"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingInvoiceList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyInvoiceSearch({ ...selectedFactoringCompanyInvoiceSearch, invoice_date: e.target.value })}
                                                    value={selectedFactoringCompanyInvoiceSearch.invoice_date || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Pick Up Location (City / State)"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingInvoiceList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyInvoiceSearch({ ...selectedFactoringCompanyInvoiceSearch, pickup_location: e.target.value })}
                                                    value={selectedFactoringCompanyInvoiceSearch.pickup_location || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Delivery Location (City / State)"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingInvoiceList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyInvoiceSearch({ ...selectedFactoringCompanyInvoiceSearch, delivery_location: e.target.value })}
                                                    value={selectedFactoringCompanyInvoiceSearch.delivery_location || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Invoice Number"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingInvoiceList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyInvoiceSearch({ ...selectedFactoringCompanyInvoiceSearch, invoice_number: e.target.value })}
                                                    value={selectedFactoringCompanyInvoiceSearch.invoice_number || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Order Number"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingInvoiceList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyInvoiceSearch({ ...selectedFactoringCompanyInvoiceSearch, order_number: e.target.value })}
                                                    value={selectedFactoringCompanyInvoiceSearch.order_number || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Trip Number"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingInvoiceList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyInvoiceSearch({ ...selectedFactoringCompanyInvoiceSearch, trip_number: e.target.value })}
                                                    value={selectedFactoringCompanyInvoiceSearch.trip_number || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Amount"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingInvoiceList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyInvoiceSearch({ ...selectedFactoringCompanyInvoiceSearch, invoice_amount: e.target.value })}
                                                    value={selectedFactoringCompanyInvoiceSearch.invoice_amount || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container input-code">
                                                <input type="text" placeholder="Customer Code" maxLength="8"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingInvoiceList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyInvoiceSearch({ ...selectedFactoringCompanyInvoiceSearch, customer_code: e.target.value })}
                                                    value={selectedFactoringCompanyInvoiceSearch.customer_code || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Customer Name"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingInvoiceList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyInvoiceSearch({ ...selectedFactoringCompanyInvoiceSearch, customer_name: e.target.value })}
                                                    value={selectedFactoringCompanyInvoiceSearch.customer_name || ''} />
                                            </div>
                                        </div>
                                        <div className="form-v-sep"></div>
                                        <div className="form-row">
                                            <div className="input-box-container input-code">
                                                <input type="text" placeholder="Carrier Code" maxLength="8"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingInvoiceList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyInvoiceSearch({ ...selectedFactoringCompanyInvoiceSearch, carrier_code: e.target.value })}
                                                    value={selectedFactoringCompanyInvoiceSearch.carrier_code || ''} />
                                            </div>
                                            <div className="form-h-sep"></div>
                                            <div className="input-box-container grow">
                                                <input type="text" placeholder="Carrier Name"
                                                    onFocus={() => { setSelectedFactoringCompanyIsShowingInvoiceList(false) }}
                                                    onChange={e => setSelectedFactoringCompanyInvoiceSearch({ ...selectedFactoringCompanyInvoiceSearch, carrier_name: e.target.value })}
                                                    value={selectedFactoringCompanyInvoiceSearch.carrier_name || ''} />
                                            </div>
                                        </div>
                                    </animated.div>
                                ))
                            }
                        </div>

                        {
                            loadingOrdersTransition((style, item) => item &&
                                <animated.div className='loading-container' style={style} >
                                    <div className="loading-container-wrapper">
                                        <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                                    </div>
                                </animated.div>
                            )
                        }
                    </div>
                </div>
            </div>

            {achWiringInfoTransition(
                (style, item) =>
                    item && (
                        <animated.div
                            className="ach-wiring-info-main-container"
                            style={{
                                ...style,
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                top: 0,
                                left: 0,
                                backgroundColor: "rgba(0,0,0,0.3)",
                            }}>
                            <div
                                className="ach-wiring-info-wrapper"
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                <ACHWiringInfo
                                    panelName={`${props.panelName}-ach-wiring-info`}
                                    tabTimes={props.tabTimes}
                                    componentId={moment().format("x")}
                                    openPanel={props.openPanel}
                                    closePanel={props.closePanel}
                                    origin={props.origin}
                                    closeModal={() => {
                                        setShowingACHWiringInfo(false);
                                    }}
                                    selectedOwner={selectedFactoringCompany}
                                    setSelectedOwner={setSelectedFactoringCompany}
                                    owner='factoring-company'
                                    savingUrl='/saveFactoringCompanyAchWiringInfo'
                                />
                            </div>
                        </animated.div>
                    )
            )}

            {
                noteTransition((style, item) => item && (
                    <animated.div style={{ ...style }}>
                        <Modal
                            selectedData={selectedFactoringCompanyNote}
                            setSelectedData={setSelectedFactoringCompanyNote}
                            selectedParent={selectedFactoringCompany}
                            setSelectedParent={(data) => {
                                setSelectedFactoringCompany({ ...selectedFactoringCompany, notes: data.notes });

                                if ((props.selectedCarrier?.id || 0) > 0 && props.selectedCarrier?.factoring_company?.id === selectedFactoringCompany?.id) {
                                    props.setSelectedCarrier({
                                        id: props.selectedCarrier.id,
                                        factoring_company: {
                                            ...selectedFactoringCompany,
                                            notes: data.notes
                                        },
                                        component_id: props.componentId
                                    });
                                }
                            }}
                            savingDataUrl='/saveFactoringCompanyNotes'
                            deletingDataUrl=''
                            type='note'
                            isEditable={false}
                            isDeletable={false}
                            isPrintable={false}
                            isAdding={selectedFactoringCompanyNote.id === 0}
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
        user: state.systemReducers.user,
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
    setAdminOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
    setSelectedCarrier,
})(FactoringCompany)