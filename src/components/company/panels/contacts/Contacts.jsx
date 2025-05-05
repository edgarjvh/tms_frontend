/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import axios from 'axios';
import './Contacts.css';
import MaskedInput from 'react-text-mask';
import VCard from 'vcard-creator';
import FileSaver from 'file-saver';
import { parse } from 'vcf';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

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
} from './../../../../actions';

import { animated, useTransition } from "react-spring";

import { PassModal } from './../../../admin/panels/';

const Contacts = (props) => {
    const refContactsContainer = useRef();
    const refPrefix = useRef();
    const refInputAvatar = useRef();
    const [contactList, setContactList] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [tempContact, setTempContact] = useState(null);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [contactSearchCustomer, setContactSearchCustomer] = useState({});
    const [newPassword, setNewPassword] = useState('');
    const refImportContact = useRef();  // Import contact button
    const [isLoading, setIsLoading] = useState(false);

    var lastLetter = '';

    const borderBottomClasses = classnames({
        'field-border-bottom': true,
        'disabled': !isEditingContact
    });

    const loadingTransition = useTransition(isLoading, {
        from: { opacity: 0, display: 'block' },
        enter: { opacity: 1, display: 'block' },
        leave: { opacity: 0, display: 'none' },
        reverse: isLoading,
    });

    const newPasswordTransition = useTransition(newPassword !== '', {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: newPassword !== '',
        config: { duration: 100 }
    });

    useEffect(() => {
        setIsLoading(true);

        axios.post(props.serverUrl + props.getContactsUrl, {
            owner_id: props.selectedOwner.id
        }).then(res => {
            if (res.data.result === 'OK') {
                setContactList(res.data.contacts);

                if (props.isEditingContact) { // if we are editing a contact
                    if (props.selectedContactId) { // if we have a contact id
                        let contact = res.data.contacts.find(x => x.id === props.selectedContactId);
                        setSelectedContact({
                            ...contact,
                            company: contact?.company || props.selectedOwner?.name || '',
                            address1: contact?.address1 || props.selectedOwner?.address1 || '',
                            address2: contact?.address2 || props.selectedOwner?.address2 || '',
                            city: contact?.city || props.selectedOwner?.city || '',
                            state: contact?.state || props.selectedOwner?.state || '',
                            zip_code: contact?.zip_code || props.selectedOwner?.zip_code || ''
                        })

                        setTempContact({
                            ...contact,
                            company: contact?.company || props.selectedOwner?.name || '',
                            address1: contact?.address1 || props.selectedOwner?.address1 || '',
                            address2: contact?.address2 || props.selectedOwner?.address2 || '',
                            city: contact?.city || props.selectedOwner?.city || '',
                            state: contact?.state || props.selectedOwner?.state || '',
                            zip_code: contact?.zip_code || props.selectedOwner?.zip_code || ''
                        });
                    } else { // if we don't have a contact id, we create a new contact
                        setTempContact({
                            company: props.selectedOwner?.name || '',
                            address1: props.selectedOwner?.address1 || '',
                            address2: props.selectedOwner?.address2 || '',
                            city: props.selectedOwner?.city || '',
                            state: props.selectedOwner?.state || '',
                            zip_code: props.selectedOwner?.zip_code || ''
                        })
                    }
                } else { // if we are not editing a contact
                    if (props.selectedContactId) { // if we have a contact id
                        let contact = res.data.contacts.find(x => x.id === props.selectedContactId);
                        setSelectedContact({
                            ...contact,
                            company: contact?.company || props.selectedOwner?.name || '',
                            address1: contact?.address1 || props.selectedOwner?.address1 || '',
                            address2: contact?.address2 || props.selectedOwner?.address2 || '',
                            city: contact?.city || props.selectedOwner?.city || '',
                            state: contact?.state || props.selectedOwner?.state || '',
                            zip_code: contact?.zip_code || props.selectedOwner?.zip_code || ''
                        })
                    }
                }


            }
        }).catch(e => {
            console.log('error getting contacts', e);
        }).finally(() => {
            setIsLoading(false);

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
        });
    }, [])

    const saveContact = (data) => {
        if ((data.first_name || '').trim() === '') {
            window.alert('You must enter the first name!');
            return;
        }

        if ((data.phone_work || '').trim() === '' &&
            (data.phone_work_fax || '').trim() === '' &&
            (data.phone_mobile || '').trim() === '' &&
            (data.phone_direct || '').trim() === '' &&
            (data.phone_other || '').trim() === '') {
            window.alert('You must enter at least one phone number!');
            return;
        }

        switch (data.primary_phone) {
            case 'work':
                if ((data.phone_work || '').trim() === '') {
                    data.primary_phone = (data.phone_work_fax || '').trim() !== ''
                        ? 'fax'
                        : (data.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (data.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (data.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'fax':
                if ((data.phone_work_fax || '').trim() === '') {
                    data.primary_phone = (data.phone_work || '').trim() !== ''
                        ? 'work'
                        : (data.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (data.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (data.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'mobile':
                if ((data.phone_mobile || '').trim() === '') {
                    data.primary_phone = (data.phone_work || '').trim() !== ''
                        ? 'work'
                        : (data.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (data.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (data.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'direct':
                if ((data.phone_direct || '').trim() === '') {
                    data.primary_phone = (data.phone_work || '').trim() !== ''
                        ? 'work'
                        : (data.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (data.phone_mobile || '').trim() !== ''
                                ? 'mobile'
                                : (data.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                }
                break;
            case 'other':
                if ((data.phone_other || '').trim() === '') {
                    data.primary_phone = (data.phone_work || '').trim() !== ''
                        ? 'work'
                        : (data.phone_work_fax || '').trim() !== ''
                            ? 'fax'
                            : (data.phone_mobile || '').trim() !== ''
                                ? 'mobile'
                                : (data.phone_direct || '').trim() !== ''
                                    ? 'direct'
                                    : 'work'
                }
                break;
            default:
                data.primary_phone = (data.phone_work || '').trim() !== ''
                    ? 'work'
                    : (data.phone_work_fax || '').trim() !== ''
                        ? 'fax'
                        : (data.phone_mobile || '').trim() !== ''
                            ? 'mobile'
                            : (data.phone_direct || '').trim() !== ''
                                ? 'direct'
                                : (data.phone_other || '').trim() !== ''
                                    ? 'other'
                                    : 'work'
                break;
        }

        switch (data.primary_email) {
            case 'work':
                if ((data.email_work || '').trim() === '') {
                    data.primary_email = (data.email_personal || '').trim() !== ''
                        ? 'personal'
                        : (data.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                }
                break;
            case 'personal':
                if ((data.email_personal || '').trim() === '') {
                    data.primary_email = (data.email_work || '').trim() !== ''
                        ? 'work'
                        : (data.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                }
                break;
            case 'other':
                if ((data.email_other || '').trim() === '') {
                    data.primary_email = (data.email_work || '').trim() !== ''
                        ? 'work'
                        : (data.email_personal || '').trim() !== ''
                            ? 'personal'
                            : 'work'
                }
                break;
            default:
                data.primary_email = (data.email_work || '').trim() !== ''
                    ? 'work'
                    : (data.email_personal || '').trim() !== ''
                        ? 'personal'
                        : (data.email_other || '').trim() !== ''
                            ? 'other'
                            : 'work'
                break;
        }

        if ((data.address1 || '').trim() === '' && (data.address2 || '').trim() === '') {
            data.address1 = props.selectedOwner.address1;
            data.address2 = props.selectedOwner.address2;
            data.city = props.selectedOwner.city;
            data.state = props.selectedOwner.state;
            data.zip_code = props.selectedOwner.zip;
        }

        if ((data?.company || '').trim() === '') {
            data.company = props.selectedOwner?.name || '';
        }

        axios.post(props.serverUrl + props.savingContactUrl, { ...data, owner_id: props.selectedOwner.id }).then(res => {
            if (res.data.result === 'OK') {
                let contacts = [...res.data.contacts];
                let contact = contacts.find(x => x.id === res.data.contact.id);

                setContactList(contacts);
                setSelectedContact(contact);

                props.savingCallback(contact, contacts)

                setIsEditingContact(false);
            }
        }).catch(e => {
            console.log('error saving contact', e);
        });
    }

    const deleteContact = () => {
        let contact = selectedContact;

        if (window.confirm('Are you sure to delete this contact?')) {
            axios.post(props.serverUrl + props.deletingContactUrl, { id: contact.id, owner_id: props.selectedOwner.id }).then(res => {
                if (res.data.result === 'OK') {
                    let contacts = [...res.data.contacts];

                    setContactList(contacts);
                    setSelectedContact(null);
                    setTempContact(null);

                    props.deletingCallback(contact.id, contacts)

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
            formData.append("owner_id", props.selectedOwner.id);

            // const options = {
            //     onUploadProgress: (progressEvent) => {
            //         const { loaded, total } = progressEvent;

            //         setProgressUploaded(isNaN(loaded) ? 0 : loaded);
            //         setProgressTotal(isNaN(total) ? 0 : total);
            //     }
            // }

            axios.post(props.serverUrl + props.uploadAvatarUrl, formData).then(res => {
                if (res.data.result === "OK") {
                    let contacts = [...res.data.contacts];
                    let contact = { ...res.data.contact };

                    setContactList(contacts);
                    setSelectedContact(prev => {
                        return {
                            ...prev,
                            avatar: contact.avatar
                        }
                    });
                    setTempContact(prev => {
                        return {
                            ...prev,
                            avatar: contact.avatar
                        }
                    })
                }
            }).catch((err) => {
                console.log("error changing contact avatar", err);
            }).finally(() => {
                refInputAvatar.current.value = "";
                refPrefix.current.focus({ preventScroll: true });
            });
        }
    }

    const removeContactAvatar = (e) => {
        axios.post(props.serverUrl + props.removeAvatarUrl, { id: selectedContact.id, owner_id: props.selectedOwner.id }).then(res => {
            if (res.data.result === "OK") {
                let contacts = [...res.data.contacts];

                setContactList(contacts);
                setSelectedContact(prev => {
                    return {
                        ...prev,
                        avatar: null
                    }
                });
                setTempContact(prev => {
                    return {
                        ...prev,
                        avatar: null
                    }
                }).finally(() => {
                    refInputAvatar.current.value = "";
                    refPrefix.current.focus({ preventScroll: true });
                });;
            }
        }).catch(e => {
            console.log('error removig contact avatar', e);
        });
    }

    const setContactPassword = () => {
        if (window.confirm('Are you sure you want to proceed?')) {
            axios.post(props.serverUrl + '/resetAgentContactPassword', { id: selectedContact?.id }).then(res => {
                if (res.data.result === 'OK') {
                    setNewPassword(res.data.newpass);
                } else {
                    window.alert('An error occurred while getting a new password');
                }
            })
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

    const addToPersonalContacts = () => {
        axios.post(props.serverUrl + '/addToUserContact', {
            id: selectedContact?.id,
            user_code_id: props.user.user_code.id
        }).then(res => {
            if (res.data.result === 'OK') {

                setContactList(prev => prev.map(contact => {
                    if (contact.id === selectedContact?.id) {
                        contact.user_code_id = props.user.user_code.id
                    }

                    return contact;
                }));

                setSelectedContact(prev => {
                    return {
                        ...prev,
                        user_code_id: props.user.user_code.id
                    }
                })

                props.setUserContacts({
                    componentId: props.componentId,
                    contacts: res.data.contacts
                })
            }
        }).catch(e => {
            console.log('error adding to personal contacts', e);
        }).finally(() => {
            saveContact(selectedContact);
        });
    }

    const removeFromPersonalContacts = () => {
        axios.post(props.serverUrl + '/removeFromUserContact', {
            id: selectedContact?.id,
            user_code_id: props.user.user_code.id
        }).then(res => {
            if (res.data.result === 'OK') {
                setContactList(prev => prev.map(contact => {
                    if (contact.id === selectedContact?.id) {
                        contact.user_code_id = null
                    }

                    return contact;
                }));

                props.setUserContacts({
                    componentId: props.componentId,
                    contacts: res.data.contacts
                })
            }
        }).catch(e => {
            console.log('error removing from personal contacts', e);
        });
    }

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

            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={{ ...style, zIndex: 3 }}>
                        <div className="loading-container-wrapper">
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
                        </div>
                    </animated.div>
                )
            }

            <div className="contact-container" tabIndex="0" style={{ overflow: 'initial' }}>



                <div className={listClasses}>
                    <div className="title">{props.title}</div>
                    <div className="side-title" style={{ left: '-45px' }}>
                        <div>{props.title}</div>
                    </div>

                    <div className="contact-list">
                        <div className="contact-list-wrapper">
                            {
                                (contactList || []).map((contact, index) => {
                                    let curLetter = contact.first_name.substring(0, 1).toLowerCase();
                                    if (curLetter !== lastLetter) {
                                        lastLetter = curLetter;
                                        return (
                                            <div key={index}>
                                                <div className="letter-header">{curLetter}</div>

                                                <div className="row-contact" style={{
                                                    transition: 'ease-in-out 0.3s',
                                                    borderLeft: (selectedContact?.id || 0) === contact.id ? '3px solid #2D0DFF' : '3px solid transparent'
                                                }} onClick={() => {
                                                    setTempContact(null);
                                                    setSelectedContact({
                                                        ...contact,
                                                        company: (contact?.company || '') === ''
                                                            ? props.selectedOwner?.name || ''
                                                            : contact?.company || '',
                                                        address1: (contact?.address1 || '') === ''
                                                            ? props.selectedOwner?.address1 || ''
                                                            : contact?.address1 || '',
                                                        address2: (contact?.address2 || '') === ''
                                                            ? props.selectedOwner?.address2 || ''
                                                            : contact?.address2 || '',
                                                        city: (contact?.city || '') === ''
                                                            ? props.selectedOwner?.city || ''
                                                            : contact?.city || '',
                                                        state: (contact?.state || '') === ''
                                                            ? props.selectedOwner?.state || ''
                                                            : contact?.state || '',
                                                        zip_code: (contact?.zip_code || '') === ''
                                                            ? props.selectedOwner?.zip || ''
                                                            : contact?.zip_code || ''
                                                    });

                                                    setIsEditingContact(false);
                                                }}>
                                                    <div className="contact-avatar-container">
                                                        <img src={contact.avatar ? props.serverUrl + '/avatars/' + contact.avatar : 'img/avatar-user-default.png'} alt="" />
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
                                                            <div className={contact.is_online === 1 ? 'is-online is-online-on' : 'is-online is-online-off'}></div>                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index} className="row-contact" style={{
                                                transition: 'ease-in-out 0.3s',
                                                borderLeft: (selectedContact?.id || 0) === contact.id ? '3px solid #2D0DFF' : '3px solid transparent'
                                            }} onClick={() => {
                                                setSelectedContact({
                                                    ...contact,
                                                    company: (contact?.company || '') === ''
                                                        ? props.selectedOwner?.name || ''
                                                        : contact?.company || '',
                                                    address1: (contact?.address1 || '') === ''
                                                        ? props.selectedOwner?.address1 || ''
                                                        : contact?.address1 || '',
                                                    address2: (contact?.address2 || '') === ''
                                                        ? props.selectedOwner?.address2 || ''
                                                        : contact?.address2 || '',
                                                    city: (contact?.city || '') === ''
                                                        ? props.selectedOwner?.city || ''
                                                        : contact?.city || '',
                                                    state: (contact?.state || '') === ''
                                                        ? props.selectedOwner?.state || ''
                                                        : contact?.state || '',
                                                    zip_code: (contact?.zip_code || '') === ''
                                                        ? props.selectedOwner?.zip || ''
                                                        : contact?.zip_code || ''
                                                });
                                                setIsEditingContact(false);
                                            }}>
                                                <div className="contact-avatar-container">
                                                        <img src={contact.avatar ? props.serverUrl + '/avatars/' + contact.avatar : 'img/avatar-user-default.png'} alt="" />
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
                                                            <div className={contact.is_online === 1 ? 'is-online is-online-on' : 'is-online is-online-off'}></div>                                                            
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
                                    <span>
                                        {
                                            isEditingContact
                                                ? (tempContact?.company || '') === ''
                                                    ? (tempContact?.type || 'internal') === 'internal'
                                                        ? tempContact?.owner_name || ''
                                                        : ''
                                                    : tempContact?.company || ''
                                                : (selectedContact?.company || '') === ''
                                                    ? (selectedContact?.type || 'internal') === 'internal'
                                                        ? selectedContact?.owner_name || ''
                                                        : ''
                                                    : selectedContact?.company || ''
                                        }
                                    </span>

                                    <span>
                                        {
                                            isEditingContact
                                                ? (tempContact?.title || '')
                                                : (selectedContact?.title || '')
                                        }
                                    </span>

                                    <span>
                                        {
                                            isEditingContact
                                                ? (tempContact?.department || '')
                                                : (selectedContact?.department || '')
                                        }
                                    </span>
                                </div>

                                {/* {
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
                                } */}
                            </div>
                            <div className="contact-buttons">
                                {
                                    ((props.owner || '') === 'driver' || (props.owner || '') === 'operator') &&
                                    <div className="input-box-container" style={{ width: '7rem', marginBottom: 10 }}>
                                        <input type="number" placeholder='Priority' min={1} max={10} readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onInput={(e) => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        priority: e.target.value
                                                    }
                                                })
                                            }}
                                            onChange={e => {
                                                setTempContact(prev => {
                                                    return {
                                                        ...prev,
                                                        priority: e.target.value
                                                    }
                                                })
                                            }}
                                            value={isEditingContact ? tempContact.priority || '' : selectedContact?.priority || ''}
                                        />
                                    </div>
                                }
                                {
                                    ((props.owner || '') !== 'driver' && (props.owner || '') !== 'operator') &&
                                    <div className="input-toggle-container">
                                        <input type="checkbox" id="cbox-panel-customer-contacts-primary-btn"
                                            onChange={e => {
                                                if ((tempContact.is_pivot || 0) > 0) {
                                                    setTempContact(prev => {
                                                        return {
                                                            ...prev,
                                                            pivot: {
                                                                ...tempContact?.pivot || {},
                                                                is_primary: e.target.checked ? 1 : 0
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    setTempContact(prev => {
                                                        return {
                                                            ...prev,
                                                            is_primary: e.target.checked ? 1 : 0
                                                        }
                                                    })
                                                }
                                            }}
                                            disabled={!isEditingContact}
                                            checked={isEditingContact
                                                ? tempContact?.pivot
                                                    ? (tempContact?.pivot.is_primary || 0) === 1
                                                    : (tempContact?.is_primary || 0) === 1
                                                : selectedContact?.pivot
                                                    ? (selectedContact?.pivot?.is_primary || 0) === 1
                                                    : (selectedContact?.is_primary || 0) === 1

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
                                            }}
                                            disabled={!isEditingContact}
                                            checked={isEditingContact
                                                ? tempContact?.type === 'internal'
                                                : selectedContact?.type === 'internal'
                                            } />
                                        <label htmlFor="cbox-panel-customer-contacts-type-btn" style={{
                                            backgroundColor: isEditingContact
                                                ? (tempContact?.type || 'internal') === 'internal' ? '#ffb80d' : '#0D96FF'
                                                : (selectedContact?.type || 'internal') === 'internal' ? '#ffb80d' : '#0D96FF'
                                        }}>
                                            <div className="label-text" style={{
                                                textTransform: 'capitalize'
                                            }}>{isEditingContact ? (tempContact?.type || 'internal') : (selectedContact?.type || 'internal')}</div>
                                            <div className="input-toggle-btn"></div>
                                        </label>
                                    </div>
                                }

                                <div className="right-buttons" style={{ display: 'flex' }}>
                                    {
                                        isEditingContact &&
                                        <div className="mochi-button" onClick={() => {
                                            setIsEditingContact(false);
                                            setTempContact({});
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
                                            setTempContact({ ...selectedContact });
                                            refPrefix.current.focus();
                                        }} style={{
                                            color: selectedContact?.id !== undefined ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.5)',
                                            pointerEvents: selectedContact?.id !== undefined ? 'all' : 'none'
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
                                        pointerEvents: 'all',
                                        cursor: 'pointer'
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
                                        pointerEvents: ((selectedContact?.id !== undefined && selectedContact?.id > 0) &&
                                            ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 1))
                                            ? 'all' : 'none',
                                        cursor: ((selectedContact?.id !== undefined && selectedContact?.id > 0) &&
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
                                        pointerEvents: ((selectedContact?.id !== undefined && selectedContact?.id > 0) &&
                                            ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.delete || 0) === 1))
                                            ? 'all' : 'none',
                                        cursor: ((selectedContact?.id !== undefined && selectedContact?.id > 0) &&
                                            ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.delete || 0) === 1))
                                            ? 'pointer' : 'not-allowed'
                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base"
                                            style={{ color: (selectedContact?.id !== undefined && selectedContact?.id > 0) ? 'rgba(138,8,8,1)' : 'rgba(138,8,8,0.5)' }}>Delete
                                        </div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>

                                    {
                                        ((selectedContact?.agent_id || 0) > 0) &&
                                        <div className="mochi-button" onClick={setContactPassword} style={{
                                            marginLeft: '0.2rem',
                                            pointerEvents: (selectedContact?.id !== undefined && selectedContact?.id > 0) ? 'all' : 'none'
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base" style={{
                                                color: (selectedContact?.id !== undefined && selectedContact?.id > 0) ? 'rgba(138,8,8,1)' : 'rgba(138,8,8,0.5)'
                                            }}>New Password
                                            </div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }
                                </div>

                                {
                                    ((selectedContact?.agent_id || 0) > 0) &&
                                    <div className="mochi-button" style={{ margin: '5px 0' }} onClick={() => {

                                    }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Permissions</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }

                                {
                                    ((selectedContact?.id || 0) > 0 &&
                                        (selectedContact?.user_code_id || 0) > 0) &&
                                    <div className="mochi-button" style={{ margin: '5px 0' }} onClick={() => { removeFromPersonalContacts(); }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Remove from Personal Contacts</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }

                                {
                                    ((selectedContact?.id || 0) > 0 &&
                                        (selectedContact?.user_code_id || 0) === 0) &&
                                    <div className="mochi-button" style={{ margin: '5px 0' }} onClick={() => { addToPersonalContacts(); }}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">Add to Personal Contacts</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="contact-form-fields">
                            <div className="col-contact-form">
                                <div className="contact-form-wrapper">
                                    <div className="field-container"> {/* PREFIX */}
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
                                                })
                                            }}
                                            value={isEditingContact ? tempContact.prefix || '' : selectedContact?.prefix || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* FIRST NAME */}
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
                                                })
                                            }}
                                            value={isEditingContact ? tempContact.first_name || '' : selectedContact?.first_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* MIDDLE NAME */}
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
                                                })
                                            }}
                                            value={isEditingContact ? tempContact.middle_name || '' : selectedContact?.middle_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* LAST NAME */}
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
                                                })
                                            }}
                                            value={isEditingContact ? tempContact.last_name || '' : selectedContact?.last_name || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* SUFFIX */}
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
                                                })
                                            }}
                                            value={isEditingContact ? tempContact.suffix || '' : selectedContact?.suffix || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* COMPANY */}
                                        <div className="field-title">Company</div>
                                        <input type="text"
                                            readOnly={!isEditingContact}
                                            style={{
                                                textTransform: 'capitalize'
                                            }}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    company: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact?.company || '' : selectedContact?.company || ''} />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* JOB TITLE */}
                                        <div className="field-title">Title</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    title: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.title || '' : selectedContact?.title || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* DEPARTMENT */}
                                        <div className="field-title">Department</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    department: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.department || '' : selectedContact?.department || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* EMAIL WORK */}
                                        <div className="field-title">E-mail Work</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    email_work: e.target.value.toLowerCase()
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.email_work || '' : selectedContact?.email_work || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* EMAIL PERSONAL */}
                                        <div className="field-title">E-mail Personal</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    email_personal: e.target.value.toLowerCase()
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.email_personal || '' : selectedContact?.email_personal || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* EMAIL OTHER */}
                                        <div className="field-title">E-mail Other</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    email_other: e.target.value.toLowerCase()
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.email_other || '' : selectedContact?.email_other || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* PHONE WORK */}
                                        <div className="field-title">Phone Work</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    phone_work: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.phone_work || '' : selectedContact?.phone_work || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* PHONE EXT */}
                                        <div className="field-title">Ext</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    phone_ext: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.phone_ext || '' : selectedContact?.phone_ext || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* PHONE WORK FAX */}
                                        <div className="field-title">Phone Work Fax</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    phone_work_fax: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.phone_work_fax || '' : selectedContact?.phone_work_fax || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* PHONE MOBILE */}
                                        <div className="field-title">Phone Mobile</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    phone_mobile: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.phone_mobile || '' : selectedContact?.phone_mobile || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* PHONE DIRECT */}
                                        <div className="field-title">Phone Direct</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    phone_direct: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.phone_direct || '' : selectedContact?.phone_direct || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* PHONE OTHER */}
                                        <div className="field-title">Phone Other</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    phone_other: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.phone_other || '' : selectedContact?.phone_other || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* COUNTRY */}
                                        <div className="field-title">Country</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    country: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.country || '' : selectedContact?.country || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* ADDRESS 1 */}
                                        <div className="field-title">Address 1</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
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

                                    <div className="field-container"> {/* ADDRESS 2 */}
                                        <div className="field-title">Address 2</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
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

                                    <div className="field-container"> {/* CITY */}
                                        <div className="field-title">City</div>
                                        <input type="text" readOnly={!isEditingContact} style={{
                                            textTransform: 'capitalize'
                                        }}
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

                                    <div className="field-container"> {/* STATE */}
                                        <div className="field-title">State</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            style={{ textTransform: 'uppercase' }} maxLength={2}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    state: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.state || '' : selectedContact?.state || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* ZIP CODE */}
                                        <div className="field-title">Postal Code</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    zip_code: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.zip_code || '' : selectedContact?.zip_code || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* BIRTHDAY */}
                                        <div className="field-title">Birthday</div>
                                        <MaskedInput
                                            mask={[/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                            guide={true}
                                            type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    birthday: e.target.value
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.birthday || '' : selectedContact?.birthday || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* WEBSITE */}
                                        <div className="field-title">Website</div>
                                        <input type="text" readOnly={!isEditingContact}
                                            onChange={e => {
                                                setTempContact({
                                                    ...tempContact,
                                                    website: e.target.value.toLowerCase()
                                                });
                                            }}
                                            value={isEditingContact ? tempContact.website || '' : selectedContact?.website || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container"> {/* NOTES */}
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
                                                setTempContact({
                                                    ...tempContact,
                                                    notes: e.target.value
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
                        <div className={
                            ((props.user?.user_code?.is_admin || 0) === 0 &&
                                ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0)
                                ? 'mochi-button disabled' : 'mochi-button'
                        } onClick={() => {
                            setSelectedContact(null);
                            setTempContact({
                                company: props.selectedOwner?.name || '',
                                address1: props.selectedOwner?.address1 || '',
                                address2: props.selectedOwner?.address2 || '',
                                city: props.selectedOwner?.city || '',
                                state: props.selectedOwner?.state || '',
                                zip_code: props.selectedOwner?.zip || ''
                            });

                            setIsEditingContact(true);
                            refPrefix.current.focus();
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Add Contact</div>
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
})(Contacts)