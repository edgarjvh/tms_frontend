/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import axios from 'axios';
import Draggable from 'react-draggable';
import './PersonalContacts.css';
import MaskedInput from 'react-text-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VCard from 'vcard-creator';
import FileSaver from 'file-saver';
import {
    faCaretDown,
    faCaretRight,
    faCalendarAlt,
    faCheck,
    faPencilAlt,
    faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

import { parse } from 'vcf';

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

    setSelectedCustomer,
    setSelectedContact,
    setSelectedCarrier,
    setSelectedCarrierContact,
    setSelectedFactoringCompany,
    setSelectedFactoringCompanyContact,
    setSelectedCompanyDriver as setSelectedDriver,
    setSelectedDriverContact,
    setSelectedCompanyOperator as setSelectedOperator,
    setSelectedOperatorContact,
    setUserContacts
} from '../../../../actions';
import { Documents } from "../index";
import moment from "moment";
import { animated, useTransition } from "react-spring";

import { PassModal } from '../../../admin/panels';

var vCardsJS = require('vcards-js');

const PersonalContacts = (props) => {
    const refContactsContainer = useRef();
    const refPrefix = useRef();
    const refInputAvatar = useRef();
    const [selectedContact, setSelectedContact] = useState(null)
    const [tempContact, setTempContact] = useState(null);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [personalContactList, setPersonalContactList] = useState([]);
    const [progressUploaded, setProgressUploaded] = useState(0);
    const [progressTotal, setProgressTotal] = useState(0);
    const refImportContact = useRef();  // Import contact button

    var lastLetter = '';

    const borderBottomClasses = classnames({
        'field-border-bottom': true,
        'disabled': !isEditingContact
    });

    useEffect(async () => {
        axios.post(props.serverUrl + '/getUserContacts', { user_code_id: props.user.user_code.id }).then(res => {
            if (res.data.result === 'OK') {
                setPersonalContactList(res.data.contacts);

            }
        }).catch(e => {
            console.log('error getting contacts', e);
        }).finally(() => {
            refContactsContainer.current.focus({ preventScroll: true });
        })
    }, [])

    useEffect(() => {
        if (props.userContacts && props.userContacts?.componentId !== props.componentId) {
            const contacts = props.userContacts?.contacts || [];

            setPersonalContactList(contacts);

            if ((selectedContact?.id || 0) > 0) {
                const selected = contacts.find(c => c.id === selectedContact.id);

                if (!selected) {
                    setSelectedContact(null);
                }
            }

            if ((tempContact?.id || 0) > 0) {
                const selected = contacts.find(c => c.id === tempContact.id);

                if (!selected) {
                    setTempContact(prev => {
                        return {
                            ...prev,
                            id: null
                        }
                    });
                }
            }

            props.setUserContacts(null);
        }
    }, [props.userContacts])

    const saveContact = () => {
        if ((tempContact.first_name || '').trim() === '') {
            window.alert('You must enter the first name!');
            return;
        }

        if ((tempContact.phone_work || '').trim() === '' &&
            (tempContact.phone_work_fax || '').trim() === '' &&
            (tempContact.phone_mobile || '').trim() === '' &&
            (tempContact.phone_direct || '').trim() === '' &&
            (tempContact.phone_other || '').trim() === '') {
            window.alert('You must enter at least one phone number!');
            return;
        }

        switch (tempContact.primary_phone) {
            case 'work':
                if ((tempContact.phone_work || '').trim() === '') {
                    tempContact.primary_phone = (tempContact.phone_work_fax || '').trim() !== ''
                        ? 'fax'
                        : (tempContact.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (tempContact.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempContact.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'fax':
                if ((tempContact.phone_work_fax || '').trim() === '') {
                    tempContact.primary_phone = (tempContact.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempContact.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (tempContact.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempContact.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'mobile':
                if ((tempContact.phone_mobile || '').trim() === '') {
                    tempContact.primary_phone = (tempContact.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempContact.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempContact.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempContact.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'direct':
                if ((tempContact.phone_direct || '').trim() === '') {
                    tempContact.primary_phone = (tempContact.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempContact.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempContact.phone_mobile || '').trim() !== ''
                                ? 'mobile'
                                : (tempContact.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'other':
                if ((tempContact.phone_other || '').trim() === '') {
                    tempContact.primary_phone = (tempContact.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempContact.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempContact.phone_mobile || '').trim() !== ''
                                ? 'mobile'
                                : (tempContact.phone_direct || '').trim() !== ''
                                    ? 'direct'
                                    : 'work'
                }
                break;
            default:
                tempContact.primary_phone = (tempContact.phone_work || '').trim() !== ''
                    ? 'work'
                    : (tempContact.phone_work_fax || '').trim() !== ''
                        ? 'fax'
                        : (tempContact.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (tempContact.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempContact.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                break;
        }

        switch (tempContact.primary_email) {
            case 'work':
                if ((tempContact.email_work || '').trim() === '') {
                    tempContact.primary_email = (tempContact.email_personal || '').trim() !== ''
                        ? 'personal'
                        : (tempContact.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                }
                break;
            case 'personal':
                if ((tempContact.email_personal || '').trim() === '') {
                    tempContact.primary_email = (tempContact.email_work || '').trim() !== ''
                        ? 'work'
                        : (tempContact.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                }
                break;
            case 'other':
                if ((tempContact.email_other || '').trim() === '') {
                    tempContact.primary_email = (tempContact.email_work || '').trim() !== ''
                        ? 'work'
                        : (tempContact.email_personal || '').trim() !== ''
                            ? 'personal'
                            : 'work'
                }
                break;
            default:
                tempContact.primary_email = (tempContact.email_work || '').trim() !== ''
                    ? 'work'
                    : (tempContact.email_personal || '').trim() !== ''
                        ? 'personal'
                        : (tempContact.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                break;
        }

        if ((tempContact.address1 || '').trim() === '' && (tempContact.address2 || '').trim() === '') {
            tempContact.address1 = personalContactList.address1;
            tempContact.address2 = personalContactList.address2;
            tempContact.city = personalContactList.city;
            tempContact.state = personalContactList.state;
            tempContact.zip_code = personalContactList.zip;
        }

        tempContact.user_code_id = props.user.user_code.id;

        axios.post(props.serverUrl + '/saveUserContact', tempContact).then(res => {
            if (res.data.result === 'OK') {
                const contacts = [
                    ...res.data.contacts
                ];

                setPersonalContactList(contacts);

                props.setUserContacts({
                    componentId: props.componentId,
                    contacts
                });

                setIsEditingContact(false);
            }
        }).catch(e => {
            console.log('error saving contact', e);
        });
    }

    const deleteContact = () => {
        if (window.confirm('Are you sure to delete this contact?')) {
            axios.post(props.serverUrl + '/deleteUserContact', {
                user_code_id: props.user.user_code.id,
                id: selectedContact.id,
            }).then(res => {
                if (res.data.result === 'OK') {
                    const contacts = [
                        ...res.data.contacts
                    ];

                    setPersonalContactList(contacts);
                    setSelectedContact(null);

                    props.setUserContacts({
                        componentId: props.componentId,
                        contacts
                    });
                    setIsEditingContact(false);
                }
            }).catch(e => {
                console.log('error deleting contact', e);
            });
        }
    }

    const importContact = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const vcfData = e.target.result;
            const parsedContacts = parse(vcfData);
            const contactsArray = parsedContacts.map(contact => {
                const emails = Array.isArray(contact.get('email')) ? contact.get('email').map(email => ({
                    type: Array.isArray(email.type) ? email.type.filter(t => ['work', 'personal', 'other'].includes(t)).join(', ') : (email.type || 'other'),
                    value: email.valueOf()
                })) : [{ type: 'work', value: contact.get('email')?.valueOf() || '' }];

                const phones = Array.isArray(contact.get('tel')) ? contact.get('tel').map(phone => ({
                    type: Array.isArray(phone.type) ? phone.type.filter(t => ['work', 'fax', 'mobile', 'direct', 'other'].includes(t)).join(', ') : (phone.type || 'other'),
                    value: phone.valueOf()
                })) : [{ type: 'work', value: contact.get('tel')?.valueOf() || '' }];

                const addressParts = contact.get('adr')?.valueOf().split(';') || [];
                const address = {
                    street: addressParts[2] || '',
                    city: addressParts[3] || '',
                    state: addressParts[4] || '',
                    zip: addressParts[5] || ''
                };

                const nameParts = contact.get('n')?.valueOf().split(';') || [];
                const name = {
                    last: nameParts[0] || '',
                    first: nameParts[1] || '',
                    middle: nameParts[2] || '',
                    prefix: nameParts[3] || '',
                    suffix: nameParts[4] || ''
                }

                const organizationParts = contact.get('org')?.valueOf().split(';') || [];
                const organization = {
                    company: organizationParts[0] || '',
                    department: organizationParts[1] || ''
                }

                return {
                    fullName: contact.get('fn')?.valueOf() || '',
                    name,
                    organization,
                    title: contact.get('title')?.valueOf() || '',
                    emails,
                    phones,
                    address,
                    url: contact.get('url')?.valueOf() || '',
                    note: contact.get('note')?.valueOf() || '',
                    birthday: contact.get('bday')?.valueOf() || ''
                };
            });
            if ((contactsArray || []).length > 0) {
                setTempContact({
                    prefix: contactsArray[0].name.prefix,
                    first_name: contactsArray[0].name.first,
                    middle_name: contactsArray[0].name.middle,
                    last_name: contactsArray[0].name.last,
                    suffix: contactsArray[0].name.suffix,
                    company: contactsArray[0].organization.company,
                    department: contactsArray[0].organization.department,
                    title: contactsArray[0].title,
                    email_work: contactsArray[0].emails.find(email => email.type === 'work')?.value || '',
                    email_personal: contactsArray[0].emails.find(email => email.type === 'personal')?.value || '',
                    email_other: contactsArray[0].emails.find(email => email.type === 'other')?.value || '',
                    phone_work: contactsArray[0].phones.find(phone => phone.type === 'work')?.value || '',
                    phone_work_fax: contactsArray[0].phones.find(phone => phone.type === 'fax')?.value || '',
                    phone_mobile: contactsArray[0].phones.find(phone => phone.type === 'mobile')?.value || '',
                    phone_direct: contactsArray[0].phones.find(phone => phone.type === 'direct')?.value || '',
                    phone_other: contactsArray[0].phones.find(phone => phone.type === 'other')?.value || '',
                    address1: contactsArray[0].address.street,
                    city: contactsArray[0].address.city,
                    state: contactsArray[0].address.state,
                    zip_code: contactsArray[0].address.zip,
                    website: contactsArray[0].url,
                    notes: contactsArray[0].note,
                    birthday: contactsArray[0].birthday
                });

                setIsEditingContact(true);
                setSelectedContact(null);
                refPrefix.current.focus({ preventScroll: true });
            }
        };

        reader.readAsText(file);
        event.target.value = null;
    }

    const exportContact = () => {
        let selectedPerson = {};

        if (isEditingContact) {
            selectedPerson = { ...tempContact };
        } else {
            selectedPerson = { ...selectedContact }
        }

        let baseUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PRO_SERVER_BASE_URL : process.env.REACT_APP_DEV_SERVER_BASE_URL;
        let photo = (selectedPerson?.avatar || '') !== '' ? selectedPerson?.avatar : '';

        const myVCard = new VCard();

        myVCard
            .addName((selectedPerson?.last_name || ''), (selectedPerson?.first_name || ''), (selectedPerson?.middle_name || ''), (selectedPerson?.prefix || ''), (selectedPerson?.suffix || ''))
            .addCompany((selectedPerson?.company || ''), (selectedPerson?.department || ''))
            .addJobtitle((selectedPerson?.title || ''))
            .addEmail((selectedPerson?.email_work || ''), 'WORK')
            .addEmail((selectedPerson?.email_personal || ''), 'PERSONAL')
            .addEmail((selectedPerson?.email_other || ''), 'OTHER')
            .addPhoneNumber((selectedPerson?.phone_work || ''), 'WORK')
            .addPhoneNumber((selectedPerson?.phone_work_fax || ''), 'FAX')
            .addPhoneNumber((selectedPerson?.phone_mobile || ''), 'CELL')
            .addPhoneNumber((selectedPerson?.phone_direct || ''), 'HOME')
            .addPhoneNumber((selectedPerson?.phone_other || ''), 'OTHER')
            .addAddress(null, null, (selectedPerson?.address1 || ''), (selectedPerson?.city || ''), (selectedPerson?.state || ''), (selectedPerson?.zip_code || ''), (selectedPerson?.country || ''))
            .addURL((selectedPerson?.website || ''))
            .addNote((selectedPerson?.notes || ''))
            .addPhotoURL(photo !== '' ? baseUrl + '/avatars/' + photo : '')
            .addBirthday((selectedPerson?.birthday || ''));

        let file = new Blob([
            myVCard.toString()
        ],
            { type: "text/vcard;charset=utf-8" });

        FileSaver.saveAs(
            file,
            `${selectedPerson?.first_name || ''}${selectedPerson?.last_name || ''}.vcf`,
            true
        );
    }

    const contactAvatarChange = (e) => {
        let files = e.target.files;
        const maxSize = 1048576;

        if (FileReader && files && (files.length > 0)) {
            if (files[0].size > maxSize) {
                window.alert("Selected image is too large, please select an image below 1mb");
                return;
            }

            let formData = new FormData();
            formData.append("avatar", files[0]);
            formData.append("id", selectedContact?.id);
            formData.append("user_code_id", props.user.user_code.id);

            const options = {
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;

                    setProgressUploaded(isNaN(loaded) ? 0 : loaded);
                    setProgressTotal(isNaN(total) ? 0 : total);
                }
            }

            axios.post(props.serverUrl + '/uploadUserContactAvatar', formData, options)
                .then(res => {
                    if (res.data.result === "OK") {
                        setPersonalContactList(res.data.contacts);
                        setTempContact(prev => {
                            return {
                                ...prev,
                                avatar: res.data.contact.avatar
                            }
                        });
                        setSelectedContact(prev => {
                            return {
                                ...prev,
                                avatar: res.data.contact.avatar
                            }
                        });

                        props.setUserContacts({
                            componentId: props.componentId,
                            contacts: res.data.contacts
                        });
                    }
                    refInputAvatar.current.value = "";
                })
                .catch((err) => {
                    console.log("error changing contact avatar", err);
                    refInputAvatar.current.value = "";
                })
                .then(() => {
                    setProgressUploaded(0);
                    setProgressTotal(0);
                });
        }
    }

    const removeContactAvatar = (e) => {
        axios.post(props.serverUrl + '/removeUserContactAvatar',{
            id: selectedContact?.id,
            user_code_id: props.user.user_code.id
        }).then(res => {
            if (res.data.result === "OK") {
                setPersonalContactList(res.data.contacts);
                setTempContact(prev => {
                    return {
                        ...prev,
                        avatar: res.data.contact.avatar
                    }
                });
                setSelectedContact(prev => {
                    return {
                        ...prev,
                        avatar: res.data.contact.avatar
                    }
                });
                props.setUserContacts({
                    componentId: props.componentId,
                    contacts: res.data.contacts
                });
            }
        }).catch(e => {
            console.log('error removig contact avatar', e);
        });
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

    const listClasses = classnames({
        'contact-list-container': true,
        'pro': true
    })
    const formClasses = classnames({
        'contact-form': true,
        'pro': true
    })

    return (
        <div className="panel-content" tabIndex={0} ref={refContactsContainer} onKeyDown={(e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                if (isEditingContact) {
                    setIsEditingContact(false);
                    setTempContact({});
                } else {
                    props.closingCallback();
                }
            }
        }}>
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="close-btn" title="Close" style={{ zIndex: 3 }} onClick={e => { props.closingCallback() }}><span className="fas fa-times"></span></div>

            <div className="personal-contact-container" tabIndex="0" onKeyDown={(e) => {
                let key = e.keyCode || e.which;

                if (key === 120) { // F9
                    e.stopPropagation();

                    isEditingContact
                        ? (tempContact?.type || 'internal') === 'internal'
                            ? setTempContact(prev => {
                                return {
                                    ...prev,
                                    type: 'external',
                                    prefix: '',
                                    first_name: '',
                                    middle_name: '',
                                    last_name: '',
                                    suffix: '',
                                    company: '',
                                    title: '',
                                    department: '',
                                    email_work: '',
                                    email_personal: '',
                                    email_other: '',
                                    primary_email: 'work',
                                    phone_work: '',
                                    phone_work_fax: '',
                                    phone_mobile: '',
                                    phone_direct: '',
                                    phone_other: '',
                                    phone_ext: '',
                                    primary_phone: 'work',
                                    country: '',
                                    address1: '',
                                    address2: '',
                                    city: '',
                                    state: '',
                                    zip_code: '',
                                    birthday: '',
                                    website: '',
                                    notes: '',
                                    is_primary: 0
                                }
                            })
                            : window.confirm('Are you sure you want to proceed?')
                                ? setTempContact(prev => {
                                    return {
                                        ...prev,
                                        company: selectedContact?.company || '',
                                        address1: selectedContact?.address1 || '',
                                        address2: selectedContact?.address2 || '',
                                        city: selectedContact?.city || '',
                                        state: selectedContact?.state || '',
                                        zip_code: selectedContact?.zip_code || '',
                                        type: 'internal'
                                    }
                                })
                                : e.preventDefault()
                        : e.preventDefault()
                }
            }} style={{ overflow: 'initial' }}>
                <div className={listClasses}>
                    <div className="title">CONTACTS</div>
                    <div className="side-title" style={{ left: '-45px' }}>
                        <div>{props.title}</div>
                    </div>

                    <div className="contact-list">
                        <div className="contact-list-wrapper">
                            {
                                (personalContactList || []).map((contact, index) => {
                                    let curLetter = contact.first_name.substring(0, 1).toLowerCase();
                                    if (curLetter !== lastLetter) {
                                        lastLetter = curLetter;
                                        return (
                                            <div key={index}>
                                                <div className="letter-header">{curLetter}</div>

                                                <div className="row-contact" style={{
                                                    transition: 'ease-in-out 0.3s',
                                                    borderLeft: isEditingContact
                                                        ? (tempContact?.id || 0) === contact.id ? '3px solid #2D0DFF' : '3px solid transparent'
                                                        : (selectedContact?.id || 0) === contact.id ? '3px solid #2D0DFF' : '3px solid transparent'
                                                }} onClick={() => {
                                                    setSelectedContact({
                                                        ...contact,
                                                        company: (contact?.company || '') === ''
                                                            ? `${props.user.first_name} ${props.user.last_name}`.trim()
                                                            : contact.company
                                                    })

                                                    setIsEditingContact(false);
                                                }}>
                                                    <div className="contact-avatar-container">
                                                        <img
                                                            src={contact.avatar ? props.serverUrl + '/avatars/' + contact.avatar : 'img/avatar-user-default.png'}
                                                            alt="" />
                                                    </div>

                                                    <div className="contact-data">
                                                        <div className="contact-name" style={{
                                                            display: 'flex', alignItems: 'center'
                                                        }}>
                                                            <div style={{ flexGrow: 1, textTransform: 'capitalize' }}>
                                                                {(contact.prefix || '') + " " + contact.first_name + " " + (contact.middle_name || '') + " " + contact.last_name}
                                                            </div>
                                                        </div>
                                                        <div className="online-status">
                                                            <div className='is-online is-online-off'></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index} className="row-contact" style={{
                                                transition: 'ease-in-out 0.3s',
                                                borderLeft: isEditingContact
                                                    ? (tempContact?.id || 0) === contact.id ? '3px solid #2D0DFF' : '3px solid transparent'
                                                    : (selectedContact?.id || 0) === contact.id ? '3px solid #2D0DFF' : '3px solid transparent'
                                            }} onClick={() => {
                                                setSelectedContact({
                                                    ...contact,
                                                    company: (contact?.company || '') === ''
                                                        ? `${props.user.first_name} ${props.user.last_name}`.trim()
                                                        : contact.company
                                                })

                                                setIsEditingContact(false);
                                            }}>
                                                <div className="contact-avatar-container">
                                                    <img
                                                        src={contact.avatar ? props.serverUrl + '/avatars/' + contact.avatar : 'img/avatar-user-default.png'}
                                                        alt="" />
                                                </div>

                                                <div className="contact-data">
                                                    <div
                                                        className="contact-name">{(contact.prefix || '') + " " + contact.first_name + " " + (contact.middle_name || '') + " " + contact.last_name}</div>
                                                    <div className="online-status">
                                                        <div className='is-online is-online-off'></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className="contact-form-bg">
                    <div className={formClasses}>
                        <div className="contact-form-header">
                            <div className="contact-avatar-container">
                                {
                                    (isEditingContact && (selectedContact?.id || 0) > 0 && (selectedContact?.avatar || '') !== '') &&
                                    <span className="fas fa-trash-alt remove-contact-avatar-btn"
                                        onClick={removeContactAvatar}></span>
                                }
                                {
                                    (isEditingContact && (selectedContact?.id || 0) > 0) &&
                                    <span className="fas fa-plus change-contact-avatar-btn" onClick={() => {
                                        refInputAvatar.current.click()
                                    }}></span>
                                }

                                <form encType='multipart/form-data' style={{ display: 'none' }}>
                                    <input type="file" ref={refInputAvatar} accept='image/*'
                                        onChange={contactAvatarChange} />
                                </form>

                                <div className="contact-avatar-wrapper">
                                    <img
                                        src={
                                            isEditingContact
                                                ? tempContact?.avatar ? props.serverUrl + '/avatars/' + tempContact?.avatar : 'img/avatar-user-default.png'
                                                : selectedContact?.avatar ? props.serverUrl + '/avatars/' + selectedContact?.avatar : 'img/avatar-user-default.png'
                                        }
                                        alt="" />
                                </div>

                            </div>
                            <div className="contact-info">
                                <div className="contact-name">
                                    {
                                        isEditingContact
                                            ? (tempContact?.prefix || '') + " " + (tempContact?.first_name || '') + " " + (tempContact?.middle_name || '') + " " + (tempContact?.last_name || '')
                                            : (selectedContact?.prefix || '') + " " + (selectedContact?.first_name || '') + " " + (selectedContact?.middle_name || '') + " " + (selectedContact?.last_name || '')}
                                </div>
                                <div className="contact-company">
                                    <span style={{ textTransform: 'capitalize', display: 'inline-block' }}>
                                        {
                                            isEditingContact
                                                ? (tempContact?.company || '') === ''
                                                    ? `${props.user.first_name} ${props.user.last_name}`.trim()
                                                    : tempContact?.company
                                                : (selectedContact?.company || '') === ''
                                                    ? `${props.user.first_name} ${props.user.last_name}`.trim()
                                                    : selectedContact?.company
                                        }
                                    </span>

                                    <span style={{ textTransform: 'capitalize', display: 'inline-block' }}>
                                        {
                                            isEditingContact
                                                ? (tempContact?.title || '')
                                                : (selectedContact?.title || '')
                                        }
                                    </span>

                                    <span style={{ textTransform: 'capitalize', display: 'inline-block' }}>
                                        {
                                            isEditingContact
                                                ? (tempContact?.department || '')
                                                : (selectedContact?.department || '')
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="contact-buttons">

                                <div className="right-buttons" style={{ display: 'flex' }}>
                                    {
                                        isEditingContact &&
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingContact(false);
                                            setTempContact(null);
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Cancel</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        isEditingContact &&
                                        <div className='mochi-button' onClick={saveContact}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Save</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        (!isEditingContact && (selectedContact?.id || 0) > 0) &&
                                        <div className='mochi-button' onClick={() => {
                                            setIsEditingContact(true);
                                            setTempContact({ ...selectedContact });
                                            refPrefix.current.focus();
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Edit</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }

                                    <input type="file" ref={refImportContact} accept='.vcf' onChange={importContact} style={{ display: 'none' }} />

                                    <div className='mochi-button' onClick={() => {
                                        refImportContact.current.click();
                                    }} style={{
                                        marginLeft: '0.2rem',
                                        pointerEvents: 'all',
                                        cursor: 'pointer'
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Import</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>

                                    {
                                        (!isEditingContact && (selectedContact?.id || 0) > 0) &&
                                        <div className='mochi-button' onClick={exportContact}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Export</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }

                                    {
                                        (!isEditingContact && (selectedContact?.id || 0) > 0) &&
                                        <div className='mochi-button' onClick={deleteContact}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base" style={{ color: 'rgba(138,8,8,1)' }}>
                                                Delete
                                            </div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-fields">
                            <div className="col-contact-form">
                                <div className="contact-form-wrapper">
                                    <div className="field-container">
                                        <div className="field-title">Prefix</div>
                                        <input ref={refPrefix} type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        prefix: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.prefix || '' : selectedContact?.prefix || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">First Name</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        first_name: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.first_name || '' : selectedContact?.first_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Middle Name</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        middle_name: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.middle_name || '' : selectedContact?.middle_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Last Name</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        last_name: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.last_name || '' : selectedContact?.last_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Suffix</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        suffix: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.suffix || '' : selectedContact?.suffix || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Company</div>
                                        <input type="text"
                                            style={{
                                                textTransform: 'capitalize'
                                            }}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        company: e.target.value
                                                    }
                                                });
                                            }}
                                            value={
                                                isEditingContact
                                                    ? tempContact?.company || ''
                                                    : selectedContact?.company || ''
                                            } />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Title</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        title: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.title || '' : selectedContact?.title || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Department</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        department: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.department || '' : selectedContact?.department || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Work</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        email_work: e.target.value.toLowerCase()
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.email_work || '' : selectedContact?.email_work || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Personal</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        email_personal: e.target.value.toLowerCase()
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.email_personal || '' : selectedContact?.email_personal || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Other</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        email_other: e.target.value.toLowerCase()
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.email_other || '' : selectedContact?.email_other || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Work</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        phone_work: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.phone_work || '' : selectedContact?.phone_work || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Ext</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        phone_ext: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.phone_ext || '' : selectedContact?.phone_ext || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Work Fax</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        phone_work_fax: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.phone_work_fax || '' : selectedContact?.phone_work_fax || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Mobile</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        phone_mobile: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.phone_mobile || '' : selectedContact?.phone_mobile || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Direct</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        phone_direct: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.phone_direct || '' : selectedContact?.phone_direct || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Other</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        phone_other: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.phone_other || '' : selectedContact?.phone_other || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Country</div>
                                        <input type="text" readOnly={!isEditingContact} style={{ textTransform: 'capitalize' }}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        country: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.country || '' : selectedContact?.country || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Address 1</div>
                                        <input type="text" readOnly={!isEditingContact} style={{ textTransform: 'capitalize' }}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    address1: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.address1 || '' : selectedContact?.address1 || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Address 2</div>
                                        <input type="text" readOnly={!isEditingContact} style={{ textTransform: 'capitalize' }}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    address2: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.address2 || '' : selectedContact?.address2 || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">City</div>
                                        <input type="text" readOnly={!isEditingContact} style={{ textTransform: 'capitalize' }}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    city: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.city || '' : selectedContact?.city || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">State</div>
                                        <input type="text" readOnly={!isEditingContact} maxLength={2}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        state: e.target.value.toUpperCase()
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.state || '' : selectedContact?.state || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Postal Code</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        zip_code: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.zip_code || '' : selectedContact?.zip_code || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Birthday</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        birthday: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.birthday || '' : selectedContact?.birthday || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Website</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        website: e.target.value.toLowerCase
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.website || '' : selectedContact?.website || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Notes</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onKeyDown={e => {
                                                let key = e.keyCode || e.which;

                                                if (key === 9) {
                                                    e.preventDefault()

                                                    refPrefix.current.focus();
                                                }
                                            }}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        notes: e.target.value
                                                    }
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.notes || '' : selectedContact?.notes || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer">
                    <div className="left-buttons">
                        <div className='mochi-button' onClick={() => {
                            setTempContact({
                                company: `${props.user.first_name} ${props.user.last_name}`.trim(),
                            })

                            setSelectedContact(null);

                            setIsEditingContact(true);
                            refPrefix.current.focus();
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">
                                Add Personal Contact
                            </div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        user: state.systemReducers.user,

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

        selectedCustomer: state.customerReducers.selectedCustomer,
        selectedContact: state.customerReducers.selectedContact,
        selectedCarrier: state.carrierReducers.selectedCarrier,
        selectedCarrierContact: state.carrierReducers.selectedContact,
        selectedFactoringCompany: state.carrierReducers.selectedFactoringCompany,
        selectedFactoringCompanyContact: state.carrierReducers.selectedFactoringCompanyContact,
        selectedDriver: state.companySetupReducers.selectedDriver,
        selectedDriverContact: state.companySetupReducers.selectedDriverContact,
        selectedOperator: state.companySetupReducers.selectedOperator,
        selectedOperatorContact: state.companySetupReducers.selectedOperatorContact,

        userContacts: state.userReducers.userContacts
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

    setSelectedCustomer,
    setSelectedContact,
    setSelectedCarrier,
    setSelectedCarrierContact,
    setSelectedFactoringCompany,
    setSelectedFactoringCompanyContact,
    setSelectedDriver,
    setSelectedDriverContact,
    setSelectedOperator,
    setSelectedOperatorContact,
    setUserContacts
})(PersonalContacts)