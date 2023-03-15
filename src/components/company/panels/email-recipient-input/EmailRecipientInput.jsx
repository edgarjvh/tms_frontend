import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './EmailRecipientInput.css';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner';
import axios from 'axios';

const EmailRecipientInput = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [toList, setToList] = useState([]);
    const [ccList, setCcList] = useState([]);
    const [bccList, setBccList] = useState([]);
    const [mailMessage, setMailMessage] = useState('');
    const [messageType, setMessageType] = useState('SUCCESS');

    const [toInput, setToInput] = useState('');
    const [ccInput, setCcInput] = useState('');
    const [bccInput, setBccInput] = useState('');

    const refToInput = useRef();
    const refCcInput = useRef();
    const refBccInput = useRef();

    useEffect(() => {
        setToList(props.dataEmail?.recipient_to || []);

        refToInput.current.focus({
            preventScroll: true
        });
    }, []);

    const isEmailValid = (email) => {
        let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return email.match(mailformat);
    }

    return (
        <div className="email-recipient-input" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 2
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
                    }}>{props.dataEmail.title || 'E-Mail Carrier Confirmation'}</div>

                    {/* BODY */}

                    <div className='email-recipient-to-container' style={{
                        width: '100%'
                    }}>
                        <div className="input-box-container">
                            <input
                                readOnly={isLoading}
                                ref={refToInput}
                                type="text"
                                placeholder="To"
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 13) {
                                        if (e.target.value.trim() !== '') {
                                            if (isEmailValid(e.target.value.trim())) {
                                                let exist = false;

                                                (toList || []).map(item => {

                                                    if ((item.email || '') === e.target.value.trim()) {
                                                        exist = true;
                                                    }

                                                    return true;
                                                })

                                                if (exist) {
                                                    window.alert('E-mail address is already in the list');
                                                    refToInput.current.focus();
                                                } else {
                                                    setToList(prev => {
                                                        return [
                                                            ...prev,
                                                            {
                                                                name: '',
                                                                email: e.target.value.trim()
                                                            }
                                                        ]
                                                    });

                                                    setToInput('');
                                                    refToInput.current.focus();
                                                }

                                            } else {
                                                window.alert('Invalid e-mail address!');
                                                refToInput.current.focus();
                                                return;
                                            }
                                        }
                                    }

                                    if (key === 9) {
                                        if (e.target.value.trim() !== '') {
                                            e.preventDefault();

                                            if (isEmailValid(e.target.value.trim())) {
                                                let exist = false;

                                                (toList || []).map(item => {

                                                    if ((item.email || '') === e.target.value.trim()) {
                                                        exist = true;
                                                    }

                                                    return true;
                                                })

                                                if (exist) {
                                                    window.alert('E-mail address is already in the list');
                                                    refToInput.current.focus();
                                                } else {
                                                    setToList(prev => {
                                                        return [
                                                            ...prev,
                                                            {
                                                                name: '',
                                                                email: e.target.value.trim()
                                                            }
                                                        ]
                                                    });

                                                    setToInput('');
                                                    refToInput.current.focus();
                                                }

                                            } else {
                                                window.alert('Invalid e-mail address!');
                                                refToInput.current.focus();
                                                return;
                                            }
                                        }
                                    }
                                }}
                                onChange={(e) => {
                                    setToInput(e.target.value);
                                }}
                                value={toInput || ''}
                            />
                        </div>

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
                        <div className="input-box-container">
                            <input
                                readOnly={isLoading}
                                ref={refCcInput}
                                type="text"
                                placeholder="Cc"
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 13) {
                                        if (e.target.value.trim() !== '') {
                                            if (isEmailValid(e.target.value.trim())) {
                                                let exist = false;

                                                (ccList || []).map(item => {

                                                    if ((item.email || '') === e.target.value.trim()) {
                                                        exist = true;
                                                    }

                                                    return true;
                                                })

                                                if (exist) {
                                                    window.alert('E-mail address is already in the list');
                                                    refCcInput.current.focus();
                                                } else {
                                                    setCcList(prev => {
                                                        return [
                                                            ...prev,
                                                            {
                                                                name: '',
                                                                email: e.target.value.trim()
                                                            }
                                                        ]
                                                    });

                                                    setCcInput('');
                                                    refCcInput.current.focus();
                                                }

                                            } else {
                                                window.alert('Invalid e-mail address!');
                                                refCcInput.current.focus();
                                                return;
                                            }
                                        }
                                    }

                                    if (key === 9) {
                                        if (e.target.value.trim() !== '') {
                                            e.preventDefault();

                                            if (isEmailValid(e.target.value.trim())) {
                                                let exist = false;

                                                (ccList || []).map(item => {

                                                    if ((item.email || '') === e.target.value.trim()) {
                                                        exist = true;
                                                    }

                                                    return true;
                                                })

                                                if (exist) {
                                                    window.alert('E-mail address is already in the list');
                                                    refCcInput.current.focus();
                                                } else {
                                                    setCcList(prev => {
                                                        return [
                                                            ...prev,
                                                            {
                                                                name: '',
                                                                email: e.target.value.trim()
                                                            }
                                                        ]
                                                    });

                                                    setCcInput('');
                                                    refCcInput.current.focus();
                                                }

                                            } else {
                                                window.alert('Invalid e-mail address!');
                                                refCcInput.current.focus();
                                                return;
                                            }
                                        }
                                    }
                                }}
                                onChange={(e) => {
                                    setCcInput(e.target.value);
                                }}
                                value={ccInput || ''} />
                        </div>

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
                        <div className="input-box-container">
                            <input
                                readOnly={isLoading}
                                ref={refBccInput}
                                type="text"
                                placeholder="Bcc"
                                onKeyDown={(e) => {
                                    let key = e.keyCode || e.which;

                                    if (key === 13) {
                                        if (e.target.value.trim() !== '') {
                                            if (isEmailValid(e.target.value.trim())) {
                                                let exist = false;

                                                (bccList || []).map(item => {

                                                    if ((item.email || '') === e.target.value.trim()) {
                                                        exist = true;
                                                    }

                                                    return true;
                                                })

                                                if (exist) {
                                                    window.alert('E-mail address is already in the list');
                                                    refBccInput.current.focus();
                                                } else {
                                                    setBccList(prev => {
                                                        return [
                                                            ...prev,
                                                            {
                                                                name: '',
                                                                email: e.target.value.trim()
                                                            }
                                                        ]
                                                    });

                                                    setBccInput('');
                                                    refBccInput.current.focus();
                                                }

                                            } else {
                                                window.alert('Invalid e-mail address!');
                                                refBccInput.current.focus();
                                                return;
                                            }
                                        }
                                    }

                                    if (key === 9) {
                                        if (e.target.value.trim() !== '') {
                                            e.preventDefault();

                                            if (isEmailValid(e.target.value.trim())) {
                                                let exist = false;

                                                (bccList || []).map(item => {

                                                    if ((item.email || '') === e.target.value.trim()) {
                                                        exist = true;
                                                    }

                                                    return true;
                                                })

                                                if (exist) {
                                                    window.alert('E-mail address is already in the list');
                                                    refBccInput.current.focus();
                                                } else {
                                                    setBccList(prev => {
                                                        return [
                                                            ...prev,
                                                            {
                                                                name: '',
                                                                email: e.target.value.trim()
                                                            }
                                                        ]
                                                    });

                                                    setBccInput('');
                                                    refBccInput.current.focus();
                                                }

                                            } else {
                                                window.alert('Invalid e-mail address!');
                                                refBccInput.current.focus();
                                                return;
                                            }
                                        }
                                    }
                                }}
                                onChange={(e) => {
                                    setBccInput(e.target.value);
                                }}
                                value={bccInput || ''} />
                        </div>

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

                            if (window.confirm('Are you sure you want to proceed?')) {
                                setMailMessage('');
                                setIsLoading(true);

                                axios.post(props.serverUrl + '/sendRateConfEmail', {
                                    ...props.dataEmail,
                                    recipient_to: [...toList],
                                    recipient_cc: [...ccList],
                                    recipient_bcc: [...bccList]    
                                }).then(res => {
                                    if (res.data.result === 'SENT') {
                                        setMessageType('SUCCESS');
                                        setMailMessage(`${(props.dataEmail?.type || 'carrier') === 'carrier' ? 'Carrier' : 'Customer'} Rate Conf has been sent!`);                                        
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
                                });
                            }
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