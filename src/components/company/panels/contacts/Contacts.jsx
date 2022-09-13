import React, {useState, useRef, useEffect} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import axios from 'axios';
import Draggable from 'react-draggable';
import './Contacts.css';
import MaskedInput from 'react-text-mask';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faCaretDown,
    faCaretRight,
    faCalendarAlt,
    faCheck,
    faPencilAlt,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import {
    setCompanyOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
    setSelectedCustomer,
    setSelectedContact,
    setSelectedCarrier,
    setSelectedCarrierContact,
    setSelectedFactoringCompany,
    setSelectedFactoringCompanyContact
} from './../../../../actions';
import {Documents} from "../index";
import moment from "moment";
import {animated, useTransition} from "react-spring";

import {PassModal} from './../../../admin/panels/';


const Contacts = (props) => {
    const refPrefix = useRef();
    const refInputAvatar = useRef();
    const [tempSelectedContact, setTempSelectedContact] = useState({});
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [contactSearchCustomer, setContactSearchCustomer] = useState({});
    const [progressUploaded, setProgressUploaded] = useState(0);
    const [progressTotal, setProgressTotal] = useState(0);
    const [newPassword, setNewPassword] = useState('');

    var lastLetter = '';

    const borderBottomClasses = classnames({
        'field-border-bottom': true,
        'disabled': !isEditingContact
    });

    const newPasswordTransition = useTransition(newPassword !== '', {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
        reverse: newPassword !== '',
        config: {duration: 100}
    });

    useEffect(async () => {
        setContactSearchCustomer(props.contactSearchCustomer || {});

        setTempSelectedContact({...props.contactSearchCustomer.selectedContact});

        if (props.isEditingContact) {
            setIsEditingContact(true);
            refPrefix.current.focus({
                preventScroll: true
            });
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

        axios.post(props.serverUrl + props.savingContactUrl, tempSelectedContact).then(res => {
            if (res.data.result === 'OK') {
                if (props.owner === 'customer') {
                    props.setSelectedCustomer({...props.selectedCustomer, contacts: res.data.contacts});
                    props.setSelectedContact(res.data.contact);
                }

                if (props.owner === 'carrier') {
                    props.setSelectedCarrier({...props.selectedCarrier, contacts: res.data.contacts});
                    props.setSelectedCarrierContact(res.data.contact);
                }

                if (props.owner === 'factoring-company') {
                    props.setSelectedFactoringCompany({...props.selectedFactoringCompany, contacts: res.data.contacts});
                    props.setSelectedFactoringCompanyContact(res.data.contact);
                }

                if (props.owner === 'division') {
                    props.setSelectedDivision({...props.selectedDivision, contacts: res.data.contacts});
                    props.setSelectedDivisionContact(res.data.contact);
                }

                if (props.owner === 'employee') {
                    props.setSelectedEmployee({...props.selectedEmployee, contacts: res.data.contacts});
                    props.setSelectedEmployeeContact(res.data.contact);
                }

                if (props.owner === 'agent') {
                    props.setSelectedAgent({...props.selectedAgent, contacts: res.data.contacts});
                    props.setSelectedAgentContact(res.data.contact);
                }

                if (props.owner === 'owner-operator') {
                    props.setSelectedOwnerOperator({...props.selectedOwnerOperator, contacts: res.data.contacts});
                    props.setSelectedOwnerOperatorContact(res.data.contact);
                }

                setContactSearchCustomer({
                    ...contactSearchCustomer,
                    selectedContact: res.data.contact,
                    contacts: res.data.contacts
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
            axios.post(props.serverUrl + props.deletingContactUrl, contact).then(res => {
                if (res.data.result === 'OK') {
                    if (props.owner === 'customer') {
                        props.setSelectedCustomer({...props.selectedCustomer, contacts: res.data.contacts});
                        props.setSelectedContact({id: contact.id, deleted: true});
                    }

                    if (props.owner === 'carrier') {
                        props.setSelectedCarrier({...props.selectedCarrier, contacts: res.data.contacts});
                        props.setSelectedCarrierContact({id: contact.id, deleted: true});
                    }

                    if (props.owner === 'factoring-company') {
                        props.setSelectedFactoringCompany({
                            ...props.selectedFactoringCompany,
                            contacts: res.data.contacts
                        });
                        props.setSelectedFactoringCompanyContact({id: contact.id, deleted: true});
                    }

                    if (props.owner === 'division') {
                        props.setSelectedDivision({...props.selectedDivision, contacts: res.data.contacts});
                        props.setSelectedDivisionContact({id: contact.id, deleted: true});
                    }

                    if (props.owner === 'employee') {
                        props.setSelectedEmployee({...props.selectedEmployee, contacts: res.data.contacts});
                        props.setSelectedEmployeeContact({id: contact.id, deleted: true});
                    }

                    if (props.owner === 'agent') {
                        props.setSelectedAgent({...props.selectedAgent, contacts: res.data.contacts});
                        props.setSelectedAgentContact({id: contact.id, deleted: true});
                    }

                    if (props.owner === 'owner-operator') {
                        props.setSelectedOwnerOperator({...props.selectedOwnerOperator, contacts: res.data.contacts});
                        props.setSelectedOwnerOperatorContact({id: contact.id, deleted: true});
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
                    const {loaded, total} = progressEvent;

                    setProgressUploaded(isNaN(loaded) ? 0 : loaded);
                    setProgressTotal(isNaN(total) ? 0 : total);
                }
            }

            axios.post(props.serverUrl + props.uploadAvatarUrl, formData, options)
                .then(async res => {
                    if (res.data.result === "OK") {
                        if (props.owner === 'customer') {
                            props.setSelectedCustomer({...props.selectedCustomer, contacts: res.data.contacts});
                        }

                        if (props.owner === 'carrier') {
                            props.setSelectedCarrier({...props.selectedCarrier, contacts: res.data.contacts});
                        }

                        if (props.owner === 'factoring-company') {
                            props.setSelectedFactoringCompany({
                                ...props.selectedFactoringCompany,
                                contacts: res.data.contacts
                            });
                        }

                        if (props.owner === 'division') {
                            props.setSelectedDivision({...props.selectedDivision, contacts: res.data.contacts});
                        }

                        if (props.owner === 'employee') {
                            props.setSelectedEmployee({...props.selectedEmployee, contacts: res.data.contacts});
                        }

                        if (props.owner === 'agent') {
                            props.setSelectedAgent({...props.selectedAgent, contacts: res.data.contacts});
                        }

                        if (props.owner === 'owner-operator') {
                            props.setSelectedOwnerOperator({
                                ...props.selectedOwnerOperator,
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
                    props.setSelectedCustomer({...props.selectedCustomer, contacts: res.data.contacts});
                }

                if (props.owner === 'carrier') {
                    props.setSelectedCarrier({...props.selectedCarrier, contacts: res.data.contacts});
                }

                if (props.owner === 'factoring-company') {
                    props.setSelectedFactoringCompany({...props.selectedFactoringCompany, contacts: res.data.contacts});
                }

                if (props.owner === 'division') {
                    props.setSelectedDivision({...props.selectedDivision, contacts: res.data.contacts});
                }

                if (props.owner === 'employee') {
                    props.setSelectedEmployee({...props.selectedEmployee, contacts: res.data.contacts});
                }

                if (props.owner === 'agent') {
                    props.setSelectedAgent({...props.selectedAgent, contacts: res.data.contacts});
                }

                if (props.owner === 'owner-operator') {
                    props.setSelectedOwnerOperator({...props.selectedOwnerOperator, contacts: res.data.contacts});
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
            axios.post(props.serverUrl + '/resetAgentContactPassword', {id: (contactSearchCustomer?.selectedContact?.id || 0)}).then(res => {
                if (res.data.result === 'OK') {
                    setNewPassword(res.data.newpass);
                } else {
                    window.alert('An error occurred while getting a new password');
                }
            })
        }
    }
    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>

            <div className="contact-container" style={{overflow: 'initial'}}>
                <div className="contact-list-container">
                    <div className="title">{props.title}</div>
                    <div className="side-title" style={{left: '-45px'}}>
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

                                                <div className="row-contact" onClick={async () => {
                                                    await setContactSearchCustomer({
                                                        ...contactSearchCustomer,
                                                        selectedContact: contact
                                                    });
                                                    setIsEditingContact(false);
                                                }}>
                                                    <div className="contact-avatar-container">
                                                        <img
                                                            src={contact.avatar ? props.serverUrl + '/avatars/' + contact.avatar : 'img/avatar-user-default.png'}
                                                            alt=""/>
                                                    </div>

                                                    <div className="contact-data">
                                                        <div className="contact-name" style={{
                                                            display: 'flex', alignItems: 'center'
                                                        }}>
                                                            <div style={{flexGrow: 1}}>
                                                                {(contact.prefix || '') + " " + contact.first_name + " " + (contact.middle_name || '') + " " + contact.last_name}
                                                            </div>
                                                            {
                                                                (contact.is_primary === 1) &&
                                                                <div className="contact-list-col tcol pri">
                                                                    <FontAwesomeIcon icon={faCheck}/>
                                                                </div>
                                                            }</div>
                                                        <div className="online-status">
                                                            <div
                                                                className={contact.is_online === 1 ? 'is-online is-online-on' : 'is-online is-online-off'}></div>
                                                            {/*<div className="mochi-button" onClick={(e) => {*/}
                                                            {/*    e.stopPropagation()*/}
                                                            {/*}}>*/}
                                                            {/*    <div*/}
                                                            {/*        className="mochi-button-decorator mochi-button-decorator-left">(*/}
                                                            {/*    </div>*/}
                                                            {/*    <div className="mochi-button-base">Chat</div>*/}
                                                            {/*    <div*/}
                                                            {/*        className="mochi-button-decorator mochi-button-decorator-right">)*/}
                                                            {/*    </div>*/}
                                                            {/*</div>*/}
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
                                                        alt=""/>
                                                </div>

                                                <div className="contact-data">
                                                    <div
                                                        className="contact-name">{(contact.prefix || '') + " " + contact.first_name + " " + (contact.middle_name || '') + " " + contact.last_name}</div>
                                                    <div className="online-status">
                                                        <div
                                                            className={contact.is_online === 1 ? 'is-online is-online-on' : 'is-online is-online-off'}></div>
                                                        {/*<div className="mochi-button" onClick={(e) => {*/}
                                                        {/*    e.stopPropagation()*/}
                                                        {/*}}>*/}
                                                        {/*    <div*/}
                                                        {/*        className="mochi-button-decorator mochi-button-decorator-left">(*/}
                                                        {/*    </div>*/}
                                                        {/*    <div className="mochi-button-base">Chat</div>*/}
                                                        {/*    <div*/}
                                                        {/*        className="mochi-button-decorator mochi-button-decorator-right">)*/}
                                                        {/*    </div>*/}
                                                        {/*</div>*/}
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
                    <div className="contact-form">
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

                                <form encType='multipart/form-data' style={{display: 'none'}}>
                                    <input type="file" ref={refInputAvatar} accept='image/*'
                                           onChange={contactAvatarChange}/>
                                </form>

                                <div className="contact-avatar-wrapper">
                                    <img
                                        src={contactSearchCustomer?.selectedContact?.avatar ? props.serverUrl + '/avatars/' + contactSearchCustomer?.selectedContact?.avatar : 'img/avatar-user-default.png'}
                                        alt=""/>
                                </div>

                            </div>
                            <div className="contact-info">
                                <div className="contact-name">
                                    {(contactSearchCustomer?.selectedContact?.prefix || '') + " " + (contactSearchCustomer?.selectedContact?.first_name || '') + " " + (contactSearchCustomer?.selectedContact?.middle_name || '') + " " + (contactSearchCustomer?.selectedContact?.last_name || '')}
                                </div>
                                <div className="contact-company">
                                    <span>
                                        {contactSearchCustomer?.selectedContact?.id !== undefined ? contactSearchCustomer.name : ''}
                                    </span>

                                    <span>
                                        {(contactSearchCustomer?.selectedContact?.title || '')}
                                    </span>

                                    <span>
                                        {(contactSearchCustomer?.selectedContact?.department || '')}
                                    </span>
                                </div>
                                {/*<div className="contact-username-info">*/}
                                {/*    <div className="contact-username">@username</div>*/}
                                {/*    <div className="mochi-button" onClick={(e) => {*/}
                                {/*        e.stopPropagation()*/}
                                {/*    }}>*/}
                                {/*        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>*/}
                                {/*        <div className="mochi-button-base">Chat</div>*/}
                                {/*        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                            <div className="contact-buttons">
                                <div className="input-toggle-container">
                                    <input type="checkbox" id="cbox-panel-customer-contacts-primary-btn"
                                           onChange={e => {
                                               setTempSelectedContact({
                                                   ...tempSelectedContact,
                                                   is_primary: e.target.checked ? 1 : 0
                                               })
                                           }}
                                           disabled={!isEditingContact}
                                           checked={isEditingContact ? (tempSelectedContact.is_primary || 0) === 1 : (contactSearchCustomer?.selectedContact?.is_primary || 0) === 1}/>
                                    <label htmlFor="cbox-panel-customer-contacts-primary-btn">
                                        <div className="label-text">Primary</div>
                                        <div className="input-toggle-btn"></div>
                                    </label>
                                </div>

                                <div className="right-buttons" style={{display: 'flex'}}>
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
                                            setTempSelectedContact({...contactSearchCustomer?.selectedContact});
                                        }} style={{
                                            color: contactSearchCustomer?.selectedContact?.id !== undefined ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.5)',
                                            pointerEvents: contactSearchCustomer?.selectedContact?.id !== undefined ? 'all' : 'none'
                                        }}>
                                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                            <div className="mochi-button-base">Edit</div>
                                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                        </div>
                                    }

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
                                             style={{color: (contactSearchCustomer?.selectedContact?.id !== undefined && contactSearchCustomer?.selectedContact?.id > 0) ? 'rgba(138,8,8,1)' : 'rgba(138,8,8,0.5)'}}>Delete
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
                                    <div className="mochi-button" style={{margin: '5px 0'}} onClick={() => {

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
                                        <input ref={refPrefix} type="text" readOnly={!isEditingContact}
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
                                        <input type="text" readOnly={!isEditingContact}
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
                                        <input type="text" readOnly={!isEditingContact}
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
                                        <input type="text" readOnly={!isEditingContact}
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
                                        <input type="text" readOnly={!isEditingContact}
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

                                    <div className="field-container">
                                        <div className="field-title">Company</div>
                                        <input type="text" readOnly={!isEditingContact}
                                               onInput={(e) => {
                                               }}
                                               onChange={e => {
                                               }}
                                               value={contactSearchCustomer?.selectedContact?.id !== undefined ? contactSearchCustomer.name : ''}/>
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Title</div>
                                        <input type="text" readOnly={!isEditingContact}
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
                                        <input type="text" readOnly={!isEditingContact}
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
                                        <input type="text" readOnly={!isEditingContact}
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
                                        <input type="text" readOnly={!isEditingContact}
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
                                               value={isEditingContact ? tempSelectedContact.address1 || '' : contactSearchCustomer?.selectedContact?.address1 || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Address 2</div>
                                        <input type="text" readOnly={!isEditingContact}
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
                                               value={isEditingContact ? tempSelectedContact.address2 || '' : contactSearchCustomer?.selectedContact?.address2 || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">City</div>
                                        <input type="text" readOnly={!isEditingContact}
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
                                               value={isEditingContact ? tempSelectedContact.city || '' : contactSearchCustomer?.selectedContact?.city || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">State</div>
                                        <input type="text" readOnly={!isEditingContact}
                                               style={{textTransform: 'uppercase'}} maxLength={2}
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
                                               value={isEditingContact ? tempSelectedContact.state || '' : contactSearchCustomer?.selectedContact?.state || ''}
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
                                               value={isEditingContact ? tempSelectedContact.zip_code || '' : contactSearchCustomer?.selectedContact?.zip_code || ''}
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
                                                       website: e.target.value
                                                   });
                                               }}
                                               onChange={e => {
                                                   setTempSelectedContact({
                                                       ...tempSelectedContact,
                                                       website: e.target.value
                                                   });
                                               }}
                                               value={isEditingContact ? tempSelectedContact.website || '' : contactSearchCustomer?.selectedContact?.website || ''}
                                        />
                                        <div className={borderBottomClasses}></div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Notes</div>
                                        <input type="text" readOnly={!isEditingContact}
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
                                        address1: contactSearchCustomer?.address1 || '',
                                        address2: contactSearchCustomer?.address2 || '',
                                        city: contactSearchCustomer?.city || '',
                                        state: contactSearchCustomer?.state || '',
                                        zip_code: contactSearchCustomer?.zip || ''
                                    });
                                    break;
                                case 'owner-operator':
                                    setContactSearchCustomer({
                                        ...contactSearchCustomer,
                                        selectedContact: {
                                            id: 0,
                                            owner_operator_id: contactSearchCustomer.id
                                        }
                                    });
                                    setTempSelectedContact({
                                        id: 0,
                                        owner_operator_id: contactSearchCustomer.id,
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
                    <animated.div style={{...style}}>
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
        selectedCarrier: state.carrierReducers.selectedCarrier,
        selectedCarrierContact: state.carrierReducers.selectedContact,
        selectedFactoringCompany: state.carrierReducers.selectedFactoringCompany,
        selectedFactoringCompanyContact: state.carrierReducers.selectedFactoringCompanyContact,
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
    setSelectedCustomer,
    setSelectedContact,
    setSelectedCarrier,
    setSelectedCarrierContact,
    setSelectedFactoringCompany,
    setSelectedFactoringCompanyContact
})(Contacts)