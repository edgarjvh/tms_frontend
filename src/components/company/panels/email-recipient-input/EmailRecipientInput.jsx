import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './EmailRecipientInput.css';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner';
import axios from 'axios';
import { useDetectClickOutside } from "react-detect-click-outside";
import lodash from 'lodash';

import { SelectBox } from './../../../controls';

const EmailRecipientInput = (props) => {
    const refEmailRecipientInputContainer = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [toList, setToList] = useState([]);
    const [ccList, setCcList] = useState([]);
    const [bccList, setBccList] = useState([]);
    const [mailMessage, setMailMessage] = useState('');
    const [messageType, setMessageType] = useState('SUCCESS');

    const [contacts, setContacts] = useState([]);

    const [toInput, setToInput] = useState('');
    const [ccInput, setCcInput] = useState('');
    const [bccInput, setBccInput] = useState('');

    const refToInput = useRef();
    const refCcInput = useRef();
    const refBccInput = useRef();

    const [toInputItems, setToInputItems] = useState([]);
    const refToInputPopupItems = useRef([]);
    const refToInputDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setToInputItems([])
        }
    });

    const [ccInputItems, setCcInputItems] = useState([]);
    const refCcInputPopupItems = useRef([]);
    const refCcInputDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setCcInputItems([])
        }
    });

    const [bccInputItems, setBccInputItems] = useState([]);
    const refBccInputPopupItems = useRef([]);
    const refBccInputDropDown = useDetectClickOutside({
        onTriggered: async () => {
            await setBccInputItems([])
        }
    });

    useEffect(() => {
        setIsLoading(true);

        axios.post(props.serverUrl + '/getEmailContacts').then(res => {
            if (res.data.result === 'OK') {
                let _contacts = [];

                (res.data.contacts || []).map((item) => {
                    if ((item?.email_work || '') !== '') {
                        if (!_contacts.find(x => x.email === item.email_work)) {
                            _contacts.push({
                                id: item.id,
                                name: item.email_work + ((item?.name || '').trim() === '' ? '' : ` (${capitalizeName(item.name)})`),
                                full_name: capitalizeName(item.name),
                                email: item.email_work
                            });
                        }
                    }

                    if ((item?.email_personal || '') !== '') {
                        if (!_contacts.find(x => x.email === item.email_personal)) {
                            _contacts.push({
                                id: item.id,
                                name: item.email_personal + ((item?.name || '').trim() === '' ? '' : ` (${item.name})`),
                                full_name: item.name,
                                email: item.email_personal
                            });
                        }
                    }

                    if ((item?.email_other || '') !== '') {
                        if (!_contacts.find(x => x.email === item.email_other)) {
                            _contacts.push({
                                id: item.id,
                                name: item.email_other + ((item?.name || '').trim() === '' ? '' : ` (${item.name})`),
                                full_name: item.name,
                                email: item.email_other
                            });
                        }
                    }

                    return false;
                })



                setContacts([..._contacts]);
            }
        }).catch(e => {
            console.log("error getting contacts");
        }).finally(() => {
            setIsLoading(false);

            setToList(props.dataEmail?.recipient_to || []);

            refToInput.current.focus({
                preventScroll: true
            });
        });
    }, []);

    const isEmailValid = (email) => {
        let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return email.match(mailformat);
    }

    const capitalizeName = (name) => {
        let nameSplitted = name.split(' ');

        return nameSplitted.map(word => {
            const firstLetter = word.charAt(0).toUpperCase();
            const rest = word.slice(1).toLowerCase();

            return firstLetter + rest;
        }).join(' ');
    }

    return (
        <div className="email-recipient-input" tabIndex={0} ref={refEmailRecipientInputContainer} style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 2
        }} onKeyDown={(e) => {
            let key = e.keyCode || e.which;

            if (key === 27) {
                e.stopPropagation();

                if ((toInput || '') !== '' ||
                    toList.length > 0 ||
                    (ccInput || '') !== '' ||
                    ccList.length > 0 ||
                    (bccInput || '') !== '' ||
                    bccList.length > 0) {                    
                    setToInput('');
                    setCcInput('');
                    setBccInput('');
                    setToList([]);
                    setCcList([]);
                    setBccList([]);

                    refToInput.current.focus();
                }else{
                    props.close();
                }
            }
        }}>
            <div className="email-recipient-input-wrapper" style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div className="email-recipient-input-content" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    padding: 15,
                    borderRadius: 15,
                    boxShadow: '0 0 5px 2px rgba(0,0,0,0.5)',
                    width: '90%',
                    maxWidth: '600px'
                }}>

                    <div className="email-recipient-input-title" style={{
                        fontWeight: 'bold',
                        width: '100%',
                        textAlign: 'center',
                        paddingBottom: 10,
                        fontSize: 16
                    }}>{props.title || 'E-Mail Carrier Confirmation'}</div>

                    {/* BODY */}

                    <div className='email-recipient-to-container' style={{
                        width: '100%'
                    }}>
                        <SelectBox
                            placeholder="To"
                            popupId="input-to"
                            tabIndex={props.tabTimesFrom + props.tabTimes + 1}
                            boxStyle={{
                                width: '100%',
                            }}
                            inputStyle={{
                                textTransform: 'lowercase'
                            }}
                            popupStyle={{
                                left: '-20%',
                                width: 400
                            }}
                            refs={{
                                refInput: refToInput,
                                refPopupItems: refToInputPopupItems,
                                refDropdown: refToInputDropDown,
                            }}
                            noStopPropagationOnEsc={true}
                            readOnly={isLoading}
                            isDropdownEnabled={true}
                            avoidCheckItemsOnTab={true}
                            popupPosition="vertical below"
                            onEnter={async e => {
                                let email = '';
                                let name = '';

                                if (toInputItems.length > 0 && toInputItems.findIndex(item => item.selected) > -1) {
                                    let item = toInputItems[toInputItems.findIndex(item => item.selected)];

                                    email = item.email;
                                    name = item.full_name;
                                } else {
                                    email = toInput;
                                    name = (contacts || []).find(x => x.email === email)?.full_name || '';
                                }


                                if (isEmailValid(email)) {
                                    let exist = false;

                                    (toList || []).map(item => {
                                        if ((item.email || '') === email) {
                                            exist = true;
                                        }
                                        return true;
                                    })

                                    if (exist) {
                                        window.alert('E-mail address is already in the list');
                                        setToInputItems([]);
                                        refToInput.current.focus();
                                    } else {
                                        setToList(prev => {
                                            return [
                                                ...prev,
                                                {
                                                    name: name,
                                                    email: email
                                                }
                                            ]
                                        });

                                        setToInput('');
                                        setToInputItems([]);
                                        refToInput.current.focus();
                                    }

                                } else {
                                    window.alert('Invalid e-mail address!');
                                    setToInputItems([]);
                                    refToInput.current.focus();
                                    return;
                                }

                                setContacts([...contacts.map(item => {
                                    item.selected = false;
                                    return item;
                                })])
                            }}
                            onTab={async e => {
                                if (toInput.trim() !== '' || toInputItems.length > 0) {
                                    e.preventDefault();

                                    let email = '';
                                    let name = '';

                                    if (toInputItems.length > 0 && toInputItems.findIndex(item => item.selected) > -1) {
                                        let item = toInputItems[toInputItems.findIndex(item => item.selected)];

                                        email = item.email;
                                        name = item.full_name;

                                    } else {
                                        email = toInput;
                                        name = (contacts || []).find(x => x.email === email)?.full_name || '';
                                    }


                                    if (isEmailValid(email)) {
                                        let exist = false;

                                        (toList || []).map(item => {
                                            if ((item.email || '') === email) {
                                                exist = true;
                                            }
                                            return true;
                                        })

                                        if (exist) {
                                            window.alert('E-mail address is already in the list');
                                            setToInputItems([]);
                                            refToInput.current.focus();
                                        } else {
                                            setToList(prev => {
                                                return [
                                                    ...prev,
                                                    {
                                                        name: name,
                                                        email: email
                                                    }
                                                ]
                                            });

                                            setToInput('');
                                            setToInputItems([]);
                                            refToInput.current.focus();
                                        }

                                    } else {
                                        window.alert('Invalid e-mail address!');
                                        setToInputItems([]);
                                        refToInput.current.focus();
                                        return;
                                    }

                                    setContacts([...contacts.map(item => {
                                        item.selected = false;
                                        return item;
                                    })])
                                }
                            }}
                            onBlur={e => { }}
                            onInput={e => {
                                setToInput(e.target.value);

                                if (e.target.value.trim() === "") {
                                    setToInputItems([]);
                                } else {
                                    let _contacts = (contacts || []).filter(x =>
                                        (x.email || '').toLowerCase().includes(e.target.value.trim().toLowerCase()) ||
                                        (x.name || '').toLowerCase().includes(e.target.value.trim().toLowerCase())).map((item, index) => {
                                            item.selected = index === 0;
                                            return item;
                                        });

                                    setToInputItems([..._contacts]);
                                }
                            }}
                            onChange={e => {
                                setToInput(e.target.value);
                            }}
                            value={toInput || ""}
                            items={toInputItems}
                            getItems={() => {
                                let _contacts = (contacts || []).filter(x =>
                                    (x.email || '').toLowerCase().includes((toInput || '').trim().toLowerCase()) ||
                                    (x.name || '').toLowerCase().includes((toInput || '').trim().toLowerCase())).map((item, index) => {
                                        item.selected = index === 0;
                                        return item;
                                    });

                                setToInputItems([..._contacts]);

                                refToInputPopupItems.current.map((r, i) => {
                                    if (r && r.classList.contains("selected")) {
                                        r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                        });
                                    }
                                    return true;
                                });
                            }}
                            setItems={setToInputItems}
                            onDropdownClick={e => {
                                let _contacts = (contacts || []).filter(x =>
                                    (x.email || '').toLowerCase().includes((toInput || '').trim().toLowerCase()) ||
                                    (x.name || '').toLowerCase().includes((toInput || '').trim().toLowerCase())).map((item, index) => {
                                        item.selected = index === 0;
                                        return item;
                                    });

                                setToInputItems([..._contacts]);

                                refToInputPopupItems.current.map((r, i) => {
                                    if (r && r.classList.contains("selected")) {
                                        r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                        });
                                    }
                                    return true;
                                });
                            }}
                            onPopupClick={item => {
                                setToList(prev => {
                                    return [
                                        ...prev,
                                        {
                                            name: item.full_name,
                                            email: item.email
                                        }
                                    ]
                                });

                                setToInput('');
                                setToInputItems([]);
                                refToInput.current.focus();
                            }}
                            labelType={'default'}
                        />

                        <div style={{
                            padding: '0 10px',
                            fontSize: '0.7rem',
                            marginTop: 5,
                            color: 'gray'
                        }}>
                            Count: <span style={{ fontWeight: 'bold', color: 'darkred', marginLeft: 2 }}>{toList.length}</span>
                        </div>

                        <div className='to-list-Container' style={{
                            width: '100%',
                            minHeight: '100px',
                            maxHeight: '100px',
                            position: 'relative',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: 10,
                            marginBottom: 10,
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            overflow: 'hidden'
                        }}>
                            <div className="to-list-wrapper" style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                overflowY: 'auto',
                                borderRadius: 10,
                                fontSize: '0.75rem',
                                padding: 5,
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignContent: 'flex-start',
                                pointerEvents: isLoading ? 'none' : 'all'
                            }}>
                                {
                                    (toList || []).map((item, index) => {
                                        return (
                                            <div key={index} className={classnames({
                                                'email-item': true,
                                                'primary': (item.primary || false)
                                            })} style={{
                                                backgroundColor: 'rgba(0,0,0,0.05)',
                                                padding: '1px 5px',
                                                borderRadius: 7,
                                                cursor: 'default',
                                                marginRight: (toList.length - 1) > index ? '10px' : 0,
                                                fontWeight: 'bold',
                                                position: 'relative',
                                                marginBottom: 5
                                            }} title={(item.name || '').trim() !== '' ? item.email : ''}>
                                                {(item.name || '').trim() !== '' ? item.name : item.email}

                                                {
                                                    <FontAwesomeIcon className='delete-email-button' icon={faTrashAlt} size={5} style={{
                                                        position: 'absolute',
                                                        fontSize: '0.55rem',
                                                        color: 'red',
                                                        top: '50%',
                                                        right: -4,
                                                        transform: 'translateY(-50%)',
                                                        display: 'none',
                                                        cursor: 'pointer'
                                                    }} onClick={() => {
                                                        let currentList = [...toList];

                                                        currentList.splice(index, 1);

                                                        setToList(currentList);
                                                    }} />
                                                }


                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className='email-recipient-cc-container' style={{
                        width: '100%'
                    }}>
                        <SelectBox
                            placeholder="Cc"
                            popupId="input-cc"
                            tabIndex={props.tabTimesFrom + props.tabTimes + 1}
                            boxStyle={{
                                width: '100%',
                            }}
                            inputStyle={{
                                textTransform: 'lowercase'
                            }}
                            popupStyle={{
                                left: '-20%',
                                width: 400
                            }}
                            refs={{
                                refInput: refCcInput,
                                refPopupItems: refCcInputPopupItems,
                                refDropdown: refCcInputDropDown,
                            }}
                            noStopPropagationOnEsc={true}
                            readOnly={isLoading}
                            isDropdownEnabled={true}
                            avoidCheckItemsOnTab={true}
                            popupPosition="vertical below"
                            onEnter={async e => {
                                let email = '';
                                let name = '';

                                if (ccInputItems.length > 0 && ccInputItems.findIndex(item => item.selected) > -1) {
                                    let item = ccInputItems[ccInputItems.findIndex(item => item.selected)];

                                    email = item.email;
                                    name = item.full_name;
                                } else {
                                    email = ccInput;
                                    name = (contacts || []).find(x => x.email === email)?.full_name || '';
                                }


                                if (isEmailValid(email)) {
                                    let exist = false;

                                    (ccList || []).map(item => {
                                        if ((item.email || '') === email) {
                                            exist = true;
                                        }
                                        return true;
                                    })

                                    if (exist) {
                                        window.alert('E-mail address is already in the list');
                                        setCcInputItems([]);
                                        refCcInput.current.focus();
                                    } else {
                                        setCcList(prev => {
                                            return [
                                                ...prev,
                                                {
                                                    name: name,
                                                    email: email
                                                }
                                            ]
                                        });

                                        setCcInput('');
                                        setCcInputItems([]);
                                        refCcInput.current.focus();
                                    }

                                } else {
                                    window.alert('Invalid e-mail address!');
                                    setCcInputItems([]);
                                    refCcInput.current.focus();
                                    return;
                                }

                                setContacts([...contacts.map(item => {
                                    item.selected = false;
                                    return item;
                                })])
                            }}
                            onTab={async e => {
                                if (ccInput.trim() !== '' || ccInputItems.length > 0) {
                                    e.preventDefault();

                                    let email = '';
                                    let name = '';

                                    if (ccInputItems.length > 0 && ccInputItems.findIndex(item => item.selected) > -1) {
                                        let item = ccInputItems[ccInputItems.findIndex(item => item.selected)];

                                        email = item.email;
                                        name = item.full_name;

                                    } else {
                                        email = ccInput;
                                        name = (contacts || []).find(x => x.email === email)?.full_name || '';
                                    }


                                    if (isEmailValid(email)) {
                                        let exist = false;

                                        (ccList || []).map(item => {
                                            if ((item.email || '') === email) {
                                                exist = true;
                                            }
                                            return true;
                                        })

                                        if (exist) {
                                            window.alert('E-mail address is already in the list');
                                            setCcInputItems([]);
                                            refCcInput.current.focus();
                                        } else {
                                            setCcList(prev => {
                                                return [
                                                    ...prev,
                                                    {
                                                        name: name,
                                                        email: email
                                                    }
                                                ]
                                            });

                                            setCcInput('');
                                            setCcInputItems([]);
                                            refCcInput.current.focus();
                                        }

                                    } else {
                                        window.alert('Invalid e-mail address!');
                                        setCcInputItems([]);
                                        refCcInput.current.focus();
                                        return;
                                    }

                                    setContacts([...contacts.map(item => {
                                        item.selected = false;
                                        return item;
                                    })])
                                }
                            }}
                            onBlur={e => { }}
                            onInput={e => {
                                setCcInput(e.target.value);

                                if (e.target.value.trim() === "") {
                                    setCcInputItems([]);
                                } else {
                                    let _contacts = (contacts || []).filter(x =>
                                        (x.email || '').toLowerCase().includes(e.target.value.trim().toLowerCase()) ||
                                        (x.name || '').toLowerCase().includes(e.target.value.trim().toLowerCase())).map((item, index) => {
                                            item.selected = index === 0;
                                            return item;
                                        });

                                    setCcInputItems([..._contacts]);
                                }
                            }}
                            onChange={e => {
                                setCcInput(e.target.value);
                            }}
                            value={ccInput || ""}
                            items={ccInputItems}
                            getItems={() => {
                                let _contacts = (contacts || []).filter(x =>
                                    (x.email || '').toLowerCase().includes((ccInput || '').trim().toLowerCase()) ||
                                    (x.name || '').toLowerCase().includes((ccInput || '').trim().toLowerCase())).map((item, index) => {
                                        item.selected = index === 0;
                                        return item;
                                    });

                                setCcInputItems([..._contacts]);


                                refCcInputPopupItems.current.map((r, i) => {
                                    if (r && r.classList.contains("selected")) {
                                        r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                        });
                                    }
                                    return true;
                                });
                            }}
                            setItems={setCcInputItems}
                            onDropdownClick={e => {
                                let _contacts = (contacts || []).filter(x =>
                                    (x.email || '').toLowerCase().includes((ccInput || '').trim().toLowerCase()) ||
                                    (x.name || '').toLowerCase().includes((ccInput || '').trim().toLowerCase())).map((item, index) => {
                                        item.selected = index === 0;
                                        return item;
                                    });

                                setCcInputItems([..._contacts]);


                                refCcInputPopupItems.current.map((r, i) => {
                                    if (r && r.classList.contains("selected")) {
                                        r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                        });
                                    }
                                    return true;
                                });
                            }}
                            onPopupClick={item => {
                                setCcList(prev => {
                                    return [
                                        ...prev,
                                        {
                                            name: item.full_name,
                                            email: item.email
                                        }
                                    ]
                                });

                                setCcInput('');
                                setCcInputItems([]);
                                refCcInput.current.focus();
                            }}
                            labelType={'default'}
                        />

                        <div style={{
                            padding: '0 10px',
                            fontSize: '0.7rem',
                            marginTop: 5,
                            color: 'gray'
                        }}>
                            Count: <span style={{ fontWeight: 'bold', color: 'darkred', marginLeft: 2 }}>{ccList.length}</span>
                        </div>

                        <div className='cc-list-Container' style={{
                            width: '100%',
                            minHeight: '100px',
                            maxHeight: '100px',
                            position: 'relative',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: 10,
                            marginBottom: 10,
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            overflow: 'hidden'
                        }}>
                            <div className="cc-list-wrapper" style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                overflowY: 'auto',
                                borderRadius: 10,
                                fontSize: '0.75rem',
                                padding: 5,
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignContent: 'flex-start',
                                pointerEvents: isLoading ? 'none' : 'all'
                            }}>
                                {
                                    (ccList || []).map((item, index) => {
                                        return (
                                            <div key={index} className={classnames({
                                                'email-item': true,
                                                'primary': (item.primary || false)
                                            })} style={{
                                                backgroundColor: 'rgba(0,0,0,0.05)',
                                                padding: '1px 5px',
                                                borderRadius: 7,
                                                cursor: 'default',
                                                marginRight: (ccList.length - 1) > index ? '10px' : 0,
                                                fontWeight: 'bold',
                                                position: 'relative',
                                                marginBottom: 5
                                            }} title={(item.name || '').trim() !== '' ? item.email : ''}>
                                                {(item.name || '').trim() !== '' ? item.name : item.email}

                                                {
                                                    !(item.primary || false) &&
                                                    <FontAwesomeIcon className='delete-email-button' icon={faTrashAlt} size={5} style={{
                                                        position: 'absolute',
                                                        fontSize: '0.55rem',
                                                        color: 'red',
                                                        top: '50%',
                                                        right: -4,
                                                        transform: 'translateY(-50%)',
                                                        display: 'none',
                                                        cursor: 'pointer'
                                                    }} onClick={() => {
                                                        let currentList = [...ccList];

                                                        currentList.splice(index, 1);

                                                        setCcList(currentList);
                                                    }} />
                                                }


                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className='email-recipient-bcc-container' style={{
                        width: '100%'
                    }}>
                        <SelectBox
                            placeholder="Bcc"
                            popupId="input-bcc"
                            tabIndex={props.tabTimesFrom + props.tabTimes + 1}
                            boxStyle={{
                                width: '100%',
                            }}
                            inputStyle={{
                                textTransform: 'lowercase'
                            }}
                            popupStyle={{
                                left: '-20%',
                                width: 400
                            }}
                            refs={{
                                refInput: refBccInput,
                                refPopupItems: refBccInputPopupItems,
                                refDropdown: refBccInputDropDown,
                            }}
                            noStopPropagationOnEsc={true}
                            readOnly={isLoading}
                            isDropdownEnabled={true}
                            avoidCheckItemsOnTab={true}
                            popupPosition="vertical below"
                            onEnter={async e => {
                                let email = '';
                                let name = '';

                                if (bccInputItems.length > 0 && bccInputItems.findIndex(item => item.selected) > -1) {
                                    let item = bccInputItems[bccInputItems.findIndex(item => item.selected)];

                                    email = item.email;
                                    name = item.full_name;
                                } else {
                                    email = bccInput;
                                    name = (contacts || []).find(x => x.email === email)?.full_name || '';
                                }


                                if (isEmailValid(email)) {
                                    let exist = false;

                                    (bccList || []).map(item => {
                                        if ((item.email || '') === email) {
                                            exist = true;
                                        }
                                        return true;
                                    })

                                    if (exist) {
                                        window.alert('E-mail address is already in the list');
                                        setBccInputItems([]);
                                        refBccInput.current.focus();
                                    } else {
                                        setBccList(prev => {
                                            return [
                                                ...prev,
                                                {
                                                    name: name,
                                                    email: email
                                                }
                                            ]
                                        });

                                        setBccInput('');
                                        setBccInputItems([]);
                                        refBccInput.current.focus();
                                    }

                                } else {
                                    window.alert('Invalid e-mail address!');
                                    setBccInputItems([]);
                                    refBccInput.current.focus();
                                    return;
                                }

                                setContacts([...contacts.map(item => {
                                    item.selected = false;
                                    return item;
                                })])
                            }}
                            onTab={async e => {
                                if (bccInput.trim() !== '' || bccInputItems.length > 0) {
                                    e.preventDefault();

                                    let email = '';
                                    let name = '';

                                    if (bccInputItems.length > 0 && bccInputItems.findIndex(item => item.selected) > -1) {
                                        let item = bccInputItems[bccInputItems.findIndex(item => item.selected)];

                                        email = item.email;
                                        name = item.full_name;

                                    } else {
                                        email = bccInput;
                                        name = (contacts || []).find(x => x.email === email)?.full_name || '';
                                    }


                                    if (isEmailValid(email)) {
                                        let exist = false;

                                        (bccList || []).map(item => {
                                            if ((item.email || '') === email) {
                                                exist = true;
                                            }
                                            return true;
                                        })

                                        if (exist) {
                                            window.alert('E-mail address is already in the list');
                                            setBccInputItems([]);
                                            refBccInput.current.focus();
                                        } else {
                                            setBccList(prev => {
                                                return [
                                                    ...prev,
                                                    {
                                                        name: name,
                                                        email: email
                                                    }
                                                ]
                                            });

                                            setBccInput('');
                                            setBccInputItems([]);
                                            refBccInput.current.focus();
                                        }

                                    } else {
                                        window.alert('Invalid e-mail address!');
                                        setBccInputItems([]);
                                        refBccInput.current.focus();
                                        return;
                                    }

                                    setContacts([...contacts.map(item => {
                                        item.selected = false;
                                        return item;
                                    })])
                                }
                            }}
                            onBlur={e => { }}
                            onInput={e => {
                                setBccInput(e.target.value);

                                if (e.target.value.trim() === "") {
                                    setBccInputItems([]);
                                } else {
                                    let _contacts = (contacts || []).filter(x =>
                                        (x.email || '').toLowerCase().includes(e.target.value.trim().toLowerCase()) ||
                                        (x.name || '').toLowerCase().includes(e.target.value.trim().toLowerCase())).map((item, index) => {
                                            item.selected = index === 0;
                                            return item;
                                        });

                                    setBccInputItems([..._contacts]);
                                }
                            }}
                            onChange={e => {
                                setBccInput(e.target.value);
                            }}
                            value={bccInput || ""}
                            items={bccInputItems}
                            getItems={() => {
                                let _contacts = (contacts || []).filter(x =>
                                    (x.email || '').toLowerCase().includes((bccInput || '').trim().toLowerCase()) ||
                                    (x.name || '').toLowerCase().includes((bccInput || '').trim().toLowerCase())).map((item, index) => {
                                        item.selected = index === 0;
                                        return item;
                                    });

                                setBccInputItems([..._contacts]);

                                refBccInputPopupItems.current.map((r, i) => {
                                    if (r && r.classList.contains("selected")) {
                                        r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                        });
                                    }
                                    return true;
                                });
                            }}
                            setItems={setBccInputItems}
                            onDropdownClick={e => {
                                let _contacts = (contacts || []).filter(x =>
                                    (x.email || '').toLowerCase().includes((bccInput || '').trim().toLowerCase()) ||
                                    (x.name || '').toLowerCase().includes((bccInput || '').trim().toLowerCase())).map((item, index) => {
                                        item.selected = index === 0;
                                        return item;
                                    });

                                setBccInputItems([..._contacts]);

                                refBccInputPopupItems.current.map((r, i) => {
                                    if (r && r.classList.contains("selected")) {
                                        r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                        });
                                    }
                                    return true;
                                });
                            }}
                            onPopupClick={item => {
                                setBccList(prev => {
                                    return [
                                        ...prev,
                                        {
                                            name: item.full_name,
                                            email: item.email
                                        }
                                    ]
                                });

                                setBccInput('');
                                setBccInputItems([]);
                                refBccInput.current.focus();
                            }}
                            labelType={'default'}
                        />

                        <div style={{
                            padding: '0 10px',
                            fontSize: '0.7rem',
                            marginTop: 5,
                            color: 'gray'
                        }}>
                            Count: <span style={{ fontWeight: 'bold', color: 'darkred', marginLeft: 2 }}>{bccList.length}</span>
                        </div>

                        <div className='bcc-list-Container' style={{
                            width: '100%',
                            minHeight: '100px',
                            maxHeight: '100px',
                            position: 'relative',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: 10,
                            marginBottom: 10,
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            overflow: 'hidden'
                        }}>
                            <div className="bcc-list-wrapper" style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                overflowY: 'auto',
                                borderRadius: 10,
                                fontSize: '0.75rem',
                                padding: 5,
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignContent: 'flex-start',
                                pointerEvents: isLoading ? 'none' : 'all'
                            }}>
                                {
                                    (bccList || []).map((item, index) => {
                                        return (
                                            <div key={index} className={classnames({
                                                'email-item': true,
                                                'primary': (item.primary || false)
                                            })} style={{
                                                backgroundColor: 'rgba(0,0,0,0.05)',
                                                padding: '1px 5px',
                                                borderRadius: 7,
                                                cursor: 'default',
                                                marginRight: (bccList.length - 1) > index ? '10px' : 0,
                                                fontWeight: 'bold',
                                                position: 'relative',
                                                marginBottom: 5
                                            }} title={(item.name || '').trim() !== '' ? item.email : ''}>
                                                {(item.name || '').trim() !== '' ? item.name : item.email}

                                                {
                                                    !(item.primary || false) &&
                                                    <FontAwesomeIcon className='delete-email-button' icon={faTrashAlt} size={5} style={{
                                                        position: 'absolute',
                                                        fontSize: '0.55rem',
                                                        color: 'red',
                                                        top: '50%',
                                                        right: -4,
                                                        transform: 'translateY(-50%)',
                                                        display: 'none',
                                                        cursor: 'pointer'
                                                    }} onClick={() => {
                                                        let currentList = [...bccList];

                                                        currentList.splice(index, 1);

                                                        setBccList(currentList);
                                                    }} />
                                                }


                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className="modal-buttons" style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 5
                    }}>
                        <div className={classnames({
                            'mochi-button': true,
                            'disabled': isLoading
                        })} onClick={() => { props.close() }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Close</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>

                        {
                            isLoading
                                ? <div><Loader type="Circles" color="#009bdd" height={20} width={20} visible={true} /></div>
                                : <div style={{
                                    color: messageType === 'ERROR' ? 'darkred' : messageType === 'WARNING' ? 'yellow' : messageType === 'SUCCESS' ? 'green' : 'darkred',
                                    fontWeight: 'bold'
                                }}>
                                    {
                                        mailMessage || ''
                                    }
                                </div>
                        }

                        <div className={classnames({
                            'mochi-button': true,
                            'disabled': isLoading
                        })} onClick={() => {
                            if (toList.length === 0) {
                                window.alert('TO list must not be empty!');
                                refToInput.current.focus();
                                return;
                            }

                            setMailMessage('');
                            setIsLoading(true);

                            axios.post(props.serverUrl + props.sendingUrl, {
                                ...props.dataEmail,
                                recipient_to: [...toList],
                                recipient_cc: [...ccList],
                                recipient_bcc: [...bccList]
                            }).then(res => {
                                if (res.data.result === 'SENT') {
                                    setMessageType('SUCCESS');
                                    setMailMessage(props.successMessage || '');
                                } else if (res.data.result === 'NO EMAIL ADDRESS') {
                                    setMessageType('WARNING');
                                    setMailMessage("There was an error with the recipient email address");
                                } else {
                                    setMessageType('ERROR');
                                    setMailMessage(`There was an error sending the email to the ${(props.dataEmail?.type || 'carrier')}`);
                                }
                            }).catch(e => {
                                console.log(e);
                            }).finally(() => {
                                setIsLoading(false);
                                window.setTimeout(() => {
                                    props.close();
                                }, 1000);
                            });
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Send</div>
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

export default connect(mapStateToProps, null)(EmailRecipientInput)