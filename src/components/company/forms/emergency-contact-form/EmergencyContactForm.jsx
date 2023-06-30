import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { connect } from 'react-redux';
import './EmergencyContactForm.css';
import classnames from 'classnames';
import moment from 'moment';
import MaskedInput from 'react-text-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCheck, faPencilAlt, faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useDetectClickOutside } from "react-detect-click-outside";
import { useTransition, animated } from 'react-spring';

function EmergencyContactForm(props) {
    const [showParentEmailCopyBtn, setShowParentEmailCopyBtn] = useState(false);
    const { refName, refPhone, refEmail } = props.refs;

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

    const contactPhonesTransition = useTransition(showContactPhones, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showContactPhones
    });

    const contactEmailsTransition = useTransition(showContactEmails, {
        from: { opacity: 0, top: 'calc(100% + 7px)' },
        enter: { opacity: 1, top: 'calc(100% + 12px)' },
        leave: { opacity: 0, top: 'calc(100% + 7px)' },
        config: { duration: 100 },
        reverse: showContactEmails
    });

    useEffect(async () => {
        let phones = [];
        (props.selectedParent?.phone_work || '') !== '' && phones.push({
            id: 1,
            type: 'work',
            phone: props.selectedParent.phone_work
        });
        (props.selectedParent?.phone_work_fax || '') !== '' && phones.push({
            id: 2,
            type: 'fax',
            phone: props.selectedParent.phone_work_fax
        });
        (props.selectedParent?.phone_mobile || '') !== '' && phones.push({
            id: 3,
            type: 'mobile',
            phone: props.selectedParent.phone_mobile
        });
        (props.selectedParent?.phone_direct || '') !== '' && phones.push({
            id: 4,
            type: 'direct',
            phone: props.selectedParent.phone_direct
        });
        (props.selectedParent?.phone_other || '') !== '' && phones.push({
            id: 5,
            type: 'other',
            phone: props.selectedParent.phone_other
        });

        await setContactPhoneItems(phones);
    }, [
        props.selectedParent?.phone_work,
        props.selectedParent?.phone_work_fax,
        props.selectedParent?.phone_mobile,
        props.selectedParent?.phone_direct,
        props.selectedParent?.phone_other,
        props.selectedParent?.primary_phone
    ]);

    useEffect(async () => {
        let emails = [];
        (props.selectedParent?.email_work || '') !== '' && emails.push({
            id: 1,
            type: 'work',
            email: props.selectedParent.email_work
        });
        (props.selectedParent?.email_personal || '') !== '' && emails.push({
            id: 2,
            type: 'personal',
            email: props.selectedParent.email_personal
        });
        (props.selectedParent?.email_other || '') !== '' && emails.push({
            id: 3,
            type: 'other',
            email: props.selectedParent.email_other
        });

        await setContactEmailItems(emails);
    }, [
        props.selectedParent?.email_work,
        props.selectedParent?.email_personal,
        props.selectedParent?.email_other,
        props.selectedParent?.primary_email
    ]);

    return (
        <div className="form-bordered-box">
            <div className="form-header">
                <div className="top-border top-border-left"></div>
                {
                    (props.formTitle || '') !== '' &&
                    <div className="form-title">{props.formTitle}</div>
                }
                <div className="top-border top-border-middle"></div>
                {
                    (props.formButtons || []).length > 0 &&
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
                }
                <div className="top-border top-border-right"></div>
            </div>

            <div className="form-row">

                {/* ======================================================= NAME ======================================================= */}

                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 1} type="text" placeholder="Name"
                        style={{
                            textTransform: 'capitalize'
                        }}
                        ref={refName}
                        id="txt-parent-name"
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                name: e.target.value
                            })
                        }}
                        value={props.selectedParent?.name || ''} />
                </div>
                <div className="form-h-sep"></div>

                {/* ======================================================= RELATIONSHIP ======================================================= */}

                <div className="input-box-container" style={{ width: '8.5rem' }}>
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 2} type="text" placeholder="Relationship"
                        style={{
                            textTransform: 'capitalize'
                        }}
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                relationship: e.target.value
                            })
                        }}
                        value={props.selectedParent?.relationship || ''} />
                </div>
                <div className="form-h-sep"></div>

                {/* ======================================================= PRIORITY ======================================================= */}


                <div className="input-box-container" style={{ width: '4.5rem' }}>
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 3} type='number' placeholder="Priority" min={1} max={10} maxLength={2}
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                priority: e.target.value
                            })
                        }}
                        value={props.selectedParent?.priority || ''} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">

                {/* ======================================================= ADDRESS 1 ======================================================= */}

                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 4} type="text" placeholder="Address 1" style={{ textTransform: 'capitalize' }}
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                address1: e.target.value
                            })
                        }}
                        value={props.selectedParent?.address1 || ''} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">

                {/* ======================================================= ADDRESS 2 ======================================================= */}

                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 5} type="text" placeholder="Address 2" style={{ textTransform: 'capitalize' }}
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                address2: e.target.value
                            })
                        }}
                        value={props.selectedParent?.address2 || ''} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">

                {/* ======================================================= CITY ======================================================= */}

                <div className="input-box-container grow">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 6} type="text" placeholder="City"
                        style={{
                            textTransform: 'capitalize'
                        }}
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                city: e.target.value
                            })
                        }}
                        value={props.selectedParent?.city || ''} />
                </div>
                <div className="form-h-sep"></div>

                {/* ======================================================= STATE ======================================================= */}

                <div className="input-box-container input-state">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 7} type="text" placeholder="State" maxLength="2"
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                state: e.target.value
                            })
                        }}
                        value={props.selectedParent?.state || ''} />
                </div>
                <div className="form-h-sep"></div>

                {/* ======================================================= ZIP ======================================================= */}

                <div className="input-box-container input-zip-code">
                    <input tabIndex={props.tabTimesFrom + props.tabTimes + 7} type="text" placeholder="Postal Code"
                        onKeyDown={(e) => {
                            let key = e.keyCode || e.which;

                            if (key === 9) {
                                if (props.triggerField === 'zip') {
                                    props.validateForSaving(e);
                                }
                            }
                        }}
                        onChange={e => {
                            props.setSelectedParent({
                                ...props.selectedParent,
                                zip_code: e.target.value
                            })
                        }}
                        value={props.selectedParent?.zip_code || ''} />
                </div>
            </div>
            <div className="form-v-sep"></div>
            <div className="form-row">

                {/* ======================================================= CONTACT PHONE ======================================================= */}

                <div className="select-box-container input-phone" style={{ position: 'relative', width: 'calc(100% - 13.1rem)' }}>
                    <div className="select-box-wrapper">
                        <MaskedInput
                            tabIndex={props.tabTimesFrom + props.tabTimes + 8}
                            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                            guide={true}
                            type="text" placeholder="Contact Phone"
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
                                                    item.selected = item.type === (props.selectedParent?.primary_phone || '')
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
                                                    item.selected = item.type === (props.selectedParent?.primary_phone || '')
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
                                            await props.setSelectedParent({
                                                ...props.selectedParent,
                                                primary_phone: contactPhoneItems[contactPhoneItems.findIndex(item => item.selected)].type
                                            });

                                            props.validateForSaving({ keyCode: 9 });
                                            setShowContactPhones(false);
                                            refPhone.current.inputElement.focus();
                                        }
                                        break;

                                    case 9: // tab
                                        if (showContactPhones) {
                                            e.preventDefault();
                                            await props.setSelectedParent({
                                                ...props.selectedParent,
                                                primary_phone: contactPhoneItems[contactPhoneItems.findIndex(item => item.selected)].type
                                            });

                                            props.validateForSaving({ keyCode: 9 });
                                            setShowContactPhones(false);
                                            refPhone.current.inputElement.focus();
                                        } else {
                                            props.validateForSaving({ keyCode: 9 });
                                        }
                                        break;

                                    default:
                                        break;
                                }
                            }}
                            onInput={(e) => {
                                if ((props.selectedParent?.id || 0) === 0) {
                                    props.setSelectedParent({
                                        ...props.selectedParent,
                                        phone_work: e.target.value,
                                        primary_phone: 'work'
                                    });
                                } else {
                                    if ((props.selectedParent?.primary_phone || '') === '') {
                                        props.setSelectedParent({
                                            ...props.selectedParent,
                                            phone_work: e.target.value,
                                            primary_phone: 'work'
                                        });
                                    } else {
                                        switch (props.selectedParent?.primary_phone) {
                                            case 'work':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    phone_work: e.target.value
                                                });
                                                break;
                                            case 'fax':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    phone_work_fax: e.target.value
                                                });
                                                break;
                                            case 'mobile':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    phone_mobile: e.target.value
                                                });
                                                break;
                                            case 'direct':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    phone_direct: e.target.value
                                                });
                                                break;
                                            case 'other':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    phone_other: e.target.value
                                                });
                                                break;
                                        }
                                    }
                                }
                            }}
                            onChange={(e) => {
                                if ((props.selectedParent?.id || 0) === 0) {
                                    props.setSelectedParent({
                                        ...props.selectedParent,
                                        phone_work: e.target.value,
                                        primary_phone: 'work'
                                    });
                                } else {
                                    if ((props.selectedParent?.primary_phone || '') === '') {
                                        props.setSelectedParent({
                                            ...props.selectedParent,
                                            phone_work: e.target.value,
                                            primary_phone: 'work'
                                        });
                                    } else {
                                        switch (props.selectedParent?.primary_phone) {
                                            case 'work':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    phone_work: e.target.value
                                                });
                                                break;
                                            case 'fax':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    phone_work_fax: e.target.value
                                                });
                                                break;
                                            case 'mobile':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    phone_mobile: e.target.value
                                                });
                                                break;
                                            case 'direct':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    phone_direct: e.target.value
                                                });
                                                break;
                                            case 'other':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    phone_other: e.target.value
                                                });
                                                break;
                                        }
                                    }
                                }
                            }}
                            value={
                                (props.selectedParent?.primary_phone || '') === 'work'
                                    ? (props.selectedParent?.phone_work || '')
                                    : (props.selectedParent?.primary_phone || '') === 'fax'
                                        ? (props.selectedParent?.phone_work_fax || '')
                                        : (props.selectedParent?.primary_phone || '') === 'mobile'
                                            ? (props.selectedParent?.phone_mobile || '')
                                            : (props.selectedParent?.primary_phone || '') === 'direct'
                                                ? (props.selectedParent?.phone_direct || '')
                                                : (props.selectedParent?.primary_phone || '') === 'other'
                                                    ? (props.selectedParent?.phone_other || '')
                                                    : ''
                            }
                        />
                        {
                            (props.selectedParent?.id || 0) > 0 &&
                            <div
                                className={classnames({
                                    'selected-parent-contact-primary-phone': true,
                                    'pushed': (contactPhoneItems.length > 1)
                                })}>
                                {props.selectedParent?.primary_phone || ''}
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
                                                item.selected = item.type === (props.selectedParent?.primary_phone || '')
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
                                                                await props.setSelectedParent({
                                                                    ...props.selectedParent,
                                                                    primary_phone: item.type
                                                                });

                                                                props.validateForSaving({ keyCode: 9 });
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

                {/* ======================================================= EMAIL ======================================================= */}

                <div className="select-box-container" style={{ position: 'relative', flexGrow: 1 }}
                    onMouseEnter={() => {
                        if ((props.selectedParent?.email || '') !== '') {
                            setShowParentEmailCopyBtn(true);
                        }
                    }}
                    onFocus={() => {
                        if ((props.selectedParent?.email || '') !== '') {
                            setShowParentEmailCopyBtn(true);
                        }
                    }}
                    onBlur={() => {
                        window.setTimeout(() => {
                            setShowParentEmailCopyBtn(false);
                        }, 1000);
                    }}
                    onMouseLeave={() => {
                        setShowParentEmailCopyBtn(false);
                    }}
                >
                    <div className="select-box-wrapper">
                        <input tabIndex={props.tabTimesFrom + props.tabTimes + 9}
                            ref={refEmail}
                            type="text"
                            placeholder="E-Mail"
                            style={{ textTransform: 'lowercase' }}
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
                                                    item.selected = item.type === (props.selectedParent?.primary_email || '')
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
                                                    item.selected = item.type === (props.selectedParent?.primary_email || '')
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
                                            await props.setSelectedParent({
                                                ...props.selectedParent,
                                                primary_email: contactEmailItems[contactEmailItems.findIndex(item => item.selected)].type
                                            });

                                            if (props.triggerField === 'email') {
                                                e.preventDefault();
                                                props.validateForSaving(e);
                                            }
                                            setShowContactEmails(false);
                                            refEmail.current.focus();
                                        }
                                        break;

                                    case 9: // tab
                                        if (showContactEmails) {
                                            e.preventDefault();
                                            await props.setSelectedParent({
                                                ...props.selectedParent,
                                                primary_email: contactEmailItems[contactEmailItems.findIndex(item => item.selected)].type
                                            });

                                            if (props.triggerField === 'email') {
                                                e.preventDefault();
                                                props.validateForSaving(e);
                                            }
                                            setShowContactEmails(false);
                                            refEmail.current.focus();
                                        } else {
                                            if (props.triggerField === 'email') {
                                                e.preventDefault();
                                                props.validateForSaving(e);
                                            }
                                        }
                                        break;

                                    default:
                                        break;
                                }
                            }}
                            onInput={(e) => {
                                if ((props.selectedParent?.id || 0) === 0) {
                                    props.setSelectedParent({
                                        ...props.selectedParent,
                                        email_work: e.target.value,
                                        primary_email: 'work'
                                    });
                                } else {
                                    if ((props.selectedParent?.primary_email || '') === '') {
                                        props.setSelectedParent({
                                            ...props.selectedParent,
                                            email_work: e.target.value,
                                            primary_email: 'work'
                                        });
                                    } else {
                                        switch (props.selectedParent?.primary_email) {
                                            case 'work':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    email_work: e.target.value
                                                });
                                                break;
                                            case 'personal':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    email_personal: e.target.value
                                                });
                                                break;
                                            case 'other':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    email_other: e.target.value
                                                });
                                                break;
                                        }
                                    }
                                }
                            }}
                            onChange={(e) => {
                                if ((props.selectedParent?.id || 0) === 0) {
                                    props.setSelectedParent({
                                        ...props.selectedParent,
                                        email_work: e.target.value,
                                        primary_email: 'work'
                                    });
                                } else {
                                    if ((props.selectedParent?.primary_email || '') === '') {
                                        props.setSelectedParent({
                                            ...props.selectedParent,
                                            email_work: e.target.value,
                                            primary_email: 'work'
                                        });
                                    } else {
                                        switch (props.selectedParent?.primary_email) {
                                            case 'work':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    email_work: e.target.value
                                                });
                                                break;
                                            case 'personal':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    email_personal: e.target.value
                                                });
                                                break;
                                            case 'other':
                                                props.setSelectedParent({
                                                    ...props.selectedParent,
                                                    email_other: e.target.value
                                                });
                                                break;
                                        }
                                    }
                                }
                            }}
                            value={
                                (props.selectedParent?.primary_email || '') === 'work'
                                    ? (props.selectedParent?.email_work || '')
                                    : (props.selectedParent?.primary_email || '') === 'personal'
                                        ? (props.selectedParent?.email_personal || '')
                                        : (props.selectedParent?.primary_email || '') === 'other'
                                            ? (props.selectedParent?.email_other || '')
                                            : ''
                            }
                        />

                        {
                            showParentEmailCopyBtn &&
                            <FontAwesomeIcon style={{
                                position: 'absolute',
                                top: '50%',
                                right: 10,
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
                            (props.selectedParent?.id || 0) > 0 &&
                            <div
                                className={classnames({
                                    'selected-parent-contact-primary-email': true,
                                    'pushed': (contactEmailItems.length > 1)
                                })}>
                                {props.selectedParent?.primary_email || ''}
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
                                                item.selected = item.type === (props.selectedParent?.primary_email || '')
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
                        contactEmailsTransition((style, item) => item && (
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
                                                                await props.setSelectedParent({
                                                                    ...props.selectedParent,
                                                                    primary_email: item.type
                                                                });

                                                                props.validateForSaving({ keyCode: 9 });
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

export default connect(mapStateToProps, null, null, { forwardRef: true })(EmergencyContactForm)