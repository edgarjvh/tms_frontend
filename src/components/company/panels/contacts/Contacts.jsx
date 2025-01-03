/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import axios from 'axios';
import Draggable from 'react-draggable';
import './Contacts.css';
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
    setSelectedOperatorContact
} from './../../../../actions';
import { Documents } from "../index";
import moment from "moment";
import { animated, useTransition } from "react-spring";

import { PassModal } from './../../../admin/panels/';

var vCardsJS = require('vcards-js');

const Contacts = (props) => {
    const refContactsContainer = useRef();
    const refPrefix = useRef();
    const refInputAvatar = useRef();
    const [tempSelectedContact, setTempSelectedContact] = useState({});
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [contactSearchCustomer, setContactSearchCustomer] = useState({});
    const [progressUploaded, setProgressUploaded] = useState(0);
    const [progressTotal, setProgressTotal] = useState(0);
    const [newPassword, setNewPassword] = useState('');
    const refImportContact = useRef();  // Import contact button

    var lastLetter = '';

    const borderBottomClasses = classnames({
        'field-border-bottom': true,
        'disabled': !isEditingContact
    });

    const newPasswordTransition = useTransition(newPassword !== '', {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: newPassword !== '',
        config: { duration: 100 }
    });

    useEffect(async () => {
        setContactSearchCustomer(props.contactSearchCustomer || {});

        setTempSelectedContact({ ...props.contactSearchCustomer.selectedContact });

        if (props.isEditingContact) {
            setIsEditingContact(true);
            refPrefix.current.focus({
                preventScroll: true
            });
        } else {
            refContactsContainer.current.focus({
                preventScroll: true
            })
        }
    }, [])

    const saveContact = () => {
        let contact = contactSearchCustomer?.selectedContact;

        if ((tempSelectedContact.first_name || '').trim() === '') {
            window.alert('You must enter the first name!');
            return;
        }

        // if ((tempSelectedContact.last_name || '').trim() === '') {
        //     window.alert('You must enter the last name!');
        //     return;
        // }

        if ((tempSelectedContact.phone_work || '').trim() === '' &&
            (tempSelectedContact.phone_work_fax || '').trim() === '' &&
            (tempSelectedContact.phone_mobile || '').trim() === '' &&
            (tempSelectedContact.phone_direct || '').trim() === '' &&
            (tempSelectedContact.phone_other || '').trim() === '') {
            window.alert('You must enter at least one phone number!');
            return;
        }

        switch (tempSelectedContact.primary_phone) {
            case 'work':
                if ((tempSelectedContact.phone_work || '').trim() === '') {
                    tempSelectedContact.primary_phone = (tempSelectedContact.phone_work_fax || '').trim() !== ''
                        ? 'fax'
                        : (tempSelectedContact.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (tempSelectedContact.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedContact.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'fax':
                if ((tempSelectedContact.phone_work_fax || '').trim() === '') {
                    tempSelectedContact.primary_phone = (tempSelectedContact.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedContact.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (tempSelectedContact.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedContact.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'mobile':
                if ((tempSelectedContact.phone_mobile || '').trim() === '') {
                    tempSelectedContact.primary_phone = (tempSelectedContact.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedContact.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedContact.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedContact.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'direct':
                if ((tempSelectedContact.phone_direct || '').trim() === '') {
                    tempSelectedContact.primary_phone = (tempSelectedContact.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedContact.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedContact.phone_mobile || '').trim() !== ''
                                ? 'mobile'
                                : (tempSelectedContact.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'other':
                if ((tempSelectedContact.phone_other || '').trim() === '') {
                    tempSelectedContact.primary_phone = (tempSelectedContact.phone_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedContact.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (tempSelectedContact.phone_mobile || '').trim() !== ''
                                ? 'mobile'
                                : (tempSelectedContact.phone_direct || '').trim() !== ''
                                    ? 'direct'
                                    : 'work'
                }
                break;
            default:
                tempSelectedContact.primary_phone = (tempSelectedContact.phone_work || '').trim() !== ''
                    ? 'work'
                    : (tempSelectedContact.phone_work_fax || '').trim() !== ''
                        ? 'fax'
                        : (tempSelectedContact.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (tempSelectedContact.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (tempSelectedContact.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                break;
        }

        switch (tempSelectedContact.primary_email) {
            case 'work':
                if ((tempSelectedContact.email_work || '').trim() === '') {
                    tempSelectedContact.primary_email = (tempSelectedContact.email_personal || '').trim() !== ''
                        ? 'personal'
                        : (tempSelectedContact.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                }
                break;
            case 'personal':
                if ((tempSelectedContact.email_personal || '').trim() === '') {
                    tempSelectedContact.primary_email = (tempSelectedContact.email_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedContact.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                }
                break;
            case 'other':
                if ((tempSelectedContact.email_other || '').trim() === '') {
                    tempSelectedContact.primary_email = (tempSelectedContact.email_work || '').trim() !== ''
                        ? 'work'
                        : (tempSelectedContact.email_personal || '').trim() !== ''
                            ? 'personal'
                            : 'work'
                }
                break;
            default:
                tempSelectedContact.primary_email = (tempSelectedContact.email_work || '').trim() !== ''
                    ? 'work'
                    : (tempSelectedContact.email_personal || '').trim() !== ''
                        ? 'personal'
                        : (tempSelectedContact.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                break;
        }

        if ((tempSelectedContact.address1 || '').trim() === '' && (tempSelectedContact.address2 || '').trim() === '') {
            tempSelectedContact.address1 = contactSearchCustomer.address1;
            tempSelectedContact.address2 = contactSearchCustomer.address2;
            tempSelectedContact.city = contactSearchCustomer.city;
            tempSelectedContact.state = contactSearchCustomer.state;
            tempSelectedContact.zip_code = contactSearchCustomer.zip;
        }

        tempSelectedContact.main_customer_id = contactSearchCustomer.id;

        axios.post(props.serverUrl + props.savingContactUrl, tempSelectedContact).then(res => {
            if (res.data.result === 'OK') {
                let contacts = [
                    ...res.data.contacts
                ];

                let contact = contacts.find(x => x.id === res.data.contact.id);

                if (props.owner === 'customer') {
                    props.setSelectedCustomer({
                        ...props.selectedCustomer,
                        contacts: contacts
                    });
                    props.setSelectedContact(contact);
                }

                if (props.owner === 'carrier') {
                    props.setSelectedCarrier({ ...props.selectedCarrier, contacts: contacts });
                    props.setSelectedCarrierContact(contact);
                }

                if (props.owner === 'factoring-company') {
                    props.setSelectedFactoringCompany({ ...props.selectedFactoringCompany, contacts: contacts });
                    props.setSelectedFactoringCompanyContact(contact);
                }

                if (props.owner === 'division') {
                    props.setSelectedDivision({ ...props.selectedDivision, contacts: contacts });
                    props.setSelectedDivisionContact(contact);
                }

                if (props.owner === 'employee') {
                    props.setSelectedEmployee({ ...props.selectedEmployee, contacts: contacts });
                    props.setSelectedEmployeeContact(contact);
                }

                if (props.owner === 'agent') {
                    props.setSelectedAgent({ ...props.selectedAgent, contacts: contacts });
                    props.setSelectedAgentContact(contact);
                }

                if (props.owner === 'operator') {
                    props.setSelectedOperator({ ...props.selectedOperator, contacts: contacts });
                    props.setSelectedOperatorContact(contact);
                }

                if (props.owner === 'driver') {
                    props.setSelectedDriver({ ...props.selectedDriver, contacts: contacts });
                    props.setSelectedDriverContact(contact);
                }

                setContactSearchCustomer(prev => {
                    return {
                        ...prev,
                        selectedContact: contact,
                        contacts: contacts
                    }
                });
                setIsEditingContact(false);
            }
        }).catch(e => {
            console.log('error saving contact', e);
        });
    }

    const deleteContact = () => {
        let contact = contactSearchCustomer?.selectedContact;

        if (window.confirm('Are you sure to delete this contact?')) {
            axios.post(props.serverUrl + props.deletingContactUrl, { ...contact, main_customer_id: contactSearchCustomer.id }).then(res => {
                if (res.data.result === 'OK') {
                    if (props.owner === 'customer') {
                        props.setSelectedCustomer({ ...props.selectedCustomer, contacts: res.data.contacts });
                        props.setSelectedContact({ id: contact.id, deleted: true });
                    }

                    if (props.owner === 'carrier') {
                        props.setSelectedCarrier({ ...props.selectedCarrier, contacts: res.data.contacts });
                        props.setSelectedCarrierContact({ id: contact.id, deleted: true });
                    }

                    if (props.owner === 'factoring-company') {
                        props.setSelectedFactoringCompany({
                            ...props.selectedFactoringCompany,
                            contacts: res.data.contacts
                        });
                        props.setSelectedFactoringCompanyContact({ id: contact.id, deleted: true });
                    }

                    if (props.owner === 'division') {
                        props.setSelectedDivision({ ...props.selectedDivision, contacts: res.data.contacts });
                        props.setSelectedDivisionContact({ id: contact.id, deleted: true });
                    }

                    if (props.owner === 'employee') {
                        props.setSelectedEmployee({ ...props.selectedEmployee, contacts: res.data.contacts });
                        props.setSelectedEmployeeContact({ id: contact.id, deleted: true });
                    }

                    if (props.owner === 'agent') {
                        props.setSelectedAgent({ ...props.selectedAgent, contacts: res.data.contacts });
                        props.setSelectedAgentContact({ id: contact.id, deleted: true });
                    }

                    if (props.owner === 'operator') {
                        props.setSelectedOperator({ ...props.selectedOperator, contacts: res.data.contacts });
                        props.setSelectedOperatorContact({ id: contact.id, deleted: true });
                    }

                    if (props.owner === 'driver') {
                        props.setSelectedDriver({ ...props.selectedDriver, contacts: res.data.contacts });
                        props.setSelectedDriverContact({ id: contact.id, deleted: true });
                    }

                    setContactSearchCustomer({
                        ...contactSearchCustomer,
                        selectedContact: {},
                        contacts: res.data.contacts
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
                setTempSelectedContact({
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
                setContactSearchCustomer(prev => {
                    return {
                        ...prev,
                        selectedContact: {
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
                        }
                    }
                });
                refPrefix.current.focus({ preventScroll: true });
            }
        };

        reader.readAsText(file);
        event.target.value = null;
    }

    const exportContact = () => {
        let selectedPerson = {};

        if (isEditingContact) {
            selectedPerson = { ...tempSelectedContact };
        } else {
            selectedPerson = { ...contactSearchCustomer?.selectedContact }
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
            formData.append("contact_id", contactSearchCustomer?.selectedContact?.id);
            formData.append("customer_id", contactSearchCustomer.id);
            formData.append("carrier_id", contactSearchCustomer.id);
            formData.append("factoring_company_id", contactSearchCustomer.id);

            const options = {
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;

                    setProgressUploaded(isNaN(loaded) ? 0 : loaded);
                    setProgressTotal(isNaN(total) ? 0 : total);
                }
            }

            axios.post(props.serverUrl + props.uploadAvatarUrl, formData, options)
                .then(async res => {
                    if (res.data.result === "OK") {
                        if (props.owner === 'customer') {
                            props.setSelectedCustomer({ ...props.selectedCustomer, contacts: res.data.contacts });
                        }

                        if (props.owner === 'carrier') {
                            props.setSelectedCarrier({ ...props.selectedCarrier, contacts: res.data.contacts });
                        }

                        if (props.owner === 'factoring-company') {
                            props.setSelectedFactoringCompany({
                                ...props.selectedFactoringCompany,
                                contacts: res.data.contacts
                            });
                        }

                        if (props.owner === 'division') {
                            props.setSelectedDivision({ ...props.selectedDivision, contacts: res.data.contacts });
                        }

                        if (props.owner === 'employee') {
                            props.setSelectedEmployee({ ...props.selectedEmployee, contacts: res.data.contacts });
                        }

                        if (props.owner === 'agent') {
                            props.setSelectedAgent({ ...props.selectedAgent, contacts: res.data.contacts });
                        }

                        if (props.owner === 'operator') {
                            props.setSelectedOperator({
                                ...props.selectedOperator,
                                contacts: res.data.contacts
                            });
                        }

                        if (props.owner === 'driver') {
                            props.setSelectedDriver({
                                ...props.selectedDriver,
                                contacts: res.data.contacts
                            });
                        }

                        await setContactSearchCustomer({
                            ...contactSearchCustomer,
                            selectedContact: res.data.contact,
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
        axios.post(props.serverUrl + props.removeAvatarUrl, contactSearchCustomer?.selectedContact).then(async res => {
            if (res.data.result === "OK") {
                if (props.owner === 'customer') {
                    props.setSelectedCustomer({ ...props.selectedCustomer, contacts: res.data.contacts });
                }

                if (props.owner === 'carrier') {
                    props.setSelectedCarrier({ ...props.selectedCarrier, contacts: res.data.contacts });
                }

                if (props.owner === 'factoring-company') {
                    props.setSelectedFactoringCompany({ ...props.selectedFactoringCompany, contacts: res.data.contacts });
                }

                if (props.owner === 'division') {
                    props.setSelectedDivision({ ...props.selectedDivision, contacts: res.data.contacts });
                }

                if (props.owner === 'employee') {
                    props.setSelectedEmployee({ ...props.selectedEmployee, contacts: res.data.contacts });
                }

                if (props.owner === 'agent') {
                    props.setSelectedAgent({ ...props.selectedAgent, contacts: res.data.contacts });
                }

                if (props.owner === 'operator') {
                    props.setSelectedOperator({ ...props.selectedOperator, contacts: res.data.contacts });
                }

                if (props.owner === 'driver') {
                    props.setSelectedDriver({ ...props.selectedDriver, contacts: res.data.contacts });
                }

                await setContactSearchCustomer({
                    ...contactSearchCustomer,
                    selectedContact: res.data.contact,
                    contacts: res.data.contacts
                });
            }
        }).catch(e => {
            console.log('error removig contact avatar', e);
        });
    }

    const setContactPassword = () => {
        if (window.confirm('Are you sure you want to proceed?')) {
            axios.post(props.serverUrl + '/resetAgentContactPassword', { id: (contactSearchCustomer?.selectedContact?.id || 0) }).then(res => {
                if (res.data.result === 'OK') {
                    setNewPassword(res.data.newpass);
                } else {
                    window.alert('An error occurred while getting a new password');
                }
            })
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
                    setTempSelectedContact({});
                }else{
                    props.closingCallback();
                }
            }
        }}>
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="close-btn" title="Close" onClick={e => { props.closingCallback() }}><span className="fas fa-times"></span></div>

            <div className="contact-container" tabIndex="0" onKeyDown={(e) => {
                let key = e.keyCode || e.which;

                if (key === 120) {
                    e.stopPropagation();

                    isEditingContact
                        ? (tempSelectedContact?.type || 'internal') === 'internal'
                            ? setTempSelectedContact(prev => {
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
                                ? setTempSelectedContact(prev => {
                                    return {
                                        ...prev,
                                        company: contactSearchCustomer?.selectedContact?.company || '',
                                        address1: contactSearchCustomer?.selectedContact?.address1 || '',
                                        address2: contactSearchCustomer?.selectedContact?.address2 || '',
                                        city: contactSearchCustomer?.selectedContact?.city || '',
                                        state: contactSearchCustomer?.selectedContact?.state || '',
                                        zip_code: contactSearchCustomer?.selectedContact?.zip_code || '',
                                        type: 'internal'
                                    }
                                })
                                : e.preventDefault()
                        : e.preventDefault()
                }
            }} style={{ overflow: 'initial' }}>
                <div className={listClasses}>
                    <div className="title">{props.title}</div>
                    <div className="side-title" style={{ left: '-45px' }}>
                        <div>{props.title}</div>
                    </div>

                    <div className="contact-list">
                        <div className="contact-list-wrapper">
                            {
                                (contactSearchCustomer.contacts || []).map((contact, index) => {
                                    let curLetter = contact.first_name.substring(0, 1).toLowerCase();
                                    if (curLetter !== lastLetter) {
                                        lastLetter = curLetter;
                                        return (
                                            <div key={index}>
                                                <div className="letter-header">{curLetter}</div>

                                                <div className="row-contact" style={{
                                                    transition: 'ease-in-out 0.3s',
                                                    borderLeft: isEditingContact
                                                        ? (tempSelectedContact?.id || 0) === contact.id ? '3px solid #2D0DFF' : '3px solid transparent'
                                                        : (contactSearchCustomer?.selectedContact?.id || 0) === contact.id ? '3px solid #2D0DFF' : '3px solid transparent'
                                                }} onClick={async () => {
                                                    await setContactSearchCustomer(prev => {
                                                        console.log(prev)
                                                        return {
                                                            ...prev,
                                                            selectedContact: {
                                                                ...contact,
                                                                company: (contact?.company || '') === ''
                                                                    ? prev?.name || ''
                                                                    : contact.company
                                                            }
                                                        }
                                                    });
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
                                                            {
                                                                contact.pivot
                                                                    ? (contact?.pivot?.is_primary || 0) === 1 &&
                                                                    <div className="contact-list-col tcol pri" style={{ fontWeight: 'bold', fontStyle: 'normal' }}>P</div>
                                                                    : (contact.is_primary || 0) === 1 &&
                                                                    <div className="contact-list-col tcol pri" style={{ fontWeight: 'bold', fontStyle: 'normal' }}>P</div>

                                                            }</div>
                                                        <div className="online-status">
                                                            <div
                                                                className={contact.is_online === 1 ? 'is-online is-online-on' : 'is-online is-online-off'}></div>
                                                            {
                                                                props.owner === 'agent' &&
                                                                <div className="contact-username-info">
                                                                    <div className="contact-username-info-wrapper">
                                                                        <div className="username-chat">
                                                                            <div className="mochi-button" onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                window.open('https://mm.et3.dev', '_blank').focus();
                                                                            }}>
                                                                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                                                                <div className="mochi-button-base">Chat</div>
                                                                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="username-video">
                                                                            <div className="mochi-button" onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                window.open('https://meet.et3.dev/', '_blank').focus();
                                                                            }}>
                                                                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                                                                <div className="mochi-button-base">Video</div>
                                                                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index} className="row-contact" onClick={async () => {
                                                await setContactSearchCustomer({
                                                    ...contactSearchCustomer,
                                                    selectedContact: contact
                                                });
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
                                                        <div
                                                            className={contact.is_online === 1 ? 'is-online is-online-on' : 'is-online is-online-off'}></div>
                                                        {
                                                            props.owner === 'agent' &&
                                                            <div className="contact-username-info">
                                                                <div className="contact-username-info-wrapper">
                                                                    <div className="username-chat">
                                                                        <div className="mochi-button" onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            window.open('https://mm.et3.dev', '_blank').focus();
                                                                        }}>
                                                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                                                            <div className="mochi-button-base">Chat</div>
                                                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="username-video">
                                                                        <div className="mochi-button" onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            window.open('https://meet.et3.dev/', '_blank').focus();
                                                                        }}>
                                                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                                                            <div className="mochi-button-base">Video</div>
                                                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
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
                                    (isEditingContact && (contactSearchCustomer?.selectedContact?.id || 0) > 0 && (contactSearchCustomer?.selectedContact?.avatar || '') !== '') &&
                                    <span className="fas fa-trash-alt remove-contact-avatar-btn"
                                        onClick={removeContactAvatar}></span>
                                }
                                {
                                    (isEditingContact && (contactSearchCustomer?.selectedContact?.id || 0) > 0) &&
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
                                        src={contactSearchCustomer?.selectedContact?.avatar ? props.serverUrl + '/avatars/' + contactSearchCustomer?.selectedContact?.avatar : 'img/avatar-user-default.png'}
                                        alt="" />
                                </div>

                            </div>
                            <div className="contact-info">
                                <div className="contact-name">
                                    {(contactSearchCustomer?.selectedContact?.prefix || '') + " " + (contactSearchCustomer?.selectedContact?.first_name || '') + " " + (contactSearchCustomer?.selectedContact?.middle_name || '') + " " + (contactSearchCustomer?.selectedContact?.last_name || '')}
                                </div>
                                <div className="contact-company">
                                    <span>
                                        {
                                            // (contactSearchCustomer?.selectedContact?.id || 0) > 0
                                            //     ? (contactSearchCustomer?.selectedContact?.company || '') === ''
                                            //         ? (contactSearchCustomer?.selectedContact?.type || 'internal') === 'internal'
                                            //             ? (contactSearchCustomer?.selectedContact?.customer?.name || '')
                                            //             : ''
                                            //         : contactSearchCustomer?.selectedContact?.company
                                            //     : ''
                                            (contactSearchCustomer?.selectedContact?.company || '') === ''
                                                ? (contactSearchCustomer?.selectedContact?.type || 'internal') === 'internal'
                                                    ? (contactSearchCustomer?.selectedContact?.customer?.name || '')
                                                    : ''
                                                : contactSearchCustomer?.selectedContact?.company
                                        }
                                    </span>

                                    <span>
                                        {(contactSearchCustomer?.selectedContact?.title || '')}
                                    </span>

                                    <span>
                                        {(contactSearchCustomer?.selectedContact?.department || '')}
                                    </span>
                                </div>

                                {
                                    props.owner === 'agent' &&
                                    <div className="contact-username-info">
                                        <div className="contact-username-info-wrapper">
                                            <div className="username-chat">
                                                <div className="mochi-button" onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open('https://mm.et3.dev', '_blank').focus();
                                                }}>
                                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                                    <div className="mochi-button-base">Chat</div>
                                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                                </div>
                                            </div>

                                            <div className="username-video">
                                                <div className="mochi-button" onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open('https://meet.et3.dev/', '_blank').focus();
                                                }}>
                                                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                                    <div className="mochi-button-base">Video</div>
                                                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="contact-buttons">
                                {
                                    ((props.owner || '') === 'driver' || (props.owner || '') === 'operator') &&
                                    <div className="input-box-container" style={{ width: '7rem', marginBottom: 10 }}>
                                        <input type="number" placeholder='Priority' min={1} max={10} readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    priority: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    priority: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.priority || '' : contactSearchCustomer?.selectedContact?.priority || ''}
                                        />

                                    </div>
                                }
                                {
                                    ((props.owner || '') !== 'driver' && (props.owner || '') !== 'operator') &&
                                    <div className="input-toggle-container">
                                        <input type="checkbox" id="cbox-panel-customer-contacts-primary-btn"
                                            onChange={e => {
                                                if (tempSelectedContact.customer) {
                                                    setTempSelectedContact(prev => {
                                                        return {
                                                            ...prev,
                                                            pivot: {
                                                                ...tempSelectedContact?.pivot || {},
                                                                is_primary: e.target.checked ? 1 : 0
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    setTempSelectedContact(prev => {
                                                        return {
                                                            ...prev,
                                                            is_primary: e.target.checked ? 1 : 0
                                                        }
                                                    })
                                                }

                                            }}
                                            disabled={!isEditingContact}
                                            checked={isEditingContact
                                                ? tempSelectedContact?.pivot
                                                    ? (tempSelectedContact?.pivot.is_primary || 0) === 1
                                                    : (tempSelectedContact?.is_primary || 0) === 1
                                                : contactSearchCustomer?.selectedContact?.pivot
                                                    ? (contactSearchCustomer?.selectedContact?.pivot?.is_primary || 0) === 1
                                                    : (contactSearchCustomer?.selectedContact?.is_primary || 0) === 1

                                            } />
                                        <label htmlFor="cbox-panel-customer-contacts-primary-btn">
                                            <div className="label-text">Primary</div>
                                            <div className="input-toggle-btn"></div>
                                        </label>
                                    </div>
                                }

                                {
                                    ((props.owner || '') !== 'driver' && (props.owner || '') !== 'operator') &&
                                    <div className="input-toggle-container">
                                        <input type="checkbox" id="cbox-panel-customer-contacts-type-btn"
                                            onChange={e => {
                                                isEditingContact
                                                    ? (tempSelectedContact?.type || 'internal') === 'internal'
                                                        ? setTempSelectedContact(prev => {
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
                                                            ? setTempSelectedContact(prev => {
                                                                return {
                                                                    ...prev,
                                                                    company: contactSearchCustomer?.selectedContact?.company || '',
                                                                    address1: contactSearchCustomer?.selectedContact?.address1 || '',
                                                                    address2: contactSearchCustomer?.selectedContact?.address2 || '',
                                                                    city: contactSearchCustomer?.selectedContact?.city || '',
                                                                    state: contactSearchCustomer?.selectedContact?.state || '',
                                                                    zip_code: contactSearchCustomer?.selectedContact?.zip_code || '',
                                                                    type: 'internal'
                                                                }
                                                            })
                                                            : e.preventDefault()
                                                    : e.preventDefault()
                                            }}
                                            disabled={!isEditingContact}
                                            checked={isEditingContact
                                                ? tempSelectedContact?.type === 'internal'
                                                : contactSearchCustomer?.selectedContact?.type === 'internal'
                                            } />
                                        <label htmlFor="cbox-panel-customer-contacts-type-btn" style={{
                                            backgroundColor: isEditingContact
                                                ? (tempSelectedContact?.type || 'internal') === 'internal' ? '#ffb80d' : '#0D96FF'
                                                : (contactSearchCustomer?.selectedContact?.type || 'internal') === 'internal' ? '#ffb80d' : '#0D96FF'
                                        }}>
                                            <div className="label-text" style={{
                                                textTransform: 'capitalize'
                                            }}>{isEditingContact ? (tempSelectedContact?.type || 'internal') : (contactSearchCustomer?.selectedContact?.type || 'internal')}</div>
                                            <div className="input-toggle-btn"></div>
                                        </label>
                                    </div>
                                }


                                <div className="right-buttons" style={{ display: 'flex' }}>
                                    {
                                        isEditingContact &&
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingContact(false);
                                            setTempSelectedContact({});
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Cancel</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        isEditingContact &&
                                        <div className={
                                            ((props.user?.user_code?.is_admin || 0) === 0 &&
                                                (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                                    ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                                ? 'mochi-button disabled' : 'mochi-button'
                                        } onClick={saveContact}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Save</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                    {
                                        !isEditingContact &&
                                        <div className={
                                            ((props.user?.user_code?.is_admin || 0) === 0 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0)
                                                ? 'mochi-button disabled' : 'mochi-button'
                                        } onClick={() => {
                                            setIsEditingContact(true);
                                            setTempSelectedContact({ ...contactSearchCustomer?.selectedContact });
                                            refPrefix.current.focus();
                                        }} style={{
                                            color: contactSearchCustomer?.selectedContact?.id !== undefined ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.5)',
                                            pointerEvents: contactSearchCustomer?.selectedContact?.id !== undefined ? 'all' : 'none'
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Edit</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }

                                    <input type="file" ref={refImportContact} accept='.vcf' onChange={importContact} style={{ display: 'none' }} />

                                    <div className={
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0)
                                            ? 'mochi-button disabled' : 'mochi-button'
                                    } onClick={() => {
                                        refImportContact.current.click();
                                    }} style={{
                                        marginLeft: '0.2rem',
                                        pointerEvents: ((contactSearchCustomer?.selectedContact?.id !== undefined && contactSearchCustomer?.selectedContact?.id > 0) &&
                                            ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 1))
                                            ? 'all' : 'none',
                                        cursor: ((contactSearchCustomer?.selectedContact?.id !== undefined && contactSearchCustomer?.selectedContact?.id > 0) &&
                                            ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 1))
                                            ? 'pointer' : 'not-allowed'
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Import</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>

                                    <div className={
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0)
                                            ? 'mochi-button disabled' : 'mochi-button'
                                    } onClick={exportContact} style={{
                                        marginLeft: '0.2rem',
                                        pointerEvents: ((contactSearchCustomer?.selectedContact?.id !== undefined && contactSearchCustomer?.selectedContact?.id > 0) &&
                                            ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 1))
                                            ? 'all' : 'none',
                                        cursor: ((contactSearchCustomer?.selectedContact?.id !== undefined && contactSearchCustomer?.selectedContact?.id > 0) &&
                                            ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 1))
                                            ? 'pointer' : 'not-allowed'
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Export</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>

                                    <div className={
                                        ((props.user?.user_code?.is_admin || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.delete || 0) === 0)
                                            ? 'mochi-button disabled' : 'mochi-button'
                                    } onClick={deleteContact} style={{
                                        marginLeft: '0.2rem',
                                        pointerEvents: ((contactSearchCustomer?.selectedContact?.id !== undefined && contactSearchCustomer?.selectedContact?.id > 0) &&
                                            ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.delete || 0) === 1))
                                            ? 'all' : 'none',
                                        cursor: ((contactSearchCustomer?.selectedContact?.id !== undefined && contactSearchCustomer?.selectedContact?.id > 0) &&
                                            ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.delete || 0) === 1))
                                            ? 'pointer' : 'not-allowed'
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base"
                                            style={{ color: (contactSearchCustomer?.selectedContact?.id !== undefined && contactSearchCustomer?.selectedContact?.id > 0) ? 'rgba(138,8,8,1)' : 'rgba(138,8,8,0.5)' }}>Delete
                                        </div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>

                                    {
                                        ((contactSearchCustomer?.selectedContact?.agent_id || 0) > 0) &&
                                        <div className="mochi-button" onClick={setContactPassword} style={{
                                            marginLeft: '0.2rem',
                                            pointerEvents: (contactSearchCustomer?.selectedContact?.id !== undefined && contactSearchCustomer?.selectedContact?.id > 0) ? 'all' : 'none'
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base" style={{
                                                color: (contactSearchCustomer?.selectedContact?.id !== undefined && contactSearchCustomer?.selectedContact?.id > 0) ? 'rgba(138,8,8,1)' : 'rgba(138,8,8,0.5)'
                                            }}>New Password
                                            </div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                </div>

                                {
                                    ((contactSearchCustomer?.selectedContact?.agent_id || 0) > 0) &&
                                    <div className="mochi-button" style={{ margin: '5px 0' }} onClick={() => {

                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Permissions</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }

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
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    prefix: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    prefix: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.prefix || '' : contactSearchCustomer?.selectedContact?.prefix || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">First Name</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    first_name: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    first_name: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.first_name || '' : contactSearchCustomer?.selectedContact?.first_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Middle Name</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    middle_name: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    middle_name: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.middle_name || '' : contactSearchCustomer?.selectedContact?.middle_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Last Name</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    last_name: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    last_name: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.last_name || '' : contactSearchCustomer?.selectedContact?.last_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Suffix</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    suffix: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    suffix: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.suffix || '' : contactSearchCustomer?.selectedContact?.suffix || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    {/* {
                                        ((props.owner || '') === 'driver' || (props.owner || '') === 'operator') &&
                                        <div className="field-container">
                                            <div className="field-title">Relationship</div>
                                            <input type="text" readOnly={!isEditingContact} style={{
                                                textTransform: 'capitalize'
                                            }}
                                                onInput={(e) => {
                                                    setTempSelectedContact({
                                                        ...tempSelectedContact,
                                                        relationship: e.target.value
                                                    });
                                                }}
                                                onChange={e => {
                                                    setTempSelectedContact({
                                                        ...tempSelectedContact,
                                                        relationship: e.target.value
                                                    });
                                                }}
                                                value={isEditingContact ? tempSelectedContact.relationship || '' : contactSearchCustomer?.selectedContact?.relationship || ''}
                                            />
                                            <div className={borderBottomClasses}></div>
                                        </div>
                                    } */}

                                    <div className="field-container">
                                        <div className="field-title">Company</div>
                                        <input type="text"
                                            readOnly={
                                                (props.owner !== 'driver' || props.owner !== 'operator')
                                                    ? isEditingContact
                                                        ? (tempSelectedContact?.type || 'internal') === 'internal'
                                                            ? true
                                                            : false
                                                        : true
                                                    : (props.owner !== 'driver' || props.owner !== 'operator')
                                            }
                                            style={{
                                                textTransform: 'capitalize'
                                            }}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    company: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    company: e.target.value
                                                });
                                            }}
                                            value={
                                                isEditingContact
                                                    ? tempSelectedContact?.company || ''
                                                    : (contactSearchCustomer?.selectedContact?.id || 0) > 0
                                                        ? contactSearchCustomer?.selectedContact?.company || ''
                                                        : ''


                                            } />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Title</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    title: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    title: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.title || '' : contactSearchCustomer?.selectedContact?.title || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Department</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    department: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    department: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.department || '' : contactSearchCustomer?.selectedContact?.department || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Work</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    email_work: e.target.value.toLowerCase()
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    email_work: e.target.value.toLowerCase()
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.email_work || '' : contactSearchCustomer?.selectedContact?.email_work || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Personal</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    email_personal: e.target.value.toLowerCase()
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    email_personal: e.target.value.toLowerCase()
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.email_personal || '' : contactSearchCustomer?.selectedContact?.email_personal || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">E-mail Other</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    email_other: e.target.value.toLowerCase()
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    email_other: e.target.value.toLowerCase()
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.email_other || '' : contactSearchCustomer?.selectedContact?.email_other || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Work</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    phone_work: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    phone_work: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.phone_work || '' : contactSearchCustomer?.selectedContact?.phone_work || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Ext</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    phone_ext: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    phone_ext: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.phone_ext || '' : contactSearchCustomer?.selectedContact?.phone_ext || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Work Fax</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    phone_work_fax: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    phone_work_fax: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.phone_work_fax || '' : contactSearchCustomer?.selectedContact?.phone_work_fax || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Mobile</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    phone_mobile: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    phone_mobile: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.phone_mobile || '' : contactSearchCustomer?.selectedContact?.phone_mobile || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Direct</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    phone_direct: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    phone_direct: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.phone_direct || '' : contactSearchCustomer?.selectedContact?.phone_direct || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Phone Other</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    phone_other: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    phone_other: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.phone_other || '' : contactSearchCustomer?.selectedContact?.phone_other || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Country</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    country: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    country: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.country || '' : contactSearchCustomer?.selectedContact?.country || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Address 1</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    address1: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    address1: e.target.value
                                                });
                                            }}
                                            value={
                                                isEditingContact
                                                    ? tempSelectedContact.address1 || ''
                                                    : (contactSearchCustomer?.selectedContact?.id || 0) > 0
                                                        ? contactSearchCustomer?.selectedContact?.address1 || ''
                                                        : ''
                                            }
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Address 2</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    address2: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    address2: e.target.value
                                                });
                                            }}
                                            value={
                                                isEditingContact
                                                    ? tempSelectedContact.address2 || ''
                                                    : (contactSearchCustomer?.selectedContact?.id || 0) > 0
                                                        ? contactSearchCustomer?.selectedContact?.address2 || ''
                                                        : ''
                                            }
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">City</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    city: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    city: e.target.value
                                                });
                                            }}
                                            value={
                                                isEditingContact
                                                    ? tempSelectedContact.city || ''
                                                    : (contactSearchCustomer?.selectedContact?.id || 0) > 0
                                                        ? contactSearchCustomer?.selectedContact?.city || ''
                                                        : ''
                                            }
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">State</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            style={{ textTransform: 'uppercase' }} maxLength={2}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    state: e.target.value.toUpperCase()
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    state: e.target.value.toUpperCase()
                                                });
                                            }}
                                            value={
                                                isEditingContact
                                                    ? tempSelectedContact.state || ''
                                                    : (contactSearchCustomer?.selectedContact?.id || 0) > 0
                                                        ? contactSearchCustomer?.selectedContact?.state || ''
                                                        : ''
                                            }
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Postal Code</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    zip_code: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    zip_code: e.target.value
                                                });
                                            }}
                                            value={
                                                isEditingContact
                                                    ? tempSelectedContact.zip_code || ''
                                                    : (contactSearchCustomer?.selectedContact?.id || 0) > 0
                                                        ? contactSearchCustomer?.selectedContact?.zip_code || ''
                                                        : ''
                                            }
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Birthday</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    birthday: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    birthday: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.birthday || '' : contactSearchCustomer?.selectedContact?.birthday || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Website</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    website: e.target.value.toLowerCase()
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    website: e.target.value.toLowerCase()
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.website || '' : contactSearchCustomer?.selectedContact?.website || ''}
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
                                            onInput={(e) => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    notes: e.target.value
                                                });
                                            }}
                                            onChange={e => {
                                                setTempSelectedContact({
                                                    ...tempSelectedContact,
                                                    notes: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempSelectedContact.notes || '' : contactSearchCustomer?.selectedContact?.notes || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-contact-splitter">

                            </div>
                            {
                                (contactSearchCustomer?.selectedContact?.agent_id || 0) === 0 &&

                                <div className="col-contact-emails">
                                    <div className="col-title">E-mails</div>
                                </div>
                            }

                        </div>
                    </div>

                </div>

                <div className="footer">
                    <div className="left-buttons">
                        <div className={
                            ((props.user?.user_code?.is_admin || 0) === 0 &&
                                ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0)
                                ? 'mochi-button disabled' : 'mochi-button'
                        } onClick={() => {
                            switch (props.owner) {
                                case 'customer':
                                    setContactSearchCustomer({
                                        ...contactSearchCustomer,
                                        selectedContact: {
                                            id: 0,
                                            customer_id: contactSearchCustomer.id
                                        }
                                    });
                                    setTempSelectedContact({
                                        id: 0,
                                        customer_id: contactSearchCustomer.id,
                                        company: contactSearchCustomer?.name || '',
                                        address1: contactSearchCustomer?.address1 || '',
                                        address2: contactSearchCustomer?.address2 || '',
                                        city: contactSearchCustomer?.city || '',
                                        state: contactSearchCustomer?.state || '',
                                        zip_code: contactSearchCustomer?.zip || ''
                                    });
                                    break;

                                case 'carrier':
                                    setContactSearchCustomer({
                                        ...contactSearchCustomer,
                                        selectedContact: {
                                            id: 0,
                                            carrier_id: contactSearchCustomer.id
                                        }
                                    });
                                    setTempSelectedContact({
                                        id: 0,
                                        carrier_id: contactSearchCustomer.id,
                                        company: contactSearchCustomer?.name || '',
                                        address1: contactSearchCustomer?.address1 || '',
                                        address2: contactSearchCustomer?.address2 || '',
                                        city: contactSearchCustomer?.city || '',
                                        state: contactSearchCustomer?.state || '',
                                        zip_code: contactSearchCustomer?.zip || ''
                                    });
                                    break;

                                case 'factoring-company':
                                    setContactSearchCustomer({
                                        ...contactSearchCustomer,
                                        selectedContact: {
                                            id: 0,
                                            factoring_company_id: contactSearchCustomer.id
                                        }
                                    });
                                    setTempSelectedContact({
                                        id: 0,
                                        factoring_company_id: contactSearchCustomer.id,
                                        company: contactSearchCustomer?.name || '',
                                        address1: contactSearchCustomer?.address1 || '',
                                        address2: contactSearchCustomer?.address2 || '',
                                        city: contactSearchCustomer?.city || '',
                                        state: contactSearchCustomer?.state || '',
                                        zip_code: contactSearchCustomer?.zip || ''
                                    });
                                    break;
                                case 'division':
                                    setContactSearchCustomer({
                                        ...contactSearchCustomer,
                                        selectedContact: {
                                            id: 0,
                                            division_id: contactSearchCustomer.id
                                        }
                                    });
                                    setTempSelectedContact({
                                        id: 0,
                                        division_id: contactSearchCustomer.id,
                                        company: contactSearchCustomer?.name || '',
                                        address1: contactSearchCustomer?.address1 || '',
                                        address2: contactSearchCustomer?.address2 || '',
                                        city: contactSearchCustomer?.city || '',
                                        state: contactSearchCustomer?.state || '',
                                        zip_code: contactSearchCustomer?.zip || ''
                                    });
                                    break;
                                case 'employee':
                                    setContactSearchCustomer({
                                        ...contactSearchCustomer,
                                        selectedContact: {
                                            id: 0,
                                            employee_id: contactSearchCustomer.id
                                        }
                                    });
                                    setTempSelectedContact({
                                        id: 0,
                                        employee_id: contactSearchCustomer.id,
                                        company: contactSearchCustomer?.name || '',
                                        address1: contactSearchCustomer?.address1 || '',
                                        address2: contactSearchCustomer?.address2 || '',
                                        city: contactSearchCustomer?.city || '',
                                        state: contactSearchCustomer?.state || '',
                                        zip_code: contactSearchCustomer?.zip || ''
                                    });
                                    break;
                                case 'agent':
                                    setContactSearchCustomer({
                                        ...contactSearchCustomer,
                                        selectedContact: {
                                            id: 0,
                                            agent_id: contactSearchCustomer.id
                                        }
                                    });
                                    setTempSelectedContact({
                                        id: 0,
                                        agent_id: contactSearchCustomer.id,
                                        company: contactSearchCustomer?.name || '',
                                        address1: contactSearchCustomer?.address1 || '',
                                        address2: contactSearchCustomer?.address2 || '',
                                        city: contactSearchCustomer?.city || '',
                                        state: contactSearchCustomer?.state || '',
                                        zip_code: contactSearchCustomer?.zip || ''
                                    });
                                    break;
                                case 'driver':
                                    setContactSearchCustomer({
                                        ...contactSearchCustomer,
                                        selectedContact: {
                                            id: 0,
                                            driver_id: contactSearchCustomer.id
                                        }
                                    });
                                    setTempSelectedContact({
                                        id: 0,
                                        driver_id: contactSearchCustomer.id,
                                        company: contactSearchCustomer?.name || '',
                                        address1: contactSearchCustomer?.address1 || '',
                                        address2: contactSearchCustomer?.address2 || '',
                                        city: contactSearchCustomer?.city || '',
                                        state: contactSearchCustomer?.state || '',
                                        zip_code: contactSearchCustomer?.zip || ''
                                    });
                                    break;
                                case 'operator':
                                    setContactSearchCustomer({
                                        ...contactSearchCustomer,
                                        selectedContact: {
                                            id: 0,
                                            operator_id: contactSearchCustomer.id
                                        }
                                    });
                                    setTempSelectedContact({
                                        id: 0,
                                        operator_id: contactSearchCustomer.id,
                                        company: contactSearchCustomer?.name || '',
                                        address1: contactSearchCustomer?.address1 || '',
                                        address2: contactSearchCustomer?.address2 || '',
                                        city: contactSearchCustomer?.city || '',
                                        state: contactSearchCustomer?.state || '',
                                        zip_code: contactSearchCustomer?.zip || ''
                                    });
                                    break;
                                default:
                                    setContactSearchCustomer({
                                        ...contactSearchCustomer,
                                        selectedContact: {
                                            id: 0,
                                            customer_id: contactSearchCustomer.id
                                        }
                                    });
                                    setTempSelectedContact({
                                        id: 0,
                                        customer_id: contactSearchCustomer.id,
                                        company: contactSearchCustomer?.name || '',
                                        address1: contactSearchCustomer?.address1 || '',
                                        address2: contactSearchCustomer?.address2 || '',
                                        city: contactSearchCustomer?.city || '',
                                        state: contactSearchCustomer?.state || '',
                                        zip_code: contactSearchCustomer?.zip || ''
                                    });
                                    break;
                            }

                            setIsEditingContact(true);
                            refPrefix.current.focus();
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">
                                Add Contact
                            </div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                    </div>


                </div>
            </div>

            {
                newPasswordTransition((style, item) => item && (
                    <animated.div style={{ ...style }}>
                        <PassModal
                            title="New Password"
                            text={newPassword}
                            close={() => {
                                setNewPassword('')
                            }}
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
    setSelectedOperatorContact
})(Contacts)