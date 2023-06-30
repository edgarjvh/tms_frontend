import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './DriverMailingAddressForm.css';
import classnames from 'classnames';
import moment from 'moment';
import MaskedInput from 'react-text-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCheck, faPencilAlt, faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import axios from 'axios';
import { useTransition, animated } from 'react-spring';

function DriverMailingAddressForm(props) {
    const {
        refAddress1,
        refContactName,
        refContactNamePopupItems,
        refContactPhone,
        refContactPhonePopupItems,
        refContactEmail,
        refContactEmailPopupItems,
    } = props.refs;

    const [showMailingContactNames, setShowMailingContactNames] = useState(false);
    const [mailingContactNameItems, setMailingContactNameItems] = useState([]);
    const refContactNameDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowMailingContactNames(false)
        }
    });

    const [showMailingContactPhones, setShowMailingContactPhones] = useState(false);
    const [mailingContactPhoneItems, setMailingContactPhoneItems] = useState([]);
    const refContactPhoneDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowMailingContactPhones(false)
        }
    });
    const [showMailingContactEmails, setShowMailingContactEmails] = useState(false);
    const [mailingContactEmailItems, setMailingContactEmailItems] = useState([]);
    const refContactEmailDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowMailingContactEmails(false)
        }
    });

    const [showMailingContactEmailCopyBtn, setShowMailingContactEmailCopyBtn] = useState(false);

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

    useEffect(async () => {
        if ((props.selectedParent?.remit_to_address_is_the_same || 0) === 1) {
            if ((props.selectedParent?.mailing_contact_id || 0) > 0) {
                let contact = (props.selectedParent?.contacts || []).find(x => x.id === props.selectedParent?.mailing_contact_id);

                if (contact) {
                    let phones = [];
                    let emails = [];

                    (contact?.phone_work || '') !== '' && phones.push({
                        id: 1,
                        type: 'work',
                        phone: contact.phone_work,
                        ext: contact.phone_ext
                    });
                    (contact?.phone_work_fax || '') !== '' && phones.push({
                        id: 2,
                        type: 'fax',
                        phone: contact.phone_work_fax,
                        ext: ''
                    });
                    (contact?.phone_mobile || '') !== '' && phones.push({
                        id: 3,
                        type: 'mobile',
                        phone: contact.phone_mobile,
                        ext: ''
                    });
                    (contact?.phone_direct || '') !== '' && phones.push({
                        id: 4,
                        type: 'direct',
                        phone: contact.phone_direct,
                        ext: ''
                    });
                    (contact?.phone_other || '') !== '' && phones.push({
                        id: 5,
                        type: 'other',
                        phone: contact.phone_other,
                        ext: ''
                    });

                    (contact?.email_work || '') !== '' && emails.push({
                        id: 1,
                        type: 'work',
                        email: contact.email_work
                    });
                    (contact?.email_personal || '') !== '' && emails.push({
                        id: 2,
                        type: 'personal',
                        email: contact.email_personal
                    });
                    (contact?.email_other || '') !== '' && emails.push({
                        id: 3,
                        type: 'other',
                        email: contact.email_other
                    });

                    await setMailingContactPhoneItems(phones);
                    await setMailingContactEmailItems(emails);
                }
            }
        }
    }, [props.selectedParent?.mailing_contact_id]);

    return (
        <div className="form-bordered-box">
            <div className="form-header">
                <div className="top-border top-border-left"></div>
                <div className="form-title">Mailing Address</div>
                <div className="top-border top-border-middle"></div>
                <div className="form-buttons">
                    <div className='mochi-button' onClick={props.remitToAddressBtn}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base" style={{
                            color: (props.selectedParent?.remit_to_address_is_the_same || 0) === 1 ? 'green' : 'black'
                        }}>Remit to address is the same</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                    <div className='mochi-button' onClick={props.clearBtn}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Clear</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                </div>
                <div className="top-border top-border-right"></div>
            </div>

            <div className="form-row">

                {/* // ========================================================= ADDRESS 1 ==================================================== */}

                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 1} type="text" placeholder="Address 1" style={{ textTransform: 'capitalize' }}
                        ref={refAddress1}
                        readOnly={(props.selectedParent?.remit_to_address_is_the_same || 0) === 1}
                        onChange={e => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    mailing_address: {
                                        ...(prev?.mailing_address || {}),
                                        address1: e.target.value
                                    }
                                }
                            })
                        }}
                        value={(props.selectedParent?.mailing_address?.address1 || '')} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">

                {/* // ========================================================= ADDRESS 2 ==================================================== */}

                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 2} type="text" placeholder="Address 2" style={{ textTransform: 'capitalize' }}
                        readOnly={(props.selectedParent?.remit_to_address_is_the_same || 0) === 1}
                        onChange={e => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    mailing_address: {
                                        ...(prev?.mailing_address || {}),
                                        address2: e.target.value
                                    }
                                }
                            })
                        }}
                        value={(props.selectedParent?.mailing_address?.address2 || '')} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">

                {/* // ========================================================= CITY ==================================================== */}

                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 3} type="text" placeholder="City"
                        readOnly={(props.selectedParent?.remit_to_address_is_the_same || 0) === 1}
                        style={{
                            textTransform: 'capitalize'
                        }}
                        onChange={e => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    mailing_address: {
                                        ...(prev?.mailing_address || {}),
                                        city: e.target.value
                                    }
                                }
                            })
                        }}
                        value={(props.selectedParent?.mailing_address?.city || '')} />
                </div>
                <div className="form-h-sep"></div>

                {/* // ========================================================= STATE ==================================================== */}

                <div className="input-box-container input-state">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 4} type="text" placeholder="State" maxLength="2"
                        readOnly={(props.selectedParent?.remit_to_address_is_the_same || 0) === 1}
                        onChange={e => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    mailing_address: {
                                        ...(prev?.mailing_address || {}),
                                        state: e.target.value
                                    }
                                }
                            })
                        }}
                        value={(props.selectedParent?.mailing_address?.state || '')} />
                </div>
                <div className="form-h-sep"></div>

                {/* // ========================================================= ZIP ==================================================== */}

                <div className="input-box-container input-zip-code">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 5} type="text" placeholder="Postal Code"
                        readOnly={(props.selectedParent?.remit_to_address_is_the_same || 0) === 1}
                        onKeyDown={(e) => {
                            let key = e.keyCode || e.which;

                            if (key === 9) {
                                if (props.triggerField === 'zip') {
                                    if ((props.selectedParent?.remit_to_address_is_the_same || 0) === 0 &&
                                        (props.selectedParent?.id || 0) > 0) {

                                        props.validateForSaving(e)
                                    }
                                }
                            }
                        }}
                        onChange={e => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    mailing_address: {
                                        ...(prev?.mailing_address || {}),
                                        zip: e.target.value
                                    }
                                }
                            })
                        }}
                        value={(props.selectedParent?.mailing_address?.zip || '')} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">

                {/* // ========================================================= CONTACT NAME ==================================================== */}

                <div className="select-box-container" style={{ flexGrow: 1 }}>
                    <div className="select-box-wrapper">
                        <input
                            // readOnly={(props.selectedParent?.remit_to_address_is_the_same || 0) === 1}
                            style={{
                                textTransform: 'capitalize'
                            }}
                            tabIndex={props.tabTimesFrom + props.tabTimes + 6}
                            type="text"
                            placeholder="Contact Name"
                            ref={refContactName}
                            onKeyDown={async (e) => {
                                let key = e.keyCode || e.which;

                                switch (key) {
                                    case 37:
                                    case 38: // arrow left | arrow up
                                        // e.preventDefault();
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

                                            refContactNamePopupItems.current.map((r, i) => {
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
                                            let contacts = [];

                                            if ((props.selectedParent?.remit_to_address_is_the_same || 0) === 1) {
                                                contacts = props.selectedParent?.contacts || [];
                                            }

                                            if (contacts.length > 0) {
                                                await setMailingContactNameItems(contacts.map((item, index) => {
                                                    item.selected = index === 0
                                                    return item;
                                                }))

                                                setShowMailingContactNames(true);

                                                refContactNamePopupItems.current.map((r, i) => {
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
                                        // e.preventDefault();
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

                                            refContactNamePopupItems.current.map((r, i) => {
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
                                            let contacts = [];

                                            if ((props.selectedParent?.remit_to_address_is_the_same || 0) === 1) {
                                                contacts = props.selectedParent?.contacts || [];
                                            }

                                            if (contacts.length > 0) {
                                                await setMailingContactNameItems(contacts.map((item, index) => {
                                                    item.selected = index === 0
                                                    return item;
                                                }))

                                                setShowMailingContactNames(true);

                                                refContactNamePopupItems.current.map((r, i) => {
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
                                            await props.setSelectedParent(prev => {
                                                return {
                                                    ...prev,
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
                                                                        '',
                                                    mailing_address: {
                                                        ...(prev?.mailing_address || {}),
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
                                                                    : ''

                                                    }
                                                }
                                            });

                                            // props.validateMailingAddressForSaving({keyCode: 9});
                                            setShowMailingContactNames(false);
                                            refContactName.current.focus();
                                        }
                                        break;

                                    case 9: // tab
                                        if (showMailingContactNames) {
                                            e.preventDefault();
                                            await props.setSelectedParent(prev => {
                                                return {
                                                    ...prev,
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
                                                                        '',
                                                    mailing_address: {
                                                        ...(prev?.mailing_address || {}),
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
                                                                    : ''

                                                    }
                                                }
                                            });

                                            // props.validateMailingAddressForSaving({keyCode: 9});
                                            setShowMailingContactNames(false);
                                            refContactName.current.focus();
                                        } else {
                                            // props.validateMailingAddressForSaving({keyCode: 9});
                                        }
                                        break;

                                    default:
                                        break;
                                }
                            }}
                            onBlur={e => {
                                let contacts = [];

                                if ((props.selectedParent?.remit_to_address_is_the_same || 0) === 1) {
                                    contacts = (props.selectedParent?.contacts || []);

                                    let contact = contacts.find(x => (x.first_name + ' ' + x.last_name).toLowerCase() === e.target.value.toLowerCase());

                                    if (contact) {
                                        props.setSelectedParent(prev => {
                                            return {
                                                ...prev,
                                                mailing_contact_id: contact.id,
                                                mailing_address: {
                                                    ...(prev?.mailing_address || {}),
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
                                                                : ''
                                                }
                                            }
                                        })
                                    } else {
                                        props.setSelectedParent(prev => {
                                            return {
                                                ...prev,
                                                mailing_contact_id: null
                                            }
                                        })
                                    }
                                }
                            }}
                            onChange={e => {
                                props.setSelectedParent(prev => {
                                    return {
                                        ...prev,
                                        mailing_address: {
                                            ...(prev?.mailing_address || {}),
                                            contact_name: e.target.value
                                        }
                                    }
                                })
                            }}
                            value={(props.selectedParent?.mailing_address?.contact_name || '')}
                        />
                        {
                            (((props.selectedParent?.remit_to_address_is_the_same || 0) === 1 && (props.selectedParent?.contacts || []).length > 0)) &&
                            ((props.user?.user_code?.is_admin || 0) === 1) &&
                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                onClick={async () => {
                                    if (showMailingContactNames) {
                                        setShowMailingContactNames(false);
                                    } else {
                                        let contacts = [];

                                        if ((props.selectedParent?.remit_to_address_is_the_same || 0) === 1) {
                                            contacts = props.selectedParent?.contacts || [];
                                        }

                                        if (contacts.length > 0) {
                                            await setMailingContactNameItems(contacts.map((item, index) => {
                                                item.selected = index === 0
                                                return item;
                                            }))

                                            window.setTimeout(() => {
                                                setShowMailingContactNames(true);

                                                refContactNamePopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains('selected')) {
                                                        r.scrollIntoView({
                                                            behavior: 'auto',
                                                            block: 'center',
                                                            inline: 'nearest'
                                                        })
                                                    }
                                                    return true;
                                                });
                                            }, 100);
                                        }
                                    }

                                    refContactName.current.focus();
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
                                ref={refContactNameDropDown}
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
                                                                await props.setSelectedParent(prev => {
                                                                    return {
                                                                        ...prev,
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
                                                                                            '',
                                                                        mailing_address: {
                                                                            ...(prev?.mailing_address || {}),
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
                                                                                        : ''
                                                                        }
                                                                    }
                                                                });

                                                                // props.validateMailingAddressForSaving({keyCode: 9});
                                                                setShowMailingContactNames(false);
                                                                refContactName.current.focus();
                                                            }}
                                                            ref={ref => refContactNamePopupItems.current.push(ref)}
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

                {/* // ========================================================= CONTACT PHONE ==================================================== */}

                <div className="select-box-container input-phone" style={{
                    width: '10.25rem'
                }}>
                    <div className="select-box-wrapper">
                        <MaskedInput tabIndex={props.tabTimesFrom + props.tabTimes + 7}
                            // readOnly={(props.selectedParent?.remit_to_address_is_the_same || 0) === 1}
                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                            guide={true}
                            type="text"
                            placeholder="Contact Phone"
                            ref={refContactPhone}
                            onKeyDown={async (e) => {
                                let key = e.keyCode || e.which;

                                switch (key) {
                                    case 37:
                                    case 38: // arrow left | arrow up
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

                                            refContactPhonePopupItems.current.map((r, i) => {
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

                                                refContactPhonePopupItems.current.map((r, i) => {
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

                                            refContactPhonePopupItems.current.map((r, i) => {
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

                                                refContactPhonePopupItems.current.map((r, i) => {
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
                                            await props.setSelectedParent(prev => {
                                                return {
                                                    ...prev,
                                                    mailing_contact_primary_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].type,
                                                    mailing_address: {
                                                        ...(prev?.mailing_address || {}),
                                                        contact_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].phone,
                                                        ext: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].ext
                                                    }
                                                }
                                            });

                                            // props.validateMailingAddressForSaving({keyCode: 9});
                                            setShowMailingContactPhones(false);
                                            refContactPhone.current.inputElement.focus();
                                        }
                                        break;

                                    case 9: // tab
                                        if (showMailingContactPhones) {
                                            e.preventDefault();
                                            await props.setSelectedParent(prev => {
                                                return {
                                                    ...prev,
                                                    mailing_contact_primary_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].type,
                                                    mailing_address: {
                                                        ...(prev?.mailing_address || {}),
                                                        contact_phone: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].phone,
                                                        ext: mailingContactPhoneItems[mailingContactPhoneItems.findIndex(item => item.selected)].ext
                                                    }
                                                }
                                            });

                                            // props.validateMailingAddressForSaving({keyCode: 9});
                                            setShowMailingContactPhones(false);
                                            refContactPhone.current.inputElement.focus();
                                        } else {
                                            // props.validateMailingAddressForSaving({keyCode: 9});
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }}
                            onChange={(e) => {
                                props.setSelectedParent(prev => {
                                    return {
                                        ...prev,
                                        mailing_address: {
                                            ...(prev?.mailing_address || {}),
                                            contact_phone: e.target.value
                                        }
                                    }
                                })
                            }}
                            value={props.selectedParent?.mailing_address?.contact_phone || ''}
                        />
                        {
                            (((props.selectedParent?.remit_to_address_is_the_same || 0) === 1) &&
                                (props.selectedParent?.mailing_contact_id || 0) > 0) &&
                            <div
                                className={classnames({
                                    'selected-mailing-contact-primary-phone': true,
                                    'pushed': (mailingContactPhoneItems.length > 1)
                                })}>
                                {props.selectedParent?.mailing_contact_primary_phone || ''}
                            </div>
                        }

                        {
                            (mailingContactPhoneItems.length > 1) &&
                            ((props.user?.user_code?.is_admin || 0) === 1) &&
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

                                                refContactPhonePopupItems.current.map((r, i) => {
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

                                    refContactPhone.current.inputElement.focus();
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
                                ref={refContactPhoneDropDown}
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
                                                                await props.setSelectedParent(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        mailing_contact_primary_phone: item.type,
                                                                        mailing_address: {
                                                                            ...(prev?.mailing_address || {}),
                                                                            contact_phone: item.phone,
                                                                            ext: item.ext
                                                                        }
                                                                    }
                                                                });

                                                                // props.validateMailingAddressForSaving({keyCode: 9});
                                                                setShowMailingContactPhones(false);
                                                                refContactPhone.current.inputElement.focus();
                                                            }}
                                                            ref={ref => refContactPhonePopupItems.current.push(ref)}
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

                {/* // ========================================================= EXT ==================================================== */}

                <div className="input-box-container input-phone-ext">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 8} type="text" placeholder="Ext"
                        // readOnly={(props.selectedParent?.remit_to_address_is_the_same || 0) === 1}
                        onChange={e => {
                            props.setSelectedParent(prev => {
                                return {
                                    ...prev,
                                    mailing_address: {
                                        ...(prev?.mailing_address || {}),
                                        ext: e.target.value
                                    }
                                }
                            })
                        }}
                        value={
                            (props.selectedParent?.mailing_contact_id || 0) > 0
                                ? (props.selectedParent?.mailing_contact_primary_phone || '') === 'work'
                                    ? props.selectedParent?.mailing_address?.ext || ''
                                    : ''
                                : props.selectedParent?.mailing_address?.ext || ''
                        } />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row" style={{
                display: 'flex'
            }}>

                {/* // ========================================================= EMAIL ==================================================== */}

                <div className="select-box-container" style={{ flexGrow: 1 }}
                    onMouseEnter={() => {
                        if ((props.selectedParent?.email || '') !== '') {
                            setShowMailingContactEmailCopyBtn(true);
                        }
                    }}
                    onFocus={() => {
                        if ((props.selectedParent?.email || '') !== '') {
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
                        <input tabIndex={props.tabTimesFrom + props.tabTimes + 9} type="text" placeholder="E-Mail"
                            ref={refContactEmail}
                            // readOnly={(props.selectedParent?.remit_to_address_is_the_same || 0) === 1}
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

                                            refContactEmailPopupItems.current.map((r, i) => {
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

                                                refContactEmailPopupItems.current.map((r, i) => {
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

                                            refContactEmailPopupItems.current.map((r, i) => {
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

                                                refContactEmailPopupItems.current.map((r, i) => {
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
                                            await props.setSelectedParent(prev => {
                                                return {
                                                    ...prev,
                                                    mailing_contact_primary_email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].type,
                                                    mailing_address: {
                                                        ...(prev?.mailing_address || {}),
                                                        email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].email
                                                    }
                                                }
                                            });

                                            // props.validateMailingAddressForSaving({keyCode: 9});
                                            setShowMailingContactEmails(false);
                                            refContactEmail.current.focus();
                                        }
                                        break;

                                    case 9: // tab
                                        if (showMailingContactEmails) {
                                            e.preventDefault();
                                            await props.setSelectedParent(prev => {
                                                return {
                                                    ...prev,
                                                    mailing_contact_primary_email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].type,
                                                    mailing_address: {
                                                        ...(prev?.mailing_address || {}),
                                                        email: mailingContactEmailItems[mailingContactEmailItems.findIndex(item => item.selected)].email
                                                    }
                                                }
                                            });

                                            if ((props.selectedParent?.remit_to_address_is_the_same || 0) === 1) {
                                                props.validateForSaving({ keyCode: 9 });
                                            } else if ((props.selectedParent?.id || 0) > 0) {
                                                props.validateMailingAddressForSaving({ keyCode: 9 });
                                            }

                                            setShowMailingContactEmails(false);
                                            refContactEmail.current.focus();
                                        } else {
                                            if ((props.selectedParent?.remit_to_address_is_the_same || 0) === 1) {
                                                props.validateForSaving({ keyCode: 9 });
                                            } else if ((props.selectedParent?.id || 0) > 0) {
                                                props.validateMailingAddressForSaving({ keyCode: 9 });
                                            }
                                        }
                                        break;

                                    default:
                                        break;
                                }
                            }}
                            onChange={e => {
                                props.setSelectedParent(prev => {
                                    return {
                                        ...prev,
                                        mailing_address: {
                                            ...(prev?.mailing_address || {}),
                                            email: e.target.value
                                        }
                                    }
                                })
                            }}
                            value={props.selectedParent?.mailing_address?.email || ''}
                        />

                        {
                            (((props.selectedParent?.remit_to_address_is_the_same || 0) === 1) &&
                                (props.selectedParent?.mailing_contact_id || 0) > 0) &&
                            <div
                                className={classnames({
                                    'selected-mailing-contact-primary-email': true,
                                    'pushed': (mailingContactEmailItems.length > 1)
                                })}>
                                {props.selectedParent?.mailing_contact_primary_email || ''}
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
                                navigator.clipboard.writeText(refContactEmail.current.value);
                            }} />
                        }

                        {
                            (mailingContactEmailItems.length > 1 && ((props.selectedParent?.mailing_contact_id || 0) > 0)) &&
                            ((props.user?.user_code?.is_admin || 0) === 1) &&
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

                                                refContactEmailPopupItems.current.map((r, i) => {
                                                    if (r && r.classList.contains('selected')) {
                                                        r.scrollIntoView({
                                                            behavior: 'auto',
                                                            block: 'center',
                                                            inline: 'nearest'
                                                        })
                                                    }
                                                    return true;
                                                });
                                            }, 100)
                                        }
                                    }

                                    refContactEmail.current.focus();
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
                                ref={refContactEmailDropDown}
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
                                                                await props.setSelectedParent(prev => {
                                                                    return {
                                                                        ...prev,
                                                                        mailing_contact_primary_email: item.type,
                                                                        mailing_address: {
                                                                            ...(prev?.mailing_address || {}),
                                                                            email: item.email
                                                                        }
                                                                    }
                                                                });

                                                                props.validateForSaving({ keyCode: 9 });
                                                                setShowMailingContactEmails(false);
                                                                refContactEmail.current.focus();
                                                            }}
                                                            ref={ref => refContactEmailPopupItems.current.push(ref)}
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
    )
}

const mapStateToProps = (state) => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        user: state.systemReducers.user
    }
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(DriverMailingAddressForm)