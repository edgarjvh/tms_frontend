import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import './ContactForm.css';
import classnames from 'classnames';
import moment from 'moment';
import MaskedInput from 'react-text-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCheck, faPencilAlt, faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import { useTransition, animated } from 'react-spring';

function ContactForm(props) {
    const { 
        refFirstName, 
        refPhone,
        refEmail,
        refNotes
    } = props.refs;

    const refPhonePopupItems = useRef([]);
    const refEmailPopupItems = useRef([]);

    const [showContactPhones, setShowContactPhones] = useState(false);
    const [contactPhoneItems, setContactPhoneItems] = useState([]);
    const refContactPhoneDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowContactPhones(false)
        }
    });
    
    const [showContactEmails, setShowContactEmails] = useState(false);
    const [contactEmailItems, setContactEmailItems] = useState([]);
    const refContactEmailDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setShowContactEmails(false)
        }
    });

    const [showContactEmailCopyBtn, setShowContactEmailCopyBtn] = useState(false);
    
    const contactPhonesTransition = useTransition(showContactPhones, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showContactPhones
    });

    const customerContactEmailsTransition = useTransition(showContactEmails, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showContactEmails
    });

    useEffect(async () => {
        let phones = [];
        (props.selectedContact?.phone_work || '') !== '' && phones.push({
            id: 1,
            type: 'work',
            phone: props.selectedContact.phone_work
        });
        (props.selectedContact?.phone_work_fax || '') !== '' && phones.push({
            id: 2,
            type: 'fax',
            phone: props.selectedContact.phone_work_fax
        });
        (props.selectedContact?.phone_mobile || '') !== '' && phones.push({
            id: 3,
            type: 'mobile',
            phone: props.selectedContact.phone_mobile
        });
        (props.selectedContact?.phone_direct || '') !== '' && phones.push({
            id: 4,
            type: 'direct',
            phone: props.selectedContact.phone_direct
        });
        (props.selectedContact?.phone_other || '') !== '' && phones.push({
            id: 5,
            type: 'other',
            phone: props.selectedContact.phone_other
        });

        await setContactPhoneItems(phones);
    }, [
        props.selectedContact?.phone_work,
        props.selectedContact?.phone_work_fax,
        props.selectedContact?.phone_mobile,
        props.selectedContact?.phone_direct,
        props.selectedContact?.phone_other,
        props.selectedContact?.primary_phone
    ]);

    useEffect(async () => {
        let emails = [];
        (props.selectedContact?.email_work || '') !== '' && emails.push({
            id: 1,
            type: 'work',
            email: props.selectedContact.email_work
        });
        (props.selectedContact?.email_personal || '') !== '' && emails.push({
            id: 2,
            type: 'personal',
            email: props.selectedContact.email_personal
        });
        (props.selectedContact?.email_other || '') !== '' && emails.push({
            id: 3,
            type: 'other',
            email: props.selectedContact.email_other
        });

        await setContactEmailItems(emails);
    }, [
        props.selectedContact?.email_work,
        props.selectedContact?.email_personal,
        props.selectedContact?.email_other,
        props.selectedContact?.primary_email
    ]);

    return (
        <div className="form-bordered-box">
            <div className="form-header">
                <div className="top-border top-border-left"></div>
                <div className="form-title">Contacts</div>
                <div className="top-border top-border-middle"></div>
                <div className="form-buttons">
                    {
                        (props.formButtons || []).map((item, index) => {
                            if (item.isEnabled) {
                                return (
                                    <div className="mochi-button" onClick={item.onClick} key={index}>
                                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                        <div className="mochi-button-base">{item.title}</div>
                                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                                    </div>
                                )
                            } else {
                                return ''
                            }
                        })
                    }
                </div>
                <div className="top-border top-border-right"></div>
            </div>

            <div className="form-row">
                <div className="input-box-container grow">
                    <input tabIndex={12 + props.tabTimes} type="text" placeholder="First Name"
                        style={{
                            textTransform: 'capitalize'
                        }}
                        ref={refFirstName}
                        readOnly={
                            (props.user?.user_code?.is_admin || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.save || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.edit || 0) === 0
                        }
                        onChange={e => {
                            props.setSelectedContact({ ...props.selectedContact, first_name: e.target.value })
                        }}
                        value={props.selectedContact?.first_name || ''} />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container grow">
                    <input tabIndex={13 + props.tabTimes} type="text" placeholder="Last Name"
                        style={{
                            textTransform: 'capitalize'
                        }}
                        readOnly={
                            (props.user?.user_code?.is_admin || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.save || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.edit || 0) === 0
                        }
                        onChange={e => props.setSelectedContact({
                            ...props.selectedContact,
                            last_name: e.target.value
                        })}
                        value={props.selectedContact?.last_name || ''} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">
                <div className="select-box-container" style={{ width: '50%' }}>
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
                            ref={refPhone}
                            onKeyDown={async (e) => {
                                let key = e.keyCode || e.which;

                                switch (key) {
                                    case 37:
                                    case 38: // arrow left | arrow up
                                        e.preventDefault();
                                        if (showContactPhones) {
                                            let selectedIndex = contactPhoneItems.findIndex(item => item.selected);

                                            if (selectedIndex === -1) {
                                                await setContactPhoneItems(contactPhoneItems.map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            } else {
                                                await setContactPhoneItems(contactPhoneItems.map((item, index) => {
                                                    if (selectedIndex === 0) {
                                                        item.selected = index === (contactPhoneItems.length - 1);
                                                    } else {
                                                        item.selected = index === (selectedIndex - 1)
                                                    }
                                                    return item;
                                                }))
                                            }

                                            refPhonePopupItems.current.map((r, i) => {
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
                                            if (contactPhoneItems.length > 1) {
                                                await setContactPhoneItems(contactPhoneItems.map((item, index) => {
                                                    item.selected = item.type === (props.selectedContact?.primary_phone || '')
                                                    return item;
                                                }))

                                                setShowContactPhones(true);

                                                refPhonePopupItems.current.map((r, i) => {
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
                                        if (showContactPhones) {
                                            let selectedIndex = contactPhoneItems.findIndex(item => item.selected);

                                            if (selectedIndex === -1) {
                                                await setContactPhoneItems(contactPhoneItems.map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            } else {
                                                await setContactPhoneItems(contactPhoneItems.map((item, index) => {
                                                    if (selectedIndex === (contactPhoneItems.length - 1)) {
                                                        item.selected = index === 0;
                                                    } else {
                                                        item.selected = index === (selectedIndex + 1)
                                                    }
                                                    return item;
                                                }))
                                            }

                                            refPhonePopupItems.current.map((r, i) => {
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
                                            if (contactPhoneItems.length > 1) {
                                                await setContactPhoneItems(contactPhoneItems.map((item, index) => {
                                                    item.selected = item.type === (props.selectedContact?.primary_phone || '')
                                                    return item;
                                                }))

                                                setShowContactPhones(true);

                                                refPhonePopupItems.current.map((r, i) => {
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
                                        setShowContactPhones(false);
                                        break;

                                    case 13: // enter
                                        if (showContactPhones && contactPhoneItems.findIndex(item => item.selected) > -1) {
                                            await props.setSelectedContact({
                                                ...props.selectedContact,
                                                primary_phone: contactPhoneItems[contactPhoneItems.findIndex(item => item.selected)].type
                                            });

                                            props.validateContactForSaving({ keyCode: 9 });
                                            setShowContactPhones(false);
                                            refPhone.current.inputElement.focus();
                                        }
                                        break;

                                    case 9: // tab
                                        if (showContactPhones) {
                                            e.preventDefault();
                                            await props.setSelectedContact({
                                                ...props.selectedContact,
                                                primary_phone: contactPhoneItems[contactPhoneItems.findIndex(item => item.selected)].type
                                            });

                                            props.validateContactForSaving({ keyCode: 9 });
                                            setShowContactPhones(false);
                                            refPhone.current.inputElement.focus();
                                        } else {
                                            props.validateContactForSaving({ keyCode: 9 });
                                        }
                                        break;

                                    default:
                                        break;
                                }
                            }}
                            onInput={(e) => {
                                if ((props.selectedContact?.id || 0) === 0) {
                                    props.setSelectedContact({
                                        ...props.selectedContact,
                                        phone_work: e.target.value,
                                        primary_phone: 'work'
                                    });
                                } else {
                                    if ((props.selectedContact?.primary_phone || '') === '') {
                                        props.setSelectedContact({
                                            ...props.selectedContact,
                                            phone_work: e.target.value,
                                            primary_phone: 'work'
                                        });
                                    } else {
                                        switch (props.selectedContact?.primary_phone) {
                                            case 'work':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    phone_work: e.target.value
                                                });
                                                break;
                                            case 'fax':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    phone_work_fax: e.target.value
                                                });
                                                break;
                                            case 'mobile':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    phone_mobile: e.target.value
                                                });
                                                break;
                                            case 'direct':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    phone_direct: e.target.value
                                                });
                                                break;
                                            case 'other':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    phone_other: e.target.value
                                                });
                                                break;
                                        }
                                    }
                                }
                            }}
                            onChange={(e) => {
                                if ((props.selectedContact?.id || 0) === 0) {
                                    props.setSelectedContact({
                                        ...props.selectedContact,
                                        phone_work: e.target.value,
                                        primary_phone: 'work'
                                    });
                                } else {
                                    if ((props.selectedContact?.primary_phone || '') === '') {
                                        props.setSelectedContact({
                                            ...props.selectedContact,
                                            phone_work: e.target.value,
                                            primary_phone: 'work'
                                        });
                                    } else {
                                        switch (props.selectedContact?.primary_phone) {
                                            case 'work':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    phone_work: e.target.value
                                                });
                                                break;
                                            case 'fax':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    phone_work_fax: e.target.value
                                                });
                                                break;
                                            case 'mobile':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    phone_mobile: e.target.value
                                                });
                                                break;
                                            case 'direct':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    phone_direct: e.target.value
                                                });
                                                break;
                                            case 'other':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    phone_other: e.target.value
                                                });
                                                break;
                                        }
                                    }
                                }
                            }}
                            value={
                                (props.selectedContact?.primary_phone || '') === 'work'
                                    ? (props.selectedContact?.phone_work || '')
                                    : (props.selectedContact?.primary_phone || '') === 'fax'
                                        ? (props.selectedContact?.phone_work_fax || '')
                                        : (props.selectedContact?.primary_phone || '') === 'mobile'
                                            ? (props.selectedContact?.phone_mobile || '')
                                            : (props.selectedContact?.primary_phone || '') === 'direct'
                                                ? (props.selectedContact?.phone_direct || '')
                                                : (props.selectedContact?.primary_phone || '') === 'other'
                                                    ? (props.selectedContact?.phone_other || '')
                                                    : ''
                            }
                        />

                        {
                            (props.selectedContact?.id || 0) > 0 &&
                            <div
                                className={classnames({
                                    'selected-customer-contact-primary-phone': true,
                                    'pushed': (contactPhoneItems.length > 1)
                                })}>
                                {props.selectedContact?.primary_phone || ''}
                            </div>
                        }

                        {
                            contactPhoneItems.length > 1 &&
                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                onClick={async () => {
                                    if (showContactPhones) {
                                        setShowContactPhones(false);
                                    } else {
                                        if (contactPhoneItems.length > 1) {
                                            await setContactPhoneItems(contactPhoneItems.map((item, index) => {
                                                item.selected = item.type === (props.selectedContact?.primary_phone || '')
                                                return item;
                                            }))

                                            window.setTimeout(async () => {
                                                await setShowContactPhones(true);

                                                refPhonePopupItems.current.map((r, i) => {
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

                                    refPhone.current.inputElement.focus();
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
                                ref={refContactPhoneDropDown}
                            >
                                <div className="mochi-contextual-popup vertical below right"
                                    style={{ height: 150 }}>
                                    <div className="mochi-contextual-popup-content">
                                        <div className="mochi-contextual-popup-wrapper">
                                            {
                                                contactPhoneItems.map((item, index) => {
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
                                                                await props.setSelectedContact({
                                                                    ...props.selectedContact,
                                                                    primary_phone: item.type
                                                                });

                                                                props.validateContactForSaving({ keyCode: 9 });
                                                                setShowContactPhones(false);
                                                                refPhone.current.inputElement.focus();
                                                            }}
                                                            ref={ref => refPhonePopupItems.current.push(ref)}
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
                    <div className="input-box-container input-phone-ext">
                        <input tabIndex={15 + props.tabTimes} type="text" placeholder="Ext"
                            readOnly={
                                (props.user?.user_code?.is_admin || 0) === 0 &&
                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.save || 0) === 0 &&
                                ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.edit || 0) === 0
                            }
                            // onKeyDown={props.validateContactForSaving}
                            onChange={e => props.setSelectedContact({
                                ...props.selectedContact,
                                phone_ext: e.target.value
                            })}
                            value={(props.selectedContact?.primary_phone || '') === 'work' ? props.selectedContact.phone_ext || '' : ''} />
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
                                if (props.selectedContact.pivot) {
                                    props.setSelectedContact(prev => {
                                        return {
                                            ...prev,
                                            pivot: {
                                                ...props.selectedContact?.pivot || {},
                                                is_primary: e.target.checked ? 1 : 0
                                            }
                                        }
                                    })
                                } else {
                                    props.setSelectedContact(prev => {
                                        return {
                                            ...prev,
                                            is_primary: e.target.checked ? 1 : 0
                                        }
                                    })
                                }

                                props.validateContactForSaving({ keyCode: 9 });
                            }}
                            checked={props.selectedContact?.pivot
                                ? (props.selectedContact?.pivot?.is_primary || 0) === 1
                                : (props.selectedContact?.is_primary || 0) === 1} />
                        <label htmlFor={props.panelName + '-cbox-customer-contacts-primary-btn'}>
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
                        if ((props.selectedContact?.email_work || '') !== '' ||
                            (props.selectedContact?.email_personal || '') !== '' ||
                            (props.selectedContact?.email_other || '') !== '') {
                            setShowContactEmailCopyBtn(true);
                        }
                    }}
                    onFocus={() => {
                        if ((props.selectedContact?.email_work || '') !== '' ||
                            (props.selectedContact?.email_personal || '') !== '' ||
                            (props.selectedContact?.email_other || '') !== '') {
                            setShowContactEmailCopyBtn(true);
                        }
                    }}
                    onBlur={() => {
                        window.setTimeout(() => {
                            setShowContactEmailCopyBtn(false);
                        }, 1000);
                    }}
                    onMouseLeave={() => {
                        setShowContactEmailCopyBtn(false);
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
                            ref={refEmail}
                            onKeyDown={async (e) => {
                                let key = e.keyCode || e.which;

                                switch (key) {
                                    case 37:
                                    case 38: // arrow left | arrow up
                                        e.preventDefault();
                                        if (showContactEmails) {
                                            let selectedIndex = contactEmailItems.findIndex(item => item.selected);

                                            if (selectedIndex === -1) {
                                                await setContactEmailItems(contactEmailItems.map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            } else {
                                                await setContactEmailItems(contactEmailItems.map((item, index) => {
                                                    if (selectedIndex === 0) {
                                                        item.selected = index === (contactEmailItems.length - 1);
                                                    } else {
                                                        item.selected = index === (selectedIndex - 1)
                                                    }
                                                    return item;
                                                }))
                                            }

                                            refEmailPopupItems.current.map((r, i) => {
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
                                            if (contactEmailItems.length > 1) {
                                                await setContactEmailItems(contactEmailItems.map((item, index) => {
                                                    item.selected = item.type === (props.selectedContact?.primary_email || '')
                                                    return item;
                                                }))

                                                setShowContactEmails(true);

                                                refEmailPopupItems.current.map((r, i) => {
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
                                        if (showContactEmails) {
                                            let selectedIndex = contactEmailItems.findIndex(item => item.selected);

                                            if (selectedIndex === -1) {
                                                await setContactEmailItems(contactEmailItems.map((item, index) => {
                                                    item.selected = index === 0;
                                                    return item;
                                                }))
                                            } else {
                                                await setContactEmailItems(contactEmailItems.map((item, index) => {
                                                    if (selectedIndex === (contactEmailItems.length - 1)) {
                                                        item.selected = index === 0;
                                                    } else {
                                                        item.selected = index === (selectedIndex + 1)
                                                    }
                                                    return item;
                                                }))
                                            }

                                            refEmailPopupItems.current.map((r, i) => {
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
                                            if (contactEmailItems.length > 1) {
                                                await setContactEmailItems(contactEmailItems.map((item, index) => {
                                                    item.selected = item.type === (props.selectedContact?.primary_email || '')
                                                    return item;
                                                }))

                                                setShowContactEmails(true);

                                                refEmailPopupItems.current.map((r, i) => {
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
                                        setShowContactEmails(false);
                                        break;

                                    case 13: // enter
                                        if (showContactEmails && contactEmailItems.findIndex(item => item.selected) > -1) {
                                            await props.setSelectedContact({
                                                ...props.selectedContact,
                                                primary_email: contactEmailItems[contactEmailItems.findIndex(item => item.selected)].type
                                            });

                                            props.validateContactForSaving({ keyCode: 9 });
                                            setShowContactEmails(false);
                                            refEmail.current.focus();
                                        }
                                        break;

                                    case 9: // tab
                                        if (showContactEmails) {
                                            e.preventDefault();
                                            await props.setSelectedContact({
                                                ...props.selectedContact,
                                                primary_email: contactEmailItems[contactEmailItems.findIndex(item => item.selected)].type
                                            });

                                            props.validateContactForSaving({ keyCode: 9 });
                                            setShowContactEmails(false);
                                            refEmail.current.focus();
                                        } else {
                                            props.validateContactForSaving({ keyCode: 9 });
                                        }
                                        break;

                                    default:
                                        break;
                                }
                            }}
                            onInput={(e) => {
                                if ((props.selectedContact?.id || 0) === 0) {
                                    props.setSelectedContact({
                                        ...props.selectedContact,
                                        email_work: e.target.value,
                                        primary_email: 'work'
                                    });
                                } else {
                                    if ((props.selectedContact?.primary_email || '') === '') {
                                        props.setSelectedContact({
                                            ...props.selectedContact,
                                            email_work: e.target.value,
                                            primary_email: 'work'
                                        });
                                    } else {
                                        switch (props.selectedContact?.primary_email) {
                                            case 'work':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    email_work: e.target.value
                                                });
                                                break;
                                            case 'personal':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    email_personal: e.target.value
                                                });
                                                break;
                                            case 'other':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    email_other: e.target.value
                                                });
                                                break;
                                        }
                                    }
                                }
                            }}
                            onChange={(e) => {
                                if ((props.selectedContact?.id || 0) === 0) {
                                    props.setSelectedContact({
                                        ...props.selectedContact,
                                        email_work: e.target.value,
                                        primary_email: 'work'
                                    });
                                } else {
                                    if ((props.selectedContact?.primary_email || '') === '') {
                                        props.setSelectedContact({
                                            ...props.selectedContact,
                                            email_work: e.target.value,
                                            primary_email: 'work'
                                        });
                                    } else {
                                        switch (props.selectedContact?.primary_email) {
                                            case 'work':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    email_work: e.target.value
                                                });
                                                break;
                                            case 'personal':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    email_personal: e.target.value
                                                });
                                                break;
                                            case 'other':
                                                props.setSelectedContact({
                                                    ...props.selectedContact,
                                                    email_other: e.target.value
                                                });
                                                break;
                                        }
                                    }
                                }
                            }}
                            value={
                                (props.selectedContact?.primary_email || '') === 'work'
                                    ? (props.selectedContact?.email_work || '')
                                    : (props.selectedContact?.primary_email || '') === 'personal'
                                        ? (props.selectedContact?.email_personal || '')
                                        : (props.selectedContact?.primary_email || '') === 'other'
                                            ? (props.selectedContact?.email_other || '')
                                            : ''
                            }
                        />

                        {
                            showContactEmailCopyBtn &&
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
                                navigator.clipboard.writeText(refEmail.current.value);
                            }} />
                        }

                        {
                            (props.selectedContact?.id || 0) > 0 &&
                            <div
                                className={classnames({
                                    'selected-customer-contact-primary-email': true,
                                    'pushed': (contactEmailItems.length > 1)
                                })}>
                                {props.selectedContact?.primary_email || ''}
                            </div>
                        }

                        {
                            contactEmailItems.length > 1 &&
                            <FontAwesomeIcon className="dropdown-button" icon={faCaretDown}
                                onClick={async () => {
                                    if (showContactEmails) {
                                        setShowContactEmails(false);
                                    } else {
                                        if (contactEmailItems.length > 1) {
                                            await setContactEmailItems(contactEmailItems.map((item, index) => {
                                                item.selected = item.type === (props.selectedContact?.primary_email || '')
                                                return item;
                                            }))

                                            window.setTimeout(async () => {
                                                await setShowContactEmails(true);

                                                refEmailPopupItems.current.map((r, i) => {
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

                                    refEmail.current.focus();
                                }} />
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
                                ref={refContactEmailDropDown}
                            >
                                <div className="mochi-contextual-popup vertical below right"
                                    style={{ height: 150 }}>
                                    <div className="mochi-contextual-popup-content">
                                        <div className="mochi-contextual-popup-wrapper">
                                            {
                                                contactEmailItems.map((item, index) => {
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
                                                                await props.setSelectedContact({
                                                                    ...props.selectedContact,
                                                                    primary_email: item.type
                                                                });

                                                                props.validateContactForSaving({ keyCode: 9 });
                                                                setShowContactEmails(false);
                                                                refEmail.current.focus();
                                                            }}
                                                            ref={ref => refEmailPopupItems.current.push(ref)}
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
                <div className="input-box-container grow">
                    <input tabIndex={17 + props.tabTimes} type="text" placeholder="Notes"
                        ref={refNotes}
                        readOnly={
                            (props.user?.user_code?.is_admin || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.save || 0) === 0 &&
                            ((props.user?.user_code?.permissions || []).find(x => x.name === 'customer contacts')?.pivot?.edit || 0) === 0
                        }
                        onKeyDown={props.validateContactForSaving}
                        onChange={e => props.setSelectedContact({
                            ...props.selectedContact,
                            notes: e.target.value
                        })}
                        value={props.selectedContact?.notes || ''}
                    />
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

export default connect(mapStateToProps, null, null, { forwardRef: true })(ContactForm)